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

Aguardando o próximo grupo de arquivos para continuar a documentação! 📄✨

---