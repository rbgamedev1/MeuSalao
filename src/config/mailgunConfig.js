// src/config/mailgunConfig.js - Configuração do Mailgun

/**
 * CONFIGURAÇÃO DO MAILGUN
 * 
 * 1. Criar conta em: https://www.mailgun.com/
 * 2. Verificar domínio (ou usar sandbox)
 * 3. Obter API Key em: Settings > API Keys
 * 4. Criar arquivo .env na raiz do projeto
 */

// IMPORTANTE: Nunca commite suas chaves reais no Git!
// Use variáveis de ambiente

export const mailgunConfig = {
  // Sua API Key do Mailgun
  // Obtida em: Dashboard > Settings > API Keys
  apiKey: import.meta.env.VITE_MAILGUN_API_KEY,
  
  // Seu domínio do Mailgun
  // Exemplo: 'sandbox123.mailgun.org' (sandbox para testes)
  // Ou: 'mg.seudominio.com' (domínio verificado para produção)
  domain: import.meta.env.VITE_MAILGUN_DOMAIN,
  
  // Região do servidor (US ou EU)
  // US: 'https://api.mailgun.net'
  // EU: 'https://api.eu.mailgun.net'
  baseURL: import.meta.env.VITE_MAILGUN_BASE_URL,
  
  // Email remetente padrão
  // Para sandbox: authorized-recipient@seudominio.com
  // Para produção: noreply@seudominio.com
  fromEmail: import.meta.env.VITE_MAILGUN_FROM_EMAIL,
  fromName: import.meta.env.VITE_MAILGUN_FROM_NAME,
};

/**
 * Validar configuração
 */
export const validateMailgunConfig = () => {
  const errors = [];
  
  if (!mailgunConfig.apiKey) {
    errors.push('❌ API Key do Mailgun não configurada');
  }
  
  if (!mailgunConfig.domain) {
    errors.push('⚠️ Usando domínio sandbox (apenas para testes)');
  }
  
  if (!mailgunConfig.fromEmail) {
    errors.push('⚠️ Email remetente não configurado');
  }
  
  return {
    isValid: errors.filter(e => e.startsWith('❌')).length === 0,
    errors
  };
};

/**
 * Obter headers para requisições
 */
export const getMailgunHeaders = () => {
  return {
    'Authorization': `Basic ${btoa(`api:${mailgunConfig.apiKey}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
};

/**
 * Obter URL da API
 */
export const getMailgunAPIUrl = () => {
  return `${mailgunConfig.baseURL}/v3/${mailgunConfig.domain}/messages`;
};

export default mailgunConfig;