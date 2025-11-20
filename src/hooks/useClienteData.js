// src/hooks/useClienteData.js
import { useMemo, useContext } from 'react';
import { SalaoContext } from '../contexts/SalaoContext';

export const useClienteData = (cliente) => {
  const { agendamentos, transacoesCaixa, emailsEnviados } = useContext(SalaoContext);

  // Agendamentos do cliente
  const agendamentosCliente = useMemo(() => {
    if (!cliente) return [];
    return agendamentos
      .filter(ag => ag.clienteId === cliente.id)
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      });
  }, [cliente, agendamentos]);

  // Compras do caixa do cliente
  const comprasCliente = useMemo(() => {
    if (!cliente) return [];
    return transacoesCaixa
      .filter(t => t.clienteId === cliente.id && t.tipo === 'entrada')
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      });
  }, [cliente, transacoesCaixa]);

  // Emails enviados ao cliente
  const emailsCliente = useMemo(() => {
    if (!cliente) return [];
    return emailsEnviados
      .filter(email => email.clienteEmail === cliente.email)
      .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));
  }, [cliente, emailsEnviados]);

  // Estatísticas
  const stats = useMemo(() => {
    if (!cliente) {
      return {
        totalAgendamentos: 0,
        agendamentosConcluidos: 0,
        agendamentosCancelados: 0,
        totalGastoAgendamentos: 0,
        totalGastoCompras: 0,
        totalGeral: 0,
        ticketMedio: 0
      };
    }

    const totalAgendamentos = agendamentosCliente.length;
    const agendamentosConcluidos = agendamentosCliente.filter(a => a.status === 'concluido').length;
    const agendamentosCancelados = agendamentosCliente.filter(a => a.status === 'cancelado').length;
    
    const totalGastoAgendamentos = agendamentosCliente
      .filter(a => a.status === 'concluido')
      .reduce((acc, a) => acc + (a.servico?.valor || 0), 0);
    
    const totalGastoCompras = comprasCliente.reduce((acc, c) => acc + c.valor, 0);
    const totalGeral = totalGastoAgendamentos + totalGastoCompras;
    const ticketMedio = agendamentosConcluidos > 0 
      ? totalGastoAgendamentos / agendamentosConcluidos 
      : 0;

    return {
      totalAgendamentos,
      agendamentosConcluidos,
      agendamentosCancelados,
      totalGastoAgendamentos,
      totalGastoCompras,
      totalGeral,
      ticketMedio
    };
  }, [cliente, agendamentosCliente, comprasCliente]);

  return {
    agendamentosCliente,
    comprasCliente,
    emailsCliente,
    stats
  };
};