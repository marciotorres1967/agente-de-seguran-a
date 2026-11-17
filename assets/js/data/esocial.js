/**
 * GUIA COMPLETO DOS EVENTOS DE SST NO eSOCIAL
 * PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO
 * Em conformidade com o Manual de Orientação do eSocial (MOS) Versão S-1.2 / Vigente
 */

window.ESOCIAL_DATA = {
  overview: {
    description: "Os eventos de Segurança e Saúde no Trabalho (SST) no eSocial têm como objetivo padronizar a transmissão de informações de saúde e segurança das empresas diretamente à Receita Federal, Ministério do Trabalho e INSS, viabilizando o Perfil Profissiográfico Previdenciário (PPP) 100% eletrônico e a fiscalização automatizada de infrações.",
    keyDates: "A obrigatoriedade para os Grupos 1, 2, 3 e 4 está plenamente em vigor desde janeiro de 2023, sendo o PPP físico em papel aceito apenas para períodos anteriores a 01/01/2023."
  },
  events: [
    {
      code: "S-2210",
      name: "Comunicação de Acidente de Trabalho (CAT)",
      purpose: "Registrar formalmente os acidentes de trabalho típicos, acidentes de trajeto ou o diagnóstico de doenças ocupacionais ocorridas com o empregado, ainda que não haja afastamento das atividades laborativas.",
      deadline: "Até o primeiro dia útil seguinte ao da ocorrência do acidente e, em caso de falecimento da vítima, de imediato.",
      responsibles: "Empregador, cooperativa, tomador de serviço avulso ou empregador doméstico.",
      requiredData: [
        "Data, hora e local exato do acidente (no estabelecimento, em trânsito, em via pública)",
        "Parte do corpo atingida (código oficial da Tabela 13 do eSocial)",
        "Agente causador do acidente (código da Tabela 14 ou 15)",
        "Situação geradora do acidente (Tabela 16)",
        "Tipo de acidente (1 - Típico, 2 - Doença, 3 - Trajeto)",
        "Atestado médico com CRM do médico emitente, CID-10 da lesão e período provável de afastamento"
      ],
      commonErrors: [
        "Esperar o 16º dia de afastamento para emitir a CAT (a CAT deve ser aberta no dia útil seguinte mesmo sem afastamento).",
        "Cadastrar dados médicos sem o preenchimento correto do número de inscrição do CRM e UF do médico emissor.",
        "Não registrar a CAT de trajeto alegando que não houve culpa da empresa (a lei equipara o trajeto para fins previdenciários).",
        "Deixar de comunicar de imediato o óbito do trabalhador, gerando multa automática agravada."
      ],
      legalBase: "Artigo 22 da Lei nº 8.213/1991 e Instrução Normativa PRES/INSS nº 128/2022."
    },
    {
      code: "S-2220",
      name: "Monitoramento da Saúde do Trabalhador",
      purpose: "Informar todos os exames médicos ocupacionais clínicos e complementares aos quais o trabalhador foi submetido durante o vínculo de emprego, conforme estabelecido no PCMSO (NR-07).",
      deadline: "Até o dia 15 (quinze) do mês subsequente ao da emissão do respectivo Atestado de Saúde Ocupacional (ASO).",
      responsibles: "Empregador com apoio e dados fornecidos pelo Médico do Trabalho responsável pelo PCMSO.",
      requiredData: [
        "Tipo do exame ocupacional realizado (0 - Admissional, 1 - Periódico, 2 - Retorno ao Trabalho, 3 - Mudança de Riscos, 4 - Demissional)",
        "Data de realização do exame clínico presencial",
        "Parecer final do médico emitente: APTO ou INAPTO para a função",
        "Relação dos exames complementares realizados (código da Tabela 27 do eSocial, ex: Audiometria, Espirometria, Raio-X)",
        "Dados do Médico Coordenador do PCMSO e do Médico Examinador (Nome, CRM e UF)"
      ],
      commonErrors: [
        "Tentar informar resultados diagnósticos ou prontuário médico confidencial (o eSocial recebe apenas a data do exame e a conclusão de aptidão, sem dados clínicos sob sigilo da LGPD/CRM).",
        "Transmitir o ASO Admissional com data posterior ao início do trabalho (o ASO admissional deve ser realizado ANTES do trabalhador começar a exercer a atividade).",
        "Omitir os exames complementares exigidos pelos anexos da NR-07 (ex: deixar de informar audiometria para quem trabalha com ruído elevado)."
      ],
      legalBase: "Item 7.5 da NR-07 e Artigo 168 da CLT."
    },
    {
      code: "S-2240",
      name: "Condições Ambientais do Trabalho — Agentes Nocivos (PPP Eletrônico)",
      purpose: "Registrar as condições de prestação de serviços do trabalhador, indicando as atividades desempenhadas, o ambiente de trabalho e a exposição aos agentes nocivos químicos, físicos e biológicos cadastrados na Tabela 24 do eSocial que ensejam a concessão de Aposentadoria Especial pelo INSS.",
      deadline: "Até o dia 15 (quinze) do mês subsequente ao da admissão do trabalhador ou da alteração no ambiente ou nas condições de exposição.",
      responsibles: "Empregador com base técnica no Laudo Técnico das Condições Ambientais do Trabalho (LTCAT) assinado por Engenheiro de Segurança ou Médico do Trabalho.",
      requiredData: [
        "Ambiente de trabalho (estabelecimento próprio ou de terceiros prestadores de serviço)",
        "Descrição detalhada das atividades e tarefas executadas pelo trabalhador",
        "Código do agente nocivo conforme a Tabela 24 do eSocial (ou o código 09.01.001 caso não haja exposição a agente nocivo)",
        "Tipo de avaliação (quantitativa com valor medido e unidade, ou qualitativa)",
        "Técnica e metodologia utilizada (NHOs da Fundacentro ou NR-15)",
        "Equipamentos de Proteção Coletiva (EPC) e Individual (EPI) utilizados, com indicação do número do CA e se são eficazes",
        "Nome, CPF e registro profissional (CREA/CRM) do responsável técnico pelas medições ambientais (LTCAT)"
      ],
      commonErrors: [
        "Achar que empresas de escritório sem riscos não precisam enviar o S-2240 (o envio é OBRIGATÓRIO para 100% dos empregados celetistas; para quem não tem risco, envia-se o código 09.01.001 - Ausência de fator de risco).",
        "Informar riscos ergonômicos e mecânicos no S-2240 (o evento S-2240 tem finalidade estritamente PREVIDENCIÁRIA de Aposentadoria Especial, contemplando apenas agentes físicos, químicos e biológicos do Decreto 3.048/99).",
        "Transmitir sem o número do CA dos EPIs ou sem marcar os requisitos de eficácia da NR-06.",
        "Não atualizar o evento após o colaborador trocar de setor ou mudar de função."
      ],
      legalBase: "Artigo 58 da Lei nº 8.213/1991, Artigos 64 a 70 do Decreto nº 3.048/1999 e Portaria MTP nº 313/2021."
    }
  ],
  tabela24Highlights: [
    { code: "01.01.001", name: "Ruído contínuo ou intermitente acima dos limites de tolerância", type: "Físico" },
    { code: "01.03.001", name: "Vibrações de mãos e braços (VMB) e corpo inteiro (VCI)", type: "Físico" },
    { code: "01.04.001", name: "Temperaturas anormais (calor ocupacional sob critérios da NHO 06)", type: "Físico" },
    { code: "01.05.001", name: "Radiações ionizantes (fontes radioativas e raio-X)", type: "Físico" },
    { code: "02.01.014", name: "Benzeno e seus compostos tóxicos", type: "Químico" },
    { code: "02.01.758", name: "Sílica livre cristalina (fração respirável)", type: "Químico" },
    { code: "03.01.001", name: "Microrganismos e agentes biológicos infecciosos (contato hospitalar)", type: "Biológico" },
    { code: "09.01.001", name: "Ausência de agente nocivo ou atividades não sujeitas a condições especiais", type: "Neutro / Administrativo" }
  ]
};
