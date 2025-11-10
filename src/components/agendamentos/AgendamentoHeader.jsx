// src/components/agendamentos/AgendamentoHeader.jsx - CORRIGIDO
import { Plus, List, CalendarDays, ChevronLeft, ChevronRight, Clock, CalendarRange } from 'lucide-react';

const AgendamentoHeader = ({ 
  salaoNome, 
  onNovoAgendamento, 
  onBloquearHorario,
  viewMode, 
  setViewMode, 
  currentDate, 
  changeMonth,
  changeWeek,
  changeDay,
  monthNames 
}) => {
  const { mes, ano, dia } = currentDate ? {
    mes: currentDate.getMonth(),
    ano: currentDate.getFullYear(),
    dia: currentDate.getDate()
  } : { mes: 0, ano: new Date().getFullYear(), dia: 1 };

  const diaSemana = currentDate ? ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][currentDate.getDay()] : '';

  return (
    <>
      {/* Header Principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie a agenda - {salaoNome}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onBloquearHorario}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all shadow-lg"
          >
            <Clock size={20} />
            <span>Bloquear Horário</span>
          </button>
          <button
            onClick={onNovoAgendamento}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus size={20} />
            <span>Novo Agendamento</span>
          </button>
        </div>
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
            onClick={() => setViewMode('dia')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'dia'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Clock size={18} />
            <span>Dia</span>
          </button>
          <button
            onClick={() => setViewMode('semana')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'semana'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CalendarRange size={18} />
            <span>Semana</span>
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
            <span>Mês</span>
          </button>
        </div>

        {/* Navegação de Data */}
        {(viewMode === 'calendario' || viewMode === 'semana' || viewMode === 'dia') && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (viewMode === 'calendario') changeMonth(-1);
                else if (viewMode === 'semana') changeWeek(-1);
                else changeDay(-1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-gray-800 min-w-64 text-center">
              {viewMode === 'calendario' && `${monthNames[mes]} ${ano}`}
              {viewMode === 'semana' && `Semana de ${dia} ${monthNames[mes]} ${ano}`}
              {viewMode === 'dia' && `${diaSemana}, ${dia} de ${monthNames[mes]} ${ano}`}
            </span>
            <button
              onClick={() => {
                if (viewMode === 'calendario') changeMonth(1);
                else if (viewMode === 'semana') changeWeek(1);
                else changeDay(1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => {
                if (viewMode === 'calendario') {
                  const today = new Date();
                  changeMonth(today.getMonth() - currentDate.getMonth());
                } else if (viewMode === 'semana') {
                  changeWeek(0);
                } else {
                  changeDay(0);
                }
              }}
              className="px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium"
            >
              Hoje
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AgendamentoHeader;