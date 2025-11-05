// src/utils/planRestrictions.js - ARQUIVO ÚNICO E CONSOLIDADO

// ============================================
// DEFINIÇÃO DE LIMITES POR PLANO
// ============================================

export const PLAN_LIMITS = {
  inicial: {
    // Limites Quantitativos
    saloes: 1,
    profissionais: 1,
    clientes: 10,
    categorias: 2,
    servicosPorCategoria: 2,
    fornecedores: 1,
    produtos: 3,
    
    // Recursos Funcionais
    financeiro: false,
    relatorios: false,
    exportacao: false,
    agendamentoOnline: false,
    notificacoes: false, // ❌ SEM notificações
    comissoes: false
  },
  
  essencial: {
    // Limites Quantitativos
    saloes: 1,
    profissionais: 2,
    clientes: 30,
    categorias: 3,
    servicosPorCategoria: 3,
    fornecedores: 2,
    produtos: 5,
    
    // Recursos Funcionais
    financeiro: false,
    relatorios: 'basico',
    exportacao: false,
    agendamentoOnline: true,
    notificacoes: 'basico', // ✅ Confirmações + Cancelamentos + Lembretes + Avaliações
    comissoes: false
  },
  
  plus: {
    // Limites Quantitativos
    saloes: 1,
    profissionais: 5,
    clientes: 100,
    categorias: 5,
    servicosPorCategoria: 5,
    fornecedores: 5,
    produtos: 15,
    
    // Recursos Funcionais
    financeiro: 'simples',
    relatorios: 'basico',
    exportacao: false,
    agendamentoOnline: true,
    notificacoes: 'basico', // ✅ Confirmações + Cancelamentos + Lembretes + Avaliações
    comissoes: true
  },
  
  profissional: {
    // Limites Quantitativos
    saloes: 2,
    profissionais: 10,
    clientes: 300,
    categorias: Infinity,
    servicosPorCategoria: Infinity,
    fornecedores: 10,
    produtos: 30,
    
    // Recursos Funcionais
    financeiro: 'completo',
    relatorios: 'completo',
    exportacao: true,
    agendamentoOnline: true,
    notificacoes: 'avancado', // ✅ + Alterações + Notificar Profissional
    comissoes: true,
    appProfissionais: true
  },
  
  premium: {
    // Limites Quantitativos
    saloes: 5,
    profissionais: 10,
    clientes: 500,
    categorias: Infinity,
    servicosPorCategoria: Infinity,
    fornecedores: 30,
    produtos: 100,
    
    // Recursos Funcionais
    financeiro: 'completo',
    relatorios: 'completo',
    exportacao: true,
    agendamentoOnline: true,
    notificacoes: 'completo', // ✅ TODAS as notificações
    comissoes: true,
    appProfissionais: true,
    relatoriosMultiSalao: true
  },
  
  master: {
    // Limites Quantitativos
    saloes: Infinity,
    profissionais: Infinity,
    clientes: Infinity,
    categorias: Infinity,
    servicosPorCategoria: Infinity,
    fornecedores: Infinity,
    produtos: Infinity,
    
    // Recursos Funcionais
    financeiro: 'completo',
    relatorios: 'avancado',
    exportacao: true,
    agendamentoOnline: true,
    notificacoes: 'completo', // ✅ TODAS as notificações
    comissoes: true,
    appProfissionais: true,
    appPersonalizado: true,
    integracoesExternas: true,
    marketing: true,
    fiscal: true,
    backupNuvem: true,
    suportePrioritario: true,
    relatoriosCustomizaveis: true
  }
};

// ============================================
// MAPEAMENTO DE NOTIFICAÇÕES POR NÍVEL
// ============================================

export const NOTIFICATION_FEATURES = {
  // Plano Inicial: SEM notificações
  false: [],
  
  // Plano Essencial/Plus: Notificações Básicas
  basico: [
    'confirmacao',      // ✅ Email de confirmação
    'cancelamento',     // ✅ Email de cancelamento
    'lembretes',        // ✅ Lembretes 24h antes
    'avaliacoes'        // ✅ Solicitação de avaliação
  ],
  
  // Plano Profissional: Notificações Avançadas
  avancado: [
    'confirmacao',
    'cancelamento',
    'lembretes',
    'avaliacoes',
    'alteracoes',         // ✅ Notificação de alteração
    'notifyProfissional'  // ✅ Notificar profissional
  ],
  
  // Plano Premium/Master: Todas as Notificações
  completo: [
    'confirmacao',
    'cancelamento',
    'lembretes',
    'avaliacoes',
    'alteracoes',
    'notifyProfissional'
  ]
};

// ============================================
// FUNÇÕES DE VERIFICAÇÃO DE ACESSO
// ============================================

/**
 * Verificar se o plano permite adicionar mais itens
 */
export const canAddMore = (plano, tipo, currentCount) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const limit = limits[tipo];
  
  if (limit === Infinity) return true;
  if (typeof limit === 'number') return currentCount < limit;
  return false;
};

/**
 * Verificar se o plano tem acesso a um recurso
 */
export const hasAccess = (plano, recurso) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const access = limits[recurso];
  
  // Para booleanos, retornar o valor direto
  if (typeof access === 'boolean') return access;
  
  // Para strings (níveis de acesso), considerar true se não for false
  if (typeof access === 'string') return true;
  
  // Para Infinity, retornar true
  if (access === Infinity) return true;
  
  // Para números maiores que 0, retornar true
  if (typeof access === 'number') return access > 0;
  
  return false;
};

/**
 * Obter mensagem de limite
 */
export const getLimitMessage = (plano, tipo) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const limit = limits[tipo];
  
  if (limit === Infinity) return 'Ilimitado';
  if (typeof limit === 'number') return `Máximo: ${limit}`;
  if (limit === false) return 'Não disponível';
  return 'Disponível';
};

/**
 * Verificar limite de serviços por categoria
 */
export const canAddServiceToCategory = (plano, categoria, servicos) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const limit = limits.servicosPorCategoria;
  
  if (limit === Infinity) return true;
  
  const servicosNaCategoria = servicos.filter(s => s.categoria === categoria).length;
  return servicosNaCategoria < limit;
};

// ============================================
// FUNÇÕES DE NOTIFICAÇÕES
// ============================================

/**
 * Verificar se o plano permite um tipo específico de notificação
 */
export const hasNotificationAccess = (plano, tipoNotificacao) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const nivelNotificacoes = limits.notificacoes;
  
  // Se notificações estão desabilitadas (false)
  if (!nivelNotificacoes || nivelNotificacoes === false) {
    return false;
  }
  
  // Obter features disponíveis para este nível
  const features = NOTIFICATION_FEATURES[nivelNotificacoes] || [];
  
  return features.includes(tipoNotificacao);
};

/**
 * Obter recursos de notificação disponíveis para o plano
 */
export const getAvailableNotifications = (plano) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const nivelNotificacoes = limits.notificacoes;
  
  if (!nivelNotificacoes || nivelNotificacoes === false) {
    return [];
  }
  
  return NOTIFICATION_FEATURES[nivelNotificacoes] || [];
};

/**
 * Obter plano mínimo para tipo de notificação
 */
export const getMinimumPlanForNotification = (tipoNotificacao) => {
  const planos = ['inicial', 'essencial', 'plus', 'profissional', 'premium', 'master'];
  
  for (const plano of planos) {
    if (hasNotificationAccess(plano, tipoNotificacao)) {
      return plano;
    }
  }
  
  return 'master';
};

// ============================================
// FUNÇÕES DE PLANOS MÍNIMOS
// ============================================

/**
 * Obter plano mínimo necessário para um recurso
 */
export const getMinimumPlan = (recurso) => {
  const planos = ['inicial', 'essencial', 'plus', 'profissional', 'premium', 'master'];
  
  for (const plano of planos) {
    if (hasAccess(plano, recurso)) {
      return plano;
    }
  }
  
  return 'master';
};

// ============================================
// MENSAGENS DE UPGRADE
// ============================================

/**
 * Obter mensagem de upgrade para um recurso
 */
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
      minPlan: 'essencial'
    },
    agendamentoOnline: {
      title: 'Agenda Online',
      description: 'Compartilhe seu link de agendamento e receba reservas 24/7.',
      minPlan: 'essencial'
    },
    exportacao: {
      title: 'Exportação de Relatórios',
      description: 'Exporte relatórios em PDF e Excel para análises externas.',
      minPlan: 'profissional'
    }
  };
  
  return messages[feature] || {
    title: 'Recurso Premium',
    description: 'Este recurso está disponível em planos superiores.',
    minPlan: minPlan
  };
};

// ============================================
// INFORMAÇÕES DE PLANOS
// ============================================

/**
 * Obter informações completas sobre um plano
 */
export const getPlanInfo = (plano) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  
  return {
    nome: plano.charAt(0).toUpperCase() + plano.slice(1),
    limits,
    notificacoes: getAvailableNotifications(plano)
  };
};

/**
 * Comparar dois planos
 */
export const comparePlans = (plano1, plano2) => {
  const planos = ['inicial', 'essencial', 'plus', 'profissional', 'premium', 'master'];
  const index1 = planos.indexOf(plano1);
  const index2 = planos.indexOf(plano2);
  
  if (index1 === -1 || index2 === -1) return 0;
  
  return index1 - index2;
};

/**
 * Verificar se é upgrade
 */
export const isUpgrade = (planoAtual, planoNovo) => {
  return comparePlans(planoAtual, planoNovo) < 0;
};

/**
 * Verificar se é downgrade
 */
export const isDowngrade = (planoAtual, planoNovo) => {
  return comparePlans(planoAtual, planoNovo) > 0;
};

// ============================================
// VALIDAÇÕES
// ============================================

/**
 * Validar se pode fazer downgrade
 */
export const canDowngrade = (planoAtual, planoNovo, currentData) => {
  if (!isDowngrade(planoAtual, planoNovo)) {
    return { canDowngrade: true };
  }
  
  const newLimits = PLAN_LIMITS[planoNovo];
  const warnings = [];
  
  // Verificar cada limite
  Object.keys(currentData).forEach(key => {
    const currentCount = currentData[key];
    const newLimit = newLimits[key];
    
    if (typeof newLimit === 'number' && currentCount > newLimit) {
      warnings.push({
        tipo: key,
        atual: currentCount,
        novo: newLimit,
        excedente: currentCount - newLimit
      });
    }
  });
  
  return {
    canDowngrade: warnings.length === 0,
    warnings
  };
};

// ============================================
// EXPORTS
// ============================================

export default {
  PLAN_LIMITS,
  NOTIFICATION_FEATURES,
  canAddMore,
  hasAccess,
  getLimitMessage,
  canAddServiceToCategory,
  hasNotificationAccess,
  getAvailableNotifications,
  getMinimumPlanForNotification,
  getMinimumPlan,
  getUpgradeMessage,
  getPlanInfo,
  comparePlans,
  isUpgrade,
  isDowngrade,
  canDowngrade
};