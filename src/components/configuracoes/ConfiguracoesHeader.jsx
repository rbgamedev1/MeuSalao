// src/components/configuracoes/ConfiguracoesHeader.jsx

import { AlertTriangle, X } from 'lucide-react';

const ConfiguracoesHeader = ({ onResetSalao, onResetSistema }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie as configurações do seu salão</p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onResetSalao}
          className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
        >
          <AlertTriangle size={18} />
          <span>Resetar Dados do Salão</span>
        </button>
        <button
          onClick={onResetSistema}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          <X size={18} />
          <span>Resetar Todo Sistema</span>
        </button>
      </div>
    </div>
  );
};

export default ConfiguracoesHeader;