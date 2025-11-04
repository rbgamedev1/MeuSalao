import { Plus, List, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

const AgendamentoHeader = ({ 
  salaoNome, 
  onNovoAgendamento, 
  viewMode, 
  setViewMode, 
  currentDate, 
  changeMonth, 
  monthNames 
}) => {
  const { mes, ano } = currentDate ? {
    mes: currentDate.getMonth(),
    ano: currentDate.getFullYear()
  } : { mes: 0, ano: new Date().getFullYear() };

  return (
    <>
      {/* Header Principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie a agenda - {salaoNome}</p>
        </div>
        <button
          onClick={onNovoAgendamento}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Controles de Visualização */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('lista')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'lista'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <List size={18} />
            <span>Lista</span>
          </button>
          <button
            onClick={() => setViewMode('calendario')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'calendario'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CalendarDays size={18} />
            <span>Calendário</span>
          </button>
        </div>

        {viewMode === 'calendario' && changeMonth && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-gray-800 min-w-40 text-center">
              {monthNames[mes]} {ano}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AgendamentoHeader;