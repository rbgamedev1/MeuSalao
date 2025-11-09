// src/hooks/useDespesasFixas.js - CORRIGIDO FINAL
import { useState, useEffect } from 'react';
import { getTodayBR } from '../utils/masks';

export const useDespesasFixas = (salaoAtual, despesasFixas, setDespesasFixas, transacoes, setTransacoes) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const getInitialFormData = () => ({
    tipo: 'Aluguel',
    descricao: '',
    valor: '',
    diaVencimento: '5',
    formaPagamento: 'Boleto',
    fornecedor: '',
    observacoes: '',
    ativa: true,
    salaoId: salaoAtual?.id || ''
  });

  const [formData, setFormData] = useState(getInitialFormData());

  // Atualizar salaoId quando mudar
  useEffect(() => {
    if (salaoAtual?.id) {
      setFormData(prev => ({
        ...prev,
        salaoId: salaoAtual.id
      }));
    }
  }, [salaoAtual?.id]);

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
    setFormData(getInitialFormData());
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

  // Gerar transação da despesa fixa para o mês atual
  const gerarTransacaoMesAtual = (despesa) => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const dataVencimento = new Date(anoAtual, mesAtual, despesa.diaVencimento);
    const dataVencimentoBR = dataVencimento.toLocaleDateString('pt-BR');

    const transacaoId = `fixa-${despesa.id}-${mesAtual}-${anoAtual}`;

    return {
      id: transacaoId,
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
      // Editando despesa existente
      setDespesasFixas(despesasFixas.map(d => 
        d.id === editingId ? despesa : d
      ));

      // Atualizar transação gerada desta despesa fixa (se existir)
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      const transacaoId = `fixa-${editingId}-${mesAtual}-${anoAtual}`;
      
      const transacaoAtualizada = gerarTransacaoMesAtual(despesa);
      
      setTransacoes(transacoes.map(t => 
        t.id === transacaoId ? transacaoAtualizada : t
      ));
    } else {
      // Nova despesa fixa
      setDespesasFixas([...despesasFixas, despesa]);
      
      // Gerar transação para o mês atual se estiver ativa
      if (despesa.ativa) {
        const novaTransacao = gerarTransacaoMesAtual(despesa);
        setTransacoes([...transacoes, novaTransacao]);
      }
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta despesa fixa? A transação gerada para este mês também será removida.')) {
      // Remover despesa fixa
      setDespesasFixas(despesasFixas.filter(d => d.id !== id));
      
      // Remover transação gerada desta despesa fixa no mês atual
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();
      const transacaoId = `fixa-${id}-${mesAtual}-${anoAtual}`;
      
      setTransacoes(transacoes.filter(t => t.id !== transacaoId));
    }
  };

  const toggleAtiva = (id) => {
    const despesa = despesasFixas.find(d => d.id === id);
    const novoEstado = !despesa.ativa;
    
    // Atualizar estado da despesa
    setDespesasFixas(despesasFixas.map(d => 
      d.id === id ? { ...d, ativa: novoEstado } : d
    ));

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const transacaoId = `fixa-${id}-${mesAtual}-${anoAtual}`;

    if (novoEstado) {
      // Reativando: criar transação se não existir
      const transacaoExiste = transacoes.some(t => t.id === transacaoId);
      if (!transacaoExiste) {
        const despesaAtualizada = { ...despesa, ativa: true };
        const novaTransacao = gerarTransacaoMesAtual(despesaAtualizada);
        setTransacoes([...transacoes, novaTransacao]);
      }
    } else {
      // Pausando: remover transação pendente
      setTransacoes(transacoes.filter(t => 
        !(t.id === transacaoId && t.status === 'pendente')
      ));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    tiposDespesasFixas
  };
};