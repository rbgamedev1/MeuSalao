// src/pages/Financeiro.jsx - CORRIGIDO FINAL
import { useState, useContext } from 'react';
import { Crown } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import { hasAccess } from '../utils/planRestrictions';
import { getTodayBR } from '../utils/masks';

// Hooks personalizados
import { useFinanceiroData } from '../hooks/useFinanceiroData';
import { useFinanceiroFilters } from '../hooks/useFinanceiroFilters';
import { useTransacaoForm } from '../hooks/useTransacaoForm';

// Componentes
import PlanRestriction from '../components/PlanRestriction';
import FinanceiroHeader from '../components/financeiro/FinanceiroHeader';
import FinanceiroStats from '../components/financeiro/FinanceiroStats';
import FinanceiroDetails from '../components/financeiro/FinanceiroDetails';
import TransacaoModal from '../components/financeiro/TransacaoModal';

const Financeiro = () => {
  const { 
    salaoAtual, 
    transacoes,
    setTransacoes,
    getClientesPorSalao, 
    getFornecedoresPorSalao,
    getTransacoesPorSalao
  } = useContext(SalaoContext);
  
  // Estados principais
  const [periodo, setPeriodo] = useState('mes');
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Verificar acesso ao módulo financeiro
  const temAcessoFinanceiro = hasAccess(salaoAtual.plano, 'financeiro');
  
  if (!temAcessoFinanceiro) {
    return <PlanRestriction feature="financeiro" minPlan="plus" />;
  }
  
  // Obter dados filtrados por salão
  const clientesSalao = getClientesPorSalao();
  const fornecedoresSalao = getFornecedoresPorSalao();
  const transacoesSalao = getTransacoesPorSalao();
  
  // Hook de dados financeiros
  const {
    transacoesFiltradas,
    totalReceitas,
    totalDespesas,
    saldo,
    ticketMedio
  } = useFinanceiroData(transacoesSalao, periodo);
  
  // Hook de filtros
  const {
    filteredTransacoes
  } = useFinanceiroFilters(transacoesFiltradas);
  
  // Hook do formulário de transação
  const {
    showModal,
    editingId,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleChange
  } = useTransacaoForm(salaoAtual, transacoes, setTransacoes);

  // Handlers para os cards
  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
  };

  const handleCloseDetails = () => {
    setSelectedCard(null);
  };

  // Handler para adicionar receita - define TUDO antes de abrir modal
  const handleAddReceita = () => {
    setFormData({
      tipo: 'receita',
      descricao: '',
      categoria: '',
      valor: '',
      formaPagamento: '',
      data: getTodayBR(),
      cliente: '',
      fornecedor: '',
      status: 'pago',
      salaoId: salaoAtual?.id || '',
      observacoes: ''
    });
    handleOpenModal(); // Abre o modal sem parâmetro (nova transação)
  };

  // Handler para adicionar despesa - define TUDO antes de abrir modal
  const handleAddDespesa = () => {
    setFormData({
      tipo: 'despesa',
      descricao: '',
      categoria: '',
      valor: '',
      formaPagamento: '',
      data: getTodayBR(),
      cliente: '',
      fornecedor: '',
      status: 'pago',
      salaoId: salaoAtual?.id || '',
      observacoes: ''
    });
    handleOpenModal(); // Abre o modal sem parâmetro (nova transação)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FinanceiroHeader
        salaoNome={salaoAtual.nome}
        periodo={periodo}
        setPeriodo={setPeriodo}
      />

      {/* Info do Plano */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Plano {salaoAtual.plano} - Módulo Financeiro Ativo
              </p>
              <p className="text-xs text-blue-700 mt-1">
                💡 Clique no botão <strong>+</strong> verde para adicionar <strong>Entradas</strong> ou no botão <strong>+</strong> vermelho para adicionar <strong>Saídas</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Resumo (Clicáveis) */}
      <FinanceiroStats 
        totalReceitas={totalReceitas}
        totalDespesas={totalDespesas}
        saldo={saldo}
        ticketMedio={ticketMedio}
        transacoesSalao={transacoesFiltradas}
        onCardClick={handleCardClick}
        onAddReceita={handleAddReceita}
        onAddDespesa={handleAddDespesa}
      />

      {/* Área de Conteúdo Dinâmico */}
      {selectedCard && (
        <FinanceiroDetails
          cardType={selectedCard}
          onClose={handleCloseDetails}
          filteredTransacoes={filteredTransacoes}
          handleOpenModal={handleOpenModal}
          handleDelete={handleDelete}
          totalReceitas={totalReceitas}
          totalDespesas={totalDespesas}
          saldo={saldo}
          ticketMedio={ticketMedio}
        />
      )}

      {/* Modais */}
      <TransacaoModal
        showModal={showModal}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        clientesSalao={clientesSalao}
        fornecedoresSalao={fornecedoresSalao}
      />
    </div>
  );
};

export default Financeiro;