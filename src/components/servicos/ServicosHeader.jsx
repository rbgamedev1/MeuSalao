// src/components/servicos/ServicosHeader.jsx

import { Plus } from 'lucide-react';

const ServicosHeader = ({ salaoNome, onOpenServicoModal }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Serviços</h1>
        <p className="text-gray-600 mt-1">Gerencie os serviços de {salaoNome}</p>
      </div>
      <button
        onClick={onOpenServicoModal}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
      >
        <Plus size={20} />
        <span>Novo Serviço</span>
      </button>
    </div>
  );
};

export default ServicosHeader;