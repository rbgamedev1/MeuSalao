// src/components/configuracoes/ConfiguracoesServicos.jsx - CORRIGIDO

import { useState, useContext, useMemo } from 'react';
import { Plus, Edit, Trash2, Clock, DollarSign, ChevronDown, ChevronRight, Search, Users, AlertCircle } from 'lucide-react';
import { SalaoContext } from '../../contexts/SalaoContext';
import { CATEGORIAS_SERVICOS } from '../../data/categoriasServicosData';
import ServicoConfigModal from './ServicoConfigModal';

const ConfiguracoesServicos = () => {
  const { 
    salaoAtual,
    servicos,
    setServicos,
    getServicosPorSalao,
    getProfissionaisPorSalao
  } = useContext(SalaoContext);

  console.log('ConfiguracoesServicos - Dados:', {
    salaoAtual,
    servicos,
    totalServicos: servicos?.length,
    getServicosPorSalao: typeof getServicosPorSalao,
    getProfissionaisPorSalao: typeof getProfissionaisPorSalao
  });

  const [expandedCategorias, setExpandedCategorias] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);

  // Obter dados do salão atual
  const servicosSalao = getServicosPorSalao ? getServicosPorSalao() : [];
  const profissionaisSalao = getProfissionaisPorSalao ? getProfissionaisPorSalao() : [];

  console.log('ConfiguracoesServicos - Dados processados:', {
    servicosSalao,
    totalServicosSalao: servicosSalao.length,
    profissionaisSalao,
    totalProfissionais: profissionaisSalao.length
  });

  // Agrupar serviços configurados por categoria
  const servicosAgrupados = useMemo(() => {
    const grupos = {};
    
    servicosSalao.forEach(servico => {
      if (!servico.categoria || !servico.subcategoria) return;
      
      if (!grupos[servico.categoria]) {
        grupos[servico.categoria] = {};
      }
      if (!grupos[servico.categoria][servico.subcategoria]) {
        grupos[servico.categoria][servico.subcategoria] = [];
      }
      grupos[servico.categoria][servico.subcategoria].push(servico);
    });
    
    console.log('Serviços agrupados:', grupos);
    return grupos;
  }, [servicosSalao]);

  // Filtrar serviços disponíveis (não configurados ainda)
  const servicosDisponiveis = useMemo(() => {
    const configurados = new Set(servicosSalao.map(s => s.nome));
    
    const disponiveis = CATEGORIAS_SERVICOS.flatMap(cat => 
      cat.subcategorias.flatMap(sub => 
        sub.servicos
          .filter(servico => !configurados.has(servico))
          .map(servico => ({
            nome: servico,
            categoria: cat.nome,
            categoriaId: cat.id,
            subcategoria: sub.nome,
            subcategoriaId: sub.id
          }))
      )
    );
    
    console.log('Serviços disponíveis:', disponiveis.length);
    return disponiveis;
  }, [servicosSalao]);

  const toggleCategoria = (categoria) => {
    setExpandedCategorias(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  const handleNovoServico = () => {
    console.log('Abrindo modal para novo serviço');
    setServicoEditando(null);
    setModalAberto(true);
  };

  const handleEditarServico = (servico) => {
    console.log('Editando serviço:', servico);
    setServicoEditando(servico);
    setModalAberto(true);
  };

  const handleExcluirServico = (id) => {
    const servico = servicosSalao.find(s => s.id === id);
    if (!servico) return;

    if (confirm(`⚠️ Deseja excluir o serviço "${servico.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
      setServicos(servicos.filter(s => s.id !== id));
      alert('✅ Serviço excluído com sucesso!');
    }
  };

  const handleSalvarServico = (dadosServico) => {
    console.log('Salvando serviço:', dadosServico);
    
    if (servicoEditando) {
      // Editar serviço existente
      setServicos(servicos.map(s => 
        s.id === servicoEditando.id 
          ? { ...dadosServico, id: servicoEditando.id, salaoId: salaoAtual.id }
          : s
      ));
      alert('✅ Serviço atualizado com sucesso!');
    } else {
      // Novo serviço
      const newServico = {
        ...dadosServico,
        id: Math.max(...servicos.map(s => s.id), 0) + 1,
        salaoId: salaoAtual.id
      };
      setServicos([...servicos, newServico]);
      alert('✅ Serviço cadastrado com sucesso!');
    }
    
    setModalAberto(false);
    setServicoEditando(null);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
  };

  // Filtrar serviços pela busca
  const servicosFiltrados = useMemo(() => {
    if (!searchTerm) return servicosAgrupados;
    
    const filtered = {};
    Object.entries(servicosAgrupados).forEach(([categoria, subcategorias]) => {
      Object.entries(subcategorias).forEach(([subcategoria, servicos]) => {
        const servicosFiltradosSub = servicos.filter(s => 
          s.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (servicosFiltradosSub.length > 0) {
          if (!filtered[categoria]) filtered[categoria] = {};
          filtered[categoria][subcategoria] = servicosFiltradosSub;
        }
      });
    });
    
    return filtered;
  }, [servicosAgrupados, searchTerm]);

  const totalServicos = servicosSalao.length;
  const servicosAtivos = servicosSalao.filter(s => s.ativo).length;
  const servicosDispCount = servicosDisponiveis.length;

  console.log('Renderizando - Estado atual:', {
    totalServicos,
    servicosAtivos,
    servicosDispCount,
    totalCategorias: Object.keys(servicosFiltrados).length
  });

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Serviços Configurados</p>
          <p className="text-3xl font-bold text-purple-700 mt-1">{totalServicos}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Serviços Ativos</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{servicosAtivos}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Disponíveis para Configurar</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{servicosDispCount}</p>
        </div>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar serviço configurado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleNovoServico}
          className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Lista de Serviços Agrupados */}
      {Object.keys(servicosFiltrados).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium mb-2">
            {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço configurado'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm ? 'Tente outro termo de busca' : 'Clique em "Novo Serviço" para começar'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleNovoServico}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              <span>Cadastrar Primeiro Serviço</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(servicosFiltrados).map(([categoria, subcategorias]) => {
            const isExpanded = expandedCategorias[categoria];
            const totalSubcategorias = Object.keys(subcategorias).length;
            const totalServicosCategoria = Object.values(subcategorias).flat().length;

            return (
              <div key={categoria} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header da Categoria */}
                <button
                  onClick={() => toggleCategoria(categoria)}
                  className="w-full bg-gray-50 hover:bg-gray-100 transition-colors p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="text-gray-600" size={20} />
                    ) : (
                      <ChevronRight className="text-gray-600" size={20} />
                    )}
                    <h3 className="font-semibold text-gray-800 text-lg">{categoria}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {totalServicosCategoria} serviço{totalServicosCategoria !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      {totalSubcategorias} subcategoria{totalSubcategorias !== 1 ? 's' : ''}
                    </span>
                  </div>
                </button>

                {/* Subcategorias e Serviços */}
                {isExpanded && (
                  <div className="p-4 space-y-4 bg-white">
                    {Object.entries(subcategorias).map(([subcategoria, servicos]) => (
                      <div key={subcategoria} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-purple-50 px-4 py-2 border-b border-purple-100">
                          <h4 className="font-medium text-purple-900">{subcategoria}</h4>
                        </div>
                        
                        <div className="p-3 space-y-2">
                          {servicos.map(servico => (
                            <div
                              key={servico.id}
                              className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h5 className="font-medium text-gray-800">{servico.nome}</h5>
                                  {servico.ativo ? (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                      Ativo
                                    </span>
                                  ) : (
                                    <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full">
                                      Inativo
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Clock size={14} />
                                    <span>{formatDuration(servico.duracao)}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1">
                                    <DollarSign size={14} />
                                    <span className="font-semibold text-green-600">
                                      R$ {servico.valor.toFixed(2)}
                                    </span>
                                  </div>
                                  
                                  {servico.comissao > 0 && (
                                    <div className="text-purple-600">
                                      Comissão: {servico.comissao}%
                                    </div>
                                  )}
                                  
                                  {servico.profissionaisHabilitados && servico.profissionaisHabilitados.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <Users size={14} />
                                      <span>{servico.profissionaisHabilitados.length} profissional(is)</span>
                                    </div>
                                  )}
                                </div>

                                {servico.descricao && (
                                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                    {servico.descricao}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center space-x-2 ml-4">
                                <button
                                  onClick={() => handleEditarServico(servico)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Editar serviço"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => handleExcluirServico(servico.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Excluir serviço"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Configuração */}
      {modalAberto && (
        <ServicoConfigModal
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false);
            setServicoEditando(null);
          }}
          servico={servicoEditando}
          servicosDisponiveis={servicosDisponiveis}
          profissionaisSalao={profissionaisSalao}
          onSave={handleSalvarServico}
        />
      )}
    </div>
  );
};

export default ConfiguracoesServicos;