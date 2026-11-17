# Portal SST Brasil + agente do Microsoft Foundry

O chat **Assistente SST** do site agora conversa com o seu agente do Foundry.
O navegador fala só com o `server.js`. É o servidor que faz login no Azure e chama o agente,
então nenhuma credencial fica visível no site.

## Passo a passo (Windows)

1. **Instale o Node.js** (versão 18 ou mais nova) e a **Azure CLI**, se ainda não tiver:
   `winget install Microsoft.AzureCLI`
2. **Faça login no Azure** com a mesma conta do Foundry:
   ```
   az login
   ```
3. **Pegue os dados no portal do Foundry** (ai.azure.com):
   - **Endpoint do projeto**: na página inicial (Visão geral) do projeto. Formato:
     `https://NOME.services.ai.azure.com/api/projects/NOME-DO-PROJETO`
   - **Agente**: na aba *Agentes*, copie o **nome** do agente (agente novo) **ou** o **ID** que começa com `asst_` (agente clássico). O site detecta qual dos dois é sozinho.
4. Na pasta do site, **copie `.env.example` e renomeie a cópia para `.env`**. Preencha:
   ```
   FOUNDRY_PROJECT_ENDPOINT=https://....services.ai.azure.com/api/projects/....
   FOUNDRY_AGENT=nome-do-seu-agente
   ```
5. **Rode o site**:
   ```
   npm start
   ```
   e abra http://localhost:3000. No cabeçalho do chat deve aparecer
   **"● Conectado ao agente do Microsoft Foundry"**.

## Se der erro

O motivo aparece num aviso amarelo no chat e também no terminal onde o `npm start` está rodando.
Enquanto o agente estiver com erro, o chat usa a base de respostas local.

| Mensagem | O que fazer |
|---|---|
| Azure CLI não encontrada | Instale a Azure CLI, feche e abra o terminal de novo |
| Rode "az login" | Rode `az login` (o login expira de tempos em tempos) |
| 401 | Rode `az login` de novo |
| 403 | Sua conta precisa do papel **Azure AI User** no projeto (peça ao professor/admin da assinatura) |
| 404 | Confira o endpoint (tem que terminar em `/api/projects/NOME`) e o nome/ID do agente |

## Detalhes

- **Memória da conversa**: o agente lembra das perguntas anteriores. O botão **Limpar Conversa** começa uma conversa nova.
- **Publicar online** (ex.: Azure App Service): em vez de `az login`, use um *service principal*.
  Preencha `AZURE_TENANT_ID`, `AZURE_CLIENT_ID` e `AZURE_CLIENT_SECRET` como variáveis de ambiente
  e dê a ele o papel *Azure AI User* no projeto.
- **Nunca envie o arquivo `.env`** para o GitHub nem para outras pessoas. O servidor já bloqueia o acesso a ele pelo navegador.

### Arquivos alterados
- `foundry.js` (novo): login no Azure e chamada ao agente
- `server.js`: lê o `.env`, cria as rotas `/api/chat` e `/api/status` e bloqueia arquivos sensíveis
- `assets/js/modules/ai-assistant.js`: o chat chama o agente, e usa a base local se o agente falhar
- `assets/js/app.js`, `index.html`, `assets/css/components.css`: exibição da resposta do agente, indicador "pensando…" e selo de conexão
