### TC-EDITOR-001: Acesso ao editor para novo artigo
**Prioridade:** P0  
**Tags:** @ui @e2e @smoke @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado

**Descrição Gherkin:**
```gherkin
@ui @e2e @smoke @regression @high @risk @businessCritical @critical
Feature: Editor de Artigos

  Scenario: Acessar editor para criar novo artigo
    Given que estou autenticado
    When acesso a rota "/#/editor"
    Then o editor de artigos é carregado
    And os campos "Title", "Description", "Body" e "Tags" são exibidos
```

**Passos para reprodução:**
1. Fazer login
2. Acessar `/#/editor`

**Resultado esperado:**
- Tela de editor carregada
- Todos os campos visíveis

---

### TC-EDITOR-002: Criação bem-sucedida de novo artigo
**Prioridade:** P0  
**Tags:** @ui @e2e @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @high @risk @businessCritical @critical
Scenario: Criar novo artigo com dados válidos
  Given que estou no editor de artigos
  When preencho todos os campos obrigatórios com dados válidos
  And clico em "Publish Article"
  Then o artigo é criado com sucesso
  And sou redirecionado para a página de detalhe do novo artigo
```

**Passos para reprodução:**
1. Acessar `/#/editor`
2. Preencher título, descrição, corpo e tags válidos
3. Clicar em "Publish Article"

**Resultado esperado:**
- Chamada de API de criação bem-sucedida
- Redirecionamento para o artigo recém-criado

---

### TC-EDITOR-003: Validação negativa - campos obrigatórios vazios
**Prioridade:** P1  
**Tags:** @ui @regression @medium @risk

**Pré-condições:**
- Usuário autenticado

**Descrição Gherkin:**
```gherkin
@ui @regression @medium @risk
Scenario: Tentativa de publicar artigo com campos obrigatórios vazios
  Given que estou no editor de artigos
  When deixo os campos obrigatórios em branco
  And clico em "Publish Article"
  Then o artigo não é criado
  And mensagens de validação são exibidas para cada campo obrigatório
```

**Passos para reprodução:**
1. Acessar `/#/editor`
2. Não preencher os campos
3. Clicar em "Publish Article"

**Resultado esperado:**
- Nenhuma requisição de criação enviada
- Mensagens claras de campos obrigatórios

---

### TC-EDITOR-004: Edição de artigo existente (autor correto)
**Prioridade:** P0  
**Tags:** @ui @e2e @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado dono de um artigo

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @high @risk @businessCritical @critical
Scenario: Edição de artigo existente pelo autor
  Given que estou autenticado como autor do artigo
  And acesso a rota "/#/editor/{slug-do-artigo}"
  Then o editor é carregado com os dados do artigo preenchidos
  When altero o título e o corpo
  And clico em "Publish Article"
  Then o artigo é atualizado com sucesso
```

**Passos para reprodução:**
1. Logar como autor
2. Acessar rota de edição do artigo existente
3. Alterar alguns campos
4. Clicar em "Publish Article"

**Resultado esperado:**
- Dados antigos carregados no formulário
- Atualização bem-sucedida após salvar


