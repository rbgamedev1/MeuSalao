// src/utils/planRestrictions/planLimits.js - SEM RESTRIÇÕES DE NOTIFICAÇÕES

/**
 * Definição de limites quantitativos e recursos por plano
 * ✅ NOTIFICAÇÕES E COMUNICAÇÕES: Sempre liberadas para todos os planos
 */
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
    notificacoes: true, // ✅ SEMPRE LIBERADO
    comunicacoes: true, // ✅ SEMPRE LIBERADO
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
    notificacoes: true, // ✅ SEMPRE LIBERADO
    comunicacoes: true, // ✅ SEMPRE LIBERADO
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
    notificacoes: true, // ✅ SEMPRE LIBERADO
    comunicacoes: true, // ✅ SEMPRE LIBERADO
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
    notificacoes: true, // ✅ SEMPRE LIBERADO
    comunicacoes: true, // ✅ SEMPRE LIBERADO
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
    notificacoes: true, // ✅ SEMPRE LIBERADO
    comunicacoes: true, // ✅ SEMPRE LIBERADO
    comissoes: true,
    appProfissionais: true,
    relatoriosMultiSalao: true
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
    notificacoes: true, // ✅ SEMPRE LIBERADO
    comunicacoes: true, // ✅ SEMPRE LIBERADO
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

/**
 * Obter limites de um plano específico
 */
export const getPlanLimits = (plano) => {
  return PLAN_LIMITS[plano] || PLAN_LIMITS.inicial;
};