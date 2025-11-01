import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Package, 
  DollarSign, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ expanded, setExpanded }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Agendamentos', path: '/agendamentos' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: Scissors, label: 'Serviços', path: '/servicos' },
    { icon: Package, label: 'Produtos', path: '/produtos' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
    { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div 
      className={`bg-gradient-to-b from-purple-600 to-pink-600 text-white transition-all duration-300 flex flex-col ${
        expanded ? 'w-64' : 'w-20'
      }`}
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
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all group relative ${
                active 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={24} className="flex-shrink-0" />
              
              {expanded ? (
                <span className="ml-4 font-medium">{item.label}</span>
              ) : (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <div className={`flex items-center ${expanded ? 'justify-between' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            BS
          </div>
          {expanded && (
            <div className="ml-3">
              <p className="text-sm font-medium">Bruna Silva</p>
              <p className="text-xs text-white/70">Administrador</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;