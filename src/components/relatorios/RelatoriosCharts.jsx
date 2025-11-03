// src/components/relatorios/RelatoriosCharts.jsx
import { DollarSign, Calendar, Scissors, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RelatoriosCharts = ({ faturamentoMensal, horariosPopulares, servicosPorCategoria, distribuicaoPagamento }) => {
  return (
    <>
      {/* Faturamento e Horários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolução do Faturamento */}
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

      {/* Serviços e Pagamentos */}
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
    </>
  );
};

export default RelatoriosCharts;