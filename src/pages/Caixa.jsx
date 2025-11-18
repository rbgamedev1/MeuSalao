// src/pages/Caixa.jsx
import { useState, useContext } from 'react';
import { SalaoContext } from '../contexts/SalaoContext';
import { useCaixa } from '../hooks/useCaixa';
import CaixaHeader from '../components/caixa/CaixaHeader';
import CaixaAtendimentoRapido from '../components/caixa/CaixaAtendimentoRapido';
import CaixaComandas from '../components/caixa/CaixaComandas';
import CaixaHistorico from '../components/caixa/CaixaHistorico';
import PagamentoFinalModal from '../components/caixa/PagamentoFinalModal';

const Caixa = () => {
  const {
    salaoAtual,
    comandas,
    setComandas,
    vendas,
    setVendas,
    transacoes,
    setTransacoes,
    produtos,
    setProdutos,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getProdutosPorSalao,
    getComandasPorSalao,
    getVendasPorSalao
  } = useContext(SalaoContext);

  const [abaAtiva, setAbaAtiva] = useState('rapido');
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);
  const [comandaParaFechar, setComandaParaFechar] = useState(null);

  const clientesSalao = getClientesPorSalao();
  const profissionaisSalao = getProfissionaisPorSalao();
  const servicosSalao = getServicosPorSalao();
  const produtosSalao = getProdutosPorSalao();
  const comandasSalao = getComandasPorSalao();
  const vendasSalao = getVendasPorSalao();

  const {
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
  } = useCaixa(salaoAtual, comandas, setComandas, vendas, setVendas, transacoes, setTransacoes, produtos, setProdutos);

  // Handlers Atendimento Rápido
  const handleFinalizarRapido = () => {
    if (itensTemp.length === 0) {
      alert('Adicione itens antes de finalizar!');
      return;
    }
    setShowPagamentoModal(true);
  };

  const handleConfirmarPagamentoRapido = (formaPagamento) => {
    const sucesso = finalizarVendaDireta(formaPagamento);
    if (sucesso) {
      setShowPagamentoModal(false);
      alert('✅ Venda finalizada com sucesso!');
    } else {
      alert('❌ Erro ao finalizar venda. Tente novamente.');
    }
  };

  // Handlers Comandas
  const handleCriarComanda = (cliente, nomeCliente) => {
    // Criar comanda vazia
    const novaComanda = {
      id: Math.max(...comandas.map(c => c.id), 0) + 1,
      clienteId: cliente?.id || null,
      clienteNome: nomeCliente,
      status: 'aberta',
      dataAbertura: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
      dataFechamento: null,
      itens: [],
      descontos: [],
      observacoes: '',
      subtotal: 0,
      descontoTotal: 0,
      total: 0,
      salaoId: salaoAtual.id
    };
    setComandas([...comandas, novaComanda]);
    alert(`✅ Comanda #${novaComanda.id} criada para ${nomeCliente}!`);
  };

  const handleFecharComanda = (comandaId) => {
    const comanda = comandasSalao.find(c => c.id === comandaId);
    if (!comanda) return;

    if (comanda.itens.length === 0) {
      alert('❌ Adicione itens antes de fechar a comanda!');
      return;
    }

    setComandaParaFechar(comanda);
    setShowPagamentoModal(true);
  };

  const handleConfirmarPagamentoComanda = (formaPagamento) => {
    if (!comandaParaFechar) return;

    const sucesso = fecharComanda(comandaParaFechar.id, formaPagamento);
    if (sucesso) {
      setShowPagamentoModal(false);
      setComandaParaFechar(null);
      alert('✅ Comanda fechada com sucesso!');
    } else {
      alert('❌ Erro ao fechar comanda. Tente novamente.');
    }
  };

  const handleAdicionarNaComanda = (comandaId, novosItens) => {
    adicionarNaComanda(comandaId, novosItens);
  };

  const handleRemoverItemComanda = (comandaId, itemId) => {
    setComandas(comandas.map(c => {
      if (c.id !== comandaId) return c;

      const itensAtualizados = c.itens.filter(i => i.id !== itemId);
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
  };

  const handleAlterarQuantidadeComanda = (comandaId, itemId, novaQuantidade) => {
    setComandas(comandas.map(c => {
      if (c.id !== comandaId) return c;

      const itensAtualizados = c.itens.map(i =>
        i.id === itemId
          ? { ...i, quantidade: novaQuantidade, valorTotal: novaQuantidade * i.valorUnitario }
          : i
      );

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
  };

  return (
    <div className="space-y-6">
      {/* Header com Abas */}
      <CaixaHeader
        salaoNome={salaoAtual.nome}
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
      />

      {/* Conteúdo das Abas */}
      {abaAtiva === 'rapido' && (
        <CaixaAtendimentoRapido
          itensTemp={itensTemp}
          clienteSelecionado={clienteSelecionado}
          setClienteSelecionado={setClienteSelecionado}
          clientes={clientesSalao}
          desconto={desconto}
          setDesconto={setDesconto}
          observacoes={observacoes}
          setObservacoes={setObservacoes}
          subtotal={subtotal}
          valorDesconto={valorDesconto}
          total={total}
          servicos={servicosSalao}
          produtos={produtosSalao}
          profissionais={profissionaisSalao}
          onAdicionarItem={adicionarItem}
          onRemoverItem={removerItem}
          onAlterarQuantidade={alterarQuantidade}
          onLimpar={limparTemp}
          onFinalizar={handleFinalizarRapido}
        />
      )}

      {abaAtiva === 'comandas' && (
        <CaixaComandas
          comandas={comandasSalao}
          clientes={clientesSalao}
          servicos={servicosSalao}
          produtos={produtosSalao}
          profissionais={profissionaisSalao}
          onCriarComanda={handleCriarComanda}
          onAdicionarItem={handleAdicionarNaComanda}
          onRemoverItem={handleRemoverItemComanda}
          onAlterarQuantidade={handleAlterarQuantidadeComanda}
          onFecharComanda={handleFecharComanda}
          onCancelarComanda={cancelarComanda}
        />
      )}

      {abaAtiva === 'historico' && (
        <CaixaHistorico vendas={vendasSalao} />
      )}

      {/* Modal de Pagamento */}
      <PagamentoFinalModal
        isOpen={showPagamentoModal}
        onClose={() => {
          setShowPagamentoModal(false);
          setComandaParaFechar(null);
        }}
        onConfirm={comandaParaFechar ? handleConfirmarPagamentoComanda : handleConfirmarPagamentoRapido}
        total={comandaParaFechar ? comandaParaFechar.total : total}
        tipo={comandaParaFechar ? 'comanda' : 'venda'}
      />
    </div>
  );
};

export default Caixa;