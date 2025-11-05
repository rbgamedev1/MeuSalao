// src/pages/NotificacoesConfig.jsx - ATUALIZADO COM NOVOS NÍVEIS DE NOTIFICAÇÃO

import { useState, useEffect, useContext } from 'react';
import { Bell, Mail, Clock, Check, X, Copy, ExternalLink, Trash2, Send, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import notificationService from '../services/notificationService';
import mailgunService from '../services/mailgunService';
import { 
  hasNotificationAccess, 
  getNotificationLevelInfo,
  getMinimumPlanForNotification 
} from '../utils/planRestrictions';

const NotificacoesConfig = () => {
  const { salaoAtual } = useContext(SalaoContext);
  
  const [settings, setSettings] = useState(notificationService.getSettings());
  const [emailHistory, setEmailHistory] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Obter informações do nível de notificação do plano atual
  const notificationLevel = getNotificationLevelInfo(salaoAtual.plano);
  const hasAnyNotifications = notificationLevel.features.length > 0;

  useEffect(() => {
    loadEmailHistory();
  }, []);

  const loadEmailHistory = () => {
    setEmailHistory(mailgunService.getEmailHistory());
  };

  const handleSettingChange = (key) => {
    // Verificar se o plano permite esta notificação
    if (!hasNotificationAccess(salaoAtual.plano, key)) {
      const minPlan = getMinimumPlanForNotification(key);
      alert(`Este tipo de notificação requer o plano ${minPlan} ou superior. Faça upgrade para ativar!`);
      return;
    }

    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(newSettings);
    notificationService.saveSettings(newSettings);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/agenda/${salaoAtual.id}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleOpenLink = () => {
    const link = `${window.location.origin}/agenda/${salaoAtual.id}`;
    window.open(link, '_blank');
  };

  const handleClearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico de emails?')) {
      mailgunService.clearHistory();
      loadEmailHistory();
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      alert('Digite um email para testar');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const success = await notificationService.testNotification(testEmail);
      setTestResult({
        success,
        message: success 
          ? '✅ Email de teste enviado! Verifique sua caixa de entrada.' 
          : '❌ Erro ao enviar email. Verifique suas configurações do Mailgun.'
      });
      if (success) loadEmailHistory();
    } catch (error) {
      setTestResult({
        success: false,
        message: `❌ Erro: ${error.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const linkAgenda = `${window.location.origin}/agenda/${salaoAtual.id}`;

  // Configuração de cada tipo de notificação com seus requisitos
  const notificationTypes = [
    {
      key: 'confirmacao',
      icon: Check,
      color: 'green',
      label: 'Confirmação de Agendamento',
      description: 'Enviar email de confirmação para clientes',
      minPlan: 'inicial'
    },
    {
      key: 'cancelamento',
      icon: X,
      color: 'red',
      label: 'Notificação de Cancelamento',
      description: 'Informar cliente sobre cancelamentos',
      minPlan: 'essencial'
    },
    {
      key: 'alteracoes',
      icon: RefreshCw,
      color: 'orange',
      label: 'Notificação de Alteração',
      description: 'Informar sobre mudanças de data, horário ou profissional',
      minPlan: 'profissional'
    },
    {
      key: 'avaliacoes',
      icon: Star,
      color: 'yellow',
      label: 'Solicitação de Avaliação',
      description: 'Pedir feedback após atendimento concluído',
      minPlan: 'premium'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Notificações e Agenda Online</h1>
        <p className="text-gray-600 mt-1">Configure notificações - {salaoAtual.nome}</p>
      </div>

      {/* Info do Nível do Plano */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <Bell className="text-blue-600 mr-3 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <p className="font-semibold text-blue-900 mb-2">
              📧 {notificationLevel.name} - Plano {salaoAtual.plano}
            </p>
            <p className="text-blue-700 text-sm mb-3">{notificationLevel.description}</p>
            {notificationLevel.features.length > 0 && (
              <ul className="text-sm text-blue-700 space-y-1">
                {notificationLevel.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Alerta de Configuração Mailgun */}
      {!mailgunService.isConfigured && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mr-3 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">⚠️ Mailgun não configurado</p>
              <p className="text-yellow-700 text-sm mt-1">
                Configure o Mailgun no arquivo <code className="bg-yellow-100 px-2 py-0.5 rounded">.env</code> 
                para enviar emails reais.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Testar Envio de Email */}
      {hasAnyNotifications && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">🧪 Testar Envio de Email</h3>
          </div>
          <div className="p-6">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Teste
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleTestEmail}
                disabled={isTesting || !testEmail}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Send size={18} />
                <span>{isTesting ? 'Enviando...' : 'Enviar Teste'}</span>
              </button>
            </div>

            {testResult && (
              <div className={`mt-4 p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {testResult.message}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Link da Agenda Online */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">🌐 Sua Agenda Online</h3>
            <p className="text-purple-100 text-sm">
              Compartilhe este link com seus clientes
            </p>
          </div>
          <Bell size={48} className="opacity-80" />
        </div>

        <div className="rounded-lg p-4 bg-white/20 backdrop-blur-sm">
          <p className="text-sm mb-2 text-purple-100">Link de Agendamento:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={linkAgenda}
              readOnly
              className="flex-1 px-4 py-2 rounded-lg font-mono text-sm bg-white/90 text-gray-800"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50"
            >
              {linkCopied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              onClick={handleOpenLink}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50"
            >
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Configurações de Notificações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            ⚙️ Configurações de Notificações
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure quais notificações deseja enviar (disponibilidade varia por plano)
          </p>
        </div>

        <div className="p-6 space-y-4">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            const hasAccess = hasNotificationAccess(salaoAtual.plano, type.key);
            const isEnabled = settings[type.key];

            return (
              <div 
                key={type.key}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  hasAccess ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    hasAccess ? `bg-${type.color}-100` : 'bg-gray-200'
                  }`}>
                    <Icon className={hasAccess ? `text-${type.color}-600` : 'text-gray-400'} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className={`font-medium ${hasAccess ? 'text-gray-800' : 'text-gray-500'}`}>
                        {type.label}
                      </p>
                      {!hasAccess && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Requer {type.minPlan}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${hasAccess ? 'text-gray-600' : 'text-gray-400'}`}>
                      {type.description}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleSettingChange(type.key)}
                    disabled={!hasAccess}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Histórico de Emails */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">📧 Histórico de Emails</h3>
            <p className="text-sm text-gray-600 mt-1">
              {emailHistory.length} email(s) enviado(s)
            </p>
          </div>
          {emailHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
            >
              <Trash2 size={18} />
              <span>Limpar Histórico</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {emailHistory.length > 0 ? (
            emailHistory.slice(0, 20).map(email => (
              <div key={email.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      email.status === 'sent' ? 'bg-green-100' : 
                      email.status === 'sent_simulated' ? 'bg-blue-100' : 
                      'bg-red-100'
                    }`}>
                      <Mail className={`${
                        email.status === 'sent' ? 'text-green-600' : 
                        email.status === 'sent_simulated' ? 'text-blue-600' : 
                        'text-red-600'
                      }`} size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{email.subject}</p>
                      <p className="text-sm text-gray-600">Para: {email.to}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${
                      email.status === 'sent' ? 'text-green-600' : 
                      email.status === 'sent_simulated' ? 'text-blue-600' : 
                      'text-red-600'
                    }`}>
                      {email.status === 'sent' ? '✅ Enviado' : 
                       email.status === 'sent_simulated' ? '🔵 Simulado' : 
                       '❌ Falhou'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(email.sentAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Mail size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum email enviado ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificacoesConfig;