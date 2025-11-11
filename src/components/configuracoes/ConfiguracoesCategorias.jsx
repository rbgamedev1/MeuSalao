// src/components/configuracoes/ConfiguracoesCategorias.jsx - CORRIGIDO

import { Check, Plus, Minus, Sparkles } from 'lucide-react';
import { CATEGORIAS_SERVICOS } from '../../data/categoriasServicosData';
import { useState } from 'react';

const ConfiguracoesCategorias = ({ 
  categoriasServicos,
  onToggleCategoria,
  onToggleSubcategoria,
  onToggleServico,
  onSave
}) => {
  // Estados para expansão (múltipla)
  const [categoriasAbertas, setCategoriasAbertas] = useState(new Set());
  const [subcategoriasAbertas, setSubcategoriasAbertas] = useState(new Set());

  // ✅ FUNÇÕES FALTANTES ADICIONADAS
  const isCategoriaAberta = (categoriaId) => categoriasAbertas.has(categoriaId);
  
  const isSubcategoriaAberta = (subcategoriaKey) => subcategoriasAbertas.has(subcategoriaKey);

  // Funções utilitárias - BASEADAS EM SERVIÇOS SELECIONADOS

  // Categoria é "ativa" se tiver QUALQUER serviço selecionado em qualquer subcategoria
  const isCategoriaSelected = (categoriaId) => {
    const subcategorias = categoriasServicos[categoriaId]?.subcategorias;
    if (!subcategorias) return false;
    // Verifica se *alguma* subcategoria tem serviços selecionados
    return Object.values(subcategorias).some(sub => sub.servicos?.length > 0);
  };

  // Subcategoria é "ativa" se tiver QUALQUER serviço selecionado
  const isSubcategoriaSelected = (categoriaId, subcategoriaId) => {
    // Verifica se a subcategoria existe e se o array de servicos tem pelo menos 1 item
    return (categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.length > 0) || false;
  };

  const isServicoSelected = (categoriaId, subcategoriaId, servico) => 
    categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.includes(servico) || false;
  
  // Contar subcategorias que possuem serviços selecionados
  const countSubcategoriasSelecionadas = (categoriaId) => {
    const subcategorias = categoriasServicos[categoriaId]?.subcategorias;
    if (!subcategorias) return 0;
    
    // Conta quantas subcategorias têm array de servicos com length > 0
    return Object.values(subcategorias).filter(sub => sub.servicos?.length > 0).length;
  };

  const countServicosSelecionados = (categoriaId, subcategoriaId) => {
    return categoriasServicos[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.length || 0;
  };

  // EXPANSÃO CATEGORIA (TOGGLE) - Apenas abre/fecha
  const toggleCategoria = (categoriaId) => {
    setCategoriasAbertas(prev => {
      const novoSet = new Set(prev);
      if (novoSet.has(categoriaId)) {
        novoSet.delete(categoriaId);
      } else {
        novoSet.add(categoriaId);
      }
      return novoSet;
    });
  };

  // EXPANSÃO SUBCATEGORIA (TOGGLE) - Apenas abre/fecha
  const toggleSubcategoria = (categoriaId, subcategoriaId) => {
    const key = `${categoriaId}-${subcategoriaId}`;
    setSubcategoriasAbertas(prev => {
      const novoSet = new Set(prev);
      if (novoSet.has(key)) {
        novoSet.delete(key);
      } else {
        novoSet.add(key);
      }
      return novoSet;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header com informação */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="text-purple-600 mt-1 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Configure seus serviços</h3>
            <p className="text-sm text-gray-600">
              Clique nos <strong>ícones +/-</strong> para expandir categorias e subcategorias. 
              Selecione os <strong>serviços</strong> que você oferece no seu salão.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="space-y-3">
        {CATEGORIAS_SERVICOS.map((categoria) => {
          const categoriaAtiva = isCategoriaSelected(categoria.id);
          const subcategoriasSelecionadas = countSubcategoriasSelecionadas(categoria.id);
          const isAberta = isCategoriaAberta(categoria.id);

          return (
            <div 
              key={categoria.id}
              className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                categoriaAtiva 
                  ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-white shadow-lg' 
                  : 'border-gray-200 bg-white shadow-sm hover:shadow-md'
              }`}
            >
              {/* Header da Categoria - Clicável para expandir */}
              <div 
                className="flex items-center p-4 gap-3 cursor-pointer"
                onClick={() => toggleCategoria(categoria.id)}
              >
                {/* Ícone de Expansão/Recolhimento */}
                <div 
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isAberta 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isAberta ? <Minus size={20} /> : <Plus size={20} />}
                </div>

                {/* Informações */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold truncate ${
                    categoriaAtiva ? 'text-purple-900' : 'text-gray-800'
                  }`}>
                    {categoria.nome}
                  </h3>
                  {/* Status de seleção */}
                  {categoriaAtiva && subcategoriasSelecionadas > 0 && (
                    <p className="text-sm text-purple-600 font-medium">
                      ✓ {subcategoriasSelecionadas} subcategoria{subcategoriasSelecionadas !== 1 ? 's' : ''} ativa{subcategoriasSelecionadas !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Subcategorias (aparecem quando a categoria está aberta) */}
              {isAberta && (
                <div className="px-4 pb-4 space-y-2 animate-fadeIn">
                  {categoria.subcategorias.map((subcategoria) => {
                    const subcategoriaAtiva = isSubcategoriaSelected(categoria.id, subcategoria.id);
                    const servicosSelecionados = countServicosSelecionados(categoria.id, subcategoria.id);
                    const subcategoriaKey = `${categoria.id}-${subcategoria.id}`;
                    const isSubAberta = isSubcategoriaAberta(subcategoriaKey);

                    return (
                      <div 
                        key={subcategoria.id}
                        className={`border-2 rounded-lg overflow-hidden transition-all ${
                          subcategoriaAtiva
                            ? 'border-pink-300 bg-gradient-to-r from-pink-50 to-white' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* Header da Subcategoria - Clicável para expandir */}
                        <div 
                          className="flex items-center p-3 gap-2 cursor-pointer"
                          onClick={() => toggleSubcategoria(categoria.id, subcategoria.id)}
                        >
                          {/* Ícone de Expansão/Recolhimento */}
                          <div 
                            className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                              isSubAberta ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                            }`}
                          >
                            {isSubAberta ? <Minus size={16} /> : <Plus size={16} />}
                          </div>

                          {/* Informações */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm truncate ${
                              subcategoriaAtiva ? 'text-pink-900' : 'text-gray-700'
                            }`}>
                              {subcategoria.nome}
                            </h4>
                            {/* Status de seleção */}
                            {subcategoriaAtiva && servicosSelecionados > 0 && (
                              <p className="text-xs text-pink-600 font-medium">
                                ✓ {servicosSelecionados} serviço{servicosSelecionados !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Serviços (aparecem QUANDO subcategoria aberta) */}
                        {isSubAberta && (
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
                                    <div 
                                      key={servico}
                                      onClick={() => onToggleServico(categoria.id, subcategoria.id, servico)}
                                      className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all group ${
                                        isSelected 
                                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400' 
                                          : 'bg-white border-2 border-gray-200 hover:border-green-300 hover:bg-green-50'
                                      }`}
                                    >
                                      {/* Checkmark Visual */}
                                      <div className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                        isSelected 
                                          ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                                          : 'bg-white border-2 border-gray-300 group-hover:border-green-400'
                                      }`}>
                                        {isSelected && <Check className="text-white" size={12} />}
                                      </div>
                                      
                                      {/* Nome do Serviço */}
                                      <span className={`text-sm font-medium transition-colors ${
                                        isSelected ? 'text-green-900' : 'text-gray-700 group-hover:text-green-800'
                                      }`}>
                                        {servico}
                                      </span>
                                    </div>
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
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
        >
          Salvar Configurações
        </button>
      </div>

      {/* Styles para animação */}
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