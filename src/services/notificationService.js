// src/services/notificationService.js - Gerenciador de Notificações com Mailgun REAL

import mailgunService from './mailgunService';
import { dateToISO, compareDates, getTodayBR } from '../utils/masks';

class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.isRunning = false;
  }

  // Iniciar verificação automática de lembretes
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔔 Serviço de notificações iniciado');

    // Verificar a cada 1 hora
    this.checkInterval = setInterval(() => {
      this.checkLembretes();
    }, 60 * 60 * 1000);

    // Verificar imediatamente ao iniciar
    this.checkLembretes();
  }

  // Parar verificação
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    console.log('🔕 Serviço de notificações parado');
  }

  // Verificar agendamentos que precisam de lembrete (24h antes)
  async checkLembretes() {
    try {
      const settings = this.getSettings();
      if (!settings.lembretes) {
        console.log('⏭️ Lembretes desabilitados nas configurações');
        return;
      }

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      
      const hoje = new Date();
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);
      const amanhaStr = amanha.toLocaleDateString('pt-BR');

      // Buscar agendamentos para amanhã
      const agendamentosAmanha = agendamentos.filter(ag => 
        ag.data === amanhaStr && 
        ag.status !== 'cancelado' &&
        !ag.lembreteEnviado
      );

      console.log(`📅 Verificando lembretes: ${agendamentosAmanha.length} agendamentos para amanhã`);

      // Enviar lembretes
      for (const agendamento of agendamentosAmanha) {
        const cliente = clientes.find(c => c.id === agendamento.clienteId);
        const servico = servicos.find(s => s.id === agendamento.servicoId);
        const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
        const salao = saloes.find(s => s.id === agendamento.salaoId);

        if (cliente && servico && profissional && salao && cliente.email) {
          try {
            await mailgunService.sendLembreteAgendamento({
              cliente,
              servico,
              profissional,
              salao,
              agendamento
            });

            // Marcar lembrete como enviado
            agendamento.lembreteEnviado = true;
            console.log(`✅ Lembrete enviado para ${cliente.email}`);
          } catch (error) {
            console.error(`❌ Erro ao enviar lembrete para ${cliente.email}:`, error);
          }
        }
      }

      // Atualizar agendamentos
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    } catch (error) {
      console.error('Erro ao verificar lembretes:', error);
    }
  }

  // Enviar confirmação de novo agendamento
  async notifyNovoAgendamento(agendamentoId) {
    try {
      const settings = this.getSettings();
      
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      if (!agendamento) {
        console.warn('⚠️ Agendamento não encontrado:', agendamentoId);
        return;
      }

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (!cliente || !servico || !profissional || !salao) {
        console.warn('⚠️ Dados incompletos para notificação');
        return;
      }

      // Enviar para cliente (se habilitado)
      if (settings.confirmacao && cliente.email) {
        try {
          await mailgunService.sendConfirmacaoAgendamento({
            cliente,
            servico,
            profissional,
            salao,
            agendamento
          });
          console.log(`✅ Confirmação enviada para cliente: ${cliente.email}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar confirmação para cliente ${cliente.email}:`, error);
        }
      }

      // Enviar para profissional (se habilitado)
      if (settings.notifyProfissional && profissional.email) {
        try {
          await mailgunService.sendNovoAgendamentoProfissional({
            cliente,
            servico,
            profissional,
            salao,
            agendamento
          });
          console.log(`✅ Notificação enviada para profissional: ${profissional.email}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar notificação para profissional ${profissional.email}:`, error);
        }
      }

    } catch (error) {
      console.error('Erro ao notificar novo agendamento:', error);
    }
  }

  // Enviar notificação de cancelamento
  async notifyCancelamento(agendamentoId) {
    try {
      const settings = this.getSettings();
      if (!settings.cancelamento) {
        console.log('⏭️ Notificações de cancelamento desabilitadas');
        return;
      }

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      if (!agendamento) return;

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (cliente && cliente.email && servico && salao) {
        try {
          await mailgunService.sendCancelamentoAgendamento({
            cliente,
            servico,
            salao,
            agendamento
          });
          console.log(`✅ Notificação de cancelamento enviada para ${cliente.email}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar cancelamento para ${cliente.email}:`, error);
        }
      }

    } catch (error) {
      console.error('Erro ao notificar cancelamento:', error);
    }
  }

  // Obter configurações de notificação
  getSettings() {
    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? JSON.parse(saved) : {
        confirmacao: true,
        lembretes: true,
        cancelamento: true,
        notifyProfissional: true,
        autoStart: true
      };
    } catch {
      return {
        confirmacao: true,
        lembretes: true,
        cancelamento: true,
        notifyProfissional: true,
        autoStart: true
      };
    }
  }

  // Salvar configurações
  saveSettings(settings) {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    console.log('💾 Configurações de notificação salvas');
  }

  // Testar envio de email
  async testNotification(email) {
    try {
      const result = await mailgunService.testEmail(email);
      if (result) {
        console.log('✅ Email de teste enviado com sucesso!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao enviar email de teste:', error);
      return false;
    }
  }
}

// Exportar instância única
export const notificationService = new NotificationService();
export default notificationService;