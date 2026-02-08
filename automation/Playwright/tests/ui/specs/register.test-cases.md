### TC-REGISTER-001: Acesso à tela de Registro
**Prioridade:** P1  
**Tags:** @ui @smoke @regression @medium @risk

**Pré-condições:**
- Aplicação acessível
- Usuário não autenticado

**Descrição Gherkin:**
```gherkin
@ui @smoke @regression @medium @risk
Feature: Registro

  Scenario: Acesso direto à tela de Registro
    Given que não estou autenticado
    When acesso a rota "/#/register"
    Then a tela de Registro é carregada
    And os campos "Username", "Email" e "Password" são exibidos
```

**Passos para reprodução:**
1. Abrir o navegador
2. Navegar para `/#/register`

**Resultado esperado:**
- Tela de registro carregada corretamente
- Formulário visível com todos os campos

---

### TC-REGISTER-002: Registro bem-sucedido
**Prioridade:** P0  
**Tags:** @ui @e2e @smoke @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Aplicação acessível
- Backend disponível
- Email ainda não cadastrado

**Descrição Gherkin:**
```gherkin
@ui @e2e @smoke @regression @high @risk @businessCritical @critical
Scenario: Registro de novo usuário com dados válidos
  Given que estou na tela de Registro
  When preencho "Username", "Email" e "Password" com valores válidos
  And clico em "Sign up"
  Then o usuário é criado com sucesso
  And sou autenticado automaticamente
  And sou redirecionado para a Home
```

**Passos para reprodução:**
1. Acessar `/#/register`
2. Preencher todos os campos com dados válidos
3. Clicar em "Sign up"

**Resultado esperado:**
- Chamada de API de criação de usuário retorna sucesso
- Usuário logado e redirecionado

---

### TC-REGISTER-003: Registro negativo - email já utilizado
**Prioridade:** P0  
**Tags:** @ui @e2e @regression @high @risk @critical

**Pré-condições:**
- Email já cadastrado no sistema

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @high @risk @critical
Scenario: Tentativa de registro com email já utilizado
  Given que estou na tela de Registro
  When informo um email já cadastrado
  And preencho os demais campos corretamente
  And clico em "Sign up"
  Then o registro é recusado
  And uma mensagem de erro indicando email já utilizado é exibida
```

**Passos para reprodução:**
1. Acessar `/#/register`
2. Preencher com email já existente
3. Clicar em "Sign up"

**Resultado esperado:**
- Nenhum novo usuário criado
- Mensagem clara de email duplicado

---

### TC-REGISTER-004: Registro negativo - senha fraca
**Prioridade:** P1  
**Tags:** @ui @security @regression @medium @risk

**Pré-condições:**
- Políticas de senha definidas (mínimo de caracteres, complexidade, etc.)

**Descrição Gherkin:**
```gherkin
@ui @security @regression @medium @risk
Scenario: Tentativa de registro com senha fraca
  Given que estou na tela de Registro
  When informo uma senha fraca (ex.: "123456")
  And preencho os demais campos corretamente
  And clico em "Sign up"
  Then o registro é bloqueado
  And é exibida mensagem indicando que a senha não atende aos requisitos mínimos
```

**Passos para reprodução:**
1. Acessar `/#/register`
2. Preencher "Username" e "Email" válidos
3. Preencher "Password" com valor fraco
4. Clicar em "Sign up"

**Resultado esperado:**
- Nenhum usuário criado
- Mensagem de erro de senha fraca exibida

---

### TC-REGISTER-005: Validação visual da tela de Registro
**Prioridade:** P2  
**Tags:** @ui @regression @low @risk @accessibility

**Pré-condições:**
- Resolução padrão definida

**Descrição Gherkin:**
```gherkin
@ui @regression @low @risk @accessibility
Scenario: Verificação visual da tela de Registro
  Given que estou na tela de Registro
  Then o título "Sign up" é exibido corretamente
  And os campos do formulário estão alinhados
  And não há barras de rolagem horizontais
  And o botão "Sign up" está visível e com contraste adequado
```

**Passos para reprodução:**
1. Abrir `/#/register` na resolução de referência
2. Verificar alinhamento, contraste, responsividade

**Resultado esperado:**
- Layout limpo, sem sobreposição
- Acessibilidade visual básica atendida


