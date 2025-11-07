// ============================================
// 3. src/hooks/useTransacaoForm.js
// ============================================
import { useState } from 'react';
import { getTodayBR, addDays, addMonths } from '../utils/masks';

export const useTransacaoForm = (salaoAtual, transacoes, setTransacoes) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    categoria: '',
    valor: '',
    formaPagamento: '',
    data: '',
    dataVencimento: '',
    cliente: '',
    fornecedor: '',
    status: 'pendente',
    salaoId: salaoAtual.id,
    recorrente: false,
    tipoRecorrencia: 'mensal',
    quantidadeParcelas: 1,
    observacoes: ''
  });

  const resetForm = () => {
    setFormData({
      tipo: 'receita',
      descricao: '',
      categoria: '',
      valor: '',
      formaPagamento: '',
      data: getTodayBR(),
      dataVencimento: '',
      cliente: '',
      fornecedor: '',
      status: 'pendente',
      salaoId: salaoAtual.id,
      recorrente: false,
      tipoRecorrencia: 'mensal',
      quantidadeParcelas: 1,
      observacoes: ''
    });
  };

  const handleOpenModal = (transacao = null) => {
    if (transacao) {
      setEditingId(transacao.id);
      setFormData({
        tipo: transacao.tipo,
        descricao: transacao.descricao,
        categoria: transacao.categoria,
        valor: transacao.valor.toString(),
        formaPagamento: transacao.formaPagamento,
        data: transacao.data,
        dataVencimento: transacao.dataVencimento || '',
        cliente: transacao.cliente || '',
        fornecedor: transacao.fornecedor || '',
        status: transacao.status,
        salaoId: transacao.salaoId,
        recorrente: transacao.recorrente || false,
        tipoRecorrencia: transacao.tipoRecorrencia || 'mensal',
        quantidadeParcelas: transacao.quantidadeParcelas || 1,
        observacoes: transacao.observacoes || ''
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
    
    const baseTransacao = {
      ...formData,
      id: editingId || Math.max(...transacoes.map(t => t.id), 0) + 1,
      valor: parseFloat(formData.valor),
      dataCriacao: getTodayBR()
    };

    if (editingId) {
      setTransacoes(transacoes.map(t => 
        t.id === editingId ? baseTransacao : t
      ));
    } else {
      const novasTransacoes = [baseTransacao];
      
      // Gerar transações recorrentes
      if (formData.recorrente && formData.quantidadeParcelas > 1) {
        let dataBase = formData.dataVencimento || formData.data;
        
        for (let i = 1; i < formData.quantidadeParcelas; i++) {
          if (formData.tipoRecorrencia === 'mensal') {
            dataBase = addMonths(dataBase, 1);
          } else if (formData.tipoRecorrencia === 'semanal') {
            dataBase = addDays(dataBase, 7);
          } else if (formData.tipoRecorrencia === 'anual') {
            dataBase = addMonths(dataBase, 12);
          }
          
          novasTransacoes.push({
            ...baseTransacao,
            id: Math.max(...transacoes.map(t => t.id), 0) + i + 1,
            data: dataBase,
            dataVencimento: dataBase,
            descricao: `${formData.descricao} (${i + 1}/${formData.quantidadeParcelas})`,
            parcelaAtual: i + 1,
            totalParcelas: formData.quantidadeParcelas
          });
        }
        
        novasTransacoes[0].descricao = `${formData.descricao} (1/${formData.quantidadeParcelas})`;
        novasTransacoes[0].parcelaAtual = 1;
        novasTransacoes[0].totalParcelas = formData.quantidadeParcelas;
      }
      
      setTransacoes([...transacoes, ...novasTransacoes]);
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