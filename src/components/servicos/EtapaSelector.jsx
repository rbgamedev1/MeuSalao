// src/components/servicos/EtapaSelector.jsx
import { useState } from 'react';
import { X, Calendar, Eye, Check } from 'lucide-react';
import ProntuarioViewer from './ProntuarioViewer';

const EtapaSelector = ({ clienteSelecionado, tipoAtendimento, onSelectEtapa, onCancel, atendimentosAnteriores }) => {
  const [prontuarioSelecionado, setProntuarioSelecionado] = useState(null);

  const etapas = tipoAtendimento === 'terapia_capilar' ? [
    { id: 'avaliacao', nome: 'Avaliação Inicial', icon: '🔍', descricao: 'Anamnese completa, histórico e avaliação do estado capilar' },
    { id: 'selecao', nome: 'Seleção de Tratamento', icon: '💊', descricao: 'Escolha de produtos, técnicas e plano de tratamento' },
    { id: 'aplicacao', nome: 'Aplicação do Tratamento', icon: '✨', descricao: 'Registro da aplicação, produtos e procedimentos realizados' },
    { id: 'finalizacao', nome: 'Finalização', icon: '🎯', descricao: 'Resultados, orientações e agendamento do retorno' }
  ] : [
    { id: 'avaliacao', nome: 'Avaliação Inicial', icon: '🔍', descricao: 'Anamnese, histórico capilar e avaliação para mega hair' },
    { id: 'entrega', nome: 'Entrega de Material', icon: '📦', descricao: 'Recebimento e checklist do cabelo/extensão' },
    { id: 'confeccao', nome: 'Confecção e Aplicação', icon: '✂️', descricao: 'Confecção das mechas e aplicação do mega hair' },
    { id: 'finalizacao', nome: 'Finalização e Orientações', icon: '🎯', descricao: 'Avaliação final, cuidados e manutenção' }
  ];

  const historicoCliente = atendimentosAnteriores
    .filter(a => a.clienteId === clienteSelecionado.id && a.tipo === tipoAtendimento)
    .sort((a, b) => {
      try {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      } catch {
        return 0;
      }
    });

  const etapasRealizadas = historicoCliente.flatMap(a => a.etapasCompletas || []);
  const getEtapaCount = (etapaId) => etapasRealizadas.filter(e => e === etapaId).length;
  const getEtapaInfo = (etapaId) => etapas.find(e => e.id === etapaId) || { nome: etapaId, icon: '📋' };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onCancel}></div>
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {tipoAtendimento === 'terapia_capilar' ? '🌸 Terapia Capilar' : '💇‍♀️ Mega Hair'}
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    {clienteSelecionado.nome} - Histórico e Nova Etapa
                  </p>
                </div>
                <button onClick={onCancel} className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 border-r border-gray-200 overflow-y-auto bg-gray-50 p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Calendar size={20} />
                  <span>Histórico de Atendimentos</span>
                </h4>

                {historicoCliente.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-500 text-sm">Nenhum atendimento anterior registrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historicoCliente.map(prontuario => {
                      const etapaInfo = getEtapaInfo(prontuario.etapaPreenchida);
                      return (
                        <button
                          key={prontuario.id}
                          onClick={() => setProntuarioSelecionado(prontuario)}
                          className="w-full bg-white rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-md transition-all p-4 text-left"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{etapaInfo.icon}</span>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">{etapaInfo.nome}</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <span>{prontuario.data}</span>
                                  <span>•</span>
                                  <span>{prontuario.hora}</span>
                                </div>
                              </div>
                            </div>
                            <Eye size={16} className="text-gray-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {historicoCliente.length > 0 && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-xs text-purple-800">
                      <strong>Total:</strong> {historicoCliente.length} atendimento(s)
                    </p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-3/5 overflow-y-auto p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Selecione a Etapa para Preencher</h4>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Dica:</strong> Você pode preencher qualquer etapa independentemente.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {etapas.map(etapa => {
                    const count = getEtapaCount(etapa.id);
                    return (
                      <button
                        key={etapa.id}
                        onClick={() => onSelectEtapa(etapa.id)}
                        className="group bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-5 hover:border-purple-500 hover:shadow-lg transition-all text-left"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-4xl">{etapa.icon}</div>
                          {count > 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium flex items-center space-x-1">
                              <Check size={12} />
                              <span>{count}x</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-purple-900 mb-1">{etapa.nome}</h4>
                        <p className="text-sm text-gray-600">{etapa.descricao}</p>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={onCancel}
                  className="mt-6 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {prontuarioSelecionado && (
        <ProntuarioViewer
          prontuario={prontuarioSelecionado}
          onClose={() => setProntuarioSelecionado(null)}
        />
      )}
    </>
  );
};

export default EtapaSelector;