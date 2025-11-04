import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import { getStatusColor, formatarDuracao } from '../../utils/agendamentoUtils';

const AgendamentoLista = ({ 
  agendamentos, 
  onEdit, 
  onDelete 
}) => {
  if (agendamentos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
        <p>Nenhum agendamento encontrado para este salão.</p>
        <p className="text-sm mt-2">Clique em "Novo Agendamento" para criar o primeiro agendamento.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profissional
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {agendamentos.map((agendamento) => (
              <tr key={agendamento.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <User size={18} className="text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{agendamento.cliente?.nome || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{agendamento.cliente?.telefone || ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">{agendamento.servico?.nome || 'N/A'}</p>
                  <p className="text-sm text-gray-500">
                    {agendamento.servico?.duracao ? formatarDuracao(agendamento.servico.duracao) : ''}
                  </p>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {agendamento.profissional?.nome || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-gray-800">{agendamento.data}</p>
                      <p className="text-sm text-gray-500">{agendamento.horario}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-green-600">
                  R$ {agendamento.servico?.valor?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>
                    {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onEdit(agendamento)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(agendamento.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgendamentoLista;