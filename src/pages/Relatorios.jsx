// src/pages/Relatorios.jsx
import { useState, useContext, useMemo } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, Scissors, Package } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SalaoContext } from '../contexts/SalaoContext';

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
      
      // Contar agendamentos reais para este serviço
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

    // Novos clientes do mês (simulado - em produção usar data de cadastro real)
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const novosClientes = clientesSalao.filter(c => {
      // Simulação - todos clientes são considerados do mês
      return true;
    }).length;

    // Taxa de retorno (clientes com mais de 1 visita)
    const clientesComRetorno = clientesSalao.filter(c => c.visitas > 1).length;
    const taxaRetorno = clientesAtivos > 0 
      ? Math.round((clientesComRetorno / clientesAtivos) * 100)
      : 0;

    // Produtos vendidos e serviços realizados
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

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-green-600" size={20} />
            {estatisticasGerais.totalFaturamento > 0 && <TrendingUp className="text-green-600" size={16} />}
          </div>
          <p className="text-2xl font-bold text-gray-800">
            R$ {estatisticasGerais.totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-600 mt-1">Faturamento Total</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{estatisticasGerais.totalAtendimentos}</p>
          <p className="text-xs text-gray-600 mt-1">Atendimentos</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-purple-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{estatisticasGerais.clientesAtivos}</p>
          <p className="text-xs text-gray-600 mt-1">Clientes Ativos</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-pink-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            R$ {estatisticasGerais.ticketMedio.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">Ticket Médio</p>
        </div>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento Mensal */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolução do Faturamento</h3>
          {faturamentoMensal.some(d => d.valor > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={faturamentoMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#8B5CF6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhuma receita registrada</p>
                <p className="text-sm mt-2">Adicione transações no módulo Financeiro</p>
              </div>
            </div>
          )}
        </div>

        {/* Horários Mais Populares */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Horários Mais Procurados</h3>
          {horariosPopulares.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={horariosPopulares}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="horario" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="atendimentos" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhum agendamento registrado</p>
                <p className="text-sm mt-2">Crie agendamentos para visualizar horários populares</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Serviços e Formas de Pagamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Serviços por Categoria */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Serviços Realizados por Categoria</h3>
          {servicosPorCategoria.length > 0 && servicosPorCategoria.some(s => s.quantidade > 0) ? (
            <div className="space-y-3">
              {servicosPorCategoria.filter(s => s.quantidade > 0).map((servico, index) => {
                const totalQuantidade = servicosPorCategoria.reduce((sum, s) => sum + s.quantidade, 0);
                const porcentagem = totalQuantidade > 0 ? (servico.quantidade / totalQuantidade * 100).toFixed(1) : 0;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{servico.categoria}</span>
                      <span className="text-sm text-gray-600">{servico.quantidade} ({porcentagem}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        style={{ width: `${porcentagem}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Faturamento: R$ {servico.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Scissors size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhum serviço realizado</p>
                <p className="text-sm mt-2">Crie agendamentos para visualizar estatísticas</p>
              </div>
            </div>
          )}
        </div>

        {/* Formas de Pagamento */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Pagamentos</h3>
          {distribuicaoPagamento.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicaoPagamento}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, value }) => `${tipo} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribuicaoPagamento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhuma transação registrada</p>
                <p className="text-sm mt-2">Adicione transações para visualizar distribuição</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Top 5 Clientes</h3>
          </div>
          {topClientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topClientes.map((cliente, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{cliente.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{cliente.visitas}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        R$ {cliente.totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum cliente cadastrado</p>
            </div>
          )}
        </div>

        {/* Performance dos Profissionais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Performance dos Profissionais</h3>
          </div>
          {profissionaisPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profissional</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atend.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profissionaisPerformance.map((prof, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{prof.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{prof.atendimentos}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                        R$ {prof.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum profissional cadastrado</p>
            </div>
          )}
        </div>
      </div>

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