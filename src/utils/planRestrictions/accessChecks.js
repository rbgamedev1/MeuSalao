// src/utils/planRestrictions/accessChecks.js

import { PLAN_LIMITS } from './planLimits';

/**
 * Verificar se plano permite adicionar mais itens
 */
export const canAddMore = (plano, tipo, currentCount) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const limit = limits[tipo];
  
  if (limit === Infinity) return true;
  if (typeof limit === 'number') return currentCount < limit;
  return false;
};

/**
 * Verificar se plano tem acesso a recurso
 */
export const hasAccess = (plano, recurso) => {
  const limits = PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
  const access = limits[recurso];
  
  if (typeof access === 'boolean') return access;
  if (typeof access === 'string') return true;
  if (access === Infinity) return true;
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

/**
 * Obter plano mínimo para recurso
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