// src/utils/planRestrictions/notificationLevels.js - SIMPLIFICADO SEM RESTRIÇÕES

/**
 * ✅ TODAS AS NOTIFICAÇÕES DISPONÍVEIS PARA TODOS OS PLANOS
 * Não há mais níveis ou restrições de notificação
 */

export const NOTIFICATION_FEATURES = {
  todas: ['confirmacao', 'cancelamento', 'alteracao', 'avaliacao', 'aniversario']
};

/**
 * Verificar se plano permite tipo de notificação
 * ✅ SEMPRE RETORNA TRUE - Sem restrições
 */
export const hasNotificationAccess = (plano, tipoNotificacao) => {
  return true; // ✅ Todas as notificações liberadas para todos os planos
};

/**
 * Obter notificações disponíveis para o plano
 * ✅ SEMPRE RETORNA TODAS - Sem restrições
 */
export const getAvailableNotifications = (plano) => {
  return NOTIFICATION_FEATURES.todas; // ✅ Todas as notificações disponíveis
};

/**
 * Obter informações sobre nível de notificação
 * ✅ SEMPRE RETORNA COMPLETO - Sem restrições
 */
export const getNotificationLevelInfo = (plano) => {
  return {
    name: 'Sistema de Notificações Completo',
    description: 'Todas as notificações disponíveis',
    features: [
      'Email de confirmação ao criar agendamento',
      'Email de alteração quando mudar data/horário/profissional',
      'Email de cancelamento quando necessário',
      'Email de solicitação de avaliação após atendimento concluído',
      'Email de aniversário (configurável)'
    ]
  };
};

/**
 * Obter plano mínimo para notificação
 * ✅ SEMPRE RETORNA 'inicial' - Disponível para todos
 */
export const getMinimumPlanForNotification = (tipoNotificacao) => {
  return 'inicial'; // ✅ Disponível desde o plano inicial
};