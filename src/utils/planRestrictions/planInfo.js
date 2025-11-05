// src/utils/planRestrictions/planInfo.js

import { PLAN_LIMITS } from './planLimits';
import { getAvailableNotifications, getNotificationLevelInfo } from './notificationLevels';

/**
 * Informações de upgrade por recurso
 */
export const getUpgradeMessage = (currentPlan, feature) => {
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
      description: 'Envie notificações automáticas para clientes.',
      minPlan: 'inicial'
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
    minPlan: 'master'
  };
};

/**
 * Obter informações completas de um plano
 */
export const getPlanInfo = (plano) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  
  return {
    nome: plano.charAt(0).toUpperCase() + plano.slice(1),
    limits,
    notificacoes: getAvailableNotifications(plano),
    notificationLevel: getNotificationLevelInfo(plano)
  };
};