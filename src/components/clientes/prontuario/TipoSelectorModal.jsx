// src/components/clientes/prontuario/TipoSelectorModal.jsx

const TipoSelectorModal = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Selecione o Tipo de Atendimento
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Terapia Capilar */}
            <button
              onClick={() => onSelect('terapia_capilar')}
              className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 hover:shadow-lg transition-all"
            >
              <div className="text-6xl mb-4">🌸</div>
              <h4 className="text-xl font-bold text-purple-900 mb-2">Terapia Capilar</h4>
              <p className="text-sm text-gray-600">
                Avaliação, tratamento e acompanhamento capilar completo
              </p>
            </button>

            {/* Mega Hair */}
            <button
              onClick={() => onSelect('mega_hair')}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all"
            >
              <div className="text-6xl mb-4">💇‍♀️</div>
              <h4 className="text-xl font-bold text-blue-900 mb-2">Mega Hair</h4>
              <p className="text-sm text-gray-600">
                Confecção, aplicação e manutenção de alongamentos
              </p>
            </button>

            {/* Sessão Simples */}
            <button
              onClick={() => onSelect('normal')}
              className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:border-gray-400 hover:shadow-lg transition-all"
            >
              <div className="text-6xl mb-4">📋</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Sessão Simples</h4>
              <p className="text-sm text-gray-600">
                Registro rápido: diagnóstico e tratamento básico
              </p>
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TipoSelectorModal;