// src/components/configuracoes/ConfiguracoesCategorias.jsx

import { Check, Info } from 'lucide-react';
import { CATEGORIAS_SERVICOS } from '../../data/categoriasServicosData';

const ConfiguracoesCategorias = ({ 
  categoriasServicos,
  onToggleCategoria,
  onToggleServico,
  onSave
}) => {
  // Verificar se categoria está selecionada
  const isCategoriaSelected = (categoriaId) => {
    return categoriasServicos[categoriaId]?.ativa || false;
  };

  // Verificar se serviço está selecionado
  const isServicoSelected = (categoriaId, servico) => {
    return categoriasServicos[categoriaId]?.servicos?.includes(servico) || false;
  };

  // Contar serviços selecionados por categoria
  const countServicosSelecionados = (categoriaId) => {
    return categoriasServicos[categoriaId]?.servicos?.length || 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-900 font-medium">
              Selecione as categorias e serviços que seu salão oferece
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Essas seleções aparecerão na página de Serviços para cadastro detalhado de cada item.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="space-y-6">
        {CATEGORIAS_SERVICOS.map((categoria) => {
          const categoriaAtiva = isCategoriaSelected(categoria.id);
          const servicosSelecionados = countServicosSelecionados(categoria.id);

          return (
            <div 
              key={categoria.id}
              className={`border rounded-lg transition-all ${
                categoriaAtiva 
                  ? 'border-purple-300 bg-purple-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Header da Categoria */}
              <div className="p-4 border-b border-gray-200">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={categoriaAtiva}
                      onChange={() => onToggleCategoria(categoria.id)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {categoria.nome}
                      </h3>
                      {categoriaAtiva && servicosSelecionados > 0 && (
                        <p className="text-sm text-purple-600 mt-1">
                          {servicosSelecionados} serviço{servicosSelecionados !== 1 ? 's' : ''} selecionado{servicosSelecionados !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  {categoriaAtiva && (
                    <Check className="text-purple-600" size={24} />
                  )}
                </label>
              </div>

              {/* Lista de Serviços (só aparece se categoria ativa) */}
              {categoriaAtiva && (
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Selecione os serviços oferecidos:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {categoria.servicos.map((servico) => {
                      const isSelected = isServicoSelected(categoria.id, servico);
                      
                      return (
                        <label 
                          key={servico}
                          className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-purple-100 hover:bg-purple-200' 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleServico(categoria.id, servico)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className={`text-sm ${
                            isSelected ? 'text-purple-900 font-medium' : 'text-gray-700'
                          }`}>
                            {servico}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Salvar Alterações
        </button>
      </div>
    </form>
  );
};

export default ConfiguracoesCategorias;