// ============================================
// 7. src/components/financeiro/ViewModeTabs.jsx
// ============================================
import { DollarSign, Calendar } from 'lucide-react';

const ViewModeTabs = ({ viewMode, setViewMode }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setViewMode('transacoes')}
          className={`flex-1 px-6 py-4 font-medium transition-colors ${
            viewMode === 'transacoes'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <DollarSign className="inline-block mr-2" size={20} />
          Todas as Transações
        </button>
        <button
          onClick={() => setViewMode('contas')}
          className={`flex-1 px-6 py-4 font-medium transition-colors ${
            viewMode === 'contas'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Calendar className="inline-block mr-2" size={20} />
          Contas a Pagar/Receber
        </button>
      </div>
    </div>
  );
};

export default ViewModeTabs;