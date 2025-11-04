// src/services/mailgunService.js - Serviço de Email com Mailgun REAL

import { 
  mailgunConfig, 
  validateMailgunConfig, 
  getMailgunHeaders, 
  getMailgunAPIUrl 
} from '../config/mailgunConfig';

class MailgunService {
  constructor() {
    this.emailQueue = this.loadQueue();
    this.isConfigured = false;
    this.checkConfiguration();
  }

  /**
   * Verificar se está configurado
   */
  checkConfiguration() {
    const validation = validateMailgunConfig();
    
    if (!validation.isValid) {
      console.warn('⚠️ Mailgun não configurado corretamente:');
      validation.errors.forEach(error => console.warn(error));
      return false;
    }
    
    this.isConfigured = true;
    console.log('✅ Mailgun configurado e pronto para uso');
    return true;
  }

  /**
   * Carregar fila de emails do localStorage
   */
  loadQueue() {
    try {
      const saved = localStorage.getItem('emailQueue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  /**
   * Salvar fila no localStorage
   */
  saveQueue() {
    try {
      localStorage.setItem('emailQueue', JSON.stringify(this.emailQueue));
    } catch (e) {
      console.error('Erro ao salvar fila de emails:', e);
    }
  }

  /**
   * ENVIAR EMAIL REAL COM MAILGUN
   */
  async sendEmail(to, subject, body, htmlBody = null) {
    // Se não estiver configurado, usar simulação
    if (!this.isConfigured) {
      console.warn('⚠️ Mailgun não configurado. Usando modo simulação.');
      return this.sendEmailSimulado(to, subject, body);
    }

    try {
      // Preparar dados do email
      const formData = new URLSearchParams();
      formData.append('from', `${mailgunConfig.fromName} <${mailgunConfig.fromEmail}>`);
      formData.append('to', to);
      formData.append('subject', subject);
      formData.append('text', body);
      
      // Se tiver HTML, adicionar
      if (htmlBody) {
        formData.append('html', htmlBody);
      }

      // Fazer requisição para Mailgun
      const response = await fetch(getMailgunAPIUrl(), {
        method: 'POST',
        headers: getMailgunHeaders(),
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mailgun Error: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();

      // Salvar no histórico
      const email = {
        id: result.id || Date.now(),
        to,
        subject,
        body,
        htmlBody,
        sentAt: new Date().toISOString(),
        status: 'sent',
        provider: 'mailgun',
        messageId: result.id
      };

      this.emailQueue.push(email);
      this.saveQueue();

      console.log('✅ EMAIL ENVIADO COM SUCESSO via Mailgun:', {
        para: to,
        assunto: subject,
        messageId: result.id
      });

      return email;

    } catch (error) {
      console.error('❌ Erro ao enviar email com Mailgun:', error);
      
      // Salvar como falha
      const email = {
        id: Date.now(),
        to,
        subject,
        body,
        htmlBody,
        sentAt: new Date().toISOString(),
        status: 'failed',
        provider: 'mailgun',
        error: error.message
      };

      this.emailQueue.push(email);
      this.saveQueue();

      throw error;
    }
  }

  /**
   * FALLBACK: Enviar email simulado (desenvolvimento)
   */
  async sendEmailSimulado(to, subject, body) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const email = {
          id: Date.now(),
          to,
          subject,
          body,
          sentAt: new Date().toISOString(),
          status: 'sent_simulated',
          provider: 'simulacao'
        };

        this.emailQueue.push(email);
        this.saveQueue();

        console.log('📧 EMAIL SIMULADO (sem Mailgun):', {
          para: to,
          assunto: subject,
          corpo: body
        });

        resolve(email);
      }, 500);
    });
  }

  /**
   * Templates de email (mesma estrutura)
   */
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
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9333ea; }
    .info-item { margin: 10px 0; }
    .icon { display: inline-block; width: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Agendamento Confirmado!</h1>
    </div>
    <div class="content">
      <p>Olá <strong>{clienteNome}</strong>!</p>
      <p>Seu agendamento foi confirmado com sucesso! 🎉</p>
      
      <div class="info-box">
        <div class="info-item">📅 <strong>Data:</strong> {data}</div>
        <div class="info-item">🕐 <strong>Horário:</strong> {horario}</div>
        <div class="info-item">✂️ <strong>Serviço:</strong> {servico}</div>
        <div class="info-item">💇 <strong>Profissional:</strong> {profissional}</div>
        <div class="info-item">📍 <strong>Local:</strong> {salaoEndereco}</div>
      </div>
      
      <p>📞 Em caso de imprevistos, entre em contato: <strong>{salaoTelefone}</strong></p>
      
      <div class="footer">
        <p>Aguardamos você!</p>
        <p><strong>Equipe {salaoNome}</strong></p>
      </div>
    </div>
  </div>
</body>
</html>
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
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fffbeb; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Lembrete de Agendamento</h1>
    </div>
    <div class="content">
      <p>Olá <strong>{clienteNome}</strong>!</p>
      <p>Este é um lembrete do seu agendamento para <strong>amanhã</strong>! ⏰</p>
      
      <div class="info-box">
        <div>📅 <strong>Data:</strong> {data}</div>
        <div>🕐 <strong>Horário:</strong> {horario}</div>
        <div>✂️ <strong>Serviço:</strong> {servico}</div>
        <div>💇 <strong>Profissional:</strong> {profissional}</div>
        <div>📍 <strong>Local:</strong> {salaoEndereco}</div>
      </div>
      
      <p>Não se esqueça! Estamos esperando você! 💜</p>
      <p>📞 Contato: <strong>{salaoTelefone}</strong></p>
      
      <p><strong>Equipe {salaoNome}</strong></p>
    </div>
  </div>
</body>
</html>
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
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fef2f2; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
    .btn { display: inline-block; background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Agendamento Cancelado</h1>
    </div>
    <div class="content">
      <p>Olá <strong>{clienteNome}</strong>,</p>
      <p>Informamos que seu agendamento foi cancelado.</p>
      
      <div class="info-box">
        <div>📅 <strong>Data:</strong> {data}</div>
        <div>🕐 <strong>Horário:</strong> {horario}</div>
        <div>✂️ <strong>Serviço:</strong> {servico}</div>
      </div>
      
      <p>Para reagendar, entre em contato conosco ou acesse nossa agenda online.</p>
      
      <a href="{linkAgenda}" class="btn">Agendar Novamente</a>
      
      <p style="margin-top: 20px;">📞 Contato: <strong>{salaoTelefone}</strong></p>
      
      <p><strong>Equipe {salaoNome}</strong></p>
    </div>
  </div>
</body>
</html>
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
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #eff6ff; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Novo Agendamento!</h1>
    </div>
    <div class="content">
      <p>Olá <strong>{profissionalNome}</strong>!</p>
      <p>Você tem um novo agendamento! 📅</p>
      
      <div class="info-box">
        <div>👤 <strong>Cliente:</strong> {clienteNome}</div>
        <div>📞 <strong>Telefone:</strong> {clienteTelefone}</div>
        <div>📅 <strong>Data:</strong> {data}</div>
        <div>🕐 <strong>Horário:</strong> {horario}</div>
        <div>✂️ <strong>Serviço:</strong> {servico}</div>
      </div>
      
      <p>Prepare-se para oferecer um atendimento incrível! 💪</p>
      
      <p><strong>Equipe {salaoNome}</strong></p>
    </div>
  </div>
</body>
</html>
      `
    }
  };

  /**
   * Substituir variáveis no template
   */
  replaceVariables(text, variables) {
    let result = text;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      result = result.replace(regex, variables[key] || '');
    });
    return result;
  }

  /**
   * Enviar confirmação de agendamento
   */
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
    const html = this.replaceVariables(this.templates.confirmacao.html, variables);

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Enviar lembrete
   */
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
    const html = this.replaceVariables(this.templates.lembrete.html, variables);

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Enviar notificação de cancelamento
   */
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
    const html = this.replaceVariables(this.templates.cancelamento.html, variables);

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Notificar profissional
   */
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
    const html = this.replaceVariables(this.templates.novoAgendamento.html, variables);

    return this.sendEmail(profissional.email, subject, body, html);
  }

  /**
   * Obter histórico de emails
   */
  getEmailHistory() {
    return this.emailQueue.sort((a, b) => 
      new Date(b.sentAt) - new Date(a.sentAt)
    );
  }

  /**
   * Limpar histórico
   */
  clearHistory() {
    this.emailQueue = [];
    this.saveQueue();
  }

  /**
   * Testar envio de email
   */
  async testEmail(toEmail) {
    try {
      await this.sendEmail(
        toEmail,
        '🎉 Teste de Email - Sistema de Agendamentos',
        'Este é um email de teste do seu sistema de agendamentos!\n\nSe você recebeu este email, a integração com Mailgun está funcionando perfeitamente! ✅',
        `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="box">
    <h2>🎉 Teste de Email</h2>
    <p>Este é um email de teste do seu <strong>Sistema de Agendamentos</strong>!</p>
    <p>Se você recebeu este email, a integração com <strong>Mailgun</strong> está funcionando perfeitamente! ✅</p>
    <hr>
    <p><small>Enviado em: ${new Date().toLocaleString('pt-BR')}</small></p>
  </div>
</body>
</html>
        `
      );
      return true;
    } catch (error) {
      console.error('Erro no teste de email:', error);
      return false;
    }
  }
}

// Exportar instância única
export const mailgunService = new MailgunService();
export default mailgunService;