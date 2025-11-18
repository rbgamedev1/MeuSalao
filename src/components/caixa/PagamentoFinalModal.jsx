// src/components/caixa/PagamentoFinalModal.jsx
import { useState } from 'react';
import Modal from '../Modal';
import { CreditCard, DollarSign, Smartphone, Building, Banknote } from 'lucide-react';

const PagamentoFinalModal = ({ isOpen, onClose, onConfirm, total, tipo = 'venda' }) => {
  const [formaPagamento, setFormaPagamento] = useState('');

  const formasPagamento = [
    { id: 'Dinheiro', label: 'Dinheiro', icon: DollarSign, color: 'green' },
    { id: 'Pix', label: 'Pix', icon: Smartphone, color: 'blue' },
    { id: 'Cartão de Débito', label: 'Débito', icon: CreditCard, color: 'purple' },
    { id: 'Cartão de Crédito', label: 'Crédito', icon: CreditCard, color: 'orange' },
    { id: 'Transferência', label: 'Transferência', icon: Building, color: 'indigo' }
  ];

  const handleConfirm = () => {
    if (!formaPagamento) {
      alert('Selecione uma forma de pagamento!');
      return;
    }
    onConfirm(formaPagamento);
    setFormaPagamento('');
  };

  const handleClose = () => {
    setFormaPagamento('');
    onClose();
  };

  const colorClasses = {
    green: 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100',
    blue: 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100',
    purple: 'border-purple-500 bg-purple-50 text-purple-700 hover:bg-purple-100',
    orange: 'border-orange-500 bg-orange-50 text-orange-700 hover:bg-orange-100',
    indigo: 'border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={tipo === 'comanda' ? 'Fechar Comanda' : 'Finalizar Venda'}
      size="md"
    >
      <div className="space-y-6">
        {/* Valor Total */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6 text-center">
          <p className="text-sm opacity-90 mb-2">Valor Total</p>
          <p className="text-4xl font-bold">R$ {total.toFixed(2)}</p>
        </div>

        {/* Formas de Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecione a forma de pagamento *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {formasPagamento.map(forma => {
              const Icon = forma.icon;
              const isSelected = formaPagamento === forma.id;
              
              return (
                <button
                  key={forma.id}
                  onClick={() => setFormaPagamento(forma.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? colorClasses[forma.color]
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={24} className="mx-auto mb-2" />
                  <p className="font-medium text-sm">{forma.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botões */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!formaPagamento}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar {tipo === 'comanda' ? 'Fechamento' : 'Venda'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PagamentoFinalModal;