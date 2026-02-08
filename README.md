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



