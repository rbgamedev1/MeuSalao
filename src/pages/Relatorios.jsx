import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, Scissors, Package } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Relatorios = () => {
  const [periodoInicio, setPeriodoInicio] = useState('2025-10-01');
  const [periodoFim, setPeriodoFim] = useState('2025-11-01');
  const [tipoRelatorio, setTipoRelatorio] = useState('geral');

  // Dados para os relatórios
  const faturamentoMensal = [
    { mes: 'Jan', valor: 15200 },
    { mes: 'Fev', valor: 18500 },
    { mes: 'Mar', valor: 21300 },
    { mes: 'Abr', valor: 19800 },
    { mes: 'Mai', valor: 24500 },
    { mes: 'Jun', valor: 22800 },
    { mes: 'Jul', valor: 26900 },
    { mes: 'Ago', valor: 28400 },
    { mes: 'Set', valor: 30100 },
    { mes: 'Out', valor: 32450 },
  ];

  const servicosPorCategoria = [
    { categoria: 'Corte', quantidade: 145, valor: 11600 },
    { categoria: 'Coloração', quantidade: 68, valor: 17000 },
    { categoria: 'Escova', quantidade: 98, valor: 5880 },
    { categoria: 'Hidratação', quantidade: 52, valor: 4680 },
    { categoria: 'Manicure', quantidade: 123, valor: 4305 },
    { categoria: 'Barba', quantidade: 87, valor: 3480 },
  ];

  const profissionaisPerformance = [
    { nome: 'Ana Costa', atendimentos: 245, faturamento: 24500, comissao: 9800 },
    { nome: 'Carlos Lima', atendimentos: 198, faturamento: 19800, comissao: 7920 },
    { nome: 'Beatriz Silva', atendimentos: 167, faturamento: 16700, comissao: 6680 },
    { nome: 'Diego Santos', atendimentos: 143, faturamento: 14300, comissao: 5720 },
  ];

  const horariosPopulares = [
    { horario: '09:00', atendimentos: 12 },
    { horario: '10:00', atendimentos: 18 },
    { horario: '11:00', atendimentos: 22 },
    { horario: '14:00', atendimentos: 28 },
    { horario: '15:00', atendimentos: 35 },
    { horario: '16:00', atendimentos: 32 },
    { horario: '17:00', atendimentos: 26 },
    { horario: '18:00', atendimentos: 19 },
  ];

  const topClientes = [
    { nome: 'Maria Silva', visitas: 24, totalGasto: 3120 },
    { nome: 'Paula Souza', visitas: 22, totalGasto: 2890 },
    { nome: 'Ana Oliveira', visitas: 20, totalGasto: 2650 },
    { nome: 'Carla Santos', visitas: 18, totalGasto: 2340 },
    { nome: 'Juliana Lima', visitas: 16, totalGasto: 2080 },
  ];

  const distribuicaoPagamento = [
    { tipo: 'Cartão Crédito', value: 45, color: '#8B5CF6' },
    { tipo: 'Pix', value: 30, color: '#EC4899' },
    { tipo: 'Dinheiro', value: 15, color: '#F59E0B' },
    { tipo: 'Cartão Débito', value: 10, color: '#10B981' },
  ];

  const estatisticasGerais = {
    totalFaturamento: 32450,
    totalAtendimentos: 753,
    ticketMedio: 153.30,
    clientesAtivos: 248,
    novosClientes: 18,
    taxaRetorno: 78,
    produtosVendidos: 145,
    servicosRealizados: 608
  };

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análises e métricas do seu salão</p>
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
            <TrendingUp className="text-green-600" size={16} />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            R$ {estatisticasGerais.totalFaturamento.toLocaleString()}
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
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={faturamentoMensal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Horários Mais Populares */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Horários Mais Procurados</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={horariosPopulares}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="horario" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="atendimentos" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Serviços e Formas de Pagamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Serviços por Categoria */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Serviços Realizados por Categoria</h3>
          <div className="space-y-3">
            {servicosPorCategoria.map((servico, index) => {
              const porcentagem = (servico.quantidade / 753 * 100).toFixed(1);
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
                  <p className="text-xs text-gray-500 mt-1">Faturamento: R$ {servico.valor.toLocaleString()}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Pagamentos</h3>
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
        </div>
      </div>

      {/* Tabelas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Top 5 Clientes</h3>
          </div>
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
                      R$ {cliente.totalGasto.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance dos Profissionais */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Performance dos Profissionais</h3>
          </div>
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
                      R$ {prof.faturamento.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;