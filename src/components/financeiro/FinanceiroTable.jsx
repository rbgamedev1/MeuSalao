// src/components/financeiro/FinanceiroTable.jsx
import { Calendar, Edit, Trash2, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { dateToISO, compareDates, getTodayBR } from '../../utils/masks';

const FinanceiroTable = ({ filteredTransacoes, handleOpenModal, handleDelete }) => {
  const hoje = dateToISO(getTodayBR());

  const getStatusBadge = (transacao) => {
    const statusConfig = {
      pendente: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendente', icon: Clock },
      pago: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pago', icon: CheckCircle },
      recebido: { bg: 'bg-green-100', text: 'text-green-700', label: 'Recebido', icon: CheckCircle },
      cancelado: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelado', icon: null }
    };

    const config = statusConfig[transacao.status] || statusConfig.pendente;
    const Icon = config.icon;

    // Verificar se está vencida
    const isVencida = transacao.status === 'pendente' && 
                      transacao.dataVencimento && 
                      compareDates(dateToISO(transacao.dataVencimento), hoje) < 0;

    if (isVencida) {
      return (
        <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
          <AlertCircle size={14} />
          <span>Vencida</span>
        </span>
      );
    }

    return (
      <span className={`flex items-center space-x-1 px-3 py-1 ${config.bg} ${config.text} text-xs rounded-full`}>
        {Icon && <Icon size={14} />}
        <span>{config.label}</span>
      </span>
    );
  };

  if (filteredTransacoes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-12 text-gray-500">
          <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhuma transação encontrada para este salão.</p>
          <p className="text-sm mt-2">Clique em "Nova Transação" para adicionar a primeira transação.</p>
        </div>
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
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data / Vencimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Forma Pagamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransacoes.map((transacao) => (
              <tr key={transacao.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{transacao.descricao}</p>
                    <p className="text-sm text-gray-500">
                      {transacao.cliente || transacao.fornecedor}
                    </p>
                    {transacao.parcelaAtual && (
                      <p className="text-xs text-purple-600 mt-1">
                        Parcela {transacao.parcelaAtual}/{transacao.totalParcelas}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {transacao.categoria}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-700">{transacao.data}</span>
                    </div>
                    {transacao.dataVencimento && (
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600">Venc: {transacao.dataVencimento}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {transacao.formaPagamento}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(transacao)}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${
                    transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transacao.tipo === 'receita' ? '+' : '-'} R$ {transacao.valor.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpenModal(transacao)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(transacao.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
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

export default FinanceiroTable;