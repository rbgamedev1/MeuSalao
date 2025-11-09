// src/components/financeiro/FinanceiroDetails.jsx
import { X, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';
import FinanceiroTable from './FinanceiroTable';

const FinanceiroDetails = ({ 
  cardType, 
  onClose, 
  filteredTransacoes,
  handleOpenModal,
  handleDelete,
  totalReceitas,
  totalDespesas,
  saldo,
  ticketMedio
}) => {
  const getCardConfig = () => {
    switch(cardType) {
      case 'receita':
        return {
          title: 'Entradas - Detalhamento',
          icon: TrendingUp,
          color: 'green',
          stats: [
            { label: 'Total de Entradas', value: `R$ ${totalReceitas.toFixed(2)}` },
            { label: 'Quantidade', value: filteredTransacoes.filter(t => t.tipo === 'receita').length },
            { label: 'Média por Entrada', value: `R$ ${ticketMedio.toFixed(2)}` }
          ],
          transacoes: filteredTransacoes.filter(t => t.tipo === 'receita')
        };
      case 'despesa':
        return {
          title: 'Saídas - Detalhamento',
          icon: TrendingDown,
          color: 'red',
          stats: [
            { label: 'Total de Saídas', value: `R$ ${totalDespesas.toFixed(2)}` },
            { label: 'Quantidade', value: filteredTransacoes.filter(t => t.tipo === 'despesa').length },
            { label: 'Média por Saída', value: `R$ ${(totalDespesas / filteredTransacoes.filter(t => t.tipo === 'despesa').length || 0).toFixed(2)}` }
          ],
          transacoes: filteredTransacoes.filter(t => t.tipo === 'despesa')
        };
      case 'saldo':
        return {
          title: 'Saldo - Visão Geral',
          icon: DollarSign,
          color: saldo >= 0 ? 'purple' : 'red',
          stats: [
            { label: 'Total Entradas', value: `R$ ${totalReceitas.toFixed(2)}` },
            { label: 'Total Saídas', value: `R$ ${totalDespesas.toFixed(2)}` },
            { label: 'Saldo Final', value: `R$ ${saldo.toFixed(2)}` }
          ],
          transacoes: filteredTransacoes
        };
      case 'ticket':
        return {
          title: 'Ticket Médio - Análise',
          icon: CreditCard,
          color: 'blue',
          stats: [
            { label: 'Ticket Médio', value: `R$ ${ticketMedio.toFixed(2)}` },
            { label: 'Total Transações', value: filteredTransacoes.filter(t => t.tipo === 'receita').length },
            { label: 'Receita Total', value: `R$ ${totalReceitas.toFixed(2)}` }
          ],
          transacoes: filteredTransacoes.filter(t => t.tipo === 'receita')
        };
      default:
        return null;
    }
  };

  const config = getCardConfig();
  if (!config) return null;

  const Icon = config.icon;

  const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' }
  };

  const colors = colorClasses[config.color];

  return (
    <div className="space-y-6">
      {/* Header com título e botão fechar */}
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`${colors.bg} p-3 rounded-lg border-2 ${colors.border}`}>
              <Icon className={colors.text} size={32} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${colors.text}`}>{config.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Visualizando {config.transacoes.length} transação(ões)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Fechar"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Stats resumidas */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {config.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
              <p className={`text-xl font-bold mt-1 ${colors.text}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela de transações */}
      <FinanceiroTable
        filteredTransacoes={config.transacoes}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FinanceiroDetails;