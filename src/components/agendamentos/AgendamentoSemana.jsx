// src/components/agendamentos/AgendamentoSemana.jsx - LARGURA FIXA PARA TODOS OS DIAS
import { useMemo } from 'react';
import { User, Calendar, Edit, Trash2, Lock } from 'lucide-react';
import { getStatusColor, formatarDuracao } from '../../utils/agendamentoUtils';

const AgendamentoSemana = ({ 
  currentDate,
  agendamentos, 
  clientes,
  servicos,
  profissionais,
  onAgendamentoClick,
  onEdit,
  onDelete,
  onClickHorario
}) => {
  // Gerar array com os 7 dias da semana
  const diasDaSemana = useMemo(() => {
    const dias = [];
    const primeiroDia = new Date(currentDate);
    primeiroDia.setDate(currentDate.getDate() - currentDate.getDay()); // Domingo

    for (let i = 0; i < 7; i++) {
      const dia = new Date(primeiroDia);
      dia.setDate(primeiroDia.getDate() + i);
      dias.push(dia);
    }

    return dias;
  }, [currentDate]);

  // Horários simplificados para view semanal (apenas principais)
  const horariosPrincipais = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour += 2) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  }, []);

  // Obter agendamentos de um dia específico
  const getAgendamentosDia = (data) => {
    const dataFormatada = data.toLocaleDateString('pt-BR');
    
    return agendamentos
      .filter(ag => ag.data === dataFormatada && ag.status !== 'cancelado')
      .map(ag => {
        const cliente = clientes.find(c => c.id === ag.clienteId);
        const servico = servicos.find(s => s.id === ag.servicoId);
        const profissional = profissionais.find(p => p.id === ag.profissionalId);
        
        return { ...ag, cliente, servico, profissional };
      })
      .sort((a, b) => a.horario.localeCompare(b.horario));
  };

  const hoje = new Date().toDateString();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabeçalho da semana */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Semana de {diasDaSemana[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} a {diasDaSemana[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </h3>
      </div>

      {/* Grade semanal */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {diasDaSemana.map((dia, index) => {
              const agendamentosDia = getAgendamentosDia(dia);
              const isHoje = dia.toDateString() === hoje;
              const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index];

              return (
                <div key={index} className="bg-white min-h-96">
                  {/* Cabeçalho do dia - ALTURA FIXA */}
                  <div className={`p-4 border-b h-24 flex flex-col justify-center ${isHoje ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-xs font-medium uppercase ${isHoje ? 'text-purple-600' : 'text-gray-500'}`}>
                      {diaSemana}
                    </p>
                    <p className={`text-lg font-bold ${isHoje ? 'text-purple-900' : 'text-gray-800'}`}>
                      {dia.getDate()}
                    </p>
                    {/* Indicador "Hoje" em linha separada com altura fixa */}
                    <div className="h-5 mt-1">
                      {isHoje && (
                        <p className="text-xs text-purple-600 font-medium">Hoje</p>
                      )}
                    </div>
                  </div>

                  {/* Agendamentos do dia */}
                  <div className="p-2 space-y-2">
                    {agendamentosDia.length > 0 ? (
                      <>
                        {agendamentosDia.slice(0, 5).map(ag => (
                          <div
                            key={ag.id}
                            onClick={() => onAgendamentoClick(ag)}
                            className={`p-2 rounded-lg cursor-pointer border ${getStatusColor(ag.status)} hover:shadow-md transition-all`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold">{ag.horario}</span>
                              {ag.tipo === 'bloqueio' && (
                                <Lock size={12} className="text-gray-600" />
                              )}
                            </div>
                            <p className="text-xs font-semibold truncate">
                              {ag.cliente?.nome || 'Cliente'}
                            </p>
                            <p className="text-xs opacity-75 truncate">
                              {ag.servico?.nome || 'Serviço'}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs opacity-75">
                                {ag.profissional?.nome || 'Prof.'}
                              </span>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(ag);
                                  }}
                                  className="p-1 hover:bg-white/50 rounded"
                                  title="Editar"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(ag.id);
                                  }}
                                  className="p-1 hover:bg-white/50 rounded"
                                  title="Excluir"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {agendamentosDia.length > 5 && (
                          <div className="text-center py-2 text-xs text-gray-600 font-medium bg-gray-50 rounded">
                            +{agendamentosDia.length - 5} agendamento{agendamentosDia.length - 5 > 1 ? 's' : ''}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-xs text-gray-400">
                        <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhum agendamento</p>
                      </div>
                    )}
                  </div>

                  {/* Estatísticas rápidas */}
                  <div className="border-t border-gray-200 p-2 bg-gray-50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-gray-800">{agendamentosDia.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-center flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-xs text-gray-700">Confirmado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span className="text-xs text-gray-700">Pendente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
            <span className="text-xs text-gray-700">Concluído</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-xs text-gray-700">Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoSemana;