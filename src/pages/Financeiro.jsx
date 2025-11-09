// src/pages/Financeiro.jsx - VERSÃO FINAL SIMPLIFICADA
import { useState, useContext, useEffect } from 'react';
import { Crown, Calendar } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import { hasAccess } from '../utils/planRestrictions';

// Hooks personalizados
import { useFinanceiroData } from '../hooks/useFinanceiroData';
import { useFinanceiroFilters } from '../hooks/useFinanceiroFilters';
import { useTransacaoForm } from '../hooks/useTransacaoForm';
import { useDespesasFixas } from '../hooks/useDespesasFixas';

// Componentes
import PlanRestriction from '../components/PlanRestriction';
import FinanceiroHeader from '../components/financeiro/FinanceiroHeader';
import FinanceiroStats from '../components/financeiro/FinanceiroStats';
import FinanceiroDetails from '../components/financeiro/FinanceiroDetails';
import TransacaoModal from '../components/financeiro/TransacaoModal';
import DespesasFixasList from '../components/financeiro/DespesasFixasList';
import DespesasFixasModal from '../components/financeiro/DespesasFixasModal';
import ContasPagarReceber from '../components/financeiro/ContasPagarReceber';

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
  const [showDespesasFixas, setShowDespesasFixas] = useState(false);
  
  // Estado para despesas fixas (localStorage)
  const [despesasFixas, setDespesasFixas] = useState(() => {
    try {
      const saved = localStorage.getItem('despesasFixas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Salvar despesas fixas no localStorage
  useEffect(() => {
    localStorage.setItem('despesasFixas', JSON.stringify(despesasFixas));
  }, [despesasFixas]);
  
  // Verificar acesso ao módulo financeiro
  const temAcessoFinanceiro = hasAccess(salaoAtual.plano, 'financeiro');
  
  if (!temAcessoFinanceiro) {
    return <PlanRestriction feature="financeiro" minPlan="plus" />;
  }
  
  // Obter dados filtrados por salão
  const clientesSalao = getClientesPorSalao();
  const fornecedoresSalao = getFornecedoresPorSalao();
  const transacoesSalao = getTransacoesPorSalao();
  const despesasFixasSalao = despesasFixas.filter(d => d.salaoId === salaoAtual.id);
  
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

  // Hook de despesas fixas
  const {
    showModal: showModalFixas,
    editingId: editingIdFixas,
    formData: formDataFixas,
    setFormData: setFormDataFixas,
    handleOpenModal: handleOpenModalFixas,
    handleCloseModal: handleCloseModalFixas,
    handleSubmit: handleSubmitFixas,
    handleDelete: handleDeleteFixas,
    handleChange: handleChangeFixas,
    toggleAtiva,
    tiposDespesasFixas
  } = useDespesasFixas(salaoAtual, despesasFixas, setDespesasFixas, transacoes, setTransacoes);

  // Handlers para os cards
  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
    setShowDespesasFixas(false);
  };

  const handleCloseDetails = () => {
    setSelectedCard(null);
  };

  const handleAddReceita = () => {
    setFormData(prev => ({ ...prev, tipo: 'receita' }));
    handleOpenModal();
  };

  const handleAddDespesa = () => {
    setFormData(prev => ({ ...prev, tipo: 'despesa' }));
    handleOpenModal();
  };

  const handleToggleDespesasFixas = () => {
    setShowDespesasFixas(!showDespesasFixas);
    setSelectedCard(null);
  };

  // Contar contas pendentes
  const contasPendentes = transacoesFiltradas.filter(t => 
    t.status === 'pendente' && (t.dataVencimento || t.ehDespesaFixa)
  );

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
                Clique nos cards para ver detalhes • Use o botão + para adicionar transações
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

      {/* Atalhos Rápidos */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleToggleDespesasFixas}
          className={`p-4 rounded-lg border-2 transition-all ${
            showDespesasFixas
              ? 'bg-purple-50 border-purple-300 shadow-md'
              : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Despesas Fixas Mensais</p>
                <p className="text-sm text-gray-600">
                  {despesasFixasSalao.filter(d => d.ativa).length} ativa(s)
                </p>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleCardClick('contas')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedCard === 'contas'
              ? 'bg-yellow-50 border-yellow-300 shadow-md'
              : 'bg-white border-gray-200 hover:border-yellow-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="text-yellow-600" size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Contas a Pagar/Receber</p>
                <p className="text-sm text-gray-600">
                  {contasPendentes.length} pendente(s)
                </p>
              </div>
            </div>
            {contasPendentes.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {contasPendentes.length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Área de Conteúdo Dinâmico */}
      {showDespesasFixas ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Despesas Fixas Mensais</h2>
            <button 
              onClick={() => handleOpenModalFixas()}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <span className="text-xl">+</span>
              <span>Nova Despesa Fixa</span>
            </button>
          </div>

          <DespesasFixasList
            despesasFixas={despesasFixasSalao}
            handleOpenModal={handleOpenModalFixas}
            handleDelete={handleDeleteFixas}
            toggleAtiva={toggleAtiva}
          />
        </div>
      ) : selectedCard === 'contas' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Contas a Pagar e Receber</h2>
            <button
              onClick={handleCloseDetails}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
          <ContasPagarReceber
            transacoes={filteredTransacoes}
            handleOpenModal={handleOpenModal}
            setTransacoes={setTransacoes}
            allTransacoes={transacoes}
          />
        </div>
      ) : selectedCard ? (
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
      ) : null}

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

      <DespesasFixasModal
        showModal={showModalFixas}
        editingId={editingIdFixas}
        formData={formDataFixas}
        setFormData={setFormDataFixas}
        handleCloseModal={handleCloseModalFixas}
        handleSubmit={handleSubmitFixas}
        handleChange={handleChangeFixas}
        tiposDespesasFixas={tiposDespesasFixas}
        fornecedoresSalao={fornecedoresSalao}
      />
    </div>
  );
};

export default Financeiro;