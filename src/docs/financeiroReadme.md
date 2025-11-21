# 💰 MÓDULO FINANCEIRO - DOCUMENTAÇÃO COMPLETA

## 🎯 VISÃO GERAL

O Módulo Financeiro é o sistema de controle financeiro completo do sistema de gestão de salões de beleza. Ele oferece visão consolidada de entradas, saídas, saldo e ticket médio, com filtros inteligentes por período e acesso rápido através de cards clicáveis.

### Características Principais
- Dashboard com 4 cards clicáveis (Entradas, Saídas, Saldo, Ticket Médio)
- Filtros por período (Hoje, Esta Semana, Este Mês, Este Ano)
- Detalhamento sob demanda (clique nos cards)
- Botões de ação rápida (+) nos cards de Entradas e Saídas
- Validação baseada em planos (apenas Plano Plus+)
- Formulário simplificado de transação
- Persistência automática no localStorage

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── pages/
│   └── Financeiro.jsx                             # Página principal (orquestra tudo)
│
├── components/financeiro/
│   ├── FinanceiroHeader.jsx                       # Cabeçalho com período
│   ├── FinanceiroStats.jsx                        # Cards clicáveis com botões +
│   ├── FinanceiroDetails.jsx                      # Detalhamento por card
│   ├── FinanceiroTable.jsx                        # Tabela de transações
│   └── TransacaoModal.jsx                         # Modal de cadastro/edição
│
├── hooks/
│   ├── useFinanceiroData.js                       # Lógica de cálculos financeiros
│   ├── useFinanceiroFilters.js                    # Lógica de filtros avançados
│   └── useTransacaoForm.js                        # Lógica do formulário
│
├── contexts/
│   └── SalaoContext.jsx                           # Estado global (transações)
│
└── utils/
    ├── masks.js                                    # Funções de máscaras e datas
    └── planRestrictions.js                         # Restrições por plano
```

---

## 🗺️ FLUXO DE NAVEGAÇÃO

### Jornada do Usuário:

```
Página Financeiro
    │
    ├─► Selecionar Período (Hoje/Semana/Mês/Ano)
    │   └─► Dados atualizam automaticamente
    │
    ├─► Ver Cards de Resumo
    │   ├─► 💰 Entradas (verde) - Clique no + para adicionar
    │   ├─► 💸 Saídas (vermelho) - Clique no + para adicionar
    │   ├─► 💵 Saldo (roxo/vermelho)
    │   └─► 💳 Ticket Médio (azul)
    │
    ├─► Clicar em Card para Ver Detalhes
    │   ├─► Header com estatísticas resumidas
    │   └─► Tabela com todas as transações filtradas
    │
    └─► Ações nas Transações
        ├─► Editar (ícone lápis)
        └─► Excluir (ícone lixeira)
```

---

## 🔧 DETALHAMENTO DOS ARQUIVOS

### **PÁGINA PRINCIPAL**

#### **1. Financeiro.jsx**
**Caminho:** `src/pages/Financeiro.jsx`

**Responsabilidades:**
- Orquestrar todos os componentes do módulo
- Gerenciar estado de período selecionado
- Controlar card selecionado para detalhamento
- Validar acesso ao módulo (apenas Plano Plus+)
- Preparar dados antes de abrir modal

**Estados Principais:**
```javascript
- periodo: 'dia' | 'semana' | 'mes' | 'ano'
- selectedCard: 'receita' | 'despesa' | 'saldo' | 'ticket' | null
```

**Dados Obtidos via Context:**
```javascript
const {
  salaoAtual,              // Salão atual do usuário
  transacoes,              // Array global de transações
  setTransacoes,           // Função para atualizar transações
  getClientesPorSalao,     // Filtrar clientes por salão
  getFornecedoresPorSalao, // Filtrar fornecedores por salão
  getTransacoesPorSalao    // Filtrar transações por salão
} = useContext(SalaoContext);
```

**Hooks Utilizados:**
```javascript
// Hook de dados financeiros
const {
  transacoesFiltradas,     // Transações filtradas por período
  totalReceitas,           // Soma de receitas pagas
  totalDespesas,           // Soma de despesas pagas
  saldo,                   // Receitas - Despesas
  ticketMedio             // Média por receita
} = useFinanceiroData(transacoesSalao, periodo);

// Hook de filtros (futuro uso)
const {
  filteredTransacoes      // Transações com filtros aplicados
} = useFinanceiroFilters(transacoesFiltradas);

// Hook do formulário
const {
  showModal,              // Controle de visibilidade
  editingId,              // ID da transação sendo editada
  formData,               // Dados do formulário
  setFormData,            // Atualizar formulário
  handleOpenModal,        // Abrir modal
  handleCloseModal,       // Fechar modal
  handleSubmit,           // Salvar transação
  handleDelete,           // Excluir transação
  handleChange           // Handler de inputs
} = useTransacaoForm(salaoAtual, transacoes, setTransacoes);
```

**Handlers Críticos:**

```javascript
// ✅ CORRETO: Define TODOS os dados antes de abrir modal
const handleAddReceita = () => {
  setFormData({
    tipo: 'receita',
    descricao: '',
    categoria: '',
    valor: '',
    formaPagamento: '',
    data: getTodayBR(),
    cliente: '',
    fornecedor: '',
    status: 'pago',
    salaoId: salaoAtual?.id || '',
    observacoes: ''
  });
  handleOpenModal(); // Abre vazio (nova transação)
};

// ✅ CORRETO: Define TODOS os dados antes de abrir modal
const handleAddDespesa = () => {
  setFormData({
    tipo: 'despesa',
    descricao: '',
    categoria: '',
    valor: '',
    formaPagamento: '',
    data: getTodayBR(),
    cliente: '',
    fornecedor: '',
    status: 'pago',
    salaoId: salaoAtual?.id || '',
    observacoes: ''
  });
  handleOpenModal(); // Abre vazio (nova transação)
};
```

**Validação de Acesso:**
```javascript
const temAcessoFinanceiro = hasAccess(salaoAtual.plano, 'financeiro');

if (!temAcessoFinanceiro) {
  return <PlanRestriction feature="financeiro" minPlan="plus" />;
}
```

**Renderização:**
```javascript
return (
  <div className="space-y-6">
    {/* 1. Cabeçalho */}
    <FinanceiroHeader ... />
    
    {/* 2. Info do Plano */}
    <div className="bg-blue-50 ...">
      💡 Dica de uso dos botões +
    </div>
    
    {/* 3. Cards Clicáveis */}
    <FinanceiroStats 
      onCardClick={handleCardClick}
      onAddReceita={handleAddReceita}
      onAddDespesa={handleAddDespesa}
      ...
    />
    
    {/* 4. Detalhamento (condicional) */}
    {selectedCard && (
      <FinanceiroDetails
        cardType={selectedCard}
        onClose={handleCloseDetails}
        ...
      />
    )}
    
    {/* 5. Modal de Transação */}
    <TransacaoModal ... />
  </div>
);
```

---

### **COMPONENTES DE INTERFACE**

#### **2. FinanceiroHeader.jsx**
**Caminho:** `src/components/financeiro/FinanceiroHeader.jsx`

**Responsabilidades:**
- Exibir título e nome do salão
- Renderizar botões de período
- Indicar período ativo

**Props:**
```javascript
{
  salaoNome: string,        // Nome do salão
  periodo: string,          // Período atual
  setPeriodo: function      // Função para mudar período
}
```

**Períodos Disponíveis:**
```javascript
const periodos = [
  { value: 'dia', label: 'Hoje' },
  { value: 'semana', label: 'Esta Semana' },
  { value: 'mes', label: 'Este Mês' },
  { value: 'ano', label: 'Este Ano' }
];
```

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Financeiro                    [Hoje] [Semana] [Mês] [Ano]│
│ Controle suas finanças - Salão XYZ                      │
└─────────────────────────────────────────────────────────┘
```

**Estilo do Botão Ativo:**
- Background: `bg-gradient-to-r from-purple-600 to-pink-600`
- Texto: `text-white`
- Sombra: `shadow-lg`

---

#### **3. FinanceiroStats.jsx**
**Caminho:** `src/components/financeiro/FinanceiroStats.jsx`

**Responsabilidades:**
- Renderizar 4 cards de estatísticas
- Adicionar botão (+) nos cards de Entradas e Saídas
- Tornar cards clicáveis para detalhamento
- Indicar quando clicar para detalhes

**Props:**
```javascript
{
  totalReceitas: number,        // Total de receitas
  totalDespesas: number,        // Total de despesas
  saldo: number,                // Saldo atual
  ticketMedio: number,          // Ticket médio
  transacoesSalao: array,       // Transações (para contadores)
  onCardClick: function,        // Callback ao clicar no card
  onAddReceita: function,       // Callback botão + Receita
  onAddDespesa: function        // Callback botão + Despesa
}
```

**Estrutura de StatCard:**
```javascript
const StatCard = ({ 
  icon: Icon,              // Ícone Lucide
  label,                   // Rótulo (ex: "Entradas")
  value,                   // Valor (ex: "R$ 5.000,00")
  subtext,                 // Subtexto (ex: "10 transações")
  color,                   // Cor do tema
  onClick,                 // Handler de clique no card
  onAddClick,              // Handler botão + (opcional)
  showAddButton           // Mostrar botão + ?
}) => { ... }
```

**Cores por Card:**
```javascript
const colorClasses = {
  green: {                         // Entradas
    bg: 'bg-green-100',
    text: 'text-green-600',
    hover: 'hover:bg-green-50',
    border: 'border-green-200'
  },
  red: {                           // Saídas
    bg: 'bg-red-100',
    text: 'text-red-600',
    hover: 'hover:bg-red-50',
    border: 'border-red-200'
  },
  purple: {                        // Saldo Positivo
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-50',
    border: 'border-purple-200'
  },
  blue: {                          // Ticket Médio
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-50',
    border: 'border-blue-200'
  }
};
```

**Funcionalidades:**
- ✅ Cards com hover animado (`hover:scale-105`)
- ✅ Botão (+) posicionado no topo direito
- ✅ Botão (+) com `stopPropagation()` (não aciona clique no card)
- ✅ Mensagem de orientação na parte inferior
- ✅ Contadores de transações por tipo

**Layout de um Card:**
```
┌───────────────────────────────────────┐
│                           [+]         │ ← Botão (se showAddButton)
│  [ÍCONE]   Label                      │
│            R$ 5.000,00                │
│            10 transações              │
│                                       │
│  Clique no + ou aqui para detalhes   │ ← Orientação
└───────────────────────────────────────┘
```

---

#### **4. FinanceiroDetails.jsx**
**Caminho:** `src/components/financeiro/FinanceiroDetails.jsx`

**Responsabilidades:**
- Exibir detalhamento de um card selecionado
- Renderizar header personalizado por tipo
- Exibir estatísticas resumidas (3 cards)
- Mostrar tabela de transações filtradas

**Props:**
```javascript
{
  cardType: 'receita' | 'despesa' | 'saldo' | 'ticket',
  onClose: function,              // Fechar detalhamento
  filteredTransacoes: array,      // Transações filtradas
  handleOpenModal: function,      // Editar transação
  handleDelete: function,         // Excluir transação
  totalReceitas: number,
  totalDespesas: number,
  saldo: number,
  ticketMedio: number
}
```

**Configurações por Tipo:**

```javascript
const getCardConfig = () => {
  switch(cardType) {
    case 'receita':
      return {
        title: 'Entradas - Detalhamento',
        icon: TrendingUp,
        color: 'green',
        stats: [
          { label: 'Total de Entradas', value: `R$ ${totalReceitas}` },
          { label: 'Quantidade', value: filteredTransacoes.filter(t => t.tipo === 'receita').length },
          { label: 'Média por Entrada', value: `R$ ${ticketMedio}` }
        ],
        transacoes: filteredTransacoes.filter(t => t.tipo === 'receita')
      };
    
    case 'despesa':
      return {
        title: 'Saídas - Detalhamento',
        icon: TrendingDown,
        color: 'red',
        stats: [
          { label: 'Total de Saídas', value: `R$ ${totalDespesas}` },
          { label: 'Quantidade', value: filteredTransacoes.filter(t => t.tipo === 'despesa').length },
          { label: 'Média por Saída', value: `R$ ${média}` }
        ],
        transacoes: filteredTransacoes.filter(t => t.tipo === 'despesa')
      };
    
    case 'saldo':
      return {
        title: 'Saldo - Visão Geral',
        icon: DollarSign,
        color: saldo >= 0 ? 'purple' : 'red',
        stats: [
          { label: 'Total Entradas', value: `R$ ${totalReceitas}` },
          { label: 'Total Saídas', value: `R$ ${totalDespesas}` },
          { label: 'Saldo Final', value: `R$ ${saldo}` }
        ],
        transacoes: filteredTransacoes
      };
    
    case 'ticket':
      return {
        title: 'Ticket Médio - Análise',
        icon: CreditCard,
        color: 'blue',
        stats: [
          { label: 'Ticket Médio', value: `R$ ${ticketMedio}` },
          { label: 'Total Transações', value: filteredTransacoes.filter(t => t.tipo === 'receita').length },
          { label: 'Receita Total', value: `R$ ${totalReceitas}` }
        ],
        transacoes: filteredTransacoes.filter(t => t.tipo === 'receita')
      };
  }
};
```

**Layout:**
```
┌────────────────────────────────────────────────┐
│ [ÍCONE] Título - Detalhamento          [X]    │
│         Visualizando N transação(ões)          │
│                                                 │
│  ┌──────────┬──────────┬──────────┐           │
│  │ Label 1  │ Label 2  │ Label 3  │           │
│  │ Valor 1  │ Valor 2  │ Valor 3  │           │
│  └──────────┴──────────┴──────────┘           │
└────────────────────────────────────────────────┘
│                                                 │
│  [TABELA DE TRANSAÇÕES]                        │
└────────────────────────────────────────────────┘
```

**Cores do Header:**
- Verde: Entradas
- Vermelho: Saídas
- Roxo: Saldo positivo
- Vermelho: Saldo negativo
- Azul: Ticket médio

---

#### **5. FinanceiroTable.jsx**
**Caminho:** `src/components/financeiro/FinanceiroTable.jsx`

**Responsabilidades:**
- Renderizar tabela de transações
- Exibir badges de status
- Identificar transações vencidas
- Mostrar ações (editar/excluir)

**Props:**
```javascript
{
  filteredTransacoes: array,      // Transações a exibir
  handleOpenModal: function,      // Editar transação
  handleDelete: function          // Excluir transação
}
```

**Estrutura de Transação:**
```javascript
{
  id: number,
  salaoId: number,
  tipo: 'receita' | 'despesa',
  descricao: string,
  categoria: string,
  valor: number,
  formaPagamento: string,
  data: string,                    // DD/MM/AAAA
  dataVencimento: string | null,   // DD/MM/AAAA
  cliente: string | null,
  fornecedor: string | null,
  status: 'pendente' | 'pago' | 'recebido' | 'cancelado',
  observacoes: string,
  parcelaAtual: number | null,
  totalParcelas: number | null
}
```

**Colunas da Tabela:**
1. **Descrição** - Nome + cliente/fornecedor + parcela (se houver)
2. **Categoria** - Badge roxo
3. **Data / Vencimento** - Ícones de calendário e relógio
4. **Forma Pagamento** - Texto simples
5. **Status** - Badge colorido
6. **Valor** - Verde (+) ou vermelho (-)
7. **Ações** - Editar e excluir

**Status e Cores:**
```javascript
const statusConfig = {
  pendente: { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-700', 
    label: 'Pendente', 
    icon: Clock 
  },
  pago: { 
    bg: 'bg-green-100', 
    text: 'text-green-700', 
    label: 'Pago', 
    icon: CheckCircle 
  },
  recebido: { 
    bg: 'bg-green-100', 
    text: 'text-green-700', 
    label: 'Recebido', 
    icon: CheckCircle 
  },
  cancelado: { 
    bg: 'bg-gray-100', 
    text: 'text-gray-700', 
    label: 'Cancelado', 
    icon: null 
  }
};
```

**Lógica de Vencimento:**
```javascript
const isVencida = transacao.status === 'pendente' && 
                  transacao.dataVencimento && 
                  compareDates(dateToISO(transacao.dataVencimento), hoje) < 0;

if (isVencida) {
  // Badge vermelho "Vencida" com ícone AlertCircle
}
```

**Mensagem de Lista Vazia:**
```
┌────────────────────────────────────────┐
│            [ÍCONE DollarSign]         │
│  Nenhuma transação encontrada         │
│  para este salão.                     │
│                                        │
│  Clique em "Nova Transação"           │
│  para adicionar a primeira transação. │
└────────────────────────────────────────┘
```

---

#### **6. TransacaoModal.jsx**
**Caminho:** `src/components/financeiro/TransacaoModal.jsx`

**Responsabilidades:**
- Modal de cadastro/edição de transação
- Formulário simplificado e direto
- Validação de campos obrigatórios
- Diferenciação visual por tipo (receita/despesa)

**Props:**
```javascript
{
  showModal: boolean,
  editingId: number | null,
  formData: object,
  setFormData: function,
  handleCloseModal: function,
  handleSubmit: function,
  handleChange: function,
  clientesSalao: array,
  fornecedoresSalao: array
}
```

**Campos do Formulário:**

```javascript
// Badge Visual (topo)
{formData.tipo === 'receita' 
  ? '💰 Entrada de Dinheiro' 
  : '💸 Saída de Dinheiro'}

// 1. Tipo (apenas se editando)
['receita', 'despesa'] // Botões toggle

// 2. Descrição * (obrigatório)
placeholder: "Ex: Corte + Escova" ou "Ex: Compra de produtos"

// 3. Valor (R$) * e Data *
valor: number (step 0.01, min 0)
data: string (máscara DD/MM/AAAA)

// 4. Categoria * (obrigatório)
receita: ['Serviços', 'Produtos', 'Outros']
despesa: ['Produtos', 'Estoque', 'Marketing', 'Manutenção', 'Outros']

// 5. Forma de Pagamento * (obrigatório)
['Dinheiro', 'Pix', 'Cartão de Débito', 'Cartão de Crédito', 
 'Transferência', 'Boleto']

// 6. Cliente OU Fornecedor (opcional)
receita: select de clientes
despesa: select de fornecedores

// 7. Status * (obrigatório)
['pendente', 'recebido/pago', 'cancelado']
// Label muda conforme tipo: 'recebido' para receita, 'pago' para despesa

// 8. Observações (opcional)
textarea (2 linhas)
```

**Validações:**
- Descrição não vazia
- Valor maior que zero
- Data válida (formato DD/MM/AAAA)
- Categoria selecionada
- Forma de pagamento selecionada
- Status selecionado

**Cores e Gradientes:**
```javascript
const getTipoColor = () => {
  return formData.tipo === 'receita' 
    ? 'from-green-600 to-emerald-600'   // Verde
    : 'from-red-600 to-rose-600';       // Vermelho
};
```

**Título Dinâmico:**
```javascript
const getModalTitle = () => {
  if (editingId) return 'Editar Transação';
  return formData.tipo === 'receita' 
    ? 'Nova Entrada' 
    : 'Nova Saída';
};
```

**Layout:**
```
┌─────────────────────────────────────────┐
│ [Título Dinâmico]              [X]     │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 💰 Entrada de Dinheiro              │ │ ← Badge
│ │ Registre um recebimento             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Descrição: [___________________]       │
│                                         │
│ Valor: [_____]  Data: [__/__/____]    │
│                                         │
│ Categoria: [▼___________________]      │
│                                         │
│ [... outros campos ...]                │
│                                         │
│           [Cancelar] [Salvar]          │
└─────────────────────────────────────────┘
```

---

### **HOOKS PERSONALIZADOS**

#### **7. useFinanceiroData.js**
**Caminho:** `src/hooks/useFinanceiroData.js`

**Responsabilidades:**
- Filtrar transações por período selecionado
- Calcular totais (receitas, despesas, saldo)
- Calcular ticket médio
- Gerar dados para gráficos (futuro)

**Parâmetros:**
```javascript
(transacoesSalao, periodo)
```

**Retorno:**
```javascript
{
  transacoesFiltradas: array,      // Filtradas por período
  totalReceitas: number,           // Soma de receitas pagas
  totalDespesas: number,           // Soma de despesas pagas
  saldo: number,                   // receitas - despesas
  ticketMedio: number,             // média por receita
  fluxoCaixaData: array,           // Dados últimos 6 meses (futuro)
  categoriasDespesas: array        // Distribuição % (futuro)
}
```

**Lógica de Filtro por Período:**
```javascript
const filtrarPorPeriodo = (transacoes) => {
  const hoje = new Date();
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  
  return transacoes.filter(t => {
    const dataTransacao = new Date(dateToISO(t.data).split('-').join('/'));
    
    switch (periodo) {
      case 'dia':
        return dataTransacao >= inicioHoje;
      
      case 'semana':
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        inicioSemana.setHours(0, 0, 0, 0);
        return dataTransacao >= inicioSemana;
      
      case 'mes':
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        return dataTransacao >= inicioMes;
      
      case 'ano':
        const inicioAno = new Date(hoje.getFullYear(), 0, 1);
        return dataTransacao >= inicioAno;
      
      default:
        return true;
    }
  });
};
```

**Cálculo de Totais:**
```javascript
// ✅ APENAS transações PAGAS/RECEBIDAS
const totalReceitas = useMemo(() => {
  return transacoesFiltradas
    .filter(t => t.tipo === 'receita' && (t.status === 'recebido' || t.status === 'pago'))
    .reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);
}, [transacoesFiltradas]);

const totalDespesas = useMemo(() => {
  return transacoesFiltradas
    .filter(t => t.tipo === 'despesa' && (t.status === 'pago' || t.status === 'recebido'))
    .reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);
}, [transacoesFiltradas]);
```

**Cálculo de Ticket Médio:**
```javascript
const ticketMedio = useMemo(() => {
  const receitas = transacoesFiltradas.filter(t => 
    t.tipo === 'receita' && (t.status === 'recebido' || t.status === 'pago')
  );
  if (receitas.length === 0) return 0;
  return totalReceitas / receitas.length;
}, [transacoesFiltradas, totalReceitas]);
```

**Dados de Fluxo de Caixa (últimos 6 meses):**
```javascript
const fluxoCaixaData = useMemo(() => {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const dados = [];
  const hoje = new Date();

  for (let i = 5; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const mesLabel = meses[data.getMonth()];
    
    // ... cálculo de receita e despesa do mês ...
    
    dados.push({ mes: mesLabel, receita, despesa });
  }
  
  return dados;
}, [transacoesSalao]);
```

---

#### **8. useFinanceiroFilters.js**
**Caminho:** `src/hooks/useFinanceiroFilters.js`

**Responsabilidades:**
- Gerenciar filtros avançados (futuro)
- Filtrar por tipo, categoria, status, etc
- Busca textual
- Filtro por data

**Parâmetros:**
```javascript
(transacoesFiltradas)
```

**Retorno:**
```javascript
{
  tipoTransacao: string,           // 'todas' | 'receita' | 'despesa'
  setTipoTransacao: function,
  showFilters: boolean,            // Mostrar painel de filtros
  setShowFilters: function,
  filtros: object,                 // Objeto com todos os filtros
  setFiltros: function,
  filteredTransacoes: array,       // Resultado final com filtros
  limparFiltros: function          // Resetar todos os filtros
}
```

**Estados de Filtros:**
```javascript
const [filtros, setFiltros] = useState({
  dataInicio: '',          // DD/MM/AAAA
  dataFim: '',             // DD/MM/AAAA
  categoria: '',           // Nome da categoria
  status: '',              // 'pendente' | 'pago' | 'recebido' | 'cancelado'
  formaPagamento: '',      // Ex: 'Pix', 'Dinheiro'
  busca: ''                // Texto livre
});
```

**Lógica de Filtro Combinado:**
```javascript
const filteredTransacoes = useMemo(() => {
  return transacoesFiltradas.filter(t => {
    // Filtro por tipo
    if (tipoTransacao !== 'todas' && t.tipo !== tipoTransacao) return false;
    
    // Filtro por categoria
    if (filtros.categoria && t.categoria !== filtros.categoria) return false;
    
    // Filtro por status
    if (filtros.status && t.status !== filtros.status) return false;
    
    // Filtro por forma de pagamento
    if (filtros.formaPagamento && t.formaPagamento !== filtros.formaPagamento) return false;
    
    // Filtro por data início
    if (filtros.dataInicio) {
      const dataTransacao = dateToISO(t.dataVencimento || t.data);
      const dataInicio = dateToISO(filtros.dataInicio);
      if (compareDates(dataTransacao, dataInicio) < 0) return false;
    }
    
    // Filtro por data fim
    if (filtros.dataFim) {
      const dataTransacao = dateToISO(t.dataVencimento || t.data);
      const dataFim = dateToISO(filtros.dataFim);
      if (compareDates(dataTransacao, dataFim) > 0) return false;
    }
    
    // Filtro por busca textual
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      const descricao = t.descricao?.toLowerCase() || '';
      const cliente = t.cliente?.toLowerCase() || '';
      const fornecedor = t.fornecedor?.toLowerCase() || '';
      
      if (!descricao.includes(busca) && 
          !cliente.includes(busca) && 
          !fornecedor.includes(busca)) {
        return false;
      }
    }
    
    return true;
  });
}, [transacoesFiltradas, tipoTransacao, filtros]);
```

**Função Limpar Filtros:**
```javascript
const limparFiltros = () => {
  setFiltros({
    dataInicio: '',
    dataFim: '',
    categoria: '',
    status: '',
    formaPagamento: '',
    busca: ''
  });
};
```

**Status Atual:** ⚠️ Hook criado mas filtros avançados não expostos na UI ainda

---

#### **9. useTransacaoForm.js**
**Caminho:** `src/hooks/useTransacaoForm.js`

**Responsabilidades:**
- Gerenciar estado do formulário de transação
- Controlar abertura/fechamento do modal
- Submeter dados (criar/editar)
- Excluir transações
- Validar e resetar formulário

**Parâmetros:**
```javascript
(salaoAtual, transacoes, setTransacoes)
```

**Retorno:**
```javascript
{
  showModal: boolean,
  editingId: number | null,
  formData: object,
  setFormData: function,
  handleOpenModal: function,
  handleCloseModal: function,
  handleSubmit: function,
  handleDelete: function,
  handleChange: function
}
```

**Estrutura de formData:**
```javascript
const getInitialFormData = () => ({
  tipo: 'receita',
  descricao: '',
  categoria: '',
  valor: '',
  formaPagamento: '',
  data: getTodayBR(),          // Data atual
  cliente: '',
  fornecedor: '',
  status: 'pago',              // Padrão: pago
  salaoId: salaoAtual?.id || '',
  observacoes: ''
});
```

**Handler de Abertura (Crítico):**
```javascript
const handleOpenModal = (transacao = null) => {
  if (transacao) {
    // Editando transação existente
    setEditingId(transacao.id);
    setFormData({
      tipo: transacao.tipo,
      descricao: transacao.descricao,
      categoria: transacao.categoria,
      valor: transacao.valor.toString(),
      formaPagamento: transacao.formaPagamento,
      data: transacao.data,
      cliente: transacao.cliente || '',
      fornecedor: transacao.fornecedor || '',
      status: transacao.status,
      salaoId: transacao.salaoId,
      observacoes: transacao.observacoes || ''
    });
  } else {
    // Nova transação - NÃO reseta aqui
    // O tipo já foi setado no componente pai
    setEditingId(null);
  }
  setShowModal(true);
};
```

**⚠️ ATENÇÃO - Padrão de Uso:**
```javascript
// ✅ CORRETO: Setar formData ANTES de chamar handleOpenModal
setFormData({ tipo: 'receita', ... });
handleOpenModal();

// ❌ ERRADO: Chamar handleOpenModal e depois setar tipo
handleOpenModal();
setFormData({ tipo: 'receita', ... }); // Tarde demais!
```

**Handler de Submissão:**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  
  const transacao = {
    id: editingId || Math.max(...transacoes.map(t => t.id), 0) + 1,
    ...formData,
    valor: parseFloat(formData.valor),
    dataCriacao: getTodayBR(),
    dataVencimento: null
  };

  if (editingId) {
    // Editar existente
    setTransacoes(transacoes.map(t => 
      t.id === editingId ? transacao : t
    ));
  } else {
    // Criar novo
    setTransacoes([...transacoes, transacao]);
  }
  
  handleCloseModal();
};
```

**Handler de Exclusão:**
```javascript
const handleDelete = (id) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    setTransacoes(transacoes.filter(t => t.id !== id));
  }
};
```

**Handler de Mudança:**
```javascript
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

**Effect de Sincronização:**
```javascript
// Atualizar salaoId quando mudar de salão
useEffect(() => {
  if (salaoAtual?.id) {
    setFormData(prev => ({
      ...prev,
      salaoId: salaoAtual.id
    }));
  }
}, [salaoAtual?.id]);
```

---

## 🔐 SISTEMA DE VALIDAÇÕES

### **Validação de Acesso ao Módulo**

O módulo financeiro está disponível apenas nos planos **Plus**, **Premium** e **Master**.

**Função de Validação:**
```javascript
import { hasAccess } from '../utils/planRestrictions';

const temAcessoFinanceiro = hasAccess(salaoAtual.plano, 'financeiro');
```

**Planos e Acesso:**
```javascript
// planRestrictions.js
export const FEATURES_POR_PLANO = {
  inicial: {
    financeiro: false,       // ❌ Sem acesso
    // ...
  },
  essencial: {
    financeiro: false,       // ❌ Sem acesso
    // ...
  },
  profissional: {
    financeiro: false,       // ❌ Sem acesso
    // ...
  },
  plus: {
    financeiro: true,        // ✅ Acesso liberado
    // ...
  },
  premium: {
    financeiro: true,        // ✅ Acesso liberado
    // ...
  },
  master: {
    financeiro: true,        // ✅ Acesso liberado
    // ...
  }
};
```

**Componente de Restrição:**
```javascript
if (!temAcessoFinanceiro) {
  return <PlanRestriction feature="financeiro" minPlan="plus" />;
}
```

**Tela Exibida (se sem acesso):**
```
┌────────────────────────────────────────┐
│          [ÍCONE Lock]                 │
│                                        │
│  Módulo Financeiro                    │
│  Disponível no Plano Plus ou superior │
│                                        │
│          [Fazer Upgrade]              │
└────────────────────────────────────────┘
```

---

### **Validações de Formulário**

**Campos Obrigatórios:**
- ✅ Descrição (não vazio)
- ✅ Valor (maior que zero)
- ✅ Data (formato DD/MM/AAAA válido)
- ✅ Categoria (selecionada)
- ✅ Forma de Pagamento (selecionada)
- ✅ Status (selecionado)

**Validações Automáticas (HTML5):**
```javascript
<input 
  type="text"
  required                    // Não vazio
  placeholder="Ex: Corte"
/>

<input 
  type="number"
  required
  step="0.01"                 // Aceita centavos
  min="0"                     // Não aceita negativo
/>

<input 
  type="text"
  required
  pattern="\d{2}/\d{2}/\d{4}" // Formato DD/MM/AAAA
/>
```

**Validações de Data:**
```javascript
// masks.js
export const isValidDate = (dateStr) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;
  
  const [dia, mes, ano] = dateStr.split('/').map(Number);
  const data = new Date(ano, mes - 1, dia);
  
  return data.getDate() === dia && 
         data.getMonth() === mes - 1 && 
         data.getFullYear() === ano;
};
```

---

## 💾 PERSISTÊNCIA DE DADOS

### **localStorage Strategy**

Transações são salvas automaticamente via Context API:

```javascript
// SalaoContext.jsx
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
  }, 300); // Debounce de 300ms
  
  return () => clearTimeout(timer);
}, [transacoes]);
```

**Estrutura no localStorage:**
```javascript
{
  "transacoes": [
    {
      "id": 1,
      "salaoId": 1,
      "tipo": "receita",
      "descricao": "Corte + Barba",
      "categoria": "Serviços",
      "valor": 80,
      "formaPagamento": "Pix",
      "data": "21/11/2024",
      "dataVencimento": null,
      "cliente": "João Silva",
      "fornecedor": null,
      "status": "recebido",
      "observacoes": "",
      "dataCriacao": "21/11/2024",
      "parcelaAtual": null,
      "totalParcelas": null
    },
    {
      "id": 2,
      "salaoId": 1,
      "tipo": "despesa",
      "descricao": "Compra de shampoos",
      "categoria": "Produtos",
      "valor": 350,
      "formaPagamento": "Cartão de Crédito",
      "data": "20/11/2024",
      "dataVencimento": null,
      "cliente": null,
      "fornecedor": "Distribuidora ABC",
      "status": "pago",
      "observacoes": "10 unidades",
      "dataCriacao": "20/11/2024",
      "parcelaAtual": null,
      "totalParcelas": null
    }
  ]
}
```

**Carregamento Inicial:**
```javascript
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('transacoes');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    return [];
  }
};

const [transacoes, setTransacoes] = useState(loadFromStorage);
```

---

## 🎨 PADRÕES DE UI/UX

### **Cores e Gradientes**

**Cores Principais:**
```javascript
// Receitas (verde)
bg-green-100, text-green-600, border-green-200
from-green-600 to-emerald-600

// Despesas (vermelho)
bg-red-100, text-red-600, border-red-200
from-red-600 to-rose-600

// Saldo Positivo (roxo)
bg-purple-100, text-purple-600, border-purple-200
from-purple-600 to-pink-600

// Saldo Negativo (vermelho)
bg-red-100, text-red-600, border-red-200

// Ticket Médio (azul)
bg-blue-100, text-blue-600, border-blue-200

// Status Pendente (amarelo)
bg-yellow-100, text-yellow-700

// Status Pago/Recebido (verde)
bg-green-100, text-green-700

// Status Cancelado (cinza)
bg-gray-100, text-gray-700
```

**Gradientes de Botões:**
```javascript
// Período ativo
bg-gradient-to-r from-purple-600 to-pink-600

// Botão Receita
bg-gradient-to-r from-green-600 to-emerald-600

// Botão Despesa
bg-gradient-to-r from-red-600 to-rose-600
```

---

### **Animações e Transições**

**Hover em Cards:**
```css
hover:scale-105       /* Crescer levemente */
hover:shadow-md       /* Sombra média */
transition-all        /* Transição suave */
```

**Hover em Botões:**
```css
hover:opacity-90      /* Reduzir opacidade */
hover:bg-gray-50      /* Mudar background */
transition-colors     /* Transição de cores */
```

**Hover em Linhas da Tabela:**
```css
hover:bg-gray-50
transition-colors
```

---

### **Ícones Utilizados (Lucide React)**

```javascript
import { 
  TrendingUp,        // Entradas
  TrendingDown,      // Saídas
  DollarSign,        // Saldo
  CreditCard,        // Ticket Médio
  Plus,              // Adicionar
  X,                 // Fechar
  Edit,              // Editar
  Trash2,            // Excluir
  Calendar,          // Data
  Clock,             // Horário/Vencimento
  CheckCircle,       // Pago/Recebido
  AlertCircle,       // Vencida
  Crown              // Plano
} from 'lucide-react';
```

---

### **Responsividade**

**Breakpoints:**
```javascript
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Desktop large
```

**Grid de Cards:**
```javascript
// Mobile: 1 coluna
grid-cols-1

// Tablet: 2 colunas
md:grid-cols-2

// Desktop: 4 colunas
md:grid-cols-4
```

**Tabela:**
```javascript
// Scroll horizontal em mobile
<div className="overflow-x-auto">
  <table className="w-full">
    ...
  </table>
</div>
```

---

## 🔄 FLUXO DE DADOS

### **Criação de Transação (Receita)**

```
1. Usuário clica no botão [+] verde do card "Entradas"
   ↓
2. handleAddReceita() é chamado
   ↓
3. setFormData({ tipo: 'receita', ... }) - ANTES de abrir modal
   ↓
4. handleOpenModal() abre modal SEM parâmetro
   ↓
5. Modal renderiza com tipo='receita' já definido
   ↓
6. Usuário preenche formulário
   ↓
7. Usuário clica "Registrar Entrada"
   ↓
8. handleSubmit() valida e cria transação
   ↓
9. setTransacoes([...transacoes, novaTransacao])
   ↓
10. Context API persiste no localStorage
   ↓
11. Modal fecha e lista atualiza automaticamente
```

---

### **Edição de Transação**

```
1. Usuário clica no ícone [✏️] de uma transação
   ↓
2. handleOpenModal(transacao) é chamado COM parâmetro
   ↓
3. setEditingId(transacao.id)
   ↓
4. setFormData({ ...transacao }) - Preenche com dados existentes
   ↓
5. Modal renderiza com dados preenchidos
   ↓
6. Usuário edita campos
   ↓
7. Usuário clica "Salvar Alterações"
   ↓
8. handleSubmit() atualiza transação existente
   ↓
9. setTransacoes(transacoes.map(...))
   ↓
10. Context API persiste no localStorage
   ↓
11. Modal fecha e lista atualiza
```

---

### **Exclusão de Transação**

```
1. Usuário clica no ícone [🗑️] de uma transação
   ↓
2. handleDelete(id) é chamado
   ↓
3. confirm('Tem certeza?')
   ↓
4. Se SIM:
   ├─► setTransacoes(transacoes.filter(t => t.id !== id))
   ├─► Context API persiste no localStorage
   └─► Lista atualiza automaticamente
   ↓
5. Se NÃO:
   └─► Ação cancelada
```

---

### **Filtro por Período**

```
1. Usuário clica em botão de período (ex: "Este Mês")
   ↓
2. setPeriodo('mes')
   ↓
3. useFinanceiroData detecta mudança de período
   ↓
4. Recalcula transacoesFiltradas
   ↓
5. Recalcula totalReceitas, totalDespesas, saldo, ticketMedio
   ↓
6. Cards atualizam automaticamente
   ↓
7. Se detalhamento aberto:
   └─► FinanceiroDetails recebe novas transações filtradas
```

---

### **Detalhamento de Card**

```
1. Usuário clica em um card (ex: "Entradas")
   ↓
2. handleCardClick('receita') é chamado
   ↓
3. setSelectedCard('receita')
   ↓
4. FinanceiroDetails renderiza condicionalmente
   ↓
5. getCardConfig() retorna configuração para 'receita'
   ↓
6. Header com estatísticas específicas
   ↓
7. Tabela com transações filtradas por tipo
   ↓
8. Usuário clica [X] para fechar
   ↓
9. handleCloseDetails()
   ↓
10. setSelectedCard(null)
   ↓
11. Detalhamento desaparece
```

---

## 🐛 BUGS CONHECIDOS E LIMITAÇÕES

### **Bugs Identificados:**

#### **1. Transações de Outros Salões Aparecem**
**Status:** 🔴 Bug
**Descrição:** Ao trocar de salão, transações do salão anterior podem aparecer momentaneamente
**Causa:** Delay na atualização do Context
**Solução:** Filtrar sempre por `salaoId` no componente
**Workaround:** 
```javascript
const transacoesSalao = transacoes.filter(t => t.salaoId === salaoAtual.id);
```

#### **2. Data em Formato Inconsistente**
**Status:** ⚠️ Limitação
**Descrição:** Datas armazenadas em DD/MM/AAAA dificultam ordenação
**Impacto:** Tabelas podem não ordenar corretamente por data
**Solução Futura:** Migrar para ISO 8601 (YYYY-MM-DD) internamente

#### **3. Valores Grandes Quebram Layout**
**Status:** 🟡 Cosmético
**Descrição:** Valores acima de R$ 999.999,99 quebram cards
**Solução Futura:** Formatação compacta (ex: R$ 1,5M)

---

### **Limitações Técnicas:**

#### **1. Sem Backup Automático**
**Problema:** Dados apenas no localStorage
**Impacto:** 
- Limpar cache = perder todos os dados
- Sem acesso de outros dispositivos
- Sem sincronização em tempo real

**Solução Futura:** Backend com API REST

---

#### **2. Performance com Muitas Transações**
**Problema:** Re-cálculos em cada render
**Impacto:** Lentidão com 1000+ transações
**Solução:** 
- Virtualização de listas
- Paginação
- Cache de cálculos

---

#### **3. Sem Relatórios Avançados**
**Problema:** Apenas visualização básica
**Faltando:**
- Gráficos de fluxo de caixa
- Comparativos mês a mês
- Projeções futuras
- Exportação Excel/PDF

**Status:** 📋 Planejado (dados já calculados no hook)

---

#### **4. Sem Sistema de Recorrência**
**Problema:** Despesas fixas devem ser cadastradas manualmente todo mês
**Impacto:** Trabalho repetitivo (aluguel, contas, etc)
**Solução Planejada:** Sistema de despesas fixas (mencionado no readme antigo)
**Status:** 🔴 Não implementado

---

## 🚀 ROADMAP DE MELHORIAS

### **PRIORIDADE ALTA** 🔴

#### **1. Gráficos Visuais**
**Descrição:** Implementar FinanceiroCharts.jsx
**Benefício:** Visualização clara de tendências
**Dados:** Já calculados em `useFinanceiroData`

**Gráficos Planejados:**
- 📊 Fluxo de Caixa (últimos 6 meses)
- 🥧 Distribuição de Despesas por Categoria
- 📈 Evolução do Saldo ao longo do tempo

**Bibliotecas Sugeridas:**
- Recharts (já disponível no projeto)
- Chart.js

---

#### **2. Sistema de Contas a Pagar/Receber**
**Descrição:** Criar ContasPagarReceber.jsx
**Benefício:** Gestão de pendências

**Funcionalidades:**
- Lista de transações pendentes
- Alertas de vencimento próximo
- Marcar como pago com um clique
- Ordenação por urgência

---

#### **3. Filtros Avançados na UI**
**Descrição:** Expor FinanceiroFilters.jsx
**Status:** Hook existe, falta UI
**Benefício:** Busca refinada

**Filtros:**
- 🔍 Busca textual
- 📅 Intervalo de datas
- 🏷️ Categoria
- ✅ Status
- 💳 Forma de pagamento

---

#### **4. Exportação de Dados**
**Descrição:** Gerar relatórios em Excel/PDF
**Benefício:** Compartilhamento e arquivo

**Formatos:**
- Excel (.xlsx) - tabela completa
- PDF - relatório formatado
- CSV - dados brutos

---

#### **5. Sistema de Despesas Fixas**
**Descrição:** Cadastrar despesas recorrentes
**Benefício:** Automação de despesas mensais

**Funcionalidades:**
- Cadastro de despesa fixa (nome, valor, dia vencimento)
- Geração automática no mês atual
- Pausar/reativar despesa
- Editar valores sem afetar histórico

**Exemplo:**
```javascript
{
  id: 1,
  nome: 'Aluguel',
  valor: 2000,
  diaVencimento: 5,
  ativo: true,
  categoria: 'Fixas'
}
```

---

### **PRIORIDADE MÉDIA** 🟡

#### **6. Indicador de Período Ativo**
**Descrição:** Criar PeriodoIndicator.jsx
**Benefício:** Clarity visual

**Exibição:**
```
┌────────────────────────────────┐
│ 📅 Visualizando: Este Mês     │
│    01/11/2024 até 30/11/2024  │
└────────────────────────────────┘
```

---

#### **7. Tabs de Visualização**
**Descrição:** Criar ViewModeTabs.jsx
**Benefício:** Organização de views

**Abas:**
1. 📊 Dashboard (atual)
2. 📋 Todas as Transações
3. ⏰ Contas Pendentes
4. 📈 Relatórios

---

#### **8. Parcelamento**
**Descrição:** Suporte a transações parceladas
**Benefício:** Realismo financeiro

**Funcionalidades:**
- Campo "Parcelas" no formulário
- Geração automática de N transações
- Visualização de parcelas relacionadas
- Edição/exclusão em lote

---

#### **9. Anexos de Comprovantes**
**Descrição:** Upload de imagens/PDFs
**Benefício:** Documentação

**Funcionalidades:**
- Upload de comprovante (max 5MB)
- Preview inline
- Download de anexo
- Múltiplos arquivos por transação

---

#### **10. Categorias Personalizadas**
**Descrição:** Permitir criar categorias customizadas
**Benefício:** Flexibilidade

**Funcionalidades:**
- CRUD de categorias
- Ícones e cores personalizadas
- Categorias padrão + customizadas
- Migração de transações antigas

---

### **PRIORIDADE BAIXA** 🟢

#### **11. Multi-Moeda**
**Descrição:** Suporte a outras moedas
**Benefício:** Internacionalização

#### **12. Comparativo com Metas**
**Descrição:** Definir metas e comparar com real
**Benefício:** Planejamento financeiro

#### **13. Integração Bancária**
**Descrição:** Importar extratos via Open Banking
**Benefício:** Automação total

#### **14. Notificações de Vencimento**
**Descrição:** Alertas por email/push
**Benefício:** Evitar atrasos

#### **15. Modo Escuro**
**Descrição:** Dark mode para o módulo
**Benefício:** Conforto visual

---

**Fluxo Principal:**
1. Usuário acessa módulo Financeiro
2. Sistema exibe dashboard com período "Este Mês" selecionado
3. Sistema exibe 4 cards de resumo
4. Usuário clica no botão [+] verde do card "Entradas"
5. Sistema abre modal "Nova Entrada"
6. Sistema preenche data atual automaticamente
7. Sistema define status "Pago" por padrão
8. Usuário preenche:
   - Descrição: "Corte + Escova"
   - Valor: R$ 120,00
   - Categoria: "Serviços"
   - Forma de Pagamento: "Pix"
   - Cliente: (opcional) seleciona "Maria Santos"
9. Usuário clica "Registrar Entrada"
10. Sistema valida campos obrigatórios
11. Sistema cria transação com ID único
12. Sistema persiste no localStorage
13. Sistema fecha modal
14. Sistema atualiza cards:
    - Entradas: +R$ 120,00
    - Saldo: +R$ 120,00
    - Ticket Médio: recalcula
15. Sistema mantém período selecionado

**Pós-condições:**
- Transação salva e visível
- Cards atualizados
- Dados persistidos

**Fluxos Alternativos:**

**3a. Usuário esquece de preencher campo obrigatório**
- Sistema exibe alerta de validação HTML5
- Usuário preenche campo
- Continua no passo 9

**3b. Usuário cancela**
- Clica em "Cancelar" ou [X]
- Sistema fecha modal sem salvar
- Volta ao dashboard

---

### **Caso de Uso 2: Pagar Fornecedor**

**Ator:** Administrador

**Pré-condições:** 
- Salão com Plano Plus+
- Fornecedor já cadastrado

**Fluxo Principal:**
1. Usuário acessa módulo Financeiro
2. Usuário clica no botão [+] vermelho do card "Saídas"
3. Sistema abre modal "Nova Saída"
4. Usuário preenche:
   - Descrição: "Compra de produtos capilares"
   - Valor: R$ 850,00
   - Categoria: "Produtos"
   - Forma de Pagamento: "Transferência"
   - Fornecedor: seleciona "Distribuidora ABC"
   - Status: "Pago"
   - Observações: "10 shampoos + 5 condicionadores"
5. Usuário clica "Registrar Saída"
6. Sistema valida e salva
7. Sistema atualiza cards:
   - Saídas: +R$ 850,00
   - Saldo: recalcula (receitas - 850)

**Pós-condições:**
- Despesa registrada
- Vinculada ao fornecedor
- Histórico completo

---

### **Caso de Uso 3: Analisar Período Específico**

**Ator:** Administrador/Gerente

**Pré-condições:** Transações cadastradas em diferentes datas

**Fluxo Principal:**
1. Usuário acessa Financeiro
2. Sistema mostra período "Este Mês" por padrão
3. Usuário quer ver apenas hoje
4. Usuário clica em botão "Hoje"
5. Sistema recalcula:
   - Filtra transações do dia atual
   - Recalcula totalReceitas (apenas hoje)
   - Recalcula totalDespesas (apenas hoje)
   - Recalcula saldo
   - Recalcula ticket médio
6. Sistema atualiza cards instantaneamente
7. Usuário clica no card "Entradas" para ver detalhes
8. Sistema mostra apenas transações de receita de hoje
9. Usuário muda para "Esta Semana"
10. Sistema recalcula para últimos 7 dias
11. Detalhamento atualiza automaticamente

**Pós-condições:**
- Visão precisa do período
- Dados sempre sincronizados

---

### **Caso de Uso 4: Corrigir Valor Errado**

**Ator:** Administrador

**Pré-condições:** Transação com valor incorreto

**Fluxo Principal:**
1. Usuário identifica erro (ex: digitou R$ 80 em vez de R$ 180)
2. Usuário clica no card "Entradas"
3. Sistema abre detalhamento
4. Usuário localiza transação na tabela
5. Usuário clica no ícone [✏️]
6. Sistema abre modal com dados preenchidos
7. Usuário altera campo "Valor" de 80 para 180
8. Usuário clica "Salvar Alterações"
9. Sistema valida novo valor
10. Sistema atualiza transação (mantém mesmo ID)
11. Sistema fecha modal
12. Sistema recalcula cards:
    - Entradas: diferença de +R$ 100
    - Saldo: ajustado
13. Tabela mostra valor atualizado

**Pós-condições:**
- Valor corrigido
- Histórico mantido (mesmo ID)
- Cards refletem mudança

---

### **Caso de Uso 5: Remover Transação Duplicada**

**Ator:** Administrador

**Pré-condições:** Transação cadastrada em duplicidade

**Fluxo Principal:**
1. Usuário identifica duplicata
2. Usuário abre detalhamento do card correspondente
3. Usuário localiza transação duplicada
4. Usuário clica no ícone [🗑️]
5. Sistema exibe prompt: "Tem certeza que deseja excluir esta transação?"
6. Usuário confirma clicando "OK"
7. Sistema remove transação do array
8. Sistema persiste mudança no localStorage
9. Sistema remove linha da tabela (animação)
10. Sistema recalcula cards automaticamente
11. Sistema mantém detalhamento aberto

**Fluxo Alternativo:**

**6a. Usuário cancela**
- Clica "Cancelar" no prompt
- Sistema não faz nada
- Transação permanece

**Pós-condições:**
- Transação removida permanentemente
- Cards atualizados
- Dados persistidos

---

### **Caso de Uso 6: Visualizar Ticket Médio**

**Ator:** Gerente/Administrador

**Pré-condições:** Múltiplas receitas cadastradas

**Fluxo Principal:**
1. Usuário acessa Financeiro
2. Usuário observa card "Ticket Médio" (azul)
3. Card mostra: R$ 125,00
4. Usuário clica no card para entender cálculo
5. Sistema abre detalhamento "Ticket Médio - Análise"
6. Sistema exibe 3 stats:
   - Ticket Médio: R$ 125,00
   - Total Transações: 10 (receitas)
   - Receita Total: R$ 1.250,00
7. Sistema exibe tabela com todas as 10 receitas
8. Usuário verifica valores individuais
9. Usuário entende: 1.250 / 10 = 125

**Observações:**
- Apenas receitas PAGAS entram no cálculo
- Despesas não afetam ticket médio
- Pendentes não contam

---

## 📊 FÓRMULAS E CÁLCULOS

### **Total de Receitas**
```javascript
totalReceitas = transacoesFiltradas
  .filter(t => t.tipo === 'receita' && (t.status === 'recebido' || t.status === 'pago'))
  .reduce((acc, t) => acc + parseFloat(t.valor), 0);
```

**Critérios:**
- ✅ Tipo: 'receita'
- ✅ Status: 'recebido' OU 'pago'
- ✅ Dentro do período selecionado
- ❌ Status 'pendente' NÃO conta
- ❌ Status 'cancelado' NÃO conta

---

### **Total de Despesas**
```javascript
totalDespesas = transacoesFiltradas
  .filter(t => t.tipo === 'despesa' && (t.status === 'pago' || t.status === 'recebido'))
  .reduce((acc, t) => acc + parseFloat(t.valor), 0);
```

**Critérios:**
- ✅ Tipo: 'despesa'
- ✅ Status: 'pago' OU 'recebido'
- ✅ Dentro do período selecionado
- ❌ Status 'pendente' NÃO conta
- ❌ Status 'cancelado' NÃO conta

---

### **Saldo**
```javascript
saldo = totalReceitas - totalDespesas;
```

**Interpretação:**
- Positivo (≥ 0): Card roxo
- Negativo (< 0): Card vermelho
- Exibição: `R$ ${Math.abs(saldo).toFixed(2)}`

---

### **Ticket Médio**
```javascript
const receitasPagas = transacoesFiltradas.filter(t => 
  t.tipo === 'receita' && (t.status === 'recebido' || t.status === 'pago')
);

ticketMedio = receitasPagas.length > 0 
  ? totalReceitas / receitasPagas.length 
  : 0;
```

**Critérios:**
- ✅ Apenas receitas pagas
- ✅ Divisão pela quantidade de receitas
- ✅ Retorna 0 se não houver receitas
- ❌ Despesas NÃO entram no cálculo

**Exemplo:**
```
Receitas: R$ 100 + R$ 150 + R$ 200 = R$ 450
Quantidade: 3
Ticket Médio: 450 / 3 = R$ 150,00
```

---

### **Filtro por Período**

#### **Hoje (dia)**
```javascript
const hoje = new Date();
const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

// Transação no dia se:
dataTransacao >= inicioHoje
```

#### **Esta Semana (semana)**
```javascript
const hoje = new Date();
const inicioSemana = new Date(hoje);
inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // Domingo
inicioSemana.setHours(0, 0, 0, 0);

// Transação na semana se:
dataTransacao >= inicioSemana
```

#### **Este Mês (mes)**
```javascript
const hoje = new Date();
const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

// Transação no mês se:
dataTransacao >= inicioMes
```

#### **Este Ano (ano)**
```javascript
const hoje = new Date();
const inicioAno = new Date(hoje.getFullYear(), 0, 1);

// Transação no ano se:
dataTransacao >= inicioAno
```

---

### **Conversão de Data**

**DD/MM/AAAA → Date:**
```javascript
// Transação: "21/11/2024"
const dateToISO = (dateStr) => {
  const [dia, mes, ano] = dateStr.split('/');
  return `${ano}-${mes}-${dia}`; // "2024-11-21"
};

const dataTransacao = new Date(dateToISO(t.data).split('-').join('/'));
// Date object: 2024/11/21
```

---

## 💡 BOAS PRÁTICAS IMPLEMENTADAS

### **1. Separação de Responsabilidades**
- ✅ Página principal orquestra tudo
- ✅ Hooks isolam lógica de negócio
- ✅ Componentes focados em UI
- ✅ Context gerencia estado global

### **2. Performance**
- ✅ useMemo para cálculos pesados
- ✅ Debounce em persistência (300ms)
- ✅ Filtros calculados uma vez por mudança
- ✅ Re-renders minimizados

### **3. Experiência do Usuário**
- ✅ Feedback visual imediato
- ✅ Cores intuitivas (verde/vermelho)
- ✅ Animações suaves
- ✅ Confirmação em ações destrutivas
- ✅ Botões de ação rápida (+)

### **4. Validações**
- ✅ Acesso por plano (Plus+)
- ✅ Campos obrigatórios
- ✅ Valores positivos
- ✅ Datas válidas
- ✅ HTML5 validation

### **5. Manutenibilidade**
- ✅ Código modular
- ✅ Nomes descritivos
- ✅ Comentários em pontos críticos
- ✅ Padrões consistentes
- ✅ Documentação completa

---

## 🔧 TROUBLESHOOTING

### **Problema: Cards não atualizam após criar transação**

**Sintomas:**
- Modal fecha
- Transação não aparece
- Cards mantêm valores antigos

**Possíveis Causas:**
1. Context não está atualizando
2. salaoId incorreto
3. Período filtrado não inclui data da transação

**Soluções:**
```javascript
// 1. Verificar se setTransacoes está funcionando
console.log('Transações antes:', transacoes);
setTransacoes([...transacoes, novaTransacao]);
console.log('Transações depois:', transacoes);

// 2. Verificar salaoId
console.log('salaoAtual.id:', salaoAtual.id);
console.log('formData.salaoId:', formData.salaoId);

// 3. Verificar data da transação
console.log('Data transação:', formData.data);
console.log('Período:', periodo);
```

---

### **Problema: Tipo da transação errado no modal**

**Sintomas:**
- Clica em [+] verde mas modal abre como "Despesa"
- Ou vice-versa

**Causa:**
- formData não foi setado antes de chamar handleOpenModal

**Solução:**
```javascript
// ✅ CORRETO
const handleAddReceita = () => {
  setFormData({ tipo: 'receita', ... }); // ANTES
  handleOpenModal();                      // DEPOIS
};

// ❌ ERRADO
const handleAddReceita = () => {
  handleOpenModal();                      // Modal abre
  setFormData({ tipo: 'receita', ... }); // Tarde demais
};
```

---

### **Problema: Saldo não bate**

**Sintomas:**
- Saldo mostra valor diferente do esperado
- Cards não somam corretamente

**Verificações:**
```javascript
// 1. Verificar status das transações
console.log('Receitas pagas:', transacoesFiltradas.filter(t => 
  t.tipo === 'receita' && (t.status === 'recebido' || t.status === 'pago')
));

// 2. Verificar se há pendentes sendo contadas
console.log('Pendentes (não devem contar):', transacoesFiltradas.filter(t => 
  t.status === 'pendente'
));

// 3. Recalcular manualmente
const manualReceitas = transacoesFiltradas
  .filter(t => t.tipo === 'receita' && t.status !== 'pendente')
  .reduce((a, t) => a + t.valor, 0);
console.log('Receitas manual:', manualReceitas);
```

---

### **Problema: Transações de outro salão aparecem**

**Sintomas:**
- Ao trocar de salão, transações antigas aparecem

**Causa:**
- Delay na atualização do Context
- Filtro não aplicado

**Solução:**
```javascript
// Sempre filtrar por salaoId no componente
const transacoesSalao = useMemo(() => {
  return transacoes.filter(t => t.salaoId === salaoAtual?.id);
}, [transacoes, salaoAtual?.id]);
```

---

### **Problema: Detalhamento não abre**

**Sintomas:**
- Clica no card mas nada acontece
- selectedCard permanece null

**Verificações:**
```javascript
// 1. Verificar onClick no card
<div onClick={() => onCardClick('receita')}>

// 2. Verificar propagation do botão +
<button onClick={(e) => {
  e.stopPropagation(); // CRÍTICO
  onAddClick();
}}>

// 3. Verificar estado
console.log('selectedCard:', selectedCard);
```

---

## 📚 GLOSSÁRIO

**Transação:** Qualquer movimentação financeira (entrada ou saída)

**Receita/Entrada:** Dinheiro que entra no salão (serviços, vendas)

**Despesa/Saída:** Dinheiro que sai do salão (compras, contas)

**Saldo:** Diferença entre receitas e despesas (receitas - despesas)

**Ticket Médio:** Valor médio por transação de receita

**Período:** Intervalo de tempo para filtro (dia, semana, mês, ano)

**Status Pago:** Transação efetivada (dinheiro entrou/saiu)

**Status Pendente:** Transação agendada mas não efetivada

**Status Recebido:** Sinônimo de "pago" para receitas

**Status Cancelado:** Transação que não será efetivada

**Card:** Cartão clicável de resumo financeiro

**Detalhamento:** Visão expandida de um card específico

**Modal:** Janela sobreposta para cadastro/edição

**Hook:** Função React que encapsula lógica reutilizável

**Context:** Sistema de estado global do React

**localStorage:** Armazenamento local do navegador

---

## 🎓 CONSIDERAÇÕES FINAIS

### **Pontos Fortes do Módulo:**

✅ **Simplicidade de Uso**
- Interface intuitiva
- Fluxo natural
- Botões de ação rápida
- Poucos cliques para cadastrar

✅ **Arquitetura Limpa**
- Hooks bem definidos
- Componentes modulares
- Separação de concerns
- Fácil manutenção

✅ **Performance Adequada**
- useMemo em cálculos
- Re-renders otimizados
- Debounce em persistência

✅ **Validações Sólidas**
- Acesso por plano
- Campos obrigatórios
- Valores positivos
- Datas válidas

---

### **Oportunidades de Melhoria:**

🟡 **Visualização de Dados**
- Implementar gráficos (dados já calculados)
- Dashboard mais rico
- Comparativos visuais

🟡 **Gestão de Pendências**
- Contas a pagar/receber
- Alertas de vencimento
- Marcar como pago rápido

🟡 **Automação**
- Despesas fixas mensais
- Parcelamento automático
- Importação de extratos

🟡 **Relatórios**
- Exportação Excel/PDF
- Filtros avançados na UI
- Análises personalizadas

---

### **Quando Usar Este Módulo:**

✅ **Ideal para:**
- Salões pequenos e médios
- Controle financeiro básico
- Registros rápidos
- Visão consolidada

⚠️ **Limitado para:**
- Salões com centenas de transações/dia
- Necessidade de contabilidade complexa
- Múltiplas formas de pagamento parceladas
- Integração com sistemas bancários

---

### **Evolução Recomendada:**

**Curto Prazo (1-3 meses):**
1. Implementar gráficos visuais
2. Adicionar filtros avançados na UI
3. Criar sistema de contas pendentes

**Médio Prazo (3-6 meses):**
4. Sistema de despesas fixas
5. Parcelamento automático
6. Exportação de relatórios
7. Backend com API

**Longo Prazo (6-12 meses):**
8. Integração bancária (Open Banking)
9. App mobile
10. Projeções e metas
11. IA para insights financeiros

---

## 📞 SUPORTE E MANUTENÇÃO

### **Checklist de Manutenção:**

**Mensal:**
- [ ] Verificar erros no console
- [ ] Testar fluxos críticos
- [ ] Revisar performance com muitas transações
- [ ] Verificar tamanho do localStorage

**Trimestral:**
- [ ] Atualizar dependências do React
- [ ] Revisar feedback de usuários
- [ ] Otimizar cálculos se necessário
- [ ] Adicionar melhorias incrementais

**Anual:**
- [ ] Avaliar migração para backend
- [ ] Revisar arquitetura
- [ ] Planejar features maiores
- [ ] Atualizar documentação

---

### **Quando Adicionar Nova Funcionalidade:**

1. ✅ Documentar no README
2. ✅ Adicionar ao roadmap
3. ✅ Criar caso de uso
4. ✅ Implementar validações
5. ✅ Adicionar testes manuais
6. ✅ Atualizar glossário se necessário
7. ✅ Comunicar aos usuários

---

## 📝 CHANGELOG

### **Versão Atual (v1.0.0)**

**Funcionalidades Implementadas:**
- ✅ Dashboard com 4 cards clicáveis
- ✅ Filtros por período (dia, semana, mês, ano)
- ✅ Detalhamento por card
- ✅ Botões de ação rápida (+)
- ✅ Formulário simplificado
- ✅ CRUD completo de transações
- ✅ Validação por plano (Plus+)
- ✅ Persistência em localStorage
- ✅ Cálculos automáticos (totais, saldo, ticket médio)
- ✅ Badges de status coloridos
- ✅ Identificação de vencidas
- ✅ Vincular cliente/fornecedor

**Bugs Corrigidos:**
- ✅ Tipo de transação agora é setado ANTES de abrir modal
- ✅ Saldo considera apenas transações pagas/recebidas
- ✅ Filtros por período funcionando corretamente
- ✅ Cards atualizam automaticamente após CRUD

**Melhorias de UX:**
- ✅ Banner explicativo dos botões +
- ✅ Cores intuitivas (verde/vermelho/roxo/azul)
- ✅ Animações em hover
- ✅ Confirmação em exclusões
- ✅ Mensagem de orientação nos cards

---
