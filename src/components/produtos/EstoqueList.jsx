// src/components/produtos/EstoqueList.jsx
import { useState } from 'react';
import { Search, Plus, AlertTriangle } from 'lucide-react';
import ProdutosStats from './ProdutosStats';
import ProdutosAlert from './ProdutosAlert';
import ProdutosTable from './ProdutosTable';
import ProdutoModal from './ProdutoModal';

const EstoqueList = ({
  produtosSalao,
  fornecedoresSalao,
  fornecedores,
  handleOpenModal,
  handleCloseModal,
  handleSubmit,
  handleDelete,
  handleChange,
  showModal,
  editingId,
  formData,
  setShowModal,
  handleOpenFornecedorModal,
  getFornecedor
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  // Calcular estatísticas
  const totalProdutos = produtosSalao.length;
  const produtosBaixoEstoque = produtosSalao.filter(p => p.estoque <= p.estoqueMinimo).length;
  const valorTotalEstoque = produtosSalao.reduce((acc, p) => acc + (p.valorCusto * p.estoque), 0);
  const margemMedia = produtosSalao.length > 0 
    ? produtosSalao.reduce((acc, p) => acc + ((p.valorVenda - p.valorCusto) / p.valorCusto * 100), 0) / produtosSalao.length
    : 0;

  // Filtrar produtos
  const categorias = ['Todos', 'Cabelo', 'Coloração', 'Unhas', 'Tratamento'];
  
  const filteredProdutos = produtosSalao.filter(produto => {
    const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Estoque</h2>
          <p className="text-gray-600 mt-1">Controle e gerencie seus produtos</p>
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
      <ProdutosStats 
        totalProdutos={totalProdutos}
        produtosBaixoEstoque={produtosBaixoEstoque}
        valorTotalEstoque={valorTotalEstoque}
        margemMedia={margemMedia}
      />

      {/* Alerta de Estoque Baixo */}
      {produtosBaixoEstoque > 0 && (
        <ProdutosAlert produtosBaixoEstoque={produtosBaixoEstoque} />
      )}

      {/* Filtros */}
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
      <ProdutosTable 
        filteredProdutos={filteredProdutos}
        getFornecedor={getFornecedor}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDelete}
      />

      {/* Modal de Produto */}
      <ProdutoModal 
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        editingId={editingId}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        fornecedoresSalao={fornecedoresSalao}
        getFornecedor={getFornecedor}
        handleOpenFornecedorModal={handleOpenFornecedorModal}
        setShowModal={setShowModal}
        fornecedores={fornecedores}
      />
    </div>
  );
};

export default EstoqueList;