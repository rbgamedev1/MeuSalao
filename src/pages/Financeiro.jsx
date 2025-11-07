// src/pages/Financeiro.jsx - VERSÃO COMPLETA COM NOVAS FUNCIONALIDADES

import { useState, useContext, useEffect, useMemo } from 'react';
import { Plus, Crown, Filter, Calendar, DollarSign } from 'lucide-react';
import Modal from '../components/Modal';
import MaskedInput from '../components/MaskedInput';
import FinanceiroStats from '../components/financeiro/FinanceiroStats';
import FinanceiroCharts from '../components/financeiro/FinanceiroCharts';
import FinanceiroTable from '../components/financeiro/FinanceiroTable';
import PlanRestriction from '../components/PlanRestriction';
import ContasPagarReceber from '../components/financeiro/ContasPagarReceber';
import { SalaoContext } from '../contexts/SalaoContext';
import { dateToISO, getTodayBR, addDays, addMonths, compareDates } from '../utils/masks';
import { hasAccess } from '../utils/planRestrictions';

const Financeiro = () => {
  const { 
    salaoAtual, 
    transacoes,
    setTransacoes,
    getClientesPorSalao, 
    getFornecedoresPorSalao,
    getTransacoesPorSalao
  } = useContext(SalaoContext);
  
  // Verificar acesso ao módulo financeiro
  const temAcessoFinanceiro = hasAccess(salaoAtual.plano, 'financeiro');
  
  // Se não tem acesso, mostrar tela de upgrade
  if (!temAcessoFinanceiro) {
    return <PlanRestriction feature="financeiro" minPlan="plus" />;
  }
  
  const [periodo, setPeriodo] = useState('mes');
  const [tipoTransacao, setTipoTransacao] = useState('todas');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('transacoes'); // 'transacoes' ou 'contas'

  // Estados para filtros avançados
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    categoria: '',
    status: '',
    formaPagamento: '',
    busca: ''
  });

  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    categoria: '',
    valor: '',
    formaPagamento: '',
    data: '',
    dataVencimento: '',
    cliente: '',
    fornecedor: '',
    status: 'pendente',
    salaoId: salaoAtual.id,
    recorrente: false,
    tipoRecorrencia: 'mensal',
    quantidadeParcelas: 1,
    observacoes: ''
  });

  // Obter dados filtrados por salão
  const clientesSalao = getClientesPorSalao();
  const fornecedoresSalao = getFornecedoresPorSalao();
  const transacoesSalao = getTransacoesPorSalao();

  // Atualizar salaoId quando mudar de salão
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      salaoId: salaoAtual.id
    }));
  }, [salaoAtual.id]);

  // Calcular totais
  const totalReceitas = useMemo(() => {
    return transacoesSalao
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + t.valor, 0);
  }, [transacoesSalao]);

  const totalDespesas = useMemo(() => {
    return transacoesSalao
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0);
  }, [transacoesSalao]);

  const saldo = totalReceitas - totalDespesas;

  // Calcular ticket médio baseado em receitas
  const ticketMedio = useMemo(() => {
    const receitas = transacoesSalao.filter(t => t.tipo === 'receita');
    if (receitas.length === 0) return 0;
    return totalReceitas / receitas.length;
  }, [transacoesSalao, totalReceitas]);

  // Dados de fluxo de caixa dos últimos 6 meses
  const fluxoCaixaData = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dataAtual = new Date();
    const dados = [];

    for (let i = 5; i >= 0; i--) {
      const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
      const mes = data.getMonth();
      const ano = data.getFullYear();

      const receita = transacoesSalao
        .filter(t => {
          if (t.tipo !== 'receita') return false;
          const dataISO = dateToISO(t.data);
          const [tAno, tMes] = dataISO.split('-').map(Number);
          return tAno === ano && tMes - 1 === mes;
        })
        .reduce((sum, t) => sum + t.valor, 0);

      const despesa = transacoesSalao
        .filter(t => {
          if (t.tipo !== 'despesa') return false;
          const dataISO = dateToISO(t.data);
          const [tAno, tMes] = dataISO.split('-').map(Number);
          return tAno === ano && tMes - 1 === mes;
        })
        .reduce((sum, t) => sum + t.valor, 0);

      dados.push({
        mes: meses[mes],
        receita,
        despesa
      });
    }

    return dados;
  }, [transacoesSalao]);

  // Distribuição de despesas por categoria
  const categoriasDespesas = useMemo(() => {
    const categorias = {};
    const despesas = transacoesSalao.filter(t => t.tipo === 'despesa');
    
    if (despesas.length === 0) return [];

    despesas.forEach(t => {
      if (!categorias[t.categoria]) {
        categorias[t.categoria] = 0;
      }
      categorias[t.categoria] += t.valor;
    });

    const totalDespesas = Object.values(categorias).reduce((a, b) => a + b, 0);
    const cores = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

    return Object.entries(categorias).map(([name, valor], index) => ({
      name,
      value: Math.round((valor / totalDespesas) * 100),
      color: cores[index % cores.length]
    }));
  }, [transacoesSalao]);

  const handleOpenModal = (transacao = null) => {
    if (transacao) {
      setEditingId(transacao.id);
      setFormData({
        tipo: transacao.tipo,
        descricao: transacao.descricao,
        categoria: transacao.categoria,
        valor: transacao.valor.toString(),
        formaPagamento: transacao.formaPagamento,
        data: transacao.data,
        dataVencimento: transacao.dataVencimento || '',
        cliente: transacao.cliente || '',
        fornecedor: transacao.fornecedor || '',
        status: transacao.status,
        salaoId: transacao.salaoId,
        recorrente: transacao.recorrente || false,
        tipoRecorrencia: transacao.tipoRecorrencia || 'mensal',
        quantidadeParcelas: transacao.quantidadeParcelas || 1,
        observacoes: transacao.observacoes || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        tipo: 'receita',
        descricao: '',
        categoria: '',
        valor: '',
        formaPagamento: '',
        data: getTodayBR(),
        dataVencimento: '',
        cliente: '',
        fornecedor: '',
        status: 'pendente',
        salaoId: salaoAtual.id,
        recorrente: false,
        tipoRecorrencia: 'mensal',
        quantidadeParcelas: 1,
        observacoes: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      tipo: 'receita',
      descricao: '',
      categoria: '',
      valor: '',
      formaPagamento: '',
      data: getTodayBR(),
      dataVencimento: '',
      cliente: '',
      fornecedor: '',
      status: 'pendente',
      salaoId: salaoAtual.id,
      recorrente: false,
      tipoRecorrencia: 'mensal',
      quantidadeParcelas: 1,
      observacoes: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const baseTransacao = {
      ...formData,
      id: editingId || Math.max(...transacoes.map(t => t.id), 0) + 1,
      valor: parseFloat(formData.valor),
      dataCriacao: getTodayBR()
    };

    if (editingId) {
      setTransacoes(transacoes.map(t => 
        t.id === editingId ? baseTransacao : t
      ));
    } else {
      const novasTransacoes = [baseTransacao];
      
      // Gerar transações recorrentes
      if (formData.recorrente && formData.quantidadeParcelas > 1) {
        let dataBase = formData.dataVencimento || formData.data;
        
        for (let i = 1; i < formData.quantidadeParcelas; i++) {
          // Calcular próxima data baseada no tipo de recorrência
          if (formData.tipoRecorrencia === 'mensal') {
            dataBase = addMonths(dataBase, 1);
          } else if (formData.tipoRecorrencia === 'semanal') {
            dataBase = addDays(dataBase, 7);
          } else if (formData.tipoRecorrencia === 'anual') {
            dataBase = addMonths(dataBase, 12);
          }
          
          novasTransacoes.push({
            ...baseTransacao,
            id: Math.max(...transacoes.map(t => t.id), 0) + i + 1,
            data: dataBase,
            dataVencimento: dataBase,
            descricao: `${formData.descricao} (${i + 1}/${formData.quantidadeParcelas})`,
            parcelaAtual: i + 1,
            totalParcelas: formData.quantidadeParcelas
          });
        }
        
        // Atualizar a primeira transação com info de parcela
        novasTransacoes[0].descricao = `${formData.descricao} (1/${formData.quantidadeParcelas})`;
        novasTransacoes[0].parcelaAtual = 1;
        novasTransacoes[0].totalParcelas = formData.quantidadeParcelas;
      }
      
      setTransacoes([...transacoes, ...novasTransacoes]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransacoes(transacoes.filter(t => t.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredTransacoes = transacoesSalao.filter(t => {
    // Filtro por tipo
    if (tipoTransacao !== 'todas' && t.tipo !== tipoTransacao) return false;
    
    // Filtro por categoria
    if (filtros.categoria && t.categoria !== filtros.categoria) return false;
    
    // Filtro por status
    if (filtros.status && t.status !== filtros.status) return false;
    
    // Filtro por forma de pagamento
    if (filtros.formaPagamento && t.formaPagamento !== filtros.formaPagamento) return false;
    
    // Filtro por data início
    if (filtros.dataInicio) {
      const dataTransacao = dateToISO(t.dataVencimento || t.data);
      const dataInicio = dateToISO(filtros.dataInicio);
      if (compareDates(dataTransacao, dataInicio) < 0) return false;
    }
    
    // Filtro por data fim
    if (filtros.dataFim) {
      const dataTransacao = dateToISO(t.dataVencimento || t.data);
      const dataFim = dateToISO(filtros.dataFim);
      if (compareDates(dataTransacao, dataFim) > 0) return false;
    }
    
    // Filtro por busca (descrição, cliente, fornecedor)
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      const descricao = t.descricao?.toLowerCase() || '';
      const cliente = t.cliente?.toLowerCase() || '';
      const fornecedor = t.fornecedor?.toLowerCase() || '';
      
      if (!descricao.includes(busca) && !cliente.includes(busca) && !fornecedor.includes(busca)) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
          <p className="text-gray-600 mt-1">Controle suas finanças - {salaoAtual.nome}</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="dia">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
          </select>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus size={20} />
            <span>Nova Transação</span>
          </button>
        </div>
      </div>

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
        transacoesSalao={transacoesSalao}
      />

      {/* Gráficos */}
      <FinanceiroCharts 
        fluxoCaixaData={fluxoCaixaData}
        categoriasDespesas={categoriasDespesas}
      />

      {/* Tabs de Visualização */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setViewMode('transacoes')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              viewMode === 'transacoes'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <DollarSign className="inline-block mr-2" size={20} />
            Todas as Transações
          </button>
          <button
            onClick={() => setViewMode('contas')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              viewMode === 'contas'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="inline-block mr-2" size={20} />
            Contas a Pagar/Receber
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTipoTransacao('todas')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tipoTransacao === 'todas'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setTipoTransacao('receita')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tipoTransacao === 'receita'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setTipoTransacao('despesa')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tipoTransacao === 'despesa'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Despesas
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={18} />
            <span>Filtros Avançados</span>
          </button>
        </div>

        {/* Filtros Avançados */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Descrição, cliente ou fornecedor..."
                value={filtros.busca}
                onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <MaskedInput
                mask="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <MaskedInput
                mask="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={filtros.categoria}
                onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todas as categorias</option>
                <option value="Serviços">Serviços</option>
                <option value="Produtos">Produtos</option>
                <option value="Estoque">Estoque</option>
                <option value="Fixas">Fixas</option>
                <option value="Salários">Salários</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="recebido">Recebido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Pagamento
              </label>
              <select
                value={filtros.formaPagamento}
                onChange={(e) => setFiltros({...filtros, formaPagamento: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todas as formas</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Pix">Pix</option>
                <option value="Boleto">Boleto</option>
                <option value="Transferência">Transferência</option>
              </select>
            </div>

            <div className="col-span-full flex justify-end space-x-2">
              <button
                onClick={() => setFiltros({
                  dataInicio: '',
                  dataFim: '',
                  categoria: '',
                  status: '',
                  formaPagamento: '',
                  busca: ''
                })}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

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
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Transação' : 'Nova Transação'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Transação *
              </label>
              <MaskedInput
                mask="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento
              </label>
              <MaskedInput
                mask="date"
                name="dataVencimento"
                value={formData.dataVencimento}
                onChange={handleChange}
                placeholder="DD/MM/AAAA"
              />
              <p className="text-xs text-gray-500 mt-1">
                Para controle de contas a pagar/receber
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Serviço - Corte + Escova"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Serviços">Serviços</option>
                <option value="Produtos">Produtos</option>
                <option value="Estoque">Estoque</option>
                <option value="Fixas">Fixas</option>
                <option value="Salários">Salários</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de Pagamento *
            </label>
            <select
              name="formaPagamento"
              value={formData.formaPagamento}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Pix">Pix</option>
              <option value="Boleto">Boleto</option>
              <option value="Transferência">Transferência</option>
              <option value="Débito Automático">Débito Automático</option>
            </select>
          </div>

          {formData.tipo === 'receita' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um cliente (opcional)</option>
                {clientesSalao.map(cliente => (
                  <option key={cliente.id} value={cliente.nome}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.tipo === 'despesa' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fornecedor
              </label>
              <select
                name="fornecedor"
                value={formData.fornecedor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um fornecedor (opcional)</option>
                {fornecedoresSalao.map(fornecedor => (
                  <option key={fornecedor.id} value={fornecedor.nome}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="recebido">Recebido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Recorrência */}
          <div className="col-span-full border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="recorrente"
                checked={formData.recorrente}
                onChange={(e) => setFormData({...formData, recorrente: e.target.checked})}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <label htmlFor="recorrente" className="text-sm font-medium text-gray-700">
                Transação Recorrente (gerar múltiplas parcelas)
              </label>
            </div>

            {formData.recorrente && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-purple-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Recorrência
                  </label>
                  <select
                    value={formData.tipoRecorrencia}
                    onChange={(e) => setFormData({...formData, tipoRecorrencia: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade de Parcelas
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="60"
                    value={formData.quantidadeParcelas}
                    onChange={(e) => setFormData({...formData, quantidadeParcelas: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="col-span-full">
                  <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                    💡 Serão criadas {formData.quantidadeParcelas} transações {formData.tipoRecorrencia}s 
                    de R$ {formData.valor || '0,00'} cada
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Informações adicionais sobre a transação..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Transação'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Financeiro;