// src/services/notificationService.js - ATUALIZADO COM NOVOS EVENTOS

import mailgunService from './mailgunService';

class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔔 Serviço de notificações iniciado');

    // Verificar lembretes a cada 1 hora
    this.checkInterval = setInterval(() => {
      this.checkLembretes();
      this.checkAvaliacoesPendentes();
    }, 60 * 60 * 1000);

    this.checkLembretes();
    this.checkAvaliacoesPendentes();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    console.log('🔕 Serviço de notificações parado');
  }

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

      const agendamentosAmanha = agendamentos.filter(ag => 
        ag.data === amanhaStr && 
        ag.status !== 'cancelado' &&
        !ag.lembreteEnviado
      );

      console.log(`📅 Verificando lembretes: ${agendamentosAmanha.length} agendamentos para amanhã`);

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

            agendamento.lembreteEnviado = true;
            console.log(`✅ Lembrete enviado para ${cliente.email}`);
          } catch (error) {
            console.error(`❌ Erro ao enviar lembrete para ${cliente.email}:`, error);
          }
        }
      }

      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    } catch (error) {
      console.error('Erro ao verificar lembretes:', error);
    }
  }

  // ✨ NOVO: Verificar agendamentos concluídos que precisam de avaliação
  async checkAvaliacoesPendentes() {
    try {
      const settings = this.getSettings();
      if (!settings.avaliacoes) {
        console.log('⏭️ Solicitação de avaliações desabilitada');
        return;
      }

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      
      const hoje = new Date();
      const hojeStr = hoje.toLocaleDateString('pt-BR');

      // Buscar agendamentos concluídos hoje que ainda não receberam solicitação de avaliação
      const agendamentosConcluidos = agendamentos.filter(ag => 
        ag.status === 'concluido' &&
        ag.data === hojeStr &&
        !ag.avaliacaoSolicitada
      );

      console.log(`⭐ Verificando avaliações: ${agendamentosConcluidos.length} agendamentos concluídos hoje`);

      for (const agendamento of agendamentosConcluidos) {
        const cliente = clientes.find(c => c.id === agendamento.clienteId);
        const servico = servicos.find(s => s.id === agendamento.servicoId);
        const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
        const salao = saloes.find(s => s.id === agendamento.salaoId);

        if (cliente && servico && profissional && salao && cliente.email) {
          try {
            await mailgunService.sendAvaliacaoAgendamento({
              cliente,
              servico,
              profissional,
              salao,
              agendamento
            });

            agendamento.avaliacaoSolicitada = true;
            console.log(`✅ Solicitação de avaliação enviada para ${cliente.email}`);
          } catch (error) {
            console.error(`❌ Erro ao enviar avaliação para ${cliente.email}:`, error);
          }
        }
      }

      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    } catch (error) {
      console.error('Erro ao verificar avaliações pendentes:', error);
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

  // ✨ NOVO: Notificar alteração de agendamento
  async notifyAlteracaoAgendamento(agendamentoId, dadosAntigos, motivoAlteracao = '') {
    try {
      const settings = this.getSettings();
      if (!settings.alteracoes) {
        console.log('⏭️ Notificações de alteração desabilitadas');
        return;
      }

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

      if (cliente && cliente.email && servico && profissional && salao) {
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
          console.log(`✅ Notificação de alteração enviada para ${cliente.email}`);
        } catch (error) {
          console.error(`❌ Erro ao enviar alteração para ${cliente.email}:`, error);
        }
      }

    } catch (error) {
      console.error('Erro ao notificar alteração:', error);
    }
  }

  // ✨ NOVO: Solicitar avaliação manualmente
  async solicitarAvaliacao(agendamentoId) {
    try {
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      if (!agendamento) {
        console.warn('⚠️ Agendamento não encontrado:', agendamentoId);
        return false;
      }

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (!cliente || !servico || !profissional || !salao) {
        console.warn('⚠️ Dados incompletos para avaliação');
        return false;
      }

      if (!cliente.email) {
        console.warn('⚠️ Cliente sem email cadastrado');
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

        agendamento.avaliacaoSolicitada = true;
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

        console.log(`✅ Avaliação solicitada para ${cliente.email}`);
        return true;
      } catch (error) {
        console.error(`❌ Erro ao solicitar avaliação:`, error);
        return false;
      }

    } catch (error) {
      console.error('Erro ao solicitar avaliação:', error);
      return false;
    }
  }

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

  getSettings() {
    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? JSON.parse(saved) : {
        confirmacao: true,
        lembretes: true,
        cancelamento: true,
        alteracoes: true,  // ✨ NOVO
        avaliacoes: true,  // ✨ NOVO
        notifyProfissional: true,
        autoStart: true
      };
    } catch {
      return {
        confirmacao: true,
        lembretes: true,
        cancelamento: true,
        alteracoes: true,
        avaliacoes: true,
        notifyProfissional: true,
        autoStart: true
      };
    }
  }

  saveSettings(settings) {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    console.log('💾 Configurações de notificação salvas');
  }

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

export const notificationService = new NotificationService();
export default notificationService;