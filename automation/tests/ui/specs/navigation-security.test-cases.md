### TC-NAV-001: Itens do header para usuário não autenticado
**Prioridade:** P1  
**Tags:** @ui @regression @medium @risk

**Pré-condições:**
- Usuário não autenticado

**Descrição Gherkin:**
```gherkin
@ui @regression @medium @risk
Feature: Navegação e Segurança

  Scenario: Header para visitante
    Given que não estou autenticado
    When acesso a Home
    Then o header exibe "Home", "Sign in" e "Sign up"
    And não exibe itens de usuário autenticado (ex.: "New Article", "Settings")
```

**Passos para reprodução:**
1. Garantir que não há sessão
2. Acessar `/#/`

**Resultado esperado:**
- Itens corretos para visitante exibidos

---

### TC-NAV-002: Itens do header para usuário autenticado
**Prioridade:** P0  
**Tags:** @ui @smoke @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado

**Descrição Gherkin:**
```gherkin
@ui @smoke @regression @high @risk @businessCritical @critical
Scenario: Header para usuário autenticado
  Given que estou autenticado
  When acesso a Home
  Then o header exibe "Home", "New Article", "Settings" e meu nome de usuário
  And não exibe "Sign in" e "Sign up"
```

**Passos para reprodução:**
1. Fazer login
2. Acessar `/#/`

**Resultado esperado:**
- Menu condizente com usuário logado

---

### TC-NAV-003: Proteção de rotas críticas
**Prioridade:** P0  
**Tags:** @ui @security @e2e @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário não autenticado

**Descrição Gherkin:**
```gherkin
@ui @security @e2e @regression @high @risk @businessCritical @critical
Scenario: Bloqueio de acesso a rotas protegidas para usuário não autenticado
  Given que não estou autenticado
  When tento acessar rotas como "/#/editor" ou "/#/settings"
  Then sou redirecionado para a tela de Login
  And não vejo conteúdo protegido
```

**Passos para reprodução:**
1. Deslogar
2. Acessar diretamente `/#/editor` e `/#/settings`

**Resultado esperado:**
- Redirecionamento para login em todas as rotas protegidas

---

### TC-NAV-004: Logout
**Prioridade:** P0  
**Tags:** @ui @e2e @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @high @risk @businessCritical @critical
Scenario: Logout do usuário
  Given que estou autenticado
  When clico na opção de "Logout" (se disponível) ou equivalente
  Then minha sessão é encerrada
  And sou redirecionado para a Home ou Login
  And o header volta a exibir opções de visitante
```

**Passos para reprodução:**
1. Fazer login
2. Executar ação de logout

**Resultado esperado:**
- Token removido
- Header atualizado


