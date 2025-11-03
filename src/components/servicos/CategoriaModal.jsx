// src/components/servicos/CategoriaModal.jsx
import { useContext } from 'react';
import { Plus, Edit, Trash2, X, Crown, Lock } from 'lucide-react';
import Modal from '../Modal';
import { SalaoContext } from '../../contexts/SalaoContext';
import { canAddMore, getLimitMessage } from '../../utils/planRestrictions';

const CategoriaModal = ({ 
  showCategoriaModal, 
  handleCloseCategoriaModal,
  categorias,
  novaCategoria,
  setNovaCategoria,
  handleAddCategoria,
  categoriaEditando,
  categoriaParaEditar,
  setCategoriaEditando,
  setCategoriaParaEditar,
  handleEditCategoria,
  handleSaveEditCategoria,
  handleDeleteCategoria,
  servicosSalao
}) => {
  const { salaoAtual } = useContext(SalaoContext);
  
  // Verificar limites
  const canAddCategoria = canAddMore(salaoAtual.plano, 'categorias', categorias.length);
  const limiteCategorias = getLimitMessage(salaoAtual.plano, 'categorias');

  const handleAddWithValidation = () => {
    if (!canAddCategoria) {
      alert(`Limite de categorias atingido para o plano ${salaoAtual.plano}. ${limiteCategorias}\n\nFaça upgrade do seu plano para adicionar mais categorias.`);
      return;
    }
    handleAddCategoria();
  };

  return (
    <Modal
      isOpen={showCategoriaModal}
      onClose={handleCloseCategoriaModal}
      title="Gerenciar Categorias"
      size="md"
    >
      <div className="space-y-4">
        {/* Alerta de Limite */}
        {!canAddCategoria && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <Crown className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-yellow-800">Limite de categorias atingido!</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Seu plano <strong>{salaoAtual.plano}</strong> permite até <strong>{limiteCategorias.replace('Máximo: ', '')}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info do Plano */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            Categorias: <strong>{categorias.length}</strong> {limiteCategorias !== 'Ilimitado' ? `/ ${limiteCategorias.replace('Máximo: ', '')}` : '(Ilimitado)'}
          </p>
        </div>

        {/* Adicionar Nova Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nova Categoria
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWithValidation()}
              disabled={!canAddCategoria}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={canAddCategoria ? "Digite o nome da categoria" : "Limite atingido"}
            />
            <button
              onClick={handleAddWithValidation}
              disabled={!canAddCategoria}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                canAddCategoria
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canAddCategoria ? <Plus size={20} /> : <Lock size={20} />}
            </button>
          </div>
        </div>

        {/* Lista de Categorias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorias Existentes
          </label>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categorias.map((categoria) => (
              <div key={categoria} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                {categoriaEditando === categoria ? (
                  <>
                    <input
                      type="text"
                      value={categoriaParaEditar}
                      onChange={(e) => setCategoriaParaEditar(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex space-x-2 ml-2">
                      <button
                        onClick={handleSaveEditCategoria}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setCategoriaEditando('');
                          setCategoriaParaEditar('');
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-800">{categoria}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {servicosSalao.filter(s => s.categoria === categoria).length} serviço(s)
                      </span>
                      <button
                        onClick={() => handleEditCategoria(categoria)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategoria(categoria)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoriaModal;