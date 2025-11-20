// src/components/clientes/detalhes/ClienteTabs.jsx
import { User, Calendar, ShoppingCart, FileText, Send } from 'lucide-react';

const ClienteTabs = ({ abaAtiva, setAbaAtiva, counts }) => {
  const tabs = [
    { id: 'info', icon: User, label: 'Informações' },
    { id: 'agendamentos', icon: Calendar, label: `Agendamentos (${counts.agendamentos})` },
    { id: 'caixa', icon: ShoppingCart, label: `Caixa (${counts.caixa})` },
    { id: 'prontuario', icon: FileText, label: `Prontuário (${counts.prontuario})` },
    { id: 'emails', icon: Send, label: `Emails (${counts.emails})` }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAbaAtiva(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  abaAtiva === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClienteTabs;