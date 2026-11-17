const http = require('http');
const fs = require('fs');
const path = require('path');

/* --------------------------------------------------------------------------
   Carrega o arquivo .env (sem dependências externas)
-------------------------------------------------------------------------- */
(function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let value = m[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
})();

const foundry = require('./foundry');

const PORT = process.env.PORT || 3000;

// Arquivos que NUNCA podem ser servidos para o navegador
const BLOCKED_FILES = new Set(['server.js', 'foundry.js', 'package.json', 'package-lock.json']);

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

function readJsonBody(req, limit = 100 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > limit) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(new Error('bad_json')); }
    });
    req.on('error', reject);
  });
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/status' && req.method === 'GET') {
    return sendJson(res, 200, foundry.status());
  }

  if (pathname === '/api/chat' && req.method === 'POST') {
    let body;
    try { body = await readJsonBody(req); }
    catch { return sendJson(res, 400, { error: 'Requisição inválida.' }); }

    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (!question) return sendJson(res, 400, { error: 'Pergunta vazia.' });
    if (question.length > 4000) return sendJson(res, 400, { error: 'Pergunta muito longa (máx. 4000 caracteres).' });

    const conversation = body.conversation && typeof body.conversation === 'object' ? body.conversation : {};
    try {
      const result = await foundry.ask(question, {
        previousResponseId: typeof conversation.previousResponseId === 'string' ? conversation.previousResponseId : null,
        threadId: typeof conversation.threadId === 'string' ? conversation.threadId : null
      });
      return sendJson(res, 200, result);
    } catch (e) {
      console.error('[Foundry] ' + e.message + (e.detail ? '\n   Detalhe: ' + e.detail : ''));
      return sendJson(res, 502, { error: e.message || 'Erro ao falar com o agente.', detail: e.detail || null });
    }
  }

  return sendJson(res, 404, { error: 'Rota não encontrada.' });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  // Normalize URL by removing query strings
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    handleApi(req, res, pathname);
    return;
  }

  // Bloqueia .env, arquivos ocultos e arquivos do servidor
  const baseName = path.basename(pathname);
  if (baseName.startsWith('.') || BLOCKED_FILES.has(baseName) || pathname.includes('/.')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Proibido: Acesso negado');
    return;
  }

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);

  // Security check: ensure filePath is within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Proibido: Acesso negado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA client-side routes
      const indexPath = path.join(__dirname, 'index.html');
      fs.readFile(indexPath, (indexErr, indexData) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Arquivo não encontrado');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(indexData);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Erro no servidor: ${readErr.code}`);
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO  `);
  console.log(`====================================================`);
  console.log(`Servidor ativo e pronto para acesso em:`);
  console.log(`  -> http://localhost:${PORT}`);
  const st = foundry.status();
  if (st.configured) {
    console.log(`Agente Foundry: ${st.agent} (modo ${st.mode === 'classic' ? 'clássico' : 'novo'}, login via ${st.auth === 'azure-cli' ? 'Azure CLI' : 'service principal'})`);
  } else {
    console.log(`Agente Foundry: NÃO configurado — o chat usa a base local. Veja o .env.example.`);
  }
  console.log(`Pressione Ctrl+C para encerrar.`);
});
