// src/utils/planRestrictions/notificationLevels.js

/**
 * Recursos de notificação por nível
 */
export const NOTIFICATION_FEATURES = {
  minimo: ['confirmacao'],
  basico: ['confirmacao', 'cancelamento'],
  avancado: ['confirmacao', 'cancelamento', 'alteracoes'],
  completo: ['confirmacao', 'cancelamento', 'alteracoes', 'avaliacoes']
};

/**
 * Informações detalhadas sobre níveis de notificação
 */
export const NOTIFICATION_LEVELS_INFO = {
  minimo: {
    name: 'Notificações Básicas',
    description: 'Confirmações de agendamento',
    features: ['Email de confirmação ao criar agendamento']
  },
  basico: {
    name: 'Notificações Essenciais',
    description: 'Confirmações e cancelamentos',
    features: [
      'Email de confirmação ao criar agendamento',
      'Email de cancelamento quando necessário'
    ]
  },
  avancado: {
    name: 'Notificações Avançadas',
    description: 'Confirmações, alterações e cancelamentos',
    features: [
      'Email de confirmação ao criar agendamento',
      'Email de alteração quando mudar data/horário/profissional',
      'Email de cancelamento quando necessário'
    ]
  },
  completo: {
    name: 'Notificações Completas',
    description: 'Todas as notificações incluindo feedback',
    features: [
      'Email de confirmação ao criar agendamento',
      'Email de alteração quando mudar data/horário/profissional',
      'Email de cancelamento quando necessário',
      'Email de solicitação de avaliação após atendimento concluído'
    ]
  }
};

/**
 * Verificar se plano permite tipo de notificação
 */
export const hasNotificationAccess = (plano, tipoNotificacao) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const nivelNotificacoes = limits.notificacoes;
  
  if (!nivelNotificacoes || nivelNotificacoes === false) return false;
  
  const features = NOTIFICATION_FEATURES[nivelNotificacoes] || [];
  return features.includes(tipoNotificacao);
};

/**
 * Obter notificações disponíveis para o plano
 */
export const getAvailableNotifications = (plano) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const nivelNotificacoes = limits.notificacoes;
  
  if (!nivelNotificacoes || nivelNotificacoes === false) return [];
  
  return NOTIFICATION_FEATURES[nivelNotificacoes] || [];
};

/**
 * Obter informações sobre nível de notificação
 */
export const getNotificationLevelInfo = (plano) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const nivelNotificacoes = limits.notificacoes;
  
  if (!nivelNotificacoes || nivelNotificacoes === false) {
    return {
      name: 'Sem Notificações',
      description: 'Plano não inclui sistema de notificações',
      features: []
    };
  }
  
  return NOTIFICATION_LEVELS_INFO[nivelNotificacoes] || NOTIFICATION_LEVELS_INFO.minimo;
};

/**
 * Obter plano mínimo para notificação
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

// Importar PLAN_LIMITS do módulo correto
import { PLAN_LIMITS } from './planLimits';