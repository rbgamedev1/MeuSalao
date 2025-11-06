// src/components/configuracoes/ConfiguracoesPlanos.jsx - APENAS 3 PLANOS ATIVOS

import { Crown, Check, Lock } from 'lucide-react';

const ConfiguracoesPlanos = ({ 
  planos, 
  salaoPlano, 
  onChangePlano 
}) => {
  // Separar planos disponíveis dos futuros
  const planosDisponiveis = planos.filter(p => p.disponivel !== false);
  const planosFuturos = planos.filter(p => p.disponivel === false);

  return (
    <div className="space-y-6">
      {/* Plano Atual */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Seu Plano Atual</p>
            <h3 className="text-2xl font-bold mt-1">
              {planos.find(p => p.id === salaoPlano)?.nome || 'Plano Inicial'}
            </h3>
          </div>
          <Crown size={48} className="opacity-80" />
        </div>
      </div>

      {/* Grid de Planos Disponíveis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Planos Disponíveis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planosDisponiveis.map(plano => (
            <div
              key={plano.id}
              className={`rounded-lg border-2 p-6 transition-all ${
                salaoPlano === plano.id
                  ? 'border-purple-600 bg-purple-50'
                  : plano.destaque
                  ? 'border-pink-400 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              {plano.destaque && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  RECOMENDADO
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {plano.nome}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-purple-600">
                  {plano.preco}
                </span>
                {plano.preco !== 'Gratuito' && (
                  <span className="text-gray-600 text-sm">/mês</span>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plano.recursos.map((recurso, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{recurso}</span>
                  </li>
                ))}
              </ul>

              {salaoPlano === plano.id ? (
                <button
                  disabled
                  className="w-full py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                >
                  Plano Atual
                </button>
              ) : (
                <button
                  onClick={() => onChangePlano(plano.id)}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Escolher Plano
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Planos Futuros (Desabilitados) */}
      {planosFuturos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Próximos Lançamentos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planosFuturos.map(plano => (
              <div
                key={plano.id}
                className="rounded-lg border-2 border-gray-300 p-6 bg-gray-50 opacity-60"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-600">
                    {plano.nome}
                  </h3>
                  <Lock size={20} className="text-gray-400" />
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-500">
                    {plano.preco}
                  </span>
                  {plano.preco !== 'Gratuito' && (
                    <span className="text-gray-500 text-sm">/mês</span>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {plano.recursos.map((recurso, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <Lock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{recurso}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled
                  className="w-full py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                >
                  Em Breve
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>Quer saber mais sobre os próximos planos?</strong> Entre em contato conosco para receber novidades em primeira mão!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfiguracoesPlanos;