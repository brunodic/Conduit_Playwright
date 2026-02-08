### TC-HOME-001: Acesso à Home com usuário autenticado
**Prioridade:** P0  
**Tags:** @ui @smoke @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado

**Descrição Gherkin:**
```gherkin
@ui @smoke @regression @high @risk @businessCritical @critical
Feature: Home / Feed

  Scenario: Acesso à Home com usuário autenticado
    Given que estou autenticado na aplicação
    When acesso a rota "/#/"
    Then o feed principal é carregado
    And as abas "Your Feed" e "Global Feed" são exibidas
    And uma lista de artigos é exibida no feed
```

**Passos para reprodução:**
1. Autenticar na aplicação
2. Navegar para `/#/` (Home)

**Resultado esperado:**
- Tela principal exibida com feed
- Nenhum erro de carregamento

---

### TC-HOME-002: Acesso à Home sem autenticação
**Prioridade:** P1  
**Tags:** @ui @regression @medium @risk

**Pré-condições:**
- Usuário não autenticado

**Descrição Gherkin:**
```gherkin
@ui @regression @medium @risk
Scenario: Acesso à Home sem autenticação
  Given que não estou autenticado
  When acesso a Home "/#/"
  Then o feed público é exibido
  And a opção de "Sign in" e "Sign up" aparecem no header
```

**Passos para reprodução:**
1. Garantir que não há sessão ativa
2. Acessar `/#/`

**Resultado esperado:**
- Feed público/Global exibido
- Botões de login/registro visíveis

---

### TC-HOME-003: Filtro por tag no feed
**Prioridade:** P1  
**Tags:** @ui @e2e @regression @medium @risk

**Pré-condições:**
- Existe ao menos uma tag disponível
- Existem artigos associados à tag

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @medium @risk
Scenario: Filtrar feed por tag
  Given que estou na Home com o feed carregado
  When clico em uma tag na lista de tags
  Then o feed é recarregado
  And apenas artigos com a tag selecionada são exibidos
```

**Passos para reprodução:**
1. Ir para `/#/`
2. Aguardar carregar as tags
3. Clicar em uma tag específica

**Resultado esperado:**
- Requisição ao backend com filtro de tag
- Lista atualizada apenas com artigos da tag

---

### TC-HOME-004: Estado vazio do feed
**Prioridade:** P2  
**Tags:** @ui @regression @low @risk

**Pré-condições:**
- Ambiente/mocks configurados sem artigos para o filtro atual

**Descrição Gherkin:**
```gherkin
@ui @regression @low @risk
Scenario: Exibição de estado vazio quando não há artigos
  Given que estou na Home
  And não há artigos para o filtro atual
  Then uma mensagem de "No articles are here... yet." é exibida
  And nenhuma lista de artigos é mostrada
```

**Passos para reprodução:**
1. Configurar cenário sem artigos
2. Acessar `/#/`

**Resultado esperado:**
- Mensagem de estado vazio exibida
- Nenhum card de artigo exibido

---

### TC-HOME-005: Performance de carregamento da Home
**Prioridade:** P1  
**Tags:** @ui @performance @regression @medium @risk

**Pré-condições:**
- Ambiente com volume de dados representativo

**Descrição Gherkin:**
```gherkin
@ui @performance @regression @medium @risk
Scenario: Tempo de carregamento da Home
  Given que estou autenticado
  When acesso a Home
  Then o feed e as tags devem estar completamente carregados em até X segundos
```

**Passos para reprodução:**
1. Autenticar
2. Medir tempo de carregamento da Home

**Resultado esperado:**
- Tempo dentro do SLA definido


