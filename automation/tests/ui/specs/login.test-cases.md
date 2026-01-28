### TC-LOGIN-001: Acesso à tela de Login
**Prioridade:** P0  
**Tags:** @ui @smoke @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Aplicação acessível
- Usuário não autenticado

**Descrição Gherkin:**
```gherkin
@ui @smoke @regression @high @risk @businessCritical @critical
Feature: Login

  Scenario: Acesso direto à tela de Login
    Given que não estou autenticado na aplicação
    When acesso a rota "/#/login"
    Then a tela de Login é carregada
    And os campos "Email" e "Password" são exibidos
    And o botão "Sign in" está desabilitado enquanto o formulário está inválido
```

**Passos para reprodução:**
1. Abrir o navegador
2. Navegar diretamente para `/#/login`

**Resultado esperado:**
- Tela de Login exibida sem erros
- Campos de email e senha visíveis
- Botão "Sign in" desabilitado até que o formulário seja válido

---

### TC-LOGIN-002: Login bem-sucedido
**Prioridade:** P0  
**Tags:** @ui @e2e @smoke @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário válido existente (email e senha conhecidos)
- Backend de autenticação disponível

**Descrição Gherkin:**
```gherkin
@ui @e2e @smoke @regression @high @risk @businessCritical @critical
Scenario: Login com credenciais válidas
  Given que estou na tela de Login
  When preencho o campo "Email" com um usuário válido
  And preencho o campo "Password" com a senha correta
  And clico no botão "Sign in"
  Then sou autenticado com sucesso
  And sou redirecionado para a Home/Feed principal
  And o meu nome de usuário aparece no header
```

**Passos para reprodução:**
1. Navegar para `/#/login`
2. Informar email e senha válidos
3. Clicar em "Sign in"

**Resultado esperado:**
- Requisição de login enviada ao backend
- Resposta 2xx recebida
- Redirecionamento para a Home (`/#/` ou rota configurada)
- Header exibindo usuário logado

---

### TC-LOGIN-003: Login negativo - senha incorreta
**Prioridade:** P0  
**Tags:** @ui @e2e @regression @high @risk @critical

**Pré-condições:**
- Usuário existente com email conhecido

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @high @risk @critical
Scenario: Tentativa de login com senha incorreta
  Given que estou na tela de Login
  When preencho o email corretamente
  And preencho a senha incorretamente
  And clico em "Sign in"
  Then o login é recusado
  And uma mensagem de erro amigável é exibida
  And permaneço na tela de Login
```

**Passos para reprodução:**
1. Acessar `/#/login`
2. Informar email válido e senha incorreta
3. Clicar em "Sign in"

**Resultado esperado:**
- Nenhum token de sessão é criado
- Mensagem de erro do tipo "Email ou senha inválidos"
- Campos permanecem preenchidos para correção

---

### TC-LOGIN-004: Login negativo - validação de campos obrigatórios
**Prioridade:** P1  
**Tags:** @ui @regression @medium @risk

**Pré-condições:**
- Tela de Login carregada

**Descrição Gherkin:**
```gherkin
@ui @regression @medium @risk
Scenario: Tentativa de login com campos obrigatórios vazios
  Given que estou na tela de Login
  When deixo os campos "Email" e "Password" vazios
  And tento submeter o formulário
  Then o formulário não é enviado
  And mensagens de validação são exibidas
```

**Passos para reprodução:**
1. Acessar `/#/login`
2. Não preencher nenhum campo
3. Tentar submeter (clicar em "Sign in" ou pressionar Enter)

**Resultado esperado:**
- Mensagens de erro de campo obrigatório
- Nenhuma chamada de API é feita

---

### TC-LOGIN-005: Validação visual da tela de Login
**Prioridade:** P2  
**Tags:** @ui @regression @low @risk @accessibility

**Pré-condições:**
- Resolução padrão definida (ex.: 1920x1080)

**Descrição Gherkin:**
```gherkin
@ui @regression @low @risk @accessibility
Scenario: Verificação visual da tela de Login
  Given que estou na tela de Login
  Then o título "Sign in" é exibido corretamente
  And o formulário está centralizado na tela
  And não há barras de rolagem horizontais
  And os elementos possuem contraste adequado
```

**Passos para reprodução:**
1. Abrir `/#/login` na resolução de referência
2. Verificar alinhamento, contraste e ausência de scroll horizontal

**Resultado esperado:**
- Layout consistente e responsivo
- Itens legíveis com contraste adequado

---

### TC-LOGIN-006: Segurança - sessão e rota protegida
**Prioridade:** P0  
**Tags:** @ui @security @e2e @regression @high @risk @critical

**Pré-condições:**
- Usuário não autenticado

**Descrição Gherkin:**
```gherkin
@ui @security @e2e @regression @high @risk @critical
Scenario: Acesso a rota protegida sem autenticação
  Given que não estou autenticado
  When tento acessar diretamente uma rota protegida (por exemplo "/#/editor")
  Then sou redirecionado para a tela de Login
  And nenhuma informação sensível é exibida
```

**Passos para reprodução:**
1. Garantir que não há sessão ativa
2. Acessar diretamente `/#/editor`

**Resultado esperado:**
- Redirecionamento imediato para `/#/login`
- Sem flash de conteúdo protegido


