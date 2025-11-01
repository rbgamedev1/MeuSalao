import { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2, DollarSign } from 'lucide-react';
import Modal from '../components/Modal';

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    marca: '',
    estoque: '',
    estoqueMinimo: '',
    valorCusto: '',
    valorVenda: '',
    fornecedor: '',
    codigo: ''
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
      fornecedor: 'Distribuidora Beauty',
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
      fornecedor: 'Distribuidora Beauty',
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
      fornecedor: 'Beauty Supply',
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
      fornecedor: 'Cosméticos Brasil',
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
      fornecedor: 'Distribuidora Beauty',
      codigo: 'MASK001'
    },
    {
      id: 6,
      nome: 'Removedor de Esmalte',
      categoria: 'Unhas',
      marca: 'Risqué',
      estoque: 12,
      estoqueMinimo: 10,
      valorCusto: 3.50,
      valorVenda: 9.90,
      fornecedor: 'Cosméticos Brasil',
      codigo: 'REM001'
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
        fornecedor: produto.fornecedor,
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
        fornecedor: '',
        codigo: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nome: '',
      categoria: '',
      marca: '',
      estoque: '',
      estoqueMinimo: '',
      valorCusto: '',
      valorVenda: '',
      fornecedor: '',
      codigo: ''
    });
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
              valorVenda: parseFloat(formData.valorVenda)
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
        valorVenda: parseFloat(formData.valorVenda)
      };
      setProdutos([...produtos, newProduto]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
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

      {/* Modal de Cadastro/Edição */}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fornecedor *
            </label>
            <input
              type="text"
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Distribuidora Beauty"
            />
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
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Produtos;