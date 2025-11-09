// src/pages/Financeiro.jsx - COMPLETO ATUALIZADO
import { useState, useContext, useEffect } from 'react';
import { Crown, Plus } from 'lucide-react';
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
import FinanceiroCharts from '../components/financeiro/FinanceiroCharts';
import PeriodoIndicator from '../components/financeiro/PeriodoIndicator';
import ViewModeTabs from '../components/financeiro/ViewModeTabs';
import FinanceiroFilters from '../components/financeiro/FinanceiroFilters';
import FinanceiroTable from '../components/financeiro/FinanceiroTable';
import ContasPagarReceber from '../components/financeiro/ContasPagarReceber';
import TransacaoModal from '../components/financeiro/TransacaoModal';
import DespesasFixasList from '../components/financeiro/DespesasFixasList';
import DespesasFixasModal from '../components/financeiro/DespesasFixasModal';

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
  const [viewMode, setViewMode] = useState('transacoes');
  
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
  
  // Hook de dados financeiros (agora recebe despesas fixas)
  const {
    transacoesFiltradas,
    totalReceitas,
    totalDespesas,
    saldo,
    ticketMedio,
    fluxoCaixaData,
    categoriasDespesas
  } = useFinanceiroData(transacoesSalao, despesasFixasSalao, periodo);
  
  // Hook de filtros
  const {
    tipoTransacao,
    setTipoTransacao,
    showFilters,
    setShowFilters,
    filtros,
    setFiltros,
    filteredTransacoes,
    limparFiltros
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
    tiposDespesasFixas,
    gerarTransacoesMesAtual
  } = useDespesasFixas(salaoAtual, despesasFixas, setDespesasFixas);

  // Gerar transações das despesas fixas do mês atual e adicionar às transações
  useEffect(() => {
    const transacoesDespesasFixas = gerarTransacoesMesAtual();
    
    // Verificar quais despesas fixas ainda não foram adicionadas este mês
    const idsExistentes = transacoes
      .filter(t => t.ehDespesaFixa)
      .map(t => t.id);
    
    const novasTransacoes = transacoesDespesasFixas.filter(
      t => !idsExistentes.includes(t.id)
    );

    if (novasTransacoes.length > 0) {
      setTransacoes([...transacoes, ...novasTransacoes]);
    }
  }, [despesasFixas, salaoAtual.id]); // Roda quando despesas fixas mudam
  
  // Atualizar salaoId quando mudar de salão
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      salaoId: salaoAtual.id
    }));
    setFormDataFixas(prev => ({
      ...prev,
      salaoId: salaoAtual.id
    }));
  }, [salaoAtual.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <FinanceiroHeader
        salaoNome={salaoAtual.nome}
        periodo={periodo}
        setPeriodo={setPeriodo}
        onNovaTransacao={() => handleOpenModal()}
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
                Gerencie receitas, despesas e despesas fixas mensais
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <FinanceiroStats 
        totalReceitas={totalReceitas}
        totalDespesas={totalDespesas}
        saldo={saldo}
        ticketMedio={ticketMedio}
        transacoesSalao={transacoesFiltradas}
      />

      {/* Gráficos */}
      <FinanceiroCharts 
        fluxoCaixaData={fluxoCaixaData}
        categoriasDespesas={categoriasDespesas}
      />

      {/* Indicador de Período */}
      <PeriodoIndicator periodo={periodo} />

      {/* Tabs de Visualização */}
      <ViewModeTabs viewMode={viewMode} setViewMode={setViewMode} />

      {/* Conteúdo baseado na visualização */}
      {viewMode === 'fixas' ? (
        <>
          {/* Botão para adicionar despesa fixa */}
          <div className="flex justify-end">
            <button 
              onClick={() => handleOpenModalFixas()}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <Plus size={20} />
              <span>Nova Despesa Fixa</span>
            </button>
          </div>

          <DespesasFixasList
            despesasFixas={despesasFixasSalao}
            handleOpenModal={handleOpenModalFixas}
            handleDelete={handleDeleteFixas}
            toggleAtiva={toggleAtiva}
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
        </>
      ) : (
        <>
          {/* Filtros */}
          <FinanceiroFilters
            tipoTransacao={tipoTransacao}
            setTipoTransacao={setTipoTransacao}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filtros={filtros}
            setFiltros={setFiltros}
            limparFiltros={limparFiltros}
          />

          {viewMode === 'transacoes' ? (
            <FinanceiroTable 
              filteredTransacoes={filteredTransacoes}
              handleOpenModal={handleOpenModal}
              handleDelete={handleDelete}
            />
          ) : (
            <ContasPagarReceber
              transacoes={filteredTransacoes}
              handleOpenModal={handleOpenModal}
              setTransacoes={setTransacoes}
              allTransacoes={transacoes}
            />
          )}

          {/* Modal de Cadastro/Edição de Transação */}
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
        </>
      )}
    </div>
  );
};

export default Financeiro;