// src/hooks/useCaixa.js - CORRIGIDO (adicionar clienteId nas transações)
import { useState, useCallback } from 'react';
import { getTodayBR } from '../utils/masks';

export const useCaixa = (salaoAtual, comandas, setComandas, vendas, setVendas, transacoes, setTransacoes, produtos, setProdutos) => {
  const [itensTemp, setItensTemp] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [desconto, setDesconto] = useState(0);
  const [observacoes, setObservacoes] = useState('');

  // Adicionar item temporário (sem comanda)
  const adicionarItem = useCallback((tipo, item, quantidade = 1, profissionalId = null) => {
    const itemExiste = itensTemp.find(i => 
      i.tipo === tipo && i.referenceId === item.id && i.profissionalId === profissionalId
    );

    if (itemExiste) {
      setItensTemp(itensTemp.map(i =>
        i.tipo === tipo && i.referenceId === item.id && i.profissionalId === profissionalId
          ? { ...i, quantidade: i.quantidade + quantidade, valorTotal: (i.quantidade + quantidade) * i.valorUnitario }
          : i
      ));
    } else {
      const novoItem = {
        id: Date.now(),
        tipo,
        referenceId: item.id,
        nome: item.nome,
        quantidade,
        valorUnitario: tipo === 'servico' ? item.valor : item.valorVenda,
        valorTotal: (tipo === 'servico' ? item.valor : item.valorVenda) * quantidade,
        profissionalId
      };
      setItensTemp([...itensTemp, novoItem]);
    }
  }, [itensTemp]);

  // Remover item temporário
  const removerItem = useCallback((itemId) => {
    setItensTemp(itensTemp.filter(i => i.id !== itemId));
  }, [itensTemp]);

  // Alterar quantidade
  const alterarQuantidade = useCallback((itemId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerItem(itemId);
      return;
    }

    setItensTemp(itensTemp.map(i =>
      i.id === itemId
        ? { ...i, quantidade: novaQuantidade, valorTotal: novaQuantidade * i.valorUnitario }
        : i
    ));
  }, [itensTemp, removerItem]);

  // Calcular totais
  const subtotal = itensTemp.reduce((sum, item) => sum + item.valorTotal, 0);
  const valorDesconto = (subtotal * desconto) / 100;
  const total = subtotal - valorDesconto;

  // Limpar temporários
  const limparTemp = useCallback(() => {
    setItensTemp([]);
    setClienteSelecionado(null);
    setDesconto(0);
    setObservacoes('');
  }, []);

  // Criar nova comanda
  const criarComanda = useCallback(() => {
    const novaComanda = {
      id: Math.max(...comandas.map(c => c.id), 0) + 1,
      clienteId: clienteSelecionado?.id || null,
      clienteNome: clienteSelecionado?.nome || 'Cliente avulso',
      status: 'aberta',
      dataAbertura: `${getTodayBR()} ${new Date().toLocaleTimeString('pt-BR')}`,
      dataFechamento: null,
      itens: [...itensTemp],
      descontos: desconto > 0 ? [{ tipo: 'percentual', valor: desconto, motivo: observacoes }] : [],
      observacoes,
      subtotal,
      descontoTotal: valorDesconto,
      total,
      salaoId: salaoAtual.id
    };

    setComandas([...comandas, novaComanda]);
    limparTemp();
    return novaComanda;
  }, [comandas, setComandas, clienteSelecionado, itensTemp, desconto, observacoes, subtotal, valorDesconto, total, salaoAtual, limparTemp]);

  // Adicionar itens em comanda existente
  const adicionarNaComanda = useCallback((comandaId, novosItens) => {
    setComandas(comandas.map(c => {
      if (c.id !== comandaId) return c;

      const itensAtualizados = [...c.itens];
      novosItens.forEach(novoItem => {
        const itemExiste = itensAtualizados.find(i =>
          i.tipo === novoItem.tipo && 
          i.referenceId === novoItem.referenceId && 
          i.profissionalId === novoItem.profissionalId
        );

        if (itemExiste) {
          itemExiste.quantidade += novoItem.quantidade;
          itemExiste.valorTotal = itemExiste.quantidade * itemExiste.valorUnitario;
        } else {
          itensAtualizados.push(novoItem);
        }
      });

      const novoSubtotal = itensAtualizados.reduce((sum, i) => sum + i.valorTotal, 0);
      const novoDesconto = c.descontos.reduce((sum, d) => 
        sum + (d.tipo === 'percentual' ? (novoSubtotal * d.valor) / 100 : d.valor), 0
      );

      return {
        ...c,
        itens: itensAtualizados,
        subtotal: novoSubtotal,
        descontoTotal: novoDesconto,
        total: novoSubtotal - novoDesconto
      };
    }));
  }, [comandas, setComandas]);

  // Fechar comanda e finalizar venda
  const fecharComanda = useCallback((comandaId, formaPagamento) => {
    const comanda = comandas.find(c => c.id === comandaId);
    if (!comanda) return false;

    // Atualizar estoque dos produtos
    const produtosAtualizados = [...produtos];
    comanda.itens.forEach(item => {
      if (item.tipo === 'produto') {
        const produtoIndex = produtosAtualizados.findIndex(p => p.id === item.referenceId);
        if (produtoIndex !== -1) {
          produtosAtualizados[produtoIndex].estoque -= item.quantidade;
        }
      }
    });
    setProdutos(produtosAtualizados);

    // Criar registro de venda
    const novaVenda = {
      id: Math.max(...vendas.map(v => v.id), 0) + 1,
      comandaId: comanda.id,
      clienteId: comanda.clienteId,
      clienteNome: comanda.clienteNome,
      itens: comanda.itens,
      subtotal: comanda.subtotal,
      desconto: comanda.descontoTotal,
      total: comanda.total,
      formaPagamento,
      data: getTodayBR(),
      hora: new Date().toLocaleTimeString('pt-BR'),
      salaoId: salaoAtual.id
    };
    setVendas([...vendas, novaVenda]);

    // ✅ CORREÇÃO: Criar transação financeira com clienteId
    const novaTransacao = {
      id: Math.max(...transacoes.map(t => t.id), 0) + 1,
      tipo: 'receita',
      descricao: `Venda Caixa - ${comanda.itens.length} item(ns)`,
      categoria: comanda.itens.some(i => i.tipo === 'servico') ? 'Serviços' : 'Venda de Produtos',
      valor: comanda.total,
      formaPagamento,
      data: getTodayBR(),
      clienteId: comanda.clienteId, // ✅ ADICIONADO
      cliente: comanda.clienteNome,
      clienteNome: comanda.clienteNome, // ✅ ADICIONADO para redundância
      fornecedor: '',
      status: 'recebido',
      salaoId: salaoAtual.id,
      observacoes: comanda.itens.map(i => 
        `${i.quantidade}x ${i.nome} - R$ ${i.valorTotal.toFixed(2)}`
      ).join(' | ') + (comanda.descontoTotal > 0 ? ` | Desconto: R$ ${comanda.descontoTotal.toFixed(2)}` : '')
    };
    setTransacoes([...transacoes, novaTransacao]);

    // Fechar comanda
    setComandas(comandas.map(c =>
      c.id === comandaId
        ? { ...c, status: 'fechada', dataFechamento: `${getTodayBR()} ${new Date().toLocaleTimeString('pt-BR')}` }
        : c
    ));

    return true;
  }, [comandas, setComandas, vendas, setVendas, transacoes, setTransacoes, produtos, setProdutos, salaoAtual]);

  // ✅ CORREÇÃO: Finalizar venda direta (sem comanda)
  const finalizarVendaDireta = useCallback((formaPagamento) => {
    if (itensTemp.length === 0) return false;

    // Atualizar estoque
    const produtosAtualizados = [...produtos];
    itensTemp.forEach(item => {
      if (item.tipo === 'produto') {
        const produtoIndex = produtosAtualizados.findIndex(p => p.id === item.referenceId);
        if (produtoIndex !== -1) {
          produtosAtualizados[produtoIndex].estoque -= item.quantidade;
        }
      }
    });
    setProdutos(produtosAtualizados);

    // Criar venda
    const novaVenda = {
      id: Math.max(...vendas.map(v => v.id), 0) + 1,
      comandaId: null,
      clienteId: clienteSelecionado?.id || null,
      clienteNome: clienteSelecionado?.nome || 'Cliente avulso',
      itens: itensTemp,
      subtotal,
      desconto: valorDesconto,
      total,
      formaPagamento,
      data: getTodayBR(),
      hora: new Date().toLocaleTimeString('pt-BR'),
      salaoId: salaoAtual.id
    };
    setVendas([...vendas, novaVenda]);

    // ✅ CORREÇÃO: Criar transação com clienteId
    const novaTransacao = {
      id: Math.max(...transacoes.map(t => t.id), 0) + 1,
      tipo: 'receita',
      descricao: `Venda Caixa - ${itensTemp.length} item(ns)`,
      categoria: itensTemp.some(i => i.tipo === 'servico') ? 'Serviços' : 'Venda de Produtos',
      valor: total,
      formaPagamento,
      data: getTodayBR(),
      clienteId: clienteSelecionado?.id || null, // ✅ ADICIONADO
      cliente: clienteSelecionado?.nome || '',
      clienteNome: clienteSelecionado?.nome || '', // ✅ ADICIONADO
      fornecedor: '',
      status: 'recebido',
      salaoId: salaoAtual.id,
      observacoes: itensTemp.map(i => 
        `${i.quantidade}x ${i.nome} - R$ ${i.valorTotal.toFixed(2)}`
      ).join(' | ') + (valorDesconto > 0 ? ` | Desconto: R$ ${valorDesconto.toFixed(2)}` : '')
    };
    setTransacoes([...transacoes, novaTransacao]);

    limparTemp();
    return true;
  }, [itensTemp, clienteSelecionado, subtotal, valorDesconto, total, vendas, setVendas, transacoes, setTransacoes, produtos, setProdutos, salaoAtual, limparTemp]);

  // Cancelar comanda
  const cancelarComanda = useCallback((comandaId) => {
    if (confirm('Tem certeza que deseja cancelar esta comanda? Os itens serão perdidos.')) {
      setComandas(comandas.filter(c => c.id !== comandaId));
      return true;
    }
    return false;
  }, [comandas, setComandas]);

  return {
    itensTemp,
    clienteSelecionado,
    setClienteSelecionado,
    desconto,
    setDesconto,
    observacoes,
    setObservacoes,
    subtotal,
    valorDesconto,
    total,
    adicionarItem,
    removerItem,
    alterarQuantidade,
    limparTemp,
    criarComanda,
    adicionarNaComanda,
    fecharComanda,
    finalizarVendaDireta,
    cancelarComanda
  };
};