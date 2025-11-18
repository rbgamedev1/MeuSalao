# 💇‍♀️ Sistema de Gestão para Salão de Beleza

> Plataforma completa e moderna para gestão de salões de beleza e clínicas estéticas, oferecendo controle total sobre agendamentos, clientes, serviços, produtos e finanças.

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Documentação](#-documentação)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 🎯 Sobre o Projeto

O **Sistema de Gestão para Salão** é uma solução web completa desenvolvida para otimizar a administração de salões de beleza, clínicas estéticas e estabelecimentos similares. Com uma interface intuitiva e recursos robustos, o sistema oferece:

- 📅 Gestão completa de agendamentos
- 👥 Cadastro e histórico de clientes
- 💼 Catálogo de serviços e produtos
- 💰 Controle financeiro integrado
- 📧 Sistema de notificações automáticas
- 🛒 PDV (Ponto de Venda) integrado
- 📊 Relatórios e análises detalhadas

### 🌟 Diferenciais

- **Arquitetura Modular**: Facilita manutenção e expansão do sistema
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Real-time**: Atualizações automáticas de agendamentos e notificações
- **Integração de E-mail**: Sistema automatizado via Mailgun
- **Agenda Online**: Permite que clientes agendem serviços pela web

---

## 🚀 Funcionalidades

### 📅 Agendamentos
- Visualização em calendário, dia e semana
- Sistema de confirmação e lembretes
- Bloqueio de horários
- Filtros por serviços, clientes e profissionais
- Avaliação pós-atendimento
- Gerenciamento de status (pendente, confirmado, realizado, cancelado)

### 👥 Gestão de Clientes
- Cadastro completo com informações pessoais
- Histórico de atendimentos
- Registro de avaliações
- Gerenciamento de planos e fidelidade
- Notas e observações personalizadas

### 💼 Serviços e Produtos
- Catálogo completo organizável por categorias
- Controle de estoque de produtos
- Gestão de fornecedores
- Sistema de precificação
- Estatísticas de vendas
- PDV integrado com carrinho de compras

### 💰 Financeiro
- Lançamentos manuais e automáticos
- Controle de receitas e despesas
- Histórico detalhado de transações
- Relatórios financeiros
- Gráficos e estatísticas
- Múltiplas formas de pagamento

### 👤 Perfil e Configurações
- Gestão de dados pessoais
- Configurações de segurança
- Gerenciamento de planos
- Preferências do sistema
- Controle de profissionais
- Configurações de comunicação

### 📧 Notificações
- E-mails automáticos (confirmação, lembretes)
- Histórico de comunicações
- Templates personalizáveis
- Integração com Mailgun

### 📊 Relatórios
- Relatórios customizados
- Análise de desempenho
- KPIs e métricas principais
- Dashboard executivo

---

## 🛠️ Tecnologias

### Frontend
- **React 18+** - Biblioteca JavaScript para interfaces
- **React Router** - Navegação e roteamento
- **Context API** - Gerenciamento de estado global
- **Custom Hooks** - Lógica reutilizável

### Integrações
- **Mailgun** - Envio de e-mails transacionais
- **APIs RESTful** - Comunicação backend

### Ferramentas de Desenvolvimento
- **ES6+** - JavaScript moderno
- **JSX** - Sintaxe para componentes React
- **CSS Modules / Tailwind** - Estilização

---

## 📁 Estrutura do Projeto

```
src/
├── components/           
│   ├── agendamentos/
│   │   ├── AgendamentoCalendario.jsx 
│   │   ├── AgendamentoDia.jsx 
│   │   ├── AgendamentoFiltros.jsx 
│   │   ├── AgendamentoFormulario.jsx  
│   │   ├── AgendamentoHeader.jsx
│   │   ├── AgendamentoLista.jsx
│   │   ├── AgendamentoSemana.jsx 
│   │   └── BloqueioHorarioForm.jsx                 
│   ├── agendaOnline/
│   │   ├── AgendaError.jsx
│   │   ├── AgendaHeader.jsx
│   │   ├── AgendaLoading.jsx
│   │   ├── AgendaStepDados.jsx  
│   │   ├── AgendaStepIndicator.jsx
│   │   ├── AgendaStepServico.jsx
│   │   ├── AgendaSucesso.jsx 
│   │   └── RealtimeIndicator.jsx        
│   ├── auth/ 
│   │   ├── LoginModal.jsx
│   │   └── RegisterModal.jsx       
│   ├── clientes/   
│   │   ├── AvaliacaoModal.jsx 
│   │   └── ClienteDetalhes.jsx       
│   ├── Configuracoes/
│   │   ├── ConfiguracoesCategorias.jsx
│   │   ├── ConfiguracoesComunicacoes.jsx
│   │   ├── ConfiguracoesGeral.jsx
│   │   ├── ConfiguracoesHeader.jsx
│   │   ├── ConfiguracoesPlanos.jsx
│   │   ├── ConfiguracoesProfissionais.jsx
│   │   ├── ConfiguracoesTabs.jsx
│   │   ├── ProfissionalModal.jsx 
│   │   └── ServicoInfoModal.jsx       
│   ├── financeiro/
│   │   ├── FinanceiroDetails.jsx 
│   │   ├── FinanceiroHeader.jsx
│   │   ├── FinanceiroStats.jsx
│   │   ├── FinanceiroTable.jsx
│   │   └── TransacaoModal.jsx            
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx          
│   ├── perfil/
│   │   ├── PerfilDadosPessoais.jsx
│   │   ├── PerfilHeader.jsx
│   │   ├── PerfilPlanos.jsx
│   │   ├── PerfilSegurança.jsx
│   │   └── PerfilTabs.jsx             
│   ├── produtos/
│   │   ├── EstoqueList.jsx
│   │   ├── FornecedoresList.jsx
│   │   ├── FornecedorModal.jsx
│   │   ├── PDVCarrinho.jsx
│   │   ├── PDVCheckout.jsx
│   │   ├── PDVPagamentoModal.jsx
│   │   ├── PDVProdutoCard.jsx
│   │   ├── ProdutoModal.jsx
│   │   ├── ProdutosAlert.jsx
│   │   ├── ProdutosFilters.jsx
│   │   ├── ProdutosHeader.jsx
│   │   ├── ProdutosStats.jsx
│   │   └── ProdutosTable.jsx                          
│   ├── relatorios/
│   │   ├── RelatoriosCharts.jsx
│   │   ├── RelatoriosStats.jsx
│   │   └── RelatoriosTables.jsx  
│   ├── servicos/
│   │   ├── ServicoModal.jsx
│   │   ├── ServicosFilters.jsx
│   │   ├── ServicosGrid.jsx
│   │   ├── ServicosHeader.jsx
│   │   └── ServicosStats.jsx
│   ├── MaskedInput.jsx
│   ├── Modal.jsx
│   └── PlanRestriction.jsx  
│    
├── config/
│   └── mailgunConfig.js
│
├── context/
│   ├── AuthContext.jsx
│   └── SalaoContext.jsx
│
├── data/                
│   ├── categoriasServicosData.js
│   ├── planosData.js
│   └── servicosDescricoesData.js
│
├── hooks/
│   ├── AgendamentoHooks.jsx
│   ├── useEmailHistorico.js
│   ├── useFinanceiroData.js
│   ├── useFinanceiroFilters.js
│   ├── usePDV.js
│   ├── useRealtimeAgendamentos.js
│   └── useTransacaoForm.js
│
├── pages/
│   ├── landing/
│   │   ├── About.jsx 
│   │   ├── Contact.jsx
│   │   ├── Demo.jsx
│   │   ├── Documentation.jsx
│   │   ├── Help.jsx
│   │   └── Landing.jsx
│   ├── Agendamentos.jsx
│   ├── AgendaOnline.jsx
│   ├── Avaliacao.jsx
│   ├── Clientes.jsx
│   ├── Configuracoes.jsx
│   ├── Dashboard.jsx
│   ├── Financeiro.jsx
│   ├── Perfil.jsx
│   ├── Produtos.jsx
│   ├── Relatorios.jsx
│   └── Servicos.jsx
│
├── services/
│   ├── emailService.js
│   ├── mailgunService.js
│   └── notificationService.js
│
├── utils/
│   ├── planRestrictions/
│   │   ├── accessChecks.js
│   │   ├── index.js
│   │   ├── notificationLevels.js
│   │   ├── planComparison.js
│   │   ├── planInfo.js
│   │   ├── planLimits.js
│   │   └── validation.js
│   ├── agendamentoUtils.js
│   └── masks.js
│
└── App.jsx
```

---

## 📚 Documentação Detalhada dos Componentes

### 🔹 Componentes Utilitários Base

#### `MaskedInput.jsx`
Componente de input com máscaras automáticas para formatação de dados.

**Máscaras disponíveis:**
- `phone` - Telefone: (11) 98765-4321
- `date` - Data: DD/MM/AAAA
- `currency` - Moeda: R$ 1.234,56

**Uso:**
```jsx
<MaskedInput
  mask="phone"
  name="telefone"
  value={formData.telefone}
  onChange={handleChange}
/>
```

#### `Modal.jsx`
Modal reutilizável com header customizável e controles de tamanho.

**Tamanhos disponíveis:**
- `sm` - 400px
- `md` - 672px (padrão)
- `lg` - 896px
- `xl` - 1152px

**Props:**
- `isOpen` - Controla visibilidade
- `onClose` - Função para fechar
- `title` - Título do modal
- `size` - Tamanho do modal
- `children` - Conteúdo

**Uso:**
```jsx
<Modal
  isOpen={showModal}
  onClose={handleClose}
  title="Novo Registro"
  size="lg"
>
  {/* Conteúdo do modal */}
</Modal>
```

#### `PlanRestriction.jsx`
Tela de bloqueio exibida quando usuário tenta acessar recurso bloqueado por plano.

**Features:**
- Informações sobre o recurso bloqueado
- Benefícios do plano necessário
- Botão de upgrade
- Design responsivo e atrativo

**Recursos bloqueáveis:**
- `financeiro` - Controle financeiro completo
- `relatorios` - Relatórios avançados
- `notificacoes` - Sistema de notificações
- `agendamentoOnline` - Agenda online pública

---

### 🗓️ Componentes de Agendamento

#### `AgendamentoCalendario.jsx`
Visualização mensal em calendário com agendamentos.

**Funcionalidades:**
- Exibe agendamentos do mês
- Cores por status (confirmado, pendente, cancelado, concluído)
- Limite de 3 agendamentos visíveis por dia
- Click em agendamento abre detalhes
- Destaque visual para o dia atual

**Props:**
- `currentDate` - Data atual do calendário
- `agendamentos` - Lista de agendamentos
- `clientes` - Lista de clientes
- `servicos` - Lista de serviços
- `onAgendamentoClick` - Callback ao clicar em agendamento

#### `AgendamentoDia.jsx`
Grade horária detalhada por profissional para visualização diária.

**Funcionalidades:**
- Grade de 30 em 30 minutos (8h às 20h30)
- Colunas por profissional
- Visualização de bloqueios de horário
- Ações rápidas (editar, excluir)
- Destaque de horários ocupados
- Click em horário vazio para criar agendamento

**Destaques visuais:**
- Agendamentos normais com cores por status
- Bloqueios em cinza com ícone de cadeado
- Dia atual com fundo roxo claro

#### `AgendamentoSemana.jsx`
Visualização semanal compacta dos agendamentos.

**Funcionalidades:**
- 7 colunas (domingo a sábado)
- Até 5 agendamentos visíveis por dia
- Indicador de "+X agendamentos"
- Estatísticas por dia
- Destaque do dia atual

#### `AgendamentoFormulario.jsx`
Formulário completo para criar/editar agendamentos.

**Validações:**
- Horários disponíveis considerando duração do serviço
- Bloqueio de horários já ocupados
- Filtro de profissionais habilitados por serviço
- Alerta de conflitos de horário

**Features especiais:**
- Checkbox para enviar notificação por email
- Validação de duração do serviço
- Informações contextuais do serviço selecionado

#### `AgendamentoFiltros.jsx`
Barra de filtros para agendamentos.

**Filtros disponíveis:**
- Busca por cliente ou serviço
- Data específica
- Status do agendamento
- Botão "Limpar Filtros"

#### `AgendamentoHeader.jsx`
Cabeçalho da página de agendamentos com controles.

**Elementos:**
- Título e subtítulo
- Botão "Novo Agendamento"
- Botão "Bloquear Horário"
- Toggle de visualizações (Lista, Dia, Semana, Mês)
- Navegação de data com setas
- Botão "Hoje"

#### `AgendamentoLista.jsx`
Tabela completa de agendamentos com todas as informações.

**Colunas:**
- Cliente (nome, telefone)
- Serviço (nome, duração)
- Profissional
- Data e horário
- Valor
- Status
- Ações (editar, excluir)

#### `BloqueioHorarioForm.jsx`
Formulário para bloquear horários indisponíveis.

**Funcionalidades:**
- Bloqueio único ou recorrente
- Seleção de dias da semana
- Horário de início e fim
- Validação de período
- Motivo do bloqueio
- Visualização do período bloqueado

**Uso prático:**
- Horário de almoço
- Reuniões
- Folgas
- Manutenção

---

### 🌐 Componentes de Agenda Online

#### `AgendaStepDados.jsx`
Primeiro passo: coleta de dados pessoais do cliente.

**Campos:**
- Nome completo
- Telefone (com máscara)
- Email
- Validações em tempo real

#### `AgendaStepServico.jsx`
Segundo passo: seleção do serviço desejado.

**Informações exibidas:**
- Nome do serviço
- Descrição
- Duração
- Valor
- Categoria
- Card visual para cada serviço

#### `AgendaStepDataHora.jsx`
Terceiro passo: escolha de profissional, data e horário.

**Features especiais:**
- ⚡ **Atualização em tempo real** dos horários disponíveis
- Filtro automático de profissionais habilitados
- Horários ocupados riscados
- Consideração da duração do serviço
- Alerta visual se horário ficar ocupado
- Indicador de última atualização

**Validações:**
- Tempo suficiente para o serviço
- Conflitos com outros agendamentos
- Disponibilidade do profissional

#### `AgendaStepIndicator.jsx`
Barra de progresso visual dos passos.

**Passos:**
1. Seus Dados
2. Serviço
3. Data e Hora

#### `AgendaHeader.jsx`
Cabeçalho da página pública com informações do salão.

**Exibe:**
- Nome do salão
- Endereço
- Telefone
- Design com gradiente roxo-rosa

#### `AgendaLoading.jsx`
Tela de carregamento da agenda online.

#### `AgendaErro.jsx`
Tela de erro com tratamento contextual.

**Tipos de erro:**
- Salão não encontrado
- Limite de agendamentos do plano atingido
- Erro genérico

**Ações disponíveis:**
- Ligar para o salão
- Chamar no WhatsApp
- Voltar

#### `AgendaSucesso.jsx`
Confirmação visual de agendamento bem-sucedido.

**Exibe:**
- Resumo completo do agendamento
- Dados do cliente
- Serviço e profissional
- Data e horário
- Local
- Botão para novo agendamento

#### `RealtimeIndicator.jsx`
Indicador de sincronização em tempo real.

**Estados:**
- Atualizando... (azul, spinner)
- Sincronizado (verde, check)
- Timestamp da última atualização

---

### 🔐 Componentes de Autenticação

#### `LoginModal.jsx`
Modal de login com validação completa.

**Funcionalidades:**
- Validação de email e senha
- Toggle de visibilidade da senha
- Link "Esqueci minha senha"
- Botão para trocar para cadastro
- Mensagens de erro contextuais
- Pode ser fechado com ESC ou clicando fora

#### `RegisterModal.jsx`
Modal de cadastro de novo usuário.

**Campos:**
- Nome completo
- Email
- Telefone (com máscara)
- Nome do salão
- Senha (mínimo 6 caracteres)
- Confirmação de senha

**Validações:**
- Email válido
- Telefone completo
- Senhas coincidentes
- Força da senha

---

### 👥 Componentes de Clientes

#### `ClienteDetalhes.jsx`
Modal completo com histórico do cliente.

**Abas disponíveis:**
1. **Informações** - Dados pessoais e estatísticas
2. **Agendamentos** - Histórico completo de atendimentos
3. **Compras** - Produtos adquiridos no PDV
4. **Emails** - ⚡ **NOVO:** Histórico de emails enviados

**Estatísticas exibidas:**
- Total de agendamentos
- Agendamentos concluídos e cancelados
- Total gasto
- Ticket médio

**Histórico de Emails:**
- Tipo de email (confirmação, cancelamento, avaliação)
- Status de envio
- Data e hora
- Assunto
- Link para agendamento relacionado

#### `AvaliacaoModal.jsx`
Modal de visualização de avaliação de atendimento.

**Informações:**
- Nota (1-5 estrelas)
- Recomendaria? (Sim/Não)
- Comentário do cliente
- Detalhes do atendimento
- Data, horário, serviço, profissional

---

### ⚙️ Componentes de Configurações

#### `ConfiguracoesHeader.jsx`
Cabeçalho simples da página de configurações.

#### `ConfiguracoesTabs.jsx`
Navegação por abas das configurações.

**Abas:**
- Informações Gerais
- Categorias e Serviços
- Profissionais
- Comunicações

#### `ConfiguracoesGeral.jsx`
Formulário de informações básicas do salão.

**Campos:**
- Upload de logo
- Nome do salão
- Endereço completo
- Telefone
- Email
- Botão para excluir salão (se tiver múltiplos)

#### `ConfiguracoesCategorias.jsx`
Gerenciamento de categorias e serviços oferecidos.

**Funcionalidades:**
- Estrutura hierárquica (Categoria → Subcategoria → Serviços)
- Expandir/colapsar categorias
- Marcar/desmarcar serviços individuais
- Botões para desmarcar categoria ou subcategoria inteira
- Modal informativo com descrição de cada serviço
- Badge de contagem de serviços ativos

**Estrutura:**
```
📁 Categoria (ex: Cabelos)
  └── 📁 Subcategoria (ex: Cortes Femininos)
      └── ☑️ Serviço (ex: Corte Longo)
```

#### `ConfiguracoesProfissionais.jsx`
Lista e gerenciamento de profissionais do salão.

**Funcionalidades:**
- Listagem em cards
- Botão para adicionar (respeitando limite do plano)
- Alerta visual quando limite atingido
- Ações: Editar, Excluir
- Informações: Nome, especialidades, contato

**Validação de Plano:**
- Inicial: 1 profissional
- Essencial: 2 profissionais
- Plus: 3 profissionais
- Profissional: 5 profissionais
- Premium: 10 profissionais
- Master: Ilimitados

#### `ConfiguracoesComunicacoes.jsx`
Configuração de notificações e links compartilháveis.

**Seção 1: Links Compartilháveis**
- Link da agenda online
- Link base de avaliação
- Botões para copiar e abrir

**Seção 2: Configurações de Email**
- Toggle para ativar/desativar cada tipo
- Botão para personalizar templates
- Tipos disponíveis:
  - ✅ Confirmação de agendamento
  - ❌ Cancelamento
  - 🔄 Alteração
  - ⭐ Solicitação de avaliação
  - 🎂 Aniversário (com opções de antecedência)

**Editor de Templates:**
- Assunto personalizável
- Corpo da mensagem
- Variáveis disponíveis: `{cliente_nome}`, `{data}`, `{horario}`, `{servico}`, etc.
- Restaurar template padrão

#### `ProfissionalModal.jsx`
Formulário de cadastro/edição de profissional.

**Campos:**
- Nome completo
- Telefone
- Email
- Serviços que atende (baseado nos serviços configurados)

**Validações:**
- Pelo menos um serviço deve ser selecionado
- Todos os campos obrigatórios preenchidos

#### `ServicoInfoModal.jsx`
Modal informativo com descrição detalhada do serviço.

**Exibe:**
- Nome do serviço
- Descrição completa
- Design simples e objetivo

---

---

## ⚙️ Configuração e Contextos

### 📧 Configuração do Mailgun (`mailgunConfig.js`)

Sistema de configuração para integração com Mailgun (serviço de envio de emails).

**Variáveis de Ambiente necessárias:**
```env
VITE_MAILGUN_API_KEY=sua_api_key_aqui
VITE_MAILGUN_DOMAIN=sandbox123.mailgun.org
VITE_MAILGUN_BASE_URL=https://api.mailgun.net
VITE_MAILGUN_FROM_EMAIL=noreply@seudominio.com
VITE_MAILGUN_FROM_NAME=Seu Salão
```

**Funções disponíveis:**
- `validateMailgunConfig()` - Valida se todas as configurações estão corretas
- `getMailgunHeaders()` - Retorna headers necessários para requisições
- `getMailgunAPIUrl()` - Retorna URL completa da API

**Como configurar:**
1. Criar conta em [mailgun.com](https://www.mailgun.com/)
2. Verificar domínio ou usar sandbox para testes
3. Obter API Key em Settings > API Keys
4. Criar arquivo `.env` na raiz do projeto
5. Adicionar variáveis de ambiente

---

### 🔐 Contextos React

#### `AuthContext.jsx`
Gerenciamento de autenticação e sessão do usuário.

**Estado gerenciado:**
- `currentUser` - Dados do usuário logado
- `loading` - Estado de carregamento inicial

**Funções disponíveis:**

**`register(userData)`**
Registra novo usuário e cria salão inicial.
```javascript
const { register } = useContext(AuthContext);

const resultado = await register({
  nome: 'João Silva',
  email: 'joao@email.com',
  password: 'senha123',
  telefone: '(11) 98765-4321',
  nomeSalao: 'Salão Beauty'
});

if (resultado.success) {
  // Usuário criado e logado automaticamente
}
```

**`login(email, password)`**
Autentica usuário existente.
```javascript
const { login } = useContext(AuthContext);

const resultado = await login('joao@email.com', 'senha123');

if (resultado.success) {
  // Usuário autenticado
}
```

**`logout()`**
Desloga usuário e limpa sessão.

**Características:**
- Persistência no localStorage
- Criação automática do primeiro salão no cadastro
- Validação de email duplicado
- Senha não é armazenada no currentUser

---

#### `SalaoContext.jsx`
Contexto principal da aplicação - gerencia todos os dados do sistema.

**Estados gerenciados:**
- `saloes` - Todos os salões do usuário
- `salaoAtual` - Salão selecionado atualmente
- `clientes` - Todos os clientes
- `profissionais` - Todos os profissionais
- `servicos` - Todos os serviços
- `fornecedores` - Todos os fornecedores
- `produtos` - Todos os produtos
- `agendamentos` - Todos os agendamentos
- `transacoes` - Todas as transações financeiras

**Funções de Salão:**

**`adicionarSalao(dadosSalao)`**
```javascript
const { adicionarSalao } = useContext(SalaoContext);

const novoSalao = adicionarSalao({
  nome: 'Salão Filial',
  endereco: 'Rua X, 123',
  telefone: '(11) 98765-4321',
  email: 'contato@salao.com'
});
```

**`atualizarSalao(salaoId, dadosAtualizados)`**
```javascript
atualizarSalao(salaoAtual.id, {
  nome: 'Novo Nome',
  logo: 'data:image...'
});
```

**`deletarSalao(salaoId)`**
Remove salão e todos os dados relacionados.

**Funções de Filtragem:**

Todas retornam dados filtrados pelo `salaoAtual`:

```javascript
const { 
  getClientesPorSalao,
  getProfissionaisPorSalao,
  getServicosPorSalao,
  getFornecedoresPorSalao,
  getProdutosPorSalao,
  getAgendamentosPorSalao,
  getTransacoesPorSalao 
} = useContext(SalaoContext);

const clientesSalao = getClientesPorSalao();
```

**`getServicosDisponiveis()`**
Retorna lista "flat" de todos os serviços configurados no salão:
```javascript
const servicosDisponiveis = getServicosDisponiveis();
// Retorna: [
//   { categoriaId: 'capilares', subcategoriaId: 'cortes', nome: 'Corte Masculino' },
//   { categoriaId: 'capilares', subcategoriaId: 'cortes', nome: 'Corte Feminino' },
//   ...
// ]
```

**Características especiais:**
- ✅ Persistência automática no localStorage
- ✅ Debounce de 300ms para salvar (performance)
- ✅ Herança de plano ao criar novo salão
- ✅ Atualização automática do salaoAtual quando modificado
- ✅ Loading screen durante inicialização
- ✅ Filtros otimizados com `useMemo`

---

## 📊 Dados Estáticos

### `categoriasServicosData.js`
Estrutura hierárquica completa de categorias e serviços de salão.

**Estrutura:**
```javascript
CATEGORIAS_SERVICOS = [
  {
    id: 'capilares',
    nome: 'Serviços Capilares',
    subcategorias: [
      {
        id: 'cortes',
        nome: 'Cortes',
        servicos: ['Corte Masculino', 'Corte Feminino', 'Corte Infantil']
      },
      // ...
    ]
  },
  // ...
]
```

**Categorias disponíveis:**
1. **Serviços Capilares**
   - Cortes
   - Colorimetria
   - Tratamentos Capilares
   - Penteados e Tranças
   - Alongamento (50+ tipos)

2. **Serviços para Unhas**
   - Manicure e Pedicure (20+ serviços)

3. **Cuidados com a Pele e Estética Facial**
   - Limpeza de Pele
   - Tratamentos Faciais
   - Estética Avançada
   - Design de Sobrancelhas
   - Cílios

4. **Maquiagem**
   - Maquiagem Social
   - Maquiagem para Noivas
   - Maquiagem Especial

5. **Depilação e Serviços Corporais**
   - Depilação
   - Massagens
   - Estética Corporal

6. **Serviços de Bem-Estar Complementar**
   - Terapias

**Total:** 150+ serviços catalogados

---

### `planosData.js`
Definição dos planos de assinatura do sistema.

**Planos Disponíveis:**

#### 1️⃣ Plano Inicial (Gratuito)
```javascript
{
  id: 'inicial',
  preco: 'Gratuito',
  recursos: [
    '1 salão',
    '1 profissional',
    'Até 10 clientes',
    '2 categorias, 2 serviços por categoria',
    '1 fornecedor, 3 produtos',
    'Agendamento básico (sistema)',
    'Notificações de confirmação',
    'Sem agenda online',
    'Sem financeiro',
    'Sem relatórios'
  ]
}
```

#### 2️⃣ Plano Essencial (R$ 29,90/mês)
```javascript
{
  id: 'essencial',
  preco: 'R$ 29,90',
  recursos: [
    '1 salão',
    'Até 2 profissionais',
    'Até 30 clientes',
    '3 categorias, 3 serviços por categoria',
    '2 fornecedores, 5 produtos',
    'Agenda online (link compartilhável)',
    'Notificações: confirmação + cancelamento',
    'Relatórios de agendamentos',
    'Sem financeiro'
  ]
}
```

#### 3️⃣ Plano Profissional (R$ 79,90/mês) ⭐ RECOMENDADO
```javascript
{
  id: 'profissional',
  preco: 'R$ 79,90',
  destaque: true,
  recursos: [
    'Até 2 salões',
    'Até 10 profissionais por salão',
    'Até 300 clientes por salão',
    'Categorias e serviços ilimitados',
    '10 fornecedores, 30 produtos',
    'Financeiro completo',
    'Link de agendamento personalizado',
    'Notificações: confirmação + alteração + cancelamento',
    'Relatórios detalhados',
    'Análise de comissões'
  ]
}
```

**Planos Futuros:**
- Plus (R$ 49,50)
- Premium (R$ 99,90)
- Master (R$ 149,90)

Status: `disponivel: false` - Exibidos como "Em Breve"

---

### `servicosDescricoesData.js`
Descrições detalhadas de todos os 150+ serviços disponíveis.

**Formato:**
```javascript
export const SERVICOS_DESCRICOES = {
  'Corte Masculino': 'Corte de cabelo masculino com técnicas personalizadas...',
  'Hidratação': 'Tratamento profundo para repor a água dos fios...',
  // ...
}
```

**Uso:**
```javascript
import { SERVICOS_DESCRICOES } from '../data/servicosDescricoesData';

const descricao = SERVICOS_DESCRICOES['Corte Feminino'];
// Retorna: "Corte de cabelo feminino adaptado ao formato do rosto..."
```

**Categorias cobertas:**
- Todos os serviços capilares (cortes, coloração, tratamentos, alongamento)
- Serviços de unhas e podologia
- Tratamentos faciais e estética avançada
- Sobrancelhas e cílios
- Maquiagem (social, noivas, artística)
- Depilação e massagens
- Estética corporal
- Terapias complementares

Cada descrição é profissional e objetiva, adequada para exibição ao cliente.

---

---

## 🎣 Hooks Customizados

### 📅 `AgendamentoHooks.jsx`
Collection de hooks para gerenciar agendamentos via Firebase (se integrado).

**Hooks disponíveis:**

**`useAgendamentos(dataAtual)`**
Busca agendamentos do mês atual com sincronização em tempo real.
```javascript
const { agendamentos, loading, error } = useAgendamentos(new Date());
```

**`useClientes()`**
Lista todos os clientes do usuário.
```javascript
const { clientes, loading } = useClientes();
```

**`useServicos()`**
Lista todos os serviços cadastrados.

**`usePlanoUsuario()`**
Verifica o plano atual do usuário.
```javascript
const { plano, isEssencial } = usePlanoUsuario();
```

**`useAgendamentoOperacoes()`**
Operações CRUD para agendamentos.
```javascript
const { 
  criarAgendamento, 
  atualizarAgendamento, 
  deletarAgendamento 
} = useAgendamentoOperacoes();
```

**`useAgendaOnline()`**
Gerencia configurações da agenda online pública.

---

### 📧 `useEmailHistorico.js`
Hook para gerenciar histórico de emails enviados aos clientes.

**Funcionalidades:**

**`registrarEmail(emailData)`**
Registra um email no histórico do salão.
```javascript
const { registrarEmail } = useEmailHistorico();

registrarEmail({
  clienteId: 123,
  clienteNome: 'João Silva',
  clienteEmail: 'joao@email.com',
  tipo: 'confirmacao', // confirmacao, cancelamento, alteracao, avaliacao, aniversario
  assunto: 'Agendamento Confirmado',
  agendamentoId: 456, // opcional
  status: 'enviado', // enviado, falhado
  erro: null // string caso tenha falhado
});
```

**`buscarEmailsCliente(clienteId)`**
Retorna histórico de emails de um cliente específico.

**`buscarTodosEmails()`**
Retorna histórico completo de emails do salão (últimos 1000).

**`limparHistorico()`**
Remove todo o histórico (use com cuidado!).

**Estrutura do registro:**
```javascript
{
  id: "1234567890",
  clienteId: 123,
  clienteNome: "João Silva",
  clienteEmail: "joao@email.com",
  tipo: "confirmacao",
  assunto: "Agendamento Confirmado",
  agendamentoId: 456,
  status: "enviado",
  erro: null,
  dataEnvio: "2025-11-17T10:30:00.000Z",
  salaoId: 1
}
```

---

### 💰 `useFinanceiroData.js`
Hook para processar dados financeiros com filtros e cálculos.

**Retorna:**
```javascript
const {
  transacoesFiltradas,    // Transações do período
  totalReceitas,          // Soma das receitas
  totalDespesas,          // Soma das despesas
  saldo,                  // Receitas - Despesas
  ticketMedio,            // Receita média por venda
  fluxoCaixaData,        // Dados para gráfico (6 meses)
  categoriasDespesas     // Despesas por categoria (%)
} = useFinanceiroData(transacoesSalao, periodo);
```

**Períodos suportados:**
- `dia` - Apenas transações de hoje
- `semana` - Última semana
- `mes` - Mês atual
- `ano` - Ano atual
- `todas` - Sem filtro

**Exemplo de uso:**
```javascript
const [periodo, setPeriodo] = useState('mes');
const data = useFinanceiroData(transacoes, periodo);

console.log(`Saldo do mês: R$ ${data.saldo.toFixed(2)}`);
```

---

### 🔍 `useFinanceiroFilters.js`
Hook para filtros avançados de transações financeiras.

**Retorna:**
```javascript
const {
  tipoTransacao,        // 'todas', 'receita', 'despesa'
  setTipoTransacao,
  showFilters,          // Controle de visibilidade
  setShowFilters,
  filtros,              // Objeto com todos os filtros
  setFiltros,
  filteredTransacoes,   // Transações filtradas
  limparFiltros         // Reseta todos os filtros
} = useFinanceiroFilters(transacoesFiltradas);
```

**Filtros disponíveis:**
```javascript
{
  dataInicio: 'DD/MM/AAAA',
  dataFim: 'DD/MM/AAAA',
  categoria: 'Salários',
  status: 'pago',
  formaPagamento: 'Pix',
  busca: 'termo de busca'
}
```

---

### 🛒 `usePDV.js`
Hook completo para o Ponto de Venda (PDV).

**Funcionalidades:**
```javascript
const {
  carrinho,                    // Array de itens
  clienteSelecionado,          // Nome do cliente
  setClienteSelecionado,
  showPagamentoModal,
  setShowPagamentoModal,
  desconto,                    // Porcentagem 0-100
  setDesconto,
  adicionarAoCarrinho,         // (produto)
  removerDoCarrinho,           // (produtoId)
  alterarQuantidade,           // (produtoId, novaQuantidade)
  subtotal,                    // Soma sem desconto
  valorDesconto,               // Valor do desconto em R$
  total,                       // Subtotal - desconto
  lucroTotal,                  // Lucro estimado
  finalizarVenda,              // (formaPagamento)
  limparCarrinho               // Esvazia carrinho
} = usePDV(salaoAtual, produtos, setProdutos, transacoes, setTransacoes, clientesSalao);
```

**Fluxo de uso:**
1. Adicionar produtos ao carrinho
2. Selecionar cliente (opcional)
3. Aplicar desconto (opcional)
4. Finalizar venda com forma de pagamento
5. Sistema registra venda no financeiro e atualiza estoque

**Validações automáticas:**
- Verificação de estoque disponível
- Cálculo automático de lucro
- Registro de transação financeira
- Atualização de estoque

---

### 🔄 `useRealtimeAgendamentos.js`
Hook para sincronização em tempo real de agendamentos.

**Uso principal:**
```javascript
const { 
  agendamentos,      // Lista atualizada
  isUpdating,        // Boolean: está sincronizando?
  lastUpdate,        // Date: última atualização
  forceRefresh       // Function: forçar refresh
} = useRealtimeAgendamentos(salaoId, 2000); // 2000ms de intervalo
```

**Características:**
- ⚡ Atualização automática a cada X ms
- 🔔 Detecta mudanças de outras abas (storage event)
- 🎯 Filtra automaticamente por salão
- 📊 Mostra status de sincronização
- 🔄 Permite refresh manual

**Hook genérico para qualquer chave:**
```javascript
const { data, isUpdating, lastUpdate, forceRefresh } = useRealtimeStorage(
  'produtos',           // chave do localStorage
  [],                   // valor padrão
  (items) => items.filter(i => i.ativo),  // filtro opcional
  3000                  // intervalo em ms
);
```

---

### 📝 `useTransacaoForm.js`
Hook para formulário de transações financeiras.

**Retorna:**
```javascript
const {
  showModal,
  editingId,
  formData,
  setFormData,
  handleOpenModal,      // (transacao?)
  handleCloseModal,
  handleSubmit,         // (event)
  handleDelete,         // (id)
  handleChange          // (event)
} = useTransacaoForm(salaoAtual, transacoes, setTransacoes);
```

**Estrutura do formData:**
```javascript
{
  tipo: 'receita' | 'despesa',
  descricao: string,
  categoria: string,
  valor: string,
  formaPagamento: string,
  data: 'DD/MM/AAAA',
  cliente: string,
  fornecedor: string,
  status: 'pago' | 'pendente' | 'recebido',
  salaoId: number,
  observacoes: string
}
```

**Uso típico:**
```javascript
// Abrir para nova receita
setFormData({ tipo: 'receita', ... });
handleOpenModal();

// Abrir para editar
handleOpenModal(transacaoExistente);
```

---

## 📄 Páginas Principais

### 🏠 `Landing.jsx`
Página inicial pública com apresentação do sistema.

**Seções:**
1. **Hero** - Call-to-action principal
2. **Features** - 6 recursos principais
3. **Pricing** - Tabela de planos
4. **CTA** - Chamada final
5. **Footer** - Links e informações

**Modais integrados:**
- RegisterModal - Cadastro de novo usuário
- LoginModal - Login de usuário existente

**Navegação:**
- `/` - Landing page
- `/about` - Sobre o projeto
- `/contact` - Formulário de contato
- `/demo` - Demonstração interativa
- `/help` - Central de ajuda
- `/documentation` - Documentação completa

---

### 📊 `Dashboard.jsx`
Visão geral executiva do salão com métricas principais.

**Cards de Estatísticas:**
1. Agendamentos Hoje
2. Clientes Ativos
3. Faturamento Hoje
4. Faturamento Mês

**Gráficos:**
1. **Faturamento Semanal** - LineChart dos últimos 7 dias
2. **Serviços por Categoria** - BarChart com distribuição

**Lista:**
- **Próximos Agendamentos** - 4 próximos agendamentos do dia

**Resumo do Salão:**
- Total de profissionais
- Serviços cadastrados
- Clientes cadastrados

**Nota:** Todos os dados são baseados em informações reais do localStorage, não são simulados.

---

### 📅 `Agendamentos.jsx`
Página completa de gerenciamento de agendamentos.

**Modos de Visualização:**
1. **Lista** - Tabela com todos os agendamentos
2. **Dia** - Grade horária por profissional
3. **Semana** - Visão semanal compacta
4. **Calendário** - Visão mensal

**Funcionalidades principais:**
- ✅ Criar agendamento com validação de conflitos
- ✏️ Editar agendamento (envia email de alteração)
- 🗑️ Excluir agendamento (envia email de cancelamento)
- 🔒 Bloquear horários (almoço, reuniões, folgas)
- 📧 Sistema de notificações automáticas
- 🔄 Sincronização em tempo real

**Sistema de Emails Automáticos:**
- **Confirmação** - Ao criar novo agendamento
- **Alteração** - Ao mudar data/horário/profissional
- **Cancelamento** - Ao excluir agendamento
- **Avaliação** - Ao marcar como "concluído"

**Validações:**
- Conflito de horários
- Duração do serviço
- Profissional habilitado
- Bloqueios de horário

---

### 📝 `AgendaOnline.jsx`
Página pública para agendamentos online por clientes.

**Fluxo de Agendamento:**
1. **Passo 1: Dados Pessoais** - Nome, telefone, email
2. **Passo 2: Escolha do Serviço** - Cards com serviços disponíveis
3. **Passo 3: Data e Horário** - Seleção com validação em tempo real

**Features especiais:**
- ⚡ **Sincronização em tempo real** dos horários
- 🔄 Atualização automática a cada 2 segundos
- ⚠️ Alerta se horário ficar ocupado
- ✅ Validação de conflitos antes de confirmar
- 📧 Email de confirmação automático
- 📝 Registro no histórico de emails

**Verificação de Plano:**
- Agenda online disponível a partir do Plano Essencial
- Tela de bloqueio amigável se plano não permite
- Opções de contato alternativas exibidas

**Página de Sucesso:**
- Resumo completo do agendamento
- Informações de contato do salão
- Botão para novo agendamento

---

### ⭐ `Avaliacao.jsx`
Página de avaliação pós-atendimento (acesso via email).

**URL:** `/avaliacao/:salaoId/:token`

**Formulário de Avaliação:**
1. **Nota** - 1 a 5 estrelas (obrigatório)
2. **Recomendaria?** - Sim/Não (obrigatório)
3. **Comentário** - Texto livre (opcional)

**Validações:**
- Link único por agendamento
- Não permite avaliar 2 vezes
- Exibe informações do atendimento
- Salva no localStorage

**Fluxo:**
1. Cliente recebe email com link
2. Acessa página de avaliação
3. Preenche formulário
4. Avaliação é salva
5. Agendamento marcado como "avaliacaoRealizada"
6. Página fecha automaticamente

**Estados:**
- Loading - Carregando dados
- Erro - Salão não encontrado / Já avaliado
- Formulário - Pronto para avaliar
- Sucesso - Avaliação enviada

---

### 👥 `Clientes.jsx`
Gestão completa de clientes com histórico detalhado.

**Cards de Estatísticas:**
1. Total de Clientes
2. Clientes Ativos
3. Novos Este Mês
4. Ticket Médio

**Tabela de Clientes:**
- Nome e data de nascimento
- Telefone e email
- Última visita
- Número de visitas
- Total gasto
- Status (ativo/inativo)

**Ações disponíveis:**
- 👁️ Ver histórico completo
- ✏️ Editar informações
- 🗑️ Excluir cliente

**Modal de Detalhes (ClienteDetalhes):**

**Aba 1: Informações**
- Dados pessoais completos
- Estatísticas (agendamentos, total gasto, ticket médio)

**Aba 2: Agendamentos**
- Histórico completo de atendimentos
- Data, serviço, profissional, valor
- Status de cada agendamento

**Aba 3: Compras**
- Produtos adquiridos no PDV
- Data, itens, valores

**Aba 4: Emails** ✨ NOVO
- Histórico completo de emails enviados
- Tipo (confirmação, alteração, cancelamento, avaliação, aniversário)
- Status (enviado/falhado)
- Data e horário
- Link para agendamento relacionado

**Validação de Plano:**
- Limite de clientes por plano
- Alerta visual quando limite atingido
- Botão bloqueado se exceder

---

### ⚙️ `Configuracoes.jsx`
Configurações gerais do salão.

**Abas disponíveis:**

**1. Informações Gerais**
- Upload de logo
- Nome do salão
- Endereço completo
- Telefone e email
- Botão de excluir salão

**2. Categorias e Serviços**
- Estrutura hierárquica (Categoria → Subcategoria → Serviços)
- Expandir/colapsar níveis
- Marcar/desmarcar serviços
- Modal informativo com descrições
- 150+ serviços disponíveis

**3. Profissionais**
- Lista de profissionais cadastrados
- Adicionar novo (respeitando limite do plano)
- Editar especialidades
- Excluir profissional
- Validação: pelo menos 1 serviço selecionado

**4. Comunicações** ✨ DESTAQUE
- **Links Compartilháveis:**
  - Link da agenda online
  - Link base de avaliação
  - Botões para copiar/abrir

- **Sistema de Notificações:**
  - ✅ Toggle on/off para cada tipo
  - 📧 Editor de templates personalizados
  - 🔄 Restaurar template padrão
  
  **Tipos de Notificação:**
  1. **Confirmação** - Novo agendamento
  2. **Alteração** - Mudança de data/horário
  3. **Cancelamento** - Agendamento cancelado
  4. **Avaliação** - Solicita feedback pós-atendimento
  5. **Aniversário** - Parabéns automático
     - Configurar dias de antecedência (0-7)
     - Envio automático ou manual

- **Editor de Templates:**
  - Assunto personalizável
  - Corpo da mensagem
  - Variáveis disponíveis: `{cliente_nome}`, `{data}`, `{horario}`, `{servico}`, `{profissional}`, etc.
  - Preview em tempo real

**Importante:** As configurações de comunicação são salvas por salão no objeto `salao.comunicacoes`.

---

### 🏢 `Perfil.jsx`
Gerenciamento de perfil do usuário.

**Abas:**

**1. Dados Pessoais**
- Nome completo
- Email (não editável)
- Telefone
- Visualização read-only

**2. Planos**
- Plano atual de cada salão
- Cards com informações dos planos
- Botões de upgrade/downgrade
- Comparação de recursos

**3. Segurança**
- Alterar senha
- Histórico de acessos (futuro)
- Configurações de privacidade

---

### 🛒 `Produtos.jsx`
Gestão de produtos, estoque e PDV.

**3 Seções principais:**

**1. PDV - Ponto de Venda** 🟢
- Grid de produtos disponíveis
- Adicionar ao carrinho
- Seleção de cliente (opcional)
- Aplicar desconto (%)
- Carrinho lateral com:
  - Itens, quantidades
  - Subtotal, desconto, total
  - Lucro estimado
- Modal de pagamento com formas disponíveis
- Finalização automática:
  - Atualiza estoque
  - Registra venda no financeiro
  - Vincula cliente (se selecionado)

**2. Estoque** 🟣
- Tabela com todos os produtos
- Adicionar novo produto
- Editar produto existente
- Excluir produto
- Informações exibidas:
  - Nome, marca, categoria
  - Estoque atual / mínimo
  - Valor de custo / venda
  - Fornecedor
  - Código de barras

**3. Fornecedores** 🔵
- Lista de fornecedores
- Adicionar novo
- Editar informações
- Excluir (valida se há produtos vinculados)
- Dados: Nome, CNPJ, telefone, email, endereço

**Alertas:**
- Estoque baixo (abaixo do mínimo)
- Produtos sem fornecedor
- Produtos sem código

---

### 💰 `Financeiro.jsx`
Controle financeiro completo.

**Restrição de Plano:**
- Disponível a partir do Plano Plus
- Tela de upgrade se não tiver acesso

**Seletor de Período:**
- Dia, Semana, Mês, Ano, Todos

**Cards Principais (Clicáveis):**
1. **Receitas** 🟢
   - Total de receitas do período
   - Botão + para adicionar
   - Clique para ver detalhes

2. **Despesas** 🔴
   - Total de despesas do período
   - Botão + para adicionar
   - Clique para ver detalhes

3. **Saldo** 🔵
   - Receitas - Despesas
   - Indicador de lucro/prejuízo

4. **Ticket Médio** 📊
   - Receita média por transação

**Área de Detalhes:**
Ao clicar em um card, abre lista completa:
- Filtros avançados (data, categoria, status, busca)
- Tabela com todas as transações
- Ações: editar, excluir
- Estatísticas do período

**Modal de Transação:**
- Tipo (receita/despesa)
- Descrição
- Categoria
- Valor
- Forma de pagamento
- Data
- Cliente/Fornecedor
- Status
- Observações

**Categorias predefinidas:**
- **Receitas:** Serviços, Produtos, Outros
- **Despesas:** Aluguel, Salários, Produtos, Contas, Manutenção, Marketing, Outros

---

### 📊 `Relatorios.jsx`
Análises e relatórios detalhados do negócio.

**Restrição de Plano:**
- Básico: Plano Essencial
- Completo: Plano Profissional+

**Filtros:**
- Período início/fim
- Tipo de relatório (geral, financeiro, serviços, clientes, profissionais)

**Cards de Estatísticas:**
1. Faturamento Total
2. Total de Atendimentos
3. Ticket Médio
4. Clientes Ativos
5. Taxa de Retorno
6. Novos Clientes
7. Produtos Vendidos
8. Serviços Realizados

**Gráficos:**

**1. Faturamento Mensal** (LineChart)
- Últimos 10 meses
- Tendência de crescimento

**2. Horários Populares** (BarChart)
- Distribuição de agendamentos por horário
- Identifica picos de movimento

**3. Serviços por Categoria** (BarChart)
- Quantidade e valor por categoria
- Identifica serviços mais lucrativos

**4. Distribuição de Pagamento** (PieChart)
- Porcentagem por forma de pagamento
- Ajuda no planejamento financeiro

**Tabelas:**

**1. Top 5 Clientes**
- Nome, visitas, total gasto
- Ordenado por valor

**2. Performance de Profissionais**
- Nome, atendimentos, faturamento, comissões
- Identifica melhores performers

**Botão de Exportação:**
- PDF (futuro)
- Excel (futuro)

---

### ✂️ `Servicos.jsx`
Catálogo de serviços do salão.

**Validação Inicial:**
- Verifica se categorias foram configuradas
- Alerta se não houver serviços disponíveis
- Botão para ir às Configurações

**Cards de Estatísticas:**
1. Total de Serviços
2. Valor Médio
3. Serviços Premium (>R$100)
4. Total de Categorias

**Filtros:**
- Busca por nome/descrição
- Filtro por categoria
- Mostrar apenas ativos

**Grid de Serviços:**
Cards com:
- Nome do serviço
- Categoria e subcategoria
- Duração formatada
- Valor
- Comissão (%)
- Profissionais habilitados (chips)
- Descrição
- Status ativo/inativo
- Ações: Editar, Excluir

**Modal de Serviço:**
- Seleção de serviço (da lista configurada)
- Duração (5min a 3h)
- Valor (R$)
- Comissão (%)
- Descrição (preenchida automaticamente)
- Profissionais habilitados (checkboxes)
- Status ativo/inativo

**Features especiais:**
- Filtra profissionais pela especialidade
- Validação de valores
- Descrições automáticas de 150+ serviços
- Duração personalizável

---

## 🌐 Páginas Landing

### 📖 `About.jsx`
História e valores do SalãoPro.

**Seções:**
1. Hero com título
2. Como tudo começou (história real)
3. Nossos valores (3 cards):
   - Paixão por Beleza ❤️
   - Inovação Prática 💡
   - Foco no Cliente 👥
4. Nossa Missão
5. CTA final

---

### 📞 `Contact.jsx`
Formulário de contato.

**Campos:**
- Nome completo
- Email
- Telefone
- Assunto (dropdown)
- Mensagem

**Funcionalidade:**
- Abre cliente de email padrão (mailto:)
- Feedback visual de envio
- Resetar formulário após 3s

---

### 🎬 `Demo.jsx`
Demonstração interativa dos recursos.

**Estrutura:**
- Tabs de navegação (Agenda, Clientes, Financeiro, Relatórios)
- Visualização ilustrativa de cada recurso
- Lista de benefícios
- Placeholder para vídeo demonstrativo
- CTA para começar

---

### 📚 `Documentation.jsx`
Documentação completa do sistema.

**Menu lateral com seções:**
1. Introdução
2. Agenda
3. Clientes
4. Financeiro
5. Relatórios
6. Configurações

**Cada seção contém:**
- Título e descrição
- Tópicos explicativos detalhados
- Instruções passo a passo
- Navegação anterior/próximo

---

### ❓ `Help.jsx`
Central de ajuda com FAQ.

**Recursos:**
- Busca de perguntas
- Cards de acesso rápido:
  - Documentação
  - Contato
  - Comunidade

**FAQ por categorias:**
1. Primeiros Passos
2. Agendamentos
3. Clientes
4. Financeiro
5. Planos e Pagamento

**Accordion expansível** para cada pergunta.

---

## 🔧 Serviços (Services)

### 📧 `emailService.js`
Serviço simulado de envio de emails (desenvolvimento).

**Nota:** Em produção, deve ser substituído por serviço real (SendGrid, Mailgun, AWS SES).

**Templates disponíveis:**
- confirmacao
- lembrete
- cancelamento
- novoAgendamento (para profissionais)

**Métodos:**
```javascript
await emailService.sendConfirmacaoAgendamento(data);
await emailService.sendLembreteAgendamento(data);
await emailService.sendCancelamentoAgendamento(data);
await emailService.sendNovoAgendamentoProfissional(data);
```

**Características:**
- Substituição de variáveis dinâmicas
- Fila de emails no localStorage
- Logs no console para debug
- Delay simulado de 500ms

---

### 📮 `mailgunService.js`
Integração real com Mailgun para envio de emails.

**Configuração necessária:**
```env
VITE_MAILGUN_API_KEY=...
VITE_MAILGUN_DOMAIN=...
VITE_MAILGUN_BASE_URL=...
VITE_MAILGUN_FROM_EMAIL=...
VITE_MAILGUN_FROM_NAME=...
```

**Templates HTML Completos:**
Cada tipo de email tem:
- Versão texto plano
- Versão HTML responsiva
- Design moderno com gradientes
- Variáveis substituíveis

**Tipos de Email:**

1. **Confirmação** ✅
   - Verde com check
   - Detalhes do agendamento

2. **Alteração** 🔄
   - Laranja com alerta
   - Novos dados destacados

3. **Avaliação** ⭐
   - Verde/Azul com estrelas
   - Botão grande para avaliar
   - Link direto e copiável

4. **Aniversário** 🎂
   - Rosa com presente
   - Mensagem especial
   - Botão para agendar

5. **Cancelamento** ❌
   - Vermelho
   - Opções de reagendamento

6. **Lembrete** ⏰
   - Amarelo
   - Destaque para "amanhã"

**Métodos principais:**
```javascript
await mailgunService.sendConfirmacaoAgendamento(data);
await mailgunService.sendAlteracaoAgendamento(data);
await mailgunService.sendAvaliacaoAgendamento(data);
await mailgunService.sendAniversario(data);
await mailgunService.sendCancelamentoAgendamento(data);
await mailgunService.testEmail(toEmail);
```

**Features especiais:**
- Suporte a templates customizados
- Fallback para modo simulado
- Fila de histórico
- Tratamento de erros
- Variáveis automáticas

---

### 🔔 `notificationService.js`
Serviço completo de notificações automáticas.

**Características:**
- ✅ **Registra histórico** de todos os emails
- 🔄 Verificação periódica de avaliações pendentes
- 🎂 Sistema de aniversários automático
- ⚙️ Configurações por salão

**Métodos principais:**

**`start()`**
Inicia o serviço com verificações periódicas.

**`stop()`**
Para o serviço.

**`getSalaoSettings(salaoId)`**
Retorna configurações de comunicação do salão:
```javascript
{
  confirmacao: { ativo: true, template: {...} },
  cancelamento: { ativo: true, template: {...} },
  alteracao: { ativo: true, template: {...} },
  avaliacao: { ativo: true, template: {...} },
  aniversario: { 
    ativo: false, 
    automatico: true, 
    diasAntecedencia: 0, 
    template: {...} 
  }
}
```

**`notifyNovoAgendamento(agendamentoId)`**
Envia email de confirmação ao criar agendamento.
- Verifica se notificações de confirmação estão ativas
- Usa template personalizado se configurado
- Registra no histórico

**`notifyAlteracaoAgendamento(agendamentoId, dadosAntigos, motivoAlteracao)`**
Envia email quando agendamento é alterado.
- Compara dados antigos vs novos
- Inclui motivo da alteração
- Registra no histórico

**`solicitarAvaliacao(agendamentoId)`**
Solicita avaliação após atendimento concluído.
- Gera token único
- Cria link de avaliação
- Marca como "avaliacaoSolicitada"
- Registra no histórico
- Retorna true/false (sucesso/falha)

**`notifyCancelamento(agendamentoId)`**
Notifica cancelamento de agendamento.
- Envia email ao cliente
- Inclui link para reagendar
- Registra no histórico

**`checkAvaliacoesPendentes()`**
Verifica agendamentos concluídos hoje sem avaliação.
- Roda periodicamente (a cada hora)
- Envia solicitações em lote
- Atualiza status dos agendamentos

**`checkAniversarios()`**
Verifica aniversariantes do dia.
- Considera dias de antecedência configurados
- Envia parabéns automáticos
- Respeita configuração de cada salão

**`registrarHistorico(emailData)`**
✨ Registra email no histórico do salão.
- Salva no localStorage por salão
- Limite de 1000 emails
- Informações: cliente, tipo, status, data, erro

**Exemplo de uso completo:**
```javascript
// Iniciar serviço
notificationService.start();

// Novo agendamento
await notificationService.notifyNovoAgendamento(123);

// Marcar como concluído (envia avaliação)
await notificationService.solicitarAvaliacao(123);

// Alterar agendamento
await notificationService.notifyAlteracaoAgendamento(
  123, 
  { data: '15/11/2025', horario: '10:00' },
  'Conflito de horário'
);

// Cancelar
await notificationService.notifyCancelamento(123);

// Parar serviço
notificationService.stop();
```

---

## 🛠️ Utilitários (Utils)

### 📅 `agendamentoUtils.js`
Funções utilitárias para gerenciamento de agendamentos.

**Funções de Formatação:**

**`formatarData(data, formato)`**
```javascript
formatarData(new Date(), 'dd/MM/yyyy'); // "17/11/2025"
```

**`formatarHora(data)`**
```javascript
formatarHora(new Date()); // "14:30"
```

**`formatarDuracao(minutos)`**
```javascript
formatarDuracao(90);  // "1h 30min"
formatarDuracao(60);  // "1h"
formatarDuracao(45);  // "45min"
```

**Geração de Horários:**

**`gerarHorariosDisponiveis(inicio, fim, intervalo)`**
```javascript
const horarios = gerarHorariosDisponiveis('08:00', '18:00', 30);
// ["08:00", "08:30", "09:00", ..., "17:30", "18:00"]
```

**Validação de Conflitos:**

**`verificarConflitoHorario(novoHorario, novaDuracao, agendamentos, servicos, profissionalId, data, agendamentoIdIgnorar)`**

✅ **ATUALIZADO:** Agora detecta conflitos com:
- Agendamentos normais
- Bloqueios de horário

```javascript
const resultado = verificarConflitoHorario(
  '14:00',           // horário desejado
  60,                // duração em minutos
  agendamentos,      // todos os agendamentos
  servicos,          // lista de serviços
  1,                 // ID do profissional
  '17/11/2025',      // data
  null               // ID para ignorar (ao editar)
);

if (resultado.conflito) {
  console.log('Tipo:', resultado.tipo); // 'agendamento' ou 'bloqueio'
  console.log('Motivo:', resultado.motivo);
}
```

**Cálculo de Horários Ocupados:**

**`calcularHorariosOcupados(agendamentos, servicos, profissionalId, data)`**

✅ **ATUALIZADO:** Considera:
- Duração completa do serviço
- Bloqueios de horário

```javascript
const ocupados = calcularHorariosOcupados(
  agendamentos,
  servicos,
  1,              // profissionalId
  '17/11/2025'    // data
);
// ["09:00", "09:30", "10:00", "14:00", ...]
```

**Obter Horários Disponíveis com Duração:**

**`obterHorariosDisponiveisComDuracao(todosHorarios, agendamentos, servicos, profissionalId, data, duracaoServicoMinutos, agendamentoIdIgnorar)`**

```javascript
const horarios = obterHorariosDisponiveisComDuracao(
  gerarHorariosDisponiveis('08:00', '20:00', 30),
  agendamentos,
  servicos,
  1,
  '17/11/2025',
  90  // duração do serviço
);

// Retorna:
// [
//   { horario: "08:00", disponivel: true, motivoBloqueio: null },
//   { horario: "08:30", disponivel: false, motivoBloqueio: "Ocupado" },
//   { horario: "09:00", disponivel: false, motivoBloqueio: "Horário de almoço" },
//   ...
// ]
```

**Funções Auxiliares:**

**`getStatusColor(status)`**
Retorna classes CSS para cada status:
```javascript
getStatusColor('confirmado');  // "bg-green-100 text-green-800 border-green-300"
getStatusColor('pendente');    // "bg-yellow-100 text-yellow-800 border-yellow-300"
getStatusColor('cancelado');   // "bg-red-100 text-red-800 border-red-300"
getStatusColor('concluido');   // "bg-blue-100 text-blue-800 border-blue-300"
getStatusColor('bloqueado');   // "bg-gray-100 text-gray-800 border-gray-400"
```

**`getDiasNoMes(data)`**
Retorna informações do mês para calendário:
```javascript
const { diasNoMes, diaDaSemanaInicio, ano, mes } = getDiasNoMes(new Date());
```

**`isHoje(data)`**
Verifica se é hoje.

**`getAgendamentosPorData(agendamentos, data)`**
Filtra agendamentos por data específica.

---

### 🎭 `masks.js`
Máscaras e formatações diversas.

**Máscaras de Input:**

**`maskPhone(value)`**
```javascript
maskPhone('11987654321'); // "(11) 98765-4321"
```

**`maskDate(value)`**
```javascript
maskDate('17112025'); // "17/11/2025"
```

**`maskCurrency(value)`**
```javascript
maskCurrency('15000'); // "R$ 150,00"
```

**Conversões de Data:**

**`dateToISO(dateStr)`**
```javascript
dateToISO('17/11/2025'); // "2025-11-17"
```

**`dateFromISO(isoStr)`**
```javascript
dateFromISO('2025-11-17'); // "17/11/2025"
```

**`formatDateBR(date)`**
```javascript
formatDateBR(new Date()); // "17/11/2025"
formatDateBR('2025-11-17'); // "17/11/2025"
```

**Datas Úteis:**

**`getTodayBR()`**
```javascript
getTodayBR(); // "17/11/2025"
```

**`getTodayISO()`**
```javascript
getTodayISO(); // "2025-11-17"
```

**`addDays(dataBR, days)`**
```javascript
addDays('17/11/2025', 7); // "24/11/2025"
```

**`addMonths(dataBR, months)`**
```javascript
addMonths('17/11/2025', 1); // "17/12/2025"
```

**Validações:**

**`isValidDate(dateStr)`**
```javascript
isValidDate('17/11/2025'); // true
isValidDate('32/13/2025'); // false
```

**`compareDates(date1, date2)`**
```javascript
compareDates('15/11/2025', '17/11/2025'); // -1 (date1 < date2)
compareDates('17/11/2025', '17/11/2025'); // 0  (iguais)
compareDates('20/11/2025', '17/11/2025'); // 1  (date1 > date2)
```

**`isDateInRange(date, startDate, endDate)`**
```javascript
isDateInRange('16/11/2025', '15/11/2025', '20/11/2025'); // true
```

**Geradores:**

**`generateTimeOptions()`**
```javascript
const opcoes = generateTimeOptions();
// ["08:00", "08:30", "09:00", ..., "20:00", "20:30"]
```

**`generateDurationOptions()`**
```javascript
const opcoes = generateDurationOptions();
// [
//   { value: 5, label: "5min" },
//   { value: 10, label: "10min" },
//   ...
//   { value: 60, label: "1h" },
//   { value: 90, label: "1h 30min" },
//   ...
// ]
```

**Remoção de Máscaras:**

**`unmaskCurrency(value)`**
```javascript
unmaskCurrency('R$ 150,00'); // 150
```

**`unmaskPhone(value)`**
```javascript
unmaskPhone('(11) 98765-4321'); // "11987654321"
```

---

### 🔐 `planRestrictions/`
Sistema completo de gerenciamento de restrições por plano.

#### `planLimits.js`
Define limites quantitativos e recursos de cada plano.

```javascript
export const PLAN_LIMITS = {
  inicial: {
    saloes: 1,
    profissionais: 1,
    clientes: 10,
    categorias: 2,
    servicosPorCategoria: 2,
    fornecedores: 1,
    produtos: 3,
    financeiro: false,
    relatorios: false,
    agendamentoOnline: false,
    notificacoes: true,  // ✅ Sempre liberado
    comunicacoes: true   // ✅ Sempre liberado
  },
  
  essencial: {
    saloes: 1,
    profissionais: 2,
    clientes: 30,
    categorias: 3,
    servicosPorCategoria: 3,
    relatorios: 'basico',
    agendamentoOnline: true,
    notificacoes: true,  // ✅ Sempre liberado
    // ...
  },
  
  // ... outros planos
};
```

#### `notificationLevels.js`
✅ **ATUALIZADO:** Todas as notificações disponíveis para todos os planos.

```javascript
// Todas as 5 notificações sempre disponíveis:
export const NOTIFICATION_FEATURES = {
  todas: ['confirmacao', 'cancelamento', 'alteracao', 'avaliacao', 'aniversario']
};

// Sempre retorna true
export const hasNotificationAccess = (plano, tipoNotificacao) => true;

// Sempre retorna todas
export const getAvailableNotifications = (plano) => NOTIFICATION_FEATURES.todas;
```

#### `accessChecks.js`
Funções de verificação de acesso.

**`canAddMore(plano, tipo, currentCount)`**
```javascript
canAddMore('inicial', 'clientes', 8); // true (limite: 10)
canAddMore('inicial', 'clientes', 10); // false (no limite)
```

**`hasAccess(plano, recurso)`**
```javascript
hasAccess('inicial', 'financeiro'); // false
hasAccess('plus', 'financeiro'); // true
hasAccess('inicial', 'notificacoes'); // true ✅
```

**`getLimitMessage(plano, tipo)`**
```javascript
getLimitMessage('inicial', 'clientes'); // "Máximo: 10"
getLimitMessage('master', 'clientes'); // "Ilimitado"
```

**`getMinimumPlan(recurso)`**
```javascript
getMinimumPlan('financeiro'); // "plus"
getMinimumPlan('notificacoes'); // "inicial" ✅
```

#### `planComparison.js`
Comparação entre planos.

**`comparePlans(plano1, plano2)`**
```javascript
comparePlans('inicial', 'plus'); // -2 (inicial < plus)
comparePlans('plus', 'inicial'); // 2 (plus > inicial)
```

**`isUpgrade(planoAtual, planoNovo)`**
```javascript
isUpgrade('inicial', 'essencial'); // true
```

**`isDowngrade(planoAtual, planoNovo)`**
```javascript
isDowngrade('plus', 'inicial'); // true
```

#### `planInfo.js`
Informações detalhadas dos planos.

**`getUpgradeMessage(currentPlan, feature)`**
```javascript
const info = getUpgradeMessage('inicial', 'financeiro');
// {
//   title: 'Controle Financeiro Completo',
//   description: 'Acesse relatórios financeiros...',
//   minPlan: 'plus'
// }
```

**`getPlanInfo(plano)`**
```javascript
const info = getPlanInfo('profissional');
// {
//   nome: 'Profissional',
//   limits: { ... },
//   notificacoes: ['confirmacao', 'cancelamento', ...],
//   notificationLevel: { ... }
// }
```

#### `validation.js`
Validações de mudança de plano.

**`canDowngrade(planoAtual, planoNovo, currentData)`**
```javascript
const resultado = canDowngrade('plus', 'inicial', {
  clientes: 15,
  profissionais: 3
});

if (!resultado.canDowngrade) {
  console.log('Avisos:', resultado.warnings);
  // [
  //   { tipo: 'clientes', atual: 15, novo: 10, excedente: 5 },
  //   { tipo: 'profissionais', atual: 3, novo: 1, excedente: 2 }
  // ]
}
```

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/salao-gestao.git

# Entre na pasta
cd salao-gestao

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração do Mailgun (Opcional)

Para ativar o envio real de emails, configure o Mailgun:

1. Crie uma conta em [mailgun.com](https://www.mailgun.com/)
2. Verifique seu domínio ou use o sandbox
3. Obtenha sua API Key
4. Crie arquivo `.env` na raiz:

```env
VITE_MAILGUN_API_KEY=sua_api_key_aqui
VITE_MAILGUN_DOMAIN=sandbox123.mailgun.org
VITE_MAILGUN_BASE_URL=https://api.mailgun.net
VITE_MAILGUN_FROM_EMAIL=noreply@seudominio.com
VITE_MAILGUN_FROM_NAME=Seu Salão
```

5. Reinicie o servidor

**Teste a configuração:**
```javascript
import mailgunService from './services/mailgunService';

await mailgunService.testEmail('seu@email.com');
```

---

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `/dist`.

### Deploy Recomendado

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**GitHub Pages:**
Adicione ao `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

## 🗄️ Estrutura de Dados (localStorage)

### Usuário
```javascript
{
  id: 1,
  nome: "João Silva",
  email: "joao@email.com",
  telefone: "(11) 98765-4321",
  dataCriacao: "2025-11-17"
}
```

### Salão
```javascript
{
  id: 1,
  nome: "Salão Beauty",
  endereco: "Rua X, 123",
  telefone: "(11) 3333-4444",
  email: "contato@salao.com",
  logo: "data:image/png;base64,...",
  plano: "profissional",
  userId: 1,
  categoriasServicos: {
    capilares: {
      subcategorias: {
        cortes: {
          servicos: ["Corte Masculino", "Corte Feminino"]
        }
      }
    }
  },
  comunicacoes: {
    confirmacao: { ativo: true, template: {...} },
    cancelamento: { ativo: true, template: {...} },
    alteracao: { ativo: true, template: {...} },
    avaliacao: { ativo: true, template: {...} },
    aniversario: { ativo: true, automatico: true, diasAntecedencia: 0, template: {...} }
  }
}
```

### Cliente
```javascript
{
  id: 1,
  nome: "Maria Santos",
  telefone: "(11) 99999-8888",
  email: "maria@email.com",
  dataNascimento: "15/03/1990",
  ultimaVisita: "17/11/2025",
  totalGasto: 250.00,
  visitas: 5,
  status: "ativo",
  salaoId: 1
}
```

### Profissional
```javascript
{
  id: 1,
  nome: "Ana Costa",
  telefone: "(11) 97777-6666",
  email: "ana@email.com",
  especialidades: ["Corte Feminino", "Coloração", "Hidratação"],
  salaoId: 1
}
```

### Serviço
```javascript
{
  id: 1,
  nome: "Corte Feminino",
  categoria: "Serviços Capilares",
  subcategoria: "Cortes",
  duracao: 60,
  valor: 80.00,
  comissao: 30,
  descricao: "Corte de cabelo feminino adaptado...",
  profissionaisHabilitados: [1, 2, 3],
  ativo: true,
  salaoId: 1
}
```

### Agendamento
```javascript
{
  id: 1,
  clienteId: 1,
  servicoId: 1,
  profissionalId: 1,
  data: "17/11/2025",
  horario: "14:00",
  status: "confirmado", // pendente, confirmado, concluido, cancelado, bloqueado
  tipo: "agendamento", // ou "bloqueio"
  motivo: "", // usado em bloqueios
  horarioFim: "", // usado em bloqueios
  origemAgendamento: "sistema", // ou "online"
  avaliacaoSolicitada: false,
  avaliacaoRealizada: false,
  salaoId: 1
}
```

### Transação
```javascript
{
  id: 1,
  tipo: "receita", // ou "despesa"
  descricao: "Corte Feminino",
  categoria: "Serviços",
  valor: 80.00,
  formaPagamento: "Pix",
  data: "17/11/2025",
  cliente: "Maria Santos",
  fornecedor: "",
  status: "recebido", // pago, pendente, recebido
  salaoId: 1,
  observacoes: ""
}
```

### Produto
```javascript
{
  id: 1,
  nome: "Shampoo Hidratante",
  categoria: "Cabelos",
  marca: "Marca X",
  estoque: 15,
  estoqueMinimo: 5,
  valorCusto: 25.00,
  valorVenda: 45.00,
  fornecedorId: 1,
  codigo: "7891234567890",
  salaoId: 1
}
```

### Fornecedor
```javascript
{
  id: 1,
  nome: "Distribuidora ABC",
  telefone: "(11) 4444-5555",
  email: "contato@distribuidora.com",
  cnpj: "12.345.678/0001-90",
  endereco: "Av. Y, 456",
  salaoId: 1
}
```

### Avaliação
```javascript
{
  id: 1,
  agendamentoId: 1,
  clienteId: 1,
  profissionalId: 1,
  servicoId: 1,
  salaoId: 1,
  nota: 5,
  comentario: "Excelente atendimento!",
  recomendaria: true,
  data: "17/11/2025",
  hora: "16:30:00"
}
```

### Histórico de Email
```javascript
{
  id: "1731852000000",
  clienteId: 1,
  clienteNome: "Maria Santos",
  clienteEmail: "maria@email.com",
  tipo: "confirmacao",
  assunto: "✅ Agendamento Confirmado",
  agendamentoId: 1,
  status: "enviado",
  erro: null,
  dataEnvio: "2025-11-17T14:30:00.000Z",
  salaoId: 1
}
```

---

## 🎨 Guia de Estilo

### Cores Principais

```css
/* Gradientes */
.gradient-primary {
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
}

/* Status */
.status-confirmado: #10b981 (verde)
.status-pendente: #f59e0b (amarelo)
.status-cancelado: #ef4444 (vermelho)
.status-concluido: #3b82f6 (azul)
.status-bloqueado: #6b7280 (cinza)

/* Tipo de Transação */
.receita: #10b981 (verde)
.despesa: #ef4444 (vermelho)
```

### Componentes Comuns

**Botão Primário:**
```jsx
<button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
  Ação Principal
</button>
```

**Card de Estatística:**
```jsx
<div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
  <p className="text-sm text-gray-600">Label</p>
  <p className="text-3xl font-bold text-purple-600 mt-1">Valor</p>
</div>
```

**Badge de Status:**
```jsx
<span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Confirmado
</span>
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use JavaScript ES6+
- Componentes React funcionais com Hooks
- Nomes de variáveis em camelCase
- Nomes de componentes em PascalCase
- Comentários em português
- Docstrings para funções complexas

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

**Desenvolvedor:** Jucely Hair Salon Team  
**Email:** rbgamedev1@gmail.com  
**Website:** [Em Breve]

---

## 🙏 Agradecimentos

- React Team pela biblioteca incrível
- Lucide Icons pelo conjunto de ícones
- Recharts pelos gráficos
- Mailgun pelo serviço de emails
- Comunidade open source

---

## 🔄 Changelog

### v1.0.0 (2025-11-17)
- ✨ Sistema completo de gestão de salões
- 📧 Sistema de notificações por email (Mailgun)
- 📝 Histórico completo de emails enviados
- 🔄 Sincronização em tempo real de agendamentos
- ⭐ Sistema de avaliação pós-atendimento
- 🎂 Mensagens automáticas de aniversário
- 🛒 PDV (Ponto de Venda) integrado
- 💰 Controle financeiro completo
- 📊 Relatórios e análises detalhadas
- 🌐 Agenda online pública
- 🔐 Sistema de planos com restrições
- 📱 Design responsivo
- 🎨 Interface moderna e intuitiva

---

## 📚 Recursos Adicionais

### Tutoriais em Vídeo
[Em Breve]

### Documentação da API
[Em Breve]

### FAQ Técnico
[Em Breve]

### Roadmap
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com WhatsApp
- [ ] Sistema de fidelidade
- [ ] Campanhas de marketing
- [ ] Integração fiscal
- [ ] Backup em nuvem
- [ ] Multi-idioma
- [ ] Dark mode

---

<div align="center">

**Feito com ❤️ pelo Jucely Hair Salon**

⭐ Se este projeto te ajudou, deixe uma estrela!

</div>

---