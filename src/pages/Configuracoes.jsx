// src/pages/Configuracoes.jsx - VINCULAÇÃO ATRAVÉS DO PROFISSIONAL

import { useState, useContext, useEffect, useMemo } from 'react';
import { SalaoContext } from '../contexts/SalaoContext';
import { canAddMore, getLimitMessage } from '../utils/planRestrictions';

import ConfiguracoesHeader from '../components/configuracoes/ConfiguracoesHeader';
import ConfiguracoesTabs from '../components/configuracoes/ConfiguracoesTabs';
import ConfiguracoesGeral from '../components/configuracoes/ConfiguracoesGeral';
import ConfiguracoesServicos from '../components/configuracoes/ConfiguracoesServicos';
import ConfiguracoesProfissionais from '../components/configuracoes/ConfiguracoesProfissionais';
import ConfiguracoesComunicacoes from '../components/configuracoes/ConfiguracoesComunicacoes';
import ProfissionalModal from '../components/configuracoes/ProfissionalModal';

const Configuracoes = () => {
  const { 
    salaoAtual, 
    saloes,
    atualizarSalao, 
    deletarSalao,
    profissionais, 
    setProfissionais,
    servicos,
    setServicos,
    getServicosPorSalao,
    getProfissionaisPorSalao
  } = useContext(SalaoContext);
  
  // Loading state
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
  
  // ============================================================================
  // ESTADOS GERAIS
  // ============================================================================
  const [activeTab, setActiveTab] = useState('geral');
  const [showProfissionalModal, setShowProfissionalModal] = useState(false);
  const [editingProfissionalId, setEditingProfissionalId] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // ============================================================================
  // ESTADO: INFORMAÇÕES GERAIS
  // ============================================================================
  const [formData, setFormData] = useState({
    nome: salaoAtual.nome || '',
    endereco: salaoAtual.endereco || '',
    telefone: salaoAtual.telefone || '',
    email: salaoAtual.email || '',
    logo: salaoAtual.logo || null
  });

  // Atualizar formData quando o salão mudar
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

  // ============================================================================
  // ESTADO: PROFISSIONAIS
  // ============================================================================
  const [profissionalData, setProfissionalData] = useState({
    nome: '',
    telefone: '',
    email: '',
    especialidades: []
  });

  // Obter dados do salão atual
  const profissionaisSalao = getProfissionaisPorSalao ? getProfissionaisPorSalao() : [];
  const servicosSalao = getServicosPorSalao ? getServicosPorSalao() : [];

  // Validar limites do plano
  const canAddProfissional = canAddMore && profissionaisSalao 
    ? canAddMore(salaoAtual.plano, 'profissionais', profissionaisSalao.length)
    : false;
    
  const limiteProfissionais = getLimitMessage 
    ? getLimitMessage(salaoAtual.plano, 'profissionais')
    : 'Carregando...';

  // Serviços configurados disponíveis para vinculação
  const servicosDisponiveis = useMemo(() => {
    return servicosSalao.map(s => ({
      nome: s.nome,
      categoria: s.categoria,
      subcategoria: s.subcategoria,
      id: s.id
    })).sort((a, b) => {
      // Ordenar por categoria, depois subcategoria, depois nome
      if (a.categoria !== b.categoria) return a.categoria.localeCompare(b.categoria);
      if (a.subcategoria !== b.subcategoria) return a.subcategoria.localeCompare(b.subcategoria);
      return a.nome.localeCompare(b.nome);
    });
  }, [servicosSalao]);

  // ============================================================================
  // HANDLERS: INFORMAÇÕES GERAIS
  // ============================================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('❌ O arquivo é muito grande. Tamanho máximo: 2MB');
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
    
    if (!formData.nome || !formData.endereco || !formData.telefone || !formData.email) {
      alert('❌ Preencha todos os campos obrigatórios!');
      return;
    }

    try {
      atualizarSalao(salaoAtual.id, formData);
      alert('✅ Informações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar informações. Tente novamente.');
    }
  };

  const handleDeletarSalao = () => {
    if (!saloes || saloes.length === 1) {
      alert('❌ Você não pode excluir o único salão cadastrado.');
      return;
    }

    if (confirm(`⚠️ Tem certeza que deseja excluir o salão "${salaoAtual.nome}"?\n\nTodos os dados relacionados serão perdidos permanentemente!`)) {
      try {
        const sucesso = deletarSalao(salaoAtual.id);
        if (sucesso) {
          alert('✅ Salão excluído com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao deletar salão:', error);
        alert('❌ Erro ao excluir salão. Tente novamente.');
      }
    }
  };

  // ============================================================================
  // HANDLERS: PROFISSIONAIS
  // ============================================================================
  const handleProfissionalChange = (e) => {
    const { name, value } = e.target;
    setProfissionalData(prev => ({ ...prev, [name]: value }));
  };

  const handleServicoToggle = (servicoNome) => {
    setProfissionalData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(servicoNome)
        ? prev.especialidades.filter(e => e !== servicoNome)
        : [...prev.especialidades, servicoNome]
    }));
  };

  const handleOpenProfissionalModal = (profissional = null) => {
    // Verificar limite do plano
    if (!profissional && !canAddProfissional) {
      alert(
        `⚠️ Limite de profissionais atingido!\n\n` +
        `Seu plano permite: ${limiteProfissionais}\n\n` +
        `Faça upgrade do seu plano para adicionar mais profissionais.`
      );
      return;
    }

    // Editar profissional existente
    if (profissional) {
      setEditingProfissionalId(profissional.id);
      // Filtrar apenas serviços que ainda existem
      const servicosValidos = (profissional.especialidades || []).filter(esp => 
        servicosDisponiveis.some(s => s.nome === esp)
      );
      setProfissionalData({
        nome: profissional.nome || '',
        telefone: profissional.telefone || '',
        email: profissional.email || '',
        especialidades: servicosValidos
      });
    } 
    // Novo profissional
    else {
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
    setProfissionalData({
      nome: '',
      telefone: '',
      email: '',
      especialidades: []
    });
  };

  const handleSubmitProfissional = (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!profissionalData.nome.trim()) {
      alert('❌ Informe o nome do profissional!');
      return;
    }

    if (!profissionalData.telefone.trim()) {
      alert('❌ Informe o telefone do profissional!');
      return;
    }

    if (!profissionalData.email.trim()) {
      alert('❌ Informe o email do profissional!');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profissionalData.email)) {
      alert('❌ Email inválido!');
      return;
    }

    try {
      let profissionalId;
      
      if (editingProfissionalId) {
        // Atualizar profissional existente
        profissionalId = editingProfissionalId;
        setProfissionais(profissionais.map(p => 
          p.id === editingProfissionalId 
            ? { 
                ...profissionalData, 
                id: editingProfissionalId, 
                salaoId: salaoAtual.id 
              }
            : p
        ));
      } else {
        // Criar novo profissional
        profissionalId = Math.max(...profissionais.map(p => p.id), 0) + 1;
        const newProfissional = {
          ...profissionalData,
          id: profissionalId,
          salaoId: salaoAtual.id
        };
        setProfissionais([...profissionais, newProfissional]);
      }
      
      // ✅ ATUALIZAR OS SERVIÇOS COM O PROFISSIONAL
      // Obter lista de serviços antigos e novos do profissional
      const servicosAntigos = editingProfissionalId 
        ? profissionais.find(p => p.id === editingProfissionalId)?.especialidades || []
        : [];
      const servicosNovos = profissionalData.especialidades;
      
      // Atualizar serviços
      setServicos(servicos.map(servico => {
        if (servico.salaoId !== salaoAtual.id) return servico;
        
        const servicoPertenceAoProfissional = servicosNovos.includes(servico.nome);
        const servicoPertenciaAoProfissional = servicosAntigos.includes(servico.nome);
        
        let profissionaisAtualizados = [...(servico.profissionaisHabilitados || [])];
        
        // Se o serviço agora pertence ao profissional, adicionar
        if (servicoPertenceAoProfissional && !profissionaisAtualizados.includes(profissionalId)) {
          profissionaisAtualizados.push(profissionalId);
        }
        
        // Se o serviço não pertence mais ao profissional, remover
        if (!servicoPertenceAoProfissional && profissionaisAtualizados.includes(profissionalId)) {
          profissionaisAtualizados = profissionaisAtualizados.filter(id => id !== profissionalId);
        }
        
        return {
          ...servico,
          profissionaisHabilitados: profissionaisAtualizados
        };
      }));
      
      alert(editingProfissionalId 
        ? '✅ Profissional atualizado com sucesso!' 
        : '✅ Profissional cadastrado com sucesso!'
      );
      
      handleCloseProfissionalModal();
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
      alert('❌ Erro ao salvar profissional. Tente novamente.');
    }
  };

  const handleDeleteProfissional = (id) => {
    const profissional = profissionaisSalao.find(p => p.id === id);
    
    if (!profissional) return;

    if (confirm(`⚠️ Tem certeza que deseja excluir o profissional "${profissional.nome}"?\n\nEle será removido de todos os serviços vinculados.`)) {
      try {
        // Remover profissional
        setProfissionais(profissionais.filter(p => p.id !== id));
        
        // Remover profissional de todos os serviços
        setServicos(servicos.map(servico => ({
          ...servico,
          profissionaisHabilitados: (servico.profissionaisHabilitados || []).filter(profId => profId !== id)
        })));
        
        alert('✅ Profissional excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar profissional:', error);
        alert('❌ Erro ao excluir profissional. Tente novamente.');
      }
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="space-y-6">
      <ConfiguracoesHeader />

      <ConfiguracoesTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

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

        {activeTab === 'servicos' && (
          <ConfiguracoesServicos />
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

        {activeTab === 'comunicacoes' && (
          <ConfiguracoesComunicacoes />
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
          servicosDisponiveis={servicosDisponiveis}
          onToggleServico={handleServicoToggle}
        />
      )}
    </div>
  );
};

export default Configuracoes;