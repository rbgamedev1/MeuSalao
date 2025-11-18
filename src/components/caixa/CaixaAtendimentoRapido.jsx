// src/components/caixa/CaixaAtendimentoRapido.jsx
import { ShoppingCart, Trash2, Plus, Minus, DollarSign, Percent } from 'lucide-react';
import ItemSelector from './ItemSelector';

const CaixaAtendimentoRapido = ({
  itensTemp,
  clienteSelecionado,
  setClienteSelecionado,
  clientes,
  desconto,
  setDesconto,
  observacoes,
  setObservacoes,
  subtotal,
  valorDesconto,
  total,
  servicos,
  produtos,
  profissionais,
  onAdicionarItem,
  onRemoverItem,
  onAlterarQuantidade,
  onLimpar,
  onFinalizar
}) => {
  const getProfissionalNome = (profissionalId) => {
    const prof = profissionais.find(p => p.id === profissionalId);
    return prof?.nome || 'N/A';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna Esquerda - Seleção de Itens */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Itens</h3>
          <ItemSelector
            servicos={servicos}
            produtos={produtos}
            profissionais={profissionais}
            onAddItem={onAdicionarItem}
          />
        </div>
      </div>

      {/* Coluna Direita - Carrinho */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header do Carrinho */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <ShoppingCart size={24} />
                <div>
                  <h3 className="font-bold text-lg">Venda Rápida</h3>
                  <p className="text-sm opacity-90">{itensTemp.length} item(ns)</p>
                </div>
              </div>
              {itensTemp.length > 0 && (
                <button
                  onClick={onLimpar}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Itens */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {itensTemp.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm">Nenhum item adicionado</p>
                <p className="text-xs mt-2">Adicione serviços ou produtos</p>
              </div>
            ) : (
              itensTemp.map(item => (
                <div key={item.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{item.nome}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                      <span className={`px-2 py-0.5 rounded ${
                        item.tipo === 'servico' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {item.tipo === 'servico' ? 'Serviço' : 'Produto'}
                      </span>
                      {item.tipo === 'servico' && (
                        <span className="text-xs">{getProfissionalNome(item.profissionalId)}</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      R$ {item.valorUnitario.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantidade */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onAlterarQuantidade(item.id, item.quantidade - 1)}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-gray-800">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => onAlterarQuantidade(item.id, item.quantidade + 1)}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Total e Remover */}
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-gray-800 text-sm w-16 text-right">
                      R$ {item.valorTotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => onRemoverItem(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cliente e Desconto */}
          {itensTemp.length > 0 && (
            <div className="p-4 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente (opcional)
                </label>
                <select
                  value={clienteSelecionado?.id || ''}
                  onChange={(e) => {
                    const cliente = clientes.find(c => c.id === parseInt(e.target.value));
                    setClienteSelecionado(cliente || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="">Nenhum</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.telefone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Percent size={14} />
                  <span>Desconto (%)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={desconto}
                  onChange={(e) => setDesconto(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
                  placeholder="Informações adicionais..."
                />
              </div>
            </div>
          )}

          {/* Resumo */}
          {itensTemp.length > 0 && (
            <>
              <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                {desconto > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Desconto ({desconto}%):</span>
                    <span className="font-medium">- R$ {valorDesconto.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-300">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={onFinalizar}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-bold text-lg flex items-center justify-center space-x-2"
                >
                  <DollarSign size={24} />
                  <span>Finalizar Venda</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaixaAtendimentoRapido;