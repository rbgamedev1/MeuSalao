// src/components/produtos/FornecedorModal.jsx - SEM RESTRIÇÕES DE PLANO
import { Edit, Trash2, Phone, Mail } from 'lucide-react';
import Modal from '../Modal';
import MaskedInput from '../MaskedInput';

const FornecedorModal = ({ 
  showFornecedorModal,
  handleCloseFornecedorModal,
  editingFornecedorId,
  fornecedorData,
  handleFornecedorChange,
  handleSubmitFornecedor,
  fornecedoresSalao,
  handleOpenFornecedorModal,
  handleDeleteFornecedor,
  produtosSalao
}) => {
  return (
    <Modal
      isOpen={showFornecedorModal}
      onClose={handleCloseFornecedorModal}
      title={editingFornecedorId ? 'Editar Fornecedor' : 'Novo Fornecedor'}
      size="lg"
    >
      <form onSubmit={handleSubmitFornecedor} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Fornecedor *
          </label>
          <input
            type="text"
            name="nome"
            value={fornecedorData.nome}
            onChange={handleFornecedorChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ex: Distribuidora Beauty"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <MaskedInput
              mask="phone"
              name="telefone"
              value={fornecedorData.telefone}
              onChange={handleFornecedorChange}
              required
              placeholder="(11) 3456-7890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={fornecedorData.email}
              onChange={handleFornecedorChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="contato@fornecedor.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CNPJ
          </label>
          <input
            type="text"
            name="cnpj"
            value={fornecedorData.cnpj}
            onChange={handleFornecedorChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endereço
          </label>
          <input
            type="text"
            name="endereco"
            value={fornecedorData.endereco}
            onChange={handleFornecedorChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Rua, número - bairro"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCloseFornecedorModal}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {editingFornecedorId ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
          </button>
        </div>
      </form>

      {/* Lista de Fornecedores Existentes */}
      {!editingFornecedorId && fornecedoresSalao.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">
              Fornecedores Cadastrados neste Salão
            </h4>
            <span className="text-xs text-gray-600">
              {fornecedoresSalao.length} fornecedor(es)
            </span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {fornecedoresSalao.map(forn => (
              <div key={forn.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{forn.nome}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{forn.telefone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{forn.email}</span>
                      </div>
                      {forn.cnpj && (
                        <p className="text-sm text-gray-600">CNPJ: {forn.cnpj}</p>
                      )}
                      {forn.endereco && (
                        <p className="text-sm text-gray-600">{forn.endereco}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {produtosSalao.filter(p => p.fornecedorId === forn.id).length} produto(s) cadastrados
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleOpenFornecedorModal(forn)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFornecedor(forn.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default FornecedorModal;