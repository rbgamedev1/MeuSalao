// src/components/servicos/ServicoModal.jsx
import { useContext } from 'react';
import { Lock, Crown } from 'lucide-react';
import Modal from '../Modal';
import { SalaoContext } from '../../contexts/SalaoContext';
import { canAddMore, getLimitMessage, canAddServiceToCategory } from '../../utils/planRestrictions';

const ServicoModal = ({ 
  showModal, 
  handleCloseModal, 
  editingId, 
  formData, 
  handleChange,
  handleProfissionalToggle,
  handleSubmit,
  categorias,
  profissionaisSalao,
  durationOptions,
  servicosSalao
}) => {
  const { salaoAtual } = useContext(SalaoContext);
  
  // Verificar limites
  const canAddServico = canAddMore(salaoAtual.plano, 'servicosPorCategoria', servicosSalao.length);
  const limiteServicos = getLimitMessage(salaoAtual.plano, 'servicosPorCategoria');
  
  // Verificar limite específico da categoria selecionada
  const canAddToCategory = formData.categoria 
    ? canAddServiceToCategory(salaoAtual.plano, formData.categoria, servicosSalao)
    : true;

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    
    // Verificar limite apenas ao adicionar (não ao editar)
    if (!editingId) {
      if (!canAddServico) {
        alert(`Limite geral de serviços atingido para o plano ${salaoAtual.plano}. ${limiteServicos}\n\nFaça upgrade do seu plano para adicionar mais serviços.`);
        return;
      }
      
      if (!canAddToCategory) {
        const servicosNaCategoria = servicosSalao.filter(s => s.categoria === formData.categoria).length;
        alert(`Limite de serviços por categoria atingido!\n\nSeu plano ${salaoAtual.plano} permite ${limiteServicos.replace('Máximo: ', '')} por categoria.\nA categoria "${formData.categoria}" já possui ${servicosNaCategoria} serviço(s).\n\nFaça upgrade para adicionar mais serviços.`);
        return;
      }
    }
    
    handleSubmit(e);
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={handleCloseModal}
      title={editingId ? 'Editar Serviço' : 'Novo Serviço'}
      size="lg"
    >
      {/* Alerta de Limite */}
      {!editingId && (!canAddServico || !canAddToCategory) && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <Crown className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Limite de serviços atingido!</p>
              <p className="text-yellow-700 text-sm mt-1">
                Seu plano <strong>{salaoAtual.plano}</strong> permite até <strong>{limiteServicos.replace('Máximo: ', '')}</strong> por categoria.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitWithValidation} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Serviço *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            disabled={!editingId && (!canAddServico || !canAddToCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Ex: Corte Feminino"
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
              disabled={!editingId && (!canAddServico || !canAddToCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => {
                const servicosNaCategoria = servicosSalao.filter(s => s.categoria === cat).length;
                const limiteNumerico = parseInt(limiteServicos.replace('Máximo: ', '')) || Infinity;
                const atingiuLimite = servicosNaCategoria >= limiteNumerico;
                
                return (
                  <option key={cat} value={cat}>
                    {cat} {atingiuLimite && !editingId ? '(Limite atingido)' : `(${servicosNaCategoria})`}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração *
            </label>
            <select
              name="duracao"
              value={formData.duracao}
              onChange={handleChange}
              required
              disabled={!editingId && (!canAddServico || !canAddToCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {durationOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              disabled={!editingId && (!canAddServico || !canAddToCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comissão (%) *
            </label>
            <input
              type="number"
              name="comissao"
              value={formData.comissao}
              onChange={handleChange}
              required
              min="0"
              max="100"
              disabled={!editingId && (!canAddServico || !canAddToCategory)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            rows="3"
            disabled={!editingId && (!canAddServico || !canAddToCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Descreva o serviço..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profissionais Habilitados *
          </label>
          {profissionaisSalao.length > 0 ? (
            <div className="space-y-2 p-4 border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
              {profissionaisSalao.map(prof => (
                <label key={prof.id} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.profissionaisHabilitados.includes(prof.id)}
                    onChange={() => handleProfissionalToggle(prof.id)}
                    disabled={!editingId && (!canAddServico || !canAddToCategory)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">{prof.nome}</span>
                    <p className="text-xs text-gray-500">{prof.especialidades.join(', ')}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Nenhum profissional cadastrado neste salão. Cadastre profissionais em Configurações primeiro.
              </p>
            </div>
          )}
          {profissionaisSalao.length > 0 && formData.profissionaisHabilitados.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Selecione pelo menos um profissional</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="ativo"
            checked={formData.ativo}
            onChange={handleChange}
            disabled={!editingId && (!canAddServico || !canAddToCategory)}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:cursor-not-allowed"
          />
          <label className="ml-2 text-sm text-gray-700">
            Serviço ativo
          </label>
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
            disabled={
              profissionaisSalao.length === 0 || 
              formData.profissionaisHabilitados.length === 0 ||
              (!editingId && (!canAddServico || !canAddToCategory))
            }
            className={`px-6 py-2 rounded-lg transition-all flex items-center space-x-2 ${
              (profissionaisSalao.length === 0 || formData.profissionaisHabilitados.length === 0 || (!editingId && (!canAddServico || !canAddToCategory)))
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {(!editingId && (!canAddServico || !canAddToCategory)) && <Lock size={16} />}
            <span>{editingId ? 'Salvar Alterações' : 'Cadastrar Serviço'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ServicoModal;