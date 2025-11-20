// src/components/configuracoes/ProfissionalModal.jsx - VINCULAÇÃO DE SERVIÇOS

import Modal from '../Modal';
import MaskedInput from '../MaskedInput';
import { AlertCircle, Info } from 'lucide-react';

const ProfissionalModal = ({ 
  isOpen,
  onClose,
  editingId,
  formData,
  onChange,
  onSubmit,
  servicosDisponiveis, // Agora recebe serviços ao invés de especialidades
  onToggleServico // Renomeado de onToggleEspecialidade
}) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.nome.trim()) {
      alert('⚠️ Informe o nome do profissional!');
      return;
    }
    
    if (!formData.telefone.trim()) {
      alert('⚠️ Informe o telefone do profissional!');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('⚠️ Informe o email do profissional!');
      return;
    }
    
    // Serviços são opcionais, mas aviso se não tiver nenhum
    if (formData.especialidades.length === 0) {
      const confirmar = confirm(
        '⚠️ Atenção!\n\n' +
        'Você está cadastrando um profissional sem serviços vinculados.\n' +
        'Este profissional não poderá realizar atendimentos até que você vincule pelo menos um serviço.\n\n' +
        'Deseja continuar mesmo assim?'
      );
      
      if (!confirmar) return;
    }
    
    onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? 'Editar Profissional' : 'Novo Profissional'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            Serviços que Este Profissional Atende (Opcional)
          </label>
          
          {servicosDisponiveis.length === 0 ? (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="text-gray-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Nenhum serviço configurado
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Configure os serviços do salão na aba "Serviços" antes de vincular profissionais. 
                    Você pode cadastrar o profissional agora e adicionar serviços depois.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-2 p-4 border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                {servicosDisponiveis.map(servico => {
                  const servicoId = `${servico.categoria}-${servico.subcategoria}-${servico.nome}`;
                  const isChecked = formData.especialidades.includes(servico.nome);
                  
                  return (
                    <label 
                      key={servicoId}
                      className="flex items-start space-x-3 cursor-pointer hover:bg-purple-50 p-3 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleServico(servico.nome)}
                        className="w-4 h-4 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700 block">
                          {servico.nome}
                        </span>
                        <span className="text-xs text-gray-500">
                          {servico.categoria} → {servico.subcategoria}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
              
              {formData.especialidades.length === 0 ? (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    ⚠️ <strong>Nenhum serviço selecionado.</strong> Este profissional não poderá realizar atendimentos até que você vincule pelo menos um serviço.
                  </p>
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-xs text-gray-600">Serviços vinculados:</span>
                  {formData.especialidades.map(servico => (
                    <span 
                      key={servico}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                    >
                      {servico}
                    </span>
                  ))}
                </div>
              )}
            </>
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
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {editingId ? 'Salvar Alterações' : 'Cadastrar Profissional'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfissionalModal;