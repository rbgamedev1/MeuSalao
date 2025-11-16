// src/hooks/usePDV.js - CORRIGIDO
import { useState } from 'react';
import { getTodayBR } from '../utils/masks';

export const usePDV = (salaoAtual, produtos, setProdutos, transacoes, setTransacoes, clientesSalao) => {
  const [carrinho, setCarrinho] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);
  const [desconto, setDesconto] = useState(0);

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
      // Verificar se tem estoque
      if (itemExistente.quantidade >= produto.estoque) {
        alert(`Estoque insuficiente! Disponível: ${produto.estoque}`);
        return;
      }
      
      // Incrementar quantidade
      setCarrinho(carrinho.map(item =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      // Verificar se tem estoque
      if (produto.estoque <= 0) {
        alert('Produto sem estoque!');
        return;
      }
      
      // Adicionar novo item
      setCarrinho([...carrinho, {
        id: produto.id,
        nome: produto.nome,
        marca: produto.marca,
        valorVenda: produto.valorVenda,
        valorCusto: produto.valorCusto,
        quantidade: 1,
        estoqueDisponivel: produto.estoque
      }]);
    }
  };

  // Remover produto do carrinho
  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.id !== produtoId));
  };

  // Alterar quantidade no carrinho
  const alterarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }

    const item = carrinho.find(i => i.id === produtoId);
    if (novaQuantidade > item.estoqueDisponivel) {
      alert(`Estoque insuficiente! Disponível: ${item.estoqueDisponivel}`);
      return;
    }

    setCarrinho(carrinho.map(item =>
      item.id === produtoId
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));
  };

  // Calcular totais
  const subtotal = carrinho.reduce((total, item) => 
    total + (item.valorVenda * item.quantidade), 0
  );

  const valorDesconto = (subtotal * desconto) / 100;
  const total = subtotal - valorDesconto;

  const lucroTotal = carrinho.reduce((lucro, item) => 
    lucro + ((item.valorVenda - item.valorCusto) * item.quantidade), 0
  ) - valorDesconto;

  // Finalizar venda
  const finalizarVenda = (formaPagamento) => {
    if (carrinho.length === 0) {
      alert('Carrinho vazio!');
      return false;
    }

    try {
      // 1. Deduzir do estoque
      const produtosAtualizados = produtos.map(produto => {
        const itemCarrinho = carrinho.find(item => item.id === produto.id);
        if (itemCarrinho) {
          return {
            ...produto,
            estoque: produto.estoque - itemCarrinho.quantidade
          };
        }
        return produto;
      });
      setProdutos(produtosAtualizados);

      // ✅ CORREÇÃO: Buscar o nome completo do cliente selecionado
      const clienteObj = clientesSalao.find(c => c.nome === clienteSelecionado);
      const nomeClienteFinal = clienteObj ? clienteObj.nome : '';

      // 2. Registrar no financeiro
      const novaTransacao = {
        id: Math.max(...transacoes.map(t => t.id), 0) + 1,
        tipo: 'receita',
        descricao: `Venda PDV - ${carrinho.length} produto(s)`,
        categoria: 'Venda de Produtos', // ✅ Mantém consistente
        valor: total,
        formaPagamento: formaPagamento,
        data: getTodayBR(),
        cliente: nomeClienteFinal, // ✅ CORREÇÃO: Salva nome do cliente ou string vazia
        fornecedor: '',
        status: 'recebido',
        salaoId: salaoAtual.id,
        observacoes: carrinho.map(item => 
          `${item.quantidade}x ${item.nome} - R$ ${(item.valorVenda * item.quantidade).toFixed(2)}`
        ).join(' | ') + (desconto > 0 ? ` | Desconto: ${desconto}%` : '')
      };
      setTransacoes([...transacoes, novaTransacao]);

      // 3. Limpar carrinho
      setCarrinho([]);
      setClienteSelecionado('');
      setDesconto(0);
      setShowPagamentoModal(false);

      alert('Venda finalizada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda. Tente novamente.');
      return false;
    }
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    if (carrinho.length > 0) {
      if (confirm('Deseja realmente limpar o carrinho?')) {
        setCarrinho([]);
        setClienteSelecionado('');
        setDesconto(0);
      }
    }
  };

  return {
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
  };
};