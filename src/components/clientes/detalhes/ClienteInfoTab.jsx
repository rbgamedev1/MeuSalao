// src/components/clientes/detalhes/ClienteInfoTab.jsx
import { User, Phone, Mail, Calendar, TrendingUp, Clock } from 'lucide-react';

const ClienteInfoTab = ({ cliente }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="mr-2 text-purple-600" size={20} />
            Dados Pessoais
          </h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="text-sm font-medium text-gray-800">{cliente.telefone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">{cliente.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Data de Nascimento</p>
                <p className="text-sm font-medium text-gray-800">{cliente.dataNascimento}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  cliente.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Última Visita */}
        {cliente.ultimaVisita && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <Clock className="text-blue-600" size={32} />
              <div>
                <p className="text-sm font-medium text-blue-900">Última Visita</p>
                <p className="text-2xl font-bold text-blue-700">{cliente.ultimaVisita}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Observações (se houver) */}
      {cliente.observacoes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">📝 Observações</h4>
          <p className="text-sm text-gray-700">{cliente.observacoes}</p>
        </div>
      )}
    </div>
  );
};

export default ClienteInfoTab;