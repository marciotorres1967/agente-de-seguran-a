/**
 * MÓDULO DE AUTENTICAÇÃO E ÁREA DO USUÁRIO
 * PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO
 * Perfis: Visitante, Técnico de SST, Engenheiro de Segurança, Médico do Trabalho, Administrador
 */

window.SST_AUTH = {
  storageKeyUser: "portal_sst_logged_user",
  storageKeyFavorites: "portal_sst_user_favorites",
  storageKeyHistory: "portal_sst_search_history",
  storageKeySavedDocs: "portal_sst_saved_documents",

  currentUser: null,
  favorites: [],
  searchHistory: [],
  savedDocs: [],

  init() {
    this.loadSession();
    this.loadUserData();
  },

  loadSession() {
    try {
      const stored = localStorage.getItem(this.storageKeyUser);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      } else {
        // Usuário padrão visitante autenticado inicialmente como profissional demonstrativo
        this.currentUser = {
          id: "usr-guest",
          name: "Profissional Visitante",
          email: "visitante@portalsstbrasil.com.br",
          role: "Técnico em Segurança do Trabalho",
          registerCode: "MTE/SP 001234",
          company: "Consultoria SST Brasil",
          avatarColor: "#1E6091",
          isLoggedIn: false
        };
      }
    } catch (e) {
      console.warn("Erro ao carregar sessão:", e);
    }
  },

  loadUserData() {
    try {
      const favs = localStorage.getItem(this.storageKeyFavorites);
      this.favorites = favs ? JSON.parse(favs) : ["nr-01", "nr-06", "nr-10", "nr-12", "nr-35"];

      const hist = localStorage.getItem(this.storageKeyHistory);
      this.searchHistory = hist ? JSON.parse(hist) : ["NR-35 altura", "PGR obrigatoriedade", "CAT prazo eSocial", "Insalubridade ruído"];

      const docs = localStorage.getItem(this.storageKeySavedDocs);
      this.savedDocs = docs ? JSON.parse(docs) : [];
    } catch (e) {
      console.warn("Erro ao carregar dados do usuário:", e);
    }
  },

  login(email, password, role) {
    if (!email || !password) {
      return { success: false, message: "Preencha o e-mail e a senha." };
    }

    const userName = email.split("@")[0].replace(/[._]/g, " ").toUpperCase();
    this.currentUser = {
      id: "usr-" + Date.now(),
      name: userName || "PROFISSIONAL SST",
      email: email,
      role: role || "Engenheiro de Segurança do Trabalho",
      registerCode: "CREA/CFT Ativo",
      company: "Gestão Integrada de SST",
      avatarColor: "#059669",
      isLoggedIn: true
    };

    localStorage.setItem(this.storageKeyUser, JSON.stringify(this.currentUser));
    return { success: true, user: this.currentUser };
  },

  logout() {
    this.currentUser = {
      id: "usr-guest",
      name: "Profissional Visitante",
      email: "visitante@portalsstbrasil.com.br",
      role: "Visitante",
      registerCode: "Não Informado",
      company: "Não Informada",
      avatarColor: "#1E6091",
      isLoggedIn: false
    };
    localStorage.removeItem(this.storageKeyUser);
  },

  toggleFavorite(nrId) {
    const idx = this.favorites.indexOf(nrId);
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(nrId);
    }
    localStorage.setItem(this.storageKeyFavorites, JSON.stringify(this.favorites));
    return this.isFavorite(nrId);
  },

  isFavorite(nrId) {
    return this.favorites.includes(nrId);
  },

  addSearchHistory(term) {
    if (!term || typeof term !== "string") return;
    const clean = term.trim();
    if (!clean) return;

    // Remove duplicação
    this.searchHistory = this.searchHistory.filter(item => item.toLowerCase() !== clean.toLowerCase());
    this.searchHistory.unshift(clean);

    // Mantém os últimos 15
    if (this.searchHistory.length > 15) {
      this.searchHistory = this.searchHistory.slice(0, 15);
    }
    localStorage.setItem(this.storageKeyHistory, JSON.stringify(this.searchHistory));
  },

  clearSearchHistory() {
    this.searchHistory = [];
    localStorage.removeItem(this.storageKeyHistory);
  }
};
