/**
 * CATÁLOGO TÉCNICO DE EPIs E EPCs
 * PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO
 * Em conformidade com a NR-06, Portaria MTP nº 2.175/2022 e Portaria MTP nº 672/2021
 */

window.EQUIPMENT_DATA = {
  epis: [
    {
      id: "capacete-seguranca",
      name: "Capacete de Segurança (Classe A e Classe B)",
      category: "Proteção da Cabeça",
      caInfo: "Certificado de Aprovação (CA) obrigatório gravado em alto relevo no casco e na carneira.",
      purpose: "Proteção do crânio contra impactos de objetos em queda, colisões e perfurações.",
      classes: "Classe A: impacto mecânico geral. Classe B: impacto mecânico e isolamento contra choques elétricos de até 20.000 Volts.",
      indications: "Construção civil, manutenção industrial, operações com pontes rolantes, redes elétricas e mineração.",
      limitations: "Não protege contra impactos na nuca ou laterais excessivas se a carneira estiver frouxa ou sem jugular.",
      conservation: "Lavar com água e sabão neutro; não utilizar solventes orgânicos ou tintas que fragilizem o polietileno; armazenar ao abrigo do sol.",
      replacementCriteria: "Substituir imediatamente após sofrer impacto severo (mesmo sem trinca aparente), trincas visíveis, deformações ou esgotamento do prazo de validade do fabricante (geralmente 3 a 5 anos)."
    },
    {
      id: "oculos-protecao",
      name: "Óculos de Proteção e Ampla Visão",
      category: "Proteção dos Olhos e Face",
      caInfo: "CA obrigatório gravado na armação e na lente conforme ANSI/ISEA Z87.1.",
      purpose: "Proteção dos olhos contra projeção de partículas volantes sólidas, respingos químicos e radiação luminosa intensa.",
      classes: "Lente incolor: proteção contra impacto. Lente fumê/cinza: radiação solar. Lente verde tonalidade 3 a 5: corte oxicombustível e solda branda.",
      indications: "Usinagem, corte com esmerilhadeira, manuseio de frascos químicos em laboratórios e canteiros de obras.",
      limitations: "Óculos convencionais não vedam contra vapores ou névoas químicas densas (exige óculos ampla visão hermético).",
      conservation: "Limpeza diária com água corrente e detergente neutro; secagem com papel macio; não deixar as lentes viradas para baixo em superfícies ásperas.",
      replacementCriteria: "Lentes riscadas com perda de transparência visual ou armação frouxa/quebrada."
    },
    {
      id: "protetor-auditivo",
      name: "Protetor Auditivo (Tipo Plug e Tipo Concha / Abafador)",
      category: "Proteção Auditiva",
      caInfo: "CA com ensaio laboratorial indicando o Nível de Redução de Ruído Subject Fit (NRRsf em dB).",
      purpose: "Atenuação de níveis excessivos de pressão sonora para evitar a Perda Auditiva Induzida por Ruído (PAIRO).",
      classes: "Plug de silicone/copolímero (NRRsf médio 14 a 18 dB); Plug de espuma moldável (NRRsf 18 a 22 dB); Abafador tipo concha (NRRsf 18 a 26 dB); Dupla proteção (concha + plug) para ruídos acima de 105 dB(A).",
      indications: "Caldeirarias, prensas, britagem, aeroportos e marcenarias com ruído acima de 80 dB(A).",
      limitations: "Atenuação depende fundamentalmente da vedação e da correta inserção no canal auditivo.",
      conservation: "Plugs de silicone: lavar diariamente com água morna e sabão neutro e guardar na caixinha estojo; Plugs de espuma: descartáveis.",
      replacementCriteria: "Almofadas da concha ressecadas ou mola de pressão do arco frouxa; plugs de silicone endurecidos ou rasgados."
    },
    {
      id: "respirador-pff2",
      name: "Respirador Purificador de Ar (Peça Semifacial Filtrante PFF1, PFF2 e PFF3)",
      category: "Proteção Respiratória",
      caInfo: "Selo do Inmetro e CA gravados no próprio corpo da máscara conforme ABNT NBR 13698.",
      purpose: "Retenção de partículas aéreas, poeiras, névoas tóxicas, fumos metálicos e agentes biológicos patogênicos.",
      classes: "PFF1: poeiras e névoas inertes. PFF2/N95: fumos de solda, aerossóis biológicos e vírus. PFF3: radionuclídeos, asbesto e poeiras altamente tóxicas.",
      indications: "Ambientes hospitalares, soldagem, corte a seco de concreto, jateamento e manipulação de pós.",
      limitations: "NUNCA usar em atmosferas com deficiência de oxigênio (menos de 19,5% de O2) ou contra gases e vapores químicos tóxicos.",
      conservation: "Guardar em saco plástico limpo e seco individualizado; não lavar com água ou álcool (destrói as cargas eletrostáticas do filtro).",
      replacementCriteria: "Substituir sempre que saturado (resistência à respiração aumentada), úmido, deformado, sujo internamente ou com elásticos frouxos."
    },
    {
      id: "luvas-seguranca",
      name: "Luvas de Proteção (Vaqueta, Nitrílica, Látex e Anticorte)",
      category: "Proteção dos Membros Superiores",
      caInfo: "CA obrigatório com indicação dos pictogramas mecânicos (EN 388), químicos (EN 374) ou térmicos (EN 407).",
      purpose: "Proteção das mãos contra abrasão, perfuração, corte por lâminas, agentes químicos e queimaduras.",
      classes: "Vaqueta/Raspa: carga mecânica pesada e solda. Nitrílica: óleos, graxas e solventes orgânicos. Anticorte de fios de aço/HPPE: manuseio de vidros e chapas de aço cortantes.",
      indications: "Oficinas, indústrias automotivas, galvanoplastia, madeireiras e manutenção predial.",
      limitations: "PROIBIDO o uso de luvas na operação de eixos rotativos de tornos mecânicos e furadeiras de bancada pelo grave risco de agarramento e degolamento.",
      conservation: "Manter limpas e secas em local ventilado; luvas químicas devem ser enxaguadas antes de serem retiradas.",
      replacementCriteria: "Furos, rasgos, ressecamento químico ou desgaste acentuado nas palmas."
    },
    {
      id: "calcado-seguranca",
      name: "Calçado de Segurança (Botina com Biqueira de Aço / Composite)",
      category: "Proteção dos Membros Inferiores",
      caInfo: "CA e marcação da biqueira gravados no calçado conforme ABNT NBR ISO 20345.",
      purpose: "Proteção dos pés contra impacto de objetos pesados, perfuração por pregos na sola, choque elétrico e torções.",
      classes: "Biqueira de Aço: impacto de até 200 Joules. Biqueira de Composite: impacto de 200 Joules com isolamento dielétrico (sem metal). Solado bidensidade de PU antiderrapante.",
      indications: "Indústrias, armazéns, obras civis, serviços elétricos e agropecuária.",
      limitations: "Calçados convencionais de couro não protegem contra respingos de ácidos fortes (exigem botas de PVC ou borracha nitrílica).",
      conservation: "Secar à sombra se molhado; engraxar periodicamente para manter o couro hidratado; higienizar palmilhas.",
      replacementCriteria: "Biqueira exposta por desgaste do couro, sola gasta sem ranhuras antiderrapantes, furos ou descolamento lateral."
    },
    {
      id: "cinto-paraquedista",
      name: "Cinturão de Segurança Tipo Paraquedista e Talabarte com Absorvedor",
      category: "Proteção Contra Quedas de Altura",
      caInfo: "CA gravado em etiqueta indelével costurada no cinturão conforme ABNT NBR 15836.",
      purpose: "Retenção de quedas distribuindo as forças de frenagem pelas coxas, bacia, tórax e ombros (máximo 6 kN com absorvedor).",
      classes: "Cinto com 1 ponto dorsal (retenção); Cinto com ponto dorsal e peitoral; Cinto para trabalho a quente em aramida resistente a fagulhas.",
      indications: "Trabalhos em altura acima de 2 metros em andaimes, plataformas elevatórias, postes e telhados (NR-35).",
      limitations: "Deve ser obrigatoriamente utilizado com elemento de ligação compatível (talabarte duplo com absorvedor de impacto ou trava-quedas retrátil).",
      conservation: "Inspecionar costuras, fivelas metálicas e fitas antes de cada uso; nunca lavar com alvejante; armazenar pendurado em local seco.",
      replacementCriteria: "Substituir IMEDIATAMENTE após reter uma queda (deve ser inutilizado cortando as fitas), sinais de queimadura, corte em fibras ou ferrugem em mosquetões."
    }
  ],
  epcs: [
    {
      id: "guarda-corpo",
      name: "Sistema de Guarda-Corpo e Rodapé Rígido",
      category: "Proteção Coletiva Contra Quedas",
      description: "Barreira física rígida instalada em periferias de lajes, escadas, passarelas e plataformas para impedir a queda de pessoas e ferramentas.",
      dimensions: "Conforme NR-18 e NR-35: travessão superior a 1,20m de altura; travessão intermediário a 0,70m; rodapé de proteção com no mínimo 0,20m (20cm) de altura totalmente vedado no piso; resistência mínima de 90 kgf/m linear no topo.",
      maintenance: "Inspeção visual periódica de fixações e soldas."
    },
    {
      id: "linha-de-vida",
      name: "Linha de Vida e Sistema de Ancoragem Projetado",
      category: "Proteção Coletiva Contra Quedas",
      description: "Cabo de aço galvanizado ou inoxidável ancorado em estruturas calculadas, permitindo a ancoragem contínua de um ou múltiplos trabalhadores em altura.",
      dimensions: "Cabo de aço de no mínimo 8mm (5/16\") ou conforme memória de cálculo com projeto e ART de Engenheiro Civil/Mecânico; suporta carga estática mínima de 15 kN por usuário conectado.",
      maintenance: "Inspeção anual com teste de arrancamento por torquímetro nos pontos de ancoragem química."
    },
    {
      id: "ventilacao-exaustao",
      name: "Sistemas de Ventilação Local Exaustora (VLE)",
      category: "Proteção Coletiva Ambiental",
      description: "Coifas, dutos e ciclones de captação instalados na fonte geradora de pós, fumos metálicos ou gases tóxicos para impedir a dispersão no ar respirável.",
      dimensions: "Velocidade de captura adequada (m/s) segundo os padrões do manual ACGIH de Ventilação Industrial.",
      maintenance: "Substituição periódica de filtros de manga e medição anual de pressão estática e vazão com anemômetro calibrado."
    },
    {
      id: "chuveiro-lavaolhos",
      name: "Chuveiro de Emergência e Lava-Olhos Conjugado",
      category: "Proteção Coletiva de Emergência",
      description: "Dispositivo acionado por pedal ou barra manual instalado a no máximo 10 segundos de caminhada desobstruída de áreas com produtos químicos corrosivos.",
      dimensions: "Conforme ANSI/ISEA Z358.1: água potável em temperatura morna (16ºC a 38ºC); vazão mínima de 75,7 L/min no chuveiro e 1,5 L/min no lava-olhos durante 15 minutos contínuos.",
      maintenance: "Teste funcional semanal de acionamento com registro em planilha ao lado do equipamento."
    },
    {
      id: "bloqueio-loto",
      name: "Sistema de Bloqueio e Etiquetagem (Lockout & Tagout - LOTO)",
      category: "Proteção Coletiva Operacional",
      description: "Conjunto de cadeados de segurança vermelhos de segredo único, garras de travamento múltilplas e cartões de advertência personalizados com foto para neutralização de energias perigosas.",
      dimensions: "Dispositivos adaptados a disjuntores, registros de esfera, volantes de vapor e tomadas elétricas industriais.",
      maintenance: "Auditoria periódica de cumprimento do procedimento de desenergização e teste de energia residual zero."
    }
  ]
};
