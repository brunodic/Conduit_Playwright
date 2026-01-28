### TC-ARTICLE-001: Visualizar detalhe de artigo
**Prioridade:** P0  
**Tags:** @ui @e2e @smoke @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Pelo menos um artigo existente

**Descrição Gherkin:**
```gherkin
@ui @e2e @smoke @regression @high @risk @businessCritical @critical
Feature: Artigos

  Scenario: Visualizar o detalhe de um artigo
    Given que estou na Home com artigos listados
    When clico no título de um artigo
    Then sou redirecionado para a página de detalhe do artigo
    And o título, corpo, autor, data e tags do artigo são exibidos
```

**Passos para reprodução:**
1. Acessar `/#/`
2. Clicar em um artigo

**Resultado esperado:**
- Página de detalhe do artigo carregada
- Conteúdo exibido corretamente

---

### TC-ARTICLE-002: Like/Favorite de artigo
**Prioridade:** P1  
**Tags:** @ui @e2e @regression @medium @risk

**Pré-condições:**
- Usuário autenticado
- Artigo existente

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @medium @risk
Scenario: Marcar artigo como favorito
  Given que estou autenticado e visualizando um artigo
  When clico no botão de favoritar
  Then o contador de favoritos é incrementado
  And o estado do botão é alterado para "favoritado"
```

**Passos para reprodução:**
1. Fazer login
2. Navegar para um artigo
3. Clicar em "Favorite"

**Resultado esperado:**
- Contador aumenta
- Botão passa a indicar estado ativo

---

### TC-ARTICLE-003: Acesso não autorizado à edição de artigo de outro usuário
**Prioridade:** P0  
**Tags:** @ui @security @e2e @regression @high @risk @critical

**Pré-condições:**
- Usuário autenticado
- Artigo que não pertence ao usuário logado

**Descrição Gherkin:**
```gherkin
@ui @security @e2e @regression @high @risk @critical
Scenario: Usuário tenta editar artigo de outro autor
  Given que estou autenticado como Usuário A
  And estou visualizando um artigo criado pelo Usuário B
  When tento acessar a rota de edição do artigo
  Then não tenho acesso à edição
  And não vejo botões de edição/exclusão
```

**Passos para reprodução:**
1. Logar como Usuário A
2. Acessar artigo criado por Usuário B
3. Verificar ausência de botões de edição/exclusão

**Resultado esperado:**
- Nenhum controle de edição/exclusão disponível
- Se acessar rota diretamente, deve haver bloqueio/redirecionamento

---

### TC-ARTICLE-004: Estado vazio de comentários
**Prioridade:** P2  
**Tags:** @ui @regression @low @risk

**Pré-condições:**
- Artigo sem comentários

**Descrição Gherkin:**
```gherkin
@ui @regression @low @risk
Scenario: Exibir estado vazio de comentários
  Given que estou na página de detalhe de um artigo sem comentários
  Then uma mensagem indicando que ainda não há comentários é exibida
  And nenhum card de comentário é exibido
```

**Passos para reprodução:**
1. Navegar para um artigo sem comentários

**Resultado esperado:**
- Mensagem de "No comments yet" (ou equivalente)


