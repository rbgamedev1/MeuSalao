// src/components/financeiro/FinanceiroCharts.jsx
import { DollarSign, TrendingDown } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinanceiroCharts = ({ fluxoCaixaData, categoriasDespesas }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Fluxo de Caixa */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fluxo de Caixa (6 meses)</h3>
        {fluxoCaixaData.some(d => d.receita > 0 || d.despesa > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fluxoCaixaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="receita" fill="#10B981" name="Receitas" />
              <Bar dataKey="despesa" fill="#EF4444" name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma transação registrada</p>
              <p className="text-sm mt-2">Adicione transações para visualizar o fluxo</p>
            </div>
          </div>
        )}
      </div>

      {/* Despesas por Categoria */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Despesas por Categoria</h3>
        {categoriasDespesas.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriasDespesas}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoriasDespesas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingDown size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma despesa registrada</p>
              <p className="text-sm mt-2">Adicione despesas para visualizar distribuição</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceiroCharts;