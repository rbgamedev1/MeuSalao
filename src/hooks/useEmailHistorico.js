// src/hooks/useEmailHistorico.js
import { useContext } from 'react';
import { SalaoContext } from '../contexts/SalaoContext';

/**
 * Hook para gerenciar histórico de emails enviados
 * Registra todos os emails enviados aos clientes
 */
export const useEmailHistorico = () => {
  const { salaoAtual } = useContext(SalaoContext);

  /**
   * Registra um email enviado no histórico
   * @param {Object} emailData - Dados do email
   * @param {string} emailData.clienteId - ID do cliente
   * @param {string} emailData.clienteNome - Nome do cliente
   * @param {string} emailData.clienteEmail - Email do cliente
   * @param {string} emailData.tipo - Tipo: 'confirmacao', 'cancelamento', 'alteracao', 'avaliacao', 'aniversario'
   * @param {string} emailData.assunto - Assunto do email
   * @param {string} [emailData.agendamentoId] - ID do agendamento relacionado (se aplicável)
   * @param {string} [emailData.status] - Status: 'enviado', 'falhado', 'pendente'
   * @param {string} [emailData.erro] - Mensagem de erro (se houver)
   */
  const registrarEmail = (emailData) => {
    try {
      // Buscar histórico existente
      const historicoKey = `emailHistorico_${salaoAtual.id}`;
      const historicoExistente = JSON.parse(localStorage.getItem(historicoKey) || '[]');

      // Criar novo registro
      const novoEmail = {
        id: Date.now().toString(),
        clienteId: emailData.clienteId,
        clienteNome: emailData.clienteNome,
        clienteEmail: emailData.clienteEmail,
        tipo: emailData.tipo,
        assunto: emailData.assunto,
        agendamentoId: emailData.agendamentoId || null,
        status: emailData.status || 'enviado',
        erro: emailData.erro || null,
        dataEnvio: new Date().toISOString(),
        salaoId: salaoAtual.id
      };

      // Adicionar ao histórico
      const novoHistorico = [novoEmail, ...historicoExistente];

      // Limitar a 1000 emails para não sobrecarregar localStorage
      const historicoLimitado = novoHistorico.slice(0, 1000);

      // Salvar
      localStorage.setItem(historicoKey, JSON.stringify(historicoLimitado));

      console.log('✅ Email registrado no histórico:', novoEmail);
      return novoEmail;
    } catch (error) {
      console.error('❌ Erro ao registrar email no histórico:', error);
      return null;
    }
  };

  /**
   * Busca histórico de emails de um cliente específico
   * @param {string} clienteId - ID do cliente
   */
  const buscarEmailsCliente = (clienteId) => {
    try {
      const historicoKey = `emailHistorico_${salaoAtual.id}`;
      const historico = JSON.parse(localStorage.getItem(historicoKey) || '[]');
      return historico.filter(email => email.clienteId === clienteId);
    } catch (error) {
      console.error('❌ Erro ao buscar emails do cliente:', error);
      return [];
    }
  };

  /**
   * Busca todo o histórico de emails do salão
   */
  const buscarTodosEmails = () => {
    try {
      const historicoKey = `emailHistorico_${salaoAtual.id}`;
      return JSON.parse(localStorage.getItem(historicoKey) || '[]');
    } catch (error) {
      console.error('❌ Erro ao buscar histórico de emails:', error);
      return [];
    }
  };

  /**
   * Limpa todo o histórico de emails (use com cuidado!)
   */
  const limparHistorico = () => {
    try {
      const historicoKey = `emailHistorico_${salaoAtual.id}`;
      localStorage.removeItem(historicoKey);
      console.log('✅ Histórico de emails limpo');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar histórico:', error);
      return false;
    }
  };

  return {
    registrarEmail,
    buscarEmailsCliente,
    buscarTodosEmails,
    limparHistorico
  };
};