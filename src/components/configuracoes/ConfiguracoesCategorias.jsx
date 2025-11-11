// src/components/configuracoes/ConfiguracoesCategorias.jsx

import { Check, Info, ChevronDown, Plus, Minus, Sparkles } from 'lucide-react';
import { CATEGORIAS_SERVICOS } from '../../data/categoriasServicosData';
import { useState } from 'react';

const ConfiguracoesCategorias = ({ 
  categoriasServicos,
  onToggleCategoria,
  onToggleSubcategoria,
  onToggleServico,
  onSave
}) => {
  const [categoriaAberta, setCategoriaAberta] = useState(null);
  const [subcategoriaAberta, setSubcategoriaAberta] = useState(null);

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

  // Contar seleções
  const countSubcategoriasSelecionadas = (categoriaId) => {
    if (!categoriasServicos[categoriaId]?.subcategorias) return 0;
    return Object.values(categoriasServicos[categoriaId].subcategorias).filter(sub => sub.ativa).length;
  };

  const countServicosSelecionados = (categoriaId, subcategoriaId) => {
    return categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.length || 0;
  };

  // Abrir/fechar categoria
  const toggleCategoria = (categoriaId) => {
    if (categoriaAberta === categoriaId) {
      setCategoriaAberta(null);
      setSubcategoriaAberta(null);
    } else {
      setCategoriaAberta(categoriaId);
      setSubcategoriaAberta(null);
    }
  };

  // Abrir/fechar subcategoria
  const toggleSubcategoria = (categoriaId, subcategoriaId) => {
    const key = `${categoriaId}-${subcategoriaId}`;
    if (subcategoriaAberta === key) {
      setSubcategoriaAberta(null);
    } else {
      setSubcategoriaAberta(key);
    }
  };

  // Selecionar categoria e abrir
  const handleSelectCategoria = (categoriaId) => {
    const jaEstaAtiva = isCategoriaSelected(categoriaId);
    
    if (jaEstaAtiva) {
      // Se já está ativa, apenas desmarcar
      onToggleCategoria(categoriaId);
      setCategoriaAberta(null);
      setSubcategoriaAberta(null);
    } else {
      // Se não está ativa, marcar E abrir
      onToggleCategoria(categoriaId);
      setCategoriaAberta(categoriaId);
    }
  };

  // Selecionar subcategoria e abrir
  const handleSelectSubcategoria = (categoriaId, subcategoriaId) => {
    const jaEstaAtiva = isSubcategoriaSelected(categoriaId, subcategoriaId);
    
    if (jaEstaAtiva) {
      // Se já está ativa, apenas desmarcar
      onToggleSubcategoria(categoriaId, subcategoriaId);
      setSubcategoriaAberta(null);
    } else {
      // Se não está ativa, marcar E abrir
      onToggleSubcategoria(categoriaId, subcategoriaId);
      setSubcategoriaAberta(`${categoriaId}-${subcategoriaId}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 border border-purple-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start space-x-3">
          <Sparkles className="text-purple-600 flex-shrink-0 mt-0.5" size={22} />
          <div>
            <p className="text-sm text-gray-800 font-semibold mb-1">
              Configure os serviços do seu salão em 3 passos simples:
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>1️⃣ Clique no botão <strong>+</strong> da categoria para expandir</p>
              <p>2️⃣ Marque o ✓ para ativar a subcategoria e ver os serviços</p>
              <p>3️⃣ Selecione os serviços específicos que você oferece</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="space-y-3">
        {CATEGORIAS_SERVICOS.map((categoria) => {
          const categoriaAtiva = isCategoriaSelected(categoria.id);
          const subcategoriasSelecionadas = countSubcategoriasSelecionadas(categoria.id);
          const isAberta = categoriaAberta === categoria.id;

          return (
            <div 
              key={categoria.id}
              className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                categoriaAtiva 
                  ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-white shadow-lg' 
                  : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              {/* Header da Categoria */}
              <div className="flex items-center p-4 gap-3">
                {/* Botão de Expandir */}
                <button
                  type="button"
                  onClick={() => toggleCategoria(categoria.id)}
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isAberta 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isAberta ? <Minus size={20} /> : <Plus size={20} />}
                </button>

                {/* Checkbox de Seleção */}
                <button
                  type="button"
                  onClick={() => handleSelectCategoria(categoria.id)}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all border-2 ${
                    categoriaAtiva 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500' 
                      : 'bg-white border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {categoriaAtiva && <Check className="text-white" size={18} />}
                </button>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold truncate ${
                    categoriaAtiva ? 'text-purple-900' : 'text-gray-800'
                  }`}>
                    {categoria.nome}
                  </h3>
                  {categoriaAtiva && subcategoriasSelecionadas > 0 && (
                    <p className="text-sm text-purple-600 font-medium">
                      ✓ {subcategoriasSelecionadas} subcategoria{subcategoriasSelecionadas !== 1 ? 's' : ''} ativa{subcategoriasSelecionadas !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Subcategorias (aparecem quando expandido) */}
              {isAberta && (
                <div className="px-4 pb-4 space-y-2 animate-fadeIn">
                  {categoria.subcategorias.map((subcategoria) => {
                    const subcategoriaAtiva = isSubcategoriaSelected(categoria.id, subcategoria.id);
                    const servicosSelecionados = countServicosSelecionados(categoria.id, subcategoria.id);
                    const isSubAberta = subcategoriaAberta === `${categoria.id}-${subcategoria.id}`;

                    return (
                      <div 
                        key={subcategoria.id}
                        className={`border-2 rounded-lg overflow-hidden transition-all ${
                          subcategoriaAtiva 
                            ? 'border-pink-300 bg-gradient-to-r from-pink-50 to-white' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* Header da Subcategoria */}
                        <div className="flex items-center p-3 gap-2">
                          {/* Botão de Expandir */}
                          <button
                            type="button"
                            onClick={() => toggleSubcategoria(categoria.id, subcategoria.id)}
                            disabled={!subcategoriaAtiva}
                            className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                              !subcategoriaAtiva
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : isSubAberta 
                                  ? 'bg-pink-500 text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                            }`}
                          >
                            {isSubAberta ? <Minus size={16} /> : <Plus size={16} />}
                          </button>

                          {/* Checkbox de Seleção */}
                          <button
                            type="button"
                            onClick={() => handleSelectSubcategoria(categoria.id, subcategoria.id)}
                            className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-all border-2 ${
                              subcategoriaAtiva 
                                ? 'bg-gradient-to-br from-pink-400 to-rose-400 border-pink-400' 
                                : 'bg-white border-gray-300 hover:border-pink-300'
                            }`}
                          >
                            {subcategoriaAtiva && <Check className="text-white" size={14} />}
                          </button>

                          {/* Informações */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm truncate ${
                              subcategoriaAtiva ? 'text-pink-900' : 'text-gray-700'
                            }`}>
                              {subcategoria.nome}
                            </h4>
                            {subcategoriaAtiva && servicosSelecionados > 0 && (
                              <p className="text-xs text-pink-600 font-medium">
                                ✓ {servicosSelecionados} serviço{servicosSelecionados !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Serviços (aparecem quando subcategoria expandida) */}
                        {subcategoriaAtiva && isSubAberta && (
                          <div className="p-3 pt-0 animate-fadeIn">
                            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg p-3">
                              <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <div className="w-1 h-3 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
                                Serviços disponíveis:
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {subcategoria.servicos.map((servico) => {
                                  const isSelected = isServicoSelected(categoria.id, subcategoria.id, servico);
                                  
                                  return (
                                    <label 
                                      key={servico}
                                      className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all group ${
                                        isSelected 
                                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400' 
                                          : 'bg-white border-2 border-gray-200 hover:border-green-300 hover:bg-green-50'
                                      }`}
                                    >
                                      <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                        isSelected 
                                          ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                                          : 'bg-white border-2 border-gray-300 group-hover:border-green-400'
                                      }`}>
                                        {isSelected && <Check className="text-white" size={12} />}
                                      </div>
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onToggleServico(categoria.id, subcategoria.id, servico)}
                                        className="hidden"
                                      />
                                      <span className={`text-sm font-medium transition-colors ${
                                        isSelected ? 'text-green-900' : 'text-gray-700 group-hover:text-green-800'
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
      <div className="flex justify-end pt-6 border-t-2 border-gray-200">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          💾 Salvar Alterações
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </form>
  );
};

export default ConfiguracoesCategorias;