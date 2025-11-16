// src/services/mailgunService.js - COM TEMPLATES HTML COMPLETOS E PERSONALIZÁVEIS
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
    this.mailgunConfig = mailgunConfig;
    this.checkConfiguration();
  }

  checkConfiguration() {
    const validation = validateMailgunConfig();
    
    if (!validation.isValid) {
      console.warn('⚠️ Mailgun não configurado corretamente');
      return false;
    }
    
    this.isConfigured = true;
    console.log('✅ Mailgun configurado e pronto para uso');
    return true;
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

  async sendEmail(to, subject, body, htmlBody = null) {
    if (!this.isConfigured) {
      return this.sendEmailSimulado(to, subject, body);
    }

    try {
      const formData = new URLSearchParams();
      formData.append('from', `${mailgunConfig.fromName} <${mailgunConfig.fromEmail}>`);
      formData.append('to', to);
      formData.append('subject', subject);
      formData.append('text', body);
      
      if (htmlBody) {
        formData.append('html', htmlBody);
      }

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

      console.log('✅ EMAIL ENVIADO via Mailgun:', { para: to, assunto: subject });

      return email;

    } catch (error) {
      console.error('❌ Erro ao enviar email com Mailgun:', error);
      
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

        console.log('📧 EMAIL SIMULADO:', { para: to, assunto: subject });

        resolve(email);
      }, 500);
    });
  }

  // Templates padrão (fallback) - COM HTML COMPLETO
  defaultTemplates = {
    confirmacao: {
      subject: '✅ Agendamento Confirmado - {salao_nome}',
      body: `Olá {cliente_nome}!

Seu agendamento foi confirmado com sucesso! 🎉

📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}
💇 Profissional: {profissional}
📍 Local: {salao_endereco}

📞 Contato: {salao_telefone}

Aguardamos você!
Equipe {salao_nome}`,
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
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Agendamento Confirmado!</h1>
    </div>
    <div class="content">
      <p>Olá <strong>{cliente_nome}</strong>!</p>
      <p>Seu agendamento foi confirmado com sucesso! 🎉</p>
      
      <div class="info-box">
        <div class="info-item">📅 <strong>Data:</strong> {data}</div>
        <div class="info-item">🕐 <strong>Horário:</strong> {horario}</div>
        <div class="info-item">✂️ <strong>Serviço:</strong> {servico}</div>
        <div class="info-item">💇 <strong>Profissional:</strong> {profissional}</div>
        <div class="info-item">📍 <strong>Local:</strong> {salao_endereco}</div>
      </div>
      
      <p>📞 Em caso de imprevistos, entre em contato: <strong>{salao_telefone}</strong></p>
      
      <div class="footer">
        <p>Aguardamos você!</p>
        <p><strong>Equipe {salao_nome}</strong></p>
      </div>
    </div>
  </div>
</body>
</html>`
    },

    alteracao: {
      subject: '🔄 Agendamento Alterado - {salao_nome}',
      body: `Olá {cliente_nome}!

Informamos que seu agendamento foi alterado. 🔄

📅 NOVA DATA: {data}
🕐 NOVO HORÁRIO: {horario}
✂️ Serviço: {servico}
💇 PROFISSIONAL: {profissional}
📍 Local: {salao_endereco}

📞 Contato: {salao_telefone}

Equipe {salao_nome}`,
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
    .alert { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔄 Agendamento Alterado</h1>
    </div>
    <div class="content">
      <p>Olá <strong>{cliente_nome}</strong>!</p>
      <p>Informamos que seu agendamento foi <strong>alterado</strong>. 🔄</p>
      
      <div class="alert">
        <p style="margin: 0;"><strong>⚠️ Atenção:</strong> Confira as novas informações abaixo</p>
      </div>
      
      <div class="info-box">
        <div style="margin: 10px 0;">📅 <strong>NOVA DATA:</strong> {data}</div>
        <div style="margin: 10px 0;">🕐 <strong>NOVO HORÁRIO:</strong> {horario}</div>
        <div style="margin: 10px 0;">✂️ <strong>Serviço:</strong> {servico}</div>
        <div style="margin: 10px 0;">💇 <strong>PROFISSIONAL:</strong> {profissional}</div>
        <div style="margin: 10px 0;">📍 <strong>Local:</strong> {salao_endereco}</div>
      </div>
      
      <p>📞 Em caso de dúvidas, entre em contato: <strong>{salao_telefone}</strong></p>
      
      <p><strong>Equipe {salao_nome}</strong></p>
    </div>
  </div>
</body>
</html>`
    },

    avaliacao: {
      subject: '⭐ Como foi sua experiência? - {salao_nome}',
      body: `Olá {cliente_nome}!

Esperamos que tenha gostado do seu atendimento! ✨

📅 Data: {data}
✂️ Serviço: {servico}
💇 Profissional: {profissional}

Sua opinião é muito importante para nós! 
Clique no link abaixo para avaliar seu atendimento:

{link_avaliacao}

⭐⭐⭐⭐⭐

Agradecemos sua preferência!
Equipe {salao_nome}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
    .btn { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
    .stars { text-align: center; font-size: 32px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⭐ Como foi sua experiência?</h1>
    </div>
    <div class="content">
      <p>Olá <strong>{cliente_nome}</strong>!</p>
      <p>Esperamos que tenha gostado do seu atendimento! ✨</p>
      
      <div class="info-box">
        <div style="margin: 10px 0;">📅 <strong>Data:</strong> {data}</div>
        <div style="margin: 10px 0;">✂️ <strong>Serviço:</strong> {servico}</div>
        <div style="margin: 10px 0;">💇 <strong>Profissional:</strong> {profissional}</div>
      </div>
      
      <p style="text-align: center;">Sua opinião é <strong>muito importante</strong> para nós!</p>
      
      <div class="stars">⭐⭐⭐⭐⭐</div>
      
      <div style="text-align: center;">
        <a href="{link_avaliacao}" class="btn">Avaliar Atendimento</a>
      </div>
      
      <p style="text-align: center; margin-top: 20px;">Leva menos de 1 minuto! 😊</p>
      
      <div style="text-align: center; margin-top: 30px;">
        <p><strong>Agradecemos sua preferência!</strong></p>
        <p>Equipe {salao_nome}</p>
      </div>
    </div>
  </div>
</body>
</html>`
    },

    cancelamento: {
      subject: '❌ Agendamento Cancelado - {salao_nome}',
      body: `Olá {cliente_nome},

Informamos que seu agendamento foi cancelado.

📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}

Para reagendar, entre em contato conosco ou acesse nossa agenda online.

📞 Contato: {salao_telefone}
🌐 Agenda Online: {link_agenda}

Equipe {salao_nome}`,
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
      <p>Olá <strong>{cliente_nome}</strong>,</p>
      <p>Informamos que seu agendamento foi cancelado.</p>
      
      <div class="info-box">
        <div>📅 <strong>Data:</strong> {data}</div>
        <div>🕐 <strong>Horário:</strong> {horario}</div>
        <div>✂️ <strong>Serviço:</strong> {servico}</div>
      </div>
      
      <p>Para reagendar, entre em contato conosco ou acesse nossa agenda online.</p>
      
      <a href="{link_agenda}" class="btn">Agendar Novamente</a>
      
      <p style="margin-top: 20px;">📞 Contato: <strong>{salao_telefone}</strong></p>
      
      <p><strong>Equipe {salao_nome}</strong></p>
    </div>
  </div>
</body>
</html>`
    },

    aniversario: {
      subject: '🎂 Feliz Aniversário! - {salao_nome}',
      body: `Feliz Aniversário, {cliente_nome}! 🎉🎂

A equipe {salao_nome} deseja um dia muito especial para você!

🎁 Para comemorar, temos um presente especial!
[Defina aqui seu presente/desconto]

📞 Contato: {salao_telefone}
🌐 Agende: {link_agenda}

Com carinho,
Equipe {salao_nome} 💜`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #fef3c7; padding: 30px; border-radius: 0 0 10px 10px; }
    .gift-box { background: white; padding: 25px; border-radius: 12px; margin: 25px 0; border: 3px solid #ec4899; text-align: center; }
    .btn { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; font-size: 16px; }
    .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="celebration">🎂🎉🎈</div>
      <h1 style="margin: 10px 0; font-size: 32px;">Feliz Aniversário!</h1>
      <p style="font-size: 18px; margin: 10px 0;">{cliente_nome}</p>
    </div>
    <div class="content">
      <p style="font-size: 18px; text-align: center; margin-bottom: 20px;">
        A equipe <strong>{salao_nome}</strong> deseja um dia muito especial para você!
      </p>
      
      <div class="gift-box">
        <div style="font-size: 48px; margin-bottom: 15px;">🎁</div>
        <h2 style="color: #ec4899; margin: 10px 0;">Presente Especial!</h2>
        <p style="font-size: 16px; color: #666; margin: 15px 0;">
          Para comemorar seu dia, preparamos algo especial para você!
        </p>
        <p style="font-size: 14px; color: #888; font-style: italic;">
          Entre em contato para saber mais sobre sua surpresa! 🎊
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="{link_agenda}" class="btn">Agendar Seu Dia Especial</a>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ec4899;">
        <p>📞 <strong>Contato:</strong> {salao_telefone}</p>
        <p>📍 <strong>Endereço:</strong> {salao_endereco}</p>
        <p style="margin-top: 20px; font-size: 18px; color: #ec4899;">
          <strong>Com muito carinho,</strong><br>
          Equipe {salao_nome} 💜
        </p>
      </div>
    </div>
  </div>
</body>
</html>`
    },

    lembrete: {
      subject: '⏰ Lembrete: Agendamento Amanhã - {salao_nome}',
      body: `Olá {cliente_nome}!

Este é um lembrete do seu agendamento para amanhã! ⏰

📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}
💇 Profissional: {profissional}
📍 Local: {salao_endereco}

Não se esqueça! Estamos esperando você! 💜

📞 Contato: {salao_telefone}

Equipe {salao_nome}`,
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
      <p>Olá <strong>{cliente_nome}</strong>!</p>
      <p>Este é um lembrete do seu agendamento para <strong>amanhã</strong>! ⏰</p>
      
      <div class="info-box">
        <div>📅 <strong>Data:</strong> {data}</div>
        <div>🕐 <strong>Horário:</strong> {horario}</div>
        <div>✂️ <strong>Serviço:</strong> {servico}</div>
        <div>💇 <strong>Profissional:</strong> {profissional}</div>
        <div>📍 <strong>Local:</strong> {salao_endereco}</div>
      </div>
      
      <p>Não se esqueça! Estamos esperando você! 💜</p>
      <p>📞 Contato: <strong>{salao_telefone}</strong></p>
      
      <p><strong>Equipe {salao_nome}</strong></p>
    </div>
  </div>
</body>
</html>`
    },

    novoAgendamento: {
      subject: '🔔 Novo Agendamento - {salao_nome}',
      body: `Olá {profissional_nome}!

Você tem um novo agendamento! 📅

👤 Cliente: {cliente_nome}
📞 Telefone: {cliente_telefone}
📅 Data: {data}
🕐 Horário: {horario}
✂️ Serviço: {servico}

Prepare-se para oferecer um atendimento incrível! 💪

Equipe {salao_nome}`,
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
      <p>Olá <strong>{profissional_nome}</strong>!</p>
      <p>Você tem um novo agendamento! 📅</p>
      
      <div class="info-box">
        <div>👤 <strong>Cliente:</strong> {cliente_nome}</div>
        <div>📞 <strong>Telefone:</strong> {cliente_telefone}</div>
        <div>📅 <strong>Data:</strong> {data}</div>
        <div>🕐 <strong>Horário:</strong> {horario}</div>
        <div>✂️ <strong>Serviço:</strong> {servico}</div>
      </div>
      
      <p>Prepare-se para oferecer um atendimento incrível! 💪</p>
      
      <p><strong>Equipe {salao_nome}</strong></p>
    </div>
  </div>
</body>
</html>`
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
   * Obter template (customizado ou padrão)
   */
  getTemplate(tipo, customTemplate) {
    if (customTemplate && customTemplate.assunto && customTemplate.corpo) {
      return {
        subject: customTemplate.assunto,
        body: customTemplate.corpo,
        html: null // Templates personalizados não têm HTML (apenas texto)
      };
    }
    return this.defaultTemplates[tipo];
  }

  /**
   * Enviar confirmação de agendamento
   */
  async sendConfirmacaoAgendamento(data) {
    const { cliente, servico, profissional, salao, agendamento, customTemplate } = data;

    const template = this.getTemplate('confirmacao', customTemplate);

    const variables = {
      cliente_nome: cliente.nome,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      profissional: profissional.nome,
      salao_nome: salao.nome,
      salao_endereco: salao.endereco,
      salao_telefone: salao.telefone,
      link_agenda: `${window.location.origin}/agenda/${salao.id}`
    };

    const subject = this.replaceVariables(template.subject, variables);
    const body = this.replaceVariables(template.body, variables);
    const html = template.html ? this.replaceVariables(template.html, variables) : null;

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Enviar notificação de alteração
   */
  async sendAlteracaoAgendamento(data) {
    const { cliente, servico, profissional, salao, agendamento, dadosAntigos, motivoAlteracao, customTemplate } = data;

    const template = this.getTemplate('alteracao', customTemplate);

    const variables = {
      cliente_nome: cliente.nome,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      profissional: profissional.nome,
      salao_endereco: salao.endereco,
      salao_telefone: salao.telefone,
      salao_nome: salao.nome,
      link_agenda: `${window.location.origin}/agenda/${salao.id}`
    };

    const subject = this.replaceVariables(template.subject, variables);
    const body = this.replaceVariables(template.body, variables);
    const html = template.html ? this.replaceVariables(template.html, variables) : null;

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Enviar solicitação de avaliação
   */
  async sendAvaliacaoAgendamento(data) {
    const { cliente, servico, profissional, salao, agendamento, customTemplate } = data;

    const template = this.getTemplate('avaliacao', customTemplate);

    const avaliacaoToken = `${agendamento.id}-${Date.now()}`;
    const linkAvaliacao = `${window.location.origin}/avaliacao/${salao.id}/${avaliacaoToken}`;

    const variables = {
      cliente_nome: cliente.nome,
      data: agendamento.data,
      servico: servico.nome,
      profissional: profissional.nome,
      salao_nome: salao.nome,
      link_avaliacao: linkAvaliacao,
      salao_telefone: salao.telefone,
      link_agenda: `${window.location.origin}/agenda/${salao.id}`
    };

    const subject = this.replaceVariables(template.subject, variables);
    const body = this.replaceVariables(template.body, variables);
    const html = template.html ? this.replaceVariables(template.html, variables) : null;

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Enviar mensagem de aniversário
   */
  async sendAniversario(data) {
    const { cliente, salao, customTemplate } = data;

    const template = this.getTemplate('aniversario', customTemplate);

    const variables = {
      cliente_nome: cliente.nome,
      salao_nome: salao.nome,
      salao_telefone: salao.telefone,
      salao_endereco: salao.endereco,
      link_agenda: `${window.location.origin}/agenda/${salao.id}`
    };

    const subject = this.replaceVariables(template.subject, variables);
    const body = this.replaceVariables(template.body, variables);
    const html = template.html ? this.replaceVariables(template.html, variables) : null;

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Enviar lembrete (24h antes)
   */
  async sendLembreteAgendamento(data) {
    const { cliente, servico, profissional, salao, agendamento, customTemplate } = data;

    const template = this.getTemplate('lembrete', customTemplate);

    const variables = {
      cliente_nome: cliente.nome,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      profissional: profissional.nome,
      salao_nome: salao.nome,
      salao_endereco: salao.endereco,
      salao_telefone: salao.telefone
    };

    const subject = this.replaceVariables(template.subject, variables);
    const body = this.replaceVariables(template.body, variables);
    const html = template.html ? this.replaceVariables(template.html, variables) : null;

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Enviar cancelamento
   */
  async sendCancelamentoAgendamento(data) {
    const { cliente, servico, salao, agendamento, customTemplate } = data;

    const template = this.getTemplate('cancelamento', customTemplate);

    const variables = {
      cliente_nome: cliente.nome,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      salao_nome: salao.nome,
      salao_telefone: salao.telefone,
      link_agenda: `${window.location.origin}/agenda/${salao.id}`
    };

    const subject = this.replaceVariables(template.subject, variables);
    const body = this.replaceVariables(template.body, variables);
    const html = template.html ? this.replaceVariables(template.html, variables) : null;

    return this.sendEmail(cliente.email, subject, body, html);
  }

  /**
   * Notificar profissional sobre novo agendamento
   */
  async sendNovoAgendamentoProfissional(data) {
    const { cliente, servico, profissional, salao, agendamento } = data;

    const template = this.defaultTemplates.novoAgendamento;

    const variables = {
      profissional_nome: profissional.nome,
      cliente_nome: cliente.nome,
      cliente_telefone: cliente.telefone,
      data: agendamento.data,
      horario: agendamento.horario,
      servico: servico.nome,
      salao_nome: salao.nome
    };

    const subject = this.replaceVariables(template.subject, variables);
    const body = this.replaceVariables(template.body, variables);
    const html = this.replaceVariables(template.html, variables);

    return this.sendEmail(profissional.email, subject, body, html);
  }

  /**
   * Email de teste
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
}

export const mailgunService = new MailgunService();
export default mailgunService;