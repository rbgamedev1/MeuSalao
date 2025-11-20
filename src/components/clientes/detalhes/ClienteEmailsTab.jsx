// src/components/clientes/detalhes/ClienteEmailsTab.jsx
import { Send, CheckCircle, XCircle, AlertCircle, MessageSquare, Calendar } from 'lucide-react';

const ClienteEmailsTab = ({ emails }) => {
  const getEmailIcon = (tipo) => {
    const icons = {
      confirmacao: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Confirmação' },
      cancelamento: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelamento' },
      alteracao: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Alteração' },
      avaliacao: { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Avaliação' },
      aniversario: { icon: Calendar, color: 'text-pink-600', bg: 'bg-pink-100', label: 'Aniversário' }
    };
    return icons[tipo] || { icon: Send, color: 'text-gray-600', bg: 'bg-gray-100', label: tipo };
  };

  const getEmailStatusBadge = (status) => {
    const badges = {
      enviado: 'bg-green-100 text-green-700',
      falhado: 'bg-red-100 text-red-700',
      pendente: 'bg-yellow-100 text-yellow-700',
      entregue: 'bg-blue-100 text-blue-700'
    };
    const colorClass = badges[status] || 'bg-gray-100 text-gray-700';
    return <span className={`px-2 py-1 ${colorClass} text-xs rounded-full font-medium`}>{status}</span>;
  };

  if (emails.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <Send size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Nenhum email enviado para este cliente ainda.</p>
        <p className="text-xs text-gray-400 mt-2">
          📧 Os emails serão registrados automaticamente quando enviados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {emails.map((email, index) => {
        const emailInfo = getEmailIcon(email.tipo);
        const IconComponent = emailInfo.icon;
        
        return (
          <div key={index} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${emailInfo.bg} flex-shrink-0`}>
                <IconComponent className={emailInfo.color} size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">{emailInfo.label}</span>
                    {getEmailStatusBadge(email.status || 'enviado')}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(email.dataEnvio).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  📧 {email.assunto}
                </p>
                {email.agendamentoId && (
                  <p className="text-xs text-gray-500">
                    🔗 Relacionado ao agendamento #{email.agendamentoId}
                  </p>
                )}
                {email.erro && (
                  <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-200">
                    ⚠️ Erro: {email.erro}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClienteEmailsTab;