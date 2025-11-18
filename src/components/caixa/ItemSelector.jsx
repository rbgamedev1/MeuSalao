// src/components/caixa/ItemSelector.jsx
import { useState } from 'react';
import { Search, Package, Scissors, Plus } from 'lucide-react';

const ItemSelector = ({ servicos, produtos, profissionais, onAddItem }) => {
  const [tipo, setTipo] = useState('servico');
  const [searchTerm, setSearchTerm] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');

  const itensFiltrados = tipo === 'servico'
    ? servicos.filter(s => s.ativo && s.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    : produtos.filter(p => p.estoque > 0 && p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = (item) => {
    if (tipo === 'servico' && !profissionalSelecionado) {
      alert('Selecione um profissional para o serviço!');
      return;
    }
    onAddItem(tipo, item, 1, tipo === 'servico' ? parseInt(profissionalSelecionado) : null);
  };

  return (
    <div className="space-y-4">
      {/* Tipo de Item */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTipo('servico')}
          className={`py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
            tipo === 'servico'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Scissors size={18} />
          <span>Serviços</span>
        </button>
        <button
          onClick={() => setTipo('produto')}
          className={`py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
            tipo === 'produto'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Package size={18} />
          <span>Produtos</span>
        </button>
      </div>

      {/* Profissional (apenas para serviços) */}
      {tipo === 'servico' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profissional *
          </label>
          <select
            value={profissionalSelecionado}
            onChange={(e) => setProfissionalSelecionado(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione o profissional</option>
            {profissionais.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder={`Buscar ${tipo === 'servico' ? 'serviços' : 'produtos'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Lista de Itens */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {itensFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum {tipo === 'servico' ? 'serviço' : 'produto'} encontrado</p>
          </div>
        ) : (
          itensFiltrados.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.nome}</p>
                {tipo === 'servico' ? (
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                    <span>{item.duracao} min</span>
                    <span className="font-semibold text-green-600">R$ {item.valor.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                    <span>Estoque: {item.estoque}</span>
                    <span className="font-semibold text-green-600">R$ {item.valorVenda.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAdd(item)}
                className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemSelector;