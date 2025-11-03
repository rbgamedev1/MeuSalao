// src/components/financeiro/FinanceiroStats.jsx
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtext, color, trend }) => {
  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${colors.text}`}>
            {value}
          </p>
          <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <Icon className={colors.text} size={24} />
        </div>
      </div>
    </div>
  );
};

const FinanceiroStats = ({ totalReceitas, totalDespesas, saldo, ticketMedio, transacoesSalao }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        icon={TrendingUp}
        label="Receitas"
        value={`R$ ${totalReceitas.toFixed(2)}`}
        subtext={`${transacoesSalao.filter(t => t.tipo === 'receita').length} transações`}
        color="green"
      />

      <StatCard 
        icon={TrendingDown}
        label="Despesas"
        value={`R$ ${totalDespesas.toFixed(2)}`}
        subtext={`${transacoesSalao.filter(t => t.tipo === 'despesa').length} transações`}
        color="red"
      />

      <StatCard 
        icon={DollarSign}
        label="Saldo"
        value={`R$ ${Math.abs(saldo).toFixed(2)}`}
        subtext={saldo >= 0 ? 'Positivo' : 'Negativo'}
        color={saldo >= 0 ? 'purple' : 'red'}
      />

      <StatCard 
        icon={CreditCard}
        label="Ticket Médio"
        value={`R$ ${ticketMedio.toFixed(2)}`}
        subtext={ticketMedio > 0 ? 'Por transação' : 'Sem dados'}
        color="blue"
      />
    </div>
  );
};

export default FinanceiroStats;