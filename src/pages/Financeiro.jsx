// ============================================
// 9. src/pages/Financeiro.jsx - ARQUIVO PRINCIPAL MODULARIZADO
// ============================================
import { useState, useContext, useEffect } from 'react';
import { Crown } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import { hasAccess } from '../utils/planRestrictions';

// Hooks personalizados
import { useFinanceiroData } from '../hooks/useFinanceiroData';
import { useFinanceiroFilters } from '../hooks/useFinanceiroFilters';
import { useTransacaoForm } from '../hooks/useTransacaoForm';

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
    ticketMedio,
    fluxoCaixaData,
    categoriasDespesas
  } = useFinanceiroData(transacoesSalao, periodo);
  
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
  
  // Atualizar salaoId quando mudar de salão
  useEffect(() => {
    setFormData(prev => ({
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
                Gerencie suas finanças com controle completo de receitas e despesas
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

      {/* Conteúdo baseado na visualização */}
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

      {/* Modal de Cadastro/Edição */}
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