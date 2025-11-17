// src/services/notificationService.js - COMPLETO COM HISTÓRICO E DEBUG
import mailgunService from './mailgunService';

class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.isRunning = false;
    this.lastCheckTime = null;
  }

  /**
   * 📧 Registrar email no histórico
   */
  registrarHistorico(emailData) {
    try {
      const historicoKey = `emailHistorico_${emailData.salaoId}`;
      const historicoExistente = JSON.parse(localStorage.getItem(historicoKey) || '[]');

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
        salaoId: emailData.salaoId
      };

      const novoHistorico = [novoEmail, ...historicoExistente];
      const historicoLimitado = novoHistorico.slice(0, 1000);
      
      localStorage.setItem(historicoKey, JSON.stringify(historicoLimitado));
      console.log('📧 Email registrado no histórico:', emailData.tipo);
      
      return novoEmail;
    } catch (error) {
      console.error('❌ Erro ao registrar email no histórico:', error);
      return null;
    }
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
    }, 60 * 60 * 1000);

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

  getSalaoSettings(salaoId) {
    try {
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const salao = saloes.find(s => s.id === salaoId);
      
      if (!salao || !salao.comunicacoes) {
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

        const dataReferencia = new Date(hoje);
        dataReferencia.setDate(dataReferencia.getDate() + settings.aniversario.diasAntecedencia);
        const diaRef = dataReferencia.getDate();
        const mesRef = dataReferencia.getMonth() + 1;

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
              
              this.registrarHistorico({
                clienteId: cliente.id,
                clienteNome: cliente.nome,
                clienteEmail: cliente.email,
                tipo: 'aniversario',
                assunto: `🎂 Feliz Aniversário, ${cliente.nome.split(' ')[0]}!`,
                salaoId: salao.id,
                status: 'enviado'
              });
              
              console.log(`🎂 Mensagem de aniversário enviada: ${cliente.nome}`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
              this.registrarHistorico({
                clienteId: cliente.id,
                clienteNome: cliente.nome,
                clienteEmail: cliente.email,
                tipo: 'aniversario',
                assunto: `🎂 Feliz Aniversário, ${cliente.nome.split(' ')[0]}!`,
                salaoId: salao.id,
                status: 'falhado',
                erro: error.message
              });
              console.error('Erro ao enviar aniversário:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar aniversários:', error);
    }
  }

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
            
            this.registrarHistorico({
              clienteId: cliente.id,
              clienteNome: cliente.nome,
              clienteEmail: cliente.email,
              tipo: 'avaliacao',
              assunto: `⭐ Como foi seu atendimento no ${salao.nome}?`,
              agendamentoId: agendamento.id,
              salaoId: salao.id,
              status: 'enviado'
            });
            
            sucessos++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            this.registrarHistorico({
              clienteId: cliente.id,
              clienteNome: cliente.nome,
              clienteEmail: cliente.email,
              tipo: 'avaliacao',
              assunto: `⭐ Como foi seu atendimento no ${salao.nome}?`,
              agendamentoId: agendamento.id,
              salaoId: salao.id,
              status: 'falhado',
              erro: error.message
            });
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

  async notifyNovoAgendamento(agendamentoId) {
    console.log('📧 notifyNovoAgendamento chamado para ID:', agendamentoId);
    
    try {
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');

      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      if (!agendamento) {
        console.log('⚠️ Agendamento não encontrado');
        return;
      }

      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
      const salao = saloes.find(s => s.id === agendamento.salaoId);

      if (!cliente || !servico || !profissional || !salao) {
        console.log('⚠️ Dados incompletos');
        return;
      }

      const settings = this.getSalaoSettings(salao.id);

      if (settings.confirmacao.ativo && cliente.email) {
        try {
          console.log('📧 Enviando email de CONFIRMAÇÃO...');
          
          await mailgunService.sendConfirmacaoAgendamento({
            cliente,
            servico,
            profissional,
            salao,
            agendamento,
            customTemplate: settings.confirmacao.template
          });
          
          this.registrarHistorico({
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            clienteEmail: cliente.email,
            tipo: 'confirmacao',
            assunto: `✅ Agendamento Confirmado - ${salao.nome}`,
            agendamentoId: agendamento.id,
            salaoId: salao.id,
            status: 'enviado'
          });
          
          console.log(`✅ Confirmação enviada: ${cliente.email}`);
        } catch (error) {
          this.registrarHistorico({
            clienteId: cliente.id,
            clienteNome: cliente.nome,
            clienteEmail: cliente.email,
            tipo: 'confirmacao',
            assunto: `✅ Agendamento Confirmado - ${salao.nome}`,
            agendamentoId: agendamento.id,
            salaoId: salao.id,
            status: 'falhado',
            erro: error.message
          });
          console.error('❌ Erro ao enviar confirmação:', error);
        }
      }

    } catch (error) {
      console.error('Erro ao notificar:', error);
    }
  }

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
        
        this.registrarHistorico({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          clienteEmail: cliente.email,
          tipo: 'alteracao',
          assunto: `🔄 Alteração no Agendamento - ${salao.nome}`,
          agendamentoId: agendamento.id,
          salaoId: salao.id,
          status: 'enviado'
        });
        
        console.log(`✅ Alteração enviada: ${cliente.email}`);
      } catch (error) {
        this.registrarHistorico({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          clienteEmail: cliente.email,
          tipo: 'alteracao',
          assunto: `🔄 Alteração no Agendamento - ${salao.nome}`,
          agendamentoId: agendamento.id,
          salaoId: salao.id,
          status: 'falhado',
          erro: error.message
        });
        console.error('❌ Erro ao enviar alteração:', error);
      }

    } catch (error) {
      console.error('Erro ao notificar alteração:', error);
    }
  }

  async solicitarAvaliacao(agendamentoId) {
    console.log('🔍 solicitarAvaliacao chamado para agendamento:', agendamentoId);
    
    try {
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const agendamento = agendamentos.find(ag => ag.id === agendamentoId);
      
      console.log('📋 Agendamento encontrado:', agendamento);
      
      if (!agendamento || agendamento.avaliacaoSolicitada) {
        console.log('⚠️ Agendamento não encontrado ou avaliação já solicitada');
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

      console.log('👤 Cliente:', cliente?.nome);
      console.log('✂️ Serviço:', servico?.nome);
      console.log('💇 Profissional:', profissional?.nome);
      console.log('🏢 Salão:', salao?.nome);

      if (!cliente || !servico || !profissional || !salao || !cliente.email) {
        console.log('❌ Dados incompletos para enviar avaliação');
        return false;
      }

      const settings = this.getSalaoSettings(salao.id);
      console.log('⚙️ Settings de avaliação:', settings.avaliacao);

      try {
        console.log('📧 Chamando mailgunService.sendAvaliacaoAgendamento...');
        
        await mailgunService.sendAvaliacaoAgendamento({
          cliente,
          servico,
          profissional,
          salao,
          agendamento,
          customTemplate: settings.avaliacao.template
        });

        console.log('✅ Email de AVALIAÇÃO enviado com sucesso!');

        const agendamentosAtualizados = agendamentos.map(ag => 
          ag.id === agendamentoId 
            ? { ...ag, avaliacaoSolicitada: true, avaliacaoSolicitadaEm: new Date().toISOString() }
            : ag
        );
        localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

        this.registrarHistorico({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          clienteEmail: cliente.email,
          tipo: 'avaliacao',
          assunto: `⭐ Como foi seu atendimento no ${salao.nome}?`,
          agendamentoId: agendamento.id,
          salaoId: salao.id,
          status: 'enviado'
        });

        console.log(`✅ Avaliação solicitada: ${cliente.email}`);
        return true;

      } catch (error) {
        console.error('❌ ERRO ao enviar avaliação:', error);
        
        this.registrarHistorico({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          clienteEmail: cliente.email,
          tipo: 'avaliacao',
          assunto: `⭐ Como foi seu atendimento no ${salao.nome}?`,
          agendamentoId: agendamento.id,
          salaoId: salao.id,
          status: 'falhado',
          erro: error.message
        });
        
        return false;
      }

    } catch (error) {
      console.error('❌ Erro geral:', error);
      return false;
    }
  }

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
        
        this.registrarHistorico({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          clienteEmail: cliente.email,
          tipo: 'cancelamento',
          assunto: `❌ Cancelamento de Agendamento - ${salao.nome}`,
          agendamentoId: agendamento.id,
          salaoId: salao.id,
          status: 'enviado'
        });
        
        console.log(`✅ Cancelamento enviado: ${cliente.email}`);
      } catch (error) {
        this.registrarHistorico({
          clienteId: cliente.id,
          clienteNome: cliente.nome,
          clienteEmail: cliente.email,
          tipo: 'cancelamento',
          assunto: `❌ Cancelamento de Agendamento - ${salao.nome}`,
          agendamentoId: agendamento.id,
          salaoId: salao.id,
          status: 'falhado',
          erro: error.message
        });
        console.error('❌ Erro ao enviar cancelamento:', error);
      }

    } catch (error) {
      console.error('Erro ao notificar cancelamento:', error);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;