// src/components/financeiro/DespesasFixasModal.jsx
import Modal from '../Modal';

const DespesasFixasModal = ({
  showModal,
  editingId,
  formData,
  setFormData,
  handleCloseModal,
  handleSubmit,
  handleChange,
  tiposDespesasFixas,
  fornecedoresSalao
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={handleCloseModal}
      title={editingId ? 'Editar Despesa Fixa' : 'Nova Despesa Fixa Mensal'}
      size="md"
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-1">
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Despesas fixas</strong> são cobranças mensais recorrentes que aparecem automaticamente 
            nas contas a pagar todo mês.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Despesa *
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {tiposDespesasFixas.map(tipo => (
              <option key={tipo.valor} value={tipo.valor}>
                {tipo.icon} {tipo.valor}
              </option>
            ))}
          </select>
        </div>

        {formData.tipo === 'Outros' && (
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
              placeholder="Ex: Manutenção de equipamentos"
            />
          </div>
        )}

        {formData.tipo !== 'Outros' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição Adicional (opcional)
            </label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Unidade Centro"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Mensal (R$) *
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
              Dia do Vencimento *
            </label>
            <select
              name="diaVencimento"
              value={formData.diaVencimento}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map(dia => (
                <option key={dia} value={dia}>
                  Dia {dia}
                </option>
              ))}
            </select>
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
            <option value="Boleto">Boleto</option>
            <option value="Débito Automático">Débito Automático</option>
            <option value="Transferência">Transferência</option>
            <option value="Pix">Pix</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Dinheiro">Dinheiro</option>
          </select>
        </div>

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
            <option value="">Selecione ou deixe em branco</option>
            {fornecedoresSalao.map(fornecedor => (
              <option key={fornecedor.id} value={fornecedor.nome}>
                {fornecedor.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações
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

        {editingId && (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="ativa"
              checked={formData.ativa}
              onChange={(e) => setFormData({...formData, ativa: e.target.checked})}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="ativa" className="text-sm text-gray-700">
              Despesa ativa (desmarque para pausar sem excluir)
            </label>
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
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {editingId ? 'Salvar Alterações' : 'Cadastrar Despesa Fixa'}
          </button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

export default DespesasFixasModal;