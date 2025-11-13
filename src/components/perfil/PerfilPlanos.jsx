// src/components/perfil/PerfilPlanos.jsx - MOVIDO DE CONFIGURAÇÕES

import { Crown, Check, Lock, Building2 } from 'lucide-react';
import { PLANOS_DATA } from '../../data/planosData';

const PerfilPlanos = ({ saloes, atualizarSalao }) => {
  // Obter plano atual (primeiro salão, já que todos compartilham o mesmo plano)
  const planoAtual = saloes.length > 0 ? saloes[0].plano : 'inicial';
  const planoAtualInfo = PLANOS_DATA.find(p => p.id === planoAtual);

  // Separar planos disponíveis dos futuros
  const planosDisponiveis = PLANOS_DATA.filter(p => p.disponivel !== false);
  const planosFuturos = PLANOS_DATA.filter(p => p.disponivel === false);

  const handleChangePlano = (planoId) => {
    const planoSelecionado = PLANOS_DATA.find(p => p.id === planoId);
    
    if (!planoSelecionado) {
      alert('Plano não encontrado!');
      return;
    }

    if (!planoSelecionado.disponivel) {
      alert(`O plano ${planoSelecionado.nome} estará disponível em breve!\n\nEntre em contato conosco para receber novidades sobre este plano.`);
      return;
    }

    if (confirm(`Deseja alterar para o ${planoSelecionado.nome}?\n\n⚠️ ATENÇÃO: O plano se aplica a TODOS os seus salões cadastrados.`)) {
      try {
        // Atualizar plano de todos os salões
        saloes.forEach(salao => {
          atualizarSalao(salao.id, { plano: planoId });
        });
        alert('Plano alterado com sucesso para todos os seus salões!');
      } catch (error) {
        console.error('Erro ao alterar plano:', error);
        alert('Erro ao alterar plano. Tente novamente.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Plano Atual e Salões */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm opacity-90">Seu Plano Atual</p>
            <h3 className="text-2xl font-bold mt-1">
              {planoAtualInfo?.nome || 'Plano Inicial'}
            </h3>
            <p className="text-sm opacity-90 mt-2">
              Aplicado a {saloes.length} {saloes.length === 1 ? 'salão' : 'salões'}
            </p>
          </div>
          <Crown size={48} className="opacity-80" />
        </div>

        {/* Lista de Salões */}
        {saloes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={16} />
              <p className="text-sm font-medium">Seus Salões:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {saloes.map(salao => (
                <span 
                  key={salao.id}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                >
                  {salao.nome}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Informação Importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Importante:</strong> O plano é único para todos os seus salões. Ao alterar o plano, a mudança será aplicada automaticamente em todos eles.
        </p>
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
                planoAtual === plano.id
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

              {planoAtual === plano.id ? (
                <button
                  disabled
                  className="w-full py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                >
                  Plano Atual
                </button>
              ) : (
                <button
                  onClick={() => handleChangePlano(plano.id)}
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

export default PerfilPlanos;