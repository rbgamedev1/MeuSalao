// src/components/configuracoes/ConfiguracoesCategorias.jsx

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Save, Info } from 'lucide-react';
import { CATEGORIAS_SERVICOS } from '../../data/categoriasServicosData';
import { SERVICOS_DESCRICOES } from '../../data/servicosDescricoesData';
import ServicoInfoModal from './ServicoInfoModal';

const ConfiguracoesCategorias = ({ 
  categoriasServicos, 
  onToggleCategoria,
  onToggleSubcategoria,
  onToggleServico,
  onSave 
}) => {
  const [expandedCategorias, setExpandedCategorias] = useState({});
  const [expandedSubcategorias, setExpandedSubcategorias] = useState({});
  const [infoModal, setInfoModal] = useState({ isOpen: false, servico: null });

  const toggleCategoria = (categoriaId) => {
    setExpandedCategorias(prev => ({
      ...prev,
      [categoriaId]: !prev[categoriaId]
    }));
  };

  const toggleSubcategoria = (categoriaId, subcategoriaId) => {
    const key = `${categoriaId}-${subcategoriaId}`;
    setExpandedSubcategorias(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isCategoriaAtiva = (categoriaId) => {
    return categoriasServicos[categoriaId]?.subcategorias && 
           Object.values(categoriasServicos[categoriaId].subcategorias).some(
             sub => sub.servicos?.length > 0
           );
  };

  const isSubcategoriaAtiva = (categoriaId, subcategoriaId) => {
    return categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.length > 0;
  };

  const isServicoSelecionado = (categoriaId, subcategoriaId, servico) => {
    return categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.includes(servico) || false;
  };

  const handleInfoClick = (servicoNome) => {
    setInfoModal({
      isOpen: true,
      servico: servicoNome
    });
  };

  const closeInfoModal = () => {
    setInfoModal({ isOpen: false, servico: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Categorias e Serviços
        </h3>
        <p className="text-sm text-gray-600">
          Selecione os serviços específicos que você oferece em seu salão. 
          Clique no ícone <Info className="w-4 h-4 inline-block text-purple-600" /> para ver a descrição de cada serviço.
        </p>
      </div>

      <div className="space-y-3">
        {CATEGORIAS_SERVICOS.map((categoria) => {
          const categoriaAtiva = isCategoriaAtiva(categoria.id);
          const isExpanded = expandedCategorias[categoria.id];

          return (
            <div key={categoria.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header da Categoria */}
              <div className="bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleCategoria(categoria.id)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    
                    <h4 className="font-semibold text-gray-800 flex-1">
                      {categoria.nome}
                    </h4>
                    
                    {categoriaAtiva && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>

                  {categoriaAtiva && (
                    <button
                      onClick={() => onToggleCategoria(categoria.id)}
                      className="ml-3 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Desmarcar Tudo
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategorias */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {categoria.subcategorias.map((subcategoria) => {
                    const subcategoriaAtiva = isSubcategoriaAtiva(categoria.id, subcategoria.id);
                    const isSubExpanded = expandedSubcategorias[`${categoria.id}-${subcategoria.id}`];

                    return (
                      <div key={subcategoria.id} className="border border-gray-200 rounded-lg">
                        {/* Header da Subcategoria */}
                        <div className="bg-white p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <button
                                onClick={() => toggleSubcategoria(categoria.id, subcategoria.id)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                {isSubExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              
                              <h5 className="font-medium text-gray-700 flex-1">
                                {subcategoria.nome}
                              </h5>
                              
                              {subcategoriaAtiva && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  {categoriasServicos[categoria.id]?.subcategorias?.[subcategoria.id]?.servicos?.length || 0} serviços
                                </span>
                              )}
                            </div>

                            {subcategoriaAtiva && (
                              <button
                                onClick={() => onToggleSubcategoria(categoria.id, subcategoria.id)}
                                className="ml-3 text-sm text-red-600 hover:text-red-700 font-medium"
                              >
                                Desmarcar
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Lista de Serviços */}
                        {isSubExpanded && (
                          <div className="p-3 bg-gray-50 space-y-2">
                            {subcategoria.servicos.map((servico) => {
                              const isSelected = isServicoSelecionado(categoria.id, subcategoria.id, servico);

                              return (
                                <div
                                  key={servico}
                                  className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-gray-200 hover:border-purple-300 transition-colors"
                                >
                                  <label className="flex items-center gap-3 flex-1 cursor-pointer">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onToggleServico(categoria.id, subcategoria.id, servico)}
                                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                                      />
                                      {isSelected && (
                                        <Check className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none" />
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-700">
                                      {servico}
                                    </span>
                                  </label>

                                  <button
                                    onClick={() => handleInfoClick(servico)}
                                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full p-1 transition-colors"
                                    title="Ver descrição do serviço"
                                  >
                                    <Info className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
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
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      {/* Modal de Informação */}
      <ServicoInfoModal
        isOpen={infoModal.isOpen}
        onClose={closeInfoModal}
        servicoNome={infoModal.servico}
        servicoDescricao={SERVICOS_DESCRICOES[infoModal.servico]}
      />
    </div>
  );
};

export default ConfiguracoesCategorias;