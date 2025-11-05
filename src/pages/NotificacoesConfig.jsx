// src/pages/NotificacoesConfig.jsx - CORRIGIDO: Bloqueio para plano inicial

import { useState, useEffect, useContext } from 'react';
import { Bell, Mail, Clock, Check, X, Copy, ExternalLink, Trash2, Send, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import notificationService from '../services/notificationService';
import mailgunService from '../services/mailgunService';
import PlanRestriction from '../components/PlanRestriction';
import { hasAccess } from '../utils/planRestrictions';

const NotificacoesConfig = () => {
  const { salaoAtual } = useContext(SalaoContext);
  
  // ✅ VERIFICAÇÃO: Bloquear acesso para plano inicial
  const temAcessoNotificacoes = hasAccess(salaoAtual.plano, 'notificacoes');
  const temAcessoAgendaOnline = hasAccess(salaoAtual.plano, 'agendamentoOnline');

  // Se não tem acesso, mostrar tela de upgrade
  if (!temAcessoNotificacoes && !temAcessoAgendaOnline) {
    return <PlanRestriction feature="notificacoes" minPlan="essencial" />;
  }

  const [settings, setSettings] = useState(notificationService.getSettings());
  const [emailHistory, setEmailHistory] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadEmailHistory();
  }, []);

  const loadEmailHistory = () => {
    setEmailHistory(mailgunService.getEmailHistory());
  };

  const handleSettingChange = (key) => {
    // ✅ Bloquear mudanças se não tem acesso
    if (!temAcessoNotificacoes) {
      alert('Recurso disponível apenas no Plano Essencial ou superior. Faça upgrade para ativar notificações!');
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
    if (!temAcessoAgendaOnline) {
      alert('Agenda Online disponível apenas no Plano Essencial ou superior!');
      return;
    }

    const link = `${window.location.origin}/agenda/${salaoAtual.id}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleOpenLink = () => {
    if (!temAcessoAgendaOnline) {
      alert('Agenda Online disponível apenas no Plano Essencial ou superior!');
      return;
    }

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
    if (!temAcessoNotificacoes) {
      alert('Recurso disponível apenas no Plano Essencial ou superior!');
      return;
    }

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
      if (success) {
        loadEmailHistory();
      }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Notificações e Agenda Online</h1>
        <p className="text-gray-600 mt-1">Configure notificações e compartilhe sua agenda - {salaoAtual.nome}</p>
      </div>

      {/* ✅ ALERTA: Plano Inicial - Recursos Bloqueados */}
      {!temAcessoNotificacoes && !temAcessoAgendaOnline && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mr-3 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">⚠️ Recursos Indisponíveis no Plano Inicial</p>
              <p className="text-yellow-700 text-sm mt-2">
                As notificações automáticas e a agenda online estão disponíveis a partir do <strong>Plano Essencial</strong>.
              </p>
              <p className="text-yellow-700 text-sm mt-2">
                <strong>No Plano Essencial você terá:</strong>
              </p>
              <ul className="text-yellow-700 text-sm mt-2 ml-4 list-disc">
                <li>Agenda online com link compartilhável</li>
                <li>Notificações de confirmação por email</li>
                <li>Lembretes automáticos 24h antes</li>
                <li>Notificações de cancelamento</li>
              </ul>
              <button 
                onClick={() => window.location.href = '/configuracoes'}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
              >
                Ver Planos e Fazer Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de Configuração Mailgun */}
      {!mailgunService.isConfigured && temAcessoNotificacoes && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mr-3 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">⚠️ Mailgun não configurado</p>
              <p className="text-yellow-700 text-sm mt-1">
                Configure o Mailgun no arquivo <code className="bg-yellow-100 px-2 py-0.5 rounded">.env</code> 
                para enviar emails reais. Enquanto isso, os emails serão simulados.
              </p>
              <p className="text-yellow-700 text-xs mt-2">
                Variáveis necessárias: VITE_MAILGUN_API_KEY, VITE_MAILGUN_DOMAIN, VITE_MAILGUN_BASE_URL, VITE_MAILGUN_FROM_EMAIL
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Warning */}
      {mailgunService.isConfigured && mailgunService.mailgunConfig?.domain?.includes('sandbox') && temAcessoNotificacoes && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mr-3 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="font-semibold text-blue-800">📧 Usando Domínio Sandbox do Mailgun</p>
              <p className="text-blue-700 text-sm mt-1">
                Você está usando um domínio sandbox. Emails só podem ser enviados para <strong>destinatários autorizados</strong>.
              </p>
              <p className="text-blue-700 text-xs mt-2">
                Para enviar emails para qualquer destinatário, configure um domínio verificado no Mailgun.
              </p>
              <a 
                href="https://app.mailgun.com/mg/sending/domains" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-800 underline text-sm mt-2 inline-block hover:text-blue-900"
              >
                Gerenciar domínios no Mailgun →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Testar Envio de Email */}
      {temAcessoNotificacoes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">🧪 Testar Envio de Email</h3>
            <p className="text-sm text-gray-600 mt-1">
              Envie um email de teste para verificar se o Mailgun está funcionando
            </p>
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
                {mailgunService.mailgunConfig?.domain?.includes('sandbox') && (
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ Sandbox: use apenas emails autorizados no Mailgun
                  </p>
                )}
              </div>
              <button
                onClick={handleTestEmail}
                disabled={isTesting || !testEmail}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className={`rounded-lg p-6 text-white ${
        temAcessoAgendaOnline 
          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
          : 'bg-gray-400 opacity-60'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {temAcessoAgendaOnline ? '🌐 Sua Agenda Online' : '🔒 Agenda Online (Bloqueada)'}
            </h3>
            <p className={temAcessoAgendaOnline ? 'text-purple-100 text-sm' : 'text-gray-200 text-sm'}>
              {temAcessoAgendaOnline 
                ? 'Compartilhe este link com seus clientes para que eles possam agendar online'
                : 'Disponível a partir do Plano Essencial'}
            </p>
          </div>
          <Bell size={48} className="opacity-80" />
        </div>

        <div className={`rounded-lg p-4 backdrop-blur-sm ${
          temAcessoAgendaOnline ? 'bg-white/20' : 'bg-gray-500/20'
        }`}>
          <p className={`text-sm mb-2 ${temAcessoAgendaOnline ? 'text-purple-100' : 'text-gray-300'}`}>
            Link de Agendamento:
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={linkAgenda}
              readOnly
              disabled={!temAcessoAgendaOnline}
              className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm ${
                temAcessoAgendaOnline 
                  ? 'bg-white/90 text-gray-800' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            />
            <button
              onClick={handleCopyLink}
              disabled={!temAcessoAgendaOnline}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                temAcessoAgendaOnline
                  ? 'bg-white text-purple-600 hover:bg-purple-50'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              {linkCopied ? <Check size={18} /> : <Copy size={18} />}
              <span>{linkCopied ? 'Copiado!' : 'Copiar'}</span>
            </button>
            <button
              onClick={handleOpenLink}
              disabled={!temAcessoAgendaOnline}
              className={`px-4 py-2 rounded-lg transition-colors ${
                temAcessoAgendaOnline
                  ? 'bg-white text-purple-600 hover:bg-purple-50'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              <ExternalLink size={18} />
            </button>
          </div>
        </div>

        {temAcessoAgendaOnline && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-purple-100 mb-1">Como usar:</p>
              <p className="text-sm font-medium">1. Copie o link</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-purple-100 mb-1">Compartilhe:</p>
              <p className="text-sm font-medium">2. WhatsApp/Instagram</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-purple-100 mb-1">Pronto:</p>
              <p className="text-sm font-medium">3. Receba agendamentos</p>
            </div>
          </div>
        )}
      </div>

      {/* Configurações de Notificações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {temAcessoNotificacoes ? '⚙️ Configurações de Notificações' : '🔒 Configurações de Notificações (Bloqueadas)'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {temAcessoNotificacoes 
              ? 'Escolha quando e como receber notificações por email'
              : 'Disponível a partir do Plano Essencial'}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Confirmação */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            temAcessoNotificacoes ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${temAcessoNotificacoes ? 'bg-green-100' : 'bg-gray-200'}`}>
                <Check className={temAcessoNotificacoes ? 'text-green-600' : 'text-gray-400'} size={20} />
              </div>
              <div>
                <p className={`font-medium ${temAcessoNotificacoes ? 'text-gray-800' : 'text-gray-500'}`}>
                  Confirmação de Agendamento
                </p>
                <p className={`text-sm ${temAcessoNotificacoes ? 'text-gray-600' : 'text-gray-400'}`}>
                  Enviar email de confirmação para clientes
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.confirmacao}
                onChange={() => handleSettingChange('confirmacao')}
                disabled={!temAcessoNotificacoes}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
            </label>
          </div>

          {/* Alterações */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            temAcessoNotificacoes ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${temAcessoNotificacoes ? 'bg-orange-100' : 'bg-gray-200'}`}>
                <RefreshCw className={temAcessoNotificacoes ? 'text-orange-600' : 'text-gray-400'} size={20} />
              </div>
              <div>
                <p className={`font-medium ${temAcessoNotificacoes ? 'text-gray-800' : 'text-gray-500'}`}>
                  Notificação de Alteração
                </p>
                <p className={`text-sm ${temAcessoNotificacoes ? 'text-gray-600' : 'text-gray-400'}`}>
                  Informar sobre mudanças de data, horário ou profissional
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alteracoes}
                onChange={() => handleSettingChange('alteracoes')}
                disabled={!temAcessoNotificacoes}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
            </label>
          </div>

          {/* Lembretes */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            temAcessoNotificacoes ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${temAcessoNotificacoes ? 'bg-blue-100' : 'bg-gray-200'}`}>
                <Clock className={temAcessoNotificacoes ? 'text-blue-600' : 'text-gray-400'} size={20} />
              </div>
              <div>
                <p className={`font-medium ${temAcessoNotificacoes ? 'text-gray-800' : 'text-gray-500'}`}>
                  Lembretes Automáticos
                </p>
                <p className={`text-sm ${temAcessoNotificacoes ? 'text-gray-600' : 'text-gray-400'}`}>
                  Enviar lembrete 24h antes do agendamento
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.lembretes}
                onChange={() => handleSettingChange('lembretes')}
                disabled={!temAcessoNotificacoes}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
            </label>
          </div>

          {/* Cancelamento */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            temAcessoNotificacoes ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${temAcessoNotificacoes ? 'bg-red-100' : 'bg-gray-200'}`}>
                <X className={temAcessoNotificacoes ? 'text-red-600' : 'text-gray-400'} size={20} />
              </div>
              <div>
                <p className={`font-medium ${temAcessoNotificacoes ? 'text-gray-800' : 'text-gray-500'}`}>
                  Notificação de Cancelamento
                </p>
                <p className={`text-sm ${temAcessoNotificacoes ? 'text-gray-600' : 'text-gray-400'}`}>
                  Informar cliente sobre cancelamentos
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.cancelamento}
                onChange={() => handleSettingChange('cancelamento')}
                disabled={!temAcessoNotificacoes}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
            </label>
          </div>

          {/* Avaliações */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            temAcessoNotificacoes ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${temAcessoNotificacoes ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                <Star className={temAcessoNotificacoes ? 'text-yellow-600' : 'text-gray-400'} size={20} />
              </div>
              <div>
                <p className={`font-medium ${temAcessoNotificacoes ? 'text-gray-800' : 'text-gray-500'}`}>
                  Solicitação de Avaliação
                </p>
                <p className={`text-sm ${temAcessoNotificacoes ? 'text-gray-600' : 'text-gray-400'}`}>
                  Pedir feedback após atendimento concluído
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.avaliacoes}
                onChange={() => handleSettingChange('avaliacoes')}
                disabled={!temAcessoNotificacoes}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
            </label>
          </div>

          {/* Notificar Profissional */}
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            temAcessoNotificacoes ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${temAcessoNotificacoes ? 'bg-purple-100' : 'bg-gray-200'}`}>
                <Bell className={temAcessoNotificacoes ? 'text-purple-600' : 'text-gray-400'} size={20} />
              </div>
              <div>
                <p className={`font-medium ${temAcessoNotificacoes ? 'text-gray-800' : 'text-gray-500'}`}>
                  Notificar Profissional
                </p>
                <p className={`text-sm ${temAcessoNotificacoes ? 'text-gray-600' : 'text-gray-400'}`}>
                  Avisar profissional sobre novos agendamentos
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyProfissional}
                onChange={() => handleSettingChange('notifyProfissional')}
                disabled={!temAcessoNotificacoes}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Histórico de Emails */}
      {temAcessoNotificacoes && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">📧 Histórico de Emails Enviados</h3>
              <p className="text-sm text-gray-600 mt-1">
                {emailHistory.length} email(s) enviado(s)
              </p>
            </div>
            {emailHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={18} />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {emailHistory.length > 0 ? (
              emailHistory.slice(0, 20).map(email => (
                <div key={email.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                        {email.provider && (
                          <p className="text-xs text-gray-500 mt-1">
                            Via: {email.provider === 'mailgun' ? 'Mailgun' : 'Simulação'}
                            {email.messageId && ` • ID: ${email.messageId.substring(0, 20)}...`}
                          </p>
                        )}
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
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">{email.body}</p>
                  </div>
                  {email.error && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                      Erro: {email.error}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Mail size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhum email enviado ainda</p>
                <p className="text-sm mt-2">Os emails aparecerão aqui quando forem enviados</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Bell className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-semibold text-blue-900">
              {temAcessoNotificacoes 
                ? '💡 Recursos de Notificação Ativos:' 
                : '💡 Recursos Disponíveis no Plano Essencial:'}
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
              <li><strong>Notificação de Confirmação:</strong> Email automático ao criar agendamento</li>
              <li><strong>Notificação de Alteração:</strong> Avisa cliente quando data/horário/profissional muda</li>
              <li><strong>Lembretes Automáticos:</strong> Email 24h antes do agendamento</li>
              <li><strong>Notificação de Cancelamento:</strong> Avisa sobre cancelamentos</li>
              <li><strong>Solicitação de Avaliação:</strong> Pede feedback após atendimento concluído</li>
              <li><strong>Agenda Online:</strong> Link compartilhável para agendamentos 24/7</li>
            </ul>
            {!temAcessoNotificacoes && (
              <button 
                onClick={() => window.location.href = '/configuracoes'}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Fazer Upgrade Agora
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificacoesConfig;