// src/components/produtos/ProdutosHeader.jsx
import { Plus, Package } from 'lucide-react';

const ProdutosHeader = ({ salaoNome, onOpenFornecedorModal, onOpenProdutoModal }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
        <p className="text-gray-600 mt-1">Gerencie seu estoque - {salaoNome}</p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenFornecedorModal}
          className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all"
        >
          <Package size={20} />
          <span>Gerenciar Fornecedores</span>
        </button>
        <button
          onClick={onOpenProdutoModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>
    </div>
  );
};

export default ProdutosHeader;