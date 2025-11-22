// src/pages/Servicos.jsx - CORRIGIDO - Filtra por salão

import { useState, useContext, useMemo } from 'react';
import { Calendar, Clock, Eye } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import TipoAtendimentoSelector from '../components/servicos/TipoAtendimentoSelector';
import ClienteSelector from '../components/servicos/ClienteSelector';
import EtapaSelector from '../components/servicos/EtapaSelector';
import FormularioEtapa from '../components/servicos/FormularioEtapa';

const Servicos = () => {
  const { 
    salaoAtual,
    prontuarios,
    setProntuarios,
    getClientesPorSalao,
    getProdutosPorSalao
  } = useContext(SalaoContext);

  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [etapaSelecionada, setEtapaSelecionada] = useState(null);
  const [showFormulario, setShowFormulario] = useState(false);

  const clientesSalao = getClientesPorSalao();
  const produtos = getProdutosPorSalao();

  // CORRIGIDO: Filtra atendimentos por salão atual
  const atendimentos = useMemo(() => {
    return prontuarios
      .filter(p => 
        (p.tipo === 'terapia_capilar' || p.tipo === 'mega_hair') &&
        p.salaoId === salaoAtual.id  // FILTRO POR SALÃO ADICIONADO
      )
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
  }, [prontuarios, salaoAtual.id]); // DEPENDÊNCIA salaoAtual.id ADICIONADA

  const terapiasCapilares = atendimentos.filter(a => a.tipo === 'terapia_capilar');
  const megaHairs = atendimentos.filter(a => a.tipo === 'mega_hair');

  const handleSelectTipo = (tipo) => setTipoSelecionado(tipo);
  const handleSelectCliente = (cliente) => setClienteSelecionado(cliente);
  const handleSelectEtapa = (etapa) => {
    setEtapaSelecionada(etapa);
    setShowFormulario(true);
  };

  const handleCloseAll = () => {
    setShowFormulario(false);
    setEtapaSelecionada(null);
    setClienteSelecionado(null);
    setTipoSelecionado(null);
  };

  const handleSaveProntuario = (prontuario) => {
    const novoProntuario = {
      ...prontuario,
      id: Math.max(...prontuarios.map(p => p.id), 0) + 1,
      salaoId: salaoAtual.id
    };
    setProntuarios([...prontuarios, novoProntuario]);
    alert('✅ Registro salvo com sucesso!');
    handleCloseAll();
  };

  const getEtapaInfo = (etapaId, tipo) => {
    if (tipo === 'terapia_capilar') {
      const etapas = {
        avaliacao: { nome: 'Avaliação', icon: '🔍' },
        selecao: { nome: 'Seleção', icon: '💊' },
        aplicacao: { nome: 'Aplicação', icon: '✨' },
        finalizacao: { nome: 'Finalização', icon: '🎯' }
      };
      return etapas[etapaId] || { nome: etapaId, icon: '📋' };
    } else {
      const etapas = {
        avaliacao: { nome: 'Avaliação', icon: '🔍' },
        entrega: { nome: 'Entrega Material', icon: '📦' },
        confeccao: { nome: 'Confecção/Aplicação', icon: '✂️' },
        finalizacao: { nome: 'Finalização', icon: '🎯' }
      };
      return etapas[etapaId] || { nome: etapaId, icon: '📋' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Atendimentos Especializados</h1>
          <p className="text-gray-600">Terapia Capilar e Mega Hair - {salaoAtual.nome}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Novo Atendimento</h2>
          <TipoAtendimentoSelector onSelect={handleSelectTipo} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Total de Registros</p>
            <p className="text-3xl font-bold text-purple-700 mt-2">{atendimentos.length}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
            <p className="text-sm text-pink-600 font-medium">Terapias Capilares</p>
            <p className="text-3xl font-bold text-pink-700 mt-2">{terapiasCapilares.length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Mega Hair</p>
            <p className="text-3xl font-bold text-blue-700 mt-2">{megaHairs.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Histórico de Atendimentos</h2>

          {atendimentos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">Nenhum atendimento registrado ainda</p>
              <p className="text-sm mt-2">Comece um novo atendimento acima!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {terapiasCapilares.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                    <span className="text-2xl mr-2">🌸</span>
                    Terapias Capilares ({terapiasCapilares.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {terapiasCapilares.map(atendimento => {
                      const cliente = clientesSalao.find(c => c.id === atendimento.clienteId);
                      const etapaInfo = getEtapaInfo(atendimento.etapaPreenchida, atendimento.tipo);

                      return (
                        <div key={atendimento.id} className="bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all p-5 cursor-pointer">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl">🌸</div>
                              <div>
                                <p className="font-bold text-gray-800">{cliente?.nome || 'Cliente'}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Calendar size={14} />
                                  <span>{atendimento.data}</span>
                                  <span>•</span>
                                  <Clock size={14} />
                                  <span>{atendimento.hora}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{etapaInfo.icon}</span>
                              <div>
                                <p className="text-sm font-semibold text-purple-900">{etapaInfo.nome}</p>
                                <p className="text-xs text-purple-700">Etapa registrada</p>
                              </div>
                            </div>
                          </div>

                          {atendimento.dadosTerapiaCapilar?.objetivoTratamento && (
                            <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                              <p className="text-xs text-pink-700 font-medium mb-1">🎯 Objetivo:</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{atendimento.dadosTerapiaCapilar.objetivoTratamento}</p>
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <span>Clique para ver detalhes</span>
                            <Eye size={16} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {megaHairs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <span className="text-2xl mr-2">💇‍♀️</span>
                    Mega Hair ({megaHairs.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {megaHairs.map(atendimento => {
                      const cliente = clientesSalao.find(c => c.id === atendimento.clienteId);
                      const etapaInfo = getEtapaInfo(atendimento.etapaPreenchida, atendimento.tipo);

                      return (
                        <div key={atendimento.id} className="bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all p-5 cursor-pointer">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl">💇‍♀️</div>
                              <div>
                                <p className="font-bold text-gray-800">{cliente?.nome || 'Cliente'}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Calendar size={14} />
                                  <span>{atendimento.data}</span>
                                  <span>•</span>
                                  <Clock size={14} />
                                  <span>{atendimento.hora}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{etapaInfo.icon}</span>
                              <div>
                                <p className="text-sm font-semibold text-blue-900">{etapaInfo.nome}</p>
                                <p className="text-xs text-blue-700">Etapa registrada</p>
                              </div>
                            </div>
                          </div>

                          {atendimento.dadosTerapiaCapilar?.motivoMegaHair && (
                            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                              <p className="text-xs text-indigo-700 font-medium mb-1">💭 Motivo:</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{atendimento.dadosTerapiaCapilar.motivoMegaHair}</p>
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <span>Clique para ver detalhes</span>
                            <Eye size={16} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {tipoSelecionado && !clienteSelecionado && (
          <ClienteSelector
            clientes={clientesSalao}
            onSelect={handleSelectCliente}
            onCancel={handleCloseAll}
          />
        )}

        {tipoSelecionado && clienteSelecionado && !etapaSelecionada && (
          <EtapaSelector
            clienteSelecionado={clienteSelecionado}
            tipoAtendimento={tipoSelecionado}
            onSelectEtapa={handleSelectEtapa}
            onCancel={handleCloseAll}
            atendimentosAnteriores={atendimentos}
          />
        )}

        {showFormulario && etapaSelecionada && (
          <FormularioEtapa
            clienteSelecionado={clienteSelecionado}
            tipoAtendimento={tipoSelecionado}
            etapaSelecionada={etapaSelecionada}
            onClose={handleCloseAll}
            onSave={handleSaveProntuario}
            produtos={produtos}
          />
        )}
      </div>
    </div>
  );
};

export default Servicos;