/**
 * MODELOS OFICIAIS DE DOCUMENTOS E PROCEDIMENTOS DE SST
 * PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO
 * Todos os modelos contêm identificação, versão e aviso de adaptação obrigatória.
 */

window.DOCUMENTS_DATA = [
  {
    id: "modelo-apr",
    code: "MOD-SST-01",
    version: "v3.2/2026",
    title: "Análise Preliminar de Risco (APR / APP)",
    category: "PGR & Gestão Operacional",
    normReference: "NR-01 (GRO) e NR-35 / NR-33 / NR-10",
    description: "Formulário técnico para identificação sistemática de perigos, causas potenciais, medidas de controle existentes e ações preventivas recomendadas antes do início de qualquer tarefa crítica ou não rotineira.",
    notice: "AVISO LEGAL: Este modelo é um referencial técnico e DEVE ser adaptado à realidade operacional da empresa e validado pelo SESMT ou responsável técnico legalmente habilitado antes de sua aplicação em campo.",
    sections: [
      {
        title: "1. Dados da Atividade",
        fields: ["Empresa / Contratada", "Setor / Local da Execução", "Descrição Detalhada da Tarefa", "Data e Horário Previsto", "Responsável Técnico pela Emissão"]
      },
      {
        title: "2. Triagem de Riscos Críticos",
        fields: ["Trabalho em Altura (> 2m)?", "Espaço Confinado?", "Trabalho com Eletricidade / SEP?", "Trabalho a Quente (Solda/Corte)?", "Içamento de Carga Crítica?"]
      },
      {
        title: "3. Matriz Passo a Passo de Análise",
        columns: ["Passo da Tarefa", "Perigos Identificados", "Consequências / Danos Potenciais", "Severidade", "Probabilidade", "Nível de Risco", "Medidas Preventivas Obrigatórias (EPC/EPI/Procedimentos)", "Responsável pelo Monitoramento"]
      },
      {
        title: "4. Assinaturas e Ciência da Equipe",
        fields: ["Nome Legível, Função, Assinatura e Confirmação de Treinamento de todos os executantes."]
      }
    ]
  },
  {
    id: "modelo-pt",
    code: "MOD-SST-02",
    version: "v2.8/2026",
    title: "Permissão de Trabalho Especial (PT / PTE)",
    category: "Controle de Riscos Críticos",
    normReference: "NR-01, NR-10, NR-20, NR-33, NR-34 e NR-35",
    description: "Documento formal de autorização e liberação para execução de serviços de alto risco com validade restrita ao turno de trabalho, contendo checklist de condições impeditivas e assinaturas de liberação.",
    notice: "AVISO LEGAL: A Permissão de Trabalho só tem validade mediante vistoria prévia no local de trabalho e assinatura do emitente autorizado.",
    sections: [
      {
        title: "1. Identificação do Serviço",
        fields: ["Número da PT", "Data de Emissão", "Horário Inicial e Final de Validade", "Local Exato", "Equipe Executante", "Empresa"]
      },
      {
        title: "2. Verificações de Segurança Pré-Trabalho",
        fields: [
          "Área isolada e sinalizada contra queda de materiais?",
          "Linha de vida ou pontos de ancoragem inspecionados?",
          "Teste de ausência de tensão realizado (LOTO aplicado)?",
          "Teste de gases atmosféricos realizado (O2 entre 19,5% e 23%)?",
          "Extintor portátil posicionado no local para trabalho a quente?",
          "Trabalhadores com ASO e treinamentos vigentes no sistema?"
        ]
      },
      {
        title: "3. Liberação e Encerramento",
        fields: ["Assinatura do Emitente Autorizado", "Assinatura do Líder da Equipe Executante", "Registro de Encerramento com devolução da área limpa e segura."]
      }
    ]
  },
  {
    id: "modelo-ordem-servico",
    code: "MOD-SST-03",
    version: "v4.0/2026",
    title: "Ordem de Serviço (OS) de Segurança e Saúde no Trabalho",
    category: "NR-01 e Obrigações Legais",
    normReference: "Art. 157, II da CLT e Item 1.4.1 da NR-01",
    description: "Instrumento legal obrigatório pelo qual o empregador instrui formalmente o empregado sobre os riscos da sua função, medidas de prevenção, EPIs obrigatórios, procedimentos em caso de acidente e proibições.",
    notice: "AVISO LEGAL: A emissão de Ordem de Serviço com ciência assinada pelo empregado é prova documental essencial perante a fiscalização do trabalho e perícias judiciais.",
    sections: [
      {
        title: "1. Dados do Colaborador",
        fields: ["Nome do Empregado", "CPF", "Cargo / Função", "Setor de Trabalho", "Data de Admissão"]
      },
      {
        title: "2. Atividades e Descrição do Cargo",
        fields: ["Resumo das principais tarefas rotineiras do cargo."]
      },
      {
        title: "3. Perigos e Riscos da Função",
        fields: ["Riscos Físicos, Químicos, Biológicos, Ergonômicos e Mecânicos mapeados no PGR para esta função."]
      },
      {
        title: "4. Equipamentos de Proteção Individual Obrigatórios",
        fields: ["Lista completa com especificação do tipo de EPI, conservação e uso obrigatório."]
      },
      {
        title: "5. Obrigações, Proibições e Medidas Disciplinares",
        fields: ["Deveres da NR-01 e previsão de sanções do art. 158 e 482 da CLT por descumprimento injustificado."]
      },
      {
        title: "6. Termo de Compromisso e Assinatura",
        fields: ["Declaração de ter recebido orientações e treinamento com assinatura e data."]
      }
    ]
  },
  {
    id: "modelo-ficha-epi",
    code: "MOD-SST-04",
    version: "v3.5/2026",
    title: "Ficha de Controle e Entrega de EPI (Individual)",
    category: "NR-06 e Equipamentos",
    normReference: "Art. 166 da CLT e Item 6.5.1 da NR-06",
    description: "Registro legal individualizado que comprova a entrega gratuita dos EPIs ao colaborador, registrando número de CA, data de entrega, motivo da substituição e assinatura de recebimento.",
    notice: "AVISO LEGAL: O registro de fornecimento de EPI deve ser mantido atualizado física ou eletronicamente durante todo o contrato de trabalho.",
    sections: [
      {
        title: "1. Termo de Responsabilidade",
        fields: ["Declaração expressa do trabalhador assumindo o compromisso de zelar pelo equipamento e usá-lo exclusivamente a serviço da empresa."]
      },
      {
        title: "2. Grade de Entregas e Substituições",
        columns: ["Data da Entrega", "Quantidade", "Descrição do EPI", "Número do CA (Certificado de Aprovação)", "Motivo (Novo / Desgaste / Perda)", "Assinatura do Trabalhador", "Data da Devolução"]
      }
    ]
  },
  {
    id: "modelo-investigacao-acidente",
    code: "MOD-SST-05",
    version: "v2.5/2026",
    title: "Relatório de Investigação e Análise de Acidente de Trabalho (RIAA)",
    category: "Prevenção de Acidentes",
    normReference: "NR-01 (item 1.5.5.5) e NBR 14280",
    description: "Metodologia estruturada de investigação de acidentes e quase-acidentes utilizando o Diagrama de Ishikawa (6M), Método dos 5 Porquês e Árvore de Causas para identificar fatores organizacionais e evitar reincidências.",
    notice: "AVISO LEGAL: A investigação de acidentes tem caráter educativo e preventivo para corrigir falhas do sistema de gestão, não devendo ser utilizada para busca punitiva de culpados.",
    sections: [
      {
        title: "1. Dados do Evento Acidentário",
        fields: ["Data e Hora da Ocorrência", "Nome do Acidentado", "Função", "Tempo na Empresa", "Houve Afastamento?", "Número da CAT emitida"]
      },
      {
        title: "2. Descrição Circunstanciada",
        fields: ["O que aconteceu? Onde? Como? Quem presenciou (testemunhas)?"]
      },
      {
        title: "3. Análise das Causas Básicas (Diagrama de Ishikawa - 6M)",
        fields: ["Método", "Máquinas / Equipamentos", "Mão de Obra / Fator Humano", "Material", "Meio Ambiente", "Medição"]
      },
      {
        title: "4. Análise dos 5 Porquês",
        fields: ["Por quê 1?", "Por quê 2?", "Por quê 3?", "Por quê 4?", "Por quê 5? (Causa Raiz Raiz Sistêmica)"]
      },
      {
        title: "5. Plano de Ação Corretiva e Preventiva (5W2H)",
        columns: ["O que será feito?", "Por que?", "Quem fará?", "Onde?", "Quando (Prazo)?", "Como?", "Status"]
      }
    ]
  },
  {
    id: "modelo-ata-cipa",
    code: "MOD-SST-06",
    version: "v3.0/2026",
    title: "Modelo de Ata de Reunião Ordinária da CIPA",
    category: "CIPA & Gestão Participativa",
    normReference: "Item 5.6 da NR-05 e Lei nº 14.457/2022",
    description: "Estrutura padrão de ata para registro formal das reuniões mensais da CIPA, acompanhamento do plano de trabalho, análise dos acidentes do mês e ações de combate ao assédio.",
    notice: "AVISO LEGAL: As atas da CIPA devem ser assinadas por todos os presentes e arquivadas no estabelecimento à disposição da fiscalização por no mínimo 5 anos.",
    sections: [
      {
        title: "1. Abertura e Presenças",
        fields: ["Data, Hora e Local da Reunião", "Lista de Membros Titulares e Suplentes Presentes e Justificativas de Ausência"]
      },
      {
        title: "2. Pauta e Deliberações do Mês",
        fields: [
          "Leitura e aprovação da ata da reunião anterior",
          "Análise dos acidentes e quase-acidentes ocorridos no último mês",
          "Inspeções de segurança realizadas pelos cipeiros nos setores",
          "Acompanhamento do canal de denúncias e ações educativas contra assédio e violência",
          "Cronograma e preparativos para a SIPAT (Semana Interna de Prevenção de Acidentes)",
          "Sugestões dos trabalhadores e novos assuntos gerais"
        ]
      },
      {
        title: "3. Encerramento e Assinatura",
        fields: ["Horário de término e assinaturas do Presidente, Vice-Presidente e Secretário."]
      }
    ]
  }
];
