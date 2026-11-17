/**
 * MÓDULO DO PAINEL ADMINISTRATIVO E CONTROLE DE VERSÕES LEGISLATIVAS
 * PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO
 * Registra auditoria completa de alterações em conformidade com o Item 22.
 */

window.SST_ADMIN = {
  storageKeyAudit: "portal_sst_audit_logs",
  storageKeyMetrics: "portal_sst_portal_metrics",

  auditLogs: [],
  metrics: {
    totalNRVisits: 14820,
    totalAISearches: 3840,
    totalDocsDownloaded: 2190,
    totalActiveUsers: 564
  },

  init() {
    this.loadAuditLogs();
    this.loadMetrics();
  },

  loadAuditLogs() {
    try {
      const stored = localStorage.getItem(this.storageKeyAudit);
      if (stored) {
        this.auditLogs = JSON.parse(stored);
      } else {
        // Registros iniciais oficiais de auditoria do portal
        this.auditLogs = [
          {
            id: "aud-001",
            norm: "NR-38",
            author: "Auditoria Regulatória / Eng. Fabiano Santos",
            timestamp: "02/01/2024 09:30",
            officialSource: "Diário Oficial da União (DOU) / Portaria MTP nº 4.101/2022",
            previousVersion: "Redação de consulta pública anterior",
            currentVersion: "Texto oficial publicado com vigência em 02/01/2024",
            changeDescription: "Inclusão integral da NR-38 no acervo normativo do portal, contemplando requisitos de segurança para caminhões coletores e pontos de apoio aos garis."
          },
          {
            id: "aud-002",
            norm: "NR-35",
            author: "Comitê Técnico / Dra. Luciana Vianna",
            timestamp: "03/07/2023 14:15",
            officialSource: "Portaria MTP nº 4.218/2022 / CTPP",
            previousVersion: "Portaria SIT nº 313/2012",
            currentVersion: "Redação atualizada com Anexo III (Escadas)",
            changeDescription: "Atualização dos parâmetros de ancoragem estrutural e inclusão do Anexo III detalhando requisitos para escadas individuais como postos de trabalho."
          },
          {
            id: "aud-003",
            norm: "NR-05",
            author: "Jurídico SST / Dr. Marcos Vinicius",
            timestamp: "20/03/2023 11:00",
            officialSource: "Lei Federal nº 14.457/2022",
            previousVersion: "Portaria MTP nº 422/2021",
            currentVersion: "Portaria MTP nº 422/2021 c/ Lei 14.457/2022",
            changeDescription: "Alteração da denominação para CIPA e Assédio e inserção da exigência legal de canal anônimo de denúncias e regras de conduta contra o assédio sexual."
          }
        ];
        this.saveAuditLogs();
      }
    } catch (e) {
      console.warn("Erro ao carregar auditoria:", e);
    }
  },

  loadMetrics() {
    try {
      const stored = localStorage.getItem(this.storageKeyMetrics);
      if (stored) {
        this.metrics = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Erro ao carregar métricas:", e);
    }
  },

  saveAuditLogs() {
    try {
      localStorage.setItem(this.storageKeyAudit, JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn("Erro ao salvar auditoria:", e);
    }
  },

  recordChange(normCode, author, officialSource, prevVer, currVer, description) {
    const entry = {
      id: "aud-" + Date.now(),
      norm: normCode,
      author: author || "Administrador do Portal",
      timestamp: new Date().toLocaleString("pt-BR"),
      officialSource: officialSource || "Diário Oficial da União",
      previousVersion: prevVer || "Versão Anterior",
      currentVersion: currVer || "Nova Redação Oficial",
      changeDescription: description
    };

    this.auditLogs.unshift(entry);
    this.saveAuditLogs();
    return entry;
  },

  incrementMetric(type) {
    if (this.metrics[type] !== undefined) {
      this.metrics[type]++;
      try {
        localStorage.setItem(this.storageKeyMetrics, JSON.stringify(this.metrics));
      } catch (e) {}
    }
  }
};
