// src/pages/Relatorios.jsx - CORRIGIDO

import { useState, useContext, useMemo } from 'react';
import { Download, Crown } from 'lucide-react';
import PlanRestriction from '../components/PlanRestriction';
import RelatoriosStats from '../components/relatorios/RelatoriosStats';
import RelatoriosCharts from '../components/relatorios/RelatoriosCharts';
import RelatoriosTables from '../components/relatorios/RelatoriosTables';
import { SalaoContext } from '../contexts/SalaoContext';
import { dateToISO } from '../utils/masks';
import { hasAccess } from '../utils/planRestrictions';

const Relatorios = () => {
  const { 
    salaoAtual,
    servicos,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao
  } = useContext(SalaoContext);

  // Verificar acesso ao módulo de relatórios
  const temAcessoRelatorios = hasAccess(salaoAtual.plano, 'relatorios');
  
  // Se não tem acesso, mostrar tela de upgrade
  if (!temAcessoRelatorios) {
    return <PlanRestriction feature="relatorios" minPlan="essencial" />;
  }

  const [periodoInicio, setPeriodoInicio] = useState('2025-10-01');
  const [periodoFim, setPeriodoFim] = useState('2025-11-01');
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');

  // Obter dados filtrados por salão
  const clientesSalao = getClientesPorSalao();
  const profissionaisSalao = getProfissionaisPorSalao();
  const servicosSalao = getServicosPorSalao();
  const agendamentosSalao = getAgendamentosPorSalao();
  const transacoesSalao = getTransacoesPorSalao();

  // Faturamento mensal baseado em transações reais
  const faturamentoMensal = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dataAtual = new Date();
    const dados = [];

    for (let i = 9; i >= 0; i--) {
      const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
      const mes = data.getMonth();
      const ano = data.getFullYear();

      const valorMes = transacoesSalao
        .filter(t => {
          if (t.tipo !== 'receita') return false;
          const [tAno, tMes] = t.data.split('-').map(Number);
          return tAno === ano && tMes - 1 === mes;
        })
        .reduce((sum, t) => sum + t.valor, 0);

      dados.push({
        mes: meses[mes],
        valor: valorMes
      });
    }

    return dados;
  }, [transacoesSalao]);

  // Serviços por categoria baseado em dados reais
  const servicosPorCategoria = useMemo(() => {
    const categorias = {};
    
    servicosSalao.forEach(servico => {
      if (!categorias[servico.categoria]) {
        categorias[servico.categoria] = {
          categoria: servico.categoria,
          quantidade: 0,
          valor: 0
        };
      }
      
      const agendamentosDoServico = agendamentosSalao.filter(
        a => a.servicoId === servico.id && a.status !== 'cancelado'
      );
      
      categorias[servico.categoria].quantidade += agendamentosDoServico.length;
      categorias[servico.categoria].valor += servico.valor * agendamentosDoServico.length;
    });

    return Object.values(categorias);
  }, [servicosSalao, agendamentosSalao]);

  // Performance dos profissionais baseada em dados reais
  const profissionaisPerformance = useMemo(() => {
    return profissionaisSalao.map(prof => {
      const agendamentosProf = agendamentosSalao.filter(
        a => a.profissionalId === prof.id && a.status !== 'cancelado'
      );
      
      const faturamento = agendamentosProf.reduce((sum, ag) => {
        const servico = servicos.find(s => s.id === ag.servicoId);
        return sum + (servico ? servico.valor : 0);
      }, 0);
      
      const comissao = agendamentosProf.reduce((sum, ag) => {
        const servico = servicos.find(s => s.id === ag.servicoId);
        return sum + (servico ? (servico.valor * servico.comissao / 100) : 0);
      }, 0);

      return {
        nome: prof.nome,
        atendimentos: agendamentosProf.length,
        faturamento: faturamento,
        comissao: comissao
      };
    });
  }, [profissionaisSalao, agendamentosSalao, servicos]);

  // Horários populares baseado em agendamentos reais
  const horariosPopulares = useMemo(() => {
    const horarios = {};
    
    agendamentosSalao.forEach(ag => {
      if (ag.status !== 'cancelado') {
        if (!horarios[ag.horario]) {
          horarios[ag.horario] = 0;
        }
        horarios[ag.horario]++;
      }
    });

    return Object.entries(horarios)
      .map(([horario, atendimentos]) => ({ horario, atendimentos }))
      .sort((a, b) => a.horario.localeCompare(b.horario))
      .slice(0, 8);
  }, [agendamentosSalao]);

  // Top clientes baseado em dados reais
  const topClientes = useMemo(() => {
    return clientesSalao
      .filter(c => c.status === 'ativo')
      .sort((a, b) => b.totalGasto - a.totalGasto)
      .slice(0, 5)
      .map(cliente => ({
        nome: cliente.nome,
        visitas: cliente.visitas,
        totalGasto: cliente.totalGasto
      }));
  }, [clientesSalao]);

  // Distribuição de pagamento baseada em transações reais
  const distribuicaoPagamento = useMemo(() => {
    const formas = {};
    const cores = {
      'Cartão de Crédito': '#8B5CF6',
      'Pix': '#EC4899',
      'Dinheiro': '#F59E0B',
      'Cartão de Débito': '#10B981',
      'Boleto': '#3B82F6',
      'Transferência': '#EF4444',
      'Débito Automático': '#06B6D4'
    };

    transacoesSalao
      .filter(t => t.tipo === 'receita')
      .forEach(t => {
        if (!formas[t.formaPagamento]) {
          formas[t.formaPagamento] = 0;
        }
        formas[t.formaPagamento]++;
      });

    const total = Object.values(formas).reduce((a, b) => a + b, 0);
    
    if (total === 0) return [];

    return Object.entries(formas).map(([tipo, count]) => ({
      tipo,
      value: Math.round((count / total) * 100),
      color: cores[tipo] || '#6B7280'
    }));
  }, [transacoesSalao]);

  // Estatísticas gerais baseadas em dados reais
  const estatisticasGerais = useMemo(() => {
    const totalFaturamento = transacoesSalao
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + t.valor, 0);

    const agendamentosValidos = agendamentosSalao.filter(a => a.status !== 'cancelado');
    const totalAtendimentos = agendamentosValidos.length;

    const clientesAtivos = clientesSalao.filter(c => c.status === 'ativo').length;
    
    const ticketMedio = clientesAtivos > 0 
      ? clientesSalao.reduce((sum, c) => sum + c.totalGasto, 0) / clientesAtivos
      : 0;

    const novosClientes = clientesSalao.filter(c => {
      return true;
    }).length;

    const clientesComRetorno = clientesSalao.filter(c => c.visitas > 1).length;
    const taxaRetorno = clientesAtivos > 0 
      ? Math.round((clientesComRetorno / clientesAtivos) * 100)
      : 0;

    const produtosVendidos = transacoesSalao.filter(
      t => t.tipo === 'receita' && t.categoria === 'Produtos'
    ).length;

    const servicosRealizados = agendamentosValidos.length;

    return {
      totalFaturamento,
      totalAtendimentos,
      ticketMedio,
      clientesAtivos,
      novosClientes,
      taxaRetorno,
      produtosVendidos,
      servicosRealizados
    };
  }, [clientesSalao, agendamentosSalao, transacoesSalao]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análises e métricas de {salaoAtual.nome}</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
          <Download size={20} />
          <span>Exportar PDF</span>
        </button>
      </div>

      {/* Info do Plano */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="text-blue-600" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Plano {salaoAtual.plano} - Módulo de Relatórios Ativo
              </p>
              <p className="text-xs text-blue-700 mt-1">
                {salaoAtual.plano === 'essencial' || salaoAtual.plano === 'plus' 
                  ? 'Acesso a relatórios básicos e análises essenciais'
                  : salaoAtual.plano === 'profissional' || salaoAtual.plano === 'premium'
                  ? 'Acesso a relatórios completos e detalhados'
                  : 'Acesso total a relatórios avançados e customizáveis'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período Início</label>
            <input
              type="date"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período Fim</label>
            <input
              type="date"
              value={periodoFim}
              onChange={(e) => setPeriodoFim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Relatório</label>
            <select 
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="geral">Relatório Geral</option>
              <option value="financeiro">Financeiro</option>
              <option value="servicos">Serviços</option>
              <option value="clientes">Clientes</option>
              <option value="profissionais">Profissionais</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Gerar Relatório
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <RelatoriosStats estatisticasGerais={estatisticasGerais} />

      {/* Gráficos Principais */}
      <RelatoriosCharts 
        faturamentoMensal={faturamentoMensal}
        horariosPopulares={horariosPopulares}
        servicosPorCategoria={servicosPorCategoria}
        distribuicaoPagamento={distribuicaoPagamento}
      />

      {/* Tabelas */}
      <RelatoriosTables 
        topClientes={topClientes}
        profissionaisPerformance={profissionaisPerformance}
      />

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Novos Clientes</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{estatisticasGerais.novosClientes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Taxa de Retorno</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{estatisticasGerais.taxaRetorno}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Produtos Vendidos</p>
          <p className="text-2xl font-bold text-pink-600 mt-1">{estatisticasGerais.produtosVendidos}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Serviços Realizados</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{estatisticasGerais.servicosRealizados}</p>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;