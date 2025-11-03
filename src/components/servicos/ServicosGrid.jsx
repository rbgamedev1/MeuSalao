// src/components/servicos/ServicosGrid.jsx
import { Clock, DollarSign, Edit, Trash2, Scissors } from 'lucide-react';

const ServicosGrid = ({ filteredServicos, profissionais, handleOpenModal, handleDelete }) => {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
  };

  if (filteredServicos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
        <Scissors size={48} className="mx-auto mb-4 opacity-50" />
        <p>Nenhum serviço encontrado para este salão.</p>
        <p className="text-sm mt-2">Clique em "Novo Serviço" para adicionar o primeiro serviço.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServicos.map((servico) => (
        <div key={servico.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{servico.nome}</h3>
                <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {servico.categoria}
                </span>
              </div>
              <div className={`w-3 h-3 rounded-full ${servico.ativo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{servico.descricao}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={16} />
                  <span>Duração</span>
                </div>
                <span className="font-medium text-gray-800">{formatDuration(servico.duracao)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <DollarSign size={16} />
                  <span>Valor</span>
                </div>
                <span className="font-bold text-green-600">R$ {servico.valor.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Comissão</span>
                <span className="font-medium text-purple-600">{servico.comissao}%</span>
              </div>
            </div>

            {servico.profissionaisHabilitados && servico.profissionaisHabilitados.length > 0 && (
              <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-600 mb-2">Profissionais:</p>
                <div className="flex flex-wrap gap-1">
                  {servico.profissionaisHabilitados.map(profId => {
                    const prof = profissionais.find(p => p.id === profId);
                    return prof ? (
                      <span key={profId} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {prof.nome}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleOpenModal(servico)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit size={16} />
                <span>Editar</span>
              </button>
              <button 
                onClick={() => handleDelete(servico.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicosGrid;