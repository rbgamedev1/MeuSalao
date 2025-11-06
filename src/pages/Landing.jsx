// src/pages/Landing.jsx - ATUALIZADO COM AUTENTICAÇÃO

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  DollarSign, 
  Scissors, 
  Bell,
  BarChart3,
  CheckCircle,
  Menu,
  X,
  Sparkles,
  LogIn
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import RegisterModal from '../components/auth/RegisterModal';
import LoginModal from '../components/auth/LoginModal';

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser, register, login } = useContext(AuthContext);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Se já está logado, redirecionar para dashboard
  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  const handleRegister = async (userData) => {
    const result = await register(userData);
    
    if (result.success) {
      // Redirecionar para dashboard
      navigate('/dashboard');
    }
    
    return result;
  };

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    return result;
  };

  const features = [
    {
      icon: Calendar,
      title: 'Agenda Inteligente',
      description: 'Agendamentos online 24/7 com sincronização em tempo real'
    },
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Cadastro completo com histórico de visitas e preferências'
    },
    {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Relatórios de receitas, despesas e fluxo de caixa'
    },
    {
      icon: Bell,
      title: 'Notificações Automáticas',
      description: 'Confirmações e lembretes por email para seus clientes'
    },
    {
      icon: Scissors,
      title: 'Catálogo de Serviços',
      description: 'Organize serviços, preços e comissões dos profissionais'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Avançados',
      description: 'Análises de performance e métricas do seu negócio'
    }
  ];

  const plans = [
    {
      name: 'Inicial',
      price: 'Gratuito',
      features: [
        '1 salão',
        '1 profissional',
        'Até 10 clientes',
        'Agendamento básico',
        'Notificações de confirmação',
        'Suporte por email'
      ],
      highlight: false
    },
    {
      name: 'Essencial',
      price: 'R$ 29,90',
      period: '/mês',
      features: [
        '1 salão',
        'Até 2 profissionais',
        'Até 30 clientes',
        'Agenda online compartilhável',
        'Notificações automáticas',
        'Relatórios de agendamentos'
      ],
      highlight: false
    },
    {
      name: 'Profissional',
      price: 'R$ 79,90',
      period: '/mês',
      features: [
        'Até 2 salões',
        'Até 10 profissionais',
        'Até 300 clientes',
        'Financeiro completo',
        'Todas notificações',
        'Relatórios avançados',
        'Link personalizado',
        'Análise de comissões'
      ],
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Scissors className="text-purple-600" size={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SalãoPro
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
                Planos
              </a>
              <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">
                Contato
              </a>
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <LogIn size={18} />
                <span>Entrar</span>
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Começar Agora
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-purple-600">
                Recursos
              </a>
              <a href="#pricing" className="block text-gray-700 hover:text-purple-600">
                Planos
              </a>
              <a href="#contact" className="block text-gray-700 hover:text-purple-600">
                Contato
              </a>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowLoginModal(true);
                }}
                className="w-full px-6 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowRegisterModal(true);
                }}
                className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
              >
                Começar Agora
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Sistema Completo para Salões de Beleza</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Gerencie seu salão com{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                inteligência
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Agende, organize e cresça seu negócio com a solução completa 
              que já ajuda centenas de salões no Brasil
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                <span>Começar Gratuitamente</span>
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="w-full sm:w-auto px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all text-lg font-semibold"
              >
                Já tenho conta
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              ✨ Sem cartão de crédito • Plano gratuito para sempre • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-gray-600">
              Recursos completos para transformar a gestão do seu salão
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos para todo tipo de negócio
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o seu salão
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl transform scale-105'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <div className="text-center mb-4">
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      RECOMENDADO
                    </span>
                  </div>
                )}

                <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-purple-600'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={plan.highlight ? 'text-white/80' : 'text-gray-600'}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle 
                        size={20} 
                        className={plan.highlight ? 'text-white flex-shrink-0' : 'text-green-500 flex-shrink-0'} 
                      />
                      <span className={plan.highlight ? 'text-white' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowRegisterModal(true)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  Começar Agora
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-6 py-4">
              <p className="text-sm text-blue-900">
                💡 <strong>Novos planos em breve!</strong> Estamos preparando mais opções para atender melhor seu negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para transformar seu salão?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Junte-se a centenas de salões que já modernizaram sua gestão
          </p>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all shadow-lg text-lg font-semibold inline-flex items-center space-x-2"
          >
            <span>Começar Gratuitamente</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Scissors size={24} />
                <span className="text-xl font-bold">SalãoPro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sistema completo para gestão de salões de beleza
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white">Planos</a></li>
                <li><button onClick={() => setShowRegisterModal(true)} className="hover:text-white">Demonstração</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#contact" className="hover:text-white">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 SalãoPro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modais */}
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
      />

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegisterModal(true)}
      />
    </div>
  );
};

export default Landing;