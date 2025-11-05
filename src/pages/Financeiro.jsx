// src/pages/Financeiro.jsx - CORRIGIDO

import { useState, useContext, useEffect, useMemo } from 'react';
import { Plus, Crown } from 'lucide-react';
import Modal from '../components/Modal';
import MaskedInput from '../components/MaskedInput';
import FinanceiroStats from '../components/financeiro/FinanceiroStats';
import FinanceiroCharts from '../components/financeiro/FinanceiroCharts';
import FinanceiroTable from '../components/financeiro/FinanceiroTable';
import PlanRestriction from '../components/PlanRestriction';
import { SalaoContext } from '../contexts/SalaoContext';
import { dateToISO, getTodayBR } from '../utils/masks';
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

  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    categoria: '',
    valor: '',
    formaPagamento: '',
    data: '',
    cliente: '',
    fornecedor: '',
    status: 'confirmado',
    salaoId: salaoAtual.id
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
        cliente: transacao.cliente || '',
        fornecedor: transacao.fornecedor || '',
        status: transacao.status,
        salaoId: transacao.salaoId
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
        cliente: '',
        fornecedor: '',
        status: 'confirmado',
        salaoId: salaoAtual.id
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
      cliente: '',
      fornecedor: '',
      status: 'confirmado',
      salaoId: salaoAtual.id
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setTransacoes(transacoes.map(t => 
        t.id === editingId 
          ? { 
              ...formData, 
              id: editingId,
              valor: parseFloat(formData.valor)
            } 
          : t
      ));
    } else {
      const newTransacao = {
        ...formData,
        id: Math.max(...transacoes.map(t => t.id), 0) + 1,
        valor: parseFloat(formData.valor)
      };
      setTransacoes([...transacoes, newTransacao]);
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
    if (tipoTransacao === 'todas') return true;
    return t.tipo === tipoTransacao;
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

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
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
      </div>

      {/* Lista de Transações */}
      <FinanceiroTable 
        filteredTransacoes={filteredTransacoes}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDelete}
      />

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
                Data *
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
              <option value="confirmado">Confirmado</option>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="cancelado">Cancelado</option>
            </select>
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