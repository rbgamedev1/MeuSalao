// src/components/layout/Sidebar.jsx - CORRIGIDO: Bloqueio de recursos premium
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Package, 
  DollarSign, 
  BarChart3,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
  Lock
} from 'lucide-react';
import { SalaoContext } from '../../contexts/SalaoContext';
import { hasAccess } from '../../utils/planRestrictions';

const Sidebar = ({ expanded, setExpanded }) => {
  const location = useLocation();
  const { salaoAtual } = useContext(SalaoContext);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      requiresPlan: false 
    },
    { 
      icon: Calendar, 
      label: 'Agendamentos', 
      path: '/agendamentos',
      requiresPlan: false 
    },
    { 
      icon: Users, 
      label: 'Clientes', 
      path: '/clientes',
      requiresPlan: false 
    },
    { 
      icon: Scissors, 
      label: 'Serviços', 
      path: '/servicos',
      requiresPlan: false 
    },
    { 
      icon: Package, 
      label: 'Produtos', 
      path: '/produtos',
      requiresPlan: false 
    },
    { 
      icon: DollarSign, 
      label: 'Financeiro', 
      path: '/financeiro',
      requiresPlan: 'financeiro', // ✅ Requer Plus ou superior
      minPlan: 'plus'
    },
    { 
      icon: BarChart3, 
      label: 'Relatórios', 
      path: '/relatorios',
      requiresPlan: 'relatorios', // ✅ Requer Essencial ou superior
      minPlan: 'essencial'
    },
    { 
      icon: Bell, 
      label: 'Notificações', 
      path: '/notificacoes',
      requiresPlan: 'notificacoes', // ✅ Requer Essencial ou superior
      minPlan: 'essencial'
    },
    { 
      icon: Settings, 
      label: 'Configurações', 
      path: '/configuracoes',
      requiresPlan: false 
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Verificar se o item está bloqueado
  const isLocked = (item) => {
    if (!item.requiresPlan) return false;
    return !hasAccess(salaoAtual.plano, item.requiresPlan);
  };

  // Obter tooltip para item bloqueado
  const getLockedTooltip = (item) => {
    if (!isLocked(item)) return null;
    return `Disponível no plano ${item.minPlan || 'superior'}`;
  };

  return (
    <>
      {/* Overlay para mobile */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setExpanded(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          bg-gradient-to-b from-purple-600 to-pink-600 text-white 
          transition-all duration-300 flex flex-col
          ${expanded ? 'w-64 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/20">
          {expanded && (
            <h1 className="text-xl font-bold">Meu Salão</h1>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-auto"
          >
            {expanded ? <X size={20} className="lg:hidden" /> : null}
            {expanded ? <ChevronLeft size={20} className="hidden lg:block" /> : <ChevronRight size={20} className="hidden lg:block" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const locked = isLocked(item);
            const tooltip = getLockedTooltip(item);
            
            return (
              <Link
                key={item.path}
                to={locked ? '#' : item.path}
                onClick={(e) => {
                  if (locked) {
                    e.preventDefault();
                    return;
                  }
                  // Fechar sidebar em mobile após clicar
                  if (window.innerWidth < 1024) {
                    setExpanded(false);
                  }
                }}
                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all group relative ${
                  locked 
                    ? 'text-white/40 cursor-not-allowed' 
                    : active 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center flex-shrink-0">
                  <Icon size={24} />
                  {locked && (
                    <Lock size={14} className="absolute top-2 left-7 bg-purple-600 rounded-full p-0.5" />
                  )}
                </div>
                
                {expanded ? (
                  <span className="ml-4 font-medium">{item.label}</span>
                ) : (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 hidden lg:block">
                    {locked ? (
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Lock size={12} />
                          <span>{item.label}</span>
                        </div>
                        <div className="text-xs text-gray-300">{tooltip}</div>
                      </div>
                    ) : (
                      item.label
                    )}
                  </div>
                )}

                {/* Badge de bloqueio no modo expandido */}
                {expanded && locked && (
                  <div className="ml-auto">
                    <Lock size={16} className="text-white/60" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer com informação do plano */}
        <div className="p-4 border-t border-white/20">
          <div className={`flex items-center ${expanded ? 'justify-between' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold flex-shrink-0">
              BS
            </div>
            {expanded && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">Bruna Vidal</p>
                <p className="text-xs text-white/70 capitalize">{salaoAtual.plano}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;