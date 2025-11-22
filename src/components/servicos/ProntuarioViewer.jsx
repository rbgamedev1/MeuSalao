// src/components/servicos/ProntuarioViewer.jsx
import { X } from 'lucide-react';

const ProntuarioViewer = ({ prontuario, onClose }) => {
  const getEtapaInfo = (etapaId, tipo) => {
    if (tipo === 'terapia_capilar') {
      const etapas = {
        avaliacao: { nome: 'Avaliação Inicial', icon: '🔍' },
        selecao: { nome: 'Seleção de Tratamento', icon: '💊' },
        aplicacao: { nome: 'Aplicação do Tratamento', icon: '✨' },
        finalizacao: { nome: 'Finalização', icon: '🎯' }
      };
      return etapas[etapaId] || { nome: etapaId, icon: '📋' };
    } else {
      const etapas = {
        avaliacao: { nome: 'Avaliação Inicial', icon: '🔍' },
        entrega: { nome: 'Entrega de Material', icon: '📦' },
        confeccao: { nome: 'Confecção e Aplicação', icon: '✂️' },
        finalizacao: { nome: 'Finalização e Orientações', icon: '🎯' }
      };
      return etapas[etapaId] || { nome: etapaId, icon: '📋' };
    }
  };

  const etapaInfo = getEtapaInfo(prontuario.etapaPreenchida, prontuario.tipo);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <span>{etapaInfo.icon}</span>
                  <span>{etapaInfo.nome}</span>
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  {prontuario.data} às {prontuario.hora}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {Object.entries(prontuario.dadosTerapiaCapilar || {}).map(([key, value]) => {
                if (!value || key === 'imagens' || typeof value === 'object') return null;
                
                return (
                  <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end flex-shrink-0">
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

export default ProntuarioViewer;