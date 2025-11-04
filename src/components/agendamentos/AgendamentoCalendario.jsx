import { useMemo } from 'react';
import { getStatusColor } from '../../utils/agendamentoUtils';

const AgendamentoCalendario = ({ 
  currentDate, 
  agendamentos, 
  clientes, 
  servicos, 
  onAgendamentoClick 
}) => {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  }, [currentDate]);

  const getAgendamentosForDate = (date) => {
    const dateStr = date.toLocaleDateString('pt-BR');
    return agendamentos
      .filter(ag => ag.data === dateStr)
      .map(ag => ({
        ...ag,
        cliente: clientes.find(c => c.id === ag.clienteId),
        servico: servicos.find(s => s.id === ag.servicoId)
      }));
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = calendarData;
    const days = [];
    
    // Células vazias antes do primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-32 bg-gray-50 border border-gray-200"></div>
      );
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateAgendamentos = getAgendamentosForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={day}
          className={`min-h-32 border border-gray-200 p-2 ${
            isToday ? 'bg-purple-50 border-purple-300' : 'bg-white'
          } hover:bg-gray-50 transition-colors`}
        >
          <div className={`text-sm font-semibold mb-2 ${
            isToday ? 'text-purple-600' : 'text-gray-700'
          }`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {dateAgendamentos.slice(0, 3).map(ag => (
              <div
                key={ag.id}
                onClick={() => onAgendamentoClick(ag)}
                className={`text-xs p-1 rounded cursor-pointer border ${getStatusColor(ag.status)} hover:opacity-80 transition-opacity`}
              >
                <div className="font-medium truncate">
                  {ag.horario} - {ag.cliente?.nome || 'Cliente'}
                </div>
                <div className="truncate text-xs opacity-75">
                  {ag.servico?.nome || 'Serviço'}
                </div>
              </div>
            ))}
            
            {dateAgendamentos.length > 3 && (
              <div className="text-xs text-gray-600 font-medium">
                +{dateAgendamentos.length - 3} mais
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-sm text-gray-700">Confirmado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span className="text-sm text-gray-700">Pendente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
            <span className="text-sm text-gray-700">Concluído</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-sm text-gray-700">Cancelado</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgendamentoCalendario;