// src/components/clientes/ProntuarioTab.jsx
import { useState, useMemo } from 'react';
import { Plus, Calendar, FileText, Package, ZoomIn, Edit, Trash2, TrendingUp, Clock } from 'lucide-react';
import ProntuarioForm from './ProntuarioForm';

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

  // Filtrar prontuários do cliente e ordenar por data
  const prontuariosCliente = useMemo(() => {
    return prontuarios
      .filter(p => p.clienteId === clienteId)
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA; // Mais recente primeiro
      });
  }, [prontuarios, clienteId]);

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
    setEditingProntuario(prontuario);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProntuario(null);
  };

  const handleSave = (dadosProntuario) => {
    if (editingProntuario) {
      onEditProntuario(editingProntuario.id, dadosProntuario);
    } else {
      onAddProntuario(dadosProntuario);
    }
    handleCloseForm();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.')) {
      onDeleteProntuario(id);
    }
  };

  const getProdutoNome = (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? `${produto.nome} - ${produto.marca}` : 'Produto não encontrado';
  };

  return (
    <div className="space-y-6">
      {/* Header com botão */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Prontuário de Terapia Capilar</h4>
          <p className="text-sm text-gray-600">Histórico completo de sessões e tratamentos</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          <Plus size={18} />
          <span>Nova Sessão</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Total de Sessões</p>
          <p className="text-2xl font-bold text-purple-700">{stats.totalSessoes}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-600 mb-1">Produtos Usados</p>
          <p className="text-2xl font-bold text-blue-700">{stats.totalProdutosUsados}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-green-600 mb-1">Última Sessão</p>
          <p className="text-lg font-bold text-green-700">{stats.ultimaSessao}</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <p className="text-xs text-pink-600 mb-1">Próxima Sessão</p>
          <p className="text-lg font-bold text-pink-700">{stats.proximaSessao}</p>
        </div>
      </div>

      {/* Lista de Prontuários */}
      {prontuariosCliente.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium">Nenhuma sessão registrada ainda</p>
          <p className="text-sm text-gray-500 mt-2">
            Clique em "Nova Sessão" para registrar o primeiro atendimento
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
          {prontuariosCliente.map((prontuario, index) => (
            <div 
              key={prontuario.id} 
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all p-5"
            >
              {/* Header da Sessão */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    {prontuariosCliente.length - index}
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

              {/* Diagnóstico */}
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText size={16} className="text-purple-600" />
                  <p className="text-sm font-semibold text-gray-700">Diagnóstico:</p>
                </div>
                <p className="text-sm text-gray-600 pl-6 bg-purple-50 p-3 rounded-lg">
                  {prontuario.diagnostico}
                </p>
              </div>

              {/* Tratamento */}
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <p className="text-sm font-semibold text-gray-700">Tratamento:</p>
                </div>
                <p className="text-sm text-gray-600 pl-6 bg-blue-50 p-3 rounded-lg">
                  {prontuario.tratamento}
                </p>
              </div>

              {/* Produtos Usados */}
              {prontuario.produtosUsados && prontuario.produtosUsados.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package size={16} className="text-green-600" />
                    <p className="text-sm font-semibold text-gray-700">Produtos Utilizados:</p>
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

              {/* Observações */}
              {prontuario.observacoes && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">💡 Observações:</p>
                  <p className="text-sm text-gray-600 pl-6 bg-gray-50 p-3 rounded-lg italic">
                    {prontuario.observacoes}
                  </p>
                </div>
              )}

              {/* Próxima Sessão */}
              {prontuario.proximaSessao && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">📅 Próxima Sessão:</p>
                  <p className="text-sm text-gray-600 pl-6 bg-yellow-50 p-2 rounded-lg font-medium">
                    {prontuario.proximaSessao}
                  </p>
                </div>
              )}

              {/* Imagens */}
              {(prontuario.imagens?.tricoscopia?.length > 0 || prontuario.imagens?.anteDepois?.length > 0) && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">📸 Imagens:</p>
                  
                  {/* Tricoscopia */}
                  {prontuario.imagens.tricoscopia?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-2 pl-6">🔬 Tricoscopia:</p>
                      <div className="grid grid-cols-4 gap-2 pl-6">
                        {prontuario.imagens.tricoscopia.map((img, idx) => (
                          <div 
                            key={idx}
                            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:border-purple-500 transition-all group"
                            onClick={() => setPreviewImage(img)}
                          >
                            <img src={img} alt={`Tricoscopia ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-all" size={24} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Antes/Depois */}
                  {prontuario.imagens.anteDepois?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2 pl-6">📷 Antes/Depois:</p>
                      <div className="grid grid-cols-4 gap-2 pl-6">
                        {prontuario.imagens.anteDepois.map((img, idx) => (
                          <div 
                            key={idx}
                            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:border-pink-500 transition-all group"
                            onClick={() => setPreviewImage(img)}
                          >
                            <img src={img} alt={`Antes/Depois ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-all" size={24} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Preview de Imagem */}
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

      {/* Modal de Formulário */}
      {showForm && (
        <ProntuarioForm
          clienteId={clienteId}
          prontuarioEdit={editingProntuario}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProntuarioTab;