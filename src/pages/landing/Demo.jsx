// src/pages/landing/Demo.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Calendar, Users, DollarSign, BarChart3, CheckCircle } from 'lucide-react';

const Demo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('agenda');

  const features = {
    agenda: {
      icon: Calendar,
      title: 'Agenda Inteligente',
      description: 'Sistema de agendamento completo com visualização diária, semanal e mensal',
      image: '📅',
      benefits: [
        'Agendamentos online 24/7',
        'Sincronização em tempo real',
        'Visualização por profissional',
        'Confirmações automáticas',
        'Bloqueio de horários'
      ]
    },
    clientes: {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Cadastro completo com histórico e preferências',
      image: '👥',
      benefits: [
        'Fichas completas de clientes',
        'Histórico de atendimentos',
        'Preferências e observações',
        'Aniversariantes do mês',
        'Busca rápida e inteligente'
      ]
    },
    financeiro: {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Acompanhe receitas, despesas e fluxo de caixa',
      image: '💰',
      benefits: [
        'Registro de receitas e despesas',
        'Cálculo de comissões',
        'Relatórios financeiros',
        'Formas de pagamento',
        'Fluxo de caixa detalhado'
      ]
    },
    relatorios: {
      icon: BarChart3,
      title: 'Relatórios e Analytics',
      description: 'Análises completas do desempenho do seu salão',
      image: '📊',
      benefits: [
        'Dashboard com métricas principais',
        'Serviços mais vendidos',
        'Performance por profissional',
        'Taxa de ocupação',
        'Tendências e insights'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Play size={16} />
            <span className="text-sm font-medium">Demonstração Interativa</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conheça o SalãoPro
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore os principais recursos do sistema e veja como ele pode transformar a gestão do seu salão
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200">
            {Object.entries(features).map(([key, feature]) => {
              const Icon = feature.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`p-4 flex flex-col items-center space-y-2 transition-all ${
                    activeTab === key
                      ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-sm font-medium hidden md:block">{feature.title}</span>
                </button>
              );
            })}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-12 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="text-8xl mb-4">{features[activeTab].image}</div>
                  <p className="text-purple-600 font-medium">
                    Visualização do recurso
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {features[activeTab].title}
                </h2>
                
                <p className="text-gray-600 mb-6 text-lg">
                  {features[activeTab].description}
                </p>

                <div className="space-y-3">
                  {features[activeTab].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Vídeo Demonstrativo
            </h2>
            <p className="text-gray-600">
              Assista como o SalãoPro funciona na prática
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <Play size={64} className="text-purple-600 mx-auto mb-4" />
              <p className="text-purple-600 font-medium">
                Vídeo demonstrativo em breve
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Experimentar?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Crie sua conta gratuita e comece a usar todos esses recursos hoje mesmo
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg text-lg font-semibold"
          >
            Começar Gratuitamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Demo;