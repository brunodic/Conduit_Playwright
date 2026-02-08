<details>
<summary><strong>📘 Documentação completa do projeto</strong></summary>

![RealWorld Example App](logo.png)

> **React / Vite + SWC / Express.js / Sequelize / PostgreSQL codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://realworld.io/) spec and API.**

This codebase was created to demonstrate a fully fledged fullstack application built with **React / Vite + SWC / Express.js / Sequelize / PostgreSQL** including CRUD operations, authentication, routing, pagination, and more.

**[Demo app](https://conduit-realworld-example-app.fly.dev/)&nbsp;&nbsp;|&nbsp;&nbsp;[With Create React App](https://github.com/TonyMckes/conduit-realworld-example-app/tree/create-react-app)&nbsp;&nbsp;|&nbsp;&nbsp;[Other RealWorld Example Apps](https://codebase.show/projects/realworld?category=fullstack)**

> For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

---

## Getting Started

These instructions will help you install and run the project on your local machine for development and testing.

### Prerequisites

Before you run the project, make sure that you have the following tools and software installed on your computer:

- Text editor/IDE (e.g., VS Code, Sublime Text, Atom)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/) `v18.11.0+`
- [NPM](https://www.npmjs.com/) (usually included with Node.js)
- SQL database

### Installation

To install the project on your computer, follow these steps:

1. Clone the repository to your local machine.

   ```bash
   git clone https://github.com/TonyMckes/conduit-realworld-example-app.git
   ```

2. Navigate to the project directory.

   ```bash
   cd conduit-realworld-example-app
   ```

3. Install project dependencies by running the command:

   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory of the project
2. Add the required environment variables as specified in the [`.env.example`](backend/.env.example) file
3. (Optional) update the Sequelize configuration parameters in the [`config.js`](backend/config/config.js) file
4. If you are **not** using PostgreSQL, you may also have to install the driver for your database:

   <details>
   <summary>Use one of the following commands to install:</summary><br/>

   > Note: `-w backend` option is used to install it in the backend [`package.json`](backend/package.json).

   ```bash
   npm install -w backend pg pg-hstore  # Postgres (already installed)
   npm install -w backend mysql2
   npm install -w backend mariadb
   npm install -w backend sqlite3
   npm install -w backend tedious       # Microsoft SQL Server
   npm install -w backend oracledb      # Oracle Database
   ```

   > :information_source: Visit [Sequelize - Installing](https://sequelize.org/docs/v6/getting-started/#installing) for more infomation.

   ***

   </details>

5. Create database specified by configuration by executing

   > :warning: Please, make sure you have already created a superuser for your database.

   ```bash
   npm run sqlz -- db:create
   ```

   > :information_source: The command `npm run sqlz` is an alias for `npx -w backend sequelize-cli`.  
   > Execute `npm run sqlz -- --help` to see more of `sequelize-cli` commands availables.

6. Optionally you can run the following command to populate your database with some dummy data:

   ```bash
   npm run sqlz -- db:seed:all
   ```

### Usage

#### Development Server

To run the project, follow these steps:

1. Start the development server by executing the command:

   ```bash
   npm run dev
   ```

2. Open a web browser and navigate to:
   - Home page should be available at [`http://localhost:3000/`](http://localhost:3000).
   - API endpoints should be available at [`http://localhost:3001/api`](http://localhost:3001/api).

#### Running Tests

To run tests, simply run the following command:

```bash
npm run test
```

#### Production

The following command will build the production version of the app:

```bash
npm run start
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [RealWorld](https://realworld.io/)
- [RealWorld (GitHub)](https://github.com/gothinkster/realworld)
- [CodebaseShow](https://codebase.show/)
- [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
</details>
  
## Conduit_Playwright
# Dashboard Corporativo de Automação de Testes

Sistema de orquestração e monitoramento de execuções de testes automatizados via CI/CD.

## Arquitetura

- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend**: React + Vite + TypeScript + Material-UI
- **Infraestrutura**: Docker Compose


<svg aria-roledescription="flowchart-v2" role="graphics-document document" viewBox="-8 -8 535.6328125 391.3984680175781" style="max-width: 535.6328125px;" xmlns="http://www.w3.org/2000/svg" width="100%" id="mermaid-svg-1770558821783-hymcw833t"><style>#mermaid-svg-1770558821783-hymcw833t{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;fill:rgba(228, 228, 228, 0.92);}#mermaid-svg-1770558821783-hymcw833t .error-icon{fill:#141414;}#mermaid-svg-1770558821783-hymcw833t .error-text{fill:#e34671;stroke:#e34671;}#mermaid-svg-1770558821783-hymcw833t .edge-thickness-normal{stroke-width:2px;}#mermaid-svg-1770558821783-hymcw833t .edge-thickness-thick{stroke-width:3.5px;}#mermaid-svg-1770558821783-hymcw833t .edge-pattern-solid{stroke-dasharray:0;}#mermaid-svg-1770558821783-hymcw833t .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-svg-1770558821783-hymcw833t .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-svg-1770558821783-hymcw833t .marker{fill:rgba(228, 228, 228, 0.65);stroke:rgba(228, 228, 228, 0.65);}#mermaid-svg-1770558821783-hymcw833t .marker.cross{stroke:rgba(228, 228, 228, 0.65);}#mermaid-svg-1770558821783-hymcw833t svg{font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:16px;}#mermaid-svg-1770558821783-hymcw833t .label{font-family:"trebuchet ms",verdana,arial,sans-serif;color:rgba(228, 228, 228, 0.92);}#mermaid-svg-1770558821783-hymcw833t .cluster-label text{fill:rgba(228, 228, 228, 0.92);}#mermaid-svg-1770558821783-hymcw833t .cluster-label span,#mermaid-svg-1770558821783-hymcw833t p{color:rgba(228, 228, 228, 0.92);}#mermaid-svg-1770558821783-hymcw833t .label text,#mermaid-svg-1770558821783-hymcw833t span,#mermaid-svg-1770558821783-hymcw833t p{fill:rgba(228, 228, 228, 0.92);color:rgba(228, 228, 228, 0.92);}#mermaid-svg-1770558821783-hymcw833t .node rect,#mermaid-svg-1770558821783-hymcw833t .node circle,#mermaid-svg-1770558821783-hymcw833t .node ellipse,#mermaid-svg-1770558821783-hymcw833t .node polygon,#mermaid-svg-1770558821783-hymcw833t .node path{fill:#181818;stroke:#454545;stroke-width:1px;}#mermaid-svg-1770558821783-hymcw833t .flowchart-label text{text-anchor:middle;}#mermaid-svg-1770558821783-hymcw833t .node .label{text-align:center;}#mermaid-svg-1770558821783-hymcw833t .node.clickable{cursor:pointer;}#mermaid-svg-1770558821783-hymcw833t .arrowheadPath{fill:#e7e7e7;}#mermaid-svg-1770558821783-hymcw833t .edgePath .path{stroke:rgba(228, 228, 228, 0.65);stroke-width:2.0px;}#mermaid-svg-1770558821783-hymcw833t .flowchart-link{stroke:rgba(228, 228, 228, 0.65);fill:none;}#mermaid-svg-1770558821783-hymcw833t .edgeLabel{background-color:#18181899;text-align:center;}#mermaid-svg-1770558821783-hymcw833t .edgeLabel rect{opacity:0.5;background-color:#18181899;fill:#18181899;}#mermaid-svg-1770558821783-hymcw833t .labelBkg{background-color:rgba(24, 24, 24, 0.5);}#mermaid-svg-1770558821783-hymcw833t .cluster rect{fill:rgba(64, 64, 64, 0.47);stroke:#454545;stroke-width:1px;}#mermaid-svg-1770558821783-hymcw833t .cluster text{fill:rgba(228, 228, 228, 0.92);}#mermaid-svg-1770558821783-hymcw833t .cluster span,#mermaid-svg-1770558821783-hymcw833t p{color:rgba(228, 228, 228, 0.92);}#mermaid-svg-1770558821783-hymcw833t div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"trebuchet ms",verdana,arial,sans-serif;font-size:12px;background:rgba(64, 64, 64, 0.6);border:1px solid #454545;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-svg-1770558821783-hymcw833t .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgba(228, 228, 228, 0.92);}#mermaid-svg-1770558821783-hymcw833t :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}</style><g><marker orient="auto" markerHeight="12" markerWidth="12" markerUnits="userSpaceOnUse" refY="5" refX="6" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1770558821783-hymcw833t_flowchart-pointEnd"><path style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 0 0 L 10 5 L 0 10 z"/></marker><marker orient="auto" markerHeight="12" markerWidth="12" markerUnits="userSpaceOnUse" refY="5" refX="4.5" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1770558821783-hymcw833t_flowchart-pointStart"><path style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 0 5 L 10 10 L 10 0 z"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5" refX="11" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1770558821783-hymcw833t_flowchart-circleEnd"><circle style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" r="5" cy="5" cx="5"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5" refX="-1" viewBox="0 0 10 10" class="marker flowchart" id="mermaid-svg-1770558821783-hymcw833t_flowchart-circleStart"><circle style="stroke-width: 1; stroke-dasharray: 1, 0;" class="arrowMarkerPath" r="5" cy="5" cx="5"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5.2" refX="12" viewBox="0 0 11 11" class="marker cross flowchart" id="mermaid-svg-1770558821783-hymcw833t_flowchart-crossEnd"><path style="stroke-width: 2; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9"/></marker><marker orient="auto" markerHeight="11" markerWidth="11" markerUnits="userSpaceOnUse" refY="5.2" refX="-1" viewBox="0 0 11 11" class="marker cross flowchart" id="mermaid-svg-1770558821783-hymcw833t_flowchart-crossStart"><path style="stroke-width: 2; stroke-dasharray: 1, 0;" class="arrowMarkerPath" d="M 1,1 l 9,9 M 10,1 l -9,9"/></marker><g class="root"><g class="clusters"/><g class="edgePaths"><path marker-end="url(#mermaid-svg-1770558821783-hymcw833t_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-Frontend LE-Backend" id="L-Frontend-Backend-0" d="M269.022,34L264.831,39.75C260.64,45.5,252.259,57,251.738,67.786C251.218,78.572,258.559,88.645,262.23,93.681L265.9,98.717"/><path marker-end="url(#mermaid-svg-1770558821783-hymcw833t_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-Backend LE-GitHub" id="L-Backend-GitHub-0" d="M203.639,137L177.333,142.75C151.027,148.5,98.416,160,72.11,173.317C45.805,186.633,45.805,201.766,45.805,209.333L45.805,216.899"/><path marker-end="url(#mermaid-svg-1770558821783-hymcw833t_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-Backend LE-GitHubActions" id="L-Backend-GitHubActions-0" d="M255.298,137L246.465,142.75C237.632,148.5,219.966,160,211.134,173.317C202.301,186.633,202.301,201.766,202.301,209.333L202.301,216.899"/><path marker-end="url(#mermaid-svg-1770558821783-hymcw833t_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-GitHubActions LE-Playwright" id="L-GitHubActions-Playwright-0" d="M202.301,256.199L202.301,264.649C202.301,273.099,202.301,289.999,217.05,303.893C231.799,317.787,261.297,328.675,276.046,334.119L290.795,339.563"/><path marker-end="url(#mermaid-svg-1770558821783-hymcw833t_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-Playwright LE-Backend" id="L-Playwright-Backend-0" d="M387.878,341.398L403.456,335.648C419.033,329.898,450.188,318.398,465.766,301.365C481.344,284.332,481.344,261.766,481.344,239.199C481.344,216.633,481.344,194.066,459.877,177.254C438.41,160.441,395.476,149.381,374.008,143.852L352.541,138.322"/><path marker-end="url(#mermaid-svg-1770558821783-hymcw833t_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-Backend LE-PostgreSQL" id="L-Backend-PostgreSQL-0" d="M307.527,137L316.359,142.75C325.192,148.5,342.858,160,351.691,170.617C360.523,181.233,360.523,190.967,360.523,195.833L360.523,200.7"/><path marker-end="url(#mermaid-svg-1770558821783-hymcw833t_flowchart-pointEnd)" style="fill:none;" class="edge-thickness-normal edge-pattern-solid flowchart-link LS-Frontend LE-Backend" id="L-Frontend-Backend-1" d="M293.802,34L297.993,39.75C302.184,45.5,310.566,57,311.086,67.786C311.606,78.572,304.265,88.645,300.595,93.681L296.924,98.717"/></g><g class="edgeLabels"><g transform="translate(243.876953125, 68.5)" class="edgeLabel"><g transform="translate(-22.984375, -9.5)" class="label"><rect height="19.000381469726562" width="45.9459114074707" ry="0" rx="0"/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">HTTPS</tspan></text></g></g><g transform="translate(45.8046875, 171.5)" class="edgeLabel"><g transform="translate(-36.06640625, -9.5)" class="label"><rect height="19.000381469726562" width="72.09473419189453" ry="0" rx="0"/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">OAuth 2.0</tspan></text></g></g><g transform="translate(202.30078125, 171.5)" class="edgeLabel"><g transform="translate(-36.26171875, -9.5)" class="label"><rect height="19.000381469726562" width="72.4844970703125" ry="0" rx="0"/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">Webhooks</tspan></text></g></g><g transform="translate(202.30078125, 306.8984603881836)" class="edgeLabel"><g transform="translate(-28.66015625, -9.5)" class="label"><rect height="19.000381469726562" width="57.291202545166016" ry="0" rx="0"/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">Executa</tspan></text></g></g><g transform="translate(481.34375, 239.1992301940918)" class="edgeLabel"><g transform="translate(-38.2890625, -9.5)" class="label"><rect height="19.000381469726562" width="76.53609466552734" ry="0" rx="0"/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">Resultados</tspan></text></g></g><g transform="translate(360.5234375, 171.5)" class="edgeLabel"><g transform="translate(-27.98828125, -9.5)" class="label"><rect height="19.000381469726562" width="55.948280334472656" ry="0" rx="0"/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">Persiste</tspan></text></g></g><g transform="translate(318.947265625, 68.5)" class="edgeLabel"><g transform="translate(-32.0859375, -9.5)" class="label"><rect height="19.000381469726562" width="64.13923645019531" ry="0" rx="0"/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">Visualiza</tspan></text></g></g></g><g class="nodes"><g transform="translate(281.412109375, 17)" id="flowchart-Frontend-42" class="node default default flowchart-label"><rect height="34" width="161.9609375" y="-17" x="-80.98046875" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(0, -9.5)" style="" class="label"><rect/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">Frontend React/Vite</tspan></text></g></g><g transform="translate(281.412109375, 120)" id="flowchart-Backend-43" class="node default default flowchart-label"><rect height="34" width="196.625" y="-17" x="-98.3125" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(0, -9.5)" style="" class="label"><rect/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">Backend Node.js/Express</tspan></text></g></g><g transform="translate(45.8046875, 239.1992301940918)" id="flowchart-GitHub-45" class="node default default flowchart-label"><rect height="34" width="91.609375" y="-17" x="-45.8046875" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(0, -9.5)" style="" class="label"><rect/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">GitHub API</tspan></text></g></g><g transform="translate(202.30078125, 239.1992301940918)" id="flowchart-GitHubActions-47" class="node default default flowchart-label"><rect height="34" width="121.3828125" y="-17" x="-60.69140625" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(0, -9.5)" style="" class="label"><rect/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">GitHub Actions</tspan></text></g></g><g transform="translate(341.822265625, 358.3984603881836)" id="flowchart-Playwright-49" class="node default default flowchart-label"><rect height="34" width="131.1171875" y="-17" x="-65.55859375" ry="0" rx="0" style="" class="basic label-container"/><g transform="translate(0, -9.5)" style="" class="label"><rect/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">Playwright Tests</tspan></text></g></g><g transform="translate(360.5234375, 239.1992301940918)" id="flowchart-PostgreSQL-53" class="node default default flowchart-label"><path transform="translate(-47.53125,-33.19923317239421)" d="M 0,10.799488781596137 a 47.53125,10.799488781596137 0,0,0 95.0625 0 a 47.53125,10.799488781596137 0,0,0 -95.0625 0 l 0,44.79948878159614 a 47.53125,10.799488781596137 0,0,0 95.0625 0 l 0,-44.79948878159614" style=""/><g transform="translate(0, -9.5)" style="" class="label"><rect/><text style=""><tspan class="row" x="0" dy="1em" xml:space="preserve">PostgreSQL</tspan></text></g></g></g></g></g></svg>










## Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)
- Conta GitHub com OAuth App configurado

## Configuração Inicial

### 1. Configurar GitHub OAuth App

1. Acesse GitHub Settings > Developer settings > OAuth Apps
2. Crie uma nova OAuth App:
   - Application name: Test Automation Dashboard
   - Homepage URL: `http://localhost:3001`
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
3. Copie o Client ID e Client Secret

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DB_PASSWORD=seu_password_seguro
JWT_SECRET=seu_jwt_secret_minimo_32_caracteres
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret
GITHUB_WEBHOOK_SECRET=seu_webhook_secret
```

### 3. Iniciar com Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### 4. Executar Migrations

```bash
# Entrar no container do backend
docker-compose exec backend sh

# Executar migrations
npm run migration:run
```

## Desenvolvimento Local

### Backend

```bash
cd dashboard-backend
npm install
npm run dev
```

### Frontend

```bash
cd dashboard-frontend
npm install
npm run dev
```

## Estrutura do Projeto

```
Dashboard/
├── dashboard-backend/      # API Backend
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Handlers de rotas
│   │   ├── services/       # Lógica de negócio
│   │   ├── middleware/     # Middlewares
│   │   ├── routes/         # Definição de rotas
│   │   └── types/          # TypeScript types
│   ├── prisma/             # Schema e migrations
│   └── package.json
│
├── dashboard-frontend/     # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas
│   │   ├── services/       # API clients
│   │   ├── store/          # State management
│   │   └── types/          # TypeScript types
│   └── package.json
│
├── docker-compose.yml      # Orquestração Docker
└── .env.example            # Exemplo de variáveis
```

## API Endpoints

### Autenticação
- `GET /auth/github` - Iniciar OAuth flow
- `GET /auth/github/callback` - Callback do GitHub
- `POST /auth/logout` - Logout

### Projetos
- `GET /api/projects` - Listar projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Detalhes do projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Execuções
- `GET /api/executions` - Listar execuções
- `POST /api/executions` - Disparar execução
- `GET /api/executions/:id` - Detalhes da execução
- `GET /api/executions/:id/release-gate` - Verificar gate de release

### Métricas
- `GET /api/metrics/summary` - Resumo de métricas
- `GET /api/metrics/trends` - Tendências
- `GET /api/metrics/flaky` - Testes flaky



