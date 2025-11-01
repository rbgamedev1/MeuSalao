import { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, TrendingUp, Edit, Trash2, DollarSign } from 'lucide-react';

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  const [produtos] = useState([
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
          onClick={() => setShowModal(true)}
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
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
};

export default Produtos;