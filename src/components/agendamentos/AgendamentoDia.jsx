// src/components/agendamentos/AgendamentoDia.jsx - CABEÇALHO CORRIGIDO
import { useMemo } from 'react';
import { User, Clock, Edit, Trash2, Lock } from 'lucide-react';
import { getStatusColor, formatarDuracao } from '../../utils/agendamentoUtils';

const AgendamentoDia = ({ 
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
  // Gerar grade de horários (8:00 às 20:30, intervalos de 30min)
  const horarios = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 30) break;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }, []);

  // Formatar data para comparação
  const dataFormatada = currentDate.toLocaleDateString('pt-BR');

  // Agrupar agendamentos por profissional
  const agendamentosPorProfissional = useMemo(() => {
    const grupos = {};
    
    profissionais.forEach(prof => {
      grupos[prof.id] = {
        profissional: prof,
        agendamentos: []
      };
    });

    agendamentos
      .filter(ag => ag.data === dataFormatada && ag.status !== 'cancelado')
      .forEach(ag => {
        const cliente = clientes.find(c => c.id === ag.clienteId);
        const servico = servicos.find(s => s.id === ag.servicoId);
        const profissional = profissionais.find(p => p.id === ag.profissionalId);
        
        if (grupos[ag.profissionalId]) {
          grupos[ag.profissionalId].agendamentos.push({
            ...ag,
            cliente,
            servico,
            profissional
          });
        }
      });

    return Object.values(grupos);
  }, [agendamentos, clientes, servicos, profissionais, dataFormatada]);

  // Verificar se horário está ocupado para um profissional
  const isHorarioOcupado = (profissionalId, horario) => {
    return agendamentos.some(ag => 
      ag.profissionalId === profissionalId &&
      ag.data === dataFormatada &&
      ag.horario === horario &&
      ag.status !== 'cancelado'
    );
  };

  // Encontrar agendamento em um horário específico
  const getAgendamento = (profissionalId, horario) => {
    const ag = agendamentos.find(ag => 
      ag.profissionalId === profissionalId &&
      ag.data === dataFormatada &&
      ag.horario === horario &&
      ag.status !== 'cancelado'
    );

    if (!ag) return null;

    // Tratar bloqueios diferente de agendamentos
    if (ag.tipo === 'bloqueio' || ag.status === 'bloqueado') {
      const profissional = profissionais.find(p => p.id === ag.profissionalId);
      return {
        ...ag,
        profissional,
        isBloqueio: true
      };
    }

    const cliente = clientes.find(c => c.id === ag.clienteId);
    const servico = servicos.find(s => s.id === ag.servicoId);
    const profissional = profissionais.find(p => p.id === ag.profissionalId);

    return { ...ag, cliente, servico, profissional, isBloqueio: false };
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  if (profissionais.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
        <User size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Nenhum profissional cadastrado neste salão.</p>
        <p className="text-sm text-gray-500 mt-2">Cadastre profissionais primeiro para visualizar a agenda do dia.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabeçalho com data */}
      <div className={`px-6 py-4 border-b ${isToday ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
        <h3 className={`text-lg font-semibold ${isToday ? 'text-purple-900' : 'text-gray-800'}`}>
          {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          {isToday && <span className="ml-2 text-sm font-normal text-purple-600">(Hoje)</span>}
        </h3>
      </div>

      {/* Grade de horários */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 z-10 bg-gray-50 border-r border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                  Horário
                </th>
                {profissionais.map(prof => (
                  <th key={prof.id} className="border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-700 min-w-64">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <User size={16} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{prof.nome}</p>
                        <p className="text-xs text-gray-500 normal-case">{prof.especialidades?.join(', ') || 'Profissional'}</p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horarios.map(horario => (
                <tr key={horario} className="hover:bg-gray-50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white border-r border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-600">
                    {horario}
                  </td>
                  {profissionais.map(prof => {
                    const agendamento = getAgendamento(prof.id, horario);
                    const ocupado = isHorarioOcupado(prof.id, horario);

                    return (
                      <td 
                        key={prof.id}
                        className="border-b border-gray-200 px-2 py-2 cursor-pointer"
                        onClick={() => !ocupado && onClickHorario(prof.id, horario)}
                      >
                        {agendamento ? (
                          <div 
                            className={`p-3 rounded-lg border-2 ${getStatusColor(agendamento.status)} transition-all hover:shadow-md`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!agendamento.isBloqueio) {
                                onAgendamentoClick(agendamento);
                              }
                            }}
                          >
                            {agendamento.isBloqueio ? (
                              <>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Lock size={16} className="text-gray-600" />
                                    <span className="font-semibold text-sm">Bloqueado</span>
                                  </div>
                                </div>
                                <p className="text-xs opacity-75">
                                  {agendamento.motivo || 'Horário indisponível'}
                                </p>
                                <div className="flex items-center justify-end mt-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete(agendamento.id);
                                    }}
                                    className="p-1 hover:bg-white/50 rounded transition-colors"
                                    title="Remover bloqueio"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">
                                      {agendamento.cliente?.nome || 'Cliente'}
                                    </p>
                                    <p className="text-xs opacity-75 truncate">
                                      {agendamento.servico?.nome || 'Serviço'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="opacity-75">
                                    {agendamento.servico?.duracao ? formatarDuracao(agendamento.servico.duracao) : ''}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(agendamento);
                                      }}
                                      className="p-1 hover:bg-white/50 rounded transition-colors"
                                      title="Editar"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(agendamento.id);
                                      }}
                                      className="p-1 hover:bg-white/50 rounded transition-colors"
                                      title="Excluir"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all h-full min-h-20 flex items-center justify-center">
                            <span className="text-xs text-gray-400">Vazio</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-center flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300"></div>
            <span className="text-xs text-gray-700">Confirmado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-300"></div>
            <span className="text-xs text-gray-700">Pendente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-xs text-gray-700">Concluído</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-300"></div>
            <span className="text-xs text-gray-700">Cancelado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gray-100 border-2 border-gray-400"></div>
            <Lock size={14} className="text-gray-600" />
            <span className="text-xs text-gray-700">Bloqueado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendamentoDia;