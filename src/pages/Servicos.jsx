import { useState, useContext } from 'react';
import { Plus, Search, Clock, DollarSign, Edit, Trash2, Scissors, Tag, X } from 'lucide-react';
import Modal from '../components/Modal';
import { SalaoContext } from '../contexts/SalaoContext';
import { generateDurationOptions, unmaskCurrency } from '../utils/masks';

const Servicos = () => {
  const { servicos, setServicos, categorias, setCategorias, profissionais } = useContext(SalaoContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaParaEditar, setCategoriaParaEditar] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    duracao: 30,
    valor: '',
    comissao: '',
    descricao: '',
    profissionaisHabilitados: [],
    ativo: true
  });

  const durationOptions = generateDurationOptions();

  const handleOpenModal = (servico = null) => {
    if (servico) {
      setEditingId(servico.id);
      setFormData({
        nome: servico.nome,
        categoria: servico.categoria,
        duracao: servico.duracao,
        valor: servico.valor.toFixed(2),
        comissao: servico.comissao.toString(),
        descricao: servico.descricao,
        profissionaisHabilitados: servico.profissionaisHabilitados || [],
        ativo: servico.ativo
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        categoria: '',
        duracao: 30,
        valor: '',
        comissao: '',
        descricao: '',
        profissionaisHabilitados: [],
        ativo: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setServicos(servicos.map(s => 
        s.id === editingId 
          ? { 
              ...formData, 
              id: editingId,
              duracao: parseInt(formData.duracao),
              valor: parseFloat(formData.valor),
              comissao: parseInt(formData.comissao)
            } 
          : s
      ));
    } else {
      const newServico = {
        ...formData,
        id: Math.max(...servicos.map(s => s.id), 0) + 1,
        duracao: parseInt(formData.duracao),
        valor: parseFloat(formData.valor),
        comissao: parseInt(formData.comissao)
      };
      setServicos([...servicos, newServico]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServicos(servicos.filter(s => s.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfissionalToggle = (profissionalId) => {
    setFormData(prev => ({
      ...prev,
      profissionaisHabilitados: prev.profissionaisHabilitados.includes(profissionalId)
        ? prev.profissionaisHabilitados.filter(id => id !== profissionalId)
        : [...prev.profissionaisHabilitados, profissionalId]
    }));
  };

  // Gerenciamento de Categorias
  const handleAddCategoria = () => {
    if (novaCategoria.trim() && !categorias.includes(novaCategoria.trim())) {
      setCategorias([...categorias, novaCategoria.trim()]);
      setNovaCategoria('');
    }
  };

  const handleDeleteCategoria = (categoria) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoria}"?`)) {
      // Verificar se existem serviços usando esta categoria
      const servicosComCategoria = servicos.filter(s => s.categoria === categoria);
      if (servicosComCategoria.length > 0) {
        alert(`Não é possível excluir. Existem ${servicosComCategoria.length} serviço(s) usando esta categoria.`);
        return;
      }
      setCategorias(categorias.filter(c => c !== categoria));
    }
  };

  const handleEditCategoria = (categoriaAntiga) => {
    setCategoriaEditando(categoriaAntiga);
    setCategoriaParaEditar(categoriaAntiga);
  };

  const handleSaveEditCategoria = () => {
    if (categoriaParaEditar.trim() && categoriaParaEditar !== categoriaEditando) {
      // Atualizar categoria
      setCategorias(categorias.map(c => c === categoriaEditando ? categoriaParaEditar.trim() : c));
      
      // Atualizar serviços que usam esta categoria
      setServicos(servicos.map(s => 
        s.categoria === categoriaEditando 
          ? { ...s, categoria: categoriaParaEditar.trim() }
          : s
      ));
    }
    setCategoriaEditando('');
    setCategoriaParaEditar('');
  };

  const filteredServicos = servicos.filter(servico => {
    const matchSearch = servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servico.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || servico.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
  };

  const totalServicos = servicos.length;
  const valorMedio = servicos.reduce((acc, s) => acc + s.valor, 0) / servicos.length;
  const servicosMaisCaros = servicos.filter(s => s.valor > 100).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Serviços</h1>
          <p className="text-gray-600 mt-1">Gerencie os serviços do seu salão</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCategoriaModal(true)}
            className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Tag size={20} />
            <span>Gerenciar Categorias</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus size={20} />
            <span>Novo Serviço</span>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Serviços</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalServicos}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Scissors className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Médio</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                R$ {valorMedio.toFixed(0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Serviços Premium</p>
              <p className="text-3xl font-bold text-pink-600 mt-1">{servicosMaisCaros}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <Scissors className="text-pink-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{categorias.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Tag className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select 
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Todos">Todas as Categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServicos.map((servico) => (
          <div key={servico.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{servico.nome}</h3>
                  <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {servico.categoria}
                  </span>
                </div>
                <div className={`w-3 h-3 rounded-full ${servico.ativo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{servico.descricao}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={16} />
                    <span>Duração</span>
                  </div>
                  <span className="font-medium text-gray-800">{formatDuration(servico.duracao)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign size={16} />
                    <span>Valor</span>
                  </div>
                  <span className="font-bold text-green-600">R$ {servico.valor.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Comissão</span>
                  <span className="font-medium text-purple-600">{servico.comissao}%</span>
                </div>
              </div>

              {servico.profissionaisHabilitados && servico.profissionaisHabilitados.length > 0 && (
                <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-600 mb-2">Profissionais:</p>
                  <div className="flex flex-wrap gap-1">
                    {servico.profissionaisHabilitados.map(profId => {
                      const prof = profissionais.find(p => p.id === profId);
                      return prof ? (
                        <span key={profId} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {prof.nome}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleOpenModal(servico)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button 
                  onClick={() => handleDelete(servico.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Gerenciar Categorias */}
      <Modal
        isOpen={showCategoriaModal}
        onClose={() => {
          setShowCategoriaModal(false);
          setCategoriaEditando('');
          setNovaCategoria('');
        }}
        title="Gerenciar Categorias"
        size="md"
      >
        <div className="space-y-4">
          {/* Adicionar Nova Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova Categoria
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategoria()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Digite o nome da categoria"
              />
              <button
                onClick={handleAddCategoria}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Lista de Categorias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorias Existentes
            </label>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categorias.map((categoria) => (
                <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {categoriaEditando === categoria ? (
                    <>
                      <input
                        type="text"
                        value={categoriaParaEditar}
                        onChange={(e) => setCategoriaParaEditar(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="flex space-x-2 ml-2">
                        <button
                          onClick={handleSaveEditCategoria}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => {
                            setCategoriaEditando('');
                            setCategoriaParaEditar('');
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-gray-800">{categoria}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {servicos.filter(s => s.categoria === categoria).length} serviço(s)
                        </span>
                        <button
                          onClick={() => handleEditCategoria(categoria)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategoria(categoria)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Cadastro/Edição de Serviço */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Serviço' : 'Novo Serviço'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Serviço *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Corte Feminino"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração *
              </label>
              <select
                name="duracao"
                value={formData.duracao}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {durationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comissão (%) *
              </label>
              <input
                type="number"
                name="comissao"
                value={formData.comissao}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Descreva o serviço..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profissionais Habilitados *
            </label>
            <div className="space-y-2 p-4 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
              {profissionais.map(prof => (
                <label key={prof.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.profissionaisHabilitados.includes(prof.id)}
                    onChange={() => handleProfissionalToggle(prof.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">{prof.nome}</span>
                    <p className="text-xs text-gray-500">{prof.especialidades.join(', ')}</p>
                  </div>
                </label>
              ))}
            </div>
            {formData.profissionaisHabilitados.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Selecione pelo menos um profissional</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Serviço ativo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formData.profissionaisHabilitados.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Serviço'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Servicos;