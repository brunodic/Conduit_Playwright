# 🤖 Integração com Ollama para Análise de Testes

Este projeto usa a **Ollama** para analisar automaticamente os arquivos `.md` (page snapshots) gerados pelo Playwright e criar relatórios detalhados de análise de erros.

## 📋 Pré-requisitos

1. **Ollama instalado e rodando**
   ```bash
   # Instalar Ollama (se ainda não tiver)
   # Windows: https://ollama.com/download
   # Linux/Mac: curl -fsSL https://ollama.com/install.sh | sh
   
   # Iniciar Ollama
   ollama serve
   ```

2. **Modelo da Ollama baixado**
   ```bash
   # Baixar modelo (recomendado: llama3.2)
   ollama pull llama3.2
   
   # Ou usar outro modelo
   ollama pull mistral
   ollama pull codellama
   ```

## 🚀 Como Usar

### Opção 1: Executar testes com análise automática

```bash
# Executar testes e gerar análise com Ollama
node scripts/run-tests-with-analysis.js --project=smoke
```

### Opção 2: Executar manualmente

```bash
# 1. Executar testes
npx playwright test --project=smoke

# 2. Adicionar análise ao HTML (com Ollama)
node helpers/enhance-html-report.js
```

### Opção 3: Desabilitar Ollama (análise básica apenas)

```bash
# Desabilitar análise com Ollama
USE_OLLAMA=false node helpers/enhance-html-report.js
```

## ⚙️ Configuração

### Variáveis de Ambiente

Você pode configurar via variáveis de ambiente ou editar diretamente nos scripts:

```bash
# URL da Ollama (padrão: http://localhost:11434)
export OLLAMA_URL=http://localhost:11434

# Modelo a usar (padrão: llama3.2)
export OLLAMA_MODEL=llama3.2

# Desabilitar Ollama
export USE_OLLAMA=false
```

### Modelos Recomendados

- **llama3.2** - Bom equilíbrio entre velocidade e qualidade (padrão)
- **mistral** - Rápido e eficiente
- **codellama** - Especializado em código
- **llama3.1** - Mais preciso, mas mais lento

## 📊 O que a Análise Inclui

A análise da Ollama gera relatórios que incluem:

1. **Identificação do Teste** - Qual teste estava sendo executado
2. **Explicação do Erro** - O que ocorreu durante o teste
3. **Análise de Elementos** - Estado dos campos, botões, mensagens
4. **Possíveis Causas** - Sugestões do que pode ter causado o problema
5. **Recomendações** - Como corrigir ou melhorar o teste

## 📁 Estrutura dos Arquivos

```
automation/
├── helpers/
│   ├── ollama-analyzer.js      # Módulo de integração com Ollama
│   └── enhance-html-report.js  # Adiciona análise ao HTML
├── scripts/
│   └── run-tests-with-analysis.js  # Script wrapper completo
└── reports/
    └── html-reports/
        └── [timestamp]/
            ├── index.html      # HTML com análise da Ollama
            └── data/
                └── *.md        # Snapshots analisados
```

## 🔍 Exemplo de Análise

A análise aparece no HTML report em uma seção dedicada:

```
🤖 Análise com IA (Ollama)

✅ d30ee8a339fbf60096b5d26dd46b5011fd72ba3b.md

## Resumo
O teste estava tentando registrar um novo usuário...

## Análise Detalhada
A página mostra a tela de "Sign up" com uma mensagem de erro...

## Possíveis Causas
1. Email já existe no banco de dados
2. Teste anterior não limpou os dados...

## Recomendações
1. Adicionar limpeza antes do teste
2. Validar mensagem de erro no teste...
```

## 🐛 Troubleshooting

### Ollama não está respondendo

```bash
# Verificar se Ollama está rodando
curl http://localhost:11434/api/tags

# Reiniciar Ollama
ollama serve
```

### Modelo não encontrado

```bash
# Listar modelos disponíveis
ollama list

# Baixar modelo necessário
ollama pull llama3.2
```

### Análise muito lenta

- Use um modelo menor (ex: `mistral`)
- Ou desabilite a análise: `USE_OLLAMA=false`

## 📝 Notas

- A análise da Ollama é opcional e pode ser desabilitada
- Cada arquivo `.md` é analisado individualmente
- O relatório é adicionado automaticamente ao HTML report
- A análise pode levar alguns segundos por arquivo

