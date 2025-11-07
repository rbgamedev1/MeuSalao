// src/components/financeiro/ContasPagarReceber.jsx
import { Calendar, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { dateToISO, compareDates, getTodayBR } from '../../utils/masks';

const ContasPagarReceber = ({ transacoes, handleOpenModal, setTransacoes, allTransacoes }) => {
  // Separar contas pendentes e filtrar apenas com vencimento
  const contasPendentes = transacoes
    .filter(t => t.status === 'pendente' && t.dataVencimento)
    .sort((a, b) => {
      const dataA = dateToISO(a.dataVencimento);
      const dataB = dateToISO(b.dataVencimento);
      return compareDates(dataA, dataB);
    });

  const hoje = dateToISO(getTodayBR());

  // Classificar contas
  const contasVencidas = contasPendentes.filter(t => 
    compareDates(dateToISO(t.dataVencimento), hoje) < 0
  );
  
  const contasHoje = contasPendentes.filter(t => 
    compareDates(dateToISO(t.dataVencimento), hoje) === 0
  );
  
  const proximasContas = contasPendentes.filter(t => 
    compareDates(dateToISO(t.dataVencimento), hoje) > 0
  );

  const marcarComoPago = (id, tipo) => {
    const novoStatus = tipo === 'receita' ? 'recebido' : 'pago';
    setTransacoes(allTransacoes.map(t => 
      t.id === id ? { ...t, status: novoStatus, dataPagamento: getTodayBR() } : t
    ));
  };

  const ContaCard = ({ conta, urgencia }) => {
    const urgenciaColors = {
      vencida: 'border-red-500 bg-red-50',
      hoje: 'border-yellow-500 bg-yellow-50',
      proxima: 'border-blue-500 bg-blue-50'
    };

    const urgenciaIcons = {
      vencida: <AlertCircle className="text-red-600" size={20} />,
      hoje: <Clock className="text-yellow-600" size={20} />,
      proxima: <Calendar className="text-blue-600" size={20} />
    };

    const urgenciaLabels = {
      vencida: 'Vencida',
      hoje: 'Vence Hoje',
      proxima: 'Próxima'
    };

    return (
      <div className={`border-l-4 ${urgenciaColors[urgencia]} rounded-lg p-4 hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {urgenciaIcons[urgencia]}
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                urgencia === 'vencida' ? 'bg-red-200 text-red-800' :
                urgencia === 'hoje' ? 'bg-yellow-200 text-yellow-800' :
                'bg-blue-200 text-blue-800'
              }`}>
                {urgenciaLabels[urgencia]}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                conta.tipo === 'receita' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {conta.tipo === 'receita' ? 'A Receber' : 'A Pagar'}
              </span>
            </div>
            
            <h4 className="font-semibold text-gray-800 mb-1">{conta.descricao}</h4>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Vencimento:</span> {conta.dataVencimento}
              </p>
              <p>
                <span className="font-medium">Categoria:</span> {conta.categoria}
              </p>
              {conta.cliente && (
                <p>
                  <span className="font-medium">Cliente:</span> {conta.cliente}
                </p>
              )}
              {conta.fornecedor && (
                <p>
                  <span className="font-medium">Fornecedor:</span> {conta.fornecedor}
                </p>
              )}
              <p>
                <span className="font-medium">Forma:</span> {conta.formaPagamento}
              </p>
            </div>
            
            <div className={`text-xl font-bold mt-3 ${
              conta.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
            }`}>
              R$ {conta.valor.toFixed(2)}
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            <button
              onClick={() => marcarComoPago(conta.id, conta.tipo)}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              title={conta.tipo === 'receita' ? 'Marcar como Recebido' : 'Marcar como Pago'}
            >
              <CheckCircle size={20} />
            </button>
            <button
              onClick={() => handleOpenModal(conta)}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              title="Editar"
            >
              <Calendar size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (contasPendentes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-12 text-gray-500">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-500 opacity-50" />
          <p className="text-lg font-medium">Nenhuma conta pendente!</p>
          <p className="text-sm mt-2">Todas as suas contas estão em dia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Vencidas</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{contasVencidas.length}</p>
              <p className="text-sm text-red-600 mt-1">
                R$ {contasVencidas.reduce((sum, c) => sum + c.valor, 0).toFixed(2)}
              </p>
            </div>
            <AlertCircle className="text-red-600" size={32} />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Vencem Hoje</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{contasHoje.length}</p>
              <p className="text-sm text-yellow-600 mt-1">
                R$ {contasHoje.reduce((sum, c) => sum + c.valor, 0).toFixed(2)}
              </p>
            </div>
            <Clock className="text-yellow-600" size={32} />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Próximas</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{proximasContas.length}</p>
              <p className="text-sm text-blue-600 mt-1">
                R$ {proximasContas.reduce((sum, c) => sum + c.valor, 0).toFixed(2)}
              </p>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      {/* Contas Vencidas */}
      {contasVencidas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            Contas Vencidas ({contasVencidas.length})
          </h3>
          <div className="space-y-3">
            {contasVencidas.map(conta => (
              <ContaCard key={conta.id} conta={conta} urgencia="vencida" />
            ))}
          </div>
        </div>
      )}

      {/* Contas de Hoje */}
      {contasHoje.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center">
            <Clock className="mr-2" size={20} />
            Vencem Hoje ({contasHoje.length})
          </h3>
          <div className="space-y-3">
            {contasHoje.map(conta => (
              <ContaCard key={conta.id} conta={conta} urgencia="hoje" />
            ))}
          </div>
        </div>
      )}

      {/* Próximas Contas */}
      {proximasContas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
            <Calendar className="mr-2" size={20} />
            Próximas Contas ({proximasContas.length})
          </h3>
          <div className="space-y-3">
            {proximasContas.slice(0, 10).map(conta => (
              <ContaCard key={conta.id} conta={conta} urgencia="proxima" />
            ))}
          </div>
          {proximasContas.length > 10 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              E mais {proximasContas.length - 10} contas...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContasPagarReceber;