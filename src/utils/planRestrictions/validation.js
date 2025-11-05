// src/utils/planRestrictions/validation.js

import { PLAN_LIMITS } from './planLimits';
import { isDowngrade } from './planComparison';

/**
 * Validar se pode fazer downgrade
 */
export const canDowngrade = (planoAtual, planoNovo, currentData) => {
  if (!isDowngrade(planoAtual, planoNovo)) {
    return { canDowngrade: true };
  }
  
  const newLimits = PLAN_LIMITS[planoNovo];
  const warnings = [];
  
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