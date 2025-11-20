// src/components/clientes/prontuario/TerapiaDetalhesModal.jsx
import { CheckCircle, Star } from 'lucide-react';

const TerapiaDetalhesModal = ({ terapia, onClose, onEdit, onImageClick }) => {
  const etapasList = [
    { id: 'avaliacao', nome: 'Avaliação', icon: '🔍' },
    { id: 'selecao', nome: 'Seleção', icon: '💊' },
    { id: 'aplicacao', nome: 'Aplicação', icon: '✨' },
    { id: 'finalizacao', nome: 'Finalização', icon: '🎯' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  🌸 Detalhes da Terapia Capilar
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  {terapia.data} • {terapia.hora}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progresso */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="grid grid-cols-4 gap-3">
              {etapasList.map(etapa => {
                const completa = terapia.etapasCompletas?.includes(etapa.id);
                return (
                  <div 
                    key={etapa.id}
                    className={`text-center p-3 rounded-lg border ${
                      completa
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{etapa.icon}</div>
                    <p className={`text-xs font-medium ${
                      completa ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {etapa.nome}
                    </p>
                    {completa && (
                      <CheckCircle size={14} className="text-green-600 mx-auto mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {/* Objetivo */}
              {terapia.dadosTerapiaCapilar?.objetivoTratamento && (
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                  <h4 className="text-sm font-semibold text-pink-900 mb-2 flex items-center">
                    🎯 Objetivo do Tratamento
                  </h4>
                  <p className="text-gray-700">{terapia.dadosTerapiaCapilar.objetivoTratamento}</p>
                </div>
              )}

              {/* Tipo de Couro Cabeludo */}
              {terapia.dadosTerapiaCapilar?.tipoCouroCabeludo && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-900 mb-2">
                    💆‍♀️ Tipo de Couro Cabeludo
                  </h4>
                  <span className="inline-block px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm font-medium">
                    {terapia.dadosTerapiaCapilar.tipoCouroCabeludo}
                  </span>
                </div>
              )}

              {/* Problemas Identificados */}
              {terapia.dadosTerapiaCapilar?.problemasCapilares?.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                    ⚠️ Problemas Identificados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {terapia.dadosTerapiaCapilar.problemasCapilares.map((prob, idx) => (
                      <span key={idx} className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full text-xs">
                        {prob}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tratamentos Selecionados */}
              {terapia.dadosTerapiaCapilar?.tratamentosSelecionados?.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">
                    💊 Tratamentos Aplicados
                  </h4>
                  <div className="space-y-2">
                    {terapia.dadosTerapiaCapilar.tratamentosSelecionados.map((trat, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-blue-300">
                        <p className="font-medium text-blue-900">{trat.nomeProduto}</p>
                        {trat.procedimento && (
                          <p className="text-xs text-gray-600 mt-1">{trat.procedimento}</p>
                        )}
                        {trat.frequencia && (
                          <p className="text-xs text-blue-700 mt-1">
                            <strong>Frequência:</strong> {trat.frequencia}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Avaliação do Cliente */}
              {terapia.dadosTerapiaCapilar?.avaliacaoCliente > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-sm font-semibold text-green-900 mb-2">
                    ⭐ Avaliação do Cliente
                  </h4>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={24}
                        className={
                          star <= terapia.dadosTerapiaCapilar.avaliacaoCliente
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                    <span className="text-sm text-gray-700 ml-2">
                      ({terapia.dadosTerapiaCapilar.avaliacaoCliente}/5)
                    </span>
                  </div>
                  {terapia.dadosTerapiaCapilar.comentarioCliente && (
                    <p className="text-sm text-gray-700 mt-2 italic">
                      "{terapia.dadosTerapiaCapilar.comentarioCliente}"
                    </p>
                  )}
                </div>
              )}

              {/* Imagens */}
              {(terapia.dadosTerapiaCapilar?.imagensAvaliacao?.length > 0 ||
                terapia.dadosTerapiaCapilar?.imagensFinais?.length > 0) && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    📸 Galeria de Imagens
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ...(terapia.dadosTerapiaCapilar.imagensAvaliacao || []),
                      ...(terapia.dadosTerapiaCapilar.imagensFinais || [])
                    ].map((img, idx) => (
                      <div 
                        key={idx}
                        className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
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

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between flex-shrink-0">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Editar / Continuar
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerapiaDetalhesModal;