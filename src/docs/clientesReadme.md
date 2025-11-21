# 👥 MÓDULO CLIENTES - DOCUMENTAÇÃO COMPLETA

## 🎯 VISÃO GERAL

O Módulo Clientes é o sistema central de gerenciamento de relacionamento com clientes (CRM) do sistema de gestão de salões de beleza. Ele oferece uma visão 360° de cada cliente, incluindo dados pessoais, histórico de agendamentos, compras, prontuários de atendimento (com foco especial em Terapia Capilar) e comunicações via email.

### Características Principais
- Listagem completa de clientes com busca e filtros
- Página dedicada com 5 abas de informações
- Prontuário capilar completo com 3 tipos de atendimento
- Histórico de agendamentos e transações financeiras
- Upload de fotos do cliente
- Rastreamento de emails enviados
- Validações baseadas em planos
- Estatísticas financeiras detalhadas

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── pages/
│   ├── Clientes.jsx                               # Listagem principal de clientes
│   └── ClienteDetalhesPage.jsx                    # Página dedicada com abas
│
├── components/clientes/
│   ├── AvaliacaoModal.jsx                         # Modal de avaliação (não usado atualmente)
│   ├── ImageUploader.jsx                          # Componente de upload de imagens
│   ├── ProntuarioForm.jsx                         # Formulário de sessão simples
│   ├── ProntuarioTab.jsx                          # Aba de prontuário (principal)
│   │
│   ├── detalhes/
│   │   ├── ClienteHeader.jsx                      # Header com foto e nome
│   │   ├── ClienteStats.jsx                       # Cards de estatísticas
│   │   ├── ClienteTabs.jsx                        # Sistema de navegação de abas
│   │   ├── ClienteInfoTab.jsx                     # Aba: Informações pessoais
│   │   ├── ClienteAgendamentosTab.jsx             # Aba: Histórico de agendamentos
│   │   ├── ClienteCaixaTab.jsx                    # Aba: Histórico de compras
│   │   └── ClienteEmailsTab.jsx                   # Aba: Emails enviados
│   │
│   └── prontuario/
│       ├── ProntuarioCard.jsx                     # Card de sessão simples
│       ├── TerapiaCard.jsx                        # Card de terapia capilar
│       ├── TerapiaDetalhesModal.jsx               # Modal de visualização de terapia
│       └── TipoSelectorModal.jsx                  # Modal de seleção de tipo
│
├── components/terapiaCapilar/
│   ├── FormularioAvaliacaoInicial.jsx             # Etapa 1: Anamnese
│   ├── FormularioSelecaoTratamento.jsx            # Etapa 2: Plano
│   ├── FormularioAplicacaoTratamento.jsx          # Etapa 3: Aplicação
│   └── FormularioFinalizacao.jsx                  # Etapa 4: Finalização
│
├── hooks/
│   ├── useClienteData.js                          # Hook para dados do cliente
│   ├── useEmailHistorico.js                       # Gerenciamento de emails
│   └── useCaixa.js                                # Hook do módulo caixa (referência)
│
├── contexts/
│   └── SalaoContext.jsx                           # Estado global da aplicação
│
└── utils/
    ├── masks.js                                    # Funções de máscaras e validações
    └── planRestrictions.js                        # Restrições por plano
```

---

## 🗺️ FLUXO DE NAVEGAÇÃO

### Jornada do Usuário:

```
Página Clientes (Lista)
    ↓
    👁️ Clique em "Ver Detalhes"
    ↓
ClienteDetalhesPage (/clientes/:id)
    ├── Aba: Informações
    ├── Aba: Agendamentos
    ├── Aba: Caixa (Vendas)
    ├── Aba: Prontuário
    │   ├── Sessão Simples
    │   ├── Terapia Capilar (4 etapas)
    │   └── Mega Hair (futuro)
    └── Aba: Emails
```

---

## 🔧 DETALHAMENTO DOS ARQUIVOS

### **PÁGINAS PRINCIPAIS**

#### **1. Clientes.jsx** (Listagem)
**Caminho:** `src/pages/Clientes.jsx`

**Responsabilidades:**
- Listar todos os clientes do salão atual
- Sistema de busca em tempo real
- Filtros por status (ativo/inativo)
- Validar limites do plano antes de adicionar
- CRUD completo de clientes
- Navegação para página de detalhes

**Estados Principais:**
```javascript
- searchTerm: string              // Termo de busca
- showModal: boolean              // Modal de cadastro/edição
- editingId: number | null        // ID do cliente sendo editado
- formData: {
    nome: string,
    telefone: string,              // Máscara (11) 91111-1111
    email: string,
    dataNascimento: string,        // DD/MM/AAAA
    status: 'ativo' | 'inativo'
  }
```

**Estrutura de Cliente:**
```javascript
{
  id: number,
  salaoId: number,
  nome: string,
  telefone: string,
  email: string,
  dataNascimento: string,          // DD/MM/AAAA
  status: 'ativo' | 'inativo',
  ultimaVisita: string,            // DD/MM/AAAA
  totalGasto: number,
  visitas: number,
  foto: string | null,             // Base64 da imagem
  observacoes: string              // Opcional
}
```

**Validações:**
- Nome obrigatório
- Telefone obrigatório (15 caracteres com máscara)
- Email obrigatório (regex: contém @)
- Data de nascimento obrigatória (formato DD/MM/AAAA)
- Limite de clientes por plano

**Funcionalidades:**
- ✅ Cards de estatísticas (total, ativos, novos, ticket médio)
- ✅ Busca por nome, telefone ou email
- ✅ Avatar colorido gerado (primeira letra do nome)
- ✅ Ações rápidas (ver, editar, excluir)
- ✅ Alerta de limite de plano atingido
- ✅ Navegação para detalhes com `navigate(\`/clientes/${id}\`)`

---

#### **2. ClienteDetalhesPage.jsx** (Página Dedicada)
**Caminho:** `src/pages/ClienteDetalhesPage.jsx`

**Responsabilidades:**
- Página completa com informações detalhadas do cliente
- Sistema de 5 abas navegáveis
- Atualização de foto do cliente
- Gerenciamento de prontuários
- Exibição de estatísticas consolidadas

**Props via useParams:**
```javascript
{ id: string }  // ID do cliente na URL
```

**Estados:**
```javascript
- abaAtiva: 'info' | 'agendamentos' | 'caixa' | 'prontuario' | 'emails'
```

**Dados Carregados:**
```javascript
const {
  agendamentosCliente,     // Agendamentos filtrados
  comprasCliente,          // Transações de caixa filtradas
  emailsCliente,           // Emails enviados filtrados
  stats                    // Estatísticas calculadas
} = useClienteData(cliente);
```

**Funcionalidades:**
- ✅ Header unificado (botão voltar + foto + dados)
- ✅ Cards de estatísticas globais
- ✅ Sistema de abas com contadores
- ✅ Atualização de foto com preview
- ✅ Gerenciamento completo de prontuários
- ✅ Navegação fluida entre abas

**Handlers de Prontuário:**
```javascript
handleAddProntuario(dadosProntuario)    // Criar novo
handleEditProntuario(id, dados)         // Editar existente
handleDeleteProntuario(id)              // Excluir
```

---

### **COMPONENTES DE INTERFACE (detalhes/)**

#### **3. ClienteHeader.jsx**
**Caminho:** `src/components/clientes/detalhes/ClienteHeader.jsx`

**Responsabilidades:**
- Exibir foto do cliente com opções de edição
- Mostrar nome, email e telefone
- Upload de nova foto
- Remover foto existente

**Props:**
```javascript
{
  cliente: object,              // Dados do cliente
  onUpdateCliente: function     // Callback de atualização
}
```

**Funcionalidades:**
- ✅ Avatar circular (foto ou inicial)
- ✅ Hover revela botões de edição
- ✅ Upload de imagem (max 5MB)
- ✅ Preview instantâneo
- ✅ Confirmação antes de remover
- ✅ Base64 salvo no cliente

---

#### **4. ClienteStats.jsx**
**Caminho:** `src/components/clientes/detalhes/ClienteStats.jsx`

**Responsabilidades:**
- Exibir estatísticas consolidadas em cards

**Props:**
```javascript
{
  stats: {
    totalAgendamentos: number,
    agendamentosConcluidos: number,
    totalGeral: number,          // Agendamentos + Compras
    ticketMedio: number
  }
}
```

**Layout:**
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Total Agend.    │ Concluídos      │ Total Gasto     │ Ticket Médio    │
│    Purple       │    Green        │    Blue         │    Pink         │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

#### **5. ClienteTabs.jsx**
**Caminho:** `src/components/clientes/detalhes/ClienteTabs.jsx`

**Responsabilidades:**
- Renderizar sistema de abas com contadores
- Indicar aba ativa
- Permitir navegação

**Props:**
```javascript
{
  abaAtiva: string,
  setAbaAtiva: function,
  counts: {
    agendamentos: number,
    caixa: number,
    prontuario: number,
    emails: number
  }
}
```

**Abas:**
1. 👤 **Informações** - Dados pessoais
2. 📅 **Agendamentos (N)** - Histórico de agendamentos
3. 🛒 **Caixa (N)** - Vendas e compras
4. 📋 **Prontuário (N)** - Sessões e terapias
5. 📧 **Emails (N)** - Histórico de comunicações

---

#### **6. ClienteInfoTab.jsx**
**Caminho:** `src/components/clientes/detalhes/ClienteInfoTab.jsx`

**Responsabilidades:**
- Exibir informações pessoais formatadas
- Status do cliente

**Props:**
```javascript
{ cliente: object }
```

**Informações Exibidas:**
- 📱 Telefone
- 📧 Email
- 🎂 Data de Nascimento
- 📊 Status (Ativo/Inativo)
- 🕐 Última Visita
- 📝 Observações (se houver)

---

#### **7. ClienteAgendamentosTab.jsx**
**Caminho:** `src/components/clientes/detalhes/ClienteAgendamentosTab.jsx`

**Responsabilidades:**
- Listar agendamentos do cliente
- Exibir status com ícones e cores
- Buscar serviço e profissional corretamente

**Props:**
```javascript
{
  agendamentos: array,
  servicos: array,          // Para buscar nome do serviço
  profissionais: array      // Para buscar nome do profissional
}
```

**Estrutura de Agendamento:**
```javascript
{
  id: number,
  clienteId: number,
  servicoId: number,         // Ou servico: object
  profissionalId: number,    // Ou profissional: object
  data: string,              // DD/MM/AAAA
  horario: string,           // HH:MM
  status: 'confirmado' | 'concluido' | 'cancelado' | 'pendente'
}
```

**Funcionalidades:**
- ✅ Busca múltipla de serviço (por ID, objeto ou nome)
- ✅ Busca múltipla de profissional (por ID, objeto ou nome)
- ✅ Status coloridos (verde, azul, vermelho, amarelo)
- ✅ Exibição de valor, duração e data
- ✅ Cards clicáveis com hover

---

#### **8. ClienteCaixaTab.jsx**
**Caminho:** `src/components/clientes/detalhes/ClienteCaixaTab.jsx`

**Responsabilidades:**
- Listar vendas do caixa para o cliente
- Exibir estatísticas financeiras
- Identificar tipo de venda (serviço/produto)

**Props:**
```javascript
{
  compras: array,
  stats: object
}
```

**Estrutura de Transação:**
```javascript
{
  id: number,
  clienteId: number,         // ID do cliente
  cliente: string,           // Nome do cliente
  clienteNome: string,       // Redundância
  tipo: 'receita',
  categoria: 'Serviços' | 'Venda de Produtos',
  descricao: string,
  valor: number,
  formaPagamento: string,
  data: string,              // DD/MM/AAAA
  status: 'recebido',
  observacoes: string        // Detalhes dos itens
}
```

**Lógica de Identificação:**
```javascript
// Verifica múltiplos campos para determinar tipo
- categoria === 'Serviços' → Ícone ✂️
- categoria === 'Venda de Produtos' → Ícone 📦
- descricao.includes('serviço') → Ícone ✂️
- descricao.includes('produto') → Ícone 📦
```

**Estatísticas Exibidas:**
- Total em Agendamentos
- Total em Vendas Caixa
- Agendamentos Cancelados
- **Total Geral** (soma de tudo)

**Funcionalidades:**
- ✅ Cards coloridos por tipo
- ✅ Filtro inteligente (clienteId, cliente, clienteNome)
- ✅ Aceita tipo 'receita' ou 'entrada'
- ✅ Console logs para debug
- ✅ Fallbacks seguros para dados incompletos

---

#### **9. ClienteEmailsTab.jsx**
**Caminho:** `src/components/clientes/detalhes/ClienteEmailsTab.jsx`

**Responsabilidades:**
- Listar emails enviados ao cliente
- Exibir tipo, status e data

**Props:**
```javascript
{ emails: array }
```

**Estrutura de Email:**
```javascript
{
  id: string,
  clienteId: number,
  clienteEmail: string,
  tipo: 'confirmacao' | 'cancelamento' | 'alteracao' | 'avaliacao' | 'aniversario',
  assunto: string,
  status: 'enviado' | 'falhado' | 'pendente' | 'entregue',
  dataEnvio: string,         // ISO Date
  agendamentoId: number,     // Opcional
  erro: string               // Se houver
}
```

**Tipos de Email:**
- ✅ Confirmação (verde)
- ✅ Cancelamento (vermelho)
- ✅ Alteração (laranja)
- ✅ Avaliação (roxo)
- 🎂 Aniversário (rosa)

**Funcionalidades:**
- ✅ Ícones e cores por tipo
- ✅ Badges de status
- ✅ Link para agendamento relacionado
- ✅ Exibição de erro (se houver)
- ✅ Ordenação por data (mais recente primeiro)

---

### **COMPONENTES DE PRONTUÁRIO**

#### **10. ProntuarioTab.jsx** (Principal)
**Caminho:** `src/components/clientes/ProntuarioTab.jsx`

**Responsabilidades:**
- Gerenciar 3 tipos de atendimento
- Listar prontuários agrupados por tipo
- Controlar modais e etapas
- Estatísticas de prontuários

**Props:**
```javascript
{
  clienteId: number,
  prontuarios: array,
  produtos: array,
  onAddProntuario: function,
  onEditProntuario: function,
  onDeleteProntuario: function
}
```

**Tipos de Atendimento:**
1. **📋 Sessão Simples** (`normal`)
   - Diagnóstico + Tratamento
   - Produtos utilizados
   - Imagens (tricoscopia, antes/depois)
   
2. **🌸 Terapia Capilar** (`terapia_capilar`)
   - 4 etapas sequenciais
   - Formulários especializados
   - Múltiplas imagens por etapa
   
3. **💇‍♀️ Mega Hair** (`mega_hair`) - FUTURO
   - Confecção, aplicação, manutenção

**Estados:**
```javascript
- tipoSelecionado: 'normal' | 'terapia_capilar' | 'mega_hair' | null
- showListaTerapia: boolean
- terapiaAtual: object | null
- etapaAtiva: 'avaliacao' | 'selecao' | 'aplicacao' | 'finalizacao' | null
- viewDetalhes: object | null
```

**Estrutura de Prontuário Normal:**
```javascript
{
  id: number,
  clienteId: number,
  salaoId: number,
  tipo: 'normal',
  data: string,              // DD/MM/AAAA
  hora: string,              // HH:MM
  diagnostico: string,
  tratamento: string,
  produtosUsados: number[],  // IDs dos produtos
  observacoes: string,
  proximaSessao: string,     // DD/MM/AAAA
  imagens: {
    tricoscopia: string[],   // Base64 images
    anteDepois: string[]
  }
}
```

**Estrutura de Prontuário de Terapia:**
```javascript
{
  id: number,
  clienteId: number,
  salaoId: number,
  tipo: 'terapia_capilar',
  data: string,
  hora: string,
  etapasCompletas: string[], // ['avaliacao', 'selecao', ...]
  dadosTerapiaCapilar: {
    // Dados de todas as 4 etapas
    // Ver seção Terapia Capilar
  }
}
```

**Estatísticas:**
- Total de Registros
- Terapias Capilares (🌸)
- Mega Hair (💇‍♀️)
- Última Sessão

**Funcionalidades:**
- ✅ Modal de seleção de tipo
- ✅ Listagem agrupada por tipo
- ✅ Cards visuais diferenciados
- ✅ Edição de qualquer tipo
- ✅ Exclusão com confirmação
- ✅ Modal de detalhes para terapia
- ✅ Preview de imagens com zoom

---

#### **11. TipoSelectorModal.jsx**
**Caminho:** `src/components/clientes/prontuario/TipoSelectorModal.jsx`

**Responsabilidades:**
- Modal de seleção inicial
- Apresentar os 3 tipos disponíveis

**Props:**
```javascript
{
  onSelect: function,    // Callback com tipo selecionado
  onClose: function
}
```

**Layout:**
```
┌─────────────────────────────────────────┐
│  Selecione o Tipo de Atendimento       │
├─────────────────┬───────────────────────┤
│   🌸            │      💇‍♀️             │
│ Terapia Capilar │    Mega Hair         │
│ (4 etapas)      │  (confecção...)      │
├─────────────────┴───────────────────────┤
│              📋                         │
│         Sessão Simples                  │
│    (diagnóstico básico)                 │
└─────────────────────────────────────────┘
```

---

#### **12. ProntuarioForm.jsx** (Sessão Simples)
**Caminho:** `src/components/clientes/ProntuarioForm.jsx`

**Responsabilidades:**
- Formulário de sessão simples
- Upload de 2 tipos de imagens
- Seleção de produtos

**Props:**
```javascript
{
  clienteId: number,
  prontuarioEdit: object | null,
  onClose: function,
  onSave: function
}
```

**Campos:**
- 📅 Data da Sessão (obrigatório)
- 🕐 Horário
- 📝 Diagnóstico Capilar (obrigatório, textarea)
- 💊 Tratamento Aplicado (obrigatório, textarea)
- 📦 Produtos Utilizados (select múltiplo)
- 📝 Observações Gerais
- 📅 Previsão da Próxima Sessão
- 🔬 Imagens de Tricoscopia (até 4)
- 📷 Imagens Antes/Depois (até 4)

**Validações:**
- Data obrigatória e válida
- Diagnóstico não vazio
- Tratamento não vazio
- Próxima sessão (se preenchida) deve ser válida

---

#### **13. ProntuarioCard.jsx**
**Caminho:** `src/components/clientes/prontuario/ProntuarioCard.jsx`

**Responsabilidades:**
- Card visual de sessão simples
- Exibir dados principais
- Ações de editar/excluir

**Props:**
```javascript
{
  prontuario: object,
  index: number,
  total: number,
  produtos: array,
  onEdit: function,
  onDelete: function,
  onImageClick: function
}
```

**Layout:**
```
┌──────────────────────────────────────────┐
│ [N] 📅 DD/MM/AAAA  🕐 HH:MM   [✏️] [🗑️] │
│ ─────────────────────────────────────── │
│ 📝 Diagnóstico:                         │
│    [Texto do diagnóstico...]            │
│                                          │
│ 💊 Tratamento:                          │
│    [Texto do tratamento...]             │
│                                          │
│ 📦 Produtos: [Tag1] [Tag2]              │
│                                          │
│ 📸 Imagens: [img] [img] [img] [img]     │
└──────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Badge "Mais Recente" na primeira sessão
- ✅ Contador regressivo (total - index)
- ✅ Busca nome do produto por ID
- ✅ Grid de imagens clicáveis (preview)
- ✅ Cores e backgrounds diferenciados

---

#### **14. TerapiaCard.jsx**
**Caminho:** `src/components/clientes/prontuario/TerapiaCard.jsx`

**Responsabilidades:**
- Card visual de terapia capilar
- Indicador de progresso das etapas
- Preview de informações

**Props:**
```javascript
{
  terapia: object,
  index: number,
  onEdit: function,
  onDelete: function,
  onViewDetails: function
}
```

**Layout:**
```
┌──────────────────────────────────────────┐
│ 🌸 📅 DD/MM/AAAA  🕐 HH:MM   [✏️] [🗑️] │
│ ─────────────────────────────────────── │
│ [✓ Aval] [✓ Seleç] [ Aplic] [ Final]   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  2/4 Etapas Completas                   │
│                                          │
│ 🎯 Objetivo:                            │
│    [Texto do objetivo...]               │
│                                          │
│ Clique para ver detalhes completos  →  │
└──────────────────────────────────────────┘
```

**Etapas:**
1. 🔍 Avaliação
2. 💊 Seleção
3. ✨ Aplicação
4. 🎯 Finalização

**Status Visual:**
- ✅ Verde = Completa
- ⬜ Cinza = Pendente

---

#### **15. TerapiaDetalhesModal.jsx**
**Caminho:** `src/components/clientes/prontuario/TerapiaDetalhesModal.jsx`

**Responsabilidades:**
- Modal completo de visualização
- Exibir todos os dados das etapas
- Galeria de imagens

**Props:**
```javascript
{
  terapia: object,
  onClose: function,
  onEdit: function,
  onImageClick: function
}
```

**Seções Exibidas:**
- ✅ Progresso das etapas (indicador visual)
- 🎯 Objetivo do Tratamento
- 💆‍♀️ Tipo de Couro Cabeludo
- ⚠️ Problemas Identificados
- 💊 Tratamentos Aplicados (lista)
- ⭐ Avaliação do Cliente (estrelas + comentário)
- 📸 Galeria de Imagens (grid 3x3)

**Botões:**
- Editar / Continuar (abre lista de etapas)
- Fechar

---

#### **16. ImageUploader.jsx**
**Caminho:** `src/components/clientes/ImageUploader.jsx`

**Responsabilidades:**
- Upload de múltiplas imagens
- Preview com zoom
- Remoção individual

**Props:**
```javascript
{
  images: string[],          // Array de base64
  onImagesChange: function,
  maxImages: number,         // Padrão: 4
  label: string,
  categoria: string          // Para alt text
}
```

**Funcionalidades:**
- ✅ Grid responsivo (4 colunas)
- ✅ Preview inline
- ✅ Hover revela ações
- ✅ Modal de zoom full-screen
- ✅ Validação de tamanho (5MB)
- ✅ Validação de formato (JPG, PNG, WEBP)
- ✅ Contador (atual/máximo)

**Fluxo de Upload:**
1. Usuário clica em "+"
2. Seleciona arquivo(s)
3. Sistema valida tamanho e formato
4. Converte para base64
5. Adiciona ao array
6. Renderiza preview
7. Salva no prontuário ao submeter

---

### **TERAPIA CAPILAR (4 ETAPAS)**

#### **17. FormularioAvaliacaoInicial.jsx** (Etapa 1)
**Caminho:** `src/components/terapiaCapilar/FormularioAvaliacaoInicial.jsx`

**Responsabilidades:**
- Anamnese completa do cliente
- Histórico capilar
- Avaliação visual

**Campos Principais:**
- 🎯 Objetivo do Tratamento
- 📋 Histórico Capilar
  - Problemas atuais (checkboxes)
  - Há quanto tempo
  - Tratamentos anteriores
- 🏥 Saúde Geral
  - Gravidez/amamentação
  - Condições dermatológicas
  - Medicamentos
- 🧴 Hábitos e Cuidados
  - Frequência de lavagem
  - Produtos usados
  - Procedimentos químicos
  - Uso de calor
- 🌟 Estilo de Vida
  - Alimentação
  - Exercícios
  - Estresse
  - Exposição solar
- 💭 Expectativas do Cliente
- 👁️ Avaliação Visual
  - Tipo de couro cabeludo (radio)
  - Descamação (sim/não)
  - Estado dos fios (checkboxes)
- 📸 Imagens da Avaliação (até 6)
- 📝 Recomendações Iniciais
- 🗓️ Próximos Passos

**Problemas Capilares (Checkboxes):**
- Queda de cabelo
- Quebra dos fios
- Fios ralos/finos
- Ressecamento
- Oleosidade excessiva
- Caspa/descamação
- Coceira
- Falta de brilho
- Pontas duplas
- Outro (especificar)

---

#### **18. FormularioSelecaoTratamento.jsx** (Etapa 2)
**Caminho:** `src/components/terapiaCapilar/FormularioSelecaoTratamento.jsx`

**Responsabilidades:**
- Identificar necessidades
- Definir plano de tratamento
- Selecionar produtos

**Campos Principais:**
- 🔍 Necessidades Identificadas (checkboxes)
  - Hidratação profunda
  - Nutrição
  - Reconstrução capilar
  - Controle de oleosidade
  - Tratamento anticaspa
  -