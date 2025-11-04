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
 * Verifica se horário está disponível
 */
export /**
 * Verifica se horário está disponível
 */
const verificarHorarioDisponivel = (data, hora, agendamentos, profissionalId) => {
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
    concluido: 'bg-blue-100 text-blue-800 border-blue-300'
  };
  return cores[status] || cores.pendente;
}