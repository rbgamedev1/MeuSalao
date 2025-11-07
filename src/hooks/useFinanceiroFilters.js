// ============================================
// 2. src/hooks/useFinanceiroFilters.js
// ============================================
import { useState, useMemo } from 'react';
import { dateToISO, compareDates } from '../utils/masks';

export const useFinanceiroFilters = (transacoesFiltradas) => {
  const [tipoTransacao, setTipoTransacao] = useState('todas');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    categoria: '',
    status: '',
    formaPagamento: '',
    busca: ''
  });

  const filteredTransacoes = useMemo(() => {
    return transacoesFiltradas.filter(t => {
      // Filtro por tipo
      if (tipoTransacao !== 'todas' && t.tipo !== tipoTransacao) return false;
      
      // Filtro por categoria
      if (filtros.categoria && t.categoria !== filtros.categoria) return false;
      
      // Filtro por status
      if (filtros.status && t.status !== filtros.status) return false;
      
      // Filtro por forma de pagamento
      if (filtros.formaPagamento && t.formaPagamento !== filtros.formaPagamento) return false;
      
      // Filtro por data início
      if (filtros.dataInicio) {
        const dataTransacao = dateToISO(t.dataVencimento || t.data);
        const dataInicio = dateToISO(filtros.dataInicio);
        if (compareDates(dataTransacao, dataInicio) < 0) return false;
      }
      
      // Filtro por data fim
      if (filtros.dataFim) {
        const dataTransacao = dateToISO(t.dataVencimento || t.data);
        const dataFim = dateToISO(filtros.dataFim);
        if (compareDates(dataTransacao, dataFim) > 0) return false;
      }
      
      // Filtro por busca
      if (filtros.busca) {
        const busca = filtros.busca.toLowerCase();
        const descricao = t.descricao?.toLowerCase() || '';
        const cliente = t.cliente?.toLowerCase() || '';
        const fornecedor = t.fornecedor?.toLowerCase() || '';
        
        if (!descricao.includes(busca) && !cliente.includes(busca) && !fornecedor.includes(busca)) {
          return false;
        }
      }
      
      return true;
    });
  }, [transacoesFiltradas, tipoTransacao, filtros]);

  const limparFiltros = () => {
    setFiltros({
      dataInicio: '',
      dataFim: '',
      categoria: '',
      status: '',
      formaPagamento: '',
      busca: ''
    });
  };

  return {
    tipoTransacao,
    setTipoTransacao,
    showFilters,
    setShowFilters,
    filtros,
    setFiltros,
    filteredTransacoes,
    limparFiltros
  };
};