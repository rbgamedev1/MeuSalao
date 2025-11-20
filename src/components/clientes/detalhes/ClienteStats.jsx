// src/components/clientes/detalhes/ClienteStats.jsx

const ClienteStats = ({ stats }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <p className="text-xs text-purple-600 font-medium">Total de Agendamentos</p>
            <p className="text-3xl font-bold text-purple-700 mt-1">{stats.totalAgendamentos}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <p className="text-xs text-green-600 font-medium">Agendamentos Concluídos</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{stats.agendamentosConcluidos}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Total Gasto</p>
            <p className="text-3xl font-bold text-blue-700 mt-1">R$ {stats.totalGeral.toFixed(2)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
            <p className="text-xs text-pink-600 font-medium">Ticket Médio</p>
            <p className="text-3xl font-bold text-pink-700 mt-1">R$ {stats.ticketMedio.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteStats;