// src/components/financeiro/FinanceiroStats.jsx - ATUALIZADO
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Plus } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtext, color, onClick, onAddClick, showAddButton }) => {
  const colorClasses = {
    green: { 
      bg: 'bg-green-100', 
      text: 'text-green-600',
      hover: 'hover:bg-green-50',
      border: 'border-green-200'
    },
    red: { 
      bg: 'bg-red-100', 
      text: 'text-red-600',
      hover: 'hover:bg-red-50',
      border: 'border-red-200'
    },
    purple: { 
      bg: 'bg-purple-100', 
      text: 'text-purple-600',
      hover: 'hover:bg-purple-50',
      border: 'border-purple-200'
    },
    blue: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-600',
      hover: 'hover:bg-blue-50',
      border: 'border-blue-200'
    }
  };

  const colors = colorClasses[color];

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm p-6 border-2 ${colors.border} ${colors.hover} transition-all cursor-pointer transform hover:scale-105 hover:shadow-md relative`}
    >
      {showAddButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddClick();
          }}
          className={`absolute top-4 right-4 ${colors.bg} ${colors.text} p-2.5 rounded-full hover:opacity-80 transition-opacity shadow-lg border-2 ${colors.border}`}
          title={`Adicionar ${label}`}
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>
      )}
      
      <div className="flex items-center justify-between">
        <div className={`${colors.bg} p-3 rounded-lg flex-shrink-0 self-center mr-4`}>
          <Icon className={colors.text} size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${colors.text}`}>
            {value}
          </p>
          <p className="text-xs text-gray-500 mt-2">{subtext}</p>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-400 text-center">
        {showAddButton ? 'Clique no + para adicionar ou aqui para detalhes' : 'Clique para ver detalhes'}
      </div>
    </div>
  );
};

const FinanceiroStats = ({ 
  totalReceitas, 
  totalDespesas, 
  saldo, 
  ticketMedio, 
  transacoesSalao,
  onCardClick,
  onAddReceita,
  onAddDespesa
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        icon={TrendingUp}
        label="Entradas"
        value={`R$ ${totalReceitas.toFixed(2)}`}
        subtext={`${transacoesSalao.filter(t => t.tipo === 'receita').length} transações`}
        color="green"
        onClick={() => onCardClick('receita')}
        onAddClick={onAddReceita}
        showAddButton={true}
      />

      <StatCard 
        icon={TrendingDown}
        label="Saídas"
        value={`R$ ${totalDespesas.toFixed(2)}`}
        subtext={`${transacoesSalao.filter(t => t.tipo === 'despesa').length} transações`}
        color="red"
        onClick={() => onCardClick('despesa')}
        onAddClick={onAddDespesa}
        showAddButton={true}
      />

      <StatCard 
        icon={DollarSign}
        label="Saldo"
        value={`R$ ${Math.abs(saldo).toFixed(2)}`}
        subtext={saldo >= 0 ? 'Positivo' : 'Negativo'}
        color={saldo >= 0 ? 'purple' : 'red'}
        onClick={() => onCardClick('saldo')}
        showAddButton={false}
      />

      <StatCard 
        icon={CreditCard}
        label="Ticket Médio"
        value={`R$ ${ticketMedio.toFixed(2)}`}
        subtext={ticketMedio > 0 ? 'Por transação' : 'Sem dados'}
        color="blue"
        onClick={() => onCardClick('ticket')}
        showAddButton={false}
      />
    </div>
  );
};

export default FinanceiroStats;