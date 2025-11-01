import { Calendar, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Dados mockados para exemplo
  const stats = [
    {
      icon: Calendar,
      label: 'Agendamentos Hoje',
      value: '12',
      change: '+2 que ontem',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      label: 'Clientes Ativos',
      value: '248',
      change: '+15 este mês',
      color: 'bg-green-500'
    },
    {
      icon: DollarSign,
      label: 'Faturamento Hoje',
      value: 'R$ 1.850',
      change: '+18% vs ontem',
      color: 'bg-purple-500'
    },
    {
      icon: TrendingUp,
      label: 'Faturamento Mês',
      value: 'R$ 32.450',
      change: '+12% vs mês anterior',
      color: 'bg-pink-500'
    }
  ];

  const revenueData = [
    { name: 'Seg', valor: 850 },
    { name: 'Ter', valor: 1200 },
    { name: 'Qua', valor: 980 },
    { name: 'Qui', valor: 1450 },
    { name: 'Sex', valor: 1850 },
    { name: 'Sáb', valor: 2100 },
    { name: 'Dom', valor: 900 },
  ];

  const servicesData = [
    { name: 'Corte', qtd: 45 },
    { name: 'Coloração', qtd: 28 },
    { name: 'Escova', qtd: 35 },
    { name: 'Hidratação', qtd: 22 },
    { name: 'Manicure', qtd: 38 },
  ];

  const proximosAgendamentos = [
    { id: 1, cliente: 'Maria Silva', servico: 'Corte + Escova', horario: '14:00', profissional: 'Ana Costa' },
    { id: 2, cliente: 'João Santos', servico: 'Barba', horario: '14:30', profissional: 'Carlos Lima' },
    { id: 3, cliente: 'Paula Souza', servico: 'Coloração', horario: '15:00', profissional: 'Ana Costa' },
    { id: 4, cliente: 'Roberto Alves', servico: 'Corte', horario: '15:30', profissional: 'Carlos Lima' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu salão</p>
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
                <p className="text-green-600 text-sm mt-2">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faturamento da Semana */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Faturamento da Semana</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Serviços Mais Realizados */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Serviços Mais Realizados</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={servicesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qtd" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Próximos Agendamentos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Próximos Agendamentos</h3>
            <Clock size={20} className="text-gray-400" />
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {proximosAgendamentos.map((agendamento) => (
            <div key={agendamento.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{agendamento.cliente}</p>
                  <p className="text-sm text-gray-600 mt-1">{agendamento.servico}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-600">{agendamento.horario}</p>
                  <p className="text-sm text-gray-600 mt-1">{agendamento.profissional}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;