import { Search, Calendar } from 'lucide-react';
import MaskedInput from '../MaskedInput';

const AgendamentoFiltros = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFiltro, 
  setStatusFiltro,
  dataFiltro,
  setDataFiltro 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Busca por nome */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente ou serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filtro por data */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <MaskedInput
            mask="date"
            placeholder="Filtrar por data..."
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filtro por status */}
        <select 
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todos os Status</option>
          <option value="confirmado">Confirmado</option>
          <option value="pendente">Pendente</option>
          <option value="cancelado">Cancelado</option>
          <option value="concluido">Concluído</option>
        </select>

        {/* Botão limpar filtros */}
        {(searchTerm || statusFiltro || dataFiltro) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFiltro('');
              setDataFiltro('');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default AgendamentoFiltros;