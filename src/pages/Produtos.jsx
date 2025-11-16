// src/pages/Produtos.jsx - VERSÃO COMPLETA COM PDV
import { useState, useContext, useEffect } from 'react';
import { ShoppingCart, Package, Truck } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import { usePDV } from '../hooks/usePDV';
import PDVCheckout from '../components/produtos/PDVCheckout';
import EstoqueList from '../components/produtos/EstoqueList';
import FornecedoresList from '../components/produtos/FornecedoresList';

const Produtos = () => {
  const { 
    salaoAtual, 
    fornecedores, 
    setFornecedores, 
    produtos,
    setProdutos,
    transacoes,
    setTransacoes,
    getFornecedoresPorSalao,
    getProdutosPorSalao,
    getClientesPorSalao
  } = useContext(SalaoContext);
  
  const [viewMode, setViewMode] = useState('pdv'); // 'pdv', 'estoque', 'fornecedores'
  
  // Estados para Produtos
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    marca: '',
    estoque: '',
    estoqueMinimo: '',
    valorCusto: '',
    valorVenda: '',
    fornecedorId: '',
    codigo: '',
    salaoId: salaoAtual.id
  });

  // Estados para Fornecedores
  const [showFornecedorModal, setShowFornecedorModal] = useState(false);
  const [editingFornecedorId, setEditingFornecedorId] = useState(null);
  const [fornecedorData, setFornecedorData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cnpj: '',
    endereco: '',
    salaoId: salaoAtual.id
  });

  // Obter dados filtrados
  const produtosSalao = getProdutosPorSalao();
  const fornecedoresSalao = getFornecedoresPorSalao();
  const clientesSalao = getClientesPorSalao();

  // Hook do PDV
  const {
    carrinho,
    clienteSelecionado,
    setClienteSelecionado,
    showPagamentoModal,
    setShowPagamentoModal,
    desconto,
    setDesconto,
    adicionarAoCarrinho,
    removerDoCarrinho,
    alterarQuantidade,
    subtotal,
    valorDesconto,
    total,
    lucroTotal,
    finalizarVenda,
    limparCarrinho
  } = usePDV(salaoAtual, produtos, setProdutos, transacoes, setTransacoes, clientesSalao);

  // Atualizar salaoId quando mudar
  useEffect(() => {
    setFormData(prev => ({ ...prev, salaoId: salaoAtual.id }));
    setFornecedorData(prev => ({ ...prev, salaoId: salaoAtual.id }));
  }, [salaoAtual.id]);

  // ===== HANDLERS DE PRODUTOS =====
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
        codigo: produto.codigo,
        salaoId: produto.salaoId
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
        codigo: '',
        salaoId: salaoAtual.id
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

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ===== HANDLERS DE FORNECEDORES =====
  const handleOpenFornecedorModal = (fornecedor = null) => {
    if (fornecedor) {
      setEditingFornecedorId(fornecedor.id);
      setFornecedorData({
        nome: fornecedor.nome,
        telefone: fornecedor.telefone,
        email: fornecedor.email,
        cnpj: fornecedor.cnpj || '',
        endereco: fornecedor.endereco || '',
        salaoId: fornecedor.salaoId
      });
    } else {
      setEditingFornecedorId(null);
      setFornecedorData({
        nome: '',
        telefone: '',
        email: '',
        cnpj: '',
        endereco: '',
        salaoId: salaoAtual.id
      });
    }
    setShowFornecedorModal(true);
  };

  const handleCloseFornecedorModal = () => {
    setShowFornecedorModal(false);
    setEditingFornecedorId(null);
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

  const handleDeleteFornecedor = (id) => {
    const produtosComFornecedor = produtosSalao.filter(p => p.fornecedorId === id);
    if (produtosComFornecedor.length > 0) {
      alert(`Não é possível excluir. Existem ${produtosComFornecedor.length} produto(s) vinculados a este fornecedor.`);
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      setFornecedores(fornecedores.filter(f => f.id !== id));
    }
  };

  const handleFornecedorChange = (e) => {
    const { name, value } = e.target;
    setFornecedorData(prev => ({ ...prev, [name]: value }));
  };

  const getFornecedor = (fornecedorId) => {
    return fornecedores.find(f => f.id === fornecedorId);
  };

  // Configuração das tabs
  const tabs = [
    { id: 'pdv', label: 'PDV - Ponto de Venda', icon: ShoppingCart, color: 'green' },
    { id: 'estoque', label: 'Estoque', icon: Package, color: 'purple' },
    { id: 'fornecedores', label: 'Fornecedores', icon: Truck, color: 'blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Produtos & Vendas</h1>
        <p className="text-gray-600 mt-1">Gerencie produtos, fornecedores e realize vendas - {salaoAtual.nome}</p>
      </div>

      {/* Tabs de Navegação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <div className="flex space-x-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            
            const colorClasses = {
              green: isActive ? 'bg-green-600 text-white' : 'text-green-600 hover:bg-green-50',
              purple: isActive ? 'bg-purple-600 text-white' : 'text-purple-600 hover:bg-purple-50',
              blue: isActive ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'
            };
            
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${colorClasses[tab.color]}`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contador de itens no carrinho (apenas no PDV) */}
      {viewMode === 'pdv' && carrinho.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-green-900">
                  {carrinho.length} {carrinho.length === 1 ? 'item' : 'itens'} no carrinho
                </p>
                <p className="text-sm text-green-700">
                  Total: R$ {total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo das Tabs */}
      {viewMode === 'pdv' && (
        <PDVCheckout
          produtosSalao={produtosSalao}
          clientesSalao={clientesSalao}
          carrinho={carrinho}
          clienteSelecionado={clienteSelecionado}
          setClienteSelecionado={setClienteSelecionado}
          desconto={desconto}
          setDesconto={setDesconto}
          subtotal={subtotal}
          valorDesconto={valorDesconto}
          total={total}
          lucroTotal={lucroTotal}
          adicionarAoCarrinho={adicionarAoCarrinho}
          alterarQuantidade={alterarQuantidade}
          removerDoCarrinho={removerDoCarrinho}
          limparCarrinho={limparCarrinho}
          showPagamentoModal={showPagamentoModal}
          setShowPagamentoModal={setShowPagamentoModal}
          finalizarVenda={finalizarVenda}
        />
      )}

      {viewMode === 'estoque' && (
        <EstoqueList
          produtosSalao={produtosSalao}
          fornecedoresSalao={fornecedoresSalao}
          fornecedores={fornecedores}
          handleOpenModal={handleOpenModal}
          handleCloseModal={handleCloseModal}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          handleChange={handleChange}
          showModal={showModal}
          editingId={editingId}
          formData={formData}
          setShowModal={setShowModal}
          handleOpenFornecedorModal={handleOpenFornecedorModal}
          getFornecedor={getFornecedor}
        />
      )}

      {viewMode === 'fornecedores' && (
        <FornecedoresList
          fornecedoresSalao={fornecedoresSalao}
          produtosSalao={produtosSalao}
          showFornecedorModal={showFornecedorModal}
          handleCloseFornecedorModal={handleCloseFornecedorModal}
          editingFornecedorId={editingFornecedorId}
          fornecedorData={fornecedorData}
          handleFornecedorChange={handleFornecedorChange}
          handleSubmitFornecedor={handleSubmitFornecedor}
          handleOpenFornecedorModal={handleOpenFornecedorModal}
          handleDeleteFornecedor={handleDeleteFornecedor}
        />
      )}
    </div>
  );
};

export default Produtos;