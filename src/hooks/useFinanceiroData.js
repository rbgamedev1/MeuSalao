// ============================================
// 1. src/hooks/useFinanceiroData.js
// ============================================
import { useMemo } from 'react';
import { dateToISO } from '../utils/masks';

export const useFinanceiroData = (transacoesSalao, periodo) => {
  // Função para filtrar por período
  const filtrarPorPeriodo = (transacoes) => {
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
    return transacoes.filter(t => {
      const dataTransacao = new Date(dateToISO(t.data).split('-').join('/'));
      
      switch (periodo) {
        case 'dia':
          return dataTransacao >= inicioHoje;
        
        case 'semana':
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          inicioSemana.setHours(0, 0, 0, 0);
          return dataTransacao >= inicioSemana;
        
        case 'mes':
          const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          return dataTransacao >= inicioMes;
        
        case 'ano':
          const inicioAno = new Date(hoje.getFullYear(), 0, 1);
          return dataTransacao >= inicioAno;
        
        default:
          return true;
      }
    });
  };

  // Transações filtradas por período
  const transacoesFiltradas = useMemo(() => {
    return filtrarPorPeriodo(transacoesSalao);
  }, [transacoesSalao, periodo]);

  // Calcular totais
  const totalReceitas = useMemo(() => {
    return transacoesFiltradas
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + t.valor, 0);
  }, [transacoesFiltradas]);

  const totalDespesas = useMemo(() => {
    return transacoesFiltradas
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + t.valor, 0);
  }, [transacoesFiltradas]);

  const saldo = totalReceitas - totalDespesas;

  // Calcular ticket médio
  const ticketMedio = useMemo(() => {
    const receitas = transacoesFiltradas.filter(t => t.tipo === 'receita');
    if (receitas.length === 0) return 0;
    return totalReceitas / receitas.length;
  }, [transacoesFiltradas, totalReceitas]);

  // Dados de fluxo de caixa
  const fluxoCaixaData = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dataAtual = new Date();
    const dados = [];

    let periodos = 6;
    if (periodo === 'dia' || periodo === 'semana') periodos = 7;
    if (periodo === 'mes') periodos = 6;
    if (periodo === 'ano') periodos = 12;

    for (let i = periodos - 1; i >= 0; i--) {
      let label, dataInicio, dataFim;

      if (periodo === 'dia') {
        const data = new Date(dataAtual);
        data.setDate(dataAtual.getDate() - i);
        label = `${data.getDate()}/${data.getMonth() + 1}`;
        dataInicio = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        dataFim = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 1);
      } else if (periodo === 'semana') {
        const data = new Date(dataAtual);
        data.setDate(dataAtual.getDate() - (i * 7));
        label = `Sem ${periodos - i}`;
        dataInicio = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        dataFim = new Date(data.getFullYear(), data.getMonth(), data.getDate() + 7);
      } else if (periodo === 'ano') {
        const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
        label = meses[data.getMonth()];
        dataInicio = new Date(data.getFullYear(), data.getMonth(), 1);
        dataFim = new Date(data.getFullYear(), data.getMonth() + 1, 1);
      } else {
        const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
        label = meses[data.getMonth()];
        dataInicio = new Date(data.getFullYear(), data.getMonth(), 1);
        dataFim = new Date(data.getFullYear(), data.getMonth() + 1, 1);
      }

      const receita = transacoesSalao
        .filter(t => {
          if (t.tipo !== 'receita') return false;
          const dataTransacao = new Date(dateToISO(t.data).split('-').join('/'));
          return dataTransacao >= dataInicio && dataTransacao < dataFim;
        })
        .reduce((sum, t) => sum + t.valor, 0);

      const despesa = transacoesSalao
        .filter(t => {
          if (t.tipo !== 'despesa') return false;
          const dataTransacao = new Date(dateToISO(t.data).split('-').join('/'));
          return dataTransacao >= dataInicio && dataTransacao < dataFim;
        })
        .reduce((sum, t) => sum + t.valor, 0);

      dados.push({ mes: label, receita, despesa });
    }

    return dados;
  }, [transacoesSalao, periodo]);

  // Distribuição de despesas por categoria
  const categoriasDespesas = useMemo(() => {
    const categorias = {};
    const despesas = transacoesFiltradas.filter(t => t.tipo === 'despesa');
    
    if (despesas.length === 0) return [];

    despesas.forEach(t => {
      if (!categorias[t.categoria]) {
        categorias[t.categoria] = 0;
      }
      categorias[t.categoria] += t.valor;
    });

    const totalDespesas = Object.values(categorias).reduce((a, b) => a + b, 0);
    const cores = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

    return Object.entries(categorias).map(([name, valor], index) => ({
      name,
      value: Math.round((valor / totalDespesas) * 100),
      color: cores[index % cores.length]
    }));
  }, [transacoesFiltradas]);

  return {
    transacoesFiltradas,
    totalReceitas,
    totalDespesas,
    saldo,
    ticketMedio,
    fluxoCaixaData,
    categoriasDespesas
  };
};