/**
 * GERADORES DE DOCUMENTOS INTERATIVOS COM EXPORTAÇÃO E IMPRESSÃO (PDF)
 * PORTAL SST BRASIL — SEGURANÇA, SAÚDE E PREVENÇÃO
 * 1. Gerador de APR (Análise Preliminar de Risco)
 * 2. Gerador de Ordem de Serviço (OS - NR-01)
 * 3. Gerador de Plano de Ação 5W2H (PGR)
 */

window.SST_GENERATORS = {
  // Salva no localStorage para persistência
  storageKeys: {
    apr: "portal_sst_saved_apr",
    os: "portal_sst_saved_os",
    actionPlan: "portal_sst_saved_5w2h"
  },

  // Exportar / Imprimir em PDF nativo estilizado
  printDocument(elementId, title) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Adiciona classe de impressão temporária para foco visual e aciona print do navegador
    window.print();
  },

  // Inicializa modelos padrão de APR
  getDefaultAPR() {
    return {
      companyName: "Minha Empresa de Engenharia e Serviços Ltda.",
      cnpj: "00.000.000/0001-00",
      workArea: "Setor de Manutenção Industrial / Galpão B",
      taskDescription: "Substituição de motores elétricos em ponte rolante a 8 metros de altura",
      date: new Date().toISOString().split("T")[0],
      validity: "Turno Diurno (08:00 às 17:00)",
      supervisor: "Carlos Silva - Engenheiro de Segurança do Trabalho",
      teamMembers: [
        { name: "João Pereira", role: "Eletricista de Manutenção", aso: "Válido", training: "NR-10 e NR-35 em dia" },
        { name: "Marcos Souza", role: "Mecânico Industrial", aso: "Válido", training: "NR-35 em dia" }
      ],
      steps: [
        {
          step: "1. Isolamento e sinalização da área térrea",
          hazard: "Trânsito de empilhadeiras e pedestres",
          consequence: "Atropelamento ou colisão com equipamentos",
          severity: 3,
          probability: 2,
          controls: "Instalação de cones zebrados e fita de isolamento a 10 metros de raio; sinalização de advertência.",
          responsible: "Líder da Equipe"
        },
        {
          step: "2. Desenergização e bloqueio elétrico da ponte",
          hazard: "Energia elétrica de 380V e acionamento acidental",
          consequence: "Choque elétrico, queimadura por arco ou esmagamento",
          severity: 5,
          probability: 2,
          controls: "Aplicação do procedimento LOTO com cadeado e garra vermelha; teste de ausência de tensão no disjuntor principal.",
          responsible: "Eletricista Responsável"
        },
        {
          step: "3. Acesso e trabalho em altura na passarela da ponte",
          hazard: "Trabalho em altura acima de 2 metros (8m)",
          consequence: "Queda de nível com risco de lesões graves ou fatais",
          severity: 5,
          probability: 2,
          controls: "Uso obrigatório de cinto paraquedista com talabarte duplo ancorado em linha de vida certificada; amarra de ferramentas com talabartes de punho.",
          responsible: "Toda a Equipe"
        }
      ]
    };
  },

  // Inicializa modelo padrão de Ordem de Serviço (OS)
  getDefaultOS() {
    return {
      companyName: "Minha Empresa de Manufatura Ltda.",
      cnpj: "12.345.678/0001-90",
      employeeName: "Roberto da Silva",
      cpf: "123.456.789-00",
      role: "Operador de Máquinas e Equipamentos",
      sector: "Usinagem e Prensas",
      admissionDate: "10/01/2024",
      activities: "Operar tornos CNC e prensas hidráulicas, abastecer matérias-primas e realizar checklists pré-operacionais.",
      risksIdentified: [
        { type: "Risco Físico", desc: "Ruído contínuo de 84 dB(A) emitido pelo motor dos tornos." },
        { type: "Risco Químico", desc: "Névoas de óleo solúvel e lubrificantes de corte." },
        { type: "Risco Ergonômico", desc: "Postura em pé por períodos prolongados." },
        { type: "Risco Mecânico / Acidente", desc: "Risco de prensagem e projeção de partículas metálicas volantes." }
      ],
      requiredEPIs: [
        "Óculos de proteção com lente incolor antirrisco e CA válido",
        "Protetor auditivo tipo plug de silicone (NRRsf mínimo de 15 dB)",
        "Calçado de segurança com biqueira de proteção contra impacto",
        "Luvas nitrílicas para manipulação de óleo de corte (PROIBIDO uso com eixos rotativos)"
      ],
      obligations: [
        "Cumprir todas as normas e procedimentos de segurança da empresa.",
        "Utilizar os EPIs fornecidos exclusivamente para as funções a que se destinam.",
        "Não operar máquinas sem proteção ou com dispositivos de emergência inoperantes.",
        "Submeter-se aos exames médicos previstos no PCMSO da empresa."
      ],
      penalties: "O não cumprimento das determinações desta Ordem de Serviço constitui ato faltoso passível das sanções previstas no art. 158 e 482 da CLT (advertência verbal, escrita, suspensão disciplinar e demissão por justa causa)."
    };
  },

  // Inicializa modelo padrão de Plano de Ação 5W2H do PGR
  getDefault5W2H() {
    return [
      {
        what: "Instalar sistema de guarda-corpo e rodapé na passarela superior",
        why: "Eliminar o risco de queda de nível (NR-18 / NR-35) detectado no Inventário de Riscos",
        where: "Galpão Industrial 02",
        when: "30/11/2026",
        who: "Engenharia de Manutenção / Serralheria",
        how: "Fixação mecânica com tubos de aço galvanizado nas alturas de 1,20m e 0,70m com rodapé de 20cm",
        howMuch: "R$ 4.500,00",
        status: "Em Andamento"
      },
      {
        what: "Realizar treinamento de reciclagem da NR-10 (40h) para eletricistas",
        why: "Vencimento bienal do certificado de autorização para intervenção em baixa tensão",
        where: "Sala de Treinamento e Oficina Elétrica",
        when: "15/12/2026",
        who: "SESMT / Instrutor Habilitado Credenciado",
        how: "Curso semipresencial com práticas de primeiros socorros e LOTO",
        howMuch: "R$ 2.200,00",
        status: "Planejado"
      },
      {
        what: "Substituir dosímetros de ruído e realizar nova avaliação ambiental quantitativa",
        why: "Aferir a eficácia do enclausuramento acústico instalado no compressor de ar",
        where: "Sala de Compressores",
        when: "20/11/2026",
        who: "Técnico de Segurança do Trabalho",
        how: "Dosimetria com calibração RBC e critérios da NHO 01 da Fundacentro",
        howMuch: "R$ 800,00",
        status: "Concluído"
      }
    ];
  }
};
