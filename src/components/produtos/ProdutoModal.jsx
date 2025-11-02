// src/components/produtos/ProdutoModal.jsx
import { Plus, Phone, Mail } from 'lucide-react';
import Modal from '../Modal';

const ProdutoModal = ({ 
  showModal, 
  handleCloseModal, 
  editingId, 
  formData, 
  handleChange, 
  handleSubmit,
  fornecedoresSalao,
  getFornecedor,
  handleOpenFornecedorModal,
  setShowModal,
  fornecedores
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={handleCloseModal}
      title={editingId ? 'Editar Produto' : 'Novo Produto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Shampoo Profissional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: SHMP001"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Cabelo">Cabelo</option>
              <option value="Coloração">Coloração</option>
              <option value="Unhas">Unhas</option>
              <option value="Tratamento">Tratamento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca *
            </label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: L'Oréal"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fornecedor *
          </label>
          <div className="flex space-x-2">
            {fornecedoresSalao.length > 0 ? (
              <select
                name="fornecedorId"
                value={formData.fornecedorId}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedoresSalao.map(forn => (
                  <option key={forn.id} value={forn.id}>
                    {forn.nome} - {forn.telefone}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex-1 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Nenhum fornecedor cadastrado. Cadastre um fornecedor primeiro.
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                handleOpenFornecedorModal();
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          {formData.fornecedorId && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              {(() => {
                const forn = getFornecedor(parseInt(formData.fornecedorId));
                return forn ? (
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">{forn.nome}</p>
                    <div className="flex items-center space-x-4 text-blue-700 mt-1">
                      <div className="flex items-center space-x-1">
                        <Phone size={14} />
                        <span>{forn.telefone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{forn.email}</span>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque Atual *
            </label>
            <input
              type="number"
              name="estoque"
              value={formData.estoque}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque Mínimo *
            </label>
            <input
              type="number"
              name="estoqueMinimo"
              value={formData.estoqueMinimo}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor de Custo (R$) *
            </label>
            <input
              type="number"
              name="valorCusto"
              value={formData.valorCusto}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor de Venda (R$) *
            </label>
            <input
              type="number"
              name="valorVenda"
              value={formData.valorVenda}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {formData.valorCusto && formData.valorVenda && parseFloat(formData.valorVenda) > 0 && parseFloat(formData.valorCusto) > 0 && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-medium">Margem de Lucro:</span> {' '}
              {(((parseFloat(formData.valorVenda) - parseFloat(formData.valorCusto)) / parseFloat(formData.valorCusto)) * 100).toFixed(1)}%
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={fornecedoresSalao.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProdutoModal;