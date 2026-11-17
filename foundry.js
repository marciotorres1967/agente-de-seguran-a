/**
 * Conexão com o agente do Microsoft Foundry
 * PORTAL SST BRASIL
 *
 * Roda SÓ no servidor (Node). As credenciais nunca vão para o navegador.
 *
 * Suporta os dois tipos de agente do Foundry:
 *  - Agente "novo" (identificado por NOME, ex.: "assistente-sst")  -> API Responses
 *  - Agente "clássico" (identificado por ID, ex.: "asst_abc123...") -> API Threads/Runs
 *
 * Autenticação (Microsoft Entra ID), em ordem de prioridade:
 *  1. Service principal: AZURE_TENANT_ID + AZURE_CLIENT_ID + AZURE_CLIENT_SECRET
 *  2. Azure CLI: basta ter rodado "az login" no computador
 */

const { exec } = require("child_process");

const TOKEN_SCOPE = "https://ai.azure.com/.default";
const TOKEN_RESOURCE = "https://ai.azure.com";

function cfg() {
  const endpoint = (process.env.FOUNDRY_PROJECT_ENDPOINT || "").trim().replace(/\/+$/, "");
  const agent = (process.env.FOUNDRY_AGENT || "").trim();
  return {
    endpoint,
    agent,
    agentVersion: (process.env.FOUNDRY_AGENT_VERSION || "").trim(),
    apiVersion: (process.env.FOUNDRY_API_VERSION || "").trim(),
    classicApiVersion: (process.env.FOUNDRY_CLASSIC_API_VERSION || "v1").trim(),
    mode: agent.startsWith("asst_") ? "classic" : "responses"
  };
}

function isConfigured() {
  const c = cfg();
  return Boolean(c.endpoint && c.agent);
}

/* ---------------------------------------------------------------------------
   TOKEN (Entra ID) com cache
--------------------------------------------------------------------------- */
let cachedToken = null; // { token, expiresAt }

async function getToken() {
  if (cachedToken && cachedToken.expiresAt - Date.now() > 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const { AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env;

  if (AZURE_TENANT_ID && AZURE_CLIENT_ID && AZURE_CLIENT_SECRET) {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AZURE_CLIENT_ID,
      client_secret: AZURE_CLIENT_SECRET,
      scope: TOKEN_SCOPE
    });
    const r = await fetch(`https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.access_token) {
      throw new FoundryError(
        "Falha ao autenticar com o service principal (confira AZURE_TENANT_ID, AZURE_CLIENT_ID e AZURE_CLIENT_SECRET).",
        data.error_description || data.error
      );
    }
    cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 };
    return cachedToken.token;
  }

  // Azure CLI (az login)
  const out = await new Promise((resolve, reject) => {
    exec(
      `az account get-access-token --resource ${TOKEN_RESOURCE} --output json`,
      { timeout: 30000, windowsHide: true },
      (err, stdout, stderr) => {
        if (err) {
          const msg = String(stderr || err.message || "");
          if (/not recognized|not found|ENOENT/i.test(msg)) {
            reject(new FoundryError("Azure CLI não encontrada. Instale a Azure CLI e rode \"az login\".", msg));
          } else {
            reject(new FoundryError("Não foi possível obter o token. Rode \"az login\" no terminal e tente de novo.", msg));
          }
          return;
        }
        resolve(stdout);
      }
    );
  });

  let data;
  try {
    data = JSON.parse(out);
  } catch {
    throw new FoundryError("Resposta inesperada da Azure CLI ao pedir o token.");
  }
  const expiresAt = data.expires_on ? Number(data.expires_on) * 1000 : Date.parse(data.expiresOn) || Date.now() + 30 * 60 * 1000;
  cachedToken = { token: data.accessToken, expiresAt };
  return cachedToken.token;
}

class FoundryError extends Error {
  constructor(message, detail, status) {
    super(message);
    this.detail = detail;
    this.status = status;
  }
}

async function callFoundry(url, method, body) {
  const token = await getToken();
  const r = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await r.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!r.ok) {
    const detail = (data && data.error && (data.error.message || data.error.code)) || text.slice(0, 500);
    let msg = `O Foundry respondeu com erro ${r.status}.`;
    if (r.status === 401) msg = "Token recusado (401). Rode \"az login\" de novo ou confira o service principal.";
    if (r.status === 403) msg = "Sem permissão no projeto (403). Sua conta precisa do papel \"Azure AI User\" no projeto do Foundry.";
    if (r.status === 404) msg = "Não encontrado (404). Confira o endpoint do projeto e o nome/ID do agente.";
    if (r.status === 401) cachedToken = null;
    throw new FoundryError(msg, detail, r.status);
  }
  return data;
}

function withVersion(url, version) {
  if (!version) return url;
  return url + (url.includes("?") ? "&" : "?") + "api-version=" + encodeURIComponent(version);
}

/* ---------------------------------------------------------------------------
   AGENTE NOVO — API Responses (agent_reference)
--------------------------------------------------------------------------- */
// O nome do campo mudou entre versões da API ("agent" e "agent_reference").
// Tentamos um e, se o Foundry recusar, usamos o outro e lembramos qual funcionou.
let agentFieldName = null;

async function askResponses(question, previousResponseId) {
  const c = cfg();
  const url = withVersion(`${c.endpoint}/openai/v1/responses`, c.apiVersion);
  const ref = { type: "agent_reference", name: c.agent };
  if (c.agentVersion) ref.version = c.agentVersion;

  const buildBody = (field, prevId) => {
    const b = { input: question, [field]: ref };
    if (prevId) b.previous_response_id = prevId;
    return b;
  };

  const fields = agentFieldName ? [agentFieldName] : ["agent_reference", "agent"];
  let lastErr;

  for (const field of fields) {
    for (const prevId of previousResponseId ? [previousResponseId, null] : [null]) {
      try {
        const data = await callFoundry(url, "POST", buildBody(field, prevId));
        agentFieldName = field;
        return {
          text: extractResponsesText(data),
          conversation: { previousResponseId: data.id || null }
        };
      } catch (e) {
        lastErr = e;
        // Só vale tentar outra combinação em erro 400 (corpo da requisição recusado)
        if (e.status !== 400) throw e;
      }
    }
  }
  throw lastErr;
}

function extractResponsesText(data) {
  if (typeof data.output_text === "string" && data.output_text) return data.output_text;
  const parts = [];
  for (const item of data.output || []) {
    if (item.type !== "message") continue;
    for (const c of item.content || []) {
      if ((c.type === "output_text" || c.type === "text") && c.text) {
        parts.push(typeof c.text === "string" ? c.text : c.text.value || "");
      }
    }
  }
  return parts.join("\n\n").trim();
}

/* ---------------------------------------------------------------------------
   AGENTE CLÁSSICO — API Threads / Runs (asst_...)
--------------------------------------------------------------------------- */
async function askClassic(question, threadId) {
  const c = cfg();
  const v = c.classicApiVersion;
  const base = c.endpoint;
  let run;

  if (threadId) {
    try {
      await callFoundry(withVersion(`${base}/threads/${threadId}/messages`, v), "POST", {
        role: "user",
        content: question
      });
      run = await callFoundry(withVersion(`${base}/threads/${threadId}/runs`, v), "POST", {
        assistant_id: c.agent
      });
    } catch (e) {
      if (e.status !== 404) throw e;
      threadId = null; // conversa expirou/apagada: começa outra
    }
  }

  if (!threadId) {
    run = await callFoundry(withVersion(`${base}/threads/runs`, v), "POST", {
      assistant_id: c.agent,
      thread: { messages: [{ role: "user", content: question }] }
    });
    threadId = run.thread_id;
  }

  const started = Date.now();
  while (["queued", "in_progress", "requires_action"].includes(run.status)) {
    if (Date.now() - started > 120000) throw new FoundryError("O agente demorou demais para responder (mais de 2 minutos).");
    await new Promise(r => setTimeout(r, 1000));
    run = await callFoundry(withVersion(`${base}/threads/${threadId}/runs/${run.id}`, v), "GET");
  }

  if (run.status !== "completed") {
    const detail = run.last_error && (run.last_error.message || run.last_error.code);
    throw new FoundryError(`A execução do agente terminou com status "${run.status}".`, detail);
  }

  const msgs = await callFoundry(
    withVersion(`${base}/threads/${threadId}/messages`, v) + "&order=desc&limit=10",
    "GET"
  );
  const reply = (msgs.data || []).find(m => m.role === "assistant" && m.run_id === run.id) ||
    (msgs.data || []).find(m => m.role === "assistant");

  const text = reply
    ? (reply.content || [])
        .filter(p => p.type === "text")
        .map(p => (p.text && p.text.value) || "")
        .join("\n\n")
        .trim()
    : "";

  return { text, conversation: { threadId } };
}

/* ---------------------------------------------------------------------------
   API PÚBLICA DO MÓDULO
--------------------------------------------------------------------------- */
async function ask(question, conversation = {}) {
  if (!isConfigured()) {
    throw new FoundryError("Agente do Foundry não configurado. Preencha o arquivo .env (veja o .env.example).");
  }
  const c = cfg();
  const result = c.mode === "classic"
    ? await askClassic(question, conversation.threadId)
    : await askResponses(question, conversation.previousResponseId);

  if (!result.text) {
    result.text = "O agente não retornou texto para essa pergunta.";
  }
  return result;
}

function status() {
  const c = cfg();
  return {
    configured: isConfigured(),
    mode: c.mode,
    agent: c.agent || null,
    auth: process.env.AZURE_CLIENT_SECRET ? "service-principal" : "azure-cli"
  };
}

module.exports = { ask, status, isConfigured, FoundryError };
