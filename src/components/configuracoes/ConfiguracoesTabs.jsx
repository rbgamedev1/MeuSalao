// src/components/configuracoes/ConfiguracoesTabs.jsx

import { Building2, Users, Crown } from 'lucide-react';

const ConfiguracoesTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'geral', label: 'Informações Gerais', icon: Building2 },
    { id: 'profissionais', label: 'Profissionais', icon: Users },
    { id: 'planos', label: 'Planos e Assinatura', icon: Crown }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConfiguracoesTabs;