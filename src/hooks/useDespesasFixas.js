// src/hooks/useDespesasFixas.js - COMPLETO
import { useState } from 'react';
import { getTodayBR } from '../utils/masks';

export const useDespesasFixas = (salaoAtual, despesasFixas, setDespesasFixas) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    tipo: 'Aluguel',
    descricao: '',
    valor: '',
    diaVencimento: '5',
    formaPagamento: 'Boleto',
    fornecedor: '',
    observacoes: '',
    ativa: true,
    salaoId: salaoAtual.id
  });

  const tiposDespesasFixas = [
    { valor: 'Aluguel', icon: '🏢' },
    { valor: 'Água', icon: '💧' },
    { valor: 'Energia', icon: '⚡' },
    { valor: 'Telefone/Internet', icon: '📞' },
    { valor: 'Salários', icon: '💰' },
    { valor: 'Contador', icon: '📊' },
    { valor: 'Seguro', icon: '🛡️' },
    { valor: 'Assinatura/Software', icon: '💻' },
    { valor: 'Limpeza', icon: '🧹' },
    { valor: 'Outros', icon: '📝' }
  ];

  const resetForm = () => {
    setFormData({
      tipo: 'Aluguel',
      descricao: '',
      valor: '',
      diaVencimento: '5',
      formaPagamento: 'Boleto',
      fornecedor: '',
      observacoes: '',
      ativa: true,
      salaoId: salaoAtual.id
    });
  };

  const handleOpenModal = (despesa = null) => {
    if (despesa) {
      setEditingId(despesa.id);
      setFormData({
        tipo: despesa.tipo,
        descricao: despesa.descricao,
        valor: despesa.valor.toString(),
        diaVencimento: despesa.diaVencimento.toString(),
        formaPagamento: despesa.formaPagamento,
        fornecedor: despesa.fornecedor || '',
        observacoes: despesa.observacoes || '',
        ativa: despesa.ativa,
        salaoId: despesa.salaoId
      });
    } else {
      setEditingId(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const despesa = {
      id: editingId || Math.max(...despesasFixas.map(d => d.id), 0) + 1,
      ...formData,
      valor: parseFloat(formData.valor),
      diaVencimento: parseInt(formData.diaVencimento),
      dataCriacao: getTodayBR()
    };

    if (editingId) {
      setDespesasFixas(despesasFixas.map(d => 
        d.id === editingId ? despesa : d
      ));
    } else {
      setDespesasFixas([...despesasFixas, despesa]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta despesa fixa?')) {
      setDespesasFixas(despesasFixas.filter(d => d.id !== id));
    }
  };

  const toggleAtiva = (id) => {
    setDespesasFixas(despesasFixas.map(d => 
      d.id === id ? { ...d, ativa: !d.ativa } : d
    ));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gerar transações das despesas fixas para o mês atual
  const gerarTransacoesMesAtual = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const despesasAtivasSalao = despesasFixas.filter(d => 
      d.ativa && d.salaoId === salaoAtual.id
    );

    const transacoesGeradas = despesasAtivasSalao.map(despesa => {
      const dataVencimento = new Date(anoAtual, mesAtual, despesa.diaVencimento);
      const dataVencimentoBR = dataVencimento.toLocaleDateString('pt-BR');

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

    return transacoesGeradas;
  };

  return {
    showModal,
    editingId,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleChange,
    toggleAtiva,
    tiposDespesasFixas,
    gerarTransacoesMesAtual
  };
};