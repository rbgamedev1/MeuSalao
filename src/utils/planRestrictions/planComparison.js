// src/utils/planRestrictions/planComparison.js

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