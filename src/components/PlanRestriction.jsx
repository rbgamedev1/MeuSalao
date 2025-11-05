// src/components/PlanRestriction.jsx - Componente para bloqueio de recursos por plano

import { Crown, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlanRestriction = ({ feature, minPlan }) => {
  const navigate = useNavigate();

  const featureInfo = {
    financeiro: {
      title: 'Controle Financeiro Completo',
      description: 'Acesse relatórios financeiros, fluxo de caixa e análises detalhadas de receitas e despesas.',
      icon: '💰',
      benefits: [
        'Controle completo de receitas e despesas',
        'Gráficos de fluxo de caixa',
        'Relatórios por categoria',
        'Análise de formas de pagamento'
      ]
    },
    relatorios: {
      title: 'Relatórios Avançados',
      description: 'Gere relatórios detalhados e análises de performance do seu negócio.',
      icon: '📊',
      benefits: [
        'Relatórios de faturamento',
        'Análise de serviços mais vendidos',
        'Performance de profissionais',
        'Estatísticas de clientes'
      ]
    },
    notificacoes: {
      title: 'Sistema de Notificações',
      description: 'Envie notificações automáticas para clientes e profissionais por email.',
      icon: '📧',
      benefits: [
        'Confirmações automáticas de agendamento',
        'Lembretes 24h antes',
        'Notificações de cancelamento',
        'Solicitação de avaliações'
      ]
    },
    agendamentoOnline: {
      title: 'Agenda Online',
      description: 'Compartilhe seu link de agendamento e receba reservas 24/7.',
      icon: '🌐',
      benefits: [
        'Link compartilhável personalizado',
        'Agendamentos 24 horas por dia',
        'Sincronização em tempo real',
        'Confirmações automáticas'
      ]
    }
  };

  const info = featureInfo[feature] || {
    title: 'Recurso Premium',
    description: 'Este recurso está disponível em planos superiores.',
    icon: '⭐',
    benefits: ['Acesso a recursos avançados', 'Maior controle do negócio']
  };

  const planNames = {
    essencial: { name: 'Essencial', price: 'R$ 29,90/mês', color: 'from-blue-600 to-cyan-600' },
    plus: { name: 'Plus', price: 'R$ 49,50/mês', color: 'from-purple-600 to-pink-600' },
    profissional: { name: 'Profissional', price: 'R$ 79,90/mês', color: 'from-orange-600 to-red-600' },
    premium: { name: 'Premium', price: 'R$ 99,90/mês', color: 'from-green-600 to-emerald-600' },
    master: { name: 'Master', price: 'R$ 149,90/mês', color: 'from-indigo-600 to-purple-600' }
  };

  const planInfo = planNames[minPlan] || planNames.essencial;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header com Gradiente */}
          <div className={`bg-gradient-to-r ${planInfo.color} p-8 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 opacity-10">
              <Crown size={200} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl">
                  {info.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Lock size={20} />
                    <span className="text-sm font-medium opacity-90">Recurso Bloqueado</span>
                  </div>
                  <h1 className="text-3xl font-bold">{info.title}</h1>
                </div>
              </div>
              <p className="text-lg opacity-90 max-w-xl">
                {info.description}
              </p>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            {/* Plano Necessário */}
            <div className="mb-8">
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Necessário Plano</p>
                    <p className="text-2xl font-bold text-gray-900">{planInfo.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{planInfo.price}</p>
                  <p className="text-sm text-gray-500">por mês</p>
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">✨</span>
                O que você terá acesso:
              </h3>
              <div className="space-y-3">
                {info.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/configuracoes')}
                className={`w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r ${planInfo.color} text-white rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all`}
              >
                <Crown size={24} />
                <span>Fazer Upgrade Agora</span>
                <ArrowRight size={24} />
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Voltar ao Dashboard
              </button>
            </div>

            {/* Informação Extra */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                💡 <strong>Dica:</strong> O upgrade é instantâneo! Comece a usar todos os recursos imediatamente após a ativação.
              </p>
            </div>
          </div>
        </div>

        {/* Info Adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Dúvidas sobre os planos? <a href="/configuracoes" className="text-purple-600 hover:text-purple-700 underline font-medium">Compare todos os planos disponíveis</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanRestriction;