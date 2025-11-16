// src/services/notificationService.js - SEM RESTRIÇÕES DE PLANO
import mailgunService from './mailgunService';

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

    // Verificar avaliações pendentes a cada hora
    this.checkInterval = setInterval(() => {
      this.checkAvaliacoesPendentes();
    }, 60 * 60 * 1000);

    // Verificar aniversários diariamente
    this.checkAniversarios();
    setInterval(() => {
      this.checkAniversarios();
    }, 24 * 60 * 60 * 1000);
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
   * Obter configurações de comunicação do salão
   */
  getSalaoSettings(salaoId) {
    try {
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const salao = saloes.find(s => s.id === salaoId);
      
      if (!salao || !salao.comunicacoes) {
        // Configurações padrão
        return {
          confirmacao: { ativo: true, template: null },
          cancelamento: { ativo: true, template: null },
          alteracao: { ativo: true, template: null },
          avaliacao: { ativo: true, template: null },
          aniversario: { ativo: false, automatico: true, diasAntecedencia: 0, template: null }
        };
      }
      
      return salao.comunicacoes;
    } catch {
      return {
        confirmacao: { ativo: true, template: null },
        cancelamento: { ativo: true, template: null },
        alteracao: { ativo: true, template: null },
        avaliacao: { ativo: true, template: null },
        aniversario: { ativo: false, automatico: true, diasAntecedencia: 0, template: null }
      };
    }
  }

  /**
   * Verificar aniversários e enviar mensagens
   */
  async checkAniversarios() {
    try {
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      
      const hoje = new Date();
      const diaHoje = hoje.getDate();
      const mesHoje = hoje.getMonth() + 1;

      for (const salao of saloes) {
        const settings = this.getSalaoSettings(salao.id);
        
        if (!settings.aniversario.ativo || !settings.aniversario.automatico) {
          continue;
        }

        // Calcular data de referência baseada nos dias de antecedência
        const dataReferencia = new Date(hoje);
        dataReferencia.setDate(dataReferencia.getDate() + settings.aniversario.diasAntecedencia);
        const diaRef = dataReferencia.getDate();
        const mesRef = dataReferencia.getMonth() + 1;

        // Filtrar clientes aniversariantes
        const aniversariantes = clientes.filter(cliente => {
          if (!cliente.dataNascimento) return false;
          
          const [dia, mes] = cliente.dataNascimento.split('/');
          return parseInt(dia) === diaRef && parseInt(mes) === mesRef;
        });

        for (const cliente of aniversariantes) {
          if (cliente.email) {
            try {
              await mailgunService.sendAniversario({
                cliente,
                salao,
                customTemplate: settings.aniversario.template
              });
              
              console.log(`🎂 Mensagem de aniversário enviada: ${cliente.nome}`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
              console.error('Erro ao enviar aniversário:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar aniversários:', error);
    }
  }

  /**
   * Verificar avaliações pendentes
   */
  async checkAvaliacoesPendentes() {
    try {
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
        const settings = this.getSalaoSettings(agendamento.salaoId);
        
        if (!salao || !settings.avaliacao.ativo) {
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
              agendamento,
              customTemplate: settings.avaliacao.template
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

  /**
   * Notificar novo agendamento
   */
  async notifyNovoAgendamento(agendamentoId) {
    try {
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

      const settings = this.getSalaoSettings(salao.id);

      // Enviar confirmação
      if (settings.confirmacao.ativo && cliente.email) {
        try {
          await mailgunService.sendConfirmacaoAgendamento({
            cliente,
            servico,
            profissional,
            salao,
            agendamento,
            customTemplate: settings.confirmacao.template
          });
          console.log(`✅ Confirmação enviada: ${cliente.email}`);
        } catch (error) {
          console.error('❌ Erro ao enviar confirmação:', error);
        }
      }

    } catch (error) {
      console.error('Erro ao notificar:', error);
    }
  }

  /**
   * Notificar alteração de agendamento
   */
  async notifyAlteracaoAgendamento(agendamentoId, dadosAntigos, motivoAlteracao = '') {
    try {
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

      const settings = this.getSalaoSettings(salao.id);

      if (!settings.alteracao.ativo) {
        console.log('⏸️ Notificações de alteração desativadas');
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
          motivoAlteracao,
          customTemplate: settings.alteracao.template
        });
        console.log(`✅ Alteração enviada: ${cliente.email}`);
      } catch (error) {
        console.error('❌ Erro ao enviar alteração:', error);
      }

    } catch (error) {
      console.error('Erro ao notificar alteração:', error);
    }
  }

  /**
   * Solicitar avaliação manualmente
   */
  async solicitarAvaliacao(agendamentoId) {
    try {
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

      const settings = this.getSalaoSettings(salao.id);

      try {
        await mailgunService.sendAvaliacaoAgendamento({
          cliente,
          servico,
          profissional,
          salao,
          agendamento,
          customTemplate: settings.avaliacao.template
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

  /**
   * Notificar cancelamento
   */
  async notifyCancelamento(agendamentoId) {
    try {
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

      const settings = this.getSalaoSettings(salao.id);

      if (!settings.cancelamento.ativo) {
        console.log('⏸️ Notificações de cancelamento desativadas');
        return;
      }

      try {
        await mailgunService.sendCancelamentoAgendamento({
          cliente,
          servico,
          salao,
          agendamento,
          customTemplate: settings.cancelamento.template
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