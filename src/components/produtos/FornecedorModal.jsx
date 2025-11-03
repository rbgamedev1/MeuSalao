// src/components/produtos/FornecedorModal.jsx - CÓDIGO COMPLETO COM RESTRIÇÕES
import { Edit, Trash2, Phone, Mail, Crown, Lock } from 'lucide-react';
import Modal from '../Modal';
import MaskedInput from '../MaskedInput';
import { useContext } from 'react';
import { SalaoContext } from '../../contexts/SalaoContext';
import { canAddMore, getLimitMessage } from '../../utils/planRestrictions';

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
  const { salaoAtual } = useContext(SalaoContext);
  
  // Verificar limites
  const canAddFornecedor = canAddMore(salaoAtual.plano, 'fornecedores', fornecedoresSalao.length);
  const limiteFornecedores = getLimitMessage(salaoAtual.plano, 'fornecedores');

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    
    // Verificar limite apenas ao adicionar (não ao editar)
    if (!editingFornecedorId && !canAddFornecedor) {
      alert(`Limite de fornecedores atingido para o plano ${salaoAtual.plano}. ${limiteFornecedores}\n\nFaça upgrade do seu plano para adicionar mais fornecedores.`);
      return;
    }
    
    handleSubmitFornecedor(e);
  };

  return (
    <Modal
      isOpen={showFornecedorModal}
      onClose={handleCloseFornecedorModal}
      title={editingFornecedorId ? 'Editar Fornecedor' : 'Novo Fornecedor'}
      size="lg"
    >
      {/* Alerta de Limite */}
      {!editingFornecedorId && !canAddFornecedor && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <Crown className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Limite de fornecedores atingido!</p>
              <p className="text-yellow-700 text-sm mt-1">
                Seu plano <strong>{salaoAtual.plano}</strong> permite até <strong>{limiteFornecedores.replace('Máximo: ', '')}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitWithValidation} className="space-y-4">
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
            disabled={!editingFornecedorId && !canAddFornecedor}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={!editingFornecedorId && !canAddFornecedor}
              placeholder="(11) 3456-7890"
              className={!editingFornecedorId && !canAddFornecedor ? "disabled:bg-gray-100 disabled:cursor-not-allowed" : ""}
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
              disabled={!editingFornecedorId && !canAddFornecedor}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={!editingFornecedorId && !canAddFornecedor}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={!editingFornecedorId && !canAddFornecedor}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={!editingFornecedorId && !canAddFornecedor}
            className={`px-6 py-2 rounded-lg transition-all flex items-center space-x-2 ${
              (!editingFornecedorId && !canAddFornecedor)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {(!editingFornecedorId && !canAddFornecedor) && <Lock size={16} />}
            <span>{editingFornecedorId ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}</span>
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
              {fornecedoresSalao.length} {limiteFornecedores !== 'Ilimitado' ? `/ ${limiteFornecedores.replace('Máximo: ', '')}` : ''}
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