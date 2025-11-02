// src/components/produtos/ProdutosStats.jsx
import { Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' }
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
          <Icon size={24} className={colors.text} />
        </div>
      </div>
    </div>
  );
};

const ProdutosStats = ({ totalProdutos, produtosBaixoEstoque, valorTotalEstoque, margemMedia }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        icon={Package}
        label="Total de Produtos"
        value={totalProdutos}
        color="blue"
      />
      <StatCard 
        icon={AlertTriangle}
        label="Baixo Estoque"
        value={produtosBaixoEstoque}
        color="red"
      />
      <StatCard 
        icon={DollarSign}
        label="Valor em Estoque"
        value={`R$ ${valorTotalEstoque.toFixed(0)}`}
        color="green"
      />
      <StatCard 
        icon={TrendingUp}
        label="Margem Média"
        value={`${margemMedia.toFixed(0)}%`}
        color="purple"
      />
    </div>
  );
};

export default ProdutosStats;