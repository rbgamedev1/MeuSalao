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