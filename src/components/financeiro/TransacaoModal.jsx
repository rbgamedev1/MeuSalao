// ============================================
// 8. src/components/financeiro/TransacaoModal.jsx
// ============================================
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
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Transação *
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Vencimento
            </label>
            <MaskedInput
              mask="date"
              name="dataVencimento"
              value={formData.dataVencimento}
              onChange={handleChange}
              placeholder="DD/MM/AAAA"
            />
            <p className="text-xs text-gray-500 mt-1">
              Para controle de contas a pagar/receber
            </p>
          </div>
        </div>

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
            placeholder="Ex: Serviço - Corte + Escova"
          />
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
              <option value="Serviços">Serviços</option>
              <option value="Produtos">Produtos</option>
              <option value="Estoque">Estoque</option>
              <option value="Fixas">Fixas</option>
              <option value="Salários">Salários</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

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
        </div>

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
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
            <option value="Pix">Pix</option>
            <option value="Boleto">Boleto</option>
            <option value="Transferência">Transferência</option>
            <option value="Débito Automático">Débito Automático</option>
          </select>
        </div>

        {formData.tipo === 'receita' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <select
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione um cliente (opcional)</option>
              {clientesSalao.map(cliente => (
                <option key={cliente.id} value={cliente.nome}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.tipo === 'despesa' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fornecedor
            </label>
            <select
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione um fornecedor (opcional)</option>
              {fornecedoresSalao.map(fornecedor => (
                <option key={fornecedor.id} value={fornecedor.nome}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </div>
        )}

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
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="recebido">Recebido</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {/* Recorrência */}
        <div className="col-span-full border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="recorrente"
              checked={formData.recorrente}
              onChange={(e) => setFormData({...formData, recorrente: e.target.checked})}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="recorrente" className="text-sm font-medium text-gray-700">
              Transação Recorrente (gerar múltiplas parcelas)
            </label>
          </div>

          {formData.recorrente && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-purple-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Recorrência
                </label>
                <select
                  value={formData.tipoRecorrencia}
                  onChange={(e) => setFormData({...formData, tipoRecorrencia: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de Parcelas
                </label>
                <input
                  type="number"
                  min="2"
                  max="60"
                  value={formData.quantidadeParcelas}
                  onChange={(e) => setFormData({...formData, quantidadeParcelas: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="col-span-full">
                <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                  💡 Serão criadas {formData.quantidadeParcelas} transações {formData.tipoRecorrencia}s 
                  de R$ {formData.valor || '0,00'} cada
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Observações */}
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Informações adicionais sobre a transação..."
          />
        </div>

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
            {editingId ? 'Salvar Alterações' : 'Cadastrar Transação'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransacaoModal;