// src/services/emailService.js - Serviço de Email (Simulado)

// NOTA: Em produção, você deve usar um serviço real como:
// - SendGrid, Mailgun, AWS SES, etc.
// Este código simula o envio e registra no console/localStorage

class EmailService {
  constructor() {
    this.emailQueue = this.loadQueue();
  }

  loadQueue() {
    try {
      const saved = localStorage.getItem('emailQueue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem('emailQueue', JSON.stringify(this.emailQueue));
    } catch (e) {
      console.error('Erro ao salvar fila de emails:', e);
    }
  }

  // Templates de email
  templates = {
    confirmacao: {
      subject: '✅ Agendamento Confirmado - {salaoNome}',
      body: `
Olá {clienteNome}!

Seu agendamento foi confirmado com sucesso! 🎉

📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}
💇 Profissional: {profissional}
📍 Local: {salaoEndereco}

📞 Em caso de imprevistos, entre em contato: {salaoTelefone}

Aguardamos você!
Equipe {salaoNome}
      `
    },
    lembrete: {
      subject: '⏰ Lembrete: Agendamento Amanhã - {salaoNome}',
      body: `
Olá {clienteNome}!

Este é um lembrete do seu agendamento para amanhã! ⏰

📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}
💇 Profissional: {profissional}
📍 Local: {salaoEndereco}

Não se esqueça! Estamos esperando você! 💜

📞 Contato: {salaoTelefone}

Equipe {salaoNome}
      `
    },
    cancelamento: {
      subject: '❌ Agendamento Cancelado - {salaoNome}',
      body: `
Olá {clienteNome},

Informamos que seu agendamento foi cancelado.

📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}

Para reagendar, entre em contato conosco ou acesse nossa agenda online.

📞 Contato: {salaoTelefone}
🌐 Agenda Online: {linkAgenda}

Equipe {salaoNome}
      `
    },
    novoAgendamento: {
      subject: '🔔 Novo Agendamento - {salaoNome}',
      body: `
Olá {profissionalNome}!

Você tem um novo agendamento! 📅

👤 Cliente: {clienteNome}
📞 Telefone: {clienteTelefone}
📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}

Prepare-se para oferecer um atendimento incrível! 💪

Equipe {salaoNome}
      `
    }
  };

  // Substituir variáveis no template
  replaceVariables(text, variables) {
    let result = text;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, variables[key] || '');
    });
    return result;
  }

  // Enviar email (simulado)
  async sendEmail(to, subject, body) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = {
          id: Date.now(),
          to,
          subject,
          body,
          sentAt: new Date().toISOString(),
          status: 'sent'
        };

        this.emailQueue.push(email);
        this.saveQueue();

        console.log('📧 EMAIL ENVIADO (SIMULADO):', {
          para: to,
          assunto: subject,
          corpo: body
        });

        resolve(email);
      }, 500);
    });
  }

  // Enviar confirmação de agendamento
  async sendConfirmacaoAgendamento(data) {
    const { cliente, servico, profissional, salao, agendamento } = data;

    const variables = {
      clienteNome: cliente.nome,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      profissional: profissional.nome,
      salaoNome: salao.nome,
      salaoEndereco: salao.endereco,
      salaoTelefone: salao.telefone
    };

    const subject = this.replaceVariables(this.templates.confirmacao.subject, variables);
    const body = this.replaceVariables(this.templates.confirmacao.body, variables);

    return this.sendEmail(cliente.email, subject, body);
  }

  // Enviar lembrete (24h antes)
  async sendLembreteAgendamento(data) {
    const { cliente, servico, profissional, salao, agendamento } = data;

    const variables = {
      clienteNome: cliente.nome,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      profissional: profissional.nome,
      salaoNome: salao.nome,
      salaoEndereco: salao.endereco,
      salaoTelefone: salao.telefone
    };

    const subject = this.replaceVariables(this.templates.lembrete.subject, variables);
    const body = this.replaceVariables(this.templates.lembrete.body, variables);

    return this.sendEmail(cliente.email, subject, body);
  }

  // Enviar notificação de cancelamento
  async sendCancelamentoAgendamento(data) {
    const { cliente, servico, salao, agendamento } = data;

    const variables = {
      clienteNome: cliente.nome,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      salaoNome: salao.nome,
      salaoTelefone: salao.telefone,
      linkAgenda: `${window.location.origin}/agenda/${salao.id}`
    };

    const subject = this.replaceVariables(this.templates.cancelamento.subject, variables);
    const body = this.replaceVariables(this.templates.cancelamento.body, variables);

    return this.sendEmail(cliente.email, subject, body);
  }

  // Notificar profissional sobre novo agendamento
  async sendNovoAgendamentoProfissional(data) {
    const { cliente, servico, profissional, salao, agendamento } = data;

    const variables = {
      profissionalNome: profissional.nome,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      salaoNome: salao.nome
    };

    const subject = this.replaceVariables(this.templates.novoAgendamento.subject, variables);
    const body = this.replaceVariables(this.templates.novoAgendamento.body, variables);

    return this.sendEmail(profissional.email, subject, body);
  }

  // Obter histórico de emails
  getEmailHistory() {
    return this.emailQueue.sort((a, b) => 
      new Date(b.sentAt) - new Date(a.sentAt)
    );
  }

  // Limpar histórico
  clearHistory() {
    this.emailQueue = [];
    this.saveQueue();
  }
}

// Exportar instância única
export const emailService = new EmailService();
export default emailService;