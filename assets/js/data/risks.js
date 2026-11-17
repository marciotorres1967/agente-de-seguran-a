/**
 * BANCO DE DADOS DE RISCOS OCUPACIONAIS (GRO — GERENCIAMENTO DE RISCOS OCUPACIONAIS)
 * Classificação conforme Portaria SEPRT nº 6.730/2020 (NR-01) e Fundacentro
 */

window.RISKS_DATA = {
  hierarchyOfControls: [
    {
      level: 1,
      title: "1. Eliminação do Perigo",
      description: "Remover fisicamente o perigo do local de trabalho (a medida mais eficaz).",
      examples: "Automatizar um processo perigoso eliminando a necessidade de intervenção humana em ponto de prensagem; eliminar o uso de produto químico cancerígeno."
    },
    {
      level: 2,
      title: "2. Substituição",
      description: "Substituir o perigo por algo menos perigoso.",
      examples: "Substituir tinta à base de solvente orgânico volátil por tinta à base de água; substituir máquina ruidosa antiga por modelo com motor elétrico silencioso."
    },
    {
      level: 3,
      title: "3. Medidas de Proteção Coletiva (EPC / Engenharia)",
      description: "Isolar os trabalhadores do perigo através de barreiras físicas e projetos de engenharia.",
      examples: "Instalação de exaustores de fumos de solda, enclausuramento acústico de compressores, guarda-corpos e telas de proteção em periferias de laje."
    },
    {
      level: 4,
      title: "4. Medidas Administrativas e de Organização",
      description: "Mudar a maneira como as pessoas trabalham mediante procedimentos, rodízios e capacitação.",
      examples: "Rodízio de colaboradores para reduzir a dose de ruído diária; sinalização de segurança; elaboração de APR e Permissão de Trabalho (PT)."
    },
    {
      level: 5,
      title: "5. Equipamento de Proteção Individual (EPI)",
      description: "Proteger o trabalhador com um equipamento de uso pessoal (última linha de defesa).",
      examples: "Uso de protetor auditivo, respirador PFF2, cinto paraquedista, luvas químicas, calçado de segurança com biqueira de composite."
    }
  ],
  categories: [
    {
      id: "fisicos",
      name: "Riscos Físicos",
      color: "#2563EB",
      icon: "activity",
      definition: "Diversas formas de energia a que possam estar expostos os trabalhadores, tais como ruído, vibrações, pressões anormais, temperaturas extremas, radiações ionizantes, radiações não ionizantes, bem como o infrassom e o ultrassom.",
      agents: [
        {
          name: "Ruído Contínuo ou Intermitente",
          unit: "dB(A)",
          normativeLimits: "85 dB(A) para jornada de 8h (NR-15 Anexo 1 / NHO 01 Fundacentro). Nível de Ação: 80 dB(A).",
          healthEffects: "Perda Auditiva Induzida por Ruído Ocupacional (PAIRO), zumbido crônico, estresse, irritabilidade e hipertensão.",
          preventiveMeasures: "Enclausuramento acústico de fontes, manutenção de rolamentos, protetores auditivos tipo plug ou concha com NRRsf adequado.",
          norms: ["NR-01", "NR-07 (Anexo II)", "NR-09", "NR-15 (Anexo 1)"]
        },
        {
          name: "Calor Ocupacional (Sobrecarga Térmica)",
          unit: "IBUTG (ºC)",
          normativeLimits: "Variável por taxa metabólica da atividade (NR-09 Anexo III / NR-15 Anexo 3 / NHO 06 Fundacentro).",
          healthEffects: "Desidratação, insolação, síncope térmica, cãibras de calor e choque térmico com falência múltipla de órgãos.",
          preventiveMeasures: "Isolamento térmico de fontes de calor, climatização de ambientes, pausas para repouso em local fresco e fornecimento abundante de água potável.",
          norms: ["NR-01", "NR-09 (Anexo III)", "NR-15 (Anexo 3)"]
        },
        {
          name: "Vibração de Mãos e Braços (VMB) e Corpo Inteiro (VCI)",
          unit: "m/s² (aren) e VDVR (m/s^1,75)",
          normativeLimits: "VMB: aren = 5 m/s² (limite de exposição). VCI: aren = 1,1 m/s² ou VDVR = 21 m/s^1,75 (NR-09 Anexo I / NR-15 Anexo 8 / NHO 09/10).",
          healthEffects: "Síndrome do dedo branco (fenômeno de Raynaud), lesões osteoarticulares na coluna lombar e hérnias discais.",
          preventiveMeasures: "Bancos pneumáticos em tratores e empilhadeiras, ferramentas pneumáticas balanceadas e luvas antivibração.",
          norms: ["NR-09 (Anexo I)", "NR-15 (Anexo 8)"]
        },
        {
          name: "Radiações Ionizantes",
          unit: "mSv (milisievert)",
          normativeLimits: "20 mSv/ano (média em 5 anos) conforme normas da Comissão Nacional de Energia Nuclear (CNEN NN 3.01).",
          healthEffects: "Mutações genéticas celulares, queimaduras de radiação e desenvolvimento de diversos tipos de neoplasias (câncer).",
          preventiveMeasures: "Blindagem de chumbo, dosimetria individual mensal obrigatória e limitação do tempo de exposição.",
          norms: ["NR-15 (Anexo 5)", "NR-32"]
        },
        {
          name: "Frio Extremo",
          unit: "ºC",
          normativeLimits: "Conforme mapa de zonas bioclimáticas da Portaria MTb 3.214/78 Anexo 9 da NR-15 e art. 253 da CLT.",
          healthEffects: "Hipotermia, congelamento de extremidades (geladuras) e doenças respiratórias crônicas.",
          preventiveMeasures: "Vestimenta térmica completa (japona, capuz, calça, meias e luvas frigoríficas) e pausas térmicas do art. 253 CLT.",
          norms: ["NR-15 (Anexo 9)", "NR-36"]
        }
      ]
    },
    {
      id: "quimicos",
      name: "Riscos Químicos",
      color: "#DC2626",
      icon: "flask-conical",
      definition: "Substâncias, compostos ou produtos que possam penetrar no organismo pela via respiratória, nas formas de poeiras, fumos, névoas, neblinas, gases ou vapores, ou que, pela natureza da atividade de exposição, possam ter contato ou ser absorvidos pelo organismo através da pele ou por ingestão.",
      agents: [
        {
          name: "Poeiras Minerais (Sílica Livre Cristalina e Asbesto)",
          unit: "mg/m³",
          normativeLimits: "Sílica: avaliada pela fração respirável (NHO 08 / NR-15 Anexo 12). Asbesto: proibido em todo o território nacional (STF ADI 4066).",
          healthEffects: "Silicose pulmonar irreversível, fibrose, asbestose e mesotelioma pleura/peritônio.",
          preventiveMeasures: "Umidificação de perfurações em mineração e obras, captação localizada de pó e respiradores PFF3 / peça semifacial.",
          norms: ["NR-09", "NR-15 (Anexo 12)", "NR-18", "NR-22"]
        },
        {
          name: "Fumos Metálicos de Soldagem (Manganês, Cromo, Níquel)",
          unit: "mg/m³",
          normativeLimits: "NR-15 Anexo 11 e limites ACGIH.",
          healthEffects: "Febre dos fumos metálicos, manganismo (sintomas semelhantes ao Parkinson) e câncer pulmonar.",
          preventiveMeasures: "Tochas de solda com exaustão integrada, cabines de soldagem ventiladas e máscaras de solda com adução de ar.",
          norms: ["NR-09", "NR-15", "NR-18", "NR-34"]
        },
        {
          name: "Vapores Orgânicos (Benzeno, Tolueno, Xileno, Solventes)",
          unit: "ppm ou mg/m³",
          normativeLimits: "NR-15 Anexo 11 e Anexo II da NR-09 (Acordo Nacional do Benzeno).",
          healthEffects: "Leucemia mielóide, depressão do sistema nervoso central, hepatotoxicidade e nefrotoxicidade.",
          preventiveMeasures: "Recuperadores de vapor em bicos de abastecimento, ventilação forçada e respiradores com filtros químicos classe 1.",
          norms: ["NR-09 (Anexo II)", "NR-15 (Anexo 11 e 13)", "NR-20"]
        },
        {
          name: "Gases Asfixiantes (Monóxido de Carbono - CO, Gás Sulfídrico - H2S)",
          unit: "ppm",
          normativeLimits: "CO: 39 ppm; H2S: 8 ppm (NR-15 Anexo 11).",
          healthEffects: "Asfixia química instantânea por perda de capacidade de transporte de oxigênio da hemoglobina, coma e óbito em minutos.",
          preventiveMeasures: "Detecção multigás contínua com alarme sonoro/vibratório, ventilação mecânica forçada e resgate com ar mandado.",
          norms: ["NR-15 (Anexo 11)", "NR-33"]
        }
      ]
    },
    {
      id: "biologicos",
      name: "Riscos Biológicos",
      color: "#059669",
      icon: "bug",
      definition: "Microorganismos como bactérias, vírus, fungos, parasitas, bacilos e toxinas com potencial patogênico que podem causar infecções e parasitoses nos trabalhadores.",
      agents: [
        {
          name: "Vírus Patogênicos Transmissíveis (Hepatite B e C, HIV, Influenza, SARS-CoV-2)",
          unit: "Qualitativo",
          normativeLimits: "Insalubridade de Grau Máximo (40%) no contato com pacientes em isolamento por doenças infectocontagiosas (NR-15 Anexo 14).",
          healthEffects: "Infecções crônicas, insuficiência hepática, imunodeficiência e pneumonia grave.",
          preventiveMeasures: "Pérfuro-cortantes com dispositivo de segurança retrátil, vacinação obrigatória completa, máscara PFF2/N95 e aventais impermeáveis.",
          norms: ["NR-01", "NR-06", "NR-07", "NR-15 (Anexo 14)", "NR-32"]
        },
        {
          name: "Bactérias e Agentes de Esgoto e Resíduos Urbanos (Leptospira, Salmonella, Tétano)",
          unit: "Qualitativo",
          normativeLimits: "Insalubridade de Grau Máximo (40%) em esgotos e coleta e industrialização de lixo urbano (NR-15 Anexo 14).",
          healthEffects: "Leptospirose, infecções gastrintestinais graves e tétano.",
          preventiveMeasures: "Vacinação antitetânica atualizada, macacões impermeáveis, botas de cano longo e luvas nitrílicas pesadas.",
          norms: ["NR-07", "NR-15 (Anexo 14)", "NR-38"]
        }
      ]
    },
    {
      id: "ergonomicos",
      name: "Riscos Ergonômicos",
      color: "#D97706",
      icon: "user-check",
      definition: "Fatores que podem interferir nas características psicofisiológicas do trabalhador, causando desconforto ou afetando sua saúde física e mental.",
      agents: [
        {
          name: "Levantamento e Transporte Manual Excessivo de Cargas",
          unit: "kg e frequência",
          normativeLimits: "Avaliação pela equação de levantamento do NIOSH e diretrizes da NR-17. Limite prático seguro: 23 kg em condições ideais.",
          healthEffects: "Lombalgias agudas e crônicas, hérnias de disco e distensões musculares severas.",
          preventiveMeasures: "Guinchos, talhas e carrinhos hidráulicos de transporte; quebra de sacarias para embalagens menores; treinamento biomecânico de postura.",
          norms: ["NR-17 (item 17.3)"]
        },
        {
          name: "Movimentos Repetitivos e Posturas Estáticas Inadequadas",
          unit: "Ciclos/minuto",
          normativeLimits: "Avaliação Ergonômica Preliminar (AEP) e Análise Ergonômica do Trabalho (AET) com métodos REBA/RULA/OCRA.",
          healthEffects: "Lesões por Esforços Repetitivos (LER/DORT), tendinites, bursites e síndrome do túnel do carpo.",
          preventiveMeasures: "Pausas regulares na jornada, rodízio de tarefas, postos de trabalho com altura ajustável e ferramentas anatômicas.",
          norms: ["NR-17 (item 17.4 e Anexos)"]
        },
        {
          name: "Fatores Psicossociais e Sobrecarga Mental no Trabalho",
          unit: "Avaliação Qualitativa",
          normativeLimits: "Conforme NR-01 (GRO) e diretrizes da NR-17 de organização do trabalho.",
          healthEffects: "Síndrome de Burnout, transtornos de ansiedade generalizada, depressão ocupacional e fadiga crônica.",
          preventiveMeasures: "Adequação do ritmo e metas de trabalho, autonomia do trabalhador, combate ao assédio moral e sexual (Lei 14.457/2022).",
          norms: ["NR-01", "NR-05", "NR-17 (item 17.7)"]
        }
      ]
    },
    {
      id: "acidentes",
      name: "Riscos de Acidentes (Mecânicos)",
      color: "#7C3AED",
      icon: "alert-triangle",
      definition: "Todos os fatores que colocam o trabalhador em situação de vulnerabilidade física direta por impacto mecânico, queda, choque elétrico, corte, prensagem, queimadura ou soterramento.",
      agents: [
        {
          name: "Queda de Altura (Diferença de Nível acima de 2 metros)",
          unit: "Metros de altura",
          normativeLimits: "Acima de 2,00m do nível inferior exige Sistema de Proteção Contra Quedas (NR-35 e NR-18).",
          healthEffects: "Politraumatismos, traumatismo cranioencefálico (TCE), fraturas graves, paraplegia e óbito imediato.",
          preventiveMeasures: "Guarda-corpos rígidos, redes de proteção, linha de vida certificada com cinto tipo paraquedista e talabarte duplo com absorvedor de impacto.",
          norms: ["NR-18", "NR-35"]
        },
        {
          name: "Prensagem e Esmagamento em Partes Móveis de Máquinas",
          unit: "Ponto de operação",
          normativeLimits: "Todas as zonas de perigo devem dispor de proteções mecânicas fixas ou móveis intertravadas (NR-12).",
          healthEffects: "Amputação traumática de membros, perda de dedos e lacerações.",
          preventiveMeasures: "Proteções físicas enclausuradas, cortinas de luz de segurança Categoria 4, botões bi-manuais e chave de segurança com ruptura positiva.",
          norms: ["NR-12"]
        },
        {
          name: "Choque Elétrico e Arco Voltaico",
          unit: "Volts / Joules (cal/cm²)",
          normativeLimits: "Acima de 50 VCA / 120 VCC exige medidas rigorosas da NR-10.",
          healthEffects: "Fibrilação ventricular cardíaca, parada cardiorrespiratória, queimaduras de 3º grau internas e externas.",
          preventiveMeasures: "Desenergização nos 6 passos com bloqueio LOTO, isolação de barramentos, uso de vestimentas resistentes ao arco elétrico (ATPV) e luvas isolantes.",
          norms: ["NR-10"]
        },
        {
          name: "Incêndio e Explosão",
          unit: "Triângulo do fogo",
          normativeLimits: "Instalações de inflamáveis Classes I a III (NR-20) e proteção geral da NR-23.",
          healthEffects: "Queimaduras térmicas severas, asfixia por fumaça tóxica e destruição patrimonial com múltiplas vítimas.",
          preventiveMeasures: "Controle estrito de fontes de ignição, sistemas automáticos de sprinklers, extintores adequados e brigada treinada.",
          norms: ["NR-20", "NR-23"]
        }
      ]
    }
  ]
};
