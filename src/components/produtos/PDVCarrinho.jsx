// src/components/produtos/PDVCarrinho.jsx
import { ShoppingCart, Trash2, Plus, Minus, DollarSign, Percent, TrendingUp } from 'lucide-react';

const PDVCarrinho = ({
  carrinho,
  clienteSelecionado,
  setClienteSelecionado,
  clientesSalao,
  desconto,
  setDesconto,
  subtotal,
  valorDesconto,
  total,
  lucroTotal,
  alterarQuantidade,
  removerDoCarrinho,
  limparCarrinho,
  onFinalizarVenda
}) => {
  if (carrinho.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-400">
          <ShoppingCart size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Carrinho Vazio</p>
          <p className="text-sm mt-2">Adicione produtos para iniciar uma venda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header do Carrinho */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <ShoppingCart size={24} />
            <div>
              <h3 className="font-bold text-lg">Carrinho de Vendas</h3>
              <p className="text-sm opacity-90">{carrinho.length} item(ns)</p>
            </div>
          </div>
          <button
            onClick={limparCarrinho}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Itens do Carrinho */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {carrinho.map(item => (
          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.nome}</p>
              <p className="text-sm text-gray-600">{item.marca}</p>
              <p className="text-sm font-semibold text-green-600 mt-1">
                R$ {item.valorVenda.toFixed(2)} cada
              </p>
            </div>

            {/* Controles de Quantidade */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}
                className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-bold text-gray-800">
                {item.quantidade}
              </span>
              <button
                onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Subtotal e Remover */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-bold text-gray-800">
                  R$ {(item.valorVenda * item.quantidade).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removerDoCarrinho(item.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cliente e Desconto */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente (opcional)
          </label>
          <select
            value={clienteSelecionado}
            onChange={(e) => setClienteSelecionado(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione um cliente</option>
            {clientesSalao.map(cliente => (
              <option key={cliente.id} value={cliente.nome}>
                {cliente.nome} - {cliente.telefone}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
            <Percent size={16} />
            <span>Desconto (%)</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={desconto}
            onChange={(e) => setDesconto(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Resumo Financeiro */}
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

        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-purple-600">
            <TrendingUp size={16} />
            <span>Lucro Estimado:</span>
          </div>
          <span className="font-bold text-purple-600">R$ {lucroTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Botão Finalizar */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onFinalizarVenda}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-bold text-lg flex items-center justify-center space-x-2"
        >
          <DollarSign size={24} />
          <span>Finalizar Venda</span>
        </button>
      </div>
    </div>
  );
};

export default PDVCarrinho;