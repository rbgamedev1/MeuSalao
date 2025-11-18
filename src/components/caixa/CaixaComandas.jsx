// src/components/caixa/CaixaComandas.jsx
import { useState } from 'react';
import { FileText, Plus, Clock, DollarSign, Eye, Trash2, X } from 'lucide-react';
import ComandaModal from './ComandaModal';

const CaixaComandas = ({
  comandas,
  clientes,
  servicos,
  produtos,
  profissionais,
  onCriarComanda,
  onAdicionarItem,
  onRemoverItem,
  onAlterarQuantidade,
  onFecharComanda,
  onCancelarComanda
}) => {
  const [showComandaModal, setShowComandaModal] = useState(false);
  const [comandaSelecionada, setComandaSelecionada] = useState(null);
  const [showNovaComanda, setShowNovaComanda] = useState(false);
  const [clienteNovo, setClienteNovo] = useState('');

  const comandasAbertas = comandas.filter(c => c.status === 'aberta');

  const handleVerComanda = (comanda) => {
    setComandaSelecionada(comanda);
    setShowComandaModal(true);
  };

  const handleCriarComanda = () => {
    if (!clienteNovo.trim()) {
      alert('Digite o nome do cliente!');
      return;
    }

    const cliente = clientes.find(c => c.nome.toLowerCase() === clienteNovo.toLowerCase());
    onCriarComanda(cliente, clienteNovo);
    setClienteNovo('');
    setShowNovaComanda(false);
  };

  const handleAdicionarItem = (comandaId, tipo, item, quantidade, profissionalId) => {
    const novoItem = {
      id: Date.now(),
      tipo,
      referenceId: item.id,
      nome: item.nome,
      quantidade,
      valorUnitario: tipo === 'servico' ? item.valor : item.valorVenda,
      valorTotal: (tipo === 'servico' ? item.valor : item.valorVenda) * quantidade,
      profissionalId
    };
    onAdicionarItem(comandaId, [novoItem]);
  };

  const handleRemoverItemComanda = (comandaId, itemId) => {
    if (confirm('Remover este item da comanda?')) {
      onRemoverItem(comandaId, itemId);
    }
  };

  const handleAlterarQuantidadeComanda = (comandaId, itemId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      handleRemoverItemComanda(comandaId, itemId);
      return;
    }
    onAlterarQuantidade(comandaId, itemId, novaQuantidade);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Comandas Abertas</h2>
          <p className="text-gray-600 mt-1">{comandasAbertas.length} comanda(s) em aberto</p>
        </div>
        <button
          onClick={() => setShowNovaComanda(!showNovaComanda)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nova Comanda</span>
        </button>
      </div>

      {/* Form Nova Comanda */}
      {showNovaComanda && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Criar Nova Comanda</h3>
            <button
              onClick={() => setShowNovaComanda(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <input
                type="text"
                list="clientes-list"
                value={clienteNovo}
                onChange={(e) => setClienteNovo(e.target.value)}
                placeholder="Digite ou selecione o cliente"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <datalist id="clientes-list">
                {clientes.map(c => (
                  <option key={c.id} value={c.nome} />
                ))}
              </datalist>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCriarComanda}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Comandas */}
      {comandasAbertas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg font-medium">Nenhuma comanda aberta</p>
          <p className="text-gray-400 text-sm mt-2">Clique em "Nova Comanda" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comandasAbertas.map(comanda => (
            <div
              key={comanda.id}
              className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-purple-300 transition-all overflow-hidden"
            >
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Comanda #{comanda.id}</p>
                    <h3 className="text-lg font-bold">{comanda.clienteNome}</h3>
                  </div>
                  <FileText size={32} className="opacity-50" />
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4 space-y-3">
                {/* Info */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock size={14} />
                  <span>Aberta: {comanda.dataAbertura}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Itens:</span>
                  <span className="font-semibold text-gray-800">{comanda.itens.length}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600 font-medium">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    R$ {comanda.total.toFixed(2)}
                  </span>
                </div>

                {/* Botões */}
                <div className="grid grid-cols-3 gap-2 pt-3">
                  <button
                    onClick={() => handleVerComanda(comanda)}
                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Eye size={14} />
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => onFecharComanda(comanda.id)}
                    className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <DollarSign size={14} />
                    <span>Fechar</span>
                  </button>
                  <button
                    onClick={() => onCancelarComanda(comanda.id)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Trash2 size={14} />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Comanda */}
      {comandaSelecionada && (
        <ComandaModal
          isOpen={showComandaModal}
          onClose={() => {
            setShowComandaModal(false);
            setComandaSelecionada(null);
          }}
          comanda={comandaSelecionada}
          servicos={servicos}
          produtos={produtos}
          profissionais={profissionais}
          onAdicionarItem={handleAdicionarItem}
          onRemoverItem={handleRemoverItemComanda}
          onAlterarQuantidade={handleAlterarQuantidadeComanda}
        />
      )}
    </div>
  );
};

export default CaixaComandas;