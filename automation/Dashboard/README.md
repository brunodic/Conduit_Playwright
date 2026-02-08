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

## Próximos Passos

Consulte o plano completo em `.cursor/plans/` para ver todas as fases de desenvolvimento.

