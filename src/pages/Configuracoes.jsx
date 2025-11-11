// src/pages/Configuracoes.jsx - CÓDIGO COMPLETO E CORRIGIDO

import { useState, useContext } from 'react';
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
  
  const [activeTab, setActiveTab] = useState('geral');
  const [showProfissionalModal, setShowProfissionalModal] = useState(false);
  const [editingProfissionalId, setEditingProfissionalId] = useState(null);

  // Form data para informações gerais
  const [formData, setFormData] = useState({
    nome: salaoAtual.nome,
    endereco: salaoAtual.endereco,
    telefone: salaoAtual.telefone,
    email: salaoAtual.email,
    logo: salaoAtual.logo
  });

  // Form data para profissional
  const [profissionalData, setProfissionalData] = useState({
    nome: '',
    telefone: '',
    email: '',
    especialidades: []
  });

  // State para categorias e serviços
  const [categoriasServicos, setCategoriasServicos] = useState(
    salaoAtual.categoriasServicos || {}
  );

  const [logoPreview, setLogoPreview] = useState(null);

  // Obter profissionais do salão atual
  const profissionaisSalao = getProfissionaisPorSalao();

  // Verificar limites do plano
  const canAddProfissional = canAddMore(salaoAtual.plano, 'profissionais', profissionaisSalao.length);
  const limiteProfissionais = getLimitMessage(salaoAtual.plano, 'profissionais');

  const especialidadesDisponiveis = [
    'Corte',
    'Coloração',
    'Escova',
    'Hidratação',
    'Manicure',
    'Pedicure',
    'Barba',
    'Design de Sobrancelhas',
    'Maquiagem',
    'Depilação'
  ];

  // Handlers para Informações Gerais
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    atualizarSalao(salaoAtual.id, formData);
    alert('Informações atualizadas com sucesso!');
  };

  const handleDeletarSalao = () => {
    if (saloes.length === 1) {
      alert('Você não pode excluir o único salão cadastrado.');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o salão "${salaoAtual.nome}"? Todos os dados relacionados a este salão serão perdidos permanentemente!`)) {
      const sucesso = deletarSalao(salaoAtual.id);
      if (sucesso) {
        alert('Salão excluído com sucesso!');
      }
    }
  };

  // ===== HANDLERS PARA CATEGORIAS E SERVIÇOS - CORRIGIDOS =====
  
  const handleToggleCategoria = (categoriaId) => {
    setCategoriasServicos(prev => {
      const novoEstado = { ...prev };
      
      if (novoEstado[categoriaId]?.ativa) {
        // Se está desmarcando, remove TUDO (categoria + subcategorias + serviços)
        delete novoEstado[categoriaId];
      } else {
        // Se está marcando, inicializa vazio MAS mantém o que já existe
        novoEstado[categoriaId] = {
          ativa: true,
          subcategorias: novoEstado[categoriaId]?.subcategorias || {} // PRESERVA subcategorias existentes
        };
      }
      
      return novoEstado;
    });
  };

  const handleToggleSubcategoria = (categoriaId, subcategoriaId) => {
    setCategoriasServicos(prev => {
      const novoEstado = { ...prev };
      
      // Garantir que a categoria existe e está ativa
      if (!novoEstado[categoriaId] || !novoEstado[categoriaId].ativa) {
        // Se a categoria não está ativa, não permite selecionar subcategoria
        alert('Por favor, ative a categoria primeiro clicando no checkbox ao lado do nome da categoria!');
        return prev; // Retorna o estado anterior sem mudanças
      }
      
      if (!novoEstado[categoriaId].subcategorias) {
        novoEstado[categoriaId].subcategorias = {};
      }
      
      // Toggle da subcategoria
      if (novoEstado[categoriaId].subcategorias[subcategoriaId]?.ativa) {
        // Desmarcando - remove a subcategoria
        delete novoEstado[categoriaId].subcategorias[subcategoriaId];
      } else {
        // Marcando - inicializa
        novoEstado[categoriaId].subcategorias[subcategoriaId] = {
          ativa: true,
          servicos: novoEstado[categoriaId].subcategorias[subcategoriaId]?.servicos || [] // PRESERVA serviços existentes
        };
      }
      
      return novoEstado;
    });
  };

  const handleToggleServico = (categoriaId, subcategoriaId, servico) => {
    setCategoriasServicos(prev => {
      const novoEstado = { ...prev };
      
      // Garantir estrutura existe
      if (!novoEstado[categoriaId] || !novoEstado[categoriaId].ativa) {
        alert('Por favor, ative a categoria primeiro!');
        return prev;
      }
      
      if (!novoEstado[categoriaId].subcategorias || 
          !novoEstado[categoriaId].subcategorias[subcategoriaId]?.ativa) {
        alert('Por favor, ative a subcategoria primeiro!');
        return prev;
      }
      
      if (!novoEstado[categoriaId].subcategorias[subcategoriaId].servicos) {
        novoEstado[categoriaId].subcategorias[subcategoriaId].servicos = [];
      }
      
      const servicos = novoEstado[categoriaId].subcategorias[subcategoriaId].servicos || [];
      
      if (servicos.includes(servico)) {
        // Remove o serviço
        novoEstado[categoriaId].subcategorias[subcategoriaId].servicos = servicos.filter(s => s !== servico);
      } else {
        // Adiciona o serviço
        novoEstado[categoriaId].subcategorias[subcategoriaId].servicos = [...servicos, servico];
      }
      
      return novoEstado;
    });
  };

  const handleSaveCategorias = () => {
    atualizarSalao(salaoAtual.id, { categoriasServicos });
    alert('Categorias e serviços atualizados com sucesso!');
  };

  // Handlers para Profissionais
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
    if (!profissional && !canAddProfissional) {
      alert(`Limite de profissionais atingido para o plano ${salaoAtual.plano}. ${limiteProfissionais}\n\nFaça upgrade do seu plano para adicionar mais profissionais.`);
      return;
    }

    if (profissional) {
      setEditingProfissionalId(profissional.id);
      setProfissionalData({
        nome: profissional.nome,
        telefone: profissional.telefone,
        email: profissional.email,
        especialidades: profissional.especialidades || []
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
    
    if (editingProfissionalId) {
      setProfissionais(profissionais.map(p => 
        p.id === editingProfissionalId 
          ? { ...profissionalData, id: editingProfissionalId, salaoId: salaoAtual.id }
          : p
      ));
    } else {
      const newProfissional = {
        ...profissionalData,
        id: Math.max(...profissionais.map(p => p.id), 0) + 1,
        salaoId: salaoAtual.id
      };
      setProfissionais([...profissionais, newProfissional]);
    }
    
    handleCloseProfissionalModal();
  };

  const handleDeleteProfissional = (id) => {
    if (confirm('Tem certeza que deseja excluir este profissional?')) {
      setProfissionais(profissionais.filter(p => p.id !== id));
    }
  };

  // Handler para Planos
  const handleChangePlano = (planoId) => {
    const planoSelecionado = PLANOS_DATA.find(p => p.id === planoId);
    
    if (!planoSelecionado.disponivel) {
      alert(`O plano ${planoSelecionado.nome} estará disponível em breve!\n\nEntre em contato conosco para receber novidades sobre este plano.`);
      return;
    }

    if (confirm(`Deseja alterar para o ${planoSelecionado.nome}?`)) {
      atualizarSalao(salaoAtual.id, { plano: planoId });
      alert('Plano alterado com sucesso!');
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
    </div>
  );
};

export default Configuracoes;