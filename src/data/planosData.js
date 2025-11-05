// src/data/planosData.js - Dados centralizados dos planos

export const PLANOS_DATA = [
  {
    id: 'inicial',
    nome: 'Plano Inicial',
    preco: 'Gratuito',
    destaque: false,
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
    id: 'plus',
    nome: 'Plano Plus',
    preco: 'R$ 49,50',
    destaque: false,
    recursos: [
      '1 salão',
      'Até 5 profissionais',
      'Até 100 clientes',
      '5 categorias, 5 serviços por categoria',
      '5 fornecedores, 15 produtos',
      '✅ Controle financeiro simples',
      '✅ Agenda online avançada',
      '✅ Notificações: confirmação + cancelamento',
      '✅ Relatórios básicos',
      '❌ Sem notificações de alteração/avaliação'
    ]
  },
  {
    id: 'profissional',
    nome: 'Plano Profissional',
    preco: 'R$ 79,90',
    destaque: true,
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
      '✅ Análise de comissões',
      '❌ Sem solicitação de avaliação automática'
    ]
  },
  {
    id: 'premium',
    nome: 'Plano Premium',
    preco: 'R$ 99,90',
    destaque: false,
    recursos: [
      'Até 5 salões',
      'Até 10 profissionais por salão',
      'Até 500 clientes por salão',
      'Categorias e serviços ilimitados',
      '30 fornecedores, 100 produtos',
      '✅ Financeiro completo',
      '✅ Relatórios multi-salão',
      '✅ TODAS as notificações (confirmação, alteração, cancelamento)',
      '✅ Solicitação automática de avaliação/feedback',
      '✅ Análises comparativas',
      '✅ Previsões e projeções'
    ]
  },
  {
    id: 'master',
    nome: 'Plano Master',
    preco: 'R$ 149,90',
    destaque: false,
    recursos: [
      'Salões ilimitados',
      'Profissionais ilimitados',
      'Clientes ilimitados',
      'Todos recursos liberados',
      '✅ TODAS as notificações incluindo avaliações',
      '✅ Estoque, campanhas e integrações',
      '✅ Marketing e fiscal (NFe)',
      '✅ Histórico completo',
      '✅ Backup em nuvem',
      '✅ Prioridade no suporte',
      '✅ App personalizado',
      '✅ Relatórios customizáveis'
    ]
  }
];