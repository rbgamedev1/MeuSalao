// src/hooks/useTransacaoForm.js - CORRIGIDO
import { useState, useEffect } from 'react';
import { getTodayBR } from '../utils/masks';

export const useTransacaoForm = (salaoAtual, transacoes, setTransacoes) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const getInitialFormData = () => ({
    tipo: 'receita',
    descricao: '',
    categoria: '',
    valor: '',
    formaPagamento: '',
    data: getTodayBR(),
    cliente: '',
    fornecedor: '',
    status: 'pago',
    salaoId: salaoAtual?.id || '',
    observacoes: ''
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

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  const handleOpenModal = (transacao = null) => {
    if (transacao) {
      // Editando transação existente
      setEditingId(transacao.id);
      setFormData({
        tipo: transacao.tipo,
        descricao: transacao.descricao,
        categoria: transacao.categoria,
        valor: transacao.valor.toString(),
        formaPagamento: transacao.formaPagamento,
        data: transacao.data,
        cliente: transacao.cliente || '',
        fornecedor: transacao.fornecedor || '',
        status: transacao.status,
        salaoId: transacao.salaoId,
        observacoes: transacao.observacoes || ''
      });
    } else {
      // Nova transação - mantém o tipo que foi setado antes de chamar handleOpenModal
      setEditingId(null);
      // NÃO reseta o form aqui, pois o tipo já foi setado no componente pai
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
    
    const transacao = {
      id: editingId || Math.max(...transacoes.map(t => t.id), 0) + 1,
      ...formData,
      valor: parseFloat(formData.valor),
      dataCriacao: getTodayBR(),
      dataVencimento: null
    };

    if (editingId) {
      setTransacoes(transacoes.map(t => 
        t.id === editingId ? transacao : t
      ));
    } else {
      setTransacoes([...transacoes, transacao]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransacoes(transacoes.filter(t => t.id !== id));
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
    handleChange
  };
};