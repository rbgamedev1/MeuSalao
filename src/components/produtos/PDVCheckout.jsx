// src/components/produtos/PDVCheckout.jsx
import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import PDVProdutoCard from './PDVProdutoCard';
import PDVCarrinho from './PDVCarrinho';
import PDVPagamentoModal from './PDVPagamentoModal';

const PDVCheckout = ({ 
  produtosSalao,
  clientesSalao,
  carrinho,
  clienteSelecionado,
  setClienteSelecionado,
  desconto,
  setDesconto,
  subtotal,
  valorDesconto,
  total,
  lucroTotal,
  adicionarAoCarrinho,
  alterarQuantidade,
  removerDoCarrinho,
  limparCarrinho,
  showPagamentoModal,
  setShowPagamentoModal,
  finalizarVenda
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  // Filtrar produtos
  const produtosFiltrados = produtosSalao.filter(produto => {
    const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  // Obter categorias únicas
  const categorias = ['Todos', ...new Set(produtosSalao.map(p => p.categoria))];

  const handleFinalizarClick = () => {
    if (carrinho.length === 0) {
      alert('Carrinho vazio!');
      return;
    }
    setShowPagamentoModal(true);
  };

  const handleConfirmarVenda = (formaPagamento) => {
    finalizarVenda(formaPagamento);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna Esquerda - Produtos */}
      <div className="lg:col-span-2 space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar produtos..."
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

        {/* Lista de Produtos */}
        {produtosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? 'Tente outro termo de busca' : 'Cadastre produtos para começar a vender'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produtosFiltrados.map(produto => (
              <PDVProdutoCard
                key={produto.id}
                produto={produto}
                onAddToCart={adicionarAoCarrinho}
              />
            ))}
          </div>
        )}
      </div>

      {/* Coluna Direita - Carrinho */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <PDVCarrinho
            carrinho={carrinho}
            clienteSelecionado={clienteSelecionado}
            setClienteSelecionado={setClienteSelecionado}
            clientesSalao={clientesSalao}
            desconto={desconto}
            setDesconto={setDesconto}
            subtotal={subtotal}
            valorDesconto={valorDesconto}
            total={total}
            lucroTotal={lucroTotal}
            alterarQuantidade={alterarQuantidade}
            removerDoCarrinho={removerDoCarrinho}
            limparCarrinho={limparCarrinho}
            onFinalizarVenda={handleFinalizarClick}
          />
        </div>
      </div>

      {/* Modal de Pagamento */}
      <PDVPagamentoModal
        isOpen={showPagamentoModal}
        onClose={() => setShowPagamentoModal(false)}
        onConfirm={handleConfirmarVenda}
        total={total}
      />
    </div>
  );
};

export default PDVCheckout;