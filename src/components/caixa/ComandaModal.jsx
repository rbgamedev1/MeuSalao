// src/components/caixa/ComandaModal.jsx
import { useState } from 'react';
import Modal from '../Modal';
import ItemSelector from './ItemSelector';
import { Trash2, Plus, Minus, User } from 'lucide-react';

const ComandaModal = ({ 
  isOpen, 
  onClose, 
  comanda, 
  servicos, 
  produtos, 
  profissionais,
  onAdicionarItem,
  onRemoverItem,
  onAlterarQuantidade
}) => {
  const [showAddItem, setShowAddItem] = useState(false);

  const handleAddItem = (tipo, item, quantidade, profissionalId) => {
    onAdicionarItem(comanda.id, tipo, item, quantidade, profissionalId);
    setShowAddItem(false);
  };

  const getProfissionalNome = (profissionalId) => {
    const prof = profissionais.find(p => p.id === profissionalId);
    return prof?.nome || 'N/A';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Comanda #${comanda?.id} - ${comanda?.clienteNome}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Info da Comanda */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Aberta em:</p>
              <p className="font-semibold text-gray-800">{comanda?.dataAbertura}</p>
            </div>
            <div>
              <p className="text-gray-600">Status:</p>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {comanda?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Itens da Comanda */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Itens ({comanda?.itens.length})</h3>
            <button
              onClick={() => setShowAddItem(!showAddItem)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-medium flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Adicionar Item</span>
            </button>
          </div>

          {showAddItem && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <ItemSelector
                servicos={servicos}
                produtos={produtos}
                profissionais={profissionais}
                onAddItem={handleAddItem}
              />
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {comanda?.itens.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum item adicionado ainda</p>
              </div>
            ) : (
              comanda.itens.map(item => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.nome}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        item.tipo === 'servico' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {item.tipo === 'servico' ? 'Serviço' : 'Produto'}
                      </span>
                      {item.tipo === 'servico' && (
                        <span className="flex items-center space-x-1">
                          <User size={12} />
                          <span>{getProfissionalNome(item.profissionalId)}</span>
                        </span>
                      )}
                      <span className="font-semibold text-green-600">
                        R$ {item.valorUnitario.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onAlterarQuantidade(comanda.id, item.id, item.quantidade - 1)}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => onAlterarQuantidade(comanda.id, item.id, item.quantidade + 1)}
                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Total e Remover */}
                  <div className="flex items-center space-x-3">
                    <p className="font-bold text-gray-800 w-24 text-right">
                      R$ {item.valorTotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => onRemoverItem(comanda.id, item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totais */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span className="font-medium">R$ {comanda?.subtotal.toFixed(2)}</span>
          </div>
          {comanda?.descontoTotal > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Desconto:</span>
              <span className="font-medium">- R$ {comanda?.descontoTotal.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-300">
            <span>Total:</span>
            <span className="text-green-600">R$ {comanda?.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Observações */}
        {comanda?.observacoes && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-900 mb-1">Observações:</p>
            <p className="text-sm text-blue-700">{comanda.observacoes}</p>
          </div>
        )}

        {/* Botão Fechar */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ComandaModal;