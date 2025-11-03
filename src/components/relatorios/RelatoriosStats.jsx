// src/components/relatorios/RelatoriosStats.jsx
import { DollarSign, Calendar, Users, TrendingUp } from 'lucide-react';

const RelatoriosStats = ({ estatisticasGerais }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <DollarSign className="text-green-600" size={20} />
          {estatisticasGerais.totalFaturamento > 0 && <TrendingUp className="text-green-600" size={16} />}
        </div>
        <p className="text-2xl font-bold text-gray-800">
          R$ {estatisticasGerais.totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
  );
};

export default RelatoriosStats;