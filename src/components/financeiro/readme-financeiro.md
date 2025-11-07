# 📊 Módulo Financeiro - Estrutura Modularizada

## 📁 Estrutura de Arquivos

```
src/
├── hooks/
│   ├── useFinanceiroData.js         # Lógica de cálculos e dados financeiros
│   ├── useFinanceiroFilters.js      # Lógica de filtros avançados
│   └── useTransacaoForm.js          # Lógica do formulário de transações
│
├── components/
│   └── financeiro/
│       ├── FinanceiroHeader.jsx          # Cabeçalho com período e botão
│       ├── FinanceiroStats.jsx           # Cards de estatísticas
│       ├── FinanceiroCharts.jsx          # Gráficos
│       ├── FinanceiroTable.jsx           # Tabela de transações
│       ├── ContasPagarReceber.jsx        # Contas pendentes
│       ├── PeriodoIndicator.jsx          # Indicador do período ativo
│       ├── ViewModeTabs.jsx              # Tabs de visualização
│       ├── FinanceiroFilters.jsx         # Componente de filtros
│       └── TransacaoModal.jsx            # Modal de cadastro/edição
│
└── pages/
    └── Financeiro.jsx                     # Página principal (orquestra tudo)
```

## 🔧 Descrição dos Hooks

### useFinanceiroData
**Responsabilidade:** Gerenciar todos os cálculos financeiros e filtros por período

**Retorna:**
- `transacoesFiltradas` - Transações filtradas por período
- `totalReceitas` - Total de receitas no período
- `totalDespesas` - Total de despesas no período
- `saldo` - Saldo (receitas - despesas)
- `ticketMedio` - Ticket médio das receitas
- `fluxoCaixaData` - Dados para gráfico de fluxo de caixa
- `categoriasDespesas` - Dados para gráfico de pizza

**Exemplo de uso:**
```javascript
const {
  transacoesFiltradas,
  totalReceitas,
  totalDespesas,
  saldo,
  ticketMedio,
  fluxoCaixaData,
  categoriasDespesas
} = useFinanceiroData(transacoesSalao, periodo);
```

### useFinanceiroFilters
**Responsabilidade:** Gerenciar todos os filtros avançados da interface

**Retorna:**
- `tipoTransacao` - Tipo atual: 'todas', 'receita', 'despesa'
- `setTipoTransacao` - Função para alterar tipo
- `showFilters` - Boolean para mostrar/ocultar filtros
- `setShowFilters` - Toggle filtros avançados
- `filtros` - Objeto com todos os filtros aplicados
- `setFiltros` - Atualizar filtros
- `filteredTransacoes` - Transações após todos os filtros
- `limparFiltros` - Resetar todos os filtros

**Exemplo de uso:**
```javascript
const {
  tipoTransacao,
  setTipoTransacao,
  showFilters,
  setShowFilters,
  filtros,
  setFiltros,
  filteredTransacoes,
  limparFiltros
} = useFinanceiroFilters(transacoesFiltradas);
```

### useTransacaoForm
**Responsabilidade:** Gerenciar o formulário de criação/edição de transações

**Retorna:**
- `showModal` - Modal aberto/fechado
- `editingId` - ID da transação sendo editada (null = nova)
- `formData` - Dados do formulário
- `setFormData` - Atualizar dados do formulário
- `handleOpenModal` - Abrir modal (criar/editar)
- `handleCloseModal` - Fechar modal
- `handleSubmit` - Submeter formulário
- `handleDelete` - Deletar transação
- `handleChange` - Handler de mudanças no formulário

**Exemplo de uso:**
```javascript
const {
  showModal,
  editingId,
  formData,
  setFormData,
  handleOpenModal,
  handleCloseModal,
  handleSubmit,
  handleDelete,
  handleChange
} = useTransacaoForm(salaoAtual, transacoes, setTransacoes);
```

## 📝 Descrição dos Componentes

### FinanceiroHeader
Cabeçalho da página com título, dropdown de período e botão de nova transação.

**Props:**
- `salaoNome` - Nome do salão
- `periodo` - Período selecionado
- `setPeriodo` - Função para mudar período
- `onNovaTransacao` - Callback para abrir modal

### PeriodoIndicator
Badge visual mostrando o período ativo (Hoje, Esta Semana, etc).

**Props:**
- `periodo` - Período atual

### ViewModeTabs
Tabs para alternar entre "Todas as Transações" e "Contas a Pagar/Receber".

**Props:**
- `viewMode` - Modo atual ('transacoes' ou 'contas')
- `setViewMode` - Função para mudar modo

### FinanceiroFilters
Componente completo de filtros com busca, tipo, categoria, status, etc.

**Props:**
- `tipoTransacao` - Tipo selecionado
- `setTipoTransacao` - Alterar tipo
- `showFilters` - Mostrar filtros avançados
- `setShowFilters` - Toggle filtros
- `filtros` - Objeto de filtros
- `setFiltros` - Atualizar filtros
- `limparFiltros` - Resetar filtros

### TransacaoModal
Modal completo para criar/editar transações com todos os campos.

**Props:**
- `showModal` - Controle de visibilidade
- `editingId` - ID sendo editado
- `formData` - Dados do formulário
- `setFormData` - Atualizar formulário
- `handleCloseModal` - Fechar modal
- `handleSubmit` - Submeter formulário
- `handleChange` - Handler de mudanças
- `clientesSalao` - Lista de clientes
- `fornecedoresSalao` - Lista de fornecedores

## 🎯 Próximos Passos Recomendados

### 1. Melhorias Futuras
- Adicionar paginação na tabela
- Exportar dados para Excel/PDF
- Gráficos mais interativos
- Filtros salvos (localStorage)
- Notificações de contas vencendo
- Dashboard de análises

### 2. Performance
- Implementar virtualização na tabela
- Lazy loading dos gráficos
- Cache de dados calculados
- Debounce nos filtros de busca

### 3. Acessibilidade
- Adicionar ARIA labels
- Melhorar navegação por teclado
- Suporte a leitores de tela
- Contraste de cores adequado