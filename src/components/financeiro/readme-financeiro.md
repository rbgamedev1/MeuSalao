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

# 🎯 Módulo Financeiro - Versão Simplificada e Inteligente

## 📋 Problemas Resolvidos

### 1. ✅ Formulário de Transação Simplificado
**Antes:** Formulário complexo com muitos campos opcionais confusos
**Agora:** Formulário limpo e direto ao ponto

- ✅ Apenas campos essenciais
- ✅ Tipo visual (botões grandes verde/vermelho)
- ✅ Removida complexidade de recorrência
- ✅ Status padrão "Pago" para agilizar cadastro
- ✅ Campos contextuais (cliente/fornecedor baseado no tipo)

### 2. ✅ Despesas Fixas Mensais
**Problema:** Cadastrar 12x "Aluguel R$ 2.000" poluía o sistema
**Solução:** Sistema de Despesas Fixas

**Funcionalidades:**
- 📅 Cadastro único de despesas recorrentes
- 🔄 Geração automática no mês atual
- ⏸️ Pausar sem excluir
- 🏢 10 tipos pré-definidos (Aluguel, Água, Luz, etc)
- 💰 Resumo mensal automático

**Tipos Disponíveis:**
- 🏢 Aluguel
- 💧 Água
- ⚡ Energia
- 📞 Telefone/Internet
- 💰 Salários
- 📊 Contador
- 🛡️ Seguro
- 💻 Assinatura/Software
- 🧹 Limpeza
- 📝 Outros (personalizável)

### 3. ✅ Cálculo Realista de Saldo
**Problema:** Saldo considerava parcelas futuras (ex: 12 meses de aluguel)
**Solução:** 

- ✅ Saldo considera APENAS transações pagas/recebidas
- ✅ Despesas fixas aparecem apenas no mês atual
- ✅ Contas pendentes não afetam o saldo real
- ✅ Fluxo de caixa mostra apenas valores efetivados

### 4. ✅ Interface em 3 Abas

#### Tab 1: Transações
- Lista todas as transações realizadas
- Filtros por tipo, categoria, status, data
- Ações rápidas (editar, excluir)

#### Tab 2: Contas a Pagar/Receber
- Visualização de pendências
- Organizado por urgência (vencidas, hoje, próximas)
- Marcar como pago com um clique
- Resumo visual de valores

#### Tab 3: Despesas Fixas
- Gerenciamento de despesas mensais recorrentes
- Card visual de cada despesa
- Total mensal destacado
- Pausar/reativar despesas
- Editar valores e datas de vencimento

## 🔧 Estrutura de Arquivos Criados/Modificados

```
src/
├── hooks/
│   ├── useFinanceiroData.js          # ✅ Atualizado - considera despesas fixas
│   ├── useTransacaoForm.js           # ✅ Simplificado - removida recorrência
│   └── useDespesasFixas.js           # 🆕 NOVO - lógica de despesas fixas
│
├── components/financeiro/
│   ├── TransacaoModal.jsx            # ✅ Simplificado - formulário limpo
│   ├── ViewModeTabs.jsx              # ✅ Atualizado - 3 abas
│   ├── DespesasFixasList.jsx         # 🆕 NOVO - lista de despesas fixas
│   └── DespesasFixasModal.jsx        # 🆕 NOVO - formulário de despesas fixas
│
└── pages/
    └── Financeiro.jsx                # ✅ Atualizado - orquestra tudo
```

## 💡 Como Usar

### Cadastrar Transação Rápida
1. Clique em "Nova Transação"
2. Escolha tipo (Receita/Despesa)
3. Informe descrição e valor
4. Selecione categoria e forma de pagamento
5. Status padrão já é "Pago" - salve!

### Cadastrar Despesa Fixa
1. Vá na aba "Despesas Fixas"
2. Clique em "Nova Despesa Fixa"
3. Escolha o tipo (ex: Aluguel)
4. Valor mensal e dia de vencimento
5. Sistema gera automaticamente todo mês!

### Gerenciar Contas a Pagar
1. Vá na aba "Contas a Pagar/Receber"
2. Veja resumo: vencidas, hoje, próximas
3. Clique em ✅ para marcar como pago
4. Ou edite detalhes clicando no ícone

## 🎨 Benefícios da Nova Versão

### Para o Usuário
✅ Menos cliques para registrar transações
✅ Não precisa cadastrar aluguel todo mês
✅ Saldo sempre correto e realista
✅ Visão clara de pendências
✅ Interface mais limpa e objetiva

### Para o Sistema
✅ Menos dados duplicados
✅ Cálculos mais precisos
✅ Performance melhorada
✅ Lógica mais simples de manter
✅ Escalável para novos recursos

## 📊 Exemplo de Uso Real

### Cenário: Salão de Beleza "Glamour"

**Despesas Fixas Cadastradas:**
- 🏢 Aluguel: R$ 2.000 (dia 5)
- 💧 Água: R$ 150 (dia 10)
- ⚡ Energia: R$ 450 (dia 15)
- 📞 Internet: R$ 120 (dia 20)
- **Total Mensal: R$ 2.720**

**Transações do Dia:**
- ✅ Receita: Corte + Escova - R$ 120 (Pago em Pix)
- ✅ Despesa: Compra de shampoos - R$ 350 (Cartão)

**Dashboard mostra:**
- 💰 Receitas do Mês: R$ 8.450
- 💸 Despesas do Mês: R$ 5.170 (inclui despesas fixas)
- 💵 Saldo Real: R$ 3.280
- 📊 Contas Pendentes: 2 (Água e Energia)

## 🚀 Próximos Passos Possíveis

1. **Notificações**
   - Avisar 2 dias antes do vencimento
   - Lembrete de despesas fixas não pagas

2. **Relatórios**
   - Exportar para Excel/PDF
   - Comparativo mês a mês
   - Projeção de gastos

3. **Integrações**
   - Importar extratos bancários
   - Integração com nota fiscal eletrônica

4. **Análises Avançadas**
   - Tendências de gastos
   - Sugestões de economia
   - Previsão de fluxo de caixa

## 🔐 Dados Salvos

- **Transações:** Context API + localStorage
- **Despesas Fixas:** localStorage separado
- **Filtros:** Estado do componente (não persistente)

## ⚠️ Importante

- Despesas fixas são geradas automaticamente no mês atual
- Transações antigas não são afetadas
- Editar despesa fixa afeta apenas cadastro (não transações já geradas)
- Pausar despesa fixa impede geração futura (não remove transações existentes)