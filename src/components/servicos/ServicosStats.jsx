// src/components/servicos/ServicosStats.jsx
import { Scissors, DollarSign, Tag } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' }
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{value}</p>
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <Icon className={colors.text} size={24} />
        </div>
      </div>
    </div>
  );
};

const ServicosStats = ({ totalServicos, valorMedio, servicosPremium, totalCategorias }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        icon={Scissors}
        label="Total de Serviços"
        value={totalServicos}
        color="purple"
      />
      <StatCard 
        icon={DollarSign}
        label="Valor Médio"
        value={`R$ ${valorMedio.toFixed(0)}`}
        color="green"
      />
      <StatCard 
        icon={Scissors}
        label="Serviços Premium"
        value={servicosPremium}
        color="pink"
      />
      <StatCard 
        icon={Tag}
        label="Categorias"
        value={totalCategorias}
        color="blue"
      />
    </div>
  );
};

export default ServicosStats;