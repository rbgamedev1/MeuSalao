// src/components/servicos/ClienteSelector.jsx
import { useState } from 'react';
import { X, Check } from 'lucide-react';

const ClienteSelector = ({ clientes, onSelect, onCancel }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onCancel}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Selecione o Cliente</h3>
                <p className="text-purple-100 text-sm mt-1">Quem será atendido hoje?</p>
              </div>
              <button onClick={onCancel} className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar cliente por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredClientes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum cliente encontrado</p>
              ) : (
                filteredClientes.map(cliente => (
                  <button
                    key={cliente.id}
                    onClick={() => onSelect(cliente)}
                    className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {cliente.nome.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-800">{cliente.nome}</p>
                      <p className="text-sm text-gray-600">{cliente.telefone}</p>
                    </div>
                    <Check className="text-purple-600" size={24} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteSelector;