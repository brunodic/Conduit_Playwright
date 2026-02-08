### TC-ACCOUNT-001: Acesso direto à tela de Account Settings
**Prioridade:** P0  
**Tags:** @ui @smoke @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado e com acesso ao módulo Main
- Aplicação acessível

**Descrição Gherkin:**
```gherkin
@ui @smoke @regression @high @risk @businessCritical @critical
Feature: Account Settings

  Scenario: Acesso direto à tela de Account Settings
    Given que estou autenticado na aplicação
    When acesso a rota "/main/settings/account"
    Then a tela de Account Settings é carregada
    And o componente "AccountIndexComponent" é renderizado
    And os dados do usuário são carregados e exibidos
    And o botão "Update" está desabilitado inicialmente
```

**Passos para reprodução:**
1. Autenticar na aplicação
2. Navegar diretamente para `/main/settings/account`

**Resultado esperado:**
- Rota `/main/settings/account` carregada sem erros
- Componente `AccountIndexComponent` renderizado
- Dados do usuário exibidos (nome completo, email, telefone, roles, foto de perfil)
- Botão "Update" desabilitado (formulário pristine)
- Botão "Update Password" desabilitado
- Loader exibido durante carregamento inicial

---

### TC-ACCOUNT-002: Validação negativa - Campos obrigatórios em branco
**Prioridade:** P0  
**Tags:** @ui @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado na tela de Account Settings
- Formulário carregado com dados do usuário

**Descrição Gherkin:**
```gherkin
@ui @regression @high @risk @businessCritical @critical
Scenario: Tentativa de salvar Account Settings com campos obrigatórios vazios
  Given que estou na tela de Account Settings
  And todos os campos obrigatórios estão preenchidos
  When eu limpo o campo "Nome completo"
  And eu limpo o campo "Email"
  And clico no botão "Update"
  Then a requisição de atualização não é enviada
  And mensagens de erro de validação são exibidas abaixo dos campos obrigatórios
  And o botão "Update" permanece habilitado porém com erros visíveis
```

**Passos para reprodução:**
1. Autenticar e navegar para `/main/settings/account`
2. Limpar o conteúdo dos campos "Nome completo" e "Email"
3. Clicar no botão "Update"

**Resultado esperado:**
- Nenhuma chamada de API de atualização é disparada
- Mensagens de validação visíveis, por exemplo:
  - "Nome completo é obrigatório"
  - "Email é obrigatório"
- Campos com borda/estilo visual de erro
- Foco automático no primeiro campo inválido

---

### TC-ACCOUNT-003: Validação negativa - Email inválido
**Prioridade:** P1  
**Tags:** @ui @regression @medium @risk

**Pré-condições:**
- Usuário autenticado na tela de Account Settings
- Formulário carregado

**Descrição Gherkin:**
```gherkin
@ui @regression @medium @risk
Scenario: Tentativa de salvar Account Settings com email inválido
  Given que estou na tela de Account Settings
  When preencho o campo "Email" com "usuario_invalido"
  And clico no botão "Update"
  Then uma mensagem de validação indicando email inválido é exibida
  And a atualização não é efetuada
```

**Passos para reprodução:**
1. Autenticar e navegar para `/main/settings/account`
2. Alterar o campo "Email" para um valor inválido, ex.: `usuario_invalido`
3. Clicar em "Update"

**Resultado esperado:**
- Mensagem clara de email inválido
- Nenhuma chamada de API persistindo o dado inválido
- Layout permanece estável, sem quebra visual

---

### TC-ACCOUNT-004: Validação visual - Layout da tela de Account Settings
**Prioridade:** P2  
**Tags:** @ui @regression @low @risk @accessibility

**Pré-condições:**
- Usuário autenticado
- Resolução de tela padrão de referência (ex.: 1920x1080)

**Descrição Gherkin:**
```gherkin
@ui @regression @low @risk @accessibility
Scenario: Verificação visual da tela de Account Settings
  Given que estou na tela de Account Settings em resolução padrão
  Then o título da página "Account Settings" é exibido corretamente
  And os campos de formulário estão alinhados verticalmente
  And o avatar/foto de perfil é exibido com proporções corretas
  And os botões "Update" e "Update Password" estão visíveis e alinhados
  And o formulário é totalmente visível sem barras de rolagem horizontais
```

**Passos para reprodução:**
1. Autenticar na aplicação
2. Ajustar o navegador para resolução padrão (ex.: 1920x1080)
3. Navegar para `/main/settings/account`
4. Verificar o layout geral da tela

**Resultado esperado:**
- Nenhuma sobreposição de componentes
- Sem scroll horizontal
- Labels legíveis e alinhados aos campos
- Botões com contraste adequado em relação ao fundo

---

### TC-ACCOUNT-005: Atualização bem-sucedida dos dados de Account
**Prioridade:** P0  
**Tags:** @ui @e2e @regression @high @risk @businessCritical @critical

**Pré-condições:**
- Usuário autenticado e com permissão para alterar os próprios dados
- Backend disponível

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @high @risk @businessCritical @critical
Scenario: Atualização bem-sucedida dos dados de Account
  Given que estou na tela de Account Settings
  When atualizo o campo "Nome completo" para um novo valor válido
  And atualizo o campo "Telefone" para um valor válido
  And clico em "Update"
  Then uma chamada de API de atualização é enviada com os novos dados
  And recebo resposta de sucesso
  And uma mensagem de confirmação é exibida
  And os dados atualizados são persistidos e recarregados na tela
```

**Passos para reprodução:**
1. Autenticar e navegar até `/main/settings/account`
2. Atualizar pelo menos dois campos válidos (ex.: nome, telefone)
3. Clicar no botão "Update"
4. Validar a resposta da API (quando possível)
5. Recarregar a página e conferir persistência

**Resultado esperado:**
- Chamada de API `PUT/PATCH` enviada com payload correto
- Status de sucesso (2xx) retornado
- Toast/mensagem de sucesso exibido
- Dados consistentes após reload

---

### TC-ACCOUNT-006: Atualização de senha com falha de segurança (senha fraca)
**Prioridade:** P0  
**Tags:** @ui @security @regression @high @risk @critical

**Pré-condições:**
- Usuário autenticado
- Usuário com permissão para alterar a própria senha

**Descrição Gherkin:**
```gherkin
@ui @security @regression @high @risk @critical
Scenario: Tentativa de atualizar senha com senha fraca
  Given que estou na tela de Account Settings
  And o formulário de alteração de senha está visível
  When informo a senha atual correta
  And informo uma nova senha fraca (ex.: "123456")
  And confirmo a mesma senha fraca
  And clico em "Update Password"
  Then a senha não é atualizada
  And é exibida mensagem de erro indicando política de senha forte
```

**Passos para reprodução:**
1. Navegar para `/main/settings/account`
2. Abrir a seção de alteração de senha (se aplicável)
3. Preencher senha atual correta
4. Preencher nova senha fraca (ex.: `123456`)
5. Clicar em "Update Password"

**Resultado esperado:**
- Regra de complexidade de senha aplicada (tamanho mínimo, caracteres, etc.)
- Mensagem clara orientando o usuário
- Nenhuma alteração na senha no backend

---

### TC-ACCOUNT-007: Comportamento em indisponibilidade de API
**Prioridade:** P0  
**Tags:** @ui @e2e @regression @high @risk @businessCritical

**Pré-condições:**
- Usuário autenticado na tela de Account Settings
- Simulação de indisponibilidade da API (ex.: via mock, desligar serviço, resposta 5xx)

**Descrição Gherkin:**
```gherkin
@ui @e2e @regression @high @risk @businessCritical
Scenario: Tratamento de erro ao tentar atualizar Account Settings com API indisponível
  Given que estou na tela de Account Settings
  And a API de atualização está indisponível
  When clico em "Update" para salvar alterações válidas
  Then uma mensagem de erro amigável é exibida
  And os dados do formulário não são perdidos
  And o usuário pode tentar novamente após algum tempo
```

**Passos para reprodução:**
1. Configurar ambiente/mocks para simular erro 5xx na API de atualização
2. Navegar até `/main/settings/account`
3. Alterar alguns campos válidos
4. Clicar em "Update"

**Resultado esperado:**
- Exibição de mensagem de erro amigável, sem detalhes técnicos sensíveis
- Nenhuma navegação inesperada (permanece na mesma tela)
- Campos permanecem preenchidos para tentar novamente

---

### TC-ACCOUNT-008: Teste de performance na carga de Account Settings
**Prioridade:** P1  
**Tags:** @ui @performance @regression @medium @risk

**Pré-condições:**
- Ambiente com volume de dados representativo
- Ferramenta de medição de tempo habilitada (ex.: métricas no teste automátizado)

**Descrição Gherkin:**
```gherkin
@ui @performance @regression @medium @risk
Scenario: Tempo de carregamento da tela de Account Settings
  Given que estou autenticado na aplicação
  When acesso a rota "/main/settings/account"
  Then a tela de Account Settings deve ser totalmente carregada em até X segundos
  And o loader deve permanecer visível apenas durante o carregamento
```

**Passos para reprodução:**
1. Autenticar o usuário
2. Acessar `/main/settings/account` com monitoramento de tempo habilitado
3. Medir o tempo até que todos os componentes estejam visíveis e estáveis

**Resultado esperado:**
- Tempo total dentro do SLA definido (ex.: <= 3s)
- Sem travamentos perceptíveis
- Nenhuma requisição pendente após estabilização da tela


