// src/components/produtos/FornecedoresList.jsx
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Phone, Mail, Package } from 'lucide-react';
import FornecedorModal from './FornecedorModal';

const FornecedoresList = ({
  fornecedoresSalao,
  produtosSalao,
  showFornecedorModal,
  handleCloseFornecedorModal,
  editingFornecedorId,
  fornecedorData,
  handleFornecedorChange,
  handleSubmitFornecedor,
  handleOpenFornecedorModal,
  handleDeleteFornecedor
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar fornecedores
  const fornecedoresFiltrados = fornecedoresSalao.filter(forn =>
    forn.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forn.telefone.includes(searchTerm) ||
    forn.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Contar produtos por fornecedor
  const getProdutosCount = (fornecedorId) => {
    return produtosSalao.filter(p => p.fornecedorId === fornecedorId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Fornecedores</h2>
          <p className="text-gray-600 mt-1">Gerencie seus fornecedores de produtos</p>
        </div>
        <button
          onClick={() => handleOpenFornecedorModal()}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Fornecedor</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Fornecedores</p>
              <p className="text-3xl font-bold mt-1 text-purple-600">{fornecedoresSalao.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produtos Cadastrados</p>
              <p className="text-3xl font-bold mt-1 text-blue-600">{produtosSalao.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Média por Fornecedor</p>
              <p className="text-3xl font-bold mt-1 text-green-600">
                {fornecedoresSalao.length > 0 
                  ? (produtosSalao.length / fornecedoresSalao.length).toFixed(1)
                  : '0'
                }
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Lista de Fornecedores */}
      {fornecedoresFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg font-medium">
            {searchTerm ? 'Nenhum fornecedor encontrado' : 'Nenhum fornecedor cadastrado'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm ? 'Tente outro termo de busca' : 'Clique em "Novo Fornecedor" para começar'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fornecedoresFiltrados.map(forn => (
            <div key={forn.id} className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-purple-300 transition-all">
              <div className="p-6">
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{forn.nome}</h3>
                    {forn.cnpj && (
                      <p className="text-xs text-gray-500 mt-1">CNPJ: {forn.cnpj}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenFornecedorModal(forn)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteFornecedor(forn.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Informações de Contato */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400" />
                    <span>{forn.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail size={14} className="text-gray-400" />
                    <span className="truncate">{forn.email}</span>
                  </div>
                  {forn.endereco && (
                    <p className="text-xs text-gray-500 mt-2">{forn.endereco}</p>
                  )}
                </div>

                {/* Badge de Produtos */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Package size={14} className="text-purple-600" />
                      <span>Produtos cadastrados:</span>
                    </div>
                    <span className="font-bold text-purple-600">
                      {getProdutosCount(forn.id)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Fornecedor */}
      <FornecedorModal 
        showFornecedorModal={showFornecedorModal}
        handleCloseFornecedorModal={handleCloseFornecedorModal}
        editingFornecedorId={editingFornecedorId}
        fornecedorData={fornecedorData}
        handleFornecedorChange={handleFornecedorChange}
        handleSubmitFornecedor={handleSubmitFornecedor}
        fornecedoresSalao={fornecedoresSalao}
        handleOpenFornecedorModal={handleOpenFornecedorModal}
        handleDeleteFornecedor={handleDeleteFornecedor}
        produtosSalao={produtosSalao}
      />
    </div>
  );
};

export default FornecedoresList;