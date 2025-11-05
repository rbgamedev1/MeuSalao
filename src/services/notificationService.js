// src/services/notificationService.js - ATUALIZADO COM NOVOS NÍVEIS

import mailgunService from './mailgunService';
import { hasNotificationAccess, getAvailableNotifications } from '../utils/planRestrictions';

class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.isRunning = false;
    this.lastCheckTime = null;
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Serviço já está rodando');
      return;
    }
    
    this.isRunning = true;
    console.log('🔔 Serviço de notificações iniciado');

    this.checkInterval = setInterval(() => {
      this.checkAvaliacoesPendentes();
    }, 60 * 60 * 1000); // 1 hora
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    this.lastCheckTime = null;
    console.log('🔕 Serviço de notificações parado');
  }

  /**
   * Verificar se o plano permite enviar uma notificação
   */
  canSendNotification(salaoPlano, tipoNotificacao) {
    const hasAccess = hasNotificationAccess(salaoPlano, tipoNotificacao);
    
    if (!hasAccess) {
      console.log(`⛔ Plano ${salaoPlano} não permite: ${tipoNotificacao}`);
    }
    
    return hasAccess;
  }

  getAvailableNotificationsForPlan(salaoPlano) {
    return getAvailableNotifications(salaoPlano);
  }

  async checkAvaliacoesPendentes() {
    try {
      const settings = this.getSettings();
      if (!settings.avaliacoes) {
        return;
      }

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      
      const hoje = new Date();
      const hojeStr = hoje.toLocaleDateString('pt-BR');

      const agendamentosConcluidos = agendamentos.filter(ag => 
        ag.status === 'concluido' &&
        ag.data === hojeStr &&
        !ag.avaliacaoSolicitada &&
        !ag.avaliacaoRealizada
      );

      if (agendamentosConcluidos.length === 0) return;

      const idsParaEnviar = agendamentosConcluidos.map(ag => ag.id);
      const agendamentosAtualizados = agendamentos.map(ag => 
        idsParaEnviar.includes(ag.id)
          ? { ...ag, avaliacaoSolicitada: true, avaliacaoSolicitadaEm: new Date().toISOString() }
          : ag
      );
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

      let sucessos = 0;
      let falhas = 0;

      for (const agendamento of agendamentosConcluidos) {
        const salao = saloes.find(s => s.id === agendamento.salaoId);
        
        if (!salao || !this.canSendNotification(salao.plano, 'avaliacoes')) {
          falhas++;
          continue;
        }

        const cliente = clientes.find(c => c.id === agendamento.clienteId);
        const servico = servicos.find(s => s.id === agendamento.servicoId);
        const profissional = profissionais.find(p => p.id === agendamento.profissionalId);

        if (cliente && servico && profissional && salao && cliente.email) {
          try {
            await mailgunService.sendAvaliacaoAgendamento({
              cliente,
              servico,
              profissional,
              salao,
              agendamento
            });
            sucessos++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            falhas++;
          }
        } else {
          falhas++;
        }
      }

      console.log(`📊 Avaliações: ${sucessos} enviadas, ${falhas} falharam`);

    } catch (error) {
      console.error('❌ Erro ao verificar avaliações:', error);
    }
  }

  getSettings() {
    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? JSON.parse(saved) : {
        confirmacao: true,
        cancelamento: true,
        alteracoes: true,
        avaliacoes: true,
        autoStart: true
      };
    } catch {
      return {
        confirmacao: true,
        cancelamento: true,
        alteracoes: true,
        avaliacoes: true,
        autoStart: true
      };
    }
  }

  saveSettings(settings) {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    console.log('💾 Configurações salvas:', settings);
  }

  async testNotification(email) {
    try {
      const result = await mailgunService.testEmail(email);
      return result;
    } catch (error) {
      console.error('❌ Erro ao enviar teste:', error);
      return false;
    }
  }

  async notifyNovoAgendamento(agendamentoId) {
    try {
      const settings = this.getSettings();
      
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      if (!agendamento) return;

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (!cliente || !servico || !profissional || !salao) return;

      // Enviar confirmação (disponível em todos os planos com notificações)
      if (settings.confirmacao && cliente.email) {
        if (this.canSendNotification(salao.plano, 'confirmacao')) {
          try {
            await mailgunService.sendConfirmacaoAgendamento({
              cliente,
              servico,
              profissional,
              salao,
              agendamento
            });
            console.log(`✅ Confirmação enviada: ${cliente.email}`);
          } catch (error) {
            console.error('❌ Erro ao enviar confirmação:', error);
          }
        }
      }

    } catch (error) {
      console.error('Erro ao notificar:', error);
    }
  }

  async notifyAlteracaoAgendamento(agendamentoId, dadosAntigos, motivoAlteracao = '') {
    try {
      const settings = this.getSettings();
      if (!settings.alteracoes) return;

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      if (!agendamento) return;

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (!cliente || !cliente.email || !servico || !profissional || !salao) return;

      // Apenas planos Profissional+ permitem notificações de alteração
      if (!this.canSendNotification(salao.plano, 'alteracoes')) {
        console.log(`⛔ Plano ${salao.plano} não permite alterações`);
        return;
      }

      try {
        await mailgunService.sendAlteracaoAgendamento({
          cliente,
          servico,
          profissional,
          salao,
          agendamento,
          dadosAntigos,
          motivoAlteracao
        });
        console.log(`✅ Alteração enviada: ${cliente.email}`);
      } catch (error) {
        console.error('❌ Erro ao enviar alteração:', error);
      }

    } catch (error) {
      console.error('Erro ao notificar alteração:', error);
    }
  }

  async solicitarAvaliacao(agendamentoId) {
    try {
      const settings = this.getSettings();
      if (!settings.avaliacoes) return false;

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      
      if (!agendamento || agendamento.avaliacaoSolicitada) return false;

      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (!cliente || !servico || !profissional || !salao || !cliente.email) return false;

      // Apenas planos Premium+ permitem avaliações
      if (!this.canSendNotification(salao.plano, 'avaliacoes')) {
        console.log(`⛔ Plano ${salao.plano} não permite avaliações`);
        return false;
      }

      try {
        await mailgunService.sendAvaliacaoAgendamento({
          cliente,
          servico,
          profissional,
          salao,
          agendamento
        });

        const agendamentosAtualizados = agendamentos.map(ag => 
          ag.id === agendamentoId 
            ? { ...ag, avaliacaoSolicitada: true, avaliacaoSolicitadaEm: new Date().toISOString() }
            : ag
        );
        localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

        console.log(`✅ Avaliação solicitada: ${cliente.email}`);
        return true;

      } catch (error) {
        console.error('❌ Erro ao enviar avaliação:', error);
        return false;
      }

    } catch (error) {
      console.error('❌ Erro geral:', error);
      return false;
    }
  }

  async notifyCancelamento(agendamentoId) {
    try {
      const settings = this.getSettings();
      if (!settings.cancelamento) return;

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      if (!agendamento) return;

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (!cliente || !cliente.email || !servico || !salao) return;

      // Planos Essencial+ permitem cancelamentos
      if (!this.canSendNotification(salao.plano, 'cancelamento')) {
        console.log(`⛔ Plano ${salao.plano} não permite cancelamentos`);
        return;
      }

      try {
        await mailgunService.sendCancelamentoAgendamento({
          cliente,
          servico,
          salao,
          agendamento
        });
        console.log(`✅ Cancelamento enviado: ${cliente.email}`);
      } catch (error) {
        console.error('❌ Erro ao enviar cancelamento:', error);
      }

    } catch (error) {
      console.error('Erro ao notificar cancelamento:', error);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;