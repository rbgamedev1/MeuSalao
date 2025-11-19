// src/pages/Configuracoes.jsx - SEM VALIDAÇÃO DE DEADLOCK

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

  // ✅ MUDANÇA: Extrair especialidades dos serviços CONFIGURADOS
  // Agora é uma lista para SUGESTÃO, não uma restrição
  const especialidadesDisponiveis = useMemo(() => {
    return [...new Set(servicosSalao.map(s => s.nome))].sort();
  }, [servicosSalao]);

  // Limpar especialidades inválidas ao abrir modal de edição
  useEffect(() => {
    if (showProfissionalModal && editingProfissionalId) {
      setProfissionalData(prev => ({
        ...prev,
        especialidades: prev.especialidades.filter(esp => 
          especialidadesDisponiveis.includes(esp)
        )
      }));
    }
  }, [showProfissionalModal, especialidadesDisponiveis, editingProfissionalId]);

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

  const handleEspecialidadeToggle = (especialidade) => {
    setProfissionalData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidade)
        ? prev.especialidades.filter(e => e !== especialidade)
        : [...prev.especialidades, especialidade]
    }));
  };

  const handleOpenProfissionalModal = (profissional = null) => {
    // ✅ REMOVIDO: Validação que impedia cadastro sem serviços
    
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
      setProfissionalData({
        nome: profissional.nome || '',
        telefone: profissional.telefone || '',
        email: profissional.email || '',
        especialidades: (profissional.especialidades || []).filter(esp => 
          especialidadesDisponiveis.includes(esp)
        )
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

    // ✅ REMOVIDO: Validação que exigia especialidades

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profissionalData.email)) {
      alert('❌ Email inválido!');
      return;
    }

    try {
      if (editingProfissionalId) {
        // Atualizar profissional existente
        setProfissionais(profissionais.map(p => 
          p.id === editingProfissionalId 
            ? { 
                ...profissionalData, 
                id: editingProfissionalId, 
                salaoId: salaoAtual.id 
              }
            : p
        ));
        alert('✅ Profissional atualizado com sucesso!');
      } else {
        // Criar novo profissional
        const newProfissional = {
          ...profissionalData,
          id: Math.max(...profissionais.map(p => p.id), 0) + 1,
          salaoId: salaoAtual.id
        };
        setProfissionais([...profissionais, newProfissional]);
        alert('✅ Profissional cadastrado com sucesso!');
      }
      
      handleCloseProfissionalModal();
    } catch (error) {
      console.error('Erro ao salvar profissional:', error);
      alert('❌ Erro ao salvar profissional. Tente novamente.');
    }
  };

  const handleDeleteProfissional = (id) => {
    const profissional = profissionaisSalao.find(p => p.id === id);
    
    if (!profissional) return;

    if (confirm(`⚠️ Tem certeza que deseja excluir o profissional "${profissional.nome}"?`)) {
      try {
        setProfissionais(profissionais.filter(p => p.id !== id));
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
          especialidadesDisponiveis={especialidadesDisponiveis}
          onToggleEspecialidade={handleEspecialidadeToggle}
        />
      )}
    </div>
  );
};

export default Configuracoes;