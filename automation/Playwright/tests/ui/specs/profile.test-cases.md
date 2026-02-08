### TC-PROFILE-001: Visualizar perfil público de usuário
**Prioridade:** P1  
**Tags:** @ui @e2e @regression @medium @risk

**Pré-condições:**
- Usuário existente com artigos públicos

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @medium @risk
Feature: Perfil de Usuário

  Scenario: Visualizar perfil público
    Given que estou na Home
    When clico no nome de um autor em um artigo
    Then sou redirecionado para a página de perfil desse usuário
    And o nome, bio e lista de artigos do usuário são exibidos
```

**Passos para reprodução:**
1. Acessar `/#/`
2. Clicar no nome de um autor

**Resultado esperado:**
- Página de perfil carregada
- Artigos do usuário listados

---

### TC-PROFILE-002: Follow/Unfollow de usuário
**Prioridade:** P1  
**Tags:** @ui @e2e @regression @medium @risk

**Pré-condições:**
- Usuário autenticado
- Perfil de outro usuário aberto

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @medium @risk
Scenario: Seguir e deixar de seguir usuário
  Given que estou autenticado e na página de perfil de outro usuário
  When clico em "Follow"
  Then o estado do botão muda para "Unfollow"
  And o contador de seguidores é incrementado
  When clico novamente
  Then o estado volta para "Follow"
  And o contador de seguidores é decrementado
```

**Passos para reprodução:**
1. Fazer login
2. Acessar perfil de outro usuário
3. Clicar em "Follow" e depois em "Unfollow"

**Resultado esperado:**
- Mudança de estado consistente
- Contadores coerentes com a ação

---

### TC-PROFILE-003: Perfil com abas "My Articles" e "Favorited Articles"
**Prioridade:** P2  
**Tags:** @ui @regression @low @risk

**Pré-condições:**
- Perfil com artigos próprios e artigos favoritados

**Descrição Gherkin:**
```gherkin
@ui @regression @low @risk
Scenario: Alternar entre artigos próprios e favoritados
  Given que estou na página de perfil de um usuário
  When clico em "My Articles"
  Then são exibidos apenas artigos criados pelo usuário
  When clico em "Favorited Articles"
  Then são exibidos apenas artigos favoritados pelo usuário
```

**Passos para reprodução:**
1. Acessar página de perfil
2. Alternar entre as abas

**Resultado esperado:**
- Listas coerentes com a aba ativa


