# 📋 MÓDULO CONFIGURAÇÕES - DOCUMENTAÇÃO COMPLETA

## 🎯 VISÃO GERAL

O Módulo Configurações é o núcleo administrativo do sistema de gestão de salões de beleza. Ele centraliza todas as configurações essenciais do negócio em uma interface organizada por abas, permitindo ao usuário gerenciar informações gerais, serviços, profissionais e comunicações de forma integrada e eficiente.

### Características Principais
- Interface com 4 abas distintas (Geral, Serviços, Profissionais, Comunicações)
- Validações baseadas em planos (Inicial, Essencial, Profissional)
- Persistência automática no localStorage
- Sincronização bidirecional entre profissionais e serviços
- Sistema de notificações configurável
- Upload e preview de logo
- Links compartilháveis de agenda e avaliação

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── pages/
│   └── Configuracoes.jsx                          # Página principal do módulo
│
├── components/configuracoes/
│   ├── ConfiguracoesHeader.jsx                    # Cabeçalho simples
│   ├── ConfiguracoesTabs.jsx                      # Sistema de abas
│   ├── ConfiguracoesGeral.jsx                     # Aba: Informações Gerais
│   ├── ConfiguracoesServicos.jsx                  # Aba: Gerenciamento de Serviços
│   ├── ConfiguracoesProfissionais.jsx             # Aba: Gerenciamento de Profissionais
│   ├── ConfiguracoesComunicacoes.jsx              # Aba: Notificações e Comunicações
│   ├── ProfissionalModal.jsx                      # Modal de cadastro/edição de profissional
│   ├── ServicoConfigModal.jsx                     # Modal de configuração de serviço
│   └── ServicoInfoModal.jsx                       # Modal informativo (não usado atualmente)
│
├── data/
│   ├── categoriasServicosData.js                  # Categorias e serviços predefinidos
│   ├── servicosDescricoesData.js                  # Descrições dos serviços
│   └── planosData.js                              # Definição dos planos disponíveis
│
└── utils/
    └── planRestrictions.js                        # Validações de limites por plano
```

---

## 🔧 DETALHAMENTO DOS ARQUIVOS

### **1. Configuracoes.jsx** (Página Principal)
**Caminho:** `src/pages/Configuracoes.jsx`

**Responsabilidades:**
- Gerenciar estado global das 4 abas
- Controlar abertura/fechamento de modais
- Validar limites do plano atual
- Sincronizar dados entre profissionais e serviços
- Persistir alterações via Context API

**Estados Principais:**
```javascript
- activeTab: 'geral' | 'servicos' | 'profissionais' | 'comunicacoes'
- formData: { nome, endereco, telefone, email, logo }
- profissionalData: { nome, telefone, email, especialidades[] }
- showProfissionalModal: boolean
- editingProfissionalId: number | null
- logoPreview: string | null
```

**Funções Críticas:**
- `handleSubmitProfissional()`: Salva profissional E atualiza serviços automaticamente
- `handleDeleteProfissional()`: Remove profissional E remove dele dos serviços
- `handleSaveGeral()`: Persiste informações gerais do salão
- `handleDeletarSalao()`: Exclui salão e todos os dados relacionados

**Validações Implementadas:**
- Limite de profissionais por plano
- Campos obrigatórios (nome, email, telefone)
- Validação de email com regex
- Prevenção de exclusão do único salão

---

### **2. ConfiguracoesHeader.jsx**
**Caminho:** `src/components/configuracoes/ConfiguracoesHeader.jsx`

**Responsabilidades:**
- Exibir título e subtítulo da página
- Componente puramente visual

**Props:** Nenhuma

**Observações:**
- Componente simples e estático
- Pode ser expandido no futuro com breadcrumbs ou ações rápidas

---

### **3. ConfiguracoesTabs.jsx**
**Caminho:** `src/components/configuracoes/ConfiguracoesTabs.jsx`

**Responsabilidades:**
- Renderizar sistema de abas navegável
- Indicar aba ativa visualmente
- Permitir navegação entre seções

**Props:**
```javascript
{
  activeTab: string,        // Aba atualmente selecionada
  setActiveTab: function    // Função para mudar aba
}
```

**Abas Disponíveis:**
1. **Geral** (Building2 icon) - Informações básicas do salão
2. **Serviços** (Scissors icon) - Catálogo de serviços oferecidos
3. **Profissionais** (Users icon) - Equipe do salão
4. **Comunicações** (Mail icon) - Notificações e templates

---

### **4. ConfiguracoesGeral.jsx**
**Caminho:** `src/components/configuracoes/ConfiguracoesGeral.jsx`

**Responsabilidades:**
- Gerenciar informações básicas do salão
- Upload de logo com preview
- Validação de campos obrigatórios
- Permitir exclusão do salão (com restrições)

**Props:**
```javascript
{
  formData: object,           // Dados do formulário
  handleChange: function,     // Handler de mudanças
  handleLogoUpload: function, // Upload de imagem
  handleSaveGeral: function,  // Salvar alterações
  handleDeletarSalao: function, // Excluir salão
  logoPreview: string,        // Preview da logo
  saloes: array              // Lista de salões (validação)
}
```

**Campos:**
- Logo (upload de imagem, max 2MB, JPG/PNG)
- Nome do Salão (obrigatório)
- Endereço completo (obrigatório)
- Telefone com máscara (obrigatório)
- Email (obrigatório)

**Validações:**
- Tamanho máximo de logo: 2MB
- Formato de imagem: JPG, PNG
- Todos os campos são obrigatórios
- Não permite excluir único salão

---

### **5. ConfiguracoesServicos.jsx**
**Caminho:** `src/components/configuracoes/ConfiguracoesServicos.jsx`

**Responsabilidades:**
- Listar serviços configurados agrupados por categoria
- Permitir adicionar/editar/excluir serviços
- Exibir estatísticas (total, ativos, disponíveis)
- Sistema de busca por nome

**Dados Utilizados:**
- `servicosSalao`: Serviços já configurados
- `profissionaisSalao`: Profissionais cadastrados
- `servicosDisponiveis`: Serviços não configurados ainda
- `CATEGORIAS_SERVICOS`: Catálogo completo de serviços

**Estrutura de Serviço:**
```javascript
{
  id: number,
  salaoId: number,
  nome: string,
  categoria: string,
  subcategoria: string,
  duracao: number,        // Em minutos
  valor: number,          // Preço do serviço
  comissao: number,       // Percentual 0-100
  profissionaisHabilitados: number[], // IDs dos profissionais
  ativo: boolean
}
```

**Funcionalidades:**
- ✅ Expandir/recolher categorias
- ✅ Busca em tempo real
- ✅ Estatísticas visuais (cards coloridos)
- ✅ Indicadores de status (ativo/inativo)
- ✅ Exibição de profissionais habilitados

**Estados Internos:**
```javascript
- expandedCategorias: object  // Controla categorias expandidas
- searchTerm: string          // Termo de busca
- modalAberto: boolean        // Controla modal
- servicoEditando: object     // Serviço sendo editado
```

---

### **6. ConfiguracoesProfissionais.jsx**
**Caminho:** `src/components/configuracoes/ConfiguracoesProfissionais.jsx`

**Responsabilidades:**
- Listar profissionais do salão
- Exibir contador e limite do plano
- Permitir adicionar/editar/excluir profissionais
- Alertar quando limite é atingido

**Props:**
```javascript
{
  profissionaisSalao: array,      // Lista de profissionais
  canAddProfissional: boolean,    // Verifica limite do plano
  limiteProfissionais: string,    // Mensagem de limite
  salaoPlano: string,             // Nome do plano atual
  onOpenModal: function,          // Abrir modal vazio
  onEditProfissional: function,   // Abrir modal com dados
  onDeleteProfissional: function  // Excluir profissional
}
```

**Estrutura de Profissional:**
```javascript
{
  id: number,
  salaoId: number,
  nome: string,
  telefone: string,
  email: string,
  especialidades: string[]  // Nomes dos serviços que atende
}
```

**Funcionalidades:**
- ✅ Cards visuais com avatar gerado (primeira letra)
- ✅ Listagem de especialidades
- ✅ Ações rápidas (editar/excluir)
- ✅ Alerta visual quando limite atingido
- ✅ Bloqueio de adição quando limite atingido

---

### **7. ConfiguracoesComunicacoes.jsx**
**Caminho:** `src/components/configuracoes/ConfiguracoesComunicacoes.jsx`

**Responsabilidades:**
- Gerenciar templates de email/SMS
- Configurar notificações automáticas
- Gerar links compartilháveis
- Personalizar mensagens com variáveis

**Tipos de Comunicação:**
1. **Confirmação de Agendamento** (ativo por padrão)
2. **Cancelamento** (ativo por padrão)
3. **Alteração** (ativo por padrão)
4. **Avaliação** (ativo por padrão)
5. **Aniversário** (inativo por padrão)
   - Opção de envio automático
   - Dias de antecedência configurável

**Variáveis Disponíveis:**
```javascript
{cliente_nome}      // Nome do cliente
{data}              // Data do agendamento
{horario}           // Horário do agendamento
{servico}           // Nome do serviço
{profissional}      // Nome do profissional
{salao_nome}        // Nome do salão
{salao_endereco}    // Endereço do salão
{salao_telefone}    // Telefone do salão
{link_agenda}       // Link da agenda online
{link_avaliacao}    // Link de avaliação
```

**Links Gerados:**
- Agenda Online: `{origin}/agenda/{salaoId}`
- Avaliação: `{origin}/avaliacao/{salaoId}/[token]`

**Estrutura de Template:**
```javascript
{
  assunto: string,
  corpo: string     // Aceita quebras de linha e variáveis
}
```

**Estados:**
```javascript
settings: {
  confirmacao: { ativo: boolean, template: object | null },
  cancelamento: { ativo: boolean, template: object | null },
  alteracao: { ativo: boolean, template: object | null },
  avaliacao: { ativo: boolean, template: object | null },
  aniversario: { 
    ativo: boolean, 
    automatico: boolean,
    diasAntecedencia: number,
    template: object | null 
  }
}
```

**Funcionalidades:**
- ✅ Ativar/desativar cada tipo de comunicação
- ✅ Personalizar templates (assunto e corpo)
- ✅ Visualizar variáveis disponíveis
- ✅ Restaurar template padrão
- ✅ Copiar links compartilháveis
- ✅ Abrir links em nova aba

---

### **8. ProfissionalModal.jsx**
**Caminho:** `src/components/configuracoes/ProfissionalModal.jsx`

**Responsabilidades:**
- Modal de cadastro/edição de profissional
- Vincular serviços ao profissional
- Validar campos obrigatórios
- Aplicar máscara de telefone

**Props:**
```javascript
{
  isOpen: boolean,
  onClose: function,
  editingId: number | null,
  formData: object,
  onChange: function,
  onSubmit: function,
  servicosDisponiveis: array,  // Serviços configurados do salão
  onToggleServico: function    // Toggle de checkbox
}
```

**Campos do Formulário:**
- Nome Completo (obrigatório, text)
- Telefone (obrigatório, máscara (11) 91111-1111)
- Email (obrigatório, email)
- Serviços (opcional, múltipla escolha com checkbox)

**Validações:**
- Nome não vazio
- Telefone não vazio
- Email válido (regex)
- Serviços opcionais (alerta se nenhum selecionado)

**Comportamento:**
- Lista serviços agrupados e ordenados
- Mostra categoria e subcategoria de cada serviço
- Permite continuar sem serviços (com confirmação)
- Filtra serviços inexistentes ao editar

---

### **9. ServicoConfigModal.jsx**
**Caminho:** `src/components/configuracoes/ServicoConfigModal.jsx`

**Responsabilidades:**
- Modal de configuração de serviço
- Definir preço, duração e comissão
- **Campo de profissionais READ-ONLY**
- Validar dados obrigatórios

**Props:**
```javascript
{
  isOpen: boolean,
  onClose: function,
  servico: object | null,          // null = novo, object = editar
  servicosDisponiveis: array,      // Serviços não configurados
  profissionaisSalao: array,       // Para exibição read-only
  onSave: function
}
```

**Campos do Formulário:**
- Serviço (obrigatório, select agrupado)
- Duração (obrigatório, 15min a 8h)
- Valor (obrigatório, R$, decimal)
- Comissão (opcional, 0-100%)
- Profissionais (READ-ONLY, informativo)
- Ativo (checkbox, padrão true)

**Campo de Profissionais:**
- ⚠️ **NÃO É EDITÁVEL** no cadastro de serviço
- Exibe banner explicativo
- Mostra profissionais atualmente vinculados
- Orientação: vincular através do cadastro de profissional

**Validações:**
- Serviço selecionado
- Valor maior que zero
- Duração entre 15min e 480min

**Opções de Duração:**
- 15min a 8h (480min)
- Incrementos de 15 minutos
- Exibição formatada (1h 30min)

---

### **10. ServicoInfoModal.jsx**
**Caminho:** `src/components/configuracoes/ServicoConfigModal.jsx`

**Status:** ⚠️ Componente criado mas não utilizado atualmente

**Responsabilidades (Planejadas):**
- Exibir informações detalhadas de um serviço
- Mostrar descrição completa do SERVICOS_DESCRICOES

**Props:**
```javascript
{
  isOpen: boolean,
  onClose: function,
  servicoNome: string,
  servicoDescricao: string
}
```

**Uso Potencial:**
- Botão "ℹ️ Info" ao lado de cada serviço
- Ajudar usuário a entender o que é cada serviço
- Facilitar escolha de serviços na configuração

---

## 📊 ARQUIVOS DE DADOS

### **categoriasServicosData.js**
**Caminho:** `src/data/categoriasServicosData.js`

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
        servicos: ['Corte Masculino', 'Corte Feminino', ...]
      }
    ]
  }
]
```

**Categorias Disponíveis:**
1. Serviços Capilares (cortes, colorimetria, tratamentos, penteados, alongamento)
2. Serviços para Unhas (manicure e pedicure)
3. Cuidados com a Pele e Estética Facial (limpeza, tratamentos, estética avançada, sobrancelhas, cílios)
4. Maquiagem (social, noiva, especial)
5. Depilação e Serviços Corporais (depilação, massagens, estética corporal)
6. Serviços de Bem-Estar Complementar (terapias)

**Total de Serviços:** ~120+ serviços predefinidos

---

### **servicosDescricoesData.js**
**Caminho:** `src/data/servicosDescricoesData.js`

**Estrutura:**
```javascript
SERVICOS_DESCRICOES = {
  'Corte Masculino': 'Descrição detalhada...',
  'Hidratação': 'Descrição detalhada...',
  // ... para cada serviço
}
```

**Uso:**
- Exibir informações ao usuário
- Ajudar na escolha de serviços
- ⚠️ Atualmente não exibido na interface (potencial melhoria)

---

### **planosData.js**
**Caminho:** `src/data/planosData.js`

**Planos Disponíveis:**

#### 1. **Plano Inicial** (Gratuito) ✅
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
    '✅ Notificações de confirmação',
    '❌ Sem agenda online',
    '❌ Sem financeiro',
    '❌ Sem relatórios'
  ]
}
```

#### 2. **Plano Essencial** (R$ 29,90) ✅
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
    '✅ Agenda online (link compartilhável)',
    '✅ Notificações: confirmação + cancelamento',
    '✅ Relatórios de agendamentos',
    '❌ Sem financeiro',
    '❌ Sem notificações de alteração'
  ]
}
```

#### 3. **Plano Profissional** (R$ 79,90) ✅ RECOMENDADO
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
    '✅ Financeiro completo',
    '✅ Link de agendamento personalizado',
    '✅ Notificações: confirmação + alteração + cancelamento',
    '✅ Relatórios detalhados',
    '✅ Análise de comissões'
  ]
}
```

#### 4-6. **Planos Futuros** (Desabilitados) 🔒
- Plano Plus (R$ 49,50)
- Plano Premium (R$ 99,90)
- Plano Master (R$ 149,90)
- Status: `disponivel: false`

---

## 🔐 SISTEMA DE VALIDAÇÕES

### **planRestrictions.js**
**Caminho:** `src/utils/planRestrictions.js`

**Funções Exportadas:**

#### `canAddMore(plano, tipo, quantidadeAtual)`
Verifica se pode adicionar mais itens baseado no plano.

**Parâmetros:**
- `plano`: 'inicial' | 'essencial' | 'profissional'
- `tipo`: 'profissionais' | 'clientes' | 'produtos' | 'fornecedores'
- `quantidadeAtual`: number

**Retorno:** boolean

**Limites por Plano:**
```javascript
inicial: {
  profissionais: 1,
  clientes: 10,
  fornecedores: 1,
  produtos: 3
}

essencial: {
  profissionais: 2,
  clientes: 30,
  fornecedores: 2,
  produtos: 5
}

profissional: {
  profissionais: 10,
  clientes: 300,
  fornecedores: 10,
  produtos: 30
}
```

#### `getLimitMessage(plano, tipo)`
Retorna mensagem formatada do limite.

**Retorno:** string
- Exemplo: "Máximo: 2 profissionais"
- Exemplo: "Ilimitado"

---

## 🔄 FLUXO DE DADOS

### **Sincronização Profissional ↔ Serviço**

#### Ao Salvar Profissional:
```javascript
1. Usuário marca serviços no modal do profissional
2. Sistema salva profissional com especialidades[]
3. Sistema atualiza TODOS os serviços:
   - Se serviço está em especialidades: ADD profissional.id
   - Se serviço não está mais: REMOVE profissional.id
4. Resultado: Sincronização bidirecional automática
```

#### Ao Excluir Profissional:
```javascript
1. Usuário confirma exclusão
2. Sistema remove profissional do array
3. Sistema REMOVE profissional.id de TODOS os serviços
4. Resultado: Serviços ficam sem esse profissional
```

#### Ao Visualizar Serviço:
```javascript
1. Modal exibe campo READ-ONLY de profissionais
2. Sistema busca profissionais por IDs em profissionaisHabilitados[]
3. Exibe lista formatada com nomes
4. Banner orienta: "Vincule através do cadastro do profissional"
```

---

## 💾 PERSISTÊNCIA DE DADOS

### **localStorage Strategy**

Cada entidade é salva separadamente com debounce de 300ms:

```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    saveToStorage('servicos', servicos);
  }, 300);
  return () => clearTimeout(timer);
}, [servicos]);
```

**Entidades Persistidas:**
- `saloes`: Informações dos salões
- `profissionais`: Cadastro de profissionais
- `servicos`: Catálogo de serviços configurados
- `clientes`: Base de clientes
- `fornecedores`: Fornecedores de produtos
- `produtos`: Estoque de produtos
- `agendamentos`: Histórico de agendamentos
- `transacoes`: Histórico financeiro
- `comandas`: Comandas abertas/fechadas
- `vendas`: Registro de vendas
- `prontuarios`: Prontuários de clientes

### **Carregamento Inicial**
```javascript
const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Erro ao carregar ${key}:`, error);
    return defaultValue;
  }
};
```

---

## 🎨 PADRÕES DE UI/UX

### **Cores e Gradientes**
```javascript
// Primárias
purple-600 → pink-600  // Botões principais, headers
purple-50 → purple-100 // Backgrounds suaves

// Status
green-600  // Sucesso, ativo
red-600    // Erro, inativo
yellow-600 // Aviso, pendente
blue-600   // Informação
```

### **Componentes Reutilizáveis**
- `Modal`: Base para todos os modais
- `MaskedInput`: Inputs com máscaras (telefone, CPF, etc)
- Cards com gradiente para estatísticas
- Badges coloridos para status
- Tooltips em ícones de ação

### **Feedback Visual**
- ✅ Mensagens de sucesso com `alert()`
- ❌ Mensagens de erro com `alert()`
- ⚠️ Confirmações com `confirm()`
- 🔄 Loading spinner em carregamentos
- Animações de hover em botões e cards

---

## 🚀 ROADMAP DE MELHORIAS

### **PRIORIDADE ALTA** 🔴

#### 1. **Sistema de Notificações Toast**
**Problema Atual:** Uso de `alert()` e `confirm()` nativos
**Solução:**
- Implementar biblioteca de toast (react-hot-toast ou sonner)
- Notificações não-bloqueantes
- Animações suaves de entrada/saída
- Diferentes tipos (success, error, warning, info)

#### 2. **Validação de Email Real**
**Problema Atual:** Apenas regex simples
**Solução:**
- Validar formato mais robusto
- Verificar domínios comuns (gmail, hotmail, etc)
- Alerta se email suspeito

#### 3. **Compressão de Imagens no Upload**
**Problema Atual:** Upload direto sem otimização
**Solução:**
- Comprimir imagens antes de salvar
- Redimensionar para tamanho padrão (ex: 300x300)
- Manter qualidade visual aceitável
- Reduzir uso de localStorage

#### 4. **Busca Avançada de Serviços**
**Problema Atual:** Busca apenas por nome
**Solução:**
- Buscar por categoria
- Buscar por subcategoria
- Filtrar por ativo/inativo
- Filtrar por profissional habilitado

#### 5. **Exportação de Dados**
**Problema Atual:** Sem backup ou exportação
**Solução:**
- Botão "Exportar Configurações"
- Gerar JSON com todas as configs
- Download automático
- Importar configs de arquivo

---

### **PRIORIDADE MÉDIA** 🟡

#### 6. **Preview de Templates de Email**
**Problema Atual:** Usuário edita template às cegas
**Solução:**
- Preview em tempo real no modal
- Substituir variáveis por exemplos
- Exibição formatada (com quebras de linha)
- Opção de enviar email de teste

#### 7. **Histórico de Alterações**
**Problema Atual:** Sem rastreamento de mudanças
**Solução:**
- Log de alterações em configurações
- Timestamp e usuário responsável
- Exibir últimas 10 alterações
- Filtrar por tipo de alteração

#### 8. **Duplicação de Serviços**
**Problema Atual:** Criar serviços similares do zero
**Solução:**
- Botão "Duplicar" em cada serviço
- Copiar configurações (duração, valor, comissão)
- Permitir editar antes de salvar
- Acelerar cadastro de variações

#### 9. **Reordenação de Serviços**
**Problema Atual:** Ordem alfabética fixa
**Solução:**
- Drag and drop para reordenar
- Salvar ordem personalizada
- Refletir ordem na agenda
- Ordem de exibição customizada

#### 10. **Vincular Foto ao Profissional**
**Problema Atual:** Apenas avatar com inicial
**Solução:**
- Upload de foto do profissional
- Preview circular 80x80
- Compressão automática
- Fallback para inicial

---

### **PRIORIDADE BAIXA** 🟢

#### 11. **Estatísticas de Serviços**
**Problema Atual:** Sem análise de serviços
**Solução:**
- Serviço mais agendado
- Serviço mais rentável
- Serviços nunca agendados
- Taxa de conversão por serviço

#### 12. **Sugestões Inteligentes**
**Problema Atual:** Usuário configura tudo manualmente
**Solução:**
- Sugerir valores médios de mercado
- Sugerir durações típicas
- Alertar sobre preços muito baixos/altos
- Comparar com dados históricos

#### 13. **Multi-idioma**
**Problema Atual:** Apenas português
**Solução:**
- Suporte a inglês e espanhol
- Traduzir interface
- Traduzir templates padrão
- Seletor de idioma nas configurações

#### 14. **Temas Customizáveis**
**Problema Atual:** Cores fixas (purple/pink)
**Solução:**
- Escolher cores primárias
- Preview em tempo real
- Temas predefinidos
- Dark mode

#### 15. **Integração com WhatsApp Business**
**Problema Atual:** Links manuais
**Solução:**
- Conectar com WhatsApp Business API
- Enviar mensagens automáticas
- Templates aprovados pelo WhatsApp
- Métricas de entrega

---

### **FEATURES AVANÇADAS** 🔵

#### 16. **Agendamento Automático por IA**
**Conceito:** Sugerir horários baseado em histórico
**Complexidade:** Alta
**Dependências:** Backend, ML model

#### 17. **Reconhecimento de Voz para Cadastro**
**Conceito:** Cadastrar profissional/serviço por voz
**Complexidade:** Alta
**Dependências:** Web Speech API, validação inteligente

#### 18. **Integração com Google Calendar**
**Conceito:** Sincronizar agendamentos com Google Calendar
**Complexidade:** Média-Alta
**Dependências:** Google API, OAuth

#### 19. **Sistema de Permissões por Profissional**
**Conceito:** Diferentes níveis de acesso
**Exemplo:**
- Admin: Acesso total
- Gerente: Configurações e relatórios
- Profissional: Apenas sua agenda
- Recepcionista: Apenas agendamento

#### 20. **Marketplace de Templates**
**Conceito:** Biblioteca de templates prontos
**Recursos:**
- Templates por segmento (luxo, popular, unissex)
- Importar/exportar templates
- Avaliação e comentários
- Templates premium pagos

---

## 🐛 BUGS CONHECIDOS E LIMITAÇÕES

### **Bugs Identificados:**

#### 1. **Profissional sem Serviços**
**Descrição:** Permite cadastrar profissional sem serviços
**Impacto:** Profissional não pode ser agendado
**Status:** ⚠️ Intencional (com confirmação)
**Solução Futura:** Bloquear completamente ou marcar profissional como "inativo"

#### 2. **Serviço sem Profissionais**
**Descrição:** Permite cadastrar serviço sem profissionais
**Impacto:** Serviço não aparece na agenda
**Status:** ⚠️ Intencional (vinculação posterior)
**Solução Futura:** Alerta mais visível na listagem

#### 3. **Exclusão de Categoria Usada**
**Descrição:** Não há validação ao remover categoria
**Impacto:** Serviços podem ficar órfãos
**Status:** 🔴 Bug
**Solução:** Validar antes de excluir, avisar se há serviços vinculados

#### 4. **Limite de localStorage**
**Descrição:** localStorage limitado a ~5-10MB
**Impacto:** Sistema pode parar de salvar
**Status:** ⚠️ Limitação técnica
**Solução Futura:** Migrar para IndexedDB ou backend

### **Limitações Técnicas:**

#### 1. **Sem Sincronização em Tempo Real**
**Problema:** Dados apenas no localStorage do navegador
**Impacto:** 
- Sem acesso de outros dispositivos
- Perda de dados ao limpar cache
- Sem backup automático

#### 2. **Performance com Muitos Serviços**
**Problema:** Re-renderizações desnecessárias
**Impacto:** Interface pode travar com 100+ serviços
**Solução Futura:** Virtualização de listas, paginação

#### 3. **Sem Versionamento de Dados**
**Problema:** Mudanças na estrutura quebram dados antigos
**Impacto:** Usuários antigos podem ter erros
**Solução:** Sistema de migrations

#### 4. **Upload de Logo Limitado**
**Problema:** Base64 gera strings gigantes
**Impacto:** Estoura localStorage rapidamente
**Solução Futura:** CDN, compressão avançada

---

## 🔍 CASOS DE USO DETALHADOS

### **Caso de Uso 1: Configuração Inicial do Salão**

**Ator:** Novo usuário (primeira vez no sistema)

**Fluxo:**
1. Usuário acessa página Configurações
2. Sistema exibe aba "Geral" por padrão
3. Usuário preenche:
   - Nome do salão
   - Endereço completo
   - Telefone
   - Email
   - Upload de logo (opcional)
4. Usuário clica "Salvar Alterações"
5. Sistema valida campos
6. Sistema persiste no localStorage
7. Sistema exibe toast de sucesso
8. Usuário passa para aba "Serviços"

**Exceções:**
- Campos vazios → Alert de erro
- Email inválido → Alert de erro
- Logo maior que 2MB → Alert de erro

---

### **Caso de Uso 2: Cadastro de Serviço**

**Ator:** Administrador do salão

**Pré-condições:** Salão já configurado

**Fluxo:**
1. Usuário acessa aba "Serviços"
2. Usuário clica "Novo Serviço"
3. Sistema abre modal
4. Usuário seleciona serviço do dropdown agrupado
5. Usuário define:
   - Duração (ex: 1h 30min)
   - Valor (ex: R$ 80,00)
   - Comissão (ex: 30%)
6. Sistema exibe campo "Profissionais" (read-only, vazio)
7. Usuário marca "Serviço ativo"
8. Usuário clica "Cadastrar Serviço"
9. Sistema valida dados
10. Sistema adiciona ao array de serviços
11. Sistema fecha modal
12. Sistema exibe toast de sucesso
13. Serviço aparece na listagem

**Pós-condições:**
- Serviço cadastrado mas sem profissionais
- Não pode ser agendado ainda
- Aparece em "Serviços Disponíveis" na aba Profissionais

---

### **Caso de Uso 3: Vincular Profissional a Serviços**

**Ator:** Administrador do salão

**Pré-condições:** 
- Pelo menos 1 serviço cadastrado
- Pode ter 0 ou mais profissionais

**Fluxo Principal:**
1. Usuário acessa aba "Profissionais"
2. Usuário clica "Adicionar Profissional"
3. Sistema valida limite do plano
4. Sistema abre modal
5. Usuário preenche:
   - Nome completo
   - Telefone
   - Email
6. Sistema exibe lista de serviços disponíveis
7. Usuário marca serviços que o profissional atende
8. Usuário clica "Cadastrar Profissional"
9. Sistema valida dados
10. Sistema salva profissional
11. Sistema atualiza CADA serviço marcado:
    - Adiciona profissional.id em profissionaisHabilitados[]
12. Sistema fecha modal
13. Sistema exibe toast de sucesso

**Fluxo Alternativo (Sem serviços marcados):**
7a. Usuário não marca nenhum serviço
8a. Usuário clica "Cadastrar Profissional"
9a. Sistema exibe confirmação:
    "Profissional não poderá realizar atendimentos. Continuar?"
10a. Se SIM → Cadastra normalmente
11a. Se NÃO → Retorna ao modal

**Pós-condições:**
- Profissional cadastrado
- Serviços atualizados com o profissional
- Serviços agora podem ser agendados

---

### **Caso de Uso 4: Editar Profissional e Remover Serviço**

**Ator:** Administrador do salão

**Pré-condições:** 
- Profissional já cadastrado com serviços vinculados

**Fluxo:**
1. Usuário acessa aba "Profissionais"
2. Usuário clica no ícone "Editar" do profissional
3. Sistema abre modal com dados preenchidos
4. Sistema exibe serviços atualmente marcados
5. Usuário desmarca um serviço
6. Usuário clica "Salvar Alterações"
7. Sistema valida dados
8. Sistema atualiza profissional
9. Sistema atualiza serviços:
   - Serviço desmarcado: REMOVE profissional.id
   - Serviço marcado: ADICIONA profissional.id
10. Sistema fecha modal
11. Sistema exibe toast de sucesso

**Pós-condições:**
- Profissional atualizado
- Serviço removido fica sem esse profissional
- Se serviço ficar sem nenhum profissional, não pode ser agendado

---

### **Caso de Uso 5: Excluir Profissional**

**Ator:** Administrador do salão

**Pré-condições:** Profissional cadastrado

**Fluxo:**
1. Usuário acessa aba "Profissionais"
2. Usuário clica no ícone "Excluir" (lixeira)
3. Sistema exibe confirmação:
   "Tem certeza? Será removido de todos os serviços."
4. Usuário confirma
5. Sistema remove profissional do array
6. Sistema remove profissional.id de TODOS os serviços
7. Sistema exibe toast de sucesso

**Pós-condições:**
- Profissional excluído permanentemente
- Serviços ficam sem esse profissional
- Serviços que ficarem sem profissionais não podem ser agendados

---

### **Caso de Uso 6: Personalizar Template de Notificação**

**Ator:** Administrador do salão

**Pré-condições:** Nenhuma

**Fluxo:**
1. Usuário acessa aba "Comunicações"
2. Usuário localiza tipo de comunicação (ex: "Confirmação")
3. Usuário clica "Personalizar Mensagem"
4. Sistema abre modal com template atual (ou padrão)
5. Usuário clica "Ver variáveis disponíveis"
6. Sistema exibe lista de variáveis e descrições
7. Usuário edita:
   - Assunto (ex: "✅ Confirmado - {salao_nome}")
   - Corpo (texto com variáveis)
8. Usuário clica "Salvar Template"
9. Sistema valida (assunto não vazio)
10. Sistema armazena template customizado
11. Sistema fecha modal
12. Sistema exibe alerta: "Clique em Salvar Configurações no final"
13. Usuário rola até o final da página
14. Usuário clica "Salvar Configurações"
15. Sistema persiste no salaoAtual.comunicacoes
16. Sistema exibe toast de sucesso

**Funcionalidades Adicionais:**
- Botão "Restaurar Padrão" para voltar ao template original
- Preview das variáveis disponíveis
- Contador de caracteres (futuro)

---

### **Caso de Uso 7: Configurar Mensagem de Aniversário**

**Ator:** Administrador do salão

**Pré-condições:** Nenhuma

**Fluxo:**
1. Usuário acessa aba "Comunicações"
2. Usuário localiza "Mensagem de Aniversário" (inativo)
3. Usuário ativa o toggle
4. Sistema exibe opções adicionais:
   - Checkbox "Enviar automaticamente"
   - Select "Enviar com antecedência" (0, 1, 2, 3, 7 dias)
5. Usuário seleciona "3 dias antes"
6. Usuário marca "Enviar automaticamente"
7. Usuário clica "Personalizar Mensagem"
8. Usuário edita template
9. Usuário salva template
10. Usuário clica "Salvar Configurações" no final da página
11. Sistema persiste configurações
12. Sistema exibe toast de sucesso

**Pós-condições:**
- Mensagem de aniversário ativada
- Sistema enviará automaticamente 3 dias antes
- Template personalizado será usado

---

### **Caso de Uso 8: Excluir Salão**

**Ator:** Administrador com múltiplos salões

**Pré-condições:** Usuário possui 2+ salões cadastrados

**Fluxo:**
1. Usuário acessa aba "Geral"
2. Usuário rola até o final da página
3. Usuário clica "Excluir Este Salão" (botão vermelho)
4. Sistema exibe confirmação:
   "Tem certeza? Todos os dados serão perdidos permanentemente!"
5. Usuário confirma
6. Sistema valida (não é o único salão)
7. Sistema remove:
   - Salão
   - Todos os profissionais do salão
   - Todos os serviços do salão
   - Todos os clientes do salão
   - Todos os agendamentos do salão
   - Todos os dados relacionados
8. Sistema seleciona próximo salão disponível
9. Sistema exibe toast de sucesso
10. Página recarrega com novo salão selecionado

**Fluxo Alternativo (Único Salão):**
6a. Sistema detecta que é o único salão
7a. Sistema exibe alert: "Você não pode excluir o único salão."
8a. Ação cancelada

---

## 📱 RESPONSIVIDADE

### **Breakpoints Utilizados:**
```javascript
// Tailwind CSS padrão
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Desktop large
2xl: '1536px' // Desktop XL
```

### **Comportamento por Dispositivo:**

#### **Mobile (< 640px)**
- Abas empilhadas verticalmente
- Cards de profissionais em coluna única
- Modais ocupam 100% da largura
- Formulários em coluna única
- Estatísticas empilhadas

#### **Tablet (640px - 1024px)**
- Abas em scroll horizontal
- Cards de profissionais em 2 colunas
- Modais com largura máxima
- Formulários em 2 colunas quando apropriado
- Estatísticas em grid 2x2

#### **Desktop (> 1024px)**
- Abas em linha horizontal
- Cards de profissionais em 2-3 colunas
- Modais centralizados
- Formulários otimizados
- Estatísticas em linha (3 cards)

---

## 🧪 CENÁRIOS DE TESTE

### **Testes Manuais Recomendados:**

#### **Teste 1: Fluxo Completo de Configuração**
```
1. Criar novo salão
2. Configurar informações gerais
3. Cadastrar 3 serviços diferentes
4. Cadastrar 2 profissionais
5. Vincular profissionais aos serviços
6. Ativar notificações
7. Personalizar 1 template
8. Verificar persistência (recarregar página)
```

#### **Teste 2: Limites de Plano**
```
Plano Inicial:
1. Tentar cadastrar 2º profissional → Deve bloquear
2. Verificar mensagem de limite
3. Upgrade para Plano Essencial
4. Cadastrar 2º profissional → Deve permitir
5. Tentar cadastrar 3º profissional → Deve bloquear
```

#### **Teste 3: Sincronização Profissional-Serviço**
```
1. Cadastrar serviço "Corte Masculino"
2. Verificar que está sem profissionais
3. Cadastrar profissional "João"
4. Vincular "Corte Masculino" ao João
5. Abrir serviço → Verificar João na lista
6. Editar João e remover "Corte Masculino"
7. Abrir serviço → Verificar que João foi removido
```

#### **Teste 4: Exclusão em Cascata**
```
1. Cadastrar profissional com 3 serviços
2. Verificar serviços têm o profissional
3. Excluir profissional
4. Verificar que foi removido dos 3 serviços
5. Verificar toast de sucesso
```

#### **Teste 5: Validações de Formulário**
```
1. Tentar salvar informações gerais sem preencher
2. Tentar upload de logo > 2MB
3. Tentar cadastrar profissional sem email
4. Tentar cadastrar profissional com email inválido
5. Tentar cadastrar serviço sem valor
6. Verificar mensagens de erro apropriadas
```

#### **Teste 6: Persistência de Dados**
```
1. Configurar salão completo
2. Recarregar página (F5)
3. Verificar que dados persistiram
4. Abrir DevTools → Application → localStorage
5. Verificar estrutura dos dados salvos
6. Limpar localStorage
7. Recarregar → Verificar estado inicial
```

#### **Teste 7: Modais e Navegação**
```
1. Abrir modal de profissional
2. Fechar com X
3. Abrir novamente
4. Fechar com botão "Cancelar"
5. Abrir e preencher formulário
6. Fechar sem salvar
7. Verificar que dados não foram salvos
```

#### **Teste 8: Comunicações**
```
1. Desativar todas as comunicações
2. Salvar configurações
3. Recarregar página
4. Verificar que permaneceram desativadas
5. Personalizar template de confirmação
6. Restaurar ao padrão
7. Verificar que voltou ao original
```

---

## 🔧 TROUBLESHOOTING

### **Problema: Dados não estão salvando**

**Sintomas:**
- Configurações desaparecem ao recarregar
- Modal salva mas lista não atualiza

**Possíveis Causas:**
1. localStorage cheio (5-10MB)
2. Navegador em modo privado
3. Erro de JSON.stringify
4. Context não está atualizando

**Soluções:**
1. Limpar localStorage: `localStorage.clear()`
2. Verificar DevTools → Console por erros
3. Verificar Application → localStorage por tamanho
4. Tentar em janela normal (não privada)
5. Reduzir tamanho da logo

---

### **Problema: Profissional não aparece no serviço**

**Sintomas:**
- Profissional vinculado mas não aparece na lista

**Possíveis Causas:**
1. IDs não estão batendo
2. Array profissionaisHabilitados não foi atualizado
3. Filtro de profissionais está errado

**Soluções:**
1. Abrir DevTools → Console
2. Verificar: `localStorage.getItem('servicos')`
3. Procurar serviço específico
4. Verificar array profissionaisHabilitados
5. Verificar se ID do profissional está lá
6. Se não: Re-editar profissional e salvar

---

### **Problema: Modal não abre**

**Sintomas:**
- Botão não responde
- Modal abre mas está vazio

**Possíveis Causas:**
1. Estado modal não mudou
2. Props não foram passadas
3. Erro no componente filho

**Soluções:**
1. Verificar console por erros
2. Verificar estado: `showProfissionalModal`
3. Verificar props do modal
4. Tentar fechar e abrir novamente
5. Recarregar página

---

### **Problema: Limite de plano não está funcionando**

**Sintomas:**
- Permite adicionar mais que o limite
- Mensagem de limite incorreta

**Possíveis Causas:**
1. Plano não está definido corretamente
2. Função canAddMore com bug
3. Contagem de profissionais errada

**Soluções:**
1. Verificar: `salaoAtual.plano`
2. Verificar: `profissionaisSalao.length`
3. Testar função manualmente no console
4. Verificar planosData.js
5. Atualizar plano do salão

---

## 📚 GLOSSÁRIO DE TERMOS

**Salão:** Entidade principal que agrupa todas as configurações e dados de um estabelecimento.

**Profissional:** Colaborador que realiza serviços. Pode atender múltiplos serviços.

**Serviço:** Item do catálogo oferecido pelo salão. Tem preço, duração e comissão.

**Especialidade:** Nome antigo para "serviços que o profissional atende". Mantido por compatibilidade no código.

**Categoria:** Agrupamento de serviços (ex: Serviços Capilares).

**Subcategoria:** Subagrupamento dentro de categoria (ex: Cortes, Colorimetria).

**Template:** Modelo de mensagem para notificações com variáveis dinâmicas.

**Variável:** Placeholder substituído por dados reais (ex: {cliente_nome}).

**Plano:** Nível de assinatura que define limites e recursos disponíveis.

**Modal:** Janela sobreposta usada para cadastros e edições.

**Toast:** Notificação não-bloqueante que aparece temporariamente.

**localStorage:** Armazenamento local do navegador (5-10MB).

**Context API:** Sistema de gerenciamento de estado global do React.

**Artifact:** Componente de código gerado pela IA Claude.

---

## 🎓 BOAS PRÁTICAS IMPLEMENTADAS

### **1. Separação de Responsabilidades**
- Cada componente tem uma responsabilidade única
- Lógica separada de apresentação
- Dados isolados em arquivos dedicados

### **2. Componentização**
- Componentes reutilizáveis (Modal, MaskedInput)
- Props tipadas e documentadas
- Composição sobre herança

### **3. Estado Gerenciado**
- Context API para estado global
- useState para estado local
- useMemo para otimizações
- useEffect para efeitos colaterais

### **4. Validações em Camadas**
- Validação de formulário (frontend)
- Validação de negócio (limites de plano)
- Validação de dados (tipos e formatos)

### **5. Feedback ao Usuário**
- Mensagens claras de sucesso/erro
- Loading states quando apropriado
- Confirmações antes de ações destrutivas
- Tooltips em ícones

### **6. Acessibilidade**
- Labels em todos os inputs
- Contraste adequado de cores
- Foco visível em elementos interativos
- Textos alternativos em ícones

### **7. Performance**
- Debounce em salvamento (300ms)
- useMemo para cálculos pesados
- Lazy loading (futuro)
- Virtualização de listas (futuro)

---

## 🚨 ALERTAS IMPORTANTES

### ⚠️ **CRÍTICO: Backup de Dados**
O sistema atual usa apenas localStorage. **Não há backup automático.**

**Cenários de Perda de Dados:**
- Usuário limpa cache do navegador
- Navegador atinge limite de armazenamento
- Erro ao salvar dados grandes
- Troca de dispositivo

**Recomendação Urgente:**
- Implementar exportação JSON periódica
- Adicionar backend com sincronização
- Migrar para IndexedDB (maior capacidade)

### ⚠️ **ATENÇÃO: Sincronização Manual**
Atualmente, a sincronização profissional ↔ serviço é feita manualmente no código.

**Pontos de Atenção:**
- Ao adicionar novo campo, atualizar sincronização
- Ao excluir entidade, limpar referências
- Manter integridade referencial

### ⚠️ **LIMITAÇÃO: Planos Hardcoded**
Os limites de planos estão fixos no código.

**Implicações:**
- Mudança de limites requer deploy
- Sem planos personalizados por cliente
- Sem testes A/B de planos

**Solução Futura:**
- Limites configuráveis via API
- Planos dinâmicos por região
- Overrides por cliente

---

## 📊 MÉTRICAS E KPIs SUGERIDOS

### **Métricas de Uso:**
- Tempo médio de configuração inicial
- Taxa de conclusão do wizard
- Campos mais deixados em branco
- Serviços mais configurados
- Templates mais personalizados

### **Métricas de Performance:**
- Tempo de carregamento da página
- Tempo para abrir modal
- Tempo para salvar configurações
- Uso de memória (localStorage)

### **Métricas de Qualidade:**
- Taxa de erros de validação
- Profissionais sem serviços
- Serviços sem profissionais
- Logos acima de 1MB

---

## 🎯 OBJETIVOS FUTUROS

### **Curto Prazo (1-2 meses)**
- [ ] Implementar toast notifications
- [ ] Compressão de imagens
- [ ] Busca avançada de serviços
- [ ] Preview de templates

### **Médio Prazo (3-6 meses)**
- [ ] Backend com API REST
- [ ] Sincronização multi-dispositivo
- [ ] Sistema de permissões
- [ ] Histórico de alterações
- [ ] Exportação/importação de dados

### **Longo Prazo (6-12 meses)**
- [ ] App mobile nativo
- [ ] Integração WhatsApp Business
- [ ] IA para sugestões inteligentes
- [ ] Marketplace de templates
- [ ] Multi-idioma completo

---

## 📞 SUPORTE E MANUTENÇÃO

### **Checklist de Manutenção Mensal:**
- [ ] Revisar erros no console do navegador
- [ ] Verificar tamanho do localStorage
- [ ] Testar fluxos críticos manualmente
- [ ] Verificar compatibilidade com novos navegadores
- [ ] Atualizar dependências do React
- [ ] Revisar feedback de usuários

### **Quando Adicionar Novo Recurso:**
1. Documentar no README
2. Adicionar ao roadmap
3. Criar caso de uso
4. Implementar validações
5. Adicionar testes manuais
6. Atualizar glossário se necessário

---

## 📝 CHANGELOG

### **Versão Atual (v1.0.0)**
- ✅ Sistema de abas implementado
- ✅ Configurações gerais completas
- ✅ Gerenciamento de serviços
- ✅ Gerenciamento de profissionais
- ✅ Sincronização profissional ↔ serviço
- ✅ Sistema de comunicações
- ✅ Templates personalizáveis
- ✅ Validações de plano
- ✅ Links compartilháveis
- ✅ Persistência em localStorage

### **Melhorias Implementadas Recentemente:**
- ✅ Campo de profissionais no serviço agora é READ-ONLY
- ✅ Vinculação de serviços através do cadastro do profissional
- ✅ Sincronização bidirecional automática
- ✅ Remoção do campo "descrição" no cadastro de serviço
- ✅ Lista de serviços ordenada por categoria/subcategoria/nome

---

## 🎬 CONCLUSÃO

Este módulo é o **coração administrativo** do sistema. Toda configuração inicial do negócio passa por aqui. A arquitetura atual é sólida e escalável, mas tem espaço significativo para melhorias, especialmente em:

1. **Persistência de dados** (migrar de localStorage)
2. **Experiência do usuário** (toast, preview, validações)
3. **Performance** (otimizações, cache inteligente)
4. **Integrações** (WhatsApp, Google, pagamentos)

O código está bem estruturado, componentizado e documentado. A sincronização profissional ↔ serviço é robusta e confiável. As validações de plano funcionam corretamente.

**Próximos Passos Recomendados:**
1. Implementar sistema de toast (melhora UX drasticamente)
2. Adicionar compressão de imagens (evita estouro de localStorage)
3. Criar sistema de backup/exportação (segurança de dados)
4. Desenvolver backend para sincronização multi-dispositivo

---

**Última Atualização:** 2025-01-19  
**Versão do Documento:** 1.0.0  
**Mantenedor:** Sistema de Gestão de Salões