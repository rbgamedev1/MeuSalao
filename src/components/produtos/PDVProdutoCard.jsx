// src/components/produtos/PDVProdutoCard.jsx
import { Package, AlertTriangle, Plus } from 'lucide-react';

const PDVProdutoCard = ({ produto, onAddToCart }) => {
  const estoqueBaixo = produto.estoque <= produto.estoqueMinimo;
  const semEstoque = produto.estoque <= 0;
  const margem = ((produto.valorVenda - produto.valorCusto) / produto.valorCusto * 100).toFixed(0);

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
      semEstoque ? 'border-gray-200 opacity-50' : 'border-gray-200 hover:border-purple-300'
    }`}>
      <div className="p-4">
        {/* Header do Card */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg">{produto.nome}</h3>
            <p className="text-sm text-gray-600">{produto.marca}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              {produto.categoria}
            </span>
          </div>
          <div className={`p-2 rounded-lg ${
            semEstoque ? 'bg-gray-100' : estoqueBaixo ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <Package size={20} className={
              semEstoque ? 'text-gray-400' : estoqueBaixo ? 'text-red-600' : 'text-green-600'
            } />
          </div>
        </div>

        {/* Estoque */}
        <div className="mb-3 flex items-center space-x-2">
          <span className={`text-sm font-medium ${
            semEstoque ? 'text-gray-400' : estoqueBaixo ? 'text-red-600' : 'text-gray-700'
          }`}>
            Estoque: {produto.estoque}
          </span>
          {estoqueBaixo && !semEstoque && (
            <AlertTriangle size={14} className="text-red-500" />
          )}
        </div>

        {/* Valores */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Valor de Venda:</span>
            <span className="text-xl font-bold text-green-600">
              R$ {produto.valorVenda.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Margem:</span>
            <span className="font-semibold text-purple-600">{margem}%</span>
          </div>
        </div>

        {/* Botão Adicionar */}
        <button
          onClick={() => onAddToCart(produto)}
          disabled={semEstoque}
          className={`w-full py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
            semEstoque
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg'
          }`}
        >
          <Plus size={18} />
          <span>{semEstoque ? 'Sem Estoque' : 'Adicionar ao Carrinho'}</span>
        </button>
      </div>
    </div>
  );
};

export default PDVProdutoCard;