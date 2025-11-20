// src/components/clientes/prontuario/TerapiaCard.jsx
import { Calendar, Clock, Edit, Trash2, CheckCircle, ChevronRight } from 'lucide-react';

const TerapiaCard = ({ 
  terapia, 
  index,
  onEdit, 
  onDelete,
  onViewDetails 
}) => {
  const etapas = terapia.etapasCompletas || [];
  const dados = terapia.dadosTerapiaCapilar || {};
  
  const etapasList = [
    { id: 'avaliacao', nome: 'Avaliação', icon: '🔍' },
    { id: 'selecao', nome: 'Seleção', icon: '💊' },
    { id: 'aplicacao', nome: 'Aplicação', icon: '✨' },
    { id: 'finalizacao', nome: 'Finalização', icon: '🎯' }
  ];

  return (
    <div 
      className="bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all p-5 cursor-pointer"
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl">
            🌸
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-400" />
              <p className="font-semibold text-gray-800">{terapia.data}</p>
              <span className="text-gray-400">•</span>
              <Clock size={16} className="text-gray-400" />
              <p className="text-gray-600">{terapia.hora}</p>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {index === 0 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Mais Recente
                </span>
              )}
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                {etapas.length}/4 Etapas
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Continuar"
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

      {/* Progresso das Etapas */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {etapasList.map(etapa => (
          <div 
            key={etapa.id}
            className={`text-center p-2 rounded-lg border ${
              etapas.includes(etapa.id)
                ? 'bg-green-50 border-green-300'
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            <div className="text-xl mb-1">{etapa.icon}</div>
            <p className={`text-xs ${
              etapas.includes(etapa.id) ? 'text-green-700 font-medium' : 'text-gray-500'
            }`}>
              {etapa.nome}
            </p>
            {etapas.includes(etapa.id) && (
              <CheckCircle size={12} className="text-green-600 mx-auto mt-1" />
            )}
          </div>
        ))}
      </div>

      {/* Preview de Informações */}
      {dados.objetivoTratamento && (
        <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
          <p className="text-xs text-pink-700 font-medium mb-1">🎯 Objetivo:</p>
          <p className="text-sm text-gray-700 line-clamp-2">{dados.objetivoTratamento}</p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>Clique para ver detalhes completos</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
};

export default TerapiaCard;