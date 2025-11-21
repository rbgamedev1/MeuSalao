// src/hooks/useClienteData.js - CORREÇÃO COMPLETA FINAL
import { useMemo, useContext } from 'react';
import { SalaoContext } from '../contexts/SalaoContext';

export const useClienteData = (cliente) => {
  const { 
    agendamentos = [],
    transacoes = [], // ✅ Nome correto: "transacoes" (não "transacoesCaixa")
    salaoAtual,
    getAgendamentosPorSalao,
    getTransacoesPorSalao
  } = useContext(SalaoContext) || {};

  // Usar os métodos getter se disponíveis
  const allAgendamentos = getAgendamentosPorSalao ? getAgendamentosPorSalao() : agendamentos;
  const allTransacoes = getTransacoesPorSalao ? getTransacoesPorSalao() : transacoes;

  // Agendamentos do cliente
  const agendamentosCliente = useMemo(() => {
    if (!cliente || !allAgendamentos) return [];
    return allAgendamentos
      .filter(ag => ag.clienteId === cliente.id)
      .sort((a, b) => {
        try {
          const [diaA, mesA, anoA] = a.data.split('/');
          const [diaB, mesB, anoB] = b.data.split('/');
          const dataA = new Date(anoA, mesA - 1, diaA);
          const dataB = new Date(anoB, mesB - 1, diaB);
          return dataB - dataA;
        } catch (error) {
          return 0;
        }
      });
  }, [cliente, allAgendamentos]);

  // ✅ CORREÇÃO: Compras do caixa do cliente
  const comprasCliente = useMemo(() => {
    if (!cliente || !allTransacoes) return [];
    
    console.log('🔍 Buscando compras para cliente:', cliente.nome, cliente.id);
    console.log('📦 Total de transações:', allTransacoes.length);
    
    // Filtrar transações do cliente
    const transacoesCliente = allTransacoes.filter(t => {
      // ✅ Verificar múltiplas formas de identificar o cliente
      const matchClienteId = t.clienteId === cliente.id;
      const matchClienteNome = t.cliente && t.cliente.toLowerCase() === cliente.nome.toLowerCase();
      const matchClienteName = t.clienteNome && t.clienteNome.toLowerCase() === cliente.nome.toLowerCase();
      
      // ✅ Verificar se é uma receita (venda do caixa)
      const isReceita = t.tipo === 'receita' || t.tipo === 'entrada';
      
      const match = (matchClienteId || matchClienteNome || matchClienteName) && isReceita;
      
      if (match) {
        console.log('✅ Transação encontrada:', t);
      }
      
      return match;
    });
    
    console.log('📊 Compras encontradas:', transacoesCliente.length);
    
    return transacoesCliente.sort((a, b) => {
      try {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      } catch (error) {
        return 0;
      }
    });
  }, [cliente, allTransacoes]);

  // ✅ Emails do cliente - buscar do localStorage
  const emailsCliente = useMemo(() => {
    if (!cliente || !salaoAtual) return [];
    
    try {
      const historicoKey = `emailHistorico_${salaoAtual.id}`;
      const historicoStorage = localStorage.getItem(historicoKey);
      
      if (!historicoStorage) return [];
      
      const historico = JSON.parse(historicoStorage);
      
      return historico
        .filter(email => email.clienteId === cliente.id)
        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));
        
    } catch (error) {
      console.error('Erro ao carregar emails do cliente:', error);
      return [];
    }
  }, [cliente, salaoAtual]);

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
    
    const totalGastoCompras = comprasCliente.reduce((acc, c) => acc + (c.valor || 0), 0);
    const totalGeral = totalGastoAgendamentos + totalGastoCompras;
    const ticketMedio = agendamentosConcluidos > 0 
      ? totalGastoAgendamentos / agendamentosConcluidos 
      : 0;

    console.log('📊 Stats calculadas:', {
      totalAgendamentos,
      agendamentosConcluidos,
      totalGastoAgendamentos,
      totalGastoCompras,
      totalGeral
    });

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