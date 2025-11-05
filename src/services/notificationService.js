// src/services/notificationService.js - CORRIGIDO: Usando planRestrictions consolidado

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
      console.log('⚠️ Serviço já está rodando, ignorando start duplicado');
      return;
    }
    
    this.isRunning = true;
    console.log('🔔 Serviço de notificações iniciado');

    this.checkInterval = setInterval(() => {
      this.checkLembretes();
      this.checkAvaliacoesPendentes();
    }, 60 * 60 * 1000); // 1 hora

    console.log('⏰ Próxima verificação em 1 hora');
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
      console.log(`⛔ Plano ${salaoPlano} não permite notificação: ${tipoNotificacao}`);
    }
    
    return hasAccess;
  }

  /**
   * Obter notificações disponíveis para o plano
   */
  getAvailableNotificationsForPlan(salaoPlano) {
    return getAvailableNotifications(salaoPlano);
  }

  async checkLembretes() {
    try {
      const now = Date.now();
      if (this.lastCheckTime && (now - this.lastCheckTime) < 30000) {
        console.log('⏭️ Verificação de lembretes executada recentemente, pulando...');
        return;
      }
      this.lastCheckTime = now;

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
        !ag.lembreteEnviado &&
        ag.status !== 'concluido'
      );

      console.log(`📅 [${new Date().toLocaleTimeString()}] Verificando lembretes: ${agendamentosAmanha.length} agendamentos para amanhã`);

      const idsParaEnviar = agendamentosAmanha.map(ag => ag.id);
      
      if (idsParaEnviar.length === 0) {
        console.log('✅ Nenhum lembrete para enviar');
        return;
      }

      const agendamentosAtualizados = agendamentos.map(ag => 
        idsParaEnviar.includes(ag.id)
          ? { ...ag, lembreteEnviado: true, lembreteEnviadoEm: new Date().toISOString() }
          : ag
      );
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

      console.log(`🔒 ${idsParaEnviar.length} agendamento(s) marcado(s) como lembrete enviado`);

      let sucessos = 0;
      let falhas = 0;

      for (const agendamento of agendamentosAmanha) {
        const salao = saloes.find(s => s.id === agendamento.salaoId);
        
        // Verificar se o plano permite lembretes
        if (!salao || !this.canSendNotification(salao.plano, 'lembretes')) {
          console.log(`⛔ Salão ${salao?.nome || agendamento.salaoId} não pode enviar lembretes (plano: ${salao?.plano})`);
          falhas++;
          continue;
        }

        const cliente = clientes.find(c => c.id === agendamento.clienteId);
        const servico = servicos.find(s => s.id === agendamento.servicoId);
        const profissional = profissionais.find(p => p.id === agendamento.profissionalId);

        if (cliente && servico && profissional && salao && cliente.email) {
          try {
            await mailgunService.sendLembreteAgendamento({
              cliente,
              servico,
              profissional,
              salao,
              agendamento
            });

            console.log(`✅ [${sucessos + 1}/${agendamentosAmanha.length}] Lembrete enviado para ${cliente.email} (ID: ${agendamento.id})`);
            sucessos++;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`❌ Erro ao enviar lembrete para ${cliente.email} (ID: ${agendamento.id}):`, error);
            falhas++;
          }
        } else {
          console.warn(`⚠️ Dados incompletos para agendamento ID ${agendamento.id}`);
          falhas++;
        }
      }

      console.log(`📊 Resumo de lembretes: ${sucessos} enviados, ${falhas} falharam`);

    } catch (error) {
      console.error('❌ Erro ao verificar lembretes:', error);
      this.lastCheckTime = null;
    }
  }

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

      const agendamentosConcluidos = agendamentos.filter(ag => 
        ag.status === 'concluido' &&
        ag.data === hojeStr &&
        !ag.avaliacaoSolicitada &&
        !ag.avaliacaoRealizada
      );

      console.log(`⭐ [${new Date().toLocaleTimeString()}] Verificando avaliações: ${agendamentosConcluidos.length} agendamentos concluídos hoje`);

      if (agendamentosConcluidos.length === 0) {
        return;
      }

      const idsParaEnviar = agendamentosConcluidos.map(ag => ag.id);
      const agendamentosAtualizados = agendamentos.map(ag => 
        idsParaEnviar.includes(ag.id)
          ? { ...ag, avaliacaoSolicitada: true, avaliacaoSolicitadaEm: new Date().toISOString() }
          : ag
      );
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

      console.log(`🔒 ${idsParaEnviar.length} agendamento(s) marcado(s) como avaliação solicitada`);

      let sucessos = 0;
      let falhas = 0;

      for (const agendamento of agendamentosConcluidos) {
        const salao = saloes.find(s => s.id === agendamento.salaoId);
        
        // Verificar se o plano permite avaliações
        if (!salao || !this.canSendNotification(salao.plano, 'avaliacoes')) {
          console.log(`⛔ Salão ${salao?.nome || agendamento.salaoId} não pode enviar avaliações (plano: ${salao?.plano})`);
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

            console.log(`✅ [${sucessos + 1}/${agendamentosConcluidos.length}] Avaliação enviada para ${cliente.email} (ID: ${agendamento.id})`);
            sucessos++;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`❌ Erro ao enviar avaliação para ${cliente.email} (ID: ${agendamento.id}):`, error);
            falhas++;
          }
        } else {
          falhas++;
        }
      }

      console.log(`📊 Resumo de avaliações: ${sucessos} enviadas, ${falhas} falharam`);

    } catch (error) {
      console.error('❌ Erro ao verificar avaliações pendentes:', error);
    }
  }

  getSettings() {
    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? JSON.parse(saved) : {
        confirmacao: true,
        lembretes: true,
        cancelamento: true,
        alteracoes: true,
        avaliacoes: true,
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
    console.log('💾 Configurações de notificação salvas:', settings);
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

      // Verificar e enviar confirmação para cliente
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
            console.log(`✅ Confirmação enviada para cliente: ${cliente.email}`);
          } catch (error) {
            console.error(`❌ Erro ao enviar confirmação para cliente ${cliente.email}:`, error);
          }
        } else {
          console.log(`⛔ Plano ${salao.plano} não permite confirmações`);
        }
      }

      // Verificar e enviar notificação para profissional
      if (settings.notifyProfissional && profissional.email) {
        if (this.canSendNotification(salao.plano, 'notifyProfissional')) {
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
        } else {
          console.log(`⛔ Plano ${salao.plano} não permite notificar profissional`);
        }
      }

    } catch (error) {
      console.error('Erro ao notificar novo agendamento:', error);
    }
  }

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

      if (!cliente || !cliente.email || !servico || !profissional || !salao) {
        return;
      }

      // Verificar se o plano permite notificações de alteração
      if (!this.canSendNotification(salao.plano, 'alteracoes')) {
        console.log(`⛔ Plano ${salao.plano} não permite notificações de alteração`);
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
        console.log(`✅ Notificação de alteração enviada para ${cliente.email}`);
      } catch (error) {
        console.error(`❌ Erro ao enviar alteração para ${cliente.email}:`, error);
      }

    } catch (error) {
      console.error('Erro ao notificar alteração:', error);
    }
  }

  async solicitarAvaliacao(agendamentoId) {
    try {
      console.log('🎯 Iniciando solicitação de avaliação para ID:', agendamentoId);
      
      const settings = this.getSettings();
      if (!settings.avaliacoes) {
        console.log('⏭️ Avaliações desabilitadas nas configurações');
        return false;
      }

      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      
      if (!agendamento) {
        console.warn('⚠️ Agendamento não encontrado:', agendamentoId);
        return false;
      }

      if (agendamento.avaliacaoSolicitada) {
        console.log('⏭️ Avaliação já foi solicitada anteriormente para este agendamento');
        return false;
      }

      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (!cliente || !servico || !profissional || !salao || !cliente.email) {
        console.warn('⚠️ Dados incompletos ou cliente sem email');
        return false;
      }

      // Verificar se o plano permite avaliações
      if (!this.canSendNotification(salao.plano, 'avaliacoes')) {
        console.log(`⛔ Plano ${salao.plano} não permite solicitar avaliações`);
        return false;
      }

      try {
        console.log('📧 Enviando email de avaliação...');
        
        await mailgunService.sendAvaliacaoAgendamento({
          cliente,
          servico,
          profissional,
          salao,
          agendamento
        });

        console.log('✅ Email de avaliação enviado com sucesso!');

        const agendamentosAtualizados = agendamentos.map(ag => 
          ag.id === agendamentoId 
            ? { ...ag, avaliacaoSolicitada: true, avaliacaoSolicitadaEm: new Date().toISOString() }
            : ag
        );
        
        localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

        console.log(`✅ Avaliação solicitada e marcada para ${cliente.email}`);
        return true;

      } catch (error) {
        console.error(`❌ Erro ao enviar email de avaliação:`, error);
        return false;
      }

    } catch (error) {
      console.error('❌ Erro geral ao solicitar avaliação:', error);
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

      if (!cliente || !cliente.email || !servico || !salao) {
        return;
      }

      // Verificar se o plano permite cancelamentos
      if (!this.canSendNotification(salao.plano, 'cancelamento')) {
        console.log(`⛔ Plano ${salao.plano} não permite notificações de cancelamento`);
        return;
      }

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

    } catch (error) {
      console.error('Erro ao notificar cancelamento:', error);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;