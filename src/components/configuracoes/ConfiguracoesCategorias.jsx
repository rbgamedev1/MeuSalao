// src/components/configuracoes/ConfiguracoesCategorias.jsx

import { Check, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { CATEGORIAS_SERVICOS } from '../../data/categoriasServicosData';
import { useState } from 'react';

const ConfiguracoesCategorias = ({ 
  categoriasServicos,
  onToggleCategoria,
  onToggleSubcategoria,
  onToggleServico,
  onSave
}) => {
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});
  const [subcategoriasExpandidas, setSubcategoriasExpandidas] = useState({});

  // Verificar se categoria está selecionada
  const isCategoriaSelected = (categoriaId) => {
    return categoriasServicos[categoriaId]?.ativa || false;
  };

  // Verificar se subcategoria está selecionada
  const isSubcategoriaSelected = (categoriaId, subcategoriaId) => {
    return categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.ativa || false;
  };

  // Verificar se serviço está selecionado
  const isServicoSelected = (categoriaId, subcategoriaId, servico) => {
    return categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.includes(servico) || false;
  };

  // Contar subcategorias selecionadas
  const countSubcategoriasSelecionadas = (categoriaId) => {
    if (!categoriasServicos[categoriaId]?.subcategorias) return 0;
    return Object.values(categoriasServicos[categoriaId].subcategorias).filter(sub => sub.ativa).length;
  };

  // Contar serviços selecionados em uma subcategoria
  const countServicosSelecionados = (categoriaId, subcategoriaId) => {
    return categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.length || 0;
  };

  // Toggle de expansão
  const toggleCategoriaExpansao = (categoriaId) => {
    setCategoriasExpandidas(prev => ({
      ...prev,
      [categoriaId]: !prev[categoriaId]
    }));
  };

  const toggleSubcategoriaExpansao = (categoriaId, subcategoriaId) => {
    const key = `${categoriaId}-${subcategoriaId}`;
    setSubcategoriasExpandidas(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
              Selecione as categorias, subcategorias e serviços que seu salão oferece
            </p>
            <p className="text-xs text-blue-700 mt-1">
              A estrutura é: Categoria → Subcategoria → Serviços específicos. Marque a categoria principal, depois as subcategorias e por fim os serviços de cada uma.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="space-y-4">
        {CATEGORIAS_SERVICOS.map((categoria) => {
          const categoriaAtiva = isCategoriaSelected(categoria.id);
          const subcategoriasSelecionadas = countSubcategoriasSelecionadas(categoria.id);
          const isExpanded = categoriasExpandidas[categoria.id];

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
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={categoriaAtiva}
                      onChange={() => onToggleCategoria(categoria.id)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {categoria.nome}
                      </h3>
                      {categoriaAtiva && subcategoriasSelecionadas > 0 && (
                        <p className="text-sm text-purple-600 mt-1">
                          {subcategoriasSelecionadas} subcategoria{subcategoriasSelecionadas !== 1 ? 's' : ''} selecionada{subcategoriasSelecionadas !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </label>
                  
                  <div className="flex items-center space-x-2">
                    {categoriaAtiva && <Check className="text-purple-600" size={24} />}
                    {categoriaAtiva && (
                      <button
                        type="button"
                        onClick={() => toggleCategoriaExpansao(categoria.id)}
                        className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="text-purple-600" size={20} />
                        ) : (
                          <ChevronRight className="text-purple-600" size={20} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de Subcategorias (só aparece se categoria ativa e expandida) */}
              {categoriaAtiva && isExpanded && (
                <div className="p-4 space-y-3">
                  {categoria.subcategorias.map((subcategoria) => {
                    const subcategoriaAtiva = isSubcategoriaSelected(categoria.id, subcategoria.id);
                    const servicosSelecionados = countServicosSelecionados(categoria.id, subcategoria.id);
                    const isSubExpanded = subcategoriasExpandidas[`${categoria.id}-${subcategoria.id}`];

                    return (
                      <div 
                        key={subcategoria.id}
                        className={`border rounded-lg transition-all ${
                          subcategoriaAtiva 
                            ? 'border-pink-300 bg-pink-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* Header da Subcategoria */}
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-3 cursor-pointer flex-1">
                              <input
                                type="checkbox"
                                checked={subcategoriaAtiva}
                                onChange={() => onToggleSubcategoria(categoria.id, subcategoria.id)}
                                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">
                                  {subcategoria.nome}
                                </h4>
                                {subcategoriaAtiva && servicosSelecionados > 0 && (
                                  <p className="text-xs text-pink-600 mt-1">
                                    {servicosSelecionados} serviço{servicosSelecionados !== 1 ? 's' : ''} selecionado{servicosSelecionados !== 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                            </label>
                            
                            {subcategoriaAtiva && (
                              <button
                                type="button"
                                onClick={() => toggleSubcategoriaExpansao(categoria.id, subcategoria.id)}
                                className="p-1 hover:bg-pink-100 rounded transition-colors"
                              >
                                {isSubExpanded ? (
                                  <ChevronDown className="text-pink-600" size={18} />
                                ) : (
                                  <ChevronRight className="text-pink-600" size={18} />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Lista de Serviços (só aparece se subcategoria ativa e expandida) */}
                        {subcategoriaAtiva && isSubExpanded && (
                          <div className="px-3 pb-3">
                            <div className="pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg">
                              <p className="text-xs font-medium text-gray-700 mb-2">
                                Serviços:
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {subcategoria.servicos.map((servico) => {
                                  const isSelected = isServicoSelected(categoria.id, subcategoria.id, servico);
                                  
                                  return (
                                    <label 
                                      key={servico}
                                      className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                                        isSelected 
                                          ? 'bg-green-100 hover:bg-green-200' 
                                          : 'hover:bg-gray-100'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onToggleServico(categoria.id, subcategoria.id, servico)}
                                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                      />
                                      <span className={`text-sm ${
                                        isSelected ? 'text-green-900 font-medium' : 'text-gray-700'
                                      }`}>
                                        {servico}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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