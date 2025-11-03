// src/components/servicos/ServicosHeader.jsx
import { Plus, Tag } from 'lucide-react';

const ServicosHeader = ({ salaoNome, onOpenCategoriaModal, onOpenServicoModal }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Serviços</h1>
        <p className="text-gray-600 mt-1">Gerencie os serviços - {salaoNome}</p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenCategoriaModal}
          className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all"
        >
          <Tag size={20} />
          <span>Gerenciar Categorias</span>
        </button>
        <button
          onClick={onOpenServicoModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Serviço</span>
        </button>
      </div>
    </div>
  );
};

export default ServicosHeader;