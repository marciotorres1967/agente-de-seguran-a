/**
 * PORTAL SST BRASIL — CONTROLADOR PRINCIPAL DA APLICAÇÃO (SPA)
 * Gerenciamento de rotas, renderização dinâmica, busca global e eventos
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inicialização dos módulos
  if (window.SST_AUTH) window.SST_AUTH.init();
  if (window.AIAssistant) window.AIAssistant.init();
  if (window.SST_ADMIN) window.SST_ADMIN.init();

  // Inicializa tema claro/escuro
  initTheme();

  // Inicializa Menu Hambúrguer Lateral para Mobile
  initMobileDrawer();

  // Router e Navegação
  initRouter();

  // Busca global
  initGlobalSearch();

  // Renderização inicial da Home e dados
  renderHomePage();
  renderNRsList();
  renderLegislationList();
  renderEPIsCatalog();
  renderTrainingsList();
  renderDocumentsList();
  renderNewsList();
  renderFAQ();
  renderAdminPanel();
  renderUserProfile();

  // Inicializa ferramentas interativas
  initInteractiveTools();
  initAIAssistantUI();
});

/* ==========================================================================
   TEMA CLARO / ESCURO
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem("portal_sst_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const themeBtns = document.querySelectorAll(".theme-toggle-btn");
  themeBtns.forEach(btn => {
    btn.innerHTML = savedTheme === "dark" ? window.SST_ICONS.sun : window.SST_ICONS.moon;
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("portal_sst_theme", next);
      themeBtns.forEach(b => b.innerHTML = next === "dark" ? window.SST_ICONS.sun : window.SST_ICONS.moon);
    });
  });
}

/* ==========================================================================
   MENU HAMBÚRGUER LATERAL (MOBILE DRAWER)
   ========================================================================== */
window.openMobileDrawer = function () {
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  if (drawer && backdrop) {
    drawer.classList.add("open");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden"; // Impede rolagem do fundo
  }
};

window.closeMobileDrawer = function () {
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  if (drawer && backdrop) {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.style.overflow = ""; // Restaura rolagem normal
  }
};

function initMobileDrawer() {
  const btnHamburger = document.getElementById("btn-hamburger");
  const btnClose = document.getElementById("mobile-drawer-close");
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  const drawerSearch = document.getElementById("mobile-drawer-search-input");

  if (btnHamburger) {
    btnHamburger.addEventListener("click", () => {
      window.openMobileDrawer();
    });
  }

  if (btnClose) {
    btnClose.addEventListener("click", () => {
      window.closeMobileDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      window.closeMobileDrawer();
    });
  }

  // Fecha o drawer com tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.closeMobileDrawer();
    }
  });

  // Busca rápida no input do drawer lateral
  if (drawerSearch) {
    drawerSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const term = drawerSearch.value.trim();
        if (term) {
          window.closeMobileDrawer();
          window.navigateTo("nrs");
          const filterInput = document.getElementById("nr-search-filter");
          if (filterInput) {
            filterInput.value = term;
            filterInput.dispatchEvent(new Event("input"));
          }
        }
      }
    });
  }
}

/* ==========================================================================
   ROTEADOR CLIENT-SIDE
   ========================================================================== */
window.navigateTo = function (viewId, param = null) {
  // Fecha o menu lateral caso esteja aberto ao navegar
  window.closeMobileDrawer();

  // Atualiza hash da URL sem recarregar
  const hash = param ? `#${viewId}/${param}` : `#${viewId}`;
  window.location.hash = hash;
};

function initRouter() {
  window.addEventListener("hashchange", handleRoute);
  // Primeira execução da rota
  handleRoute();
}

function handleRoute() {
  const fullHash = window.location.hash.replace("#", "") || "home";
  const [viewId, param] = fullHash.split("/");

  // Fecha o menu lateral ao mudar de rota
  window.closeMobileDrawer();

  // Oculta todas as views
  document.querySelectorAll(".view-container").forEach(el => el.classList.remove("active"));

  // Atualiza menu horizontal ativo
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("data-view") === viewId) {
      item.classList.add("active");
    }
  });

  // Atualiza menu lateral ativo (Drawer)
  document.querySelectorAll(".mobile-nav-link").forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("data-view") === viewId) {
      item.classList.add("active");
    }
  });

  // Rola suavemente ao topo
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Roteia para a view correspondente
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add("active");

    // Ações específicas de rotas
    if (viewId === "nr-detail" && param) {
      renderNRDetail(param);
    } else if (viewId === "admin") {
      renderAdminPanel();
    } else if (viewId === "user-profile") {
      renderUserProfile();
    }
  } else {
    // Fallback para home se rota não existir
    const homeView = document.getElementById("view-home");
    if (homeView) homeView.classList.add("active");
  }

  // Incrementa métrica de acesso no admin
  if (window.SST_ADMIN) {
    window.SST_ADMIN.incrementMetric("totalNRVisits");
  }
}

/* ==========================================================================
   BUSCA GLOBAL INTELIGENTE
   ========================================================================== */
function initGlobalSearch() {
  const searchInputs = [
    document.getElementById("header-search-input"),
    document.getElementById("hero-search-input")
  ];
  const suggestionsBox = document.getElementById("search-suggestions");

  searchInputs.forEach(input => {
    if (!input) return;

    input.addEventListener("input", (e) => {
      const term = e.target.value.trim().toLowerCase();
      if (term.length < 2) {
        if (suggestionsBox) suggestionsBox.style.display = "none";
        return;
      }

      const results = executeGlobalSearch(term);
      renderSuggestions(results, input);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const term = input.value.trim();
        if (term) {
          if (window.SST_AUTH) window.SST_AUTH.addSearchHistory(term);
          if (suggestionsBox) suggestionsBox.style.display = "none";
          // Se for NR direta (ex: 35 ou nr 35) navega direto
          const nrMatch = term.match(/\b(nr\s*[-]?\s*)?(\d{1,2})\b/i);
          if (nrMatch && nrMatch[2]) {
            const num = nrMatch[2].padStart(2, "0");
            const nrObj = window.NRS_DATA.find(n => n.number === num);
            if (nrObj) {
              window.navigateTo("nr-detail", nrObj.id);
              return;
            }
          }
          // Caso contrário navega para NRs com filtro
          window.navigateTo("nrs");
          const filterInput = document.getElementById("nr-search-filter");
          if (filterInput) {
            filterInput.value = term;
            filterInput.dispatchEvent(new Event("input"));
          }
        }
      }
    });
  });

  // Fecha sugestões ao clicar fora
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-search") && !e.target.closest(".hero-search-wrapper")) {
      if (suggestionsBox) suggestionsBox.style.display = "none";
    }
  });
}

function executeGlobalSearch(term) {
  const normTerm = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const results = [];

  // 1. Busca em NRs
  window.NRS_DATA.forEach(nr => {
    const titleNorm = nr.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const objNorm = nr.objective.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (nr.number === term || `nr-${nr.number}`.includes(term) || titleNorm.includes(normTerm) || objNorm.includes(normTerm)) {
      results.push({
        type: "Norma Regulamentadora",
        title: `NR-${nr.number} — ${nr.title}`,
        subtitle: `Status: ${nr.status} | ${nr.publishingPortaria}`,
        action: () => window.navigateTo("nr-detail", nr.id)
      });
    }
  });

  // 2. Busca em Legislação
  window.LEGISLATION_DATA.forEach(leg => {
    const legTitle = leg.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (legTitle.includes(normTerm)) {
      results.push({
        type: "Legislação",
        title: leg.title,
        subtitle: leg.number,
        action: () => window.navigateTo("legislation")
      });
    }
  });

  // 3. Busca em Riscos Ocupacionais
  if (window.RISKS_DATA && window.RISKS_DATA.categories) {
    window.RISKS_DATA.categories.forEach(cat => {
      cat.agents.forEach(agent => {
        const agentName = agent.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (agentName.includes(normTerm)) {
          results.push({
            type: "Risco Ocupacional",
            title: agent.name,
            subtitle: `${cat.name} | Normas: ${agent.norms.join(", ")}`,
            action: () => window.navigateTo("gro")
          });
        }
      });
    });
  }

  // 4. Busca em Ferramentas
  const tools = [
    { title: "Matriz de Avaliação de Riscos 5x5", view: "tools" },
    { title: "Calculadora de Indicadores TF e TG (NBR 14280)", view: "tools" },
    { title: "Simulador de Dimensionamento de CIPA (NR-05)", view: "tools" },
    { title: "Gerador de APR (Análise Preliminar de Risco)", view: "tools" },
    { title: "Gerador de Ordem de Serviço (NR-01)", view: "tools" },
    { title: "Checklist de NR-35 (Trabalho em Altura)", view: "tools" }
  ];
  tools.forEach(t => {
    if (t.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normTerm)) {
      results.push({
        type: "Ferramenta Interativa",
        title: t.title,
        subtitle: "Acesso direto à ferramenta gratuita",
        action: () => window.navigateTo(t.view)
      });
    }
  });

  return results.slice(0, 6);
}

function renderSuggestions(results, inputElement) {
  let box = document.getElementById("search-suggestions");
  if (!box) {
    box = document.createElement("div");
    box.id = "search-suggestions";
    box.className = "search-suggestions-box";
    document.body.appendChild(box);
  }

  if (results.length === 0) {
    box.style.display = "none";
    return;
  }

  const rect = inputElement.getBoundingClientRect();
  box.style.position = "absolute";
  box.style.top = `${rect.bottom + window.scrollY + 6}px`;
  box.style.left = `${rect.left + window.scrollX}px`;
  box.style.width = `${rect.width}px`;
  box.style.display = "block";

  box.innerHTML = results.map(r => `
    <div class="search-suggestion-item">
      <div>
        <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main);">${r.title}</div>
        <div style="font-size: 0.775rem; color: var(--text-light);">${r.subtitle}</div>
      </div>
      <span class="search-suggestion-tag">${r.type}</span>
    </div>
  `).join("");

  const items = box.querySelectorAll(".search-suggestion-item");
  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      box.style.display = "none";
      results[index].action();
    });
  });
}

/* ==========================================================================
   PÁGINA INICIAL (HOME)
   ========================================================================== */
function renderHomePage() {
  // 12 Cards de Acesso Rápido com ícones oficiais
  const quickCardsContainer = document.getElementById("quick-cards-grid");
  if (quickCardsContainer) {
    const cardsData = [
      { id: "nrs", title: "Normas Regulamentadoras", desc: "Biblioteca digital de todas as NRs de 1 a 38 vigentes e revogadas com anexos oficiais.", icon: "bookOpen", color: "#1E6091", count: "38 Normas" },
      { id: "legislation", title: "Legislação Trabalhista", desc: "CF/88, CLT Capítulo V (arts. 154 a 201), Leis 8.213 e 6.514 comentadas.", icon: "scale", color: "#0F2A4A", count: "Constituição & CLT" },
      { id: "ai", title: "Inteligência Artificial SST", desc: "Assistente virtual especializado com respostas fundamentadas em itens das NRs.", icon: "bot", color: "#059669", count: "Assistente IA" },
      { id: "epis", title: "Equipamentos de Proteção Individual", desc: "Catálogo completo de EPIs, consulta de CA, higienização e critérios de descarte.", icon: "hardHat", color: "#F59E0B", count: "NR-06 & CAs" },
      { id: "epis", title: "Equipamentos de Proteção Coletiva", desc: "Linhas de vida, guarda-corpos, enclausuramentos acústicos e sistemas de exaustão.", icon: "shieldCheck", color: "#3B82F6", count: "EPCs & Engenharia" },
      { id: "gro", title: "Gerenciamento de Riscos (GRO)", desc: "Metodologia completa de identificação de perigos, riscos e hierarquia de controle.", icon: "alertTriangle", color: "#7C3AED", count: "NR-01 GRO" },
      { id: "pgr", title: "Programa de Gerenciamento (PGR)", desc: "Inventário de riscos, plano de ação e matriz de riscos 5x5 com modelos editáveis.", icon: "fileText", color: "#10B981", count: "Inventário & Ação" },
      { id: "pcmso", title: "PCMSO & Saúde Ocupacional", desc: "NR-07, tipos de exames clínicos, prazos de ASO, audiometrias e relatório analítico.", icon: "heartPulse", color: "#DC2626", count: "NR-07 & ASOs" },
      { id: "cipa", title: "CIPA & Combate ao Assédio", desc: "NR-05, dimensionamento oficial por faixa, processo eleitoral e Lei 14.457/2022.", icon: "users", color: "#0D9488", count: "NR-05 & Eleição" },
      { id: "esocial", title: "eSocial SST (S-2210/2220/2240)", desc: "Orientações completas dos leiautes, Tabela 24 de agentes nocivos e prazos do PPP.", icon: "activity", color: "#2563EB", count: "PPP Eletrônico" },
      { id: "accidents", title: "Acidentes de Trabalho", desc: "Conceito legal, prazos de CAT, investigação com Ishikawa 6M e taxas TF e TG.", icon: "flame", color: "#EF4444", count: "Investigação & TF/TG" },
      { id: "trainings", title: "Treinamentos e Capacitações", desc: "Biblioteca oficial de cargas horárias (NR-10, 12, 20, 33, 35), ementas e reciclagens.", icon: "calculator", color: "#D97706", count: "Cargas Oficiais" }
    ];

    quickCardsContainer.innerHTML = cardsData.map(c => `
      <div class="quick-card" onclick="window.navigateTo('${c.id}')">
        <div class="quick-card-header">
          <div class="quick-card-icon" style="background-color: ${c.color};">
            ${window.SST_ICONS[c.icon] || window.SST_ICONS.shield}
          </div>
          <h3 class="quick-card-title">${c.title}</h3>
        </div>
        <p class="quick-card-desc">${c.desc}</p>
        <div class="quick-card-footer">
          <span>${c.count}</span>
          <span style="display:flex;align-items:center;gap:4px;">Acessar ${window.SST_ICONS.chevronRight}</span>
        </div>
      </div>
    `).join("");
  }

  // Seção: Normas Mais Consultadas na Home
  const mostConsultedContainer = document.getElementById("home-popular-nrs");
  if (mostConsultedContainer) {
    const popularIds = ["nr-01", "nr-06", "nr-10", "nr-12", "nr-35", "nr-33"];
    const popularNRs = window.NRS_DATA.filter(n => popularIds.includes(n.id));

    mostConsultedContainer.innerHTML = popularNRs.map(nr => `
      <div class="nr-card" onclick="window.navigateTo('nr-detail', '${nr.id}')">
        <div class="nr-card-top">
          <span class="nr-badge-number">NR-${nr.number}</span>
          <span class="badge ${nr.status === 'Vigente' ? 'badge-vigente' : 'badge-revogada'}">${nr.status}</span>
        </div>
        <h4 class="nr-card-title">${nr.title}</h4>
        <p class="nr-card-objective">${nr.objective}</p>
        <div class="nr-card-footer">
          <span>Última atualização: ${nr.lastUpdateDate}</span>
          <span style="color:var(--blue-accent);font-weight:700;">Ver detalhes →</span>
        </div>
      </div>
    `).join("");
  }

  // Seção: Últimas Atualizações e Alertas na Home
  const latestUpdatesContainer = document.getElementById("home-latest-updates");
  if (latestUpdatesContainer && window.NEWS_DATA) {
    latestUpdatesContainer.innerHTML = window.NEWS_DATA.slice(0, 3).map(news => `
      <div class="tech-card" style="margin-bottom:1rem; cursor:pointer;" onclick="window.navigateTo('news')">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
          <span class="badge badge-blue">${news.category}</span>
          <span style="font-size:0.775rem;color:var(--text-light);">${news.publishDate}</span>
        </div>
        <h4 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem;color:var(--text-main);">${news.title}</h4>
        <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.5;">${news.summary}</p>
        <div style="margin-top:0.75rem;font-size:0.8rem;color:var(--green);font-weight:700;">
          Fonte Oficial: ${news.source}
        </div>
      </div>
    `).join("");
  }
}

/* ==========================================================================
   MÓDULO DE NORMAS REGULAMENTADORAS (NR-01 A NR-38)
   ========================================================================== */
function renderNRsList() {
  const container = document.getElementById("nrs-list-grid");
  const filterInput = document.getElementById("nr-search-filter");
  const pills = document.querySelectorAll(".filter-pill[data-status]");

  let currentStatus = "todos";
  let searchFilter = "";

  function updateGrid() {
    if (!container) return;

    let filtered = window.NRS_DATA;

    if (currentStatus === "vigente") {
      filtered = filtered.filter(n => n.status === "Vigente");
    } else if (currentStatus === "revogada") {
      filtered = filtered.filter(n => n.status === "Revogada");
    }

    if (searchFilter) {
      const term = searchFilter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      filtered = filtered.filter(n => {
        const titleNorm = n.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const objNorm = n.objective.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return n.number.includes(term) || `nr-${n.number}`.includes(term) || titleNorm.includes(term) || objNorm.includes(term);
      });
    }

    container.innerHTML = filtered.map(nr => {
      const isFav = window.SST_AUTH ? window.SST_AUTH.isFavorite(nr.id) : false;
      return `
        <div class="nr-card" onclick="window.navigateTo('nr-detail', '${nr.id}')">
          <div class="nr-card-top">
            <span class="nr-badge-number">NR-${nr.number}</span>
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="badge ${nr.status === 'Vigente' ? 'badge-vigente' : 'badge-revogada'}">${nr.status}</span>
              <button onclick="event.stopPropagation(); toggleFav('${nr.id}', this)" title="Favoritar NR" style="padding:2px;color:${isFav ? '#F59E0B' : '#94A3B8'};">
                ${isFav ? window.SST_ICONS.starFilled : window.SST_ICONS.star}
              </button>
            </div>
          </div>
          <h4 class="nr-card-title">${nr.title}</h4>
          <p class="nr-card-objective">${nr.objective}</p>
          <div class="nr-card-footer">
            <span>Vigência: ${nr.effectiveDate}</span>
            <span style="color:var(--blue-accent);font-weight:700;">Acessar NR →</span>
          </div>
        </div>
      `;
    }).join("");
  }

  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentStatus = pill.getAttribute("data-status");
      updateGrid();
    });
  });

  if (filterInput) {
    filterInput.addEventListener("input", (e) => {
      searchFilter = e.target.value.trim();
      updateGrid();
    });
  }

  window.toggleFav = function (nrId, btn) {
    if (window.SST_AUTH) {
      const isFav = window.SST_AUTH.toggleFavorite(nrId);
      btn.style.color = isFav ? '#F59E0B' : '#94A3B8';
      btn.innerHTML = isFav ? window.SST_ICONS.starFilled : window.SST_ICONS.star;
    }
  };

  updateGrid();
}

/* ==========================================================================
   PÁGINA INDIVIDUAL DA NR (TODOS OS 20 ITENS EXIGIDOS)
   ========================================================================== */
function renderNRDetail(nrId) {
  const nr = window.NRS_DATA.find(n => n.id === nrId);
  const container = document.getElementById("view-nr-detail");
  if (!nr || !container) return;

  const isFav = window.SST_AUTH ? window.SST_AUTH.isFavorite(nr.id) : false;

  container.innerHTML = `
    <div class="container" style="padding-top:1.5rem; padding-bottom:3rem;">
      <div style="margin-bottom:1rem;">
        <button class="btn btn-outline" onclick="window.navigateTo('nrs')" style="padding:0.4rem 0.8rem; font-size:0.8125rem;">
          ${window.SST_ICONS.arrowLeft} Voltar para todas as NRs
        </button>
      </div>

      <!-- Cabeçalho Individual da NR -->
      <div class="nr-detail-header printable-document" id="printable-nr-${nr.id}">
        <div class="nr-detail-meta">
          <span style="font-size:1.5rem; font-weight:900; color:var(--primary);">NR-${nr.number}</span>
          <span class="badge ${nr.status === 'Vigente' ? 'badge-vigente' : 'badge-revogada'}">${nr.status}</span>
          <span class="badge badge-blue">Publicação: ${nr.publishingPortaria}</span>
          <span class="badge" style="background:var(--bg-subtle);">Vigência: ${nr.effectiveDate}</span>
        </div>
        <h1 class="nr-detail-title">${nr.officialName}</h1>
        <p style="font-size:1rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem;">
          <strong>Objetivo e Campo de Aplicação:</strong> ${nr.objective}
        </p>
        <p style="font-size:0.875rem; color:var(--text-light); line-height:1.5;">
          <strong>Abrangência:</strong> ${nr.scope}
        </p>

        <div class="nr-detail-actions">
          <button class="btn btn-primary" onclick="window.print()">
            ${window.SST_ICONS.printer} Imprimir / Baixar Ficha Oficial em PDF
          </button>
          <a href="${nr.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
            ${window.SST_ICONS.externalLink} Texto Oficial no Gov.br (PDF)
          </a>
          <button class="btn btn-outline" onclick="window.AIAssistant.ask('O que determina a NR-${nr.number}?'); window.navigateTo('ai');">
            ${window.SST_ICONS.bot} Consultar IA sobre esta NR
          </button>
          <button class="btn btn-outline" onclick="window.toggleFav('${nr.id}', this)">
            ${isFav ? window.SST_ICONS.starFilled : window.SST_ICONS.star} ${isFav ? "Salva nos Favoritos" : "Favoritar NR"}
          </button>
        </div>
      </div>

      <!-- Abas de Navegação de Conteúdo Específico da NR -->
      <div class="tabs-nav" id="nr-detail-tabs">
        <button class="tab-btn active" onclick="switchNRTab('tab-visao-geral', this)">Visão Geral & Itens</button>
        <button class="tab-btn" onclick="switchNRTab('tab-obrigacoes', this)">Obrigações Legais</button>
        <button class="tab-btn" onclick="switchNRTab('tab-anexos', this)">Anexos Oficiais (${nr.annexes.length})</button>
        <button class="tab-btn" onclick="switchNRTab('tab-documentos', this)">Documentos Exigidos</button>
        <button class="tab-btn" onclick="switchNRTab('tab-treinamentos', this)">Treinamentos & Prazos</button>
        <button class="tab-btn" onclick="switchNRTab('tab-penalidades', this)">Penalidades & NR-28</button>
        <button class="tab-btn" onclick="switchNRTab('tab-pratica', this)">Exemplos Práticos</button>
        <button class="tab-btn" onclick="switchNRTab('tab-faq', this)">Perguntas Frequentes</button>
      </div>

      <!-- Conteúdo das Abas -->
      <div id="tab-visao-geral" class="tab-pane active">
        <div class="tech-card">
          <h3>${window.SST_ICONS.bookOpen} Estrutura Geral e Capítulos</h3>
          <p style="color:var(--text-muted);margin-bottom:1rem;">Itens normativos principais estruturados conforme publicação do Ministério do Trabalho e Emprego:</p>
          <ul style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem;">
            ${nr.structure.map(s => `
              <li style="background:var(--bg-subtle);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--border-color);">
                <strong style="color:var(--blue-accent);">${s.item}</strong> — ${s.title}
              </li>
            `).join("")}
          </ul>
        </div>
        <div class="tech-card">
          <h3>${window.SST_ICONS.shield} Requisitos Técnicos Mínimos</h3>
          <ul class="obligations-list">
            ${nr.technicalRequirements.map(req => `<li>${req}</li>`).join("")}
          </ul>
        </div>
        <div class="tech-card">
          <h3>${window.SST_ICONS.activity} Normas Regulamentadoras Correlacionadas</h3>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            ${nr.relatedNorms.map(rn => `
              <span class="filter-pill" style="cursor:pointer;" onclick="const target = window.NRS_DATA.find(n => n.number === '${rn.replace('NR-', '')}'); if(target) window.navigateTo('nr-detail', target.id);">
                ${rn}
              </span>
            `).join("")}
          </div>
        </div>
      </div>

      <div id="tab-obrigacoes" class="tab-pane">
        <div class="tech-card">
          <h3 style="color:var(--primary);">${window.SST_ICONS.shieldCheck} Obrigações do Empregador (Organização)</h3>
          <ul class="obligations-list">
            ${nr.employerObligations.map(o => `<li>${o}</li>`).join("")}
          </ul>
        </div>
        <div class="tech-card">
          <h3 style="color:var(--green);">${window.SST_ICONS.user} Obrigações e Direitos dos Trabalhadores</h3>
          <ul class="obligations-list">
            ${nr.employeeObligations.length > 0
      ? nr.employeeObligations.map(e => `<li>${e}</li>`).join("")
      : `<li>Norma sem deveres específicos diretos para empregados além dos gerais da NR-01.</li>`}
          </ul>
        </div>
      </div>

      <div id="tab-anexos" class="tab-pane">
        <div class="tech-card">
          <h3>${window.SST_ICONS.fileText} Anexos Oficiais e Tabelas Vigentes</h3>
          ${nr.annexes.length > 0 ? `
            <div style="display:flex;flex-direction:column;gap:1rem;">
              ${nr.annexes.map(a => `
                <div style="padding:1rem;background:var(--bg-subtle);border-radius:var(--radius-md);border-left:4px solid var(--blue-accent);">
                  <strong style="color:var(--blue-accent);font-size:0.95rem;">${a.number}</strong>
                  <h4 style="font-size:1.05rem;font-weight:700;margin-top:0.25rem;">${a.title}</h4>
                </div>
              `).join("")}
            </div>
          ` : `<p style="color:var(--text-muted);">Esta norma não possui anexos complementares na redação oficial vigente.</p>`}
        </div>
      </div>

      <div id="tab-documentos" class="tab-pane">
        <div class="tech-card">
          <h3>${window.SST_ICONS.fileText} Documentos Técnicos Exigidos pela Norma</h3>
          <ul class="obligations-list">
            ${nr.requiredDocuments.map(d => `<li><strong>${d}</strong></li>`).join("")}
          </ul>
          <div style="margin-top:1.5rem;">
            <button class="btn btn-green" onclick="window.navigateTo('documents')">
              ${window.SST_ICONS.download} Acessar Biblioteca de Modelos Editáveis
            </button>
          </div>
        </div>
      </div>

      <div id="tab-treinamentos" class="tab-pane">
        <div class="tech-card">
          <h3>${window.SST_ICONS.users} Capacitações, Treinamentos e Reciclagens</h3>
          <p style="font-size:0.95rem;color:var(--text-muted);line-height:1.6;margin-bottom:1rem;">
            ${nr.trainingRequirements}
          </p>
          <button class="btn btn-primary" onclick="window.navigateTo('trainings')">
            ${window.SST_ICONS.calculator} Consultar Matriz Completa de Treinamentos
          </button>
        </div>
      </div>

      <div id="tab-penalidades" class="tab-pane">
        <div class="tech-card">
          <h3 style="color:var(--red);">${window.SST_ICONS.alertTriangle} Fiscalização, Gradação de Infrações e Penalidades</h3>
          <p style="font-size:0.95rem;color:var(--text-muted);line-height:1.6;margin-bottom:1rem;">
            ${nr.inspectionPenalties}
          </p>
          <div style="background:var(--red-soft);border:1px solid var(--red);padding:1rem;border-radius:var(--radius-md);color:var(--red);">
            <strong>Importante:</strong> Infrações reincidentes ou com cominação de grave e iminente risco (NR-03) podem ensejar embargo imediato da obra ou interdição de máquinas, além de multas pecuniárias aplicadas pela Auditoria-Fiscal do Trabalho.
          </div>
        </div>
      </div>

      <div id="tab-pratica" class="tab-pane">
        <div class="tech-card">
          <h3>${window.SST_ICONS.shieldCheck} Exemplo Prático de Aplicação em Campo</h3>
          <div style="background:var(--blue-soft);border:1px solid var(--blue-accent);padding:1.25rem;border-radius:var(--radius-md);line-height:1.6;color:var(--text-main);">
            ${nr.practicalExamples}
          </div>
        </div>
      </div>

      <div id="tab-faq" class="tab-pane">
        <div class="tech-card">
          <h3>${window.SST_ICONS.info} Perguntas Frequentes sobre a NR-${nr.number}</h3>
          ${nr.faq && nr.faq.length > 0 ? nr.faq.map(f => `
            <div style="margin-bottom:1.25rem;border-bottom:1px solid var(--border-color);padding-bottom:1rem;">
              <h4 style="font-size:1rem;font-weight:700;color:var(--primary);margin-bottom:0.35rem;">❓ ${f.q}</h4>
              <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;">${f.a}</p>
            </div>
          `).join("") : `<p style="color:var(--text-muted);">Consulte o assistente virtual para esclarecer dúvidas adicionais sobre esta norma.</p>`}
        </div>
      </div>
    </div>
  `;
}

window.switchNRTab = function (tabId, btn) {
  document.querySelectorAll("#nr-detail-tabs .tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  const pane = document.getElementById(tabId);
  if (pane) pane.classList.add("active");
};

/* ==========================================================================
   MÓDULO DE LEGISLAÇÃO TRABALHISTA E PREVIDENCIÁRIA
   ========================================================================== */
function renderLegislationList() {
  const container = document.getElementById("legislation-cards-container");
  if (!container || !window.LEGISLATION_DATA) return;

  container.innerHTML = window.LEGISLATION_DATA.map(leg => `
    <div class="tech-card" style="margin-bottom:2rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">
        <span class="badge badge-blue">${leg.category}</span>
        <span style="font-size:0.8rem;color:var(--text-light);">Fonte: ${leg.officialSource}</span>
      </div>
      <h2 style="font-size:1.35rem;font-weight:800;color:var(--text-main);margin-bottom:0.5rem;">${leg.title}</h2>
      <p style="font-size:0.925rem;color:var(--text-muted);line-height:1.6;margin-bottom:1.5rem;">${leg.summary}</p>
      
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:25%;">Dispositivo Legal</th>
              <th style="width:25%;">Tema / Abrangência</th>
              <th style="width:50%;">Aplicação Prática e Jurisprudência</th>
            </tr>
          </thead>
          <tbody>
            ${leg.articles.map(art => `
              <tr>
                <td><strong>${art.article}</strong></td>
                <td><span class="badge" style="background:var(--bg-subtle);">${art.theme}</span></td>
                <td>
                  <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.4rem;">${art.text}</p>
                  <p style="font-size:0.825rem;color:var(--green);font-weight:600;">➔ ${art.practicalApplication}</p>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div style="margin-top:1rem;">
        <a href="${leg.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size:0.8125rem;padding:0.4rem 0.8rem;">
          ${window.SST_ICONS.externalLink} Acessar Texto Integral no Portal do Planalto
        </a>
      </div>
    </div>
  `).join("");
}

/* ==========================================================================
   CATÁLOGO TÉCNICO DE EPIs E EPCs
   ========================================================================== */
function renderEPIsCatalog() {
  const episGrid = document.getElementById("epis-catalog-grid");
  const epcsGrid = document.getElementById("epcs-catalog-grid");
  if (!episGrid || !window.EQUIPMENT_DATA) return;

  episGrid.innerHTML = window.EQUIPMENT_DATA.epis.map(item => `
    <div class="tech-card" style="display:flex;flex-direction:column;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">
        <span class="badge badge-vigente">${item.category}</span>
        <span style="font-size:0.75rem;font-weight:700;color:var(--primary);">${item.caInfo.slice(0, 30)}...</span>
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;color:var(--text-main);margin-bottom:0.5rem;">${item.name}</h3>
      <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.75rem;"><strong>Finalidade:</strong> ${item.purpose}</p>
      <div style="font-size:0.8rem;color:var(--text-light);line-height:1.4;margin-bottom:0.75rem;background:var(--bg-subtle);padding:0.6rem;border-radius:var(--radius-sm);">
        <strong>Classes / Tipos:</strong> ${item.classes}
      </div>
      <div style="font-size:0.8rem;color:var(--red);line-height:1.4;margin-bottom:0.75rem;">
        <strong>Limitações Críticas:</strong> ${item.limitations}
      </div>
      <div style="font-size:0.775rem;color:var(--text-light);border-top:1px solid var(--border-color);padding-top:0.5rem;margin-top:auto;">
        <strong>Substituição:</strong> ${item.replacementCriteria}
      </div>
    </div>
  `).join("");

  if (epcsGrid) {
    epcsGrid.innerHTML = window.EQUIPMENT_DATA.epcs.map(item => `
      <div class="tech-card" style="display:flex;flex-direction:column;">
        <span class="badge badge-blue" style="width:fit-content;margin-bottom:0.5rem;">${item.category}</span>
        <h3 style="font-size:1.1rem;font-weight:700;color:var(--text-main);margin-bottom:0.5rem;">${item.name}</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.75rem;">${item.description}</p>
        <div style="font-size:0.8rem;color:var(--text-main);line-height:1.4;margin-bottom:0.75rem;background:var(--blue-soft);padding:0.6rem;border-radius:var(--radius-sm);">
          <strong>Dimensões & Critérios Oficiais:</strong> ${item.dimensions}
        </div>
        <div style="font-size:0.775rem;color:var(--text-light);margin-top:auto;">
          <strong>Manutenção & Inspeção:</strong> ${item.maintenance}
        </div>
      </div>
    `).join("");
  }
}

/* ==========================================================================
   BIBLIOTECA OFICIAL DE TREINAMENTOS
   ========================================================================== */
function renderTrainingsList() {
  const container = document.getElementById("trainings-list-container");
  if (!container || !window.TRAININGS_DATA) return;

  container.innerHTML = window.TRAININGS_DATA.map(t => `
    <div class="tech-card" style="margin-bottom:1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem;">
        <span class="badge badge-blue">${t.norm} • ${t.code}</span>
        <span class="badge badge-vigente">Carga Horária Inicial: ${t.initialHours}</span>
      </div>
      <h3 style="font-size:1.2rem;font-weight:800;color:var(--text-main);margin-bottom:0.4rem;">${t.title}</h3>
      <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.75rem;">
        <strong>Público-Alvo:</strong> ${t.targetAudience}
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.75rem;background:var(--bg-subtle);padding:0.85rem;border-radius:var(--radius-md);margin-bottom:1rem;font-size:0.825rem;">
        <div><strong>Reciclagem:</strong> ${t.periodicity} (${t.refreshHours})</div>
        <div><strong>Modalidade Permitida:</strong> ${t.allowedModalities}</div>
        <div><strong>Instrutor Requerido:</strong> ${t.instructorRequirements}</div>
      </div>
      <div>
        <h5 style="font-size:0.85rem;font-weight:700;color:var(--primary);margin-bottom:0.35rem;">Conteúdo Programático Mínimo:</h5>
        <ul style="padding-left:1.25rem;font-size:0.825rem;color:var(--text-muted);line-height:1.5;list-style:disc;">
          ${t.syllabus.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>
      <div style="margin-top:0.85rem;font-size:0.775rem;color:var(--text-light);border-top:1px solid var(--border-color);padding-top:0.5rem;">
        <strong>Fundamento Oficial:</strong> ${t.officialReference}
      </div>
    </div>
  `).join("");
}

/* ==========================================================================
   BIBLIOTECA DE MODELOS DE DOCUMENTOS E DOWNLOADS
   ========================================================================== */
function renderDocumentsList() {
  const container = document.getElementById("documents-list-grid");
  if (!container || !window.DOCUMENTS_DATA) return;

  container.innerHTML = window.DOCUMENTS_DATA.map(doc => `
    <div class="tech-card" style="display:flex;flex-direction:column;">
      <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
        <span class="badge badge-blue">${doc.code}</span>
        <span style="font-size:0.75rem;color:var(--text-light);">${doc.version}</span>
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;color:var(--text-main);margin-bottom:0.4rem;">${doc.title}</h3>
      <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.5;margin-bottom:1rem;flex-grow:1;">${doc.description}</p>
      <div style="font-size:0.75rem;color:var(--yellow);background:var(--yellow-soft);padding:0.5rem;border-radius:var(--radius-sm);margin-bottom:1rem;">
        ${doc.notice}
      </div>
      <div style="display:flex;gap:0.5rem;border-top:1px solid var(--border-color);padding-top:0.75rem;margin-top:auto;">
        <button class="btn btn-outline" style="flex:1;font-size:0.8rem;padding:0.4rem;" onclick="openDocumentModelModal('${doc.id}')">
          ${window.SST_ICONS.fileText} Visualizar Modelo
        </button>
        <button class="btn btn-primary" style="font-size:0.8rem;padding:0.4rem 0.75rem;" onclick="openDocumentModelModal('${doc.id}', true)">
          ${window.SST_ICONS.printer} Imprimir / PDF
        </button>
      </div>
    </div>
  `).join("");
}

window.openDocumentModelModal = function (docId, autoPrint = false) {
  const doc = window.DOCUMENTS_DATA.find(d => d.id === docId);
  if (!doc) return;

  const modal = document.getElementById("document-viewer-modal");
  const body = document.getElementById("document-modal-content");
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="printable-document">
      <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:1rem;margin-bottom:1.5rem;">
        <h2 style="font-size:1.35rem;font-weight:900;text-transform:uppercase;">${doc.title}</h2>
        <div style="font-size:0.85rem;color:#475569;">Código: ${doc.code} | Versão: ${doc.version} | Referência: ${doc.normReference}</div>
        <div style="font-size:0.75rem;color:#64748B;margin-top:0.25rem;">PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO</div>
      </div>

      <div style="font-size:0.775rem;background:#FEF3C7;border:1px solid #F59E0B;padding:0.5rem;margin-bottom:1rem;color:#B45309;">
        ${doc.notice}
      </div>

      ${doc.sections.map(sec => `
        <div style="margin-bottom:1.25rem;">
          <h4 style="font-size:0.95rem;font-weight:800;border-bottom:1px solid #CBD5E1;padding-bottom:0.25rem;margin-bottom:0.5rem;">${sec.title}</h4>
          ${sec.fields ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.5rem;font-size:0.85rem;">
              ${sec.fields.map(f => `
                <div style="background:#F8FAFC;padding:0.5rem;border:1px solid #E2E8F0;border-radius:4px;">
                  <span style="font-weight:600;color:#334155;">${f}</span>
                  <div style="border-bottom:1px dotted #94A3B8;height:22px;margin-top:4px;"></div>
                </div>
              `).join("")}
            </div>
          ` : ''}
          ${sec.columns ? `
            <div class="data-table-wrapper" style="margin-top:0.5rem;">
              <table class="data-table" style="font-size:0.8rem;">
                <thead>
                  <tr>${sec.columns.map(c => `<th>${c}</th>`).join("")}</tr>
                </thead>
                <tbody>
                  ${[1, 2, 3].map(row => `
                    <tr>${sec.columns.map(() => `<td style="height:35px;">&nbsp;</td>`).join("")}</tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : ''}
        </div>
      `).join("")}

      <div style="margin-top:2rem;border-top:1px solid #000;padding-top:1rem;display:flex;justify-content:space-around;text-align:center;font-size:0.8rem;">
        <div>
          <div style="width:200px;border-bottom:1px solid #000;margin:0 auto 4px auto;"></div>
          <span>Responsável Técnico / Emissor</span>
        </div>
        <div>
          <div style="width:200px;border-bottom:1px solid #000;margin:0 auto 4px auto;"></div>
          <span>Ciência do Empregado / Líder</span>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("open");

  if (autoPrint) {
    setTimeout(() => {
      window.print();
    }, 300);
  }
};

/* ==========================================================================
   NOTÍCIAS E ATUALIZAÇÕES REGULAMENTARES
   ========================================================================== */
function renderNewsList() {
  const container = document.getElementById("news-list-container");
  if (!container || !window.NEWS_DATA) return;

  container.innerHTML = window.NEWS_DATA.map(news => `
    <article class="tech-card" style="margin-bottom:1.5rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.4rem;">
        <span class="badge badge-blue">${news.category}</span>
        <span style="font-size:0.8rem;color:var(--text-light);">${news.publishDate}</span>
      </div>
      <h2 style="font-size:1.25rem;font-weight:800;color:var(--text-main);margin-bottom:0.5rem;">${news.title}</h2>
      <p style="font-size:0.9rem;color:var(--text-muted);line-height:1.6;margin-bottom:0.75rem;">${news.body}</p>
      
      <div style="background:var(--blue-soft);padding:0.75rem;border-radius:var(--radius-md);margin-bottom:0.75rem;font-size:0.85rem;color:var(--text-main);">
        <strong>Impacto Prático para Empresas:</strong> ${news.practicalImpact}
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-color);padding-top:0.5rem;font-size:0.775rem;">
        <span style="color:var(--green);font-weight:700;">Fonte Oficial: ${news.source}</span>
        <a href="${news.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--blue-accent);font-weight:700;display:flex;align-items:center;gap:4px;">
          Ver Documento Oficial ${window.SST_ICONS.externalLink}
        </a>
      </div>
    </article>
  `).join("");
}

/* ==========================================================================
   PERGUNTAS FREQUENTES (FAQ)
   ========================================================================== */
function renderFAQ() {
  const container = document.getElementById("faq-accordion-container");
  if (!container || !window.FAQ_DATA) return;

  container.innerHTML = window.FAQ_DATA.map((item, index) => `
    <div class="tech-card" style="margin-bottom:0.75rem;padding:1.25rem;cursor:pointer;" onclick="toggleFAQ(${index})">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.75rem;font-weight:700;color:var(--blue-accent);">${item.category}</span>
        <span id="faq-icon-${index}" style="font-size:1rem;color:var(--text-light);">▼</span>
      </div>
      <h4 style="font-size:1rem;font-weight:700;color:var(--text-main);margin-top:0.25rem;">${item.question}</h4>
      <div id="faq-ans-${index}" style="display:none;margin-top:0.75rem;font-size:0.875rem;color:var(--text-muted);line-height:1.6;border-top:1px solid var(--border-color);padding-top:0.75rem;">
        ${item.answer}
      </div>
    </div>
  `).join("");

  window.toggleFAQ = function (index) {
    const ans = document.getElementById(`faq-ans-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    if (ans) {
      const isHidden = ans.style.display === "none";
      ans.style.display = isHidden ? "block" : "none";
      if (icon) icon.textContent = isHidden ? "▲" : "▼";
    }
  };
}

/* ==========================================================================
   ASSISTENTE SST INTELIGENTE (INTERFACE DE CHAT)
   ========================================================================== */
function initAIAssistantUI() {
  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-user-input");
  const messagesArea = document.getElementById("ai-messages-area");
  const promptChips = document.querySelectorAll(".ai-prompt-chip");

  if (!messagesArea) return;

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Markdown simples (negrito, itálico, títulos, listas, código, links) com HTML escapado
  function renderMarkdown(md) {
    const inline = t => escapeHtml(t)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/【[^】]*】/g, ""); // remove marcadores de citação do agente
    const lines = String(md || "").replace(/\r/g, "").split("\n");
    let html = "", list = null;
    const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
    for (const line of lines) {
      let m;
      if ((m = line.match(/^\s*#{1,6}\s+(.*)$/))) {
        closeList(); html += `<h5>${inline(m[1])}</h5>`;
      } else if ((m = line.match(/^\s*[-*•]\s+(.*)$/))) {
        if (list !== "ul") { closeList(); html += "<ul>"; list = "ul"; }
        html += `<li>${inline(m[1])}</li>`;
      } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)$/))) {
        if (list !== "ol") { closeList(); html += "<ol>"; list = "ol"; }
        html += `<li>${inline(m[1])}</li>`;
      } else if (!line.trim()) {
        closeList();
      } else {
        closeList(); html += `<p>${inline(line)}</p>`;
      }
    }
    closeList();
    return html;
  }

  function feedbackFooter(item) {
    return `
            <div class="ai-response-footer">
              <span>Esta resposta foi útil para você?</span>
              <div class="ai-feedback-btns">
                <button class="ai-feedback-btn ${item.feedback === 'useful' ? 'btn-green' : ''}" onclick="submitFeedback('${item.id}', 'useful')">
                  ${window.SST_ICONS.thumbsUp} Útil
                </button>
                <button class="ai-feedback-btn ${item.feedback === 'not_useful' ? 'btn-outline' : ''}" onclick="submitFeedback('${item.id}', 'not_useful')">
                  ${window.SST_ICONS.thumbsDown} Não útil
                </button>
              </div>
            </div>`;
  }

  function renderAgentCard(item) {
    return `
        <div class="ai-message-row">
          <div class="ai-message-user">${escapeHtml(item.question)}</div>
          <div class="ai-response-card" id="${item.id}">
            <div class="ai-response-header">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span class="badge badge-vigente">Agente SST · Microsoft Foundry</span>
              </div>
              <button class="ai-feedback-btn" onclick="copyAIText('${item.id}')" title="Copiar resposta">
                ${window.SST_ICONS.copy} Copiar
              </button>
            </div>
            <div class="ai-response-section ai-agent-text">${renderMarkdown(item.response.text)}</div>
            <div style="font-size:0.75rem;color:var(--text-light);margin-top:0.75rem;font-style:italic;">
              ⚠️ Resposta gerada por IA com finalidade orientativa. Confira sempre o texto oficial das NRs e consulte um profissional de SST habilitado.
            </div>
            ${feedbackFooter(item)}
          </div>
        </div>`;
  }

  function renderPending(question) {
    return `
        <div class="ai-message-row">
          <div class="ai-message-user">${escapeHtml(question)}</div>
          <div class="ai-response-card ai-pending">
            <span class="ai-typing"><i></i><i></i><i></i></span>
            <span style="font-size:0.85rem;color:var(--text-light);">O agente está pensando…</span>
          </div>
        </div>`;
  }

  function renderMessages() {
    if (!window.AIAssistant) return;
    const history = window.AIAssistant.chatHistory;
    const pending = window.AIAssistant.pending;

    if (history.length === 0 && !pending) {
      messagesArea.innerHTML = `
        <div style="text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
          <div style="width:60px;height:60px;background:var(--blue-soft);color:var(--blue-accent);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem auto;">
            ${window.SST_ICONS.bot}
          </div>
          <h3 style="font-size:1.25rem;font-weight:800;color:var(--text-main);margin-bottom:0.5rem;">Assistente SST Inteligente</h3>
          <p style="font-size:0.9rem;max-width:550px;margin:0 auto 1.5rem auto;line-height:1.6;">
            Especializado em Normas Regulamentadoras vigentes, CLT, Legislação Previdenciária e eSocial SST.
            Faça sua pergunta em linguagem natural ou clique em uma das sugestões abaixo.
          </p>
        </div>
      `;
      return;
    }

    messagesArea.innerHTML = history.map(item => {
      const resp = item.response;
      if (resp && resp.type === "agent") return renderAgentCard(item);
      return `
        <div class="ai-message-row">
          <div class="ai-message-user">
            ${escapeHtml(item.question)}
          </div>
          <div class="ai-response-card" id="${item.id}">
            <div class="ai-response-header">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <span class="badge badge-vigente">${resp.relatedNorm}</span>
                <span style="font-size:0.8rem;color:var(--text-light);font-weight:600;">Item Aplicável: ${resp.applicableItem}</span>
              </div>
              <button class="ai-feedback-btn" onclick="copyAIText('${item.id}')" title="Copiar resposta">
                ${window.SST_ICONS.copy} Copiar
              </button>
            </div>

            ${resp.agentError ? `<div class="ai-agent-warning">Agente do Foundry indisponível (${escapeHtml(resp.agentError)}). Mostrando resposta da base local.</div>` : ""}
            <div class="ai-response-section">
              <h5>Resposta Objetiva</h5>
              <p><strong>${resp.objectiveAnswer}</strong></p>
            </div>

            <div class="ai-response-section">
              <h5>Fundamentação Legal & Portarias</h5>
              <p>${resp.legalGrounds}</p>
            </div>

            <div class="ai-response-section">
              <h5>Aplicação Prática em SST</h5>
              <p>${resp.practicalExplanation}</p>
            </div>

            <div class="ai-response-section">
              <h5>Responsabilidades Envolvidas</h5>
              <p>${resp.responsibilities}</p>
            </div>

            <div class="ai-response-meta-box">
              <div><strong>Documentos Relacionados:</strong> ${resp.relatedDocuments}</div>
              <div><strong>Fonte Oficial:</strong> ${resp.officialSource}</div>
              <div><strong>Data de Verificação:</strong> ${resp.lastVerificationDate}</div>
              <div><strong>Status:</strong> Legislação Vigente Conferida</div>
            </div>

            <div style="font-size:0.75rem;color:var(--text-light);margin-top:0.75rem;font-style:italic;">
              ⚠️ ${resp.disclaimer}
            </div>

            ${feedbackFooter(item)}
          </div>
        </div>
      `;
    }).join("") + (pending ? renderPending(pending) : "");

    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  window.AIAssistant.onUpdate = renderMessages;
  renderMessages();

  // Selo de status do agente no cabeçalho do chat
  window.AIAssistant.checkAgentStatus().then(st => {
    const el = document.getElementById("ai-agent-status");
    if (!el) return;
    if (st && st.configured) {
      el.textContent = "● Conectado ao agente do Microsoft Foundry";
      el.className = "ai-agent-status on";
    } else {
      el.textContent = st && st.offline
        ? "● Servidor offline — abra o site pelo \"npm start\""
        : "● Agente não configurado — usando base local";
      el.className = "ai-agent-status off";
    }
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const question = input.value.trim();
      if (!question) return;

      input.value = "";
      input.disabled = true;
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        await window.AIAssistant.ask(question);
        if (window.SST_ADMIN) window.SST_ADMIN.incrementMetric("totalAISearches");
      } finally {
        window.AIAssistant.pending = null;
        input.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
        input.focus();
        renderMessages();
      }
    });
  }

  promptChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const text = chip.getAttribute("data-prompt") || chip.textContent.trim();
      if (input) {
        input.value = text;
        if (form) form.dispatchEvent(new Event("submit"));
      }
    });
  });

  window.copyAIText = function (elementId) {
    const card = document.getElementById(elementId);
    if (!card) return;
    const text = card.innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert("Resposta técnica copiada para a área de transferência com sucesso!");
    });
  };

  window.submitFeedback = function (messageId, feedback) {
    if (window.AIAssistant) {
      window.AIAssistant.setFeedback(messageId, feedback);
      renderMessages();
    }
  };
}

/* ==========================================================================
   FERRAMENTAS GRATUITAS INTERATIVAS
   ========================================================================== */
function initInteractiveTools() {
  // 1. Matriz 5x5 Interativa
  const matrixContainer = document.getElementById("matrix-interactive-grid");
  const matrixResultBox = document.getElementById("matrix-result-details");

  if (matrixContainer && window.SST_TOOLS) {
    const severities = [
      { val: 5, label: "5 - Catastrófico" },
      { val: 4, label: "4 - Crítico" },
      { val: 3, label: "3 - Moderado" },
      { val: 2, label: "2 - Leve" },
      { val: 1, label: "1 - Desprezível" }
    ];

    let html = `
      <div class="matrix-header-cell">Sev \\ Prob</div>
      <div class="matrix-header-cell">1 - Raro</div>
      <div class="matrix-header-cell">2 - Pouco Provável</div>
      <div class="matrix-header-cell">3 - Provável</div>
      <div class="matrix-header-cell">4 - Muito Provável</div>
      <div class="matrix-header-cell">5 - Iminente</div>
    `;

    severities.forEach(s => {
      html += `<div class="matrix-header-cell">${s.val}</div>`;
      for (let p = 1; p <= 5; p++) {
        const info = window.SST_TOOLS.calculateRisk(p, s.val);
        html += `
          <div class="matrix-cell" style="background-color:${info.bg}; color:${info.color};" onclick="selectMatrixCell(${p}, ${s.val})">
            <span>${info.score}</span>
          </div>
        `;
      }
    });

    matrixContainer.innerHTML = html;

    window.selectMatrixCell = function (p, s) {
      const res = window.SST_TOOLS.calculateRisk(p, s);
      if (matrixResultBox) {
        matrixResultBox.innerHTML = `
          <div style="border-left: 4px solid ${res.color}; padding-left:1rem;">
            <div style="font-size:1.15rem; font-weight:800; color:${res.color}; margin-bottom:0.35rem;">
              Classificação: ${res.level} (Score: ${res.score} = Probabilidade ${res.p} × Severidade ${res.s})
            </div>
            <p style="font-size:0.925rem; color:var(--text-main); margin-bottom:0.5rem;"><strong>Ação Recomendada:</strong> ${res.action}</p>
            <p style="font-size:0.85rem; color:var(--text-light);"><strong>Prazo Máximo para Intervenção no PGR:</strong> ${res.deadline}</p>
          </div>
        `;
      }
    };

    // Seleciona padrão inicial
    window.selectMatrixCell(3, 3);
  }

  // 2. Calculadora TF e TG (NBR 14280)
  const calcForm = document.getElementById("calc-tftg-form");
  const calcResultBox = document.getElementById("calc-tftg-result");
  if (calcForm && window.SST_TOOLS) {
    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const n = document.getElementById("tftg-n").value;
      const perdidos = document.getElementById("tftg-perdidos").value;
      const debitados = document.getElementById("tftg-debitados").value;
      const hht = document.getElementById("tftg-hht").value;

      const res = window.SST_TOOLS.calculateIndicators(n, perdidos, debitados, hht);
      if (res.error) {
        alert(res.error);
        return;
      }

      if (calcResultBox) {
        calcResultBox.style.display = "block";
        calcResultBox.innerHTML = `
          <h4 style="font-size:1.1rem;font-weight:800;color:var(--primary);margin-bottom:0.75rem;">Resultados Oficiais conforme NBR 14280:</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--border-color);">
              <span style="font-size:0.8rem;color:var(--text-light);">Taxa de Frequência (TF)</span>
              <div style="font-size:1.6rem;font-weight:900;color:${res.tfColor};">${res.TF}</div>
              <span style="font-size:0.75rem;color:var(--text-muted);">acidentes com afastamento / milhão HHT</span>
            </div>
            <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--border-color);">
              <span style="font-size:0.8rem;color:var(--text-light);">Taxa de Gravidade (TG)</span>
              <div style="font-size:1.6rem;font-weight:900;color:var(--primary);">${res.TG}</div>
              <span style="font-size:0.75rem;color:var(--text-muted);">dias perdidos/debitados / milhão HHT</span>
            </div>
          </div>
          <div style="font-size:0.875rem;color:var(--text-main);">
            <strong>Enquadramento:</strong> ${res.tfClassification}
          </div>
        `;
      }
    });
  }

  // 3. Simulador de Dimensionamento da CIPA
  const cipaForm = document.getElementById("cipa-sim-form");
  const cipaResultBox = document.getElementById("cipa-sim-result");
  if (cipaForm && window.SST_TOOLS) {
    cipaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const gr = document.getElementById("cipa-gr").value;
      const qtd = document.getElementById("cipa-qtd").value;

      const res = window.SST_TOOLS.dimensionCIPA(gr, qtd);
      if (res.error) {
        alert(res.error);
        return;
      }

      if (cipaResultBox) {
        cipaResultBox.style.display = "block";
        if (res.precisaDesignado) {
          cipaResultBox.innerHTML = `
            <div style="background:var(--blue-soft);padding:1.25rem;border-radius:var(--radius-md);border-left:4px solid var(--blue-accent);">
              <h4 style="font-size:1.1rem;font-weight:800;color:var(--primary);margin-bottom:0.5rem;">Dispensa de Comissão Paritária — Designado da CIPA</h4>
              <p style="font-size:0.9rem;color:var(--text-main);line-height:1.6;">${res.observacao}</p>
            </div>
          `;
        } else {
          cipaResultBox.innerHTML = `
            <h4 style="font-size:1.15rem;font-weight:800;color:var(--primary);margin-bottom:0.75rem;">Composição da CIPA (Grau de Risco ${res.grauDeRisco} — ${res.totalFuncionarios} empregados):</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.75rem;margin-bottom:1rem;">
              <div style="background:var(--bg-surface);padding:0.85rem;border-radius:var(--radius-md);border:1px solid var(--border-color);">
                <span style="font-size:0.8rem;color:var(--text-light);">Eleitos pelos Empregados:</span>
                <div style="font-size:1.25rem;font-weight:800;color:var(--green);">${res.efetivosEleitos} Efetivos + ${res.suplentesEleitos} Suplentes</div>
              </div>
              <div style="background:var(--bg-surface);padding:0.85rem;border-radius:var(--radius-md);border:1px solid var(--border-color);">
                <span style="font-size:0.8rem;color:var(--text-light);">Indicados pelo Empregador:</span>
                <div style="font-size:1.25rem;font-weight:800;color:var(--blue-accent);">${res.efetivosIndicados} Efetivos + ${res.suplentesIndicados} Suplentes</div>
              </div>
              <div style="background:var(--bg-surface);padding:0.85rem;border-radius:var(--radius-md);border:1px solid var(--border-color);">
                <span style="font-size:0.8rem;color:var(--text-light);">Total de Cipeiros:</span>
                <div style="font-size:1.25rem;font-weight:800;color:var(--primary);">${res.totalMembros} membros</div>
              </div>
            </div>
            <p style="font-size:0.85rem;color:var(--text-muted);">${res.observacao}</p>
          `;
        }
      }
    });
  }

  // 4. Checklist Interativo de NR-35
  const checklistContainer = document.getElementById("nr35-checklist-items");
  if (checklistContainer && window.SST_TOOLS) {
    const items = window.SST_TOOLS.getNR35ChecklistItems();
    checklistContainer.innerHTML = items.map((item, idx) => `
      <div style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.75rem;border-bottom:1px solid var(--border-color);background:var(--bg-surface);">
        <input type="checkbox" id="chk-${item.id}" class="chk-nr35-item" style="width:20px;height:20px;margin-top:2px;" onchange="updateChecklistScore()">
        <label for="chk-${item.id}" style="font-size:0.88rem;color:var(--text-main);cursor:pointer;flex:1;">
          <span class="badge" style="background:var(--bg-subtle);font-size:0.7rem;margin-right:6px;">${item.category}</span>
          ${item.text}
        </label>
      </div>
    `).join("");

    window.updateChecklistScore = function () {
      const all = document.querySelectorAll(".chk-nr35-item");
      const checked = document.querySelectorAll(".chk-nr35-item:checked");
      const pct = Math.round((checked.length / all.length) * 100);
      const scoreBadge = document.getElementById("nr35-checklist-score");
      if (scoreBadge) {
        scoreBadge.textContent = `${pct}% de Conformidade (${checked.length}/${all.length} itens verificados)`;
        scoreBadge.style.color = pct === 100 ? "var(--green)" : pct >= 70 ? "var(--yellow)" : "var(--red)";
      }
    };
  }

  // 5. Gerador de APR Interativo
  const aprForm = document.getElementById("apr-interactive-form");
  if (aprForm && window.SST_GENERATORS) {
    const aprData = window.SST_GENERATORS.getDefaultAPR();
    const stepsTableBody = document.getElementById("apr-steps-tbody");

    function renderAPRSteps() {
      if (!stepsTableBody) return;
      stepsTableBody.innerHTML = aprData.steps.map((st, i) => `
        <tr>
          <td><input type="text" value="${st.step}" onchange="aprData.steps[${i}].step = this.value" style="width:100%;border:none;background:none;"></td>
          <td><input type="text" value="${st.hazard}" onchange="aprData.steps[${i}].hazard = this.value" style="width:100%;border:none;background:none;"></td>
          <td><input type="text" value="${st.consequence}" onchange="aprData.steps[${i}].consequence = this.value" style="width:100%;border:none;background:none;"></td>
          <td><input type="text" value="${st.controls}" onchange="aprData.steps[${i}].controls = this.value" style="width:100%;border:none;background:none;"></td>
          <td><input type="text" value="${st.responsible}" onchange="aprData.steps[${i}].responsible = this.value" style="width:100%;border:none;background:none;"></td>
          <td><button class="btn btn-outline" style="color:var(--red);padding:2px 6px;" onclick="removeAPRStep(${i})">X</button></td>
        </tr>
      `).join("");
    }

    window.addAPRStep = function () {
      aprData.steps.push({
        step: "Novo passo operacional",
        hazard: "Perigo a identificar",
        consequence: "Dano potencial",
        severity: 3,
        probability: 2,
        controls: "Medida preventiva",
        responsible: "Responsável"
      });
      renderAPRSteps();
    };

    window.removeAPRStep = function (index) {
      aprData.steps.splice(index, 1);
      renderAPRSteps();
    };

    renderAPRSteps();
  }
}

/* ==========================================================================
   ÁREA DO USUÁRIO & PAINEL ADMINISTRATIVO
   ========================================================================== */
function renderUserProfile() {
  const container = document.getElementById("user-profile-data-box");
  if (!container || !window.SST_AUTH) return;

  const user = window.SST_AUTH.currentUser;
  const favCount = window.SST_AUTH.favorites.length;
  const histCount = window.SST_AUTH.searchHistory.length;

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:1.5rem;">
      <div style="width:64px;height:64px;border-radius:50%;background:${user.avatarColor};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;">
        ${user.name.charAt(0)}
      </div>
      <div>
        <h3 style="font-size:1.35rem;font-weight:800;color:var(--text-main);">${user.name}</h3>
        <p style="font-size:0.875rem;color:var(--text-light);">${user.role} • ${user.registerCode}</p>
        <span class="badge ${user.isLoggedIn ? 'badge-vigente' : 'badge-blue'}">${user.isLoggedIn ? 'Usuário Autenticado' : 'Modo Visitante'}</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1.5rem;">
      <div class="tech-card" style="padding:1rem;">
        <span style="font-size:0.8rem;color:var(--text-light);">Normas Favoritadas:</span>
        <div style="font-size:1.5rem;font-weight:900;color:var(--primary);">${favCount}</div>
      </div>
      <div class="tech-card" style="padding:1rem;">
        <span style="font-size:0.8rem;color:var(--text-light);">Consultas no Histórico:</span>
        <div style="font-size:1.5rem;font-weight:900;color:var(--green);">${histCount}</div>
      </div>
    </div>

    <div class="tech-card">
      <h4>${window.SST_ICONS.starFilled} Suas Normas Regulamentadoras Favoritas</h4>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;">
        ${window.SST_AUTH.favorites.map(id => {
    const nr = window.NRS_DATA.find(n => n.id === id);
    return nr ? `
            <span class="filter-pill" style="cursor:pointer;" onclick="window.navigateTo('nr-detail', '${nr.id}')">
              NR-${nr.number} (${nr.title.slice(0, 25)}...)
            </span>
          ` : '';
  }).join("")}
      </div>
    </div>
  `;
}

function renderAdminPanel() {
  const container = document.getElementById("admin-audit-table-body");
  const metricsBox = document.getElementById("admin-metrics-cards");
  if (!window.SST_ADMIN) return;

  if (metricsBox) {
    const m = window.SST_ADMIN.metrics;
    metricsBox.innerHTML = `
      <div class="tech-card" style="padding:1rem;">
        <span style="font-size:0.8rem;color:var(--text-light);">Acessos a Normas:</span>
        <div style="font-size:1.5rem;font-weight:900;color:var(--blue-accent);">${m.totalNRVisits}</div>
      </div>
      <div class="tech-card" style="padding:1rem;">
        <span style="font-size:0.8rem;color:var(--text-light);">Consultas à IA:</span>
        <div style="font-size:1.5rem;font-weight:900;color:var(--green);">${m.totalAISearches}</div>
      </div>
      <div class="tech-card" style="padding:1rem;">
        <span style="font-size:0.8rem;color:var(--text-light);">Modelos Baixados:</span>
        <div style="font-size:1.5rem;font-weight:900;color:var(--yellow);">${m.totalDocsDownloaded}</div>
      </div>
      <div class="tech-card" style="padding:1rem;">
        <span style="font-size:0.8rem;color:var(--text-light);">Profissionais Ativos:</span>
        <div style="font-size:1.5rem;font-weight:900;color:var(--primary);">${m.totalActiveUsers}</div>
      </div>
    `;
  }

  if (container) {
    const logs = window.SST_ADMIN.auditLogs;
    container.innerHTML = logs.map(l => `
      <tr>
        <td><strong>${l.norm}</strong></td>
        <td>${l.timestamp}</td>
        <td>${l.author}</td>
        <td>${l.officialSource}</td>
        <td><span class="badge badge-revogada">${l.previousVersion}</span> ➔ <span class="badge badge-vigente">${l.currentVersion}</span></td>
        <td><span style="font-size:0.8rem;color:var(--text-muted);">${l.changeDescription}</span></td>
      </tr>
    `).join("");
  }
}

// Modal de Login
window.openLoginModal = function () {
  const modal = document.getElementById("login-modal");
  if (modal) modal.classList.add("open");
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("open");
};

