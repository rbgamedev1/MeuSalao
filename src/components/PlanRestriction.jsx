// src/components/PlanRestriction.jsx
import { Lock, Crown, Check, ArrowRight } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SalaoContext } from '../contexts/SalaoContext';

const PlanRestriction = ({ feature, minPlan = 'essencial' }) => {
  const { salaoAtual } = useContext(SalaoContext);
  const navigate = useNavigate();

  const planos = {
    'inicial': { ordem: 0, nome: 'Inicial', preco: 'Gratuito' },
    'essencial': { ordem: 1, nome: 'Essencial', preco: 'R$ 29,90/mês' },
    'plus': { ordem: 2, nome: 'Plus', preco: 'R$ 49,50/mês' },
    'profissional': { ordem: 3, nome: 'Profissional', preco: 'R$ 79,90/mês' },
    'premium': { ordem: 4, nome: 'Premium', preco: 'R$ 99,90/mês' },
    'master': { ordem: 5, nome: 'Master', preco: 'R$ 149,90/mês' }
  };

  const features = {
    'financeiro': {
      title: 'Controle Financeiro Completo',
      description: 'Gerencie receitas, despesas, fluxo de caixa e tenha visão completa da saúde financeira do seu salão.',
      benefits: [
        'Controle completo de receitas e despesas',
        'Fluxo de caixa detalhado',
        'Gráficos e análises financeiras',
        'Múltiplas formas de pagamento',
        'Categorização de transações',
        'Relatórios de faturamento'
      ]
    },
    'relatorios': {
      title: 'Relatórios Avançados e Análises',
      description: 'Tome decisões baseadas em dados com relatórios detalhados sobre seu negócio.',
      benefits: [
        'Relatórios de faturamento e performance',
        'Análise de serviços mais vendidos',
        'Performance de profissionais',
        'Horários de maior movimento',
        'Top clientes e análises de retenção',
        'Exportação de dados em PDF',
        'Gráficos interativos e dashboards'
      ]
    }
  };

  const featureInfo = features[feature] || features['financeiro'];
  const planoMinimo = planos[minPlan];

  const handleUpgrade = () => {
    navigate('/configuracoes');
    // Scroll to planos tab after navigation
    setTimeout(() => {
      const planosTab = document.querySelector('[data-tab="planos"]');
      if (planosTab) planosTab.click();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                  <Lock size={48} className="text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                {featureInfo.title}
              </h1>
              <p className="text-center text-purple-100 text-lg max-w-2xl mx-auto">
                {featureInfo.description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Current Plan Alert */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Crown className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-800">
                    Você está no <span className="font-bold">Plano {planos[salaoAtual.plano].nome}</span>
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Este recurso está disponível a partir do <span className="font-bold">Plano {planoMinimo.nome}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Check className="text-green-500 mr-2" size={24} />
                O que você terá acesso:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureInfo.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Highlight */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-600 text-sm mb-1">Upgrade para o</p>
                  <p className="text-2xl font-bold text-purple-900">{planoMinimo.nome}</p>
                  <p className="text-sm text-gray-600 mt-1">Por apenas</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {planoMinimo.preco}
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-gray-600 mb-2">Ou escolha um plano ainda mais completo</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    {Object.entries(planos)
                      .filter(([key, p]) => p.ordem >= planoMinimo.ordem && p.ordem > planos[salaoAtual.plano].ordem)
                      .slice(0, 3)
                      .map(([key, p]) => (
                        <span key={key} className="text-xs bg-white px-3 py-1 rounded-full text-purple-700 font-medium border border-purple-200">
                          {p.nome}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUpgrade}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Crown size={20} />
                <span className="font-semibold">Fazer Upgrade Agora</span>
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all"
              >
                <span className="font-semibold">Voltar ao Dashboard</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                ✨ <strong>Sem compromisso:</strong> Você pode fazer upgrade ou downgrade a qualquer momento
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-purple-600">14 dias</p>
              <p className="text-xs text-gray-600 mt-1">Garantia</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-pink-600">Sem taxas</p>
              <p className="text-xs text-gray-600 mt-1">Ocultas</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-2xl font-bold text-purple-600">Suporte</p>
              <p className="text-xs text-gray-600 mt-1">Dedicado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanRestriction;