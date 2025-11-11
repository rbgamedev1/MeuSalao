// src/components/configuracoes/ServicoInfoModal.jsx

import { X, Info } from 'lucide-react';

const ServicoInfoModal = ({ isOpen, onClose, servicoNome, servicoDescricao }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Informação do Serviço
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h4 className="text-xl font-semibold text-purple-700 mb-3">
            {servicoNome}
          </h4>
          <p className="text-gray-600 leading-relaxed">
            {servicoDescricao || 'Descrição não disponível para este serviço.'}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicoInfoModal;