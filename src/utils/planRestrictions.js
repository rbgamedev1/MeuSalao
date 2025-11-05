// src/utils/planRestrictions.js - ATUALIZADO: Notificações por plano

// Definição de limites por plano
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
    exportacao: false,
    agendamentoOnline: false,
    notificacoes: 'confirmacao', // ✅ NOVO: Apenas confirmações
    comissoes: false
  },
  essencial: {
    saloes: 1,
    profissionais: 2,
    clientes: 30,
    categorias: 3,
    servicosPorCategoria: 3,
    fornecedores: 2,
    produtos: 5,
    financeiro: false,
    relatorios: 'basico',
    exportacao: false,
    agendamentoOnline: true,
    notificacoes: 'basico', // ✅ NOVO: Confirmações + Cancelamentos
    comissoes: false
  },
  plus: {
    saloes: 1,
    profissionais: 5,
    clientes: 100,
    categorias: 5,
    servicosPorCategoria: 5,
    fornecedores: 5,
    produtos: 15,
    financeiro: 'simples',
    relatorios: 'basico',
    exportacao: false,
    agendamentoOnline: true,
    notificacoes: 'basico', // ✅ Confirmações + Cancelamentos
    comissoes: true
  },
  profissional: {
    saloes: 2,
    profissionais: 10,
    clientes: 300,
    categorias: Infinity,
    servicosPorCategoria: Infinity,
    fornecedores: 10,
    produtos: 30,
    financeiro: 'completo',
    relatorios: 'completo',
    exportacao: true,
    agendamentoOnline: true,
    notificacoes: 'avancado', // ✅ NOVO: Confirmações + Alterações + Cancelamentos
    comissoes: true,
    appProfissionais: true
  },
  premium: {
    saloes: 5,
    profissionais: 10,
    clientes: 500,
    categorias: Infinity,
    servicosPorCategoria: Infinity,
    fornecedores: 30,
    produtos: 100,
    financeiro: 'completo',
    relatorios: 'completo',
    exportacao: true,
    agendamentoOnline: true,
    notificacoes: 'completo', // ✅ NOVO: Todas + Feedback
    comissoes: true,
    appProfissionais: true
  },
  master: {
    saloes: Infinity,
    profissionais: Infinity,
    clientes: Infinity,
    categorias: Infinity,
    servicosPorCategoria: Infinity,
    fornecedores: Infinity,
    produtos: Infinity,
    financeiro: 'completo',
    relatorios: 'avancado',
    exportacao: true,
    agendamentoOnline: true,
    notificacoes: 'completo', // ✅ NOVO: Todas + Feedback
    comissoes: true,
    appProfissionais: true,
    appPersonalizado: true,
    integracoesExternas: true,
    marketing: true,
    fiscal: true,
    backupNuvem: true,
    suportePrioritario: true
  }
};

// ✅ NOVO: Mapeamento de recursos de notificação por nível
export const NOTIFICATION_FEATURES = {
  confirmacao: ['confirmacao'],
  basico: ['confirmacao', 'cancelamento'],
  avancado: ['confirmacao', 'alteracoes', 'cancelamento'],
  completo: ['confirmacao', 'alteracoes', 'cancelamento', 'avaliacoes', 'lembretes', 'notifyProfissional']
};

// ✅ NOVO: Verificar se o plano permite um tipo específico de notificação
export const hasNotificationAccess = (plano, tipoNotificacao) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const nivelNotificacoes = limits.notificacoes;
  
  if (!nivelNotificacoes || nivelNotificacoes === false) return false;
  
  const features = NOTIFICATION_FEATURES[nivelNotificacoes] || [];
  return features.includes(tipoNotificacao);
};

// ✅ NOVO: Obter recursos de notificação disponíveis para o plano
export const getAvailableNotifications = (plano) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const nivelNotificacoes = limits.notificacoes;
  
  if (!nivelNotificacoes || nivelNotificacoes === false) return [];
  
  return NOTIFICATION_FEATURES[nivelNotificacoes] || [];
};

// Verificar se o plano permite adicionar mais itens
export const canAddMore = (plano, tipo, currentCount) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const limit = limits[tipo];
  
  if (limit === Infinity) return true;
  if (typeof limit === 'number') return currentCount < limit;
  return false;
};

// Verificar se o plano tem acesso a um recurso
export const hasAccess = (plano, recurso) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const access = limits[recurso];
  
  if (typeof access === 'boolean') return access;
  if (typeof access === 'string') return true;
  return false;
};

// Obter mensagem de limite
export const getLimitMessage = (plano, tipo) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const limit = limits[tipo];
  
  if (limit === Infinity) return 'Ilimitado';
  if (typeof limit === 'number') return `Máximo: ${limit}`;
  return 'Não disponível';
};

// Verificar limite de serviços por categoria
export const canAddServiceToCategory = (plano, categoria, servicos) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const limit = limits.servicosPorCategoria;
  
  if (limit === Infinity) return true;
  
  const servicosNaCategoria = servicos.filter(s => s.categoria === categoria).length;
  return servicosNaCategoria < limit;
};

// Obter plano mínimo necessário para um recurso
export const getMinimumPlan = (recurso) => {
  const planos = ['inicial', 'essencial', 'plus', 'profissional', 'premium', 'master'];
  
  for (const plano of planos) {
    if (hasAccess(plano, recurso)) {
      return plano;
    }
  }
  
  return 'master';
};

// ✅ NOVO: Obter plano mínimo para tipo de notificação
export const getMinimumPlanForNotification = (tipoNotificacao) => {
  const planos = ['inicial', 'essencial', 'plus', 'profissional', 'premium', 'master'];
  
  for (const plano of planos) {
    if (hasNotificationAccess(plano, tipoNotificacao)) {
      return plano;
    }
  }
  
  return 'master';
};

// Mensagens de upgrade
export const getUpgradeMessage = (currentPlan, feature) => {
  const minPlan = getMinimumPlan(feature);
  
  const messages = {
    financeiro: {
      title: 'Controle Financeiro Completo',
      description: 'Acesse relatórios financeiros, fluxo de caixa e análises detalhadas.',
      minPlan: 'plus'
    },
    relatorios: {
      title: 'Relatórios Avançados',
      description: 'Gere relatórios detalhados e análises de performance do seu negócio.',
      minPlan: 'essencial'
    },
    notificacoes: {
      title: 'Sistema de Notificações',
      description: 'Envie notificações automáticas para clientes e profissionais.',
      minPlan: 'inicial'
    }
  };
  
  return messages[feature] || {
    title: 'Recurso Premium',
    description: 'Este recurso está disponível em planos superiores.',
    minPlan: minPlan
  };
};