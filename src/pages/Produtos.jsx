// src/pages/Produtos.jsx - CÓDIGO COMPLETO COM RESTRIÇÕES
import { useState, useContext, useEffect } from 'react';
import { SalaoContext } from '../contexts/SalaoContext';
import ProdutosHeader from '../components/produtos/ProdutosHeader';
import ProdutosStats from '../components/produtos/ProdutosStats';
import ProdutosAlert from '../components/produtos/ProdutosAlert';
import ProdutosFilters from '../components/produtos/ProdutosFilters';
import ProdutosTable from '../components/produtos/ProdutosTable';
import ProdutoModal from '../components/produtos/ProdutoModal';
import FornecedorModal from '../components/produtos/FornecedorModal';
import { canAddMore, getLimitMessage } from '../utils/planRestrictions';
import { Crown, Lock } from 'lucide-react';

const Produtos = () => {
  const { 
    salaoAtual, 
    fornecedores, 
    setFornecedores, 
    produtos,
    setProdutos,
    getFornecedoresPorSalao,
    getProdutosPorSalao 
  } = useContext(SalaoContext);
  
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
    codigo: '',
    salaoId: salaoAtual.id
  });

  const [fornecedorData, setFornecedorData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cnpj: '',
    endereco: '',
    salaoId: salaoAtual.id
  });

  const categorias = ['Todos', 'Cabelo', 'Coloração', 'Unhas', 'Tratamento'];
  const produtosSalao = getProdutosPorSalao();
  const fornecedoresSalao = getFornecedoresPorSalao();

  // Verificar limites
  const canAddProduto = canAddMore(salaoAtual.plano, 'produtos', produtosSalao.length);
  const limiteProdutos = getLimitMessage(salaoAtual.plano, 'produtos');
  const canAddFornecedor = canAddMore(salaoAtual.plano, 'fornecedores', fornecedoresSalao.length);
  const limiteFornecedores = getLimitMessage(salaoAtual.plano, 'fornecedores');

  useEffect(() => {
    setFormData(prev => ({ ...prev, salaoId: salaoAtual.id }));
    setFornecedorData(prev => ({ ...prev, salaoId: salaoAtual.id }));
  }, [salaoAtual.id]);

  const handleOpenModal = (produto = null) => {
    // Verificar limite ao adicionar
    if (!produto && !canAddProduto) {
      alert(`Limite de produtos atingido para o plano ${salaoAtual.plano}. ${limiteProdutos}\n\nFaça upgrade do seu plano para adicionar mais produtos.`);
      return;
    }

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

  const handleOpenFornecedorModal = (fornecedor = null) => {
    // Verificar limite ao adicionar
    if (!fornecedor && !canAddFornecedor) {
      alert(`Limite de fornecedores atingido para o plano ${salaoAtual.plano}. ${limiteFornecedores}\n\nFaça upgrade do seu plano para adicionar mais fornecedores.`);
      return;
    }

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
    const produtosComFornecedor = produtosSalao.filter(p => p.fornecedorId === id);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFornecedorChange = (e) => {
    const { name, value } = e.target;
    setFornecedorData(prev => ({ ...prev, [name]: value }));
  };

  const filteredProdutos = produtosSalao.filter(produto => {
    const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       produto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const getFornecedor = (fornecedorId) => {
    return fornecedores.find(f => f.id === fornecedorId);
  };

  const totalProdutos = produtosSalao.length;
  const produtosBaixoEstoque = produtosSalao.filter(p => p.estoque <= p.estoqueMinimo).length;
  const valorTotalEstoque = produtosSalao.reduce((acc, p) => acc + (p.valorCusto * p.estoque), 0);
  const margemMedia = produtosSalao.length > 0 
    ? produtosSalao.reduce((acc, p) => acc + ((p.valorVenda - p.valorCusto) / p.valorCusto * 100), 0) / produtosSalao.length
    : 0;

  return (
    <div className="space-y-6">
      <ProdutosHeader 
        salaoNome={salaoAtual.nome}
        onOpenFornecedorModal={() => handleOpenFornecedorModal()}
        onOpenProdutoModal={() => handleOpenModal()}
      />

      {/* Alertas de Limite */}
      {!canAddProduto && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <Crown className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Limite de produtos atingido!</p>
              <p className="text-yellow-700 text-sm mt-1">
                Seu plano <strong>{salaoAtual.plano}</strong> permite até <strong>{limiteProdutos.replace('Máximo: ', '')}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info do Plano */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-blue-900">
              Produtos: {produtosSalao.length} {limiteProdutos !== 'Ilimitado' ? `/ ${limiteProdutos.replace('Máximo: ', '')}` : '(Ilimitado)'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Fornecedores: {fornecedoresSalao.length} {limiteFornecedores !== 'Ilimitado' ? `/ ${limiteFornecedores.replace('Máximo: ', '')}` : '(Ilimitado)'}
            </p>
          </div>
        </div>
      </div>

      <ProdutosStats 
        totalProdutos={totalProdutos}
        produtosBaixoEstoque={produtosBaixoEstoque}
        valorTotalEstoque={valorTotalEstoque}
        margemMedia={margemMedia}
      />

      {produtosBaixoEstoque > 0 && (
        <ProdutosAlert produtosBaixoEstoque={produtosBaixoEstoque} />
      )}

      <ProdutosFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoriaFiltro={categoriaFiltro}
        setCategoriaFiltro={setCategoriaFiltro}
        categorias={categorias}
      />

      <ProdutosTable 
        filteredProdutos={filteredProdutos}
        getFornecedor={getFornecedor}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDelete}
      />

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

      <FornecedorModal 
        showFornecedorModal={showFornecedorModal}
        handleCloseFornecedorModal={handleCloseFornecedorModal}
        editingFornecedorId={editingFornecedorId}
        fornecedorData={fornecedorData}
        handleFornecedorChange={handleFornecedorChange}
        handleSubmitFornecedor={handleSubmitFornecedor}
        fornecedoresSalao={fornecedoresSalao}
        handleOpenFornecedorModal={handleOpenFornecedorModal}
        handleDeleteFornecedor={handleDeleteFornecedor}
        produtosSalao={produtosSalao}
      />
    </div>
  );
};

export default Produtos;