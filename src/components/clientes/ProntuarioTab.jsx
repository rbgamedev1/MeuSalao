// src/components/clientes/ProntuarioTab.jsx - VERSÃO MODULARIZADA
import { useState, useMemo } from 'react';
import { Plus, FileText } from 'lucide-react';
import ProntuarioForm from './ProntuarioForm';
import ProntuarioCard from './prontuario/ProntuarioCard';
import TerapiaCard from './prontuario/TerapiaCard';
import TipoSelectorModal from './prontuario/TipoSelectorModal';
import TerapiaDetalhesModal from './prontuario/TerapiaDetalhesModal';
import FormularioAvaliacaoInicial from '../terapiaCapilar/FormularioAvaliacaoInicial';
import FormularioSelecaoTratamento from '../terapiaCapilar/FormularioSelecaoTratamento';
import FormularioAplicacaoTratamento from '../terapiaCapilar/FormularioAplicacaoTratamento';
import FormularioFinalizacao from '../terapiaCapilar/FormularioFinalizacao';
import { getTodayBR } from '../../utils/masks';
import { CheckCircle } from 'lucide-react';

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
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [showTipoSelector, setShowTipoSelector] = useState(false);
  const [showListaTerapia, setShowListaTerapia] = useState(false);
  const [terapiaAtual, setTerapiaAtual] = useState(null);
  const [etapaAtiva, setEtapaAtiva] = useState(null);
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
        setTerapiaAtual(prontuario);
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
    setShowListaTerapia(false);
  };

  const handleSaveEtapa = (dadosEtapa) => {
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    if (terapiaAtual) {
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
                {terapiasCapilares.map((terapia, index) => (
                  <TerapiaCard
                    key={terapia.id}
                    terapia={terapia}
                    index={index}
                    onEdit={() => handleOpenForm(terapia)}
                    onDelete={() => handleDelete(terapia.id)}
                    onViewDetails={() => setViewDetalhes(terapia)}
                  />
                ))}
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
                {megaHairs.map((mega, index) => (
                  <TerapiaCard
                    key={mega.id}
                    terapia={mega}
                    index={index}
                    onEdit={() => handleOpenForm(mega)}
                    onDelete={() => handleDelete(mega.id)}
                    onViewDetails={() => setViewDetalhes(mega)}
                  />
                ))}
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
                {prontuariosNormais.map((prontuario, index) => (
                  <ProntuarioCard
                    key={prontuario.id}
                    prontuario={prontuario}
                    index={index}
                    total={prontuariosNormais.length}
                    produtos={produtos}
                    onEdit={() => handleOpenForm(prontuario)}
                    onDelete={() => handleDelete(prontuario.id)}
                    onImageClick={(img) => setPreviewImage(img)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showTipoSelector && (
        <TipoSelectorModal
          onSelect={handleSelectTipo}
          onClose={handleCloseAll}
        />
      )}

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
                {[
                  { id: 'avaliacao', nome: 'Avaliação Inicial', icon: '🔍', desc: 'Anamnese, histórico, avaliação visual e fotográfica' },
                  { id: 'selecao', nome: 'Seleção de Tratamento', icon: '💊', desc: 'Escolha de produtos, técnicas e plano de tratamento' },
                  { id: 'aplicacao', nome: 'Aplicação do Tratamento', icon: '✨', desc: 'Registro da aplicação, produtos e procedimentos' },
                  { id: 'finalizacao', nome: 'Finalização', icon: '🎯', desc: 'Resultados, orientações e agendamento do retorno' }
                ].map(etapa => (
                  <button
                    key={etapa.id}
                    onClick={() => handleAbrirEtapa(etapa.id, terapiaAtual)}
                    className="group bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-5 hover:border-purple-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-4xl mb-3">{etapa.icon}</div>
                        <h4 className="text-lg font-bold text-purple-900 mb-1">{etapa.nome}</h4>
                        <p className="text-sm text-gray-600">{etapa.desc}</p>
                      </div>
                      {terapiaAtual?.etapasCompletas?.includes(etapa.id) && (
                        <CheckCircle className="text-green-600" size={24} />
                      )}
                    </div>
                  </button>
                ))}
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

      {showForm && (
        <ProntuarioForm
          clienteId={clienteId}
          prontuarioEdit={editingProntuario}
          onClose={handleCloseAll}
          onSave={handleSaveNormal}
        />
      )}

      {etapaAtiva && renderFormularioEtapa()}

      {viewDetalhes && (
        <TerapiaDetalhesModal
          terapia={viewDetalhes}
          onClose={() => setViewDetalhes(null)}
          onEdit={() => {
            setTerapiaAtual(viewDetalhes);
            setViewDetalhes(null);
            setShowListaTerapia(true);
          }}
          onImageClick={(img) => setPreviewImage(img)}
        />
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