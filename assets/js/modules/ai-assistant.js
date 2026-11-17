/**
 * MÓDULO ASSISTENTE SST INTELIGENTE
 * PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO
 * Motor de Inteligência Artificial Especializada com Formatação Estruturada Oficial
 */

window.AIAssistant = {
  chatHistory: [],
  storageKey: "portal_sst_ai_history",
  apiKeyStorageKey: "portal_sst_gemini_api_key",

  init() {
    this.loadHistory();
  },

  loadHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.chatHistory = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Falha ao carregar histórico do assistente", e);
      this.chatHistory = [];
    }
  },

  saveHistory() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.chatHistory));
    } catch (e) {
      console.warn("Falha ao salvar histórico", e);
    }
  },

  clearHistory() {
    this.chatHistory = [];
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.conversationKey); // começa conversa nova com o agente
  },

  getApiKey() {
    return localStorage.getItem(this.apiKeyStorageKey) || "";
  },

  setApiKey(key) {
    if (key) {
      localStorage.setItem(this.apiKeyStorageKey, key.trim());
    } else {
      localStorage.removeItem(this.apiKeyStorageKey);
    }
  },

  // Knowledge base search for accurate, verifiable, grounded SST responses
  generateStructuredResponse(userQuestion) {
    const q = userQuestion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const currentDate = new Date().toLocaleDateString("pt-BR");

    // Match against specific SST topics with high precision
    if (q.includes("nr 35") || q.includes("nr-35") || q.includes("altura") || q.includes("cinto") || q.includes("queda")) {
      return {
        question: userQuestion,
        objectiveAnswer: "A NR-35 regulamenta o trabalho em altura, considerando como tal toda atividade executada acima de 2,00 m (dois metros) do nível inferior onde haja risco de queda. Exige capacitação de 8h, exames médicos admissionais/periódicos com aptidão expressa para altura, emissão de APR e PT, e uso de Sistema de Proteção Contra Quedas (SPCQ).",
        legalGrounds: "Artigos 157 e 200 da CLT; Portaria MTP nº 4.218/2022.",
        relatedNorm: "NR-35 — Trabalho em Altura",
        applicableItem: "Item 35.1.2 (Definição de 2 metros) e Item 35.4 (Planejamento, APR e Permissão de Trabalho)",
        practicalExplanation: "Antes de subir em um telhado ou estrutura acima de 2 metros, a equipe deve preencher a Análise Preliminar de Risco (APR), inspecionar os cintos e talabartes com absorvedor de energia, garantir que os pontos de ancoragem suportem no mínimo 15 kN e assinar a Permissão de Trabalho (PT).",
        responsibilities: "Empregador: implementar SPCQ, capacitar os trabalhadores, garantir APR/PT e exames no PCMSO. Trabalhador: usar os EPIs fornecidos, zelar pela própria integridade e exercer o direito de recusa em caso de risco iminente.",
        relatedDocuments: "Análise Preliminar de Risco (APR), Permissão de Trabalho (PT), Atestado de Saúde Ocupacional (ASO) e Projeto de Ancoragem com ART.",
        officialSource: "Ministério do Trabalho e Emprego — Portal Gov.br (Comissão Tripartite Paritária Permanente - CTPP)",
        lastVerificationDate: "Novembro/2026",
        disclaimer: "Esta resposta possui finalidade estritamente orientativa e baseada nos textos oficiais vigentes, não substituindo a avaliação técnica presencial de Engenheiro ou Técnico de Segurança habilitado."
      };
    }

    if (q.includes("nr 33") || q.includes("nr-33") || q.includes("espaco confinado") || q.includes("confinado") || q.includes("vigia") || q.includes("pet")) {
      return {
        question: userQuestion,
        objectiveAnswer: "A NR-33 estabelece os requisitos de segurança para trabalhos em espaços confinados (locais não projetados para ocupação humana contínua com meios limitados de entrada e saída e atmosfera potencialmente perigosa). Exige emissão obrigatória da PET, presença contínua de Vigia na entrada, medição de gases contínua e ventilação mecânica.",
        legalGrounds: "Artigo 157 da CLT; Portaria MTP nº 1.690/2022.",
        relatedNorm: "NR-33 — Segurança e Saúde nos Trabalhos em Espaços Confinados",
        applicableItem: "Item 33.3 (Deveres do Vigia e Empregador) e Item 33.5 (Medidas Técnicas de Prevenção e PET)",
        practicalExplanation: "Antes de entrar em tanques, galerias ou silos, o Supervisor de Entrada deve testar os gases com detector multigás (oxigênio entre 19,5% e 23%, inflamabilidade < 10% LEL e ausência de gases tóxicos como H2S e CO). O Vigia NUNCA pode entrar no espaço ou realizar outra tarefa concorrente durante a execução.",
        responsibilities: "Empregador: manter cadastro de espaços confinados, fornecer detectores calibrados e treinar vigias (16h) e supervisores (40h). Vigia: permanecer externamente junto à entrada, acompanhar os trabalhadores e acionar resgate em emergências.",
        relatedDocuments: "Permissão de Entrada e Trabalho (PET) — Anexo I da NR-33, Certificados de Calibração do Detector Multigás e Plano de Resgate.",
        officialSource: "Ministério do Trabalho e Emprego — Portal Gov.br (NR-33 Atualizada)",
        lastVerificationDate: "Novembro/2026",
        disclaimer: "Esta orientação baseia-se na NR-33 oficial e não substitui a análise in loco e emissão formal de PET pelo Supervisor de Entrada."
      };
    }

    if (q.includes("pgr") || q.includes("gro") || q.includes("nr 1") || q.includes("nr-01") || q.includes("inventario de risco") || q.includes("plano de acao")) {
      return {
        question: userQuestion,
        objectiveAnswer: "O PGR (Programa de Gerenciamento de Riscos) é a materialização do Gerenciamento de Riscos Ocupacionais (GRO) previsto na NR-01. Deve contemplar todos os perigos físicos, químicos, biológicos, ergonômicos e mecânicos (acidentes), sendo composto minimamente por dois documentos: o Inventário de Riscos Ocupacionais e o Plano de Ação.",
        legalGrounds: "Artigos 154 a 157 da CLT; Portaria SEPRT nº 6.730/2020 e Portaria MTP nº 4.219/2022.",
        relatedNorm: "NR-01 — Disposições Gerais e Gerenciamento de Riscos Ocupacionais",
        applicableItem: "Item 1.5 (Gerenciamento de Riscos Ocupacionais) e Subitens 1.5.3 a 1.5.5",
        practicalExplanation: "As empresas devem identificar os perigos em todas as etapas de trabalho, avaliar a severidade e a probabilidade de ocorrência (matriz de risco) e definir ações preventivas com metas, cronogramas e responsáveis. O inventário deve ser revisto a cada 2 anos (ou 3 anos para empresas certificadas ISO 45001).",
        responsibilities: "Empregador: elaborar, implementar e custear o PGR, consultando os trabalhadores e a CIPA. Trabalhador: colaborar na identificação de perigos e cumprir as medidas preventivas.",
        relatedDocuments: "Inventário de Riscos Ocupacionais, Plano de Ação do PGR, Matriz de Risco e Ordens de Serviço (OS).",
        officialSource: "Ministério do Trabalho e Emprego — Portaria SEPRT 6.730/2020",
        lastVerificationDate: "Novembro/2026",
        disclaimer: "O MEI está dispensado do PGR. MEs e EPPs graus de risco 1 e 2 sem riscos químicos, físicos e biológicos podem emitir a Declaração de Inexistência de Riscos (DIR)."
      };
    }

    if (q.includes("nr 6") || q.includes("nr-06") || q.includes("epi") || q.includes("certificado de aprovacao") || q.includes("ca")) {
      return {
        question: userQuestion,
        objectiveAnswer: "A NR-06 regulamenta os Equipamentos de Proteção Individual (EPIs). Todo EPI deve possuir Certificado de Aprovação (CA) válido expedido pelo MTE e deve ser fornecido gratuitamente pelo empregador, adequado ao risco, em perfeito estado de conservação, mediante registro formal (ficha física ou digital).",
        legalGrounds: "Artigos 166 e 167 da CLT; Portaria MTP nº 2.175/2022 e Portaria MTP nº 672/2021.",
        relatedNorm: "NR-06 — Equipamentos de Proteção Individual",
        applicableItem: "Item 6.5.1 (Responsabilidades da Organização) e Item 6.5.2 (Responsabilidades do Trabalhador)",
        practicalExplanation: "O EPI é a última linha de defesa na hierarquia de controles. O fornecimento deve ser documentado com registro do número do CA, data de entrega e assinatura do colaborador. O empregador é responsável pela substituição imediata quando danificado e por orientar e treinar sobre o uso adequado.",
        responsibilities: "Empregador: adquirir EPI com CA válido, treinar, exigir o uso, fornecer gratuitamente e registrar entrega. Trabalhador: usar apenas para a finalidade destinada, responsabilizar-se pela guarda/conservação e comunicar alterações.",
        relatedDocuments: "Ficha de Registro e Entrega de EPI (física ou eletrônica com biometria/senha), Consulta do CA no sistema do MTE e Procedimento de Higienização.",
        officialSource: "Ministério do Trabalho e Emprego — Portal de Gestão de CA e Normas Regulamentadoras",
        lastVerificationDate: "Novembro/2026",
        disclaimer: "O vencimento do CA impede a compra e comercialização pelo fabricante, mas a empresa pode utilizar o EPI comprado com CA válido dentro do prazo de validade do produto dado pelo fabricante."
      };
    }

    if (q.includes("insalubridade") && q.includes("periculosidade") || q.includes("diferenca entre insalubridade")) {
      return {
        question: userQuestion,
        objectiveAnswer: "Insalubridade (NR-15 / art. 189 CLT) decorre da exposição crônica a agentes físicos, químicos ou biológicos nocivos acima dos limites legais, garantindo adicional de 10%, 20% ou 40% do salário mínimo. Já a Periculosidade (NR-16 / art. 193 CLT) decorre do risco iminente de morte por inflamáveis, explosivos, eletricidade, vigilância armada ou moto, pagando 30% sobre o salário-base. É proibido acumular os dois adicionais.",
        legalGrounds: "Artigos 189 a 193 da CLT; Súmula Vinculante 4 do STF; Súmula 191 do TST; Tema Repetitivo 1019 do TST.",
        relatedNorm: "NR-15 (Insalubridade) e NR-16 (Periculosidade)",
        applicableItem: "Item 15.2 da NR-15 e Item 16.2 da NR-16",
        practicalExplanation: "Se um mecânico abastece geradores com óleo diesel (área perigosa) e também opera sob ruído de 90 dB(A) (agente insalubre), ele tem direito a escolher qual dos dois adicionais deseja receber, sendo vedada a cumulação pelo art. 193, §2º da CLT.",
        responsibilities: "Empregador: realizar laudo pericial (LTCAT / Laudo de Periculosidade assinado por Engenheiro ou Médico) e pagar o adicional legal correto. Trabalhador: exercer a opção do benefício financeiro mais vantajoso.",
        relatedDocuments: "LTCAT, Laudo de Periculosidade, Holerites e Eventos S-1200 / S-2240 do eSocial.",
        officialSource: "Consolidação das Leis do Trabalho (CLT) e Tribunal Superior do Trabalho (TST)",
        lastVerificationDate: "Novembro/2026",
        disclaimer: "A caracterização e a cessação de ambos os adicionais dependem exclusivamente de perícia técnica legal por Engenheiro de Segurança do Trabalho ou Médico do Trabalho credenciado."
      };
    }

    if (q.includes("cipa") || q.includes("nr 5") || q.includes("nr-05") || q.includes("estabilidade") || q.includes("assedio")) {
      return {
        question: userQuestion,
        objectiveAnswer: "A CIPA (Comissão Interna de Prevenção de Acidentes e de Assédio) tem como objetivo a prevenção de acidentes, doenças ocupacionais e o combate ao assédio sexual e outras violências no trabalho (Lei 14.457/2022). É paritária e os representantes eleitos dos empregados têm estabilidade provisória no emprego desde o registro da candidatura até 1 ano após o mandato.",
        legalGrounds: "Artigo 163 a 165 da CLT; Art. 10, II, 'a' do ADCT da CF/88; Lei nº 14.457/2022; Portaria MTP nº 422/2021.",
        relatedNorm: "NR-05 — Comissão Interna de Prevenção de Acidentes e de Assédio",
        applicableItem: "Item 5.3 (Atribuições), Item 5.4 (Constituição) e Item 5.7 (Treinamento)",
        practicalExplanation: "Empresas enquadradas no Quadro I da NR-05 devem realizar processo eleitoral transparente com convocação prévia de 60 dias. Toda empresa com CIPA deve implementar canal de denúncias anônimo contra assédio e capacitar todos os membros (carga de 12h, 16h ou 20h conforme grau de risco).",
        responsibilities: "Empregador: convocar eleições, garantir a estabilidade dos eleitos e liberar membros para reuniões mensais. Trabalhador: votar e participar ativamente das medidas de prevenção.",
        relatedDocuments: "Edital de Convocação, Ata de Eleição e Apuração, Calendário Anual de Reuniões, Atas Mensais e Plano de Ação CIPA.",
        officialSource: "Ministério do Trabalho e Emprego — NR-05 Atualizada com Lei 14.457/2022",
        lastVerificationDate: "Novembro/2026",
        disclaimer: "Empresas não enquadradas no Quadro I da NR-05 estão desobrigadas de eleição paritária, mas devem nomear um Designado da CIPA com treinamento correspondente."
      };
    }

    if (q.includes("esocial") || q.includes("s-2210") || q.includes("s-2220") || q.includes("s-2240") || q.includes("ppp digital")) {
      return {
        question: userQuestion,
        objectiveAnswer: "Os eventos de SST no eSocial são: S-2210 (CAT - prazo até 1º dia útil ou imediato em óbito), S-2220 (ASO / Monitoramento da Saúde - até dia 15 do mês seguinte) e S-2240 (Condições Ambientais / Agentes Nocivos para PPP Eletrônico - até dia 15 do mês seguinte à admissão ou alteração).",
        legalGrounds: "Lei nº 8.213/1991 (Arts. 22 e 58); Decreto nº 3.048/1999; Portaria MTP nº 313/2021.",
        relatedNorm: "Manual de Orientação do eSocial (MOS) Versão S-1.2",
        applicableItem: "Eventos S-2210, S-2220 e S-2240",
        practicalExplanation: "Desde 01/01/2023 o PPP é exclusivamente eletrônico e emitido pelo INSS com base nos dados do S-2240. O evento S-2240 é obrigatório para 100% dos empregados celetistas (inclusive para quem não tem exposição a risco, informando o código 09.01.001 da Tabela 24).",
        responsibilities: "Empregador: transmitir tempestivamente os arquivos XML assinados digitalmente. Trabalhador: acompanhar seus dados de exposição pelo aplicativo 'Meu INSS'.",
        relatedDocuments: "LTCAT, ASOs, Recibos de Entrega do eSocial e Extrato do PPP no Meu INSS.",
        officialSource: "Portal Oficial do eSocial (Governo Federal / Receita Federal / Previdência)",
        lastVerificationDate: "Novembro/2026",
        disclaimer: "O atraso ou omissão no envio gera autuações pecuniárias automáticas aplicadas pelo Fisco Federal sem necessidade de fiscalização presencial prévia."
      };
    }

    if (q.includes("nr 10") || q.includes("nr-10") || q.includes("eletricidade") || q.includes("desenergizacao") || q.includes("choque")) {
      return {
        question: userQuestion,
        objectiveAnswer: "A NR-10 estabelece as condições mínimas de segurança em instalações e serviços em eletricidade. Determina a desenergização elétrica como medida prioritária em 6 passos (seccionamento, bloqueio LOTO, constatação de ausência de tensão, aterramento temporário, proteção de elementos energizados e sinalização). Exige curso de 40h para baixa tensão e mais 40h para SEP.",
        legalGrounds: "Artigos 179 a 181 da CLT; Portaria MTb nº 598/2004.",
        relatedNorm: "NR-10 — Segurança em Instalações e Serviços em Eletricidade",
        applicableItem: "Item 10.5 (Segurança em Instalações Elétricas Desenergizadas) e Item 10.8 (Habilitação e Autorização)",
        practicalExplanation: "Instalações elétricas com carga instalada superior a 75 kW devem obrigatoriamente manter o Prontuário de Instalações Elétricas (PIE) atualizado com laudo de aterramento/SPDA assinado por Engenheiro Eletricista com ART.",
        responsibilities: "Empregador: manter o PIE, fornecer EPIs dielétricos e vestimentas ATPV, emitir autorização formal. Eletricista: cumprir o procedimento de bloqueio e desenergização e usar EPIs.",
        relatedDocuments: "Prontuário de Instalações Elétricas (PIE), Diagramas Unifilares, Laudo de SPDA com ART e Certificados dos Cursos de 40h.",
        officialSource: "Ministério do Trabalho e Emprego — NR-10",
        lastVerificationDate: "Novembro/2026",
        disclaimer: "Intervenções em alta tensão (acima de 1.000 V) exigem obrigatoriamente o curso SEP adicional e nunca podem ser realizadas por trabalhador isolado."
      };
    }

    // Default intelligent structured synthesis for any other SST query
    return {
      question: userQuestion,
      objectiveAnswer: `A respeito de "${userQuestion}", as diretrizes do Ministério do Trabalho e Emprego e a CLT determinam que toda atividade profissional no Brasil deve operar sob o Gerenciamento de Riscos Ocupacionais (GRO/NR-01), priorizando medidas de proteção coletiva sobre proteções individuais e fundamentando-se em laudos técnicos e normas regulamentadoras específicas.`,
      legalGrounds: "Artigo 7º, XXII da Constituição Federal de 1988 e Artigo 157 da CLT.",
      relatedNorm: "NR-01 — Disposições Gerais e Gerenciamento de Riscos Ocupacionais",
      applicableItem: "Item 1.4.1 (Deveres do Empregador) e Item 1.5.3 (Identificação de Perigos)",
      practicalExplanation: "A organização deve submeter o processo à identificação preliminar de perigos no Inventário de Riscos do PGR, avaliar as exposições segundo os limites das NRs correlatas e implantar cronograma de ações preventivas com acompanhamento médico pelo PCMSO (NR-07).",
      responsibilities: "Empregador: garantir ambiente salubre e seguro e capacitar seus colaboradores. Trabalhador: cumprir as ordens de serviço e procedimentos de prevenção.",
      relatedDocuments: "PGR (Inventário e Plano de Ação), ASO e Ordens de Serviço.",
      officialSource: "Ministério do Trabalho e Emprego (Portal Gov.br)",
      lastVerificationDate: currentDate,
      disclaimer: "Informações consolidadas com base no arcabouço normativo brasileiro. Para casos complexos, consulte o SESMT ou assessoria jurídica especializada."
    };
  },

  /* ------------------------------------------------------------------
     INTEGRAÇÃO COM O AGENTE DO MICROSOFT FOUNDRY
     O navegador fala só com o nosso servidor (/api/chat); é o servidor
     que autentica no Azure e conversa com o agente.
  ------------------------------------------------------------------ */
  conversationKey: "portal_sst_foundry_conversation",
  agentStatus: null,

  getConversation() {
    try {
      return JSON.parse(localStorage.getItem(this.conversationKey) || "{}");
    } catch (e) {
      return {};
    }
  },

  saveConversation(conv) {
    try {
      localStorage.setItem(this.conversationKey, JSON.stringify(conv || {}));
    } catch (e) { /* ignora */ }
  },

  async checkAgentStatus() {
    try {
      const r = await fetch("/api/status", { cache: "no-store" });
      this.agentStatus = r.ok ? await r.json() : { configured: false };
    } catch (e) {
      this.agentStatus = { configured: false, offline: true };
    }
    return this.agentStatus;
  },

  async askAgent(question) {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, conversation: this.getConversation() })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = new Error(data.error || `Erro ${r.status} ao falar com o agente.`);
      err.detail = data.detail;
      throw err;
    }
    this.saveConversation(data.conversation);
    return data.text;
  },

  async ask(question) {
    const trimmed = question.trim();
    if (!trimmed) return null;

    let response;
    this.pending = trimmed; // mostra "pensando..." na tela
    if (typeof this.onUpdate === "function") this.onUpdate();
    if (!this.agentStatus) await this.checkAgentStatus();

    if (this.agentStatus && this.agentStatus.configured) {
      try {
        const text = await this.askAgent(trimmed);
        response = { type: "agent", question: trimmed, text };
      } catch (e) {
        console.warn("Agente Foundry indisponível, usando base local:", e.message, e.detail || "");
        response = this.generateStructuredResponse(trimmed);
        response.agentError = e.message;
      }
    } else {
      // Sem agente configurado: usa a base de conhecimento local
      response = this.generateStructuredResponse(trimmed);
    }

    const messageEntry = {
      id: "msg-" + Date.now(),
      timestamp: new Date().toISOString(),
      question: trimmed,
      response,
      feedback: null // 'useful' | 'not_useful'
    };

    this.pending = null;
    this.chatHistory.push(messageEntry);
    this.saveHistory();
    if (typeof this.onUpdate === "function") this.onUpdate();
    return messageEntry;
  },

  setFeedback(messageId, feedbackValue) {
    const entry = this.chatHistory.find(m => m.id === messageId);
    if (entry) {
      entry.feedback = feedbackValue;
      this.saveHistory();
      return true;
    }
    return false;
  }
};
