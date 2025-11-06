// src/data/planosData.js - APENAS 3 PLANOS DISPONÍVEIS

export const PLANOS_DATA = [
  {
    id: 'inicial',
    nome: 'Plano Inicial',
    preco: 'Gratuito',
    destaque: false,
    disponivel: true,
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
  },
  {
    id: 'essencial',
    nome: 'Plano Essencial',
    preco: 'R$ 29,90',
    destaque: false,
    disponivel: true,
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
  },
  {
    id: 'profissional',
    nome: 'Plano Profissional',
    preco: 'R$ 79,90',
    destaque: true,
    disponivel: true,
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
  },
  // PLANOS FUTUROS - Desabilitados temporariamente
  {
    id: 'plus',
    nome: 'Plano Plus',
    preco: 'R$ 49,50',
    destaque: false,
    disponivel: false, // ← DESABILITADO
    recursos: [
      'Em breve...',
      'Recursos intermediários',
      'Entre em contato para mais informações'
    ]
  },
  {
    id: 'premium',
    nome: 'Plano Premium',
    preco: 'R$ 99,90',
    destaque: false,
    disponivel: false, // ← DESABILITADO
    recursos: [
      'Em breve...',
      'Recursos avançados',
      'Entre em contato para mais informações'
    ]
  },
  {
    id: 'master',
    nome: 'Plano Master',
    preco: 'R$ 149,90',
    destaque: false,
    disponivel: false, // ← DESABILITADO
    recursos: [
      'Em breve...',
      'Recursos premium',
      'Entre em contato para mais informações'
    ]
  }
];

// Apenas planos disponíveis para compra
export const PLANOS_DISPONIVEIS = PLANOS_DATA.filter(p => p.disponivel);