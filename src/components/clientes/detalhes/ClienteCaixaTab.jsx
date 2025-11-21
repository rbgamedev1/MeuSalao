// src/components/clientes/detalhes/ClienteCaixaTab.jsx - CORRIGIDO COM DEBUG
import { ShoppingCart, Calendar, Scissors, Package, TrendingUp } from 'lucide-react';

const ClienteCaixaTab = ({ compras = [], stats }) => {
  // ✅ DEBUG: Verificar o que está chegando
  console.log('📊 ClienteCaixaTab - Compras recebidas:', compras);
  console.log('📊 ClienteCaixaTab - Stats:', stats);

  const getVendaIcon = (transacao) => {
    // ✅ CORREÇÃO: Verificar múltiplas propriedades possíveis
    const categoria = transacao.categoria || '';
    const descricao = transacao.descricao || '';
    const tipo = transacao.tipoTransacao || transacao.tipo || '';
    
    console.log('🔍 Analisando transação:', { categoria, descricao, tipo, transacao });
    
    // Verificar se é serviço
    if (
      categoria === 'Serviços' || 
      categoria === 'servicos' ||
      descricao.toLowerCase().includes('serviço') ||
      descricao.toLowerCase().includes('servico') ||
      tipo === 'servico'
    ) {
      return { icon: Scissors, color: 'text-purple-500', label: 'Serviços' };
    }
    
    // Verificar se é produto
    if (
      categoria === 'Venda de Produtos' || 
      categoria === 'produtos' ||
      descricao.toLowerCase().includes('produto') ||
      descricao.toLowerCase().includes('venda') ||
      tipo === 'produto'
    ) {
      return { icon: Package, color: 'text-pink-500', label: 'Produtos' };
    }
    
    // Padrão
    return { icon: ShoppingCart, color: 'text-blue-500', label: 'Venda' };
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas Financeiras */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-green-600" size={20} />
          Estatísticas Financeiras
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-600">Total em Agendamentos</span>
            <span className="text-lg font-bold text-green-600">R$ {stats.totalGastoAgendamentos.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-600">Total em Vendas Caixa</span>
            <span className="text-lg font-bold text-blue-600">R$ {stats.totalGastoCompras.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-sm text-gray-600">Agendamentos Cancelados</span>
            <span className="text-lg font-bold text-red-600">{stats.agendamentosCancelados}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-semibold text-gray-800">Total Geral</span>
            <span className="text-2xl font-bold text-purple-600">R$ {stats.totalGeral.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Lista de Vendas */}
      {!compras || compras.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Nenhuma venda do Caixa encontrada para este cliente.</p>
          <p className="text-xs text-gray-400 mt-2">
            💡 Vendas realizadas no módulo Caixa aparecem aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {compras.map((compra) => {
            const vendaInfo = getVendaIcon(compra);
            const IconComponent = vendaInfo.icon;
            
            return (
              <div key={compra.id} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent size={16} className={vendaInfo.color} />
                      <h5 className="font-semibold text-gray-800">{compra.descricao}</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{compra.data}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          vendaInfo.label === 'Serviços'
                            ? 'bg-purple-100 text-purple-700'
                            : vendaInfo.label === 'Produtos'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {vendaInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{compra.formaPagamento || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          {compra.status === 'recebido' ? 'Pago' : compra.status || 'Pendente'}
                        </span>
                      </div>
                    </div>
                    {compra.observacoes && (
                      <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-300 pt-2">
                        📦 {compra.observacoes}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-green-600">R$ {(compra.valor || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClienteCaixaTab;