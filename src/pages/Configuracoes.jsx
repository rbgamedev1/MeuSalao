// src/pages/Configuracoes.jsx - ATUALIZADO: Especialidades dinâmicas baseadas nos serviços do salão

import { useState, useContext, useEffect, useMemo } from 'react';
import { SalaoContext } from '../contexts/SalaoContext';
import { canAddMore, getLimitMessage } from '../utils/planRestrictions';

// Componentes modularizados
import ConfiguracoesHeader from '../components/configuracoes/ConfiguracoesHeader';
import ConfiguracoesTabs from '../components/configuracoes/ConfiguracoesTabs';
import ConfiguracoesGeral from '../components/configuracoes/ConfiguracoesGeral';
import ConfiguracoesCategorias from '../components/configuracoes/ConfiguracoesCategorias';
import ConfiguracoesProfissionais from '../components/configuracoes/ConfiguracoesProfissionais';
import ConfiguracoesPlanos from '../components/configuracoes/ConfiguracoesPlanos';
import ProfissionalModal from '../components/configuracoes/ProfissionalModal';

// Dados dos planos
import { PLANOS_DATA } from '../data/planosData';

const Configuracoes = () => {
  const { 
    salaoAtual, 
    saloes,
    atualizarSalao, 
    deletarSalao,
    profissionais, 
    setProfissionais, 
    getProfissionaisPorSalao
  } = useContext(SalaoContext);
  
  // ✅ GUARD CLAUSE - Previne crash
  if (!salaoAtual) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Carregando configurações...</p>
        </div>
      </div>
    );
  }
  
  const [activeTab, setActiveTab] = useState('geral');
  const [showProfissionalModal, setShowProfissionalModal] = useState(false);
  const [editingProfissionalId, setEditingProfissionalId] = useState(null);

  // ✅ Form data para informações gerais
  const [formData, setFormData] = useState({
    nome: salaoAtual.nome || '',
    endereco: salaoAtual.endereco || '',
    telefone: salaoAtual.telefone || '',
    email: salaoAtual.email || '',
    logo: salaoAtual.logo || null
  });

  // ✅ Sincronizar formData quando salaoAtual mudar
  useEffect(() => {
    if (salaoAtual) {
      setFormData({
        nome: salaoAtual.nome || '',
        endereco: salaoAtual.endereco || '',
        telefone: salaoAtual.telefone || '',
        email: salaoAtual.email || '',
        logo: salaoAtual.logo || null
      });
      setLogoPreview(null);
    }
  }, [salaoAtual.id]);

  // Form data para profissional
  const [profissionalData, setProfissionalData] = useState({
    nome: '',
    telefone: '',
    email: '',
    especialidades: []
  });

  // ✅ State para categorias e serviços
  const [categoriasServicos, setCategoriasServicos] = useState(
    salaoAtual.categoriasServicos || {}
  );

  // ✅ Sincronizar categoriasServicos quando salaoAtual mudar
  useEffect(() => {
    if (salaoAtual) {
      setCategoriasServicos(salaoAtual.categoriasServicos || {});
    }
  }, [salaoAtual.id]);

  const [logoPreview, setLogoPreview] = useState(null);

  // ✅ Obter profissionais com validação
  const profissionaisSalao = getProfissionaisPorSalao ? getProfissionaisPorSalao() : [];

  // ✅ Verificar limites do plano com validação
  const canAddProfissional = canAddMore && profissionaisSalao 
    ? canAddMore(salaoAtual.plano, 'profissionais', profissionaisSalao.length)
    : false;
    
  const limiteProfissionais = getLimitMessage 
    ? getLimitMessage(salaoAtual.plano, 'profissionais')
    : 'Carregando...';

  // ✅ NOVO: Especialidades disponíveis baseadas nos serviços do salão
  const especialidadesDisponiveis = useMemo(() => {
    const servicosAtivos = [];
    
    // Extrair todos os serviços ativos do salão
    if (categoriasServicos && typeof categoriasServicos === 'object') {
      Object.values(categoriasServicos).forEach(categoria => {
        if (categoria.subcategorias) {
          Object.values(categoria.subcategorias).forEach(subcategoria => {
            if (subcategoria.servicos && Array.isArray(subcategoria.servicos)) {
              servicosAtivos.push(...subcategoria.servicos);
            }
          });
        }
      });
    }
    
    // Remover duplicatas e ordenar alfabeticamente
    return [...new Set(servicosAtivos)].sort();
  }, [categoriasServicos]);

  // ✅ NOVO: Limpar especialidades inválidas ao abrir modal
  useEffect(() => {
    if (showProfissionalModal && editingProfissionalId) {
      // Ao editar, remover especialidades que não existem mais nos serviços do salão
      setProfissionalData(prev => ({
        ...prev,
        especialidades: prev.especialidades.filter(esp => 
          especialidadesDisponiveis.includes(esp)
        )
      }));
    }
  }, [showProfissionalModal, especialidadesDisponiveis]);

  // ===== HANDLERS PARA INFORMAÇÕES GERAIS =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo é muito grande. Tamanho máximo: 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGeral = (e) => {
    e.preventDefault();
    try {
      atualizarSalao(salaoAtual.id, formData);
      alert('Informações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar informações. Tente novamente.');
    }
  };

  const handleDeletarSalao = () => {
    if (!saloes || saloes.length === 1) {
      alert('Você não pode excluir o único salão cadastrado.');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o salão "${salaoAtual.nome}"?\n\nTodos os dados relacionados serão perdidos permanentemente!`)) {
      try {
        const sucesso = deletarSalao(salaoAtual.id);
        if (sucesso) {
          alert('Salão excluído com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao deletar salão:', error);
        alert('Erro ao excluir salão. Tente novamente.');
      }
    }
  };

  // ===== HANDLERS PARA CATEGORIAS E SERVIÇOS =====
  const handleToggleServico = (categoriaId, subcategoriaId, servico) => {
    setCategoriasServicos(prev => {
      const novoEstado = JSON.parse(JSON.stringify(prev));
      
      if (!novoEstado[categoriaId]) {
        novoEstado[categoriaId] = { subcategorias: {} };
      }
      
      if (!novoEstado[categoriaId].subcategorias) {
        novoEstado[categoriaId].subcategorias = {};
      }
      
      if (!novoEstado[categoriaId].subcategorias[subcategoriaId]) {
        novoEstado[categoriaId].subcategorias[subcategoriaId] = { servicos: [] };
      }
      
      if (!novoEstado[categoriaId].subcategorias[subcategoriaId].servicos) {
        novoEstado[categoriaId].subcategorias[subcategoriaId].servicos = [];
      }
      
      const servicos = novoEstado[categoriaId].subcategorias[subcategoriaId].servicos;
      
      if (servicos.includes(servico)) {
        novoEstado[categoriaId].subcategorias[subcategoriaId].servicos = 
          servicos.filter(s => s !== servico);
        
        if (novoEstado[categoriaId].subcategorias[subcategoriaId].servicos.length === 0) {
          delete novoEstado[categoriaId].subcategorias[subcategoriaId];
        }
        
        if (Object.keys(novoEstado[categoriaId].subcategorias).length === 0) {
          delete novoEstado[categoriaId];
        }
      } else {
        novoEstado[categoriaId].subcategorias[subcategoriaId].servicos.push(servico);
      }
      
      return novoEstado;
    });
  };

  const handleToggleSubcategoria = (categoriaId, subcategoriaId) => {
    setCategoriasServicos(prev => {
      const novoEstado = JSON.parse(JSON.stringify(prev));
      
      const temServicos = novoEstado[categoriaId]?.subcategorias?.[subcategoriaId]?.servicos?.length > 0;
      
      if (temServicos) {
        delete novoEstado[categoriaId].subcategorias[subcategoriaId];
        
        if (Object.keys(novoEstado[categoriaId].subcategorias).length === 0) {
          delete novoEstado[categoriaId];
        }
      } else {
        alert('Selecione os serviços específicos que você oferece nesta subcategoria.');
      }
      
      return novoEstado;
    });
  };

  const handleToggleCategoria = (categoriaId) => {
    setCategoriasServicos(prev => {
      const novoEstado = JSON.parse(JSON.stringify(prev));
      
      const temServicos = novoEstado[categoriaId]?.subcategorias && 
        Object.values(novoEstado[categoriaId].subcategorias).some(sub => sub.servicos?.length > 0);
      
      if (temServicos) {
        delete novoEstado[categoriaId];
      } else {
        alert('Selecione os serviços específicos que você oferece nesta categoria.');
      }
      
      return novoEstado;
    });
  };

  const handleSaveCategorias = () => {
    try {
      atualizarSalao(salaoAtual.id, { categoriasServicos });
      
      // ✅ NOVO: Limpar especialidades dos profissionais que não existem mais
      const servicosAtivos = [];
      Object.values(categoriasServicos).forEach(categoria => {
        if (categoria.subcategorias) {
          Object.values(categoria.subcategorias).forEach(subcategoria => {
            if (subcategoria.servicos) {
              servicosAtivos.push(...subcategoria.servicos);
            }
          });
        }
      });

      // Atualizar profissionais removendo especialidades inválidas
      const profissionaisAtualizados = profissionais.map(prof => {
        if (prof.salaoId === salaoAtual.id && prof.especialidades) {
          const especialidadesValidas = prof.especialidades.filter(esp => 
            servicosAtivos.includes(esp)
          );
          
          if (especialidadesValidas.length !== prof.especialidades.length) {
            return { ...prof, especialidades: especialidadesValidas };
          }
        }
        return prof;
      });

      setProfissionais(profissionaisAtualizados);
      
      alert('Categorias e serviços atualizados com sucesso!\n\nNota: As especialidades dos profissionais foram ajustadas automaticamente.');
    } catch (error) {
      console.error('Erro ao salvar categorias:', error);
      alert('Erro ao salvar categorias. Tente novamente.');
    }
  };

  // ===== HANDLERS PARA PROFISSIONAIS =====
  const handleProfissionalChange = (e) => {
    const { name, value } = e.target;
    setProfissionalData(prev => ({ ...prev, [name]: value }));
  };

  const handleEspecialidadeToggle = (especialidade) => {
    setProfissionalData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidade)
        ? prev.especialidades.filter(e => e !== especialidade)
        : [...prev.especialidades, especialidade]
    }));
  };

  const handleOpenProfissionalModal = (profissional = null) => {
    // ✅ NOVO: Verificar se há serviços configurados
    if (especialidadesDisponiveis.length === 0) {
      alert('⚠️ Configure os serviços do salão primeiro!\n\nAcesse a aba "Categorias e Serviços" e selecione os serviços que seu salão oferece antes de cadastrar profissionais.');
      setActiveTab('categorias');
      return;
    }

    if (!profissional && !canAddProfissional) {
      alert(`Limite de profissionais atingido!\n\nSeu plano permite: ${limiteProfissionais}\n\nFaça upgrade do seu plano para adicionar mais profissionais.`);
      return;
    }

    if (profissional) {
      setEditingProfissionalId(profissional.id);
      setProfissionalData({
        nome: profissional.nome || '',
        telefone: profissional.telefone || '',
        email: profissional.email || '',
        especialidades: (profissional.especialidades || []).filter(esp => 
          especialidadesDisponiveis.includes(esp)
        )
      });
    } else {
      setEditingProfissionalId(null);
      setProfissionalData({
        nome: '',
        telefone: '',
        email: '',
        especialidades: []
      });
    }
    setShowProfissionalModal(true);
  };

  const handleCloseProfissionalModal = () => {
    setShowProfissionalModal(false);
    setEditingProfissionalId(null);
  };

  const handleSubmitProfissional = (e) => {
    e.preventDefault();
    
    if (!profissionalData.nome || !profissionalData.telefone || !profissionalData.email) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (profissionalData.especialidades.length === 0) {
      alert('Selecione pelo menos um serviço que o profissional atende!');
      return;
    }

    try {
      if (editingProfissionalId) {
        setProfissionais(profissionais.map(p => 
          p.id === editingProfissionalId 
            ? { ...profissionalData, id: editingProfissionalId, salaoId: salaoAtual.id }
            : p
        ));
        alert('Profissional atualizado com sucesso!');
      } else {
        const newProfissional = {
          ...profissionalData,
          id: Math.max(...profissionais.map(p => p.id), 0) + 1,
          salaoId: salaoAtual.id
        };
        setProfissionais([...profissionais, newProfissional]);
        alert('Profissional cadastrado com sucesso!');
      }
      
      handleCloseProfissionalModal();
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
      alert('Erro ao salvar profissional. Tente novamente.');
    }
  };

  const handleDeleteProfissional = (id) => {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        setProfissionais(profissionais.filter(p => p.id !== id));
        alert('Profissional excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar profissional:', error);
        alert('Erro ao excluir profissional. Tente novamente.');
      }
    }
  };

  // ===== HANDLER PARA PLANOS =====
  const handleChangePlano = (planoId) => {
    const planoSelecionado = PLANOS_DATA.find(p => p.id === planoId);
    
    if (!planoSelecionado) {
      alert('Plano não encontrado!');
      return;
    }

    if (!planoSelecionado.disponivel) {
      alert(`O plano ${planoSelecionado.nome} estará disponível em breve!\n\nEntre em contato conosco para receber novidades sobre este plano.`);
      return;
    }

    if (confirm(`Deseja alterar para o ${planoSelecionado.nome}?\n\n⚠️ ATENÇÃO: O plano se aplica a TODOS os seus salões cadastrados.`)) {
      try {
        saloes.forEach(salao => {
          atualizarSalao(salao.id, { plano: planoId });
        });
        alert('Plano alterado com sucesso para todos os seus salões!');
      } catch (error) {
        console.error('Erro ao alterar plano:', error);
        alert('Erro ao alterar plano. Tente novamente.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <ConfiguracoesHeader />

      <ConfiguracoesTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Conteúdo das Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'geral' && (
          <ConfiguracoesGeral 
            formData={formData}
            handleChange={handleChange}
            handleLogoUpload={handleLogoUpload}
            handleSaveGeral={handleSaveGeral}
            handleDeletarSalao={handleDeletarSalao}
            logoPreview={logoPreview}
            saloes={saloes}
          />
        )}

        {activeTab === 'categorias' && (
          <ConfiguracoesCategorias 
            categoriasServicos={categoriasServicos}
            onToggleCategoria={handleToggleCategoria}
            onToggleSubcategoria={handleToggleSubcategoria}
            onToggleServico={handleToggleServico}
            onSave={handleSaveCategorias}
          />
        )}

        {activeTab === 'profissionais' && (
          <ConfiguracoesProfissionais 
            profissionaisSalao={profissionaisSalao}
            canAddProfissional={canAddProfissional}
            limiteProfissionais={limiteProfissionais}
            salaoPlano={salaoAtual.plano}
            onOpenModal={() => handleOpenProfissionalModal()}
            onEditProfissional={handleOpenProfissionalModal}
            onDeleteProfissional={handleDeleteProfissional}
          />
        )}

        {activeTab === 'planos' && (
          <ConfiguracoesPlanos 
            planos={PLANOS_DATA}
            salaoPlano={salaoAtual.plano}
            onChangePlano={handleChangePlano}
          />
        )}
      </div>

      {/* Modal de Profissional */}
      {showProfissionalModal && (
        <ProfissionalModal 
          isOpen={showProfissionalModal}
          onClose={handleCloseProfissionalModal}
          editingId={editingProfissionalId}
          formData={profissionalData}
          onChange={handleProfissionalChange}
          onSubmit={handleSubmitProfissional}
          especialidadesDisponiveis={especialidadesDisponiveis}
          onToggleEspecialidade={handleEspecialidadeToggle}
        />
      )}
    </div>
  );
};

export default Configuracoes;