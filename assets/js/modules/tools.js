/**
 * FERRAMENTAS GRATUITAS INTERATIVAS DE SST
 * PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO
 * 1. Matriz de Avaliação de Risco 5x5 (NR-01)
 * 2. Calculadora de Indicadores de Acidentes (NBR 14280: TF e TG)
 * 3. Simulador de Dimensionamento da CIPA (NR-05)
 * 4. Calculadora de Sobrecarga Térmica IBUTG (NR-09 / NR-15)
 * 5. Checklist Interativo de Conformidade NR-35 (Trabalho em Altura)
 */

window.SST_TOOLS = {
  // 1. Matriz 5x5 Probabilidade x Severidade
  calculateRisk(prob, sev) {
    const p = parseInt(prob, 10);
    const s = parseInt(sev, 10);
    const score = p * s;

    let level = "Desprezível / Baixo";
    let color = "#10B981"; // Verde
    let bg = "rgba(16, 185, 129, 0.15)";
    let action = "Risco aceitável. Manter as medidas de controle existentes e monitorar periodicamente.";
    let deadline = "Revisão regular no ciclo do PGR (até 2 anos).";

    if (score >= 4 && score <= 6) {
      level = "Baixo a Médio";
      color = "#3B82F6"; // Azul
      bg = "rgba(59, 130, 246, 0.15)";
      action = "Adotar medidas complementares de controle e reforçar treinamentos e procedimentos.";
      deadline = "Ações corretivas em até 60 dias.";
    } else if (score >= 8 && score <= 12) {
      level = "Moderado / Alto";
      color = "#F59E0B"; // Amarelo/Laranja
      bg = "rgba(245, 158, 11, 0.15)";
      action = "Intervenção obrigatória. Elaborar plano de ação detalhado com medidas de proteção coletiva prioritárias.";
      deadline = "Ações corretivas em até 30 dias com monitoramento semanal.";
    } else if (score >= 15 && score <= 25) {
      level = "Crítico / Intolerável";
      color = "#EF4444"; // Vermelho
      bg = "rgba(239, 68, 68, 0.2)";
      action = "PARALISAÇÃO OU INTERVENÇÃO IMEDIATA. Não iniciar ou continuar o trabalho até que o risco seja reduzido a patamares aceitáveis.";
      deadline = "Ação imediata (em até 24 horas ou antes do início da atividade).";
    }

    return { p, s, score, level, color, bg, action, deadline };
  },

  // 2. Calculadora de Indicadores de Acidentes conforme NBR 14280
  // TF = (N * 1.000.000) / HHT
  // TG = (T * 1.000.000) / HHT
  calculateIndicators(numAcidentsWithLeave, totalLostDays, totalDebitedDays, workedManHours) {
    const N = parseFloat(numAcidentsWithLeave) || 0;
    const lost = parseFloat(totalLostDays) || 0;
    const debited = parseFloat(totalDebitedDays) || 0;
    const T = lost + debited;
    const HHT = parseFloat(workedManHours) || 0;

    if (HHT <= 0) {
      return { error: "As Horas-Homem Trabalhadas (HHT) devem ser maiores que zero." };
    }

    const TF = (N * 1000000) / HHT;
    const TG = (T * 1000000) / HHT;

    // Avaliação qualitativa do TF (parâmetro referencial da indústria)
    let tfClassification = "Excelente (Dentro dos padrões internacionais de excelência)";
    let tfColor = "#10B981";
    if (TF > 5 && TF <= 15) {
      tfClassification = "Bom (Com oportunidades de melhoria preventiva)";
      tfColor = "#3B82F6";
    } else if (TF > 15 && TF <= 30) {
      tfClassification = "Atenção (Taxa elevada de acidentes com afastamento)";
      tfColor = "#F59E0B";
    } else if (TF > 30) {
      tfClassification = "Crítico (Necessidade urgente de auditoria no PGR)";
      tfColor = "#EF4444";
    }

    return {
      N,
      T,
      HHT,
      TF: TF.toFixed(2),
      TG: TG.toFixed(2),
      tfClassification,
      tfColor
    };
  },

  // 3. Simulador de Dimensionamento da CIPA conforme Quadro I da NR-05
  dimensionCIPA(grauDeRisco, totalFuncionarios) {
    const gr = parseInt(grauDeRisco, 10);
    const qtd = parseInt(totalFuncionarios, 10);

    if (isNaN(qtd) || qtd <= 0) {
      return { error: "Informe uma quantidade válida de trabalhadores." };
    }

    // Regras resumidas oficiais do Quadro I da NR-05
    let efetivosEleitos = 0;
    let suplentesEleitos = 0;
    let efetivosIndicados = 0;
    let suplentesIndicados = 0;
    let precisaDesignado = false;
    let observacao = "";

    if (qtd < 20) {
      precisaDesignado = true;
      observacao = "Empresas com até 19 trabalhadores ficam dispensadas da constituição formal da comissão paritária, devendo nomear formalmente um Designado da CIPA para cumprir os objetivos da norma (com treinamento obrigatório).";
    } else {
      if (gr === 1) {
        if (qtd <= 50) { efetivosEleitos = 1; suplentesEleitos = 1; }
        else if (qtd <= 100) { efetivosEleitos = 2; suplentesEleitos = 2; }
        else if (qtd <= 200) { efetivosEleitos = 3; suplentesEleitos = 3; }
        else if (qtd <= 500) { efetivosEleitos = 4; suplentesEleitos = 3; }
        else if (qtd <= 1000) { efetivosEleitos = 5; suplentesEleitos = 4; }
        else { efetivosEleitos = 6 + Math.floor((qtd - 1000) / 1000) * 1; suplentesEleitos = 5; }
      } else if (gr === 2) {
        if (qtd <= 50) { efetivosEleitos = 1; suplentesEleitos = 1; }
        else if (qtd <= 100) { efetivosEleitos = 2; suplentesEleitos = 2; }
        else if (qtd <= 200) { efetivosEleitos = 4; suplentesEleitos = 3; }
        else if (qtd <= 500) { efetivosEleitos = 5; suplentesEleitos = 4; }
        else if (qtd <= 1000) { efetivosEleitos = 6; suplentesEleitos = 5; }
        else { efetivosEleitos = 7 + Math.floor((qtd - 1000) / 1000) * 2; suplentesEleitos = 6; }
      } else if (gr === 3) {
        if (qtd <= 50) { efetivosEleitos = 2; suplentesEleitos = 2; }
        else if (qtd <= 100) { efetivosEleitos = 3; suplentesEleitos = 3; }
        else if (qtd <= 200) { efetivosEleitos = 5; suplentesEleitos = 4; }
        else if (qtd <= 500) { efetivosEleitos = 7; suplentesEleitos = 5; }
        else if (qtd <= 1000) { efetivosEleitos = 8; suplentesEleitos = 6; }
        else { efetivosEleitos = 9 + Math.floor((qtd - 1000) / 1000) * 2; suplentesEleitos = 7; }
      } else if (gr === 4) {
        if (qtd <= 50) { efetivosEleitos = 3; suplentesEleitos = 3; }
        else if (qtd <= 100) { efetivosEleitos = 4; suplentesEleitos = 4; }
        else if (qtd <= 200) { efetivosEleitos = 6; suplentesEleitos = 5; }
        else if (qtd <= 500) { efetivosEleitos = 8; suplentesEleitos = 6; }
        else if (qtd <= 1000) { efetivosEleitos = 9; suplentesEleitos = 7; }
        else { efetivosEleitos = 10 + Math.floor((qtd - 1000) / 1000) * 3; suplentesEleitos = 8; }
      }

      efetivosIndicados = efetivosEleitos;
      suplentesIndicados = suplentesEleitos;
      observacao = `Comissão constituída em caráter paritário. Carga horária do treinamento obrigatório dos membros: Grau ${gr} = ${gr === 1 || gr === 2 ? "12 horas" : gr === 3 ? "16 horas" : "20 horas"}.`;
    }

    const totalMembros = (efetivosEleitos + suplentesEleitos) + (efetivosIndicados + suplentesIndicados);

    return {
      grauDeRisco: gr,
      totalFuncionarios: qtd,
      precisaDesignado,
      efetivosEleitos,
      suplentesEleitos,
      efetivosIndicados,
      suplentesIndicados,
      totalMembros,
      observacao
    };
  },

  // 4. Calculadora de Sobrecarga Térmica (IBUTG)
  // Sem carga solar: IBUTG = 0,7 * tbn + 0,3 * tg
  // Com carga solar: IBUTG = 0,7 * tbn + 0,1 * tbs + 0,2 * tg
  calculateIBUTG(tbn, tg, tbs, comCargaSolar) {
    const Tbn = parseFloat(tbn);
    const Tg = parseFloat(tg);
    const Tbs = parseFloat(tbs) || 0;

    if (isNaN(Tbn) || isNaN(Tg)) {
      return { error: "Preencha a Temperatura de Bulbo Úmido Natural (Tbn) e a Temperatura de Globo (Tg)." };
    }

    let ibutg = 0;
    if (comCargaSolar) {
      if (isNaN(Tbs)) {
        return { error: "Para medição em ambientes externos com carga solar, a Temperatura de Bulbo Seco (Tbs) é obrigatória." };
      }
      ibutg = 0.7 * Tbn + 0.1 * Tbs + 0.2 * Tg;
    } else {
      ibutg = 0.7 * Tbn + 0.3 * Tg;
    }

    return {
      ibutg: ibutg.toFixed(1),
      comCargaSolar,
      formula: comCargaSolar ? "IBUTG = 0,7×Tbn + 0,1×Tbs + 0,2×Tg" : "IBUTG = 0,7×Tbn + 0,3×Tg",
      standardComparison: "Conforme o Anexo III da NR-09 e Anexo 3 da NR-15, o limite de tolerância varia de acordo com o gasto metabólico (Taxa Metabólica 'M' em Watts) da atividade (Leve, Moderada ou Pesada)."
    };
  },

  // 5. Itens do Checklist de NR-35 (Trabalho em Altura)
  getNR35ChecklistItems() {
    return [
      { id: "c1", category: "Documentação & Aptidão", text: "Trabalhador possui ASO válido com aptidão expressa para trabalho em altura?", required: true },
      { id: "c2", category: "Documentação & Aptidão", text: "Trabalhador possui certificado de capacitação na NR-35 (8h) dentro da validade bienal?", required: true },
      { id: "c3", category: "Planejamento & Liberação", text: "Análise Preliminar de Risco (APR) foi elaborada e assinada por todos os executantes?", required: true },
      { id: "c4", category: "Planejamento & Liberação", text: "Permissão de Trabalho (PT) foi emitida e autorizada pelo responsável do turno?", required: true },
      { id: "c5", category: "Condições Ambientais", text: "As condições climáticas estão favoráveis (sem chuvas, ventos fortes ou descargas elétricas)?", required: true },
      { id: "c6", category: "Sistemas Contra Queda", text: "O ponto de ancoragem ou linha de vida possui certificação e suporte a 15 kN?", required: true },
      { id: "c7", category: "EPIs em Altura", text: "O cinturão paraquedista e os talabartes com absorvedor de impacto estão sem danos aparentes?", required: true },
      { id: "c8", category: "Isolamento de Área", text: "A área no nível inferior foi delimitada e sinalizada contra queda de ferramentas e peças?", required: true },
      { id: "c9", category: "Emergência & Resgate", text: "Há plano de resgate estruturado e equipamentos de resgate disponíveis no local?", required: true },
      { id: "c10", category: "Fator de Queda", text: "O ponto de ancoragem está posicionado acima da cabeça do trabalhador (Fator de Queda 0 ou 1)?", required: false }
    ];
  }
};
