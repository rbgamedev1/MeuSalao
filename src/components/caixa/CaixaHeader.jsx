// src/components/caixa/CaixaHeader.jsx
import { ShoppingCart, FileText, History } from 'lucide-react';

const CaixaHeader = ({ salaoNome, abaAtiva, setAbaAtiva }) => {
  const abas = [
    { id: 'rapido', label: 'Atendimento Rápido', icon: ShoppingCart, color: 'green' },
    { id: 'comandas', label: 'Comandas', icon: FileText, color: 'purple' },
    { id: 'historico', label: 'Histórico', icon: History, color: 'blue' }
  ];

  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Caixa</h1>
        <p className="text-gray-600 mt-1">Sistema de vendas e cobranças - {salaoNome}</p>
      </div>

      {/* Abas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="grid grid-cols-3 gap-2">
          {abas.map(aba => {
            const Icon = aba.icon;
            const isActive = abaAtiva === aba.id;
            
            const colorClasses = {
              green: isActive ? 'bg-green-600 text-white' : 'text-green-600 hover:bg-green-50',
              purple: isActive ? 'bg-purple-600 text-white' : 'text-purple-600 hover:bg-purple-50',
              blue: isActive ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'
            };
            
            return (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${colorClasses[aba.color]}`}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{aba.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
            <Icon className="text-blue-600" size={20}>
              {abas.find(a => a.id === abaAtiva)?.icon}
            </Icon>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              {abaAtiva === 'rapido' && '💡 Atendimento Rápido: Finalize vendas diretas de serviços e produtos'}
              {abaAtiva === 'comandas' && '💡 Comandas: Gerencie múltiplos atendimentos em aberto'}
              {abaAtiva === 'historico' && '💡 Histórico: Visualize todas as vendas realizadas'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaixaHeader;