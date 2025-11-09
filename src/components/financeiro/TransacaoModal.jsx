// src/components/financeiro/TransacaoModal.jsx
import Modal from '../Modal';
import MaskedInput from '../MaskedInput';

const TransacaoModal = ({
  showModal,
  editingId,
  formData,
  setFormData,
  handleCloseModal,
  handleSubmit,
  handleChange,
  clientesSalao,
  fornecedoresSalao
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={handleCloseModal}
      title={editingId ? 'Editar Transação' : 'Nova Transação'}
      size="md"
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-1">
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({...formData, tipo: 'receita'})}
              className={`py-3 rounded-lg font-medium transition-all ${
                formData.tipo === 'receita'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💰 Receita
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, tipo: 'despesa'})}
              className={`py-3 rounded-lg font-medium transition-all ${
                formData.tipo === 'despesa'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💸 Despesa
            </button>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <input
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={formData.tipo === 'receita' ? 'Ex: Corte + Escova' : 'Ex: Compra de produtos'}
          />
        </div>

        {/* Valor e Data */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor (R$) *
            </label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
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
              Data *
            </label>
            <MaskedInput
              mask="date"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
              placeholder="DD/MM/AAAA"
            />
          </div>
        </div>

        {/* Categoria */}
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
            <option value="">Selecione</option>
            {formData.tipo === 'receita' ? (
              <>
                <option value="Serviços">Serviços</option>
                <option value="Produtos">Venda de Produtos</option>
                <option value="Outros">Outros</option>
              </>
            ) : (
              <>
                <option value="Produtos">Compra de Produtos</option>
                <option value="Estoque">Estoque</option>
                <option value="Marketing">Marketing</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Outros">Outros</option>
              </>
            )}
          </select>
        </div>

        {/* Forma de Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Forma de Pagamento *
          </label>
          <select
            name="formaPagamento"
            value={formData.formaPagamento}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione</option>
            <option value="Dinheiro">💵 Dinheiro</option>
            <option value="Pix">📱 Pix</option>
            <option value="Cartão de Débito">💳 Cartão de Débito</option>
            <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
            <option value="Transferência">🏦 Transferência</option>
            <option value="Boleto">📄 Boleto</option>
          </select>
        </div>

        {/* Cliente ou Fornecedor */}
        {formData.tipo === 'receita' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente (opcional)
            </label>
            <select
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Nenhum</option>
              {clientesSalao.map(cliente => (
                <option key={cliente.id} value={cliente.nome}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fornecedor (opcional)
            </label>
            <select
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Nenhum</option>
              {fornecedoresSalao.map(fornecedor => (
                <option key={fornecedor.id} value={fornecedor.nome}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="pendente">⏳ Pendente</option>
            <option value={formData.tipo === 'receita' ? 'recebido' : 'pago'}>
              ✅ {formData.tipo === 'receita' ? 'Recebido' : 'Pago'}
            </option>
            <option value="cancelado">❌ Cancelado</option>
          </select>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações (opcional)
          </label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Informações adicionais..."
          />
        </div>

        {/* Botões */}
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
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {editingId ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

export default TransacaoModal;