// src/hooks/useFinanceiroData.js - COMPLETO ATUALIZADO
import { useMemo } from 'react';
import { dateToISO } from '../utils/masks';

export const useFinanceiroData = (transacoesSalao, despesasFixasSalao, periodo) => {
  // Gerar transações das despesas fixas do mês atual
  const transacoesDespesasFixas = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const despesasAtivas = despesasFixasSalao.filter(d => d.ativa);

    return despesasAtivas.map(despesa => {
      const dataVencimento = new Date(anoAtual, mesAtual, despesa.diaVencimento);
      const dataVencimentoBR = dataVencimento.toLocaleDateString('pt-BR');
      
      // Verificar se já venceu
      const hoje = new Date();
      const venceu = dataVencimento < hoje;

      return {
        id: `fixa-${despesa.id}-${mesAtual}-${anoAtual}`,
        tipo: 'despesa',
        descricao: `${despesa.tipo}${despesa.descricao ? ` - ${despesa.descricao}` : ''}`,
        categoria: 'Fixas',
        valor: despesa.valor,
        formaPagamento: despesa.formaPagamento,
        data: dataVencimentoBR,
        dataVencimento: dataVencimentoBR,
        fornecedor: despesa.fornecedor,
        status: 'pendente',
        salaoId: despesa.salaoId,
        despesaFixaId: despesa.id,
        observacoes: despesa.observacoes,
        ehDespesaFixa: true
      };
    });
  }, [despesasFixasSalao]);

  // Combinar transações normais com despesas fixas
  const todasTransacoes = useMemo(() => {
    return [...transacoesSalao, ...transacoesDespesasFixas];
  }, [transacoesSalao, transacoesDespesasFixas]);

  // Função para filtrar por período
  const filtrarPorPeriodo = (transacoes) => {
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
    return transacoes.filter(t => {
      // Para despesas fixas, só considerar se estiver no mês atual
      if (t.ehDespesaFixa) {
        const dataVencimento = new Date(dateToISO(t.dataVencimento).split('-').join('/'));
        const mesVencimento = dataVencimento.getMonth();
        const anoVencimento = dataVencimento.getFullYear();
        return mesVencimento === hoje.getMonth() && anoVencimento === hoje.getFullYear();
      }

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
    return filtrarPorPeriodo(todasTransacoes);
  }, [todasTransacoes, periodo]);

  // Calcular totais (apenas transações pagas/recebidas)
  const totalReceitas = useMemo(() => {
    return transacoesFiltradas
      .filter(t => t.tipo === 'receita' && (t.status === 'recebido' || t.status === 'pago'))
      .reduce((acc, t) => acc + t.valor, 0);
  }, [transacoesFiltradas]);

  const totalDespesas = useMemo(() => {
    return transacoesFiltradas
      .filter(t => t.tipo === 'despesa' && t.status === 'pago')
      .reduce((acc, t) => acc + t.valor, 0);
  }, [transacoesFiltradas]);

  const saldo = totalReceitas - totalDespesas;

  // Calcular ticket médio
  const ticketMedio = useMemo(() => {
    const receitas = transacoesFiltradas.filter(t => 
      t.tipo === 'receita' && (t.status === 'recebido' || t.status === 'pago')
    );
    if (receitas.length === 0) return 0;
    return totalReceitas / receitas.length;
  }, [transacoesFiltradas, totalReceitas]);

  // Dados de fluxo de caixa (últimos 6 meses)
  const fluxoCaixaData = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dados = [];
    const hoje = new Date();

    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesLabel = meses[data.getMonth()];
      const dataInicio = new Date(data.getFullYear(), data.getMonth(), 1);
      const dataFim = new Date(data.getFullYear(), data.getMonth() + 1, 1);

      const receita = todasTransacoes
        .filter(t => {
          if (t.tipo !== 'receita') return false;
          if (t.status !== 'recebido' && t.status !== 'pago') return false;
          const dataTransacao = new Date(dateToISO(t.data).split('-').join('/'));
          return dataTransacao >= dataInicio && dataTransacao < dataFim;
        })
        .reduce((sum, t) => sum + t.valor, 0);

      const despesa = todasTransacoes
        .filter(t => {
          if (t.tipo !== 'despesa') return false;
          if (t.status !== 'pago') return false;
          const dataTransacao = new Date(dateToISO(t.data).split('-').join('/'));
          return dataTransacao >= dataInicio && dataTransacao < dataFim;
        })
        .reduce((sum, t) => sum + t.valor, 0);

      dados.push({ mes: mesLabel, receita, despesa });
    }

    return dados;
  }, [todasTransacoes]);

  // Distribuição de despesas por categoria (apenas pagas)
  const categoriasDespesas = useMemo(() => {
    const categorias = {};
    const despesas = transacoesFiltradas.filter(t => 
      t.tipo === 'despesa' && t.status === 'pago'
    );
    
    if (despesas.length === 0) return [];

    despesas.forEach(t => {
      if (!categorias[t.categoria]) {
        categorias[t.categoria] = 0;
      }
      categorias[t.categoria] += t.valor;
    });

    const totalDespesasPorCategoria = Object.values(categorias).reduce((a, b) => a + b, 0);
    const cores = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

    return Object.entries(categorias).map(([name, valor], index) => ({
      name,
      value: Math.round((valor / totalDespesasPorCategoria) * 100),
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