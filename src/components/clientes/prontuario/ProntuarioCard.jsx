// src/components/clientes/prontuario/ProntuarioCard.jsx
import { Calendar, Clock, Edit, Trash2, FileText, TrendingUp, Package } from 'lucide-react';

const ProntuarioCard = ({ 
  prontuario, 
  index, 
  total,
  produtos,
  onEdit, 
  onDelete,
  onImageClick 
}) => {
  const getProdutoNome = (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? `${produto.nome} - ${produto.marca}` : 'Produto não encontrado';
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
            {total - index}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-400" />
              <p className="font-semibold text-gray-800">{prontuario.data}</p>
              <span className="text-gray-400">•</span>
              <Clock size={16} className="text-gray-400" />
              <p className="text-gray-600">{prontuario.hora}</p>
            </div>
            {index === 0 && (
              <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                Mais Recente
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Diagnóstico */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <FileText size={16} className="text-purple-600" />
            <p className="text-sm font-semibold text-gray-700">Diagnóstico:</p>
          </div>
          <p className="text-sm text-gray-600 pl-6 bg-purple-50 p-3 rounded-lg">
            {prontuario.diagnostico}
          </p>
        </div>

        {/* Tratamento */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp size={16} className="text-blue-600" />
            <p className="text-sm font-semibold text-gray-700">Tratamento:</p>
          </div>
          <p className="text-sm text-gray-600 pl-6 bg-blue-50 p-3 rounded-lg">
            {prontuario.tratamento}
          </p>
        </div>

        {/* Produtos */}
        {prontuario.produtosUsados && prontuario.produtosUsados.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Package size={16} className="text-green-600" />
              <p className="text-sm font-semibold text-gray-700">Produtos:</p>
            </div>
            <div className="pl-6 flex flex-wrap gap-2">
              {prontuario.produtosUsados.map(prodId => (
                <span 
                  key={prodId}
                  className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  {getProdutoNome(prodId)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Imagens */}
        {(prontuario.imagens?.tricoscopia?.length > 0 || prontuario.imagens?.anteDepois?.length > 0) && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">📸 Imagens:</p>
            <div className="grid grid-cols-4 gap-2 pl-6">
              {[
                ...(prontuario.imagens.tricoscopia || []),
                ...(prontuario.imagens.anteDepois || [])
              ].slice(0, 4).map((img, idx) => (
                <div 
                  key={idx}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:border-purple-500 transition-all"
                  onClick={() => onImageClick(img)}
                >
                  <img src={img} alt={`Imagem ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProntuarioCard;