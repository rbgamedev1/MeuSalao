// src/components/configuracoes/ProfissionalModal.jsx

import Modal from '../Modal';
import MaskedInput from '../MaskedInput';

const ProfissionalModal = ({ 
  isOpen,
  onClose,
  editingId,
  formData,
  onChange,
  onSubmit,
  especialidadesDisponiveis,
  onToggleEspecialidade
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? 'Editar Profissional' : 'Novo Profissional'}
      size="md"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Digite o nome completo"
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
              value={formData.telefone}
              onChange={onChange}
              required
              placeholder="(11) 91111-1111"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especialidades *
          </label>
          <div className="grid grid-cols-2 gap-2 p-4 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
            {especialidadesDisponiveis.map(esp => (
              <label key={esp} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={formData.especialidades.includes(esp)}
                  onChange={() => onToggleEspecialidade(esp)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{esp}</span>
              </label>
            ))}
          </div>
          {formData.especialidades.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Selecione pelo menos uma especialidade</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={formData.especialidades.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingId ? 'Salvar Alterações' : 'Cadastrar Profissional'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfissionalModal;