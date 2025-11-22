// src/components/servicos/TipoAtendimentoSelector.jsx

const TipoAtendimentoSelector = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <button
        onClick={() => onSelect('terapia_capilar')}
        className="group bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-200 rounded-2xl p-8 hover:border-purple-400 hover:shadow-2xl transition-all transform hover:scale-105"
      >
        <div className="text-center">
          <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">🌸</div>
          <h3 className="text-3xl font-bold text-purple-900 mb-3">Terapia Capilar</h3>
          <p className="text-gray-600 mb-4">Atendimento completo em etapas flexíveis</p>
          <div className="space-y-2 text-sm text-left bg-white/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔍</span>
              <span className="text-gray-700">Avaliação e Anamnese</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💊</span>
              <span className="text-gray-700">Seleção de Tratamento</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✨</span>
              <span className="text-gray-700">Aplicação do Tratamento</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span className="text-gray-700">Finalização e Orientações</span>
            </div>
          </div>
        </div>
      </button>

      <button
        onClick={() => onSelect('mega_hair')}
        className="group bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-2xl transition-all transform hover:scale-105"
      >
        <div className="text-center">
          <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">💇‍♀️</div>
          <h3 className="text-3xl font-bold text-blue-900 mb-3">Mega Hair</h3>
          <p className="text-gray-600 mb-4">Confecção e aplicação de alongamentos</p>
          <div className="space-y-2 text-sm text-left bg-white/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔍</span>
              <span className="text-gray-700">Avaliação Inicial</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📦</span>
              <span className="text-gray-700">Entrega de Material</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✂️</span>
              <span className="text-gray-700">Confecção e Aplicação</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎯</span>
              <span className="text-gray-700">Finalização e Orientações</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default TipoAtendimentoSelector;