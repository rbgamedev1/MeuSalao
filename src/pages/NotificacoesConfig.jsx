// src/pages/NotificacoesConfig.jsx - Configurações e Histórico de Notificações

import { useState, useEffect, useContext } from 'react';
import { Bell, Mail, Clock, Check, X, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import notificationService from '../services/notificationService';
import emailService from '../services/emailService';

const NotificacoesConfig = () => {
  const { salaoAtual } = useContext(SalaoContext);
  const [settings, setSettings] = useState(notificationService.getSettings());
  const [emailHistory, setEmailHistory] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    loadEmailHistory();
  }, []);

  const loadEmailHistory = () => {
    setEmailHistory(emailService.getEmailHistory());
  };

  const handleSettingChange = (key) => {
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
      emailService.clearHistory();
      loadEmailHistory();
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

      {/* Link da Agenda Online */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">🌐 Sua Agenda Online</h3>
            <p className="text-purple-100 text-sm">
              Compartilhe este link com seus clientes para que eles possam agendar online
            </p>
          </div>
          <Bell size={48} className="opacity-80" />
        </div>

        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm text-purple-100 mb-2">Link de Agendamento:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={linkAgenda}
              readOnly
              className="flex-1 px-4 py-2 bg-white/90 text-gray-800 rounded-lg font-mono text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center space-x-2"
            >
              {linkCopied ? <Check size={18} /> : <Copy size={18} />}
              <span>{linkCopied ? 'Copiado!' : 'Copiar'}</span>
            </button>
            <button
              onClick={handleOpenLink}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <ExternalLink size={18} />
            </button>
          </div>
        </div>

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
      </div>

      {/* Configurações de Notificações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">⚙️ Configurações de Notificações</h3>
          <p className="text-sm text-gray-600 mt-1">Escolha quando e como receber notificações por email</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Confirmação */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Check className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Confirmação de Agendamento</p>
                <p className="text-sm text-gray-600">Enviar email de confirmação para clientes</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.confirmacao}
                onChange={() => handleSettingChange('confirmacao')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Lembretes */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Lembretes Automáticos</p>
                <p className="text-sm text-gray-600">Enviar lembrete 24h antes do agendamento</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.lembretes}
                onChange={() => handleSettingChange('lembretes')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Cancelamento */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <X className="text-red-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Notificação de Cancelamento</p>
                <p className="text-sm text-gray-600">Informar cliente sobre cancelamentos</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.cancelamento}
                onChange={() => handleSettingChange('cancelamento')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Notificar Profissional */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Bell className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Notificar Profissional</p>
                <p className="text-sm text-gray-600">Avisar profissional sobre novos agendamentos</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyProfissional}
                onChange={() => handleSettingChange('notifyProfissional')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Histórico de Emails */}
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

        <div className="divide-y divide-gray-200">
          {emailHistory.length > 0 ? (
            emailHistory.slice(0, 10).map(email => (
              <div key={email.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Mail className="text-purple-600" size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{email.subject}</p>
                      <p className="text-sm text-gray-600">Para: {email.to}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-green-600 font-medium">Enviado</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(email.sentAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{email.body}</p>
                </div>
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

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Bell className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-semibold text-blue-900">💡 Dica:</p>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Simulação de Emails:</strong> Este sistema simula o envio de emails. Em produção, 
              você deve integrar com um serviço real como SendGrid, Mailgun ou AWS SES.
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Os emails são registrados no console do navegador (F12) e salvos localmente para visualização.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificacoesConfig;