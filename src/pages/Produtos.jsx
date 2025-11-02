import { useState, useContext } from 'react';
import { Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2, DollarSign, Phone, Mail } from 'lucide-react';
import Modal from '../components/Modal';
import MaskedInput from '../components/MaskedInput';
import { SalaoContext } from '../contexts/SalaoContext';

const Produtos = () => {
  const { fornecedores, setFornecedores } = useContext(SalaoContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFornecedorModal, setShowFornecedorModal] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [editingId, setEditingId] = useState(null);
  const [editingFornecedorId, setEditingFornecedorId] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    marca: '',
    estoque: '',
    estoqueMinimo: '',
    valorCusto: '',
    valorVenda: '',
    fornecedorId: '',
    codigo: ''
  });

  const [fornecedorData, setFornecedorData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cnpj: '',
    endereco: ''
  });

  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: 'Shampoo Profissional 1L',
      categoria: 'Cabelo',
      marca: 'L\'Oréal',
      estoque: 15,
      estoqueMinimo: 10,
      valorCusto: 45.00,
      valorVenda: 89.90,
      fornecedorId: 1,
      codigo: 'SHMP001'
    },
    {
      id: 2,
      nome: 'Condicionador Hidratante 1L',
      categoria: 'Cabelo',
      marca: 'L\'Oréal',
      estoque: 8,
      estoqueMinimo: 10,
      valorCusto: 48.00,
      valorVenda: 94.90,
      fornecedorId: 1,
      codigo: 'COND001'
    },
    {
      id: 3,
      nome: 'Coloração Permanente',
      categoria: 'Coloração',
      marca: 'Wella',
      estoque: 25,
      estoqueMinimo: 15,
      valorCusto: 28.00,
      valorVenda: 55.90,
      fornecedorId: 2,
      codigo: 'COLOR001'
    },
    {
      id: 4,
      nome: 'Esmalte Premium',
      categoria: 'Unhas',
      marca: 'Risqué',
      estoque: 45,
      estoqueMinimo: 20,
      valorCusto: 4.50,
      valorVenda: 12.90,
      fornecedorId: 3,
      codigo: 'ESM001'
    },
    {
      id: 5,
      nome: 'Máscara de Tratamento 500g',
      categoria: 'Tratamento',
      marca: 'Kerastase',
      estoque: 5,
      estoqueMinimo: 8,
      valorCusto: 85.00,
      valorVenda: 165.00,
      fornecedorId: 1,
      codigo: 'MASK001'
    }
  ]);

  const categorias = ['Todos', 'Cabelo', 'Coloração', 'Unhas', 'Tratamento'];

  const handleOpenModal = (produto = null) => {
    if (produto) {
      setEditingId(produto.id);
      setFormData({
        nome: produto.nome,
        categoria: produto.categoria,
        marca: produto.marca,
        estoque: produto.estoque.toString(),
        estoqueMinimo: produto.estoqueMinimo.toString(),
        valorCusto: produto.valorCusto.toString(),
        valorVenda: produto.valorVenda.toString(),
        fornecedorId: produto.fornecedorId?.toString() || '',
        codigo: produto.codigo
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        categoria: '',
        marca: '',
        estoque: '',
        estoqueMinimo: '',
        valorCusto: '',
        valorVenda: '',
        fornecedorId: '',
        codigo: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleOpenFornecedorModal = (fornecedor = null) => {
    if (fornecedor) {
      setEditingFornecedorId(fornecedor.id);
      setFornecedorData({
        nome: fornecedor.nome,
        telefone: fornecedor.telefone,
        email: fornecedor.email,
        cnpj: fornecedor.cnpj || '',
        endereco: fornecedor.endereco || ''
      });
    } else {
      setEditingFornecedorId(null);
      setFornecedorData({
        nome: '',
        telefone: '',
        email: '',
        cnpj: '',
        endereco: ''
      });
    }
    setShowFornecedorModal(true);
  };

  const handleCloseFornecedorModal = () => {
    setShowFornecedorModal(false);
    setEditingFornecedorId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setProdutos(produtos.map(p => 
        p.id === editingId 
          ? { 
              ...formData, 
              id: editingId,
              estoque: parseInt(formData.estoque),
              estoqueMinimo: parseInt(formData.estoqueMinimo),
              valorCusto: parseFloat(formData.valorCusto),
              valorVenda: parseFloat(formData.valorVenda),
              fornecedorId: formData.fornecedorId ? parseInt(formData.fornecedorId) : null
            } 
          : p
      ));
    } else {
      const newProduto = {
        ...formData,
        id: Math.max(...produtos.map(p => p.id), 0) + 1,
        estoque: parseInt(formData.estoque),
        estoqueMinimo: parseInt(formData.estoqueMinimo),
        valorCusto: parseFloat(formData.valorCusto),
        valorVenda: parseFloat(formData.valorVenda),
        fornecedorId: formData.fornecedorId ? parseInt(formData.fornecedorId) : null
      };
      setProdutos([...produtos, newProduto]);
    }
    
    handleCloseModal();
  };

  const handleSubmitFornecedor = (e) => {
    e.preventDefault();
    
    if (editingFornecedorId) {
      setFornecedores(fornecedores.map(f => 
        f.id === editingFornecedorId 
          ? { ...fornecedorData, id: editingFornecedorId }
          : f
      ));
    } else {
      const newFornecedor = {
        ...fornecedorData,
        id: Math.max(...fornecedores.map(f => f.id), 0) + 1
      };
      setFornecedores([...fornecedores, newFornecedor]);
    }
    
    handleCloseFornecedorModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  };

  const handleDeleteFornecedor = (id) => {
    const produtosComFornecedor = produtos.filter(p => p.fornecedorId === id);
    if (produtosComFornecedor.length > 0) {
      alert(`Não é possível excluir. Existem ${produtosComFornecedor.length} produto(s) vinculados a este fornecedor.`);
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      setFornecedores(fornecedores.filter(f => f.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFornecedorChange = (e) => {
    const { name, value } = e.target;
    setFornecedorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredProdutos = produtos.filter(produto => {
    const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const getFornecedor = (fornecedorId) => {
    return fornecedores.find(f => f.id === fornecedorId);
  };

  const totalProdutos = produtos.length;
  const produtosBaixoEstoque = produtos.filter(p => p.estoque <= p.estoqueMinimo).length;
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + (p.valorCusto * p.estoque), 0);
  const margemMedia = produtos.reduce((acc, p) => acc + ((p.valorVenda - p.valorCusto) / p.valorCusto * 100), 0) / produtos.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-600 mt-1">Gerencie seu estoque de produtos</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleOpenFornecedorModal()}
            className="flex items-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all"
          >
            <Package size={20} />
            <span>Gerenciar Fornecedores</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus size={20} />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Produtos</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalProdutos}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Baixo Estoque</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{produtosBaixoEstoque}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor em Estoque</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                R$ {valorTotalEstoque.toFixed(0)}
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
              <p className="text-sm text-gray-600">Margem Média</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{margemMedia.toFixed(0)}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {produtosBaixoEstoque > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-600 mr-3" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Atenção!</p>
              <p className="text-yellow-700 text-sm">
                {produtosBaixoEstoque} produto(s) com estoque baixo ou abaixo do mínimo
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Busca e Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, marca ou código..."
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
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Custo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProdutos.map((produto) => {
                const margem = ((produto.valorVenda - produto.valorCusto) / produto.valorCusto * 100).toFixed(1);
                const estoqueBaixo = produto.estoque <= produto.estoqueMinimo;
                const fornecedor = getFornecedor(produto.fornecedorId);
                
                return (
                  <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{produto.nome}</p>
                        <p className="text-sm text-gray-500">{produto.marca} • {produto.codigo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {produto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {fornecedor ? (
                        <div>
                          <p className="text-sm font-medium text-gray-800">{fornecedor.nome}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <Phone size={12} />
                            <span>{fornecedor.telefone}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sem fornecedor</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${estoqueBaixo ? 'text-red-600' : 'text-gray-800'}`}>
                          {produto.estoque}
                        </span>
                        {estoqueBaixo && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Mín: {produto.estoqueMinimo}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      R$ {produto.valorCusto.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      R$ {produto.valorVenda.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-purple-600">{margem}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleOpenModal(produto)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(produto.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro/Edição de Produto */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Produto' : 'Novo Produto'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: Shampoo Profissional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: SHMP001"
              />
            </div>
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
                <option value="Cabelo">Cabelo</option>
                <option value="Coloração">Coloração</option>
                <option value="Unhas">Unhas</option>
                <option value="Tratamento">Tratamento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: L'Oréal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fornecedor *
            </label>
            <div className="flex space-x-2">
              <select
                name="fornecedorId"
                value={formData.fornecedorId}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map(forn => (
                  <option key={forn.id} value={forn.id}>
                    {forn.nome} - {forn.telefone}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  handleOpenFornecedorModal();
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            {formData.fornecedorId && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                {(() => {
                  const forn = getFornecedor(parseInt(formData.fornecedorId));
                  return forn ? (
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">{forn.nome}</p>
                      <div className="flex items-center space-x-4 text-blue-700 mt-1">
                        <div className="flex items-center space-x-1">
                          <Phone size={14} />
                          <span>{forn.telefone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{forn.email}</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estoque Atual *
              </label>
              <input
                type="number"
                name="estoque"
                value={formData.estoque}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estoque Mínimo *
              </label>
              <input
                type="number"
                name="estoqueMinimo"
                value={formData.estoqueMinimo}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor de Custo (R$) *
              </label>
              <input
                type="number"
                name="valorCusto"
                value={formData.valorCusto}
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
                Valor de Venda (R$) *
              </label>
              <input
                type="number"
                name="valorVenda"
                value={formData.valorVenda}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {formData.valorCusto && formData.valorVenda && parseFloat(formData.valorVenda) > 0 && parseFloat(formData.valorCusto) > 0 && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Margem de Lucro:</span> {' '}
                {(((parseFloat(formData.valorVenda) - parseFloat(formData.valorCusto)) / parseFloat(formData.valorCusto)) * 100).toFixed(1)}%
              </p>
            </div>
          )}

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
              {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Gerenciar Fornecedores */}
      <Modal
        isOpen={showFornecedorModal}
        onClose={handleCloseFornecedorModal}
        title={editingFornecedorId ? 'Editar Fornecedor' : 'Novo Fornecedor'}
        size="lg"
      >
        <form onSubmit={handleSubmitFornecedor} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Fornecedor *
            </label>
            <input
              type="text"
              name="nome"
              value={fornecedorData.nome}
              onChange={handleFornecedorChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Distribuidora Beauty"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <MaskedInput
                mask="phone"
                name="telefone"
                value={fornecedorData.telefone}
                onChange={handleFornecedorChange}
                required
                placeholder="(11) 3456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={fornecedorData.email}
                onChange={handleFornecedorChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="contato@fornecedor.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ
            </label>
            <input
              type="text"
              name="cnpj"
              value={fornecedorData.cnpj}
              onChange={handleFornecedorChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={fornecedorData.endereco}
              onChange={handleFornecedorChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Rua, número - bairro"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseFornecedorModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {editingFornecedorId ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
            </button>
          </div>
        </form>

        {/* Lista de Fornecedores Existentes */}
        {!editingFornecedorId && fornecedores.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Fornecedores Cadastrados</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {fornecedores.map(forn => (
                <div key={forn.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{forn.nome}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone size={14} />
                          <span>{forn.telefone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail size={14} />
                          <span>{forn.email}</span>
                        </div>
                        {forn.cnpj && (
                          <p className="text-sm text-gray-600">CNPJ: {forn.cnpj}</p>
                        )}
                        {forn.endereco && (
                          <p className="text-sm text-gray-600">{forn.endereco}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {produtos.filter(p => p.fornecedorId === forn.id).length} produto(s) cadastrados
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        type="button"
                        onClick={() => handleOpenFornecedorModal(forn)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFornecedor(forn.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Produtos;