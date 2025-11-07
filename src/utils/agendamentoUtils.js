// src/utils/agendamentoUtils.js - CORRIGIDO COM VALIDAÇÃO DE BLOQUEIOS

import { format, addDays, isSameDay, isToday, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata data para exibição
 */
export const formatarData = (data, formato = 'dd/MM/yyyy') => {
  if (!data) return '';
  return format(new Date(data), formato, { locale: ptBR });
};

/**
 * Formata hora para exibição
 */
export const formatarHora = (data) => {
  if (!data) return '';
  return format(new Date(data), 'HH:mm', { locale: ptBR });
};

/**
 * Gera array de horários disponíveis
 */
export const gerarHorariosDisponiveis = (
  horarioInicio = '08:00',
  horarioFim = '18:00',
  intervaloMinutos = 30
) => {
  const horarios = [];
  const [horaInicio, minutoInicio] = horarioInicio.split(':').map(Number);
  const [horaFim, minutoFim] = horarioFim.split(':').map(Number);

  let horaAtual = horaInicio;
  let minutoAtual = minutoInicio;

  while (
    horaAtual < horaFim ||
    (horaAtual === horaFim && minutoAtual <= minutoFim)
  ) {
    const horarioFormatado = `${String(horaAtual).padStart(2, '0')}:${String(minutoAtual).padStart(2, '0')}`;
    horarios.push(horarioFormatado);

    minutoAtual += intervaloMinutos;
    if (minutoAtual >= 60) {
      horaAtual += Math.floor(minutoAtual / 60);
      minutoAtual = minutoAtual % 60;
    }
  }

  return horarios;
};

/**
 * Converter horário string para minutos desde meia-noite
 */
const horarioParaMinutos = (horario) => {
  const [horas, minutos] = horario.split(':').map(Number);
  return horas * 60 + minutos;
};

/**
 * Converter minutos desde meia-noite para horário string
 */
const minutosParaHorario = (minutos) => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * ✅ NOVO: Verificar se horário está dentro de um bloqueio
 */
const isHorarioBloqueado = (horario, bloqueios, profissionalId, data) => {
  const horarioMinutos = horarioParaMinutos(horario);
  
  return bloqueios.some(bloqueio => {
    if (bloqueio.profissionalId !== profissionalId) return false;
    if (bloqueio.data !== data) return false;
    if (bloqueio.status !== 'bloqueado' && bloqueio.tipo !== 'bloqueio') return false;
    
    const inicioMinutos = horarioParaMinutos(bloqueio.horario);
    
    // Se tem horarioFim, verificar se está no intervalo
    if (bloqueio.horarioFim) {
      const fimMinutos = horarioParaMinutos(bloqueio.horarioFim);
      return horarioMinutos >= inicioMinutos && horarioMinutos < fimMinutos;
    }
    
    // Se não tem horarioFim, bloquear apenas o horário exato
    return horarioMinutos === inicioMinutos;
  });
};

/**
 * ✅ ATUALIZADO: Calcular horários ocupados considerando duração do serviço E bloqueios
 */
export const calcularHorariosOcupados = (agendamentos, servicos, profissionalId, data) => {
  const horariosOcupados = new Set();
  
  // Filtrar agendamentos do profissional na data específica (incluindo bloqueios)
  const agendamentosDia = agendamentos.filter(ag => 
    ag.profissionalId === profissionalId &&
    ag.data === data &&
    ag.status !== 'cancelado'
  );

  // Para cada agendamento, marcar todos os horários ocupados pela duração
  agendamentosDia.forEach(ag => {
    // Se for bloqueio
    if (ag.tipo === 'bloqueio' || ag.status === 'bloqueado') {
      const inicioMinutos = horarioParaMinutos(ag.horario);
      const fimMinutos = ag.horarioFim 
        ? horarioParaMinutos(ag.horarioFim)
        : inicioMinutos + 30; // Se não tiver fim, bloqueia 30min
      
      // Gerar todos os horários de 30 em 30 minutos dentro do bloqueio
      const todosHorarios = gerarHorariosDisponiveis('08:00', '20:30', 30);
      
      todosHorarios.forEach(horario => {
        const horarioMinutos = horarioParaMinutos(horario);
        if (horarioMinutos >= inicioMinutos && horarioMinutos < fimMinutos) {
          horariosOcupados.add(horario);
        }
      });
      return;
    }
    
    // Se for agendamento normal
    const servico = servicos.find(s => s.id === ag.servicoId);
    if (!servico) return;

    const inicioMinutos = horarioParaMinutos(ag.horario);
    const duracaoMinutos = servico.duracao;
    const fimMinutos = inicioMinutos + duracaoMinutos;

    const todosHorarios = gerarHorariosDisponiveis('08:00', '20:30', 30);
    
    todosHorarios.forEach(horario => {
      const horarioMinutos = horarioParaMinutos(horario);
      
      if (horarioMinutos >= inicioMinutos && horarioMinutos < fimMinutos) {
        horariosOcupados.add(horario);
      }
    });
  });

  return Array.from(horariosOcupados);
};

/**
 * ✅ ATUALIZADO: Verificar se um novo agendamento conflita com existentes OU bloqueios
 */
export const verificarConflitoHorario = (
  novoHorario,
  novaDuracao,
  agendamentos,
  servicos,
  profissionalId,
  data,
  agendamentoIdIgnorar = null
) => {
  const novoInicioMinutos = horarioParaMinutos(novoHorario);
  const novoFimMinutos = novoInicioMinutos + novaDuracao;

  // Filtrar agendamentos do profissional na data específica (incluindo bloqueios)
  const agendamentosDia = agendamentos.filter(ag => 
    ag.id !== agendamentoIdIgnorar &&
    ag.profissionalId === profissionalId &&
    ag.data === data &&
    ag.status !== 'cancelado'
  );

  // Verificar conflito com cada agendamento ou bloqueio
  for (const ag of agendamentosDia) {
    let agInicioMinutos, agFimMinutos;
    
    // Se for bloqueio
    if (ag.tipo === 'bloqueio' || ag.status === 'bloqueado') {
      agInicioMinutos = horarioParaMinutos(ag.horario);
      agFimMinutos = ag.horarioFim 
        ? horarioParaMinutos(ag.horarioFim)
        : agInicioMinutos + 30;
      
      const iniciaEmConflito = novoInicioMinutos >= agInicioMinutos && novoInicioMinutos < agFimMinutos;
      const terminaEmConflito = novoFimMinutos > agInicioMinutos && novoFimMinutos <= agFimMinutos;
      const englobaExistente = novoInicioMinutos <= agInicioMinutos && novoFimMinutos >= agFimMinutos;

      if (iniciaEmConflito || terminaEmConflito || englobaExistente) {
        return {
          conflito: true,
          tipo: 'bloqueio',
          motivo: ag.motivo || 'Horário bloqueado',
          agendamentoConflitante: ag
        };
      }
      continue;
    }
    
    // Se for agendamento normal
    const servico = servicos.find(s => s.id === ag.servicoId);
    if (!servico) continue;

    agInicioMinutos = horarioParaMinutos(ag.horario);
    agFimMinutos = agInicioMinutos + servico.duracao;

    const iniciaEmConflito = novoInicioMinutos >= agInicioMinutos && novoInicioMinutos < agFimMinutos;
    const terminaEmConflito = novoFimMinutos > agInicioMinutos && novoFimMinutos <= agFimMinutos;
    const englobaExistente = novoInicioMinutos <= agInicioMinutos && novoFimMinutos >= agFimMinutos;

    if (iniciaEmConflito || terminaEmConflito || englobaExistente) {
      return {
        conflito: true,
        tipo: 'agendamento',
        agendamentoConflitante: ag,
        servico
      };
    }
  }

  return { conflito: false };
};

/**
 * ✅ ATUALIZADO: Filtrar horários disponíveis considerando duração do serviço E bloqueios
 */
export const obterHorariosDisponiveisComDuracao = (
  todosHorarios,
  agendamentos,
  servicos,
  profissionalId,
  data,
  duracaoServicoMinutos,
  agendamentoIdIgnorar = null
) => {
  return todosHorarios.map(horario => {
    const resultado = verificarConflitoHorario(
      horario,
      duracaoServicoMinutos,
      agendamentos,
      servicos,
      profissionalId,
      data,
      agendamentoIdIgnorar
    );

    return {
      horario,
      disponivel: !resultado.conflito,
      motivoBloqueio: resultado.conflito ? resultado.motivo || 'Ocupado' : null
    };
  });
};

/**
 * Verificar se horário está disponível (DEPRECATED - usar verificarConflitoHorario)
 */
export const verificarHorarioDisponivel = (data, hora, agendamentos, profissionalId) => {
  return !agendamentos.some(agendamento => {
    if (agendamento.profissionalId !== profissionalId) return false;
    if (agendamento.data !== data) return false;
    if (agendamento.status === 'cancelado') return false;
    return agendamento.horario === hora;
  });
};

/**
 * Obter agendamentos por data
 */
export const getAgendamentosPorData = (agendamentos, data) => {
  return agendamentos.filter(ag => ag.data === data && ag.status !== 'cancelado');
};

/**
 * Obter dias no mês para calendário
 */
export const getDiasNoMes = (data) => {
  const ano = data.getFullYear();
  const mes = data.getMonth();
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const diasNoMes = ultimoDia.getDate();
  const diaDaSemanaInicio = primeiroDia.getDay();
  
  return { diasNoMes, diaDaSemanaInicio, ano, mes };
};

/**
 * Verificar se é hoje
 */
export const isHoje = (data) => {
  const hoje = new Date();
  return isSameDay(data, hoje);
};

/**
 * Formatação de duração
 */
export const formatarDuracao = (minutos) => {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  if (horas > 0 && mins > 0) return `${horas}h ${mins}min`;
  if (horas > 0) return `${horas}h`;
  return `${mins}min`;
};

/**
 * Status do agendamento com cores
 */
export const getStatusColor = (status) => {
  const cores = {
    confirmado: 'bg-green-100 text-green-800 border-green-300',
    pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    cancelado: 'bg-red-100 text-red-800 border-red-300',
    concluido: 'bg-blue-100 text-blue-800 border-blue-300',
    bloqueado: 'bg-gray-100 text-gray-800 border-gray-400'
  };
  return cores[status] || cores.pendente;
};