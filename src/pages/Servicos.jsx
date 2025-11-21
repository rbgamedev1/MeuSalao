// src/pages/Servicos.jsx - HUB COM SELEÇÃO LIVRE DE ETAPAS

import { useState, useContext, useMemo } from 'react';
import { X, User, Calendar, Clock, CheckCircle, Eye, Save } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import { getTodayBR } from '../utils/masks';
import FormularioAvaliacaoInicial from '../components/terapiaCapilar/FormularioAvaliacaoInicial';
import FormularioSelecaoTratamento from '../components/terapiaCapilar/FormularioSelecaoTratamento';
import FormularioAplicacaoTratamento from '../components/terapiaCapilar/FormularioAplicacaoTratamento';
import FormularioFinalizacao from '../components/terapiaCapilar/FormularioFinalizacao';

// ===== COMPONENTE: Seletor de Tipo de Atendimento =====
const TipoAtendimentoSelector = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* Terapia Capilar */}
      <button
        onClick={() => onSelect('terapia_capilar')}
        className="group bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-200 rounded-2xl p-8 hover:border-purple-400 hover:shadow-2xl transition-all transform hover:scale-105"
      >
        <div className="text-center">
          <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">🌸</div>
          <h3 className="text-3xl font-bold text-purple-900 mb-3">Terapia Capilar</h3>
          <p className="text-gray-600 mb-4">
            Atendimento completo em etapas flexíveis
          </p>
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

      {/* Mega Hair */}
      <button
        onClick={() => onSelect('mega_hair')}
        className="group bg-gradient-to-br from-blue-50 to-indigo-50 border-4 border-blue-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-2xl transition-all transform hover:scale-105"
      >
        <div className="text-center">
          <div className="text-8xl mb-6 group-hover:scale-110 transition-transform">💇‍♀️</div>
          <h3 className="text-3xl font-bold text-blue-900 mb-3">Mega Hair</h3>
          <p className="text-gray-600 mb-4">
            Confecção e aplicação de alongamentos
          </p>
          <div className="space-y-2 text-sm text-left bg-white/50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📏</span>
              <span className="text-gray-700">Medição e Planejamento</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✂️</span>
              <span className="text-gray-700">Confecção das Mechas</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔧</span>
              <span className="text-gray-700">Aplicação e Ajustes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💡</span>
              <span className="text-gray-700">Orientações de Cuidados</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

// ===== COMPONENTE: Seletor de Cliente =====
const ClienteSelector = ({ clientes, onSelect, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onCancel}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Selecione o Cliente</h3>
                <p className="text-purple-100 text-sm mt-1">Quem será atendido hoje?</p>
              </div>
              <button
                onClick={onCancel}
                className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar cliente por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredClientes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum cliente encontrado
                </p>
              ) : (
                filteredClientes.map(cliente => (
                  <button
                    key={cliente.id}
                    onClick={() => onSelect(cliente)}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {cliente.nome.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-800">{cliente.nome}</p>
                      <p className="text-sm text-gray-600">{cliente.telefone}</p>
                    </div>
                    <CheckCircle className="text-purple-600" size={24} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== COMPONENTE: Seletor de Etapa =====
const EtapaSelector = ({ clienteSelecionado, tipoAtendimento, onSelectEtapa, onCancel, atendimentosAnteriores }) => {
  const etapas = [
    { 
      id: 'avaliacao', 
      nome: 'Avaliação Inicial', 
      icon: '🔍',
      descricao: 'Anamnese completa, histórico e avaliação do estado capilar'
    },
    { 
      id: 'selecao', 
      nome: 'Seleção de Tratamento', 
      icon: '💊',
      descricao: 'Escolha de produtos, técnicas e plano de tratamento'
    },
    { 
      id: 'aplicacao', 
      nome: 'Aplicação do Tratamento', 
      icon: '✨',
      descricao: 'Registro da aplicação, produtos e procedimentos realizados'
    },
    { 
      id: 'finalizacao', 
      nome: 'Finalização', 
      icon: '🎯',
      descricao: 'Resultados, orientações e agendamento do retorno'
    }
  ];

  // Verificar quais etapas já foram realizadas
  const etapasRealizadas = atendimentosAnteriores
    .filter(a => a.clienteId === clienteSelecionado.id && a.tipo === tipoAtendimento)
    .flatMap(a => a.etapasCompletas || []);

  const getEtapaCount = (etapaId) => {
    return etapasRealizadas.filter(e => e === etapaId).length;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onCancel}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {tipoAtendimento === 'terapia_capilar' ? '🌸 Terapia Capilar' : '💇‍♀️ Mega Hair'}
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  {clienteSelecionado.nome} - Escolha a etapa do atendimento
                </p>
              </div>
              <button
                onClick={onCancel}
                className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                💡 <strong>Dica:</strong> Você pode preencher qualquer etapa independentemente. 
                Não é necessário seguir uma ordem específica.
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
                          <CheckCircle size={12} />
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
  );
};

// ===== COMPONENTE: Formulário da Etapa =====
const FormularioEtapa = ({ 
  clienteSelecionado, 
  tipoAtendimento, 
  etapaSelecionada, 
  onClose, 
  onSave, 
  produtos 
}) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagensChange = (campo, imagens) => {
    setFormData(prev => ({
      ...prev,
      [campo]: imagens
    }));
  };

  const handleSalvar = () => {
    const prontuario = {
      clienteId: clienteSelecionado.id,
      tipo: tipoAtendimento,
      data: getTodayBR(),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      etapaPreenchida: etapaSelecionada,
      dadosTerapiaCapilar: formData,
      etapasCompletas: [etapaSelecionada]
    };

    onSave(prontuario);
  };

  const renderFormulario = () => {
    switch (etapaSelecionada) {
      case 'avaliacao':
        return (
          <FormularioAvaliacaoInicial
            formData={formData}
            onChange={handleChange}
            onImagensChange={handleImagensChange}
          />
        );
      case 'selecao':
        return (
          <FormularioSelecaoTratamento
            formData={formData}
            onChange={handleChange}
            onImagensChange={handleImagensChange}
            produtos={produtos}
          />
        );
      case 'aplicacao':
        return (
          <FormularioAplicacaoTratamento
            formData={formData}
            onChange={handleChange}
            onImagensChange={handleImagensChange}
          />
        );
      case 'finalizacao':
        return (
          <FormularioFinalizacao
            formData={formData}
            onChange={handleChange}
            onImagensChange={handleImagensChange}
          />
        );
      default:
        return null;
    }
  };

  const getNomeEtapa = () => {
    const nomes = {
      avaliacao: '🔍 Avaliação Inicial',
      selecao: '💊 Seleção de Tratamento',
      aplicacao: '✨ Aplicação do Tratamento',
      finalizacao: '🎯 Finalização'
    };
    return nomes[etapaSelecionada] || '';
  };

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
                  {getNomeEtapa()}
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  {clienteSelecionado.nome} • {tipoAtendimento === 'terapia_capilar' ? 'Terapia Capilar' : 'Mega Hair'}
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

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {renderFormulario()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Salvar Registro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== COMPONENTE: Card de Atendimento =====
const AtendimentoCard = ({ atendimento, cliente, onViewDetails }) => {
  const getEtapaInfo = (etapaId) => {
    const etapas = {
      avaliacao: { nome: 'Avaliação', icon: '🔍', cor: 'purple' },
      selecao: { nome: 'Seleção', icon: '💊', cor: 'blue' },
      aplicacao: { nome: 'Aplicação', icon: '✨', cor: 'pink' },
      finalizacao: { nome: 'Finalização', icon: '🎯', cor: 'green' }
    };
    return etapas[etapaId] || { nome: etapaId, icon: '📋', cor: 'gray' };
  };

  const etapaInfo = getEtapaInfo(atendimento.etapaPreenchida);

  return (
    <div 
      className="bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all p-5 cursor-pointer"
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl">
            {atendimento.tipo === 'terapia_capilar' ? '🌸' : '💇‍♀️'}
          </div>
          <div>
            <p className="font-bold text-gray-800">{cliente?.nome || 'Cliente não encontrado'}</p>
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

      {/* Etapa Registrada */}
      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{etapaInfo.icon}</span>
          <div>
            <p className="text-sm font-semibold text-purple-900">{etapaInfo.nome}</p>
            <p className="text-xs text-purple-700">Etapa registrada</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      {atendimento.dadosTerapiaCapilar?.objetivoTratamento && (
        <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
          <p className="text-xs text-pink-700 font-medium mb-1">🎯 Objetivo:</p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {atendimento.dadosTerapiaCapilar.objetivoTratamento}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>Clique para ver detalhes</span>
        <Eye size={16} />
      </div>
    </div>
  );
};

// ===== COMPONENTE PRINCIPAL =====
const Servicos = () => {
  const { 
    salaoAtual,
    prontuarios,
    setProntuarios,
    getClientesPorSalao,
    getProntuariosPorSalao,
    getProdutosPorSalao
  } = useContext(SalaoContext);

  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [etapaSelecionada, setEtapaSelecionada] = useState(null);
  const [showFormulario, setShowFormulario] = useState(false);

  const clientesSalao = getClientesPorSalao();
  const prontuariosSalao = getProntuariosPorSalao();
  const produtos = getProdutosPorSalao();

  const atendimentos = useMemo(() => {
    return prontuariosSalao
      .filter(p => p.tipo === 'terapia_capilar' || p.tipo === 'mega_hair')
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
  }, [prontuariosSalao]);

  const terapiasCapilares = atendimentos.filter(a => a.tipo === 'terapia_capilar');
  const megaHairs = atendimentos.filter(a => a.tipo === 'mega_hair');

  const handleSelectTipo = (tipo) => {
    setTipoSelecionado(tipo);
  };

  const handleSelectCliente = (cliente) => {
    setClienteSelecionado(cliente);
  };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Atendimentos Especializados
        </h1>
        <p className="text-gray-600">
          Terapia Capilar e Mega Hair - {salaoAtual.nome}
        </p>
      </div>

      {/* Seletor de Tipo */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Iniciar Novo Atendimento
        </h2>
        <TipoAtendimentoSelector onSelect={handleSelectTipo} />
      </div>

      {/* Estatísticas */}
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

      {/* Histórico */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📋 Histórico de Atendimentos
        </h2>

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
                  {terapiasCapilares.map(atendimento => (
                    <AtendimentoCard
                      key={atendimento.id}
                      atendimento={atendimento}
                      cliente={clientesSalao.find(c => c.id === atendimento.clienteId)}
                      onViewDetails={() => alert('Ver detalhes (implementar navegação)')}
                    />
                  ))}
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
                  {megaHairs.map(atendimento => (
                    <AtendimentoCard
                      key={atendimento.id}
                      atendimento={atendimento}
                      cliente={clientesSalao.find(c => c.id === atendimento.clienteId)}
                      onViewDetails={() => alert('Ver detalhes (implementar navegação)')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
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
  );
};

export default Servicos;