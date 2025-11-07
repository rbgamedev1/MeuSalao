// ============================================
// 4. src/components/financeiro/FinanceiroHeader.jsx
// ============================================
import { Plus } from 'lucide-react';

const FinanceiroHeader = ({ salaoNome, periodo, setPeriodo, onNovaTransacao }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
        <p className="text-gray-600 mt-1">Controle suas finanças - {salaoNome}</p>
      </div>
      <div className="flex items-center space-x-3">
        <select 
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="dia">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="ano">Este Ano</option>
        </select>
        <button 
          onClick={onNovaTransacao}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Nova Transação</span>
        </button>
      </div>
    </div>
  );
};

export default FinanceiroHeader;