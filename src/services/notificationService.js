// src/services/notificationService.js - CORRIGIDO: Duplicação de lembretes

import mailgunService from './mailgunService';

class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.isRunning = false;
    this.lastCheckTime = null; // ✅ NOVO: Controlar última verificação
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Serviço já está rodando, ignorando start duplicado');
      return;
    }
    
    this.isRunning = true;
    console.log('🔔 Serviço de notificações iniciado');

    // Verificar lembretes a cada 1 hora
    this.checkInterval = setInterval(() => {
      this.checkLembretes();
      this.checkAvaliacoesPendentes();
    }, 60 * 60 * 1000); // 1 hora

    // ✅ IMPORTANTE: Não executar imediatamente no start para evitar duplicação
    // Apenas agendar para próxima execução
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

  async checkLembretes() {
    try {
      // ✅ NOVO: Prevenir execuções múltiplas simultâneas
      const now = Date.now();
      if (this.lastCheckTime && (now - this.lastCheckTime) < 30000) { // 30 segundos
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

      // ✅ CORRIGIDO: Filtro mais rigoroso
      const agendamentosAmanha = agendamentos.filter(ag => 
        ag.data === amanhaStr && 
        ag.status !== 'cancelado' &&
        !ag.lembreteEnviado && // ✅ Verifica se já foi enviado
        ag.status !== 'concluido' // ✅ Não enviar para já concluídos
      );

      console.log(`📅 [${new Date().toLocaleTimeString()}] Verificando lembretes: ${agendamentosAmanha.length} agendamentos para amanhã`);

      // ✅ NOVO: Marcar ANTES de enviar para evitar race condition
      const idsParaEnviar = agendamentosAmanha.map(ag => ag.id);
      
      if (idsParaEnviar.length === 0) {
        console.log('✅ Nenhum lembrete para enviar');
        return;
      }

      // Marcar como enviados ANTES de tentar enviar
      const agendamentosAtualizados = agendamentos.map(ag => 
        idsParaEnviar.includes(ag.id)
          ? { ...ag, lembreteEnviado: true, lembreteEnviadoEm: new Date().toISOString() }
          : ag
      );
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

      console.log(`🔒 ${idsParaEnviar.length} agendamento(s) marcado(s) como lembrete enviado`);

      // Agora enviar os emails
      let sucessos = 0;
      let falhas = 0;

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

            console.log(`✅ [${sucessos + 1}/${agendamentosAmanha.length}] Lembrete enviado para ${cliente.email} (ID: ${agendamento.id})`);
            sucessos++;
            
            // ✅ NOVO: Delay entre envios para evitar rate limit
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
      this.lastCheckTime = null; // Reset para permitir nova tentativa
    }
  }

  async checkAvaliacoesPendentes() {
    try {
      // ✅ NOVO: Prevenir execuções múltiplas
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

      // ✅ CORRIGIDO: Filtro mais rigoroso
      const agendamentosConcluidos = agendamentos.filter(ag => 
        ag.status === 'concluido' &&
        ag.data === hojeStr &&
        !ag.avaliacaoSolicitada && // ✅ Verifica se já foi solicitado
        !ag.avaliacaoRealizada // ✅ Não enviar se já foi avaliado
      );

      console.log(`⭐ [${new Date().toLocaleTimeString()}] Verificando avaliações: ${agendamentosConcluidos.length} agendamentos concluídos hoje`);

      if (agendamentosConcluidos.length === 0) {
        return;
      }

      // ✅ Marcar ANTES de enviar
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

            console.log(`✅ [${sucessos + 1}/${agendamentosConcluidos.length}] Avaliação enviada para ${cliente.email} (ID: ${agendamento.id})`);
            sucessos++;
            
            // ✅ Delay entre envios
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

      // ✅ NOVO: Verificar se já foi solicitado
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

        // ✅ Marcar como enviado
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
}

export const notificationService = new NotificationService();
export default notificationService;