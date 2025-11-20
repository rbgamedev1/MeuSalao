// src/components/clientes/ProntuarioTab.jsx - VERSÃO COM CARDS
import { useState, useMemo } from 'react';
import { Plus, Calendar, FileText, Package, ZoomIn, Edit, Trash2, TrendingUp, Clock, CheckCircle, ChevronRight, Star } from 'lucide-react';
import ProntuarioForm from './ProntuarioForm';
import FormularioAvaliacaoInicial from '../terapiaCapilar/FormularioAvaliacaoInicial';
import FormularioSelecaoTratamento from '../terapiaCapilar/FormularioSelecaoTratamento';
import FormularioAplicacaoTratamento from '../terapiaCapilar/FormularioAplicacaoTratamento';
import FormularioFinalizacao from '../terapiaCapilar/FormularioFinalizacao';
import { getTodayBR } from '../../utils/masks';

const ProntuarioTab = ({ 
  clienteId, 
  prontuarios = [], 
  produtos = [],
  onAddProntuario,
  onEditProntuario,
  onDeleteProntuario 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProntuario, setEditingProntuario] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [tipoSelecionado, setTipoSelecionado] = useState(null); // 'terapia_capilar' | 'mega_hair'
  const [showTipoSelector, setShowTipoSelector] = useState(false);
  const [showListaTerapia, setShowListaTerapia] = useState(false);
  const [terapiaAtual, setTerapiaAtual] = useState(null);
  const [etapaAtiva, setEtapaAtiva] = useState(null); // 'avaliacao' | 'selecao' | 'aplicacao' | 'finalizacao'
  const [viewDetalhes, setViewDetalhes] = useState(null);

  // Filtrar prontuários do cliente
  const prontuariosCliente = useMemo(() => {
    return prontuarios
      .filter(p => p.clienteId === clienteId)
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      });
  }, [prontuarios, clienteId]);

  // Separar por tipo
  const terapiasCapilares = prontuariosCliente.filter(p => p.tipo === 'terapia_capilar');
  const megaHairs = prontuariosCliente.filter(p => p.tipo === 'mega_hair');
  const prontuariosNormais = prontuariosCliente.filter(p => !p.tipo || p.tipo === 'normal');

  // Estatísticas
  const stats = useMemo(() => {
    const totalSessoes = prontuariosCliente.length;
    const produtosUsados = new Set();
    
    prontuariosCliente.forEach(p => {
      p.produtosUsados?.forEach(prodId => produtosUsados.add(prodId));
    });

    return {
      totalSessoes,
      totalProdutosUsados: produtosUsados.size,
      ultimaSessao: prontuariosCliente[0]?.data || 'N/A',
      proximaSessao: prontuariosCliente[0]?.proximaSessao || 'Não agendada'
    };
  }, [prontuariosCliente]);

  const handleOpenForm = (prontuario = null) => {
    if (prontuario) {
      setEditingProntuario(prontuario);
      if (prontuario.tipo === 'terapia_capilar' || prontuario.tipo === 'mega_hair') {
        setTipoSelecionado(prontuario.tipo);
        setShowListaTerapia(true);
      } else {
        setShowForm(true);
      }
    } else {
      setShowTipoSelector(true);
    }
  };

  const handleCloseAll = () => {
    setShowForm(false);
    setShowTipoSelector(false);
    setShowListaTerapia(false);
    setEditingProntuario(null);
    setTipoSelecionado(null);
    setTerapiaAtual(null);
    setEtapaAtiva(null);
    setViewDetalhes(null);
  };

  const handleSelectTipo = (tipo) => {
    setTipoSelecionado(tipo);
    setShowTipoSelector(false);
    
    if (tipo === 'normal') {
      setShowForm(true);
    } else {
      setShowListaTerapia(true);
    }
  };

  const handleAbrirEtapa = (etapa, terapia = null) => {
    setTerapiaAtual(terapia);
    setEtapaAtiva(etapa);
    setViewDetalhes(null);
  };

  const handleSaveEtapa = (dadosEtapa) => {
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    if (terapiaAtual) {
      // Editando terapia existente
      const dadosAtualizados = {
        ...terapiaAtual.dadosTerapiaCapilar,
        ...dadosEtapa
      };
      
      const etapasCompletas = terapiaAtual.etapasCompletas || [];
      if (!etapasCompletas.includes(etapaAtiva)) {
        etapasCompletas.push(etapaAtiva);
      }
      
      onEditProntuario(terapiaAtual.id, {
        dadosTerapiaCapilar: dadosAtualizados,
        etapasCompletas,
        data: getTodayBR(),
        hora
      });
    } else {
      // Nova terapia
      const novaTerapia = {
        clienteId,
        tipo: tipoSelecionado,
        data: getTodayBR(),
        hora,
        dadosTerapiaCapilar: dadosEtapa,
        etapasCompletas: [etapaAtiva]
      };
      
      onAddProntuario(novaTerapia);
    }
    
    setEtapaAtiva(null);
    setTerapiaAtual(null);
  };

  const handleSaveNormal = (dados) => {
    if (editingProntuario) {
      onEditProntuario(editingProntuario.id, dados);
    } else {
      onAddProntuario(dados);
    }
    handleCloseAll();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
      onDeleteProntuario(id);
    }
  };

  const handleImagensChange = (campo, imagens) => {
    // Atualizado via onChange do formulário
  };

  const getProdutoNome = (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? `${produto.nome} - ${produto.marca}` : 'Produto não encontrado';
  };

  const renderCardTerapia = (terapia, index) => {
    const etapas = terapia.etapasCompletas || [];
    const dados = terapia.dadosTerapiaCapilar || {};
    
    return (
      <div 
        key={terapia.id}
        className="bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all p-5 cursor-pointer"
        onClick={() => setViewDetalhes(terapia)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              🌸
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="font-semibold text-gray-800">{terapia.data}</p>
                <span className="text-gray-400">•</span>
                <Clock size={16} className="text-gray-400" />
                <p className="text-gray-600">{terapia.hora}</p>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {index === 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    Mais Recente
                  </span>
                )}
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  {etapas.length}/4 Etapas
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleAbrirEtapa(null, terapia)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Continuar"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(terapia.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Progresso das Etapas */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { id: 'avaliacao', nome: 'Avaliação', icon: '🔍' },
            { id: 'selecao', nome: 'Seleção', icon: '💊' },
            { id: 'aplicacao', nome: 'Aplicação', icon: '✨' },
            { id: 'finalizacao', nome: 'Finalização', icon: '🎯' }
          ].map(etapa => (
            <div 
              key={etapa.id}
              className={`text-center p-2 rounded-lg border ${
                etapas.includes(etapa.id)
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{etapa.icon}</div>
              <p className={`text-xs ${
                etapas.includes(etapa.id) ? 'text-green-700 font-medium' : 'text-gray-500'
              }`}>
                {etapa.nome}
              </p>
              {etapas.includes(etapa.id) && (
                <CheckCircle size={12} className="text-green-600 mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* Preview de Informações */}
        {dados.objetivoTratamento && (
          <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
            <p className="text-xs text-pink-700 font-medium mb-1">🎯 Objetivo:</p>
            <p className="text-sm text-gray-700 line-clamp-2">{dados.objetivoTratamento}</p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Clique para ver detalhes completos</span>
          <ChevronRight size={16} />
        </div>
      </div>
    );
  };

  const renderProntuarioNormal = (prontuario, index) => (
    <div 
      key={prontuario.id} 
      className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
            {prontuariosNormais.length - index}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-400" />
              <p className="font-semibold text-gray-800">{prontuario.data}</p>
              <span className="text-gray-400">•</span>
              <Clock size={16} className="text-gray-400" />
              <p className="text-gray-600">{prontuario.hora}</p>
            </div>
            {index === 0 && (
              <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                Mais Recente
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenForm(prontuario)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(prontuario.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Diagnóstico */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <FileText size={16} className="text-purple-600" />
            <p className="text-sm font-semibold text-gray-700">Diagnóstico:</p>
          </div>
          <p className="text-sm text-gray-600 pl-6 bg-purple-50 p-3 rounded-lg">
            {prontuario.diagnostico}
          </p>
        </div>

        {/* Tratamento */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp size={16} className="text-blue-600" />
            <p className="text-sm font-semibold text-gray-700">Tratamento:</p>
          </div>
          <p className="text-sm text-gray-600 pl-6 bg-blue-50 p-3 rounded-lg">
            {prontuario.tratamento}
          </p>
        </div>

        {/* Produtos */}
        {prontuario.produtosUsados && prontuario.produtosUsados.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Package size={16} className="text-green-600" />
              <p className="text-sm font-semibold text-gray-700">Produtos:</p>
            </div>
            <div className="pl-6 flex flex-wrap gap-2">
              {prontuario.produtosUsados.map(prodId => (
                <span 
                  key={prodId}
                  className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  {getProdutoNome(prodId)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Imagens */}
        {(prontuario.imagens?.tricoscopia?.length > 0 || prontuario.imagens?.anteDepois?.length > 0) && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">📸 Imagens:</p>
            <div className="grid grid-cols-4 gap-2 pl-6">
              {[
                ...(prontuario.imagens.tricoscopia || []),
                ...(prontuario.imagens.anteDepois || [])
              ].slice(0, 4).map((img, idx) => (
                <div 
                  key={idx}
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:border-purple-500 transition-all"
                  onClick={() => setPreviewImage(img)}
                >
                  <img src={img} alt={`Imagem ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFormularioEtapa = () => {
    const formData = terapiaAtual?.dadosTerapiaCapilar || {};
    const [localData, setLocalData] = useState(formData);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setLocalData(prev => ({ ...prev, [name]: value }));
    };

    const handleImagensChange = (campo, imagens) => {
      setLocalData(prev => ({ ...prev, [campo]: imagens }));
    };

    const handleSave = () => {
      handleSaveEtapa(localData);
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            onClick={() => setEtapaAtiva(null)}
          ></div>

          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {etapaAtiva === 'avaliacao' && '🔍 Avaliação Inicial'}
                    {etapaAtiva === 'selecao' && '💊 Seleção de Tratamento'}
                    {etapaAtiva === 'aplicacao' && '✨ Aplicação do Tratamento'}
                    {etapaAtiva === 'finalizacao' && '🎯 Finalização'}
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    {tipoSelecionado === 'terapia_capilar' ? 'Terapia Capilar' : 'Mega Hair'}
                  </p>
                </div>
                <button
                  onClick={() => setEtapaAtiva(null)}
                  className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {etapaAtiva === 'avaliacao' && (
                <FormularioAvaliacaoInicial
                  formData={localData}
                  onChange={handleChange}
                  onImagensChange={handleImagensChange}
                />
              )}
              {etapaAtiva === 'selecao' && (
                <FormularioSelecaoTratamento
                  formData={localData}
                  onChange={handleChange}
                  onImagensChange={handleImagensChange}
                  produtos={produtos}
                />
              )}
              {etapaAtiva === 'aplicacao' && (
                <FormularioAplicacaoTratamento
                  formData={localData}
                  onChange={handleChange}
                  onImagensChange={handleImagensChange}
                />
              )}
              {etapaAtiva === 'finalizacao' && (
                <FormularioFinalizacao
                  formData={localData}
                  onChange={handleChange}
                  onImagensChange={handleImagensChange}
                />
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
              <button
                onClick={() => setEtapaAtiva(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
              >
                Salvar Etapa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Prontuário do Cliente</h4>
          <p className="text-sm text-gray-600">Registros de atendimentos e tratamentos</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Plus size={18} />
          <span>Novo Registro</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Total de Registros</p>
          <p className="text-2xl font-bold text-purple-700">{stats.totalSessoes}</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <p className="text-xs text-pink-600 mb-1">Terapias Capilares</p>
          <p className="text-2xl font-bold text-pink-700">{terapiasCapilares.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-600 mb-1">Mega Hair</p>
          <p className="text-2xl font-bold text-blue-700">{megaHairs.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-green-600 mb-1">Última Sessão</p>
          <p className="text-lg font-bold text-green-700">{stats.ultimaSessao}</p>
        </div>
      </div>

      {/* Lista de Prontuários */}
      {prontuariosCliente.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium">Nenhum registro encontrado</p>
          <p className="text-sm text-gray-500 mt-2">
            Clique em "Novo Registro" para começar
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Terapias Capilares */}
          {terapiasCapilares.length > 0 && (
            <div>
              <h5 className="text-md font-semibold text-purple-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">🌸</span>
                Terapias Capilares ({terapiasCapilares.length})
              </h5>
              <div className="space-y-3">
                {terapiasCapilares.map((terapia, index) => renderCardTerapia(terapia, index))}
              </div>
            </div>
          )}

          {/* Mega Hair */}
          {megaHairs.length > 0 && (
            <div>
              <h5 className="text-md font-semibold text-blue-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">💇‍♀️</span>
                Mega Hair ({megaHairs.length})
              </h5>
              <div className="space-y-3">
                {megaHairs.map((mega, index) => renderCardTerapia(mega, index))}
              </div>
            </div>
          )}

          {/* Prontuários Normais */}
          {prontuariosNormais.length > 0 && (
            <div>
              <h5 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Sessões Simples ({prontuariosNormais.length})
              </h5>
              <div className="space-y-3">
                {prontuariosNormais.map((prontuario, index) => renderProntuarioNormal(prontuario, index))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Seletor de Tipo */}
      {showTipoSelector && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={handleCloseAll}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Selecione o Tipo de Atendimento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Terapia Capilar */}
                <button
                  onClick={() => handleSelectTipo('terapia_capilar')}
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
                  onClick={() => handleSelectTipo('mega_hair')}
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
                  onClick={() => handleSelectTipo('normal')}
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
                onClick={handleCloseAll}
                className="mt-6 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lista de Etapas (Terapia Capilar / Mega Hair) */}
      {showListaTerapia && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={handleCloseAll}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {tipoSelecionado === 'terapia_capilar' ? '🌸 Terapia Capilar' : '💇‍♀️ Mega Hair'}
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Selecione a etapa do atendimento que deseja registrar
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Etapa 1: Avaliação */}
                <button
                  onClick={() => handleAbrirEtapa('avaliacao', terapiaAtual)}
                  className="group bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-5 hover:border-purple-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-4xl mb-3">🔍</div>
                      <h4 className="text-lg font-bold text-purple-900 mb-1">Avaliação Inicial</h4>
                      <p className="text-sm text-gray-600">
                        Anamnese, histórico, avaliação visual e fotográfica
                      </p>
                    </div>
                    {terapiaAtual?.etapasCompletas?.includes('avaliacao') && (
                      <CheckCircle className="text-green-600" size={24} />
                    )}
                  </div>
                </button>

                {/* Etapa 2: Seleção */}
                <button
                  onClick={() => handleAbrirEtapa('selecao', terapiaAtual)}
                  className="group bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5 hover:border-blue-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-4xl mb-3">💊</div>
                      <h4 className="text-lg font-bold text-blue-900 mb-1">Seleção de Tratamento</h4>
                      <p className="text-sm text-gray-600">
                        Escolha de produtos, técnicas e plano de tratamento
                      </p>
                    </div>
                    {terapiaAtual?.etapasCompletas?.includes('selecao') && (
                      <CheckCircle className="text-green-600" size={24} />
                    )}
                  </div>
                </button>

                {/* Etapa 3: Aplicação */}
                <button
                  onClick={() => handleAbrirEtapa('aplicacao', terapiaAtual)}
                  className="group bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-300 rounded-xl p-5 hover:border-pink-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-4xl mb-3">✨</div>
                      <h4 className="text-lg font-bold text-pink-900 mb-1">Aplicação do Tratamento</h4>
                      <p className="text-sm text-gray-600">
                        Registro da aplicação, produtos e procedimentos
                      </p>
                    </div>
                    {terapiaAtual?.etapasCompletas?.includes('aplicacao') && (
                      <CheckCircle className="text-green-600" size={24} />
                    )}
                  </div>
                </button>

                {/* Etapa 4: Finalização */}
                <button
                  onClick={() => handleAbrirEtapa('finalizacao', terapiaAtual)}
                  className="group bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-5 hover:border-green-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-4xl mb-3">🎯</div>
                      <h4 className="text-lg font-bold text-green-900 mb-1">Finalização</h4>
                      <p className="text-sm text-gray-600">
                        Resultados, orientações e agendamento do retorno
                      </p>
                    </div>
                    {terapiaAtual?.etapasCompletas?.includes('finalizacao') && (
                      <CheckCircle className="text-green-600" size={24} />
                    )}
                  </div>
                </button>
              </div>

              {terapiaAtual && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900">
                    ℹ️ <strong>Editando terapia existente.</strong> As informações das etapas já preenchidas serão mantidas.
                  </p>
                </div>
              )}

              <button
                onClick={handleCloseAll}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulário Normal */}
      {showForm && (
        <ProntuarioForm
          clienteId={clienteId}
          prontuarioEdit={editingProntuario}
          onClose={handleCloseAll}
          onSave={handleSaveNormal}
        />
      )}

      {/* Modal Formulário de Etapa */}
      {etapaAtiva && renderFormularioEtapa()}

      {/* Modal Detalhes Completos */}
      {viewDetalhes && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setViewDetalhes(null)}
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
                      {viewDetalhes.data} • {viewDetalhes.hora}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewDetalhes(null)}
                    className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Progresso */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'avaliacao', nome: 'Avaliação', icon: '🔍' },
                    { id: 'selecao', nome: 'Seleção', icon: '💊' },
                    { id: 'aplicacao', nome: 'Aplicação', icon: '✨' },
                    { id: 'finalizacao', nome: 'Finalização', icon: '🎯' }
                  ].map(etapa => {
                    const completa = viewDetalhes.etapasCompletas?.includes(etapa.id);
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
                  {viewDetalhes.dadosTerapiaCapilar?.objetivoTratamento && (
                    <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <h4 className="text-sm font-semibold text-pink-900 mb-2 flex items-center">
                        🎯 Objetivo do Tratamento
                      </h4>
                      <p className="text-gray-700">{viewDetalhes.dadosTerapiaCapilar.objetivoTratamento}</p>
                    </div>
                  )}

                  {/* Tipo de Couro Cabeludo */}
                  {viewDetalhes.dadosTerapiaCapilar?.tipoCouroCabeludo && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-purple-900 mb-2">
                        💆‍♀️ Tipo de Couro Cabeludo
                      </h4>
                      <span className="inline-block px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm font-medium">
                        {viewDetalhes.dadosTerapiaCapilar.tipoCouroCabeludo}
                      </span>
                    </div>
                  )}

                  {/* Problemas Identificados */}
                  {viewDetalhes.dadosTerapiaCapilar?.problemasCapilares?.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                        ⚠️ Problemas Identificados
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {viewDetalhes.dadosTerapiaCapilar.problemasCapilares.map((prob, idx) => (
                          <span key={idx} className="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full text-xs">
                            {prob}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tratamentos Selecionados */}
                  {viewDetalhes.dadosTerapiaCapilar?.tratamentosSelecionados?.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-3">
                        💊 Tratamentos Aplicados
                      </h4>
                      <div className="space-y-2">
                        {viewDetalhes.dadosTerapiaCapilar.tratamentosSelecionados.map((trat, idx) => (
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
                  {viewDetalhes.dadosTerapiaCapilar?.avaliacaoCliente > 0 && (
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
                              star <= viewDetalhes.dadosTerapiaCapilar.avaliacaoCliente
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                        <span className="text-sm text-gray-700 ml-2">
                          ({viewDetalhes.dadosTerapiaCapilar.avaliacaoCliente}/5)
                        </span>
                      </div>
                      {viewDetalhes.dadosTerapiaCapilar.comentarioCliente && (
                        <p className="text-sm text-gray-700 mt-2 italic">
                          "{viewDetalhes.dadosTerapiaCapilar.comentarioCliente}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Imagens */}
                  {(viewDetalhes.dadosTerapiaCapilar?.imagensAvaliacao?.length > 0 ||
                    viewDetalhes.dadosTerapiaCapilar?.imagensFinais?.length > 0) && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        📸 Galeria de Imagens
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          ...(viewDetalhes.dadosTerapiaCapilar.imagensAvaliacao || []),
                          ...(viewDetalhes.dadosTerapiaCapilar.imagensFinais || [])
                        ].map((img, idx) => (
                          <div 
                            key={idx}
                            className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                            onClick={() => setPreviewImage(img)}
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
                  onClick={() => {
                    setTerapiaAtual(viewDetalhes);
                    setViewDetalhes(null);
                    setShowListaTerapia(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Editar / Continuar
                </button>
                <button
                  onClick={() => setViewDetalhes(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview de Imagem */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
            <img 
              src={previewImage} 
              alt="Preview Ampliado" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProntuarioTab;