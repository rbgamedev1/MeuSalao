// src/pages/Dashboard.jsx
import { useContext, useMemo } from 'react';
import { Calendar, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SalaoContext } from '../contexts/SalaoContext';

const Dashboard = () => {
  const { 
    salaoAtual,
    clientes,
    profissionais,
    servicos,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao
  } = useContext(SalaoContext);

  // Obter dados filtrados por salão
  const clientesSalao = getClientesPorSalao();
  const profissionaisSalao = getProfissionaisPorSalao();
  const servicosSalao = getServicosPorSalao();
  const agendamentosSalao = getAgendamentosPorSalao();
  const transacoesSalao = getTransacoesPorSalao();

  // Calcular agendamentos de hoje
  const agendamentosHoje = useMemo(() => {
    const hoje = new Date().toLocaleDateString('pt-BR');
    return agendamentosSalao.filter(a => a.data === hoje).length;
  }, [agendamentosSalao]);

  // Calcular faturamento de hoje baseado em transações
  const faturamentoHoje = useMemo(() => {
    const hoje = new Date().toISOString().split('T')[0];
    return transacoesSalao
      .filter(t => t.tipo === 'receita' && t.data === hoje)
      .reduce((sum, t) => sum + t.valor, 0);
  }, [transacoesSalao]);

  // Calcular faturamento do mês
  const faturamentoMes = useMemo(() => {
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth();
    const anoAtual = dataAtual.getFullYear();
    
    return transacoesSalao
      .filter(t => {
        if (t.tipo !== 'receita') return false;
        const [ano, mes] = t.data.split('-').map(Number);
        return ano === anoAtual && mes - 1 === mesAtual;
      })
      .reduce((sum, t) => sum + t.valor, 0);
  }, [transacoesSalao]);

  // Estatísticas principais
  const stats = useMemo(() => {
    const clientesAtivos = clientesSalao.filter(c => c.status === 'ativo').length;
    
    return [
      {
        icon: Calendar,
        label: 'Agendamentos Hoje',
        value: agendamentosHoje.toString(),
        change: agendamentosSalao.length > 0 ? `${agendamentosSalao.length} total` : 'Nenhum agendamento',
        color: 'bg-blue-500'
      },
      {
        icon: Users,
        label: 'Clientes Ativos',
        value: clientesAtivos.toString(),
        change: `${clientesSalao.length} total`,
        color: 'bg-green-500'
      },
      {
        icon: DollarSign,
        label: 'Faturamento Hoje',
        value: `R$ ${faturamentoHoje.toFixed(2)}`,
        change: faturamentoHoje > 0 ? 'Receitas confirmadas' : 'Sem receitas hoje',
        color: 'bg-purple-500'
      },
      {
        icon: TrendingUp,
        label: 'Faturamento Mês',
        value: `R$ ${faturamentoMes.toFixed(2)}`,
        change: faturamentoMes > 0 ? 'Receitas do mês' : 'Sem receitas no mês',
        color: 'bg-pink-500'
      }
    ];
  }, [clientesSalao, agendamentosHoje, agendamentosSalao, faturamentoHoje, faturamentoMes]);

  // Dados de faturamento semanal baseados em transações reais
  const faturamentoSemanal = useMemo(() => {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const hoje = new Date();
    const dados = [];

    for (let i = 6; i >= 0; i--) {
      const data = new Date(hoje);
      data.setDate(data.getDate() - i);
      const dataStr = data.toISOString().split('T')[0];
      const diaSemana = diasSemana[data.getDay()];

      const valorDia = transacoesSalao
        .filter(t => t.tipo === 'receita' && t.data === dataStr)
        .reduce((sum, t) => sum + t.valor, 0);

      dados.push({
        name: diaSemana,
        valor: valorDia
      });
    }

    return dados;
  }, [transacoesSalao]);

  // Serviços por categoria baseados em dados reais
  const servicosPorCategoria = useMemo(() => {
    const categorias = {};
    servicosSalao.forEach(servico => {
      if (!categorias[servico.categoria]) {
        categorias[servico.categoria] = {
          name: servico.categoria,
          qtd: 0
        };
      }
      categorias[servico.categoria].qtd++;
    });

    return Object.values(categorias).slice(0, 5);
  }, [servicosSalao]);

  // Próximos agendamentos reais com nomes resolvidos
  const proximosAgendamentos = useMemo(() => {
    const hoje = new Date();
    const hojeStr = hoje.toLocaleDateString('pt-BR');
    
    return agendamentosSalao
      .filter(a => a.data === hojeStr && a.status !== 'cancelado')
      .sort((a, b) => a.horario.localeCompare(b.horario))
      .slice(0, 4)
      .map(agendamento => {
        const cliente = clientes.find(c => c.id === agendamento.clienteId);
        const servico = servicos.find(s => s.id === agendamento.servicoId);
        const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
        
        return {
          ...agendamento,
          clienteNome: cliente?.nome || 'Cliente não encontrado',
          clienteTelefone: cliente?.telefone || '',
          servicoNome: servico?.nome || 'Serviço não encontrado',
          servicoValor: servico?.valor || 0,
          profissionalNome: profissional?.nome || 'Profissional não encontrado'
        };
      });
  }, [agendamentosSalao, clientes, servicos, profissionais]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do {salaoAtual.nome}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-2">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo do Salão */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Resumo do Salão</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-purple-100 text-sm">Profissionais</p>
            <p className="text-3xl font-bold mt-1">{profissionaisSalao.length}</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Serviços Cadastrados</p>
            <p className="text-3xl font-bold mt-1">{servicosSalao.length}</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm">Clientes Cadastrados</p>
            <p className="text-3xl font-bold mt-1">{clientesSalao.length}</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento da Semana */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Faturamento da Semana</h3>
          {faturamentoSemanal.some(d => d.valor > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={faturamentoSemanal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhuma receita registrada</p>
                <p className="text-sm mt-2">Adicione transações no módulo Financeiro</p>
              </div>
            </div>
          )}
        </div>

        {/* Serviços por Categoria */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Serviços por Categoria</h3>
          {servicosPorCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={servicosPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qtd" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhum serviço cadastrado</p>
                <p className="text-sm mt-2">Cadastre serviços para visualizar estatísticas</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Próximos Agendamentos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Próximos Agendamentos Hoje</h3>
            <Clock size={20} className="text-gray-400" />
          </div>
        </div>
        {proximosAgendamentos.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {proximosAgendamentos.map((agendamento) => (
              <div key={agendamento.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {agendamento.clienteNome.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{agendamento.clienteNome}</p>
                        {agendamento.clienteTelefone && (
                          <p className="text-sm text-gray-500">{agendamento.clienteTelefone}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 ml-13">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{agendamento.servicoNome}</span>
                        {agendamento.servicoValor > 0 && (
                          <span className="text-green-600 ml-2">
                            R$ {agendamento.servicoValor.toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-purple-600 text-lg">{agendamento.horario}</p>
                    <p className="text-sm text-gray-600 mt-1">{agendamento.profissionalNome}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      agendamento.status === 'confirmado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum agendamento para hoje</p>
            <p className="text-sm mt-2">Os agendamentos aparecerão aqui</p>
          </div>
        )}
      </div>

      {/* Informações do Plano */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="font-semibold text-blue-900">Plano Atual: {salaoAtual.plano}</p>
            <p className="text-sm text-blue-700 mt-1">
              {salaoAtual.plano === 'inicial' 
                ? 'Plano gratuito com recursos básicos. Faça upgrade para desbloquear mais funcionalidades!'
                : 'Aproveite todos os recursos do seu plano para maximizar seus resultados!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;