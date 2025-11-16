// src/components/clientes/AvaliacaoModal.jsx
import { X, Star, ThumbsUp, ThumbsDown, Calendar, Clock, User, Scissors } from 'lucide-react';

const AvaliacaoModal = ({ avaliacao, onClose, servico, profissional }) => {
  if (!avaliacao) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Avaliação do Atendimento</h3>
                <p className="text-purple-100 text-sm mt-1">
                  {avaliacao.data} às {avaliacao.hora}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-6">
            {/* Avaliação por Estrelas */}
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">Nota do Atendimento</p>
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={40}
                    className={
                      star <= avaliacao.nota
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {avaliacao.nota}/5
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {avaliacao.nota === 5 && '⭐ Excelente!'}
                {avaliacao.nota === 4 && '😊 Muito bom!'}
                {avaliacao.nota === 3 && '🙂 Bom'}
                {avaliacao.nota === 2 && '😐 Regular'}
                {avaliacao.nota === 1 && '😞 Insatisfeito'}
              </p>
            </div>

            {/* Recomendação */}
            <div className="flex items-center justify-center space-x-8 py-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Recomendaria?</p>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  avaliacao.recomendaria ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {avaliacao.recomendaria ? (
                    <ThumbsUp className="text-green-600" size={32} />
                  ) : (
                    <ThumbsDown className="text-red-600" size={32} />
                  )}
                </div>
                <p className={`mt-2 font-semibold ${
                  avaliacao.recomendaria ? 'text-green-600' : 'text-red-600'
                }`}>
                  {avaliacao.recomendaria ? 'Sim' : 'Não'}
                </p>
              </div>
            </div>

            {/* Informações do Atendimento */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-800 mb-3">Informações do Atendimento</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Data</p>
                    <p className="font-medium text-gray-800">{avaliacao.data}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Horário</p>
                    <p className="font-medium text-gray-800">{avaliacao.hora}</p>
                  </div>
                </div>
                {servico && (
                  <div className="flex items-center space-x-2">
                    <Scissors size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Serviço</p>
                      <p className="font-medium text-gray-800">{servico.nome}</p>
                    </div>
                  </div>
                )}
                {profissional && (
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Profissional</p>
                      <p className="font-medium text-gray-800">{profissional.nome}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comentário */}
            {avaliacao.comentario && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="mr-2">💬</span>
                  Comentário
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">{avaliacao.comentario}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvaliacaoModal;