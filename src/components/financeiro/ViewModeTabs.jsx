// src/components/financeiro/ViewModeTabs.jsx - ATUALIZADO
import { DollarSign, Calendar, Repeat } from 'lucide-react';

const ViewModeTabs = ({ viewMode, setViewMode }) => {
  const tabs = [
    { id: 'transacoes', label: 'Transações', icon: DollarSign },
    { id: 'contas', label: 'Contas a Pagar/Receber', icon: Calendar },
    { id: 'fixas', label: 'Despesas Fixas', icon: Repeat }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                viewMode === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="inline-block mr-2" size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ViewModeTabs;