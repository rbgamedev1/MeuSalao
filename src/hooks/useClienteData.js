// src/hooks/useClienteData.js
import { useMemo, useContext } from 'react';
import { SalaoContext } from '../contexts/SalaoContext';

export const useClienteData = (cliente) => {
  const { agendamentos, transacoes, servicos, profissionais, historicoEmails } = useContext(SalaoContext);

  const agendamentosCliente = useMemo(() => {
    if (!cliente) return [];
    
    return agendamentos
      .filter(ag => ag.clienteId === cliente.id)
      .map(ag => ({
        ...ag,
        servico: servicos.find(s => s.id === ag.servicoId),
        profissional: profissionais.find(p => p.id === ag.profissionalId)
      }))
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      });
  }, [agendamentos, cliente, servicos, profissionais]);

  const comprasCliente = useMemo(() => {
    if (!cliente) return [];
    
    return transacoes
      .filter(t => 
        t.tipo === 'receita' && 
        (t.cliente === cliente.nome || t.clienteId === cliente.id) &&
        (t.categoria === 'Venda de Produtos' || 
         t.categoria === 'Serviços' ||
         t.descricao?.includes('Venda Caixa'))
      )
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      });
  }, [transacoes, cliente]);

  const emailsCliente = useMemo(() => {
    if (!cliente || !historicoEmails || historicoEmails.length === 0) return [];
    
    return historicoEmails
      .filter(email => 
        email.clienteNome === cliente.nome || 
        email.clienteEmail === cliente.email ||
        email.clienteId === cliente.id
      )
      .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));
  }, [historicoEmails, cliente]);

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
    const agendamentosConcluidos = agendamentosCliente.filter(ag => ag.status === 'concluido').length;
    const agendamentosCancelados = agendamentosCliente.filter(ag => ag.status === 'cancelado').length;
    const totalGastoAgendamentos = agendamentosCliente
      .filter(ag => ag.status === 'concluido')
      .reduce((acc, ag) => acc + (ag.servico?.valor || 0), 0);
    const totalGastoCompras = comprasCliente.reduce((acc, c) => acc + c.valor, 0);
    const totalGeral = totalGastoAgendamentos + totalGastoCompras;
    const ticketMedio = agendamentosConcluidos > 0 ? totalGeral / agendamentosConcluidos : 0;

    return {
      totalAgendamentos,
      agendamentosConcluidos,
      agendamentosCancelados,
      totalGastoAgendamentos,
      totalGastoCompras,
      totalGeral,
      ticketMedio
    };
  }, [agendamentosCliente, comprasCliente, cliente]);

  return {
    agendamentosCliente,
    comprasCliente,
    emailsCliente,
    stats
  };
};