// src/components/agendaOnline/RealtimeIndicator.jsx - Indicador de Sincronização

import { RefreshCw, CheckCircle, Wifi } from 'lucide-react';

const RealtimeIndicator = ({ isUpdating, lastUpdate, showDetails = true }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!showDetails) {
    // Versão compacta
    return (
      <div className="flex items-center space-x-2">
        {isUpdating ? (
          <>
            <RefreshCw size={14} className="text-blue-500 animate-spin" />
            <span className="text-xs text-blue-600">Atualizando...</span>
          </>
        ) : (
          <>
            <Wifi size={14} className="text-green-500" />
            <span className="text-xs text-gray-500">
              {formatTime(lastUpdate)}
            </span>
          </>
        )}
      </div>
    );
  }

  // Versão completa
  return (
    <div className={`rounded-lg p-3 transition-all ${
      isUpdating 
        ? 'bg-blue-50 border border-blue-200' 
        : 'bg-green-50 border border-green-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isUpdating ? (
            <>
              <RefreshCw size={16} className="text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-blue-800">
                Sincronizando horários...
              </span>
            </>
          ) : (
            <>
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Horários sincronizados
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-gray-600">
          <Wifi size={12} />
          <span>{formatTime(lastUpdate)}</span>
        </div>
      </div>
      
      {!isUpdating && (
        <p className="text-xs text-gray-600 mt-1">
          🔄 Atualização automática a cada 2 segundos
        </p>
      )}
    </div>
  );
};

export default RealtimeIndicator;