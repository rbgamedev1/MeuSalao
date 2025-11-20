// src/pages/Servicos.jsx - VERSÃO CORRIGIDA COMPLETA

import { useState, useContext } from 'react';
import { Settings, Search, Plus, Edit, Trash2, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SalaoContext } from '../contexts/SalaoContext';
import { CATEGORIAS_SERVICOS } from '../data/categoriasServicosData';
import { generateDurationOptions } from '../utils/masks';

// Componente Header
const ServicosHeader = ({ salaoNome, onOpenServicoModal }) => (
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Serviços</h2>
      <p className="text-gray-600 mt-1">Gerencie os serviços do {salaoNome}</p>
    </div>
    <button
      onClick={onOpenServicoModal}
      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
    >
      <Plus size={20} />
      <span>Novo Serviço</span>
    </button>
  </div>
);

// Componente Stats
const ServicosStats = ({ totalServicos, valorMedio, servicosPremium, totalCategorias }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-purple-600 font-medium">Total de Serviços</p>
          <p className="text-3xl font-bold text-purple-700 mt-2">{totalServicos}</p>
        </div>
        <TrendingUp className="text-purple-400" size={32} />
      </div>
    </div>

    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-600 font-medium">Valor Médio</p>
          <p className="text-3xl font-bold text-green-700 mt-2">R$ {valorMedio.toFixed(2)}</p>
        </div>
        <DollarSign className="text-green-400" size={32} />
      </div>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-blue-600 font-medium">Serviços Premium</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">{servicosPremium}</p>
        </div>
        <Clock className="text-blue-400" size={32} />
      </div>
    </div>

    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 border border-pink-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-pink-600 font-medium">Categorias</p>
          <p className="text-3xl font-bold text-pink-700 mt-2">{totalCategorias}</p>
        </div>
        <Users className="text-pink-400" size={32} />
      </div>
    </div>
  </div>
);

// Componente Filtros
const ServicosFilters = ({ searchTerm, setSearchTerm, categoriaFiltro, setCategoriaFiltro, categorias }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
);

// Componente Grid de Serviços
const ServicosGrid = ({ filteredServicos, profissionais, handleOpenModal, handleDelete }) => {
  if (filteredServicos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
        <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 font-medium">Nenhum serviço encontrado</p>
        <p className="text-sm text-gray-500 mt-2">Comece adicionando um novo serviço</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServicos.map((servico) => {
        const profissionaisHabilitados = profissionais.filter(p => 
          servico.profissionaisHabilitados?.includes(p.id)
        );

        return (
          <div
            key={servico.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
              <h3 className="text-xl font-bold text-white">{servico.nome}</h3>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                {servico.categoria}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {servico.subcategoria && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Subcategoria:</span> {servico.subcategoria}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-700">{servico.duracao} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-xl font-bold text-green-600">R$ {servico.valor.toFixed(2)}</span>
                </div>
              </div>

              {servico.comissao > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Comissão:</span> {servico.comissao}%
                </div>
              )}

              {servico.descricao && (
                <p className="text-sm text-gray-600 line-clamp-2">{servico.descricao}</p>
              )}

              {profissionaisHabilitados.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Profissionais habilitados:</p>
                  <div className="flex flex-wrap gap-1">
                    {profissionaisHabilitados.map(prof => (
                      <span
                        key={prof.id}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                      >
                        {prof.nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  servico.ativo 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {servico.ativo ? 'Ativo' : 'Inativo'}
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(servico)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(servico.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Componente Modal
const ServicoModal = ({ 
  showModal, 
  handleCloseModal, 
  editingId, 
  formData, 
  handleChange, 
  handleProfissionalToggle,
  handleSubmit,
  servicosDisponiveis,
  profissionaisSalao,
  durationOptions,
  servicosSalao
}) => {
  if (!showModal) return null;

  const servicoSelecionado = servicosDisponiveis.find(s => 
    s.nome === formData.nome && 
    s.categoria === formData.categoria
  );

  const subcategorias = servicoSelecionado?.subcategorias || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleCloseModal}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-lg">
            <h3 className="text-xl font-semibold text-white">
              {editingId ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Serviço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serviço *
              </label>
              {editingId ? (
                <input
                  type="text"
                  value={formData.nome}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              ) : (
                <select
                  name="nome"
                  value={formData.nome}
                  onChange={(e) => {
                    const selectedServico = servicosDisponiveis.find(s => 
                      `${s.categoria}|${s.nome}` === e.target.value
                    );
                    if (selectedServico) {
                      handleChange({ 
                        target: { 
                          name: 'nome', 
                          value: selectedServico.nome 
                        } 
                      });
                      handleChange({ 
                        target: { 
                          name: 'categoria', 
                          value: selectedServico.categoria 
                        } 
                      });
                      handleChange({ 
                        target: { 
                          name: 'subcategoria', 
                          value: '' 
                        } 
                      });
                    }
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione um serviço</option>
                  {servicosDisponiveis.map((servico, index) => (
                    <option 
                      key={index} 
                      value={`${servico.categoria}|${servico.nome}`}
                      disabled={servicosSalao.some(s => s.nome === servico.nome && s.categoria === servico.categoria)}
                    >
                      {servico.categoria} - {servico.nome}
                      {servicosSalao.some(s => s.nome === servico.nome && s.categoria === servico.categoria) ? ' (Já cadastrado)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Subcategoria */}
            {subcategorias.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategoria
                </label>
                <select
                  name="subcategoria"
                  value={formData.subcategoria}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Nenhuma</option>
                  {subcategorias.map((sub, index) => (
                    <option key={index} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Duração e Valor */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração (minutos) *
                </label>
                <select
                  name="duracao"
                  value={formData.duracao}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Comissão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comissão (%)
              </label>
              <input
                type="number"
                name="comissao"
                value={formData.comissao}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Descrição do serviço..."
              />
            </div>

            {/* Profissionais Habilitados */}
            {profissionaisSalao.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissionais Habilitados
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {profissionaisSalao.map(prof => (
                    <label key={prof.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.profissionaisHabilitados.includes(prof.id)}
                        onChange={() => handleProfissionalToggle(prof.id)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{prof.nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Serviço ativo
              </label>
            </div>

            {/* Botões */}
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
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                {editingId ? 'Salvar Alterações' : 'Cadastrar Serviço'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const Servicos = () => {
  const navigate = useNavigate();
  const { 
    salaoAtual,
    servicos, 
    setServicos, 
    profissionais,
    getServicosPorSalao,
    getProfissionaisPorSalao,
    getServicosDisponiveis
  } = useContext(SalaoContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    subcategoria: '',
    duracao: 30,
    valor: '',
    comissao: '',
    descricao: '',
    profissionaisHabilitados: [],
    ativo: true
  });

  const durationOptions = generateDurationOptions();

  const servicosSalao = getServicosPorSalao();
  const profissionaisSalao = getProfissionaisPorSalao();
  const servicosDisponiveis = getServicosDisponiveis();

  const hasCategoriasConfiguradas = servicosDisponiveis.length > 0;

  const categoriasParaFiltro = [...new Set(
    servicosDisponiveis.map(s => {
      const cat = CATEGORIAS_SERVICOS.find(c => c.id === s.categoriaId);
      return cat?.nome;
    })
  )].filter(Boolean);

  const handleOpenModal = (servico = null) => {
    if (!hasCategoriasConfiguradas) {
      const confirmar = window.confirm(
        '⚠️ Nenhum serviço configurado!\n\n' +
        'Você precisa configurar as categorias e serviços do salão antes de cadastrar serviços.\n\n' +
        'Deseja ir para a página de Configurações agora?'
      );
      
      if (confirmar) {
        navigate('/configuracoes');
      }
      return;
    }

    if (servico) {
      setEditingId(servico.id);
      setFormData({
        nome: servico.nome,
        categoria: servico.categoria,
        subcategoria: servico.subcategoria,
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
        subcategoria: '',
        duracao: 30,
        valor: '',
        comissao: '0',
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
              comissao: formData.comissao ? parseInt(formData.comissao) : 0,
              salaoId: salaoAtual.id
            } 
          : s
      ));
      alert('Serviço atualizado com sucesso!');
    } else {
      const newServico = {
        ...formData,
        id: Math.max(...servicos.map(s => s.id), 0) + 1,
        duracao: parseInt(formData.duracao),
        valor: parseFloat(formData.valor),
        comissao: formData.comissao ? parseInt(formData.comissao) : 0,
        salaoId: salaoAtual.id
      };
      setServicos([...servicos, newServico]);
      alert('Serviço cadastrado com sucesso!');
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServicos(servicos.filter(s => s.id !== id));
      alert('Serviço excluído com sucesso!');
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

  const filteredServicos = servicosSalao.filter(servico => {
    const matchSearch = servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servico.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || servico.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const totalServicos = servicosSalao.length;
  const valorMedio = servicosSalao.length > 0 
    ? servicosSalao.reduce((acc, s) => acc + s.valor, 0) / servicosSalao.length 
    : 0;
  const servicosMaisCaros = servicosSalao.filter(s => s.valor > 100).length;

  return (
    <div className="space-y-6">
      <ServicosHeader 
        salaoNome={salaoAtual.nome}
        onOpenServicoModal={() => handleOpenModal()}
      />

      {!hasCategoriasConfiguradas && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Settings className="text-yellow-600 w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 text-lg mb-2">
                Configure os serviços do seu salão primeiro
              </h3>
              <p className="text-yellow-800 mb-4">
                Antes de cadastrar serviços com preços e profissionais, você precisa selecionar 
                quais categorias e serviços seu salão oferece.
              </p>
              <button
                onClick={() => navigate('/configuracoes')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                <Settings className="w-4 h-4" />
                Ir para Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {hasCategoriasConfiguradas && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-blue-900">
                <span className="font-bold">{servicosSalao.length}</span> serviços cadastrados
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                <span className="font-bold">{servicosDisponiveis.length}</span> serviços disponíveis para cadastro
              </p>
            </div>
          </div>
        </div>
      )}

      {hasCategoriasConfiguradas && (
        <>
          <ServicosStats 
            totalServicos={totalServicos}
            valorMedio={valorMedio}
            servicosPremium={servicosMaisCaros}
            totalCategorias={categoriasParaFiltro.length}
          />

          <ServicosFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            categorias={categoriasParaFiltro}
          />

          <ServicosGrid 
            filteredServicos={filteredServicos}
            profissionais={profissionais}
            handleOpenModal={handleOpenModal}
            handleDelete={handleDelete}
          />
        </>
      )}

      <ServicoModal 
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        editingId={editingId}
        formData={formData}
        handleChange={handleChange}
        handleProfissionalToggle={handleProfissionalToggle}
        handleSubmit={handleSubmit}
        servicosDisponiveis={servicosDisponiveis}
        profissionaisSalao={profissionaisSalao}
        durationOptions={durationOptions}
        servicosSalao={servicosSalao}
      />
    </div>
  );
};

export default Servicos;