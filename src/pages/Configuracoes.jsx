// src/pages/Configuracoes.jsx - CÓDIGO COMPLETO COM RESTRIÇÕES DE PLANO
import { useState, useContext } from 'react';
import { 
  Settings, 
  Building2, 
  MapPin, 
  Crown, 
  Check, 
  Upload, 
  Phone, 
  Mail,
  Users,
  Edit,
  Trash2,
  Plus,
  X,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import MaskedInput from '../components/MaskedInput';
import Modal from '../components/Modal';
import { canAddMore, getLimitMessage } from '../utils/planRestrictions';

const Configuracoes = () => {
  const { 
    salaoAtual, 
    saloes,
    atualizarSalao, 
    deletarSalao,
    profissionais, 
    setProfissionais, 
    resetarDadosSalao,
    resetarTodosSistema,
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

  const [logoPreview, setLogoPreview] = useState(null);

  // Obter profissionais do salão atual
  const profissionaisSalao = getProfissionaisPorSalao();

  // Verificar limites do plano
  const canAddProfissional = canAddMore(salaoAtual.plano, 'profissionais', profissionaisSalao.length);
  const limiteProfissionais = getLimitMessage(salaoAtual.plano, 'profissionais');

   const planos = [
  {
    id: 'inicial',
    nome: 'Plano Inicial',
    preco: 'Gratuito',
    destaque: false,
    recursos: [
      '1 salão',
      '1 profissional',
      'Até 10 clientes',
      '2 categorias, 2 serviços por categoria',
      '1 fornecedor, 3 produtos',
      'Agendamento básico (sistema)',
      '✅ Notificações de confirmação',
      '❌ Sem agenda online',
      '❌ Sem financeiro',
      '❌ Sem relatórios'
    ]
  },
  {
    id: 'essencial',
    nome: 'Plano Essencial',
    preco: 'R$ 29,90',
    destaque: false,
    recursos: [
      '1 salão',
      'Até 2 profissionais',
      'Até 30 clientes',
      '3 categorias, 3 serviços por categoria',
      '2 fornecedores, 5 produtos',
      '✅ Agenda online (link compartilhável)',
      '✅ Notificações: confirmação + cancelamento',
      '✅ Relatórios de agendamentos',
      '❌ Sem financeiro',
      '❌ Sem notificações de alteração'
    ]
  },
  {
    id: 'plus',
    nome: 'Plano Plus',
    preco: 'R$ 49,50',
    destaque: false,
    recursos: [
      '1 salão',
      'Até 5 profissionais',
      'Até 100 clientes',
      '5 categorias, 5 serviços por categoria',
      '5 fornecedores, 15 produtos',
      '✅ Controle financeiro simples',
      '✅ Agenda online avançada',
      '✅ Notificações: confirmação + cancelamento',
      '✅ Relatórios básicos',
      '❌ Sem notificações de alteração/avaliação'
    ]
  },
  {
    id: 'profissional',
    nome: 'Plano Profissional',
    preco: 'R$ 79,90',
    destaque: true,
    recursos: [
      'Até 2 salões',
      'Até 10 profissionais por salão',
      'Até 300 clientes por salão',
      'Categorias e serviços ilimitados',
      '10 fornecedores, 30 produtos',
      '✅ Financeiro completo',
      '✅ Link de agendamento personalizado',
      '✅ Notificações: confirmação + alteração + cancelamento',
      '✅ Relatórios detalhados',
      '✅ Análise de comissões',
      '❌ Sem solicitação de avaliação automática'
    ]
  },
  {
    id: 'premium',
    nome: 'Plano Premium',
    preco: 'R$ 99,90',
    destaque: false,
    recursos: [
      'Até 5 salões',
      'Até 10 profissionais por salão',
      'Até 500 clientes por salão',
      'Categorias e serviços ilimitados',
      '30 fornecedores, 100 produtos',
      '✅ Financeiro completo',
      '✅ Relatórios multi-salão',
      '✅ TODAS as notificações (confirmação, alteração, cancelamento)',
      '✅ Solicitação automática de avaliação/feedback',
      '✅ Análises comparativas',
      '✅ Previsões e projeções'
    ]
  },
  {
    id: 'master',
    nome: 'Plano Master',
    preco: 'R$ 149,90',
    destaque: false,
    recursos: [
      'Salões ilimitados',
      'Profissionais ilimitados',
      'Clientes ilimitados',
      'Todos recursos liberados',
      '✅ TODAS as notificações incluindo avaliações',
      '✅ Estoque, campanhas e integrações',
      '✅ Marketing e fiscal (NFe)',
      '✅ Histórico completo',
      '✅ Backup em nuvem',
      '✅ Prioridade no suporte',
      '✅ App personalizado',
      '✅ Relatórios customizáveis'
    ]
  }
];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfissionalChange = (e) => {
    const { name, value } = e.target;
    setProfissionalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEspecialidadeToggle = (especialidade) => {
    setProfissionalData(prev => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidade)
        ? prev.especialidades.filter(e => e !== especialidade)
        : [...prev.especialidades, especialidade]
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          logo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveGeral = (e) => {
    e.preventDefault();
    atualizarSalao(salaoAtual.id, formData);
    alert('Informações atualizadas com sucesso!');
  };

  const handleChangePlano = (planoId) => {
    if (confirm(`Deseja alterar para o ${planos.find(p => p.id === planoId).nome}?`)) {
      atualizarSalao(salaoAtual.id, { plano: planoId });
      alert('Plano alterado com sucesso!');
    }
  };

  const handleOpenProfissionalModal = (profissional = null) => {
    // Verificar limite ao adicionar novo
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
          <p className="text-gray-600 mt-1">Gerencie as configurações do seu salão</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={resetarDadosSalao}
            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            <AlertTriangle size={18} />
            <span>Resetar Dados do Salão</span>
          </button>
          <button
            onClick={resetarTodosSistema}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <X size={18} />
            <span>Resetar Todo Sistema</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('geral')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'geral'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Building2 size={20} />
            <span>Informações Gerais</span>
          </button>
          <button
            onClick={() => setActiveTab('profissionais')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'profissionais'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users size={20} />
            <span>Profissionais</span>
          </button>
          <button
            onClick={() => setActiveTab('planos')}
            className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'planos'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            data-tab="planos"
          >
            <Crown size={20} />
            <span>Planos e Assinatura</span>
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="p-6">
          {/* Tab Informações Gerais */}
          {activeTab === 'geral' && (
            <form onSubmit={handleSaveGeral} className="space-y-6">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo do Salão
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                    {logoPreview || formData.logo ? (
                      <img 
                        src={logoPreview || formData.logo} 
                        alt="Logo" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="text-gray-400" size={32} />
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <Upload size={18} />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Formatos aceitos: JPG, PNG (máx. 2MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Nome do Salão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Salão *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização (Endereço Completo) *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Rua, número - Bairro - Cidade/Estado"
                  />
                </div>
              </div>

              {/* Contatos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <MaskedInput
                      mask="phone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                {saloes.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDeletarSalao}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Excluir Este Salão
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all ml-auto"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}

          {/* Tab Profissionais */}
          {activeTab === 'profissionais' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Gerenciar Profissionais
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Profissionais: {profissionaisSalao.length} {limiteProfissionais !== 'Ilimitado' ? `/ ${limiteProfissionais.replace('Máximo: ', '')}` : '(Ilimitado)'}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenProfissionalModal()}
                  disabled={!canAddProfissional}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    canAddProfissional
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAddProfissional ? <Plus size={18} /> : <Lock size={18} />}
                  <span>Adicionar Profissional</span>
                </button>
              </div>

              {/* Alerta de Limite */}
              {!canAddProfissional && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Crown className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
                    <div>
                      <p className="font-semibold text-yellow-800">Limite de profissionais atingido!</p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Seu plano <strong>{salaoAtual.plano}</strong> permite até <strong>{limiteProfissionais.replace('Máximo: ', '')}</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de Profissionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profissionaisSalao.map(prof => (
                  <div key={prof.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                          {prof.nome.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{prof.nome}</h4>
                          <p className="text-sm text-gray-600">{prof.especialidades.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleOpenProfissionalModal(prof)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProfissional(prof.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone size={14} />
                        <span>{prof.telefone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{prof.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {profissionaisSalao.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhum profissional cadastrado neste salão.</p>
                  <p className="text-sm mt-2">Clique em "Adicionar Profissional" para começar.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab Planos */}
          {activeTab === 'planos' && (
            <div className="space-y-6">
              {/* Plano Atual */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Seu Plano Atual</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {planos.find(p => p.id === salaoAtual.plano)?.nome || 'Plano Inicial'}
                    </h3>
                  </div>
                  <Crown size={48} className="opacity-80" />
                </div>
              </div>

              {/* Grid de Planos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {planos.map(plano => (
                  <div
                    key={plano.id}
                    className={`rounded-lg border-2 p-6 transition-all ${
                      salaoAtual.plano === plano.id
                        ? 'border-purple-600 bg-purple-50'
                        : plano.destaque
                        ? 'border-pink-400 bg-pink-50'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    {plano.destaque && (
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                        MAIS POPULAR
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {plano.nome}
                    </h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-purple-600">
                        {plano.preco}
                      </span>
                      {plano.preco !== 'Gratuito' && (
                        <span className="text-gray-600 text-sm">/mês</span>
                      )}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plano.recursos.map((recurso, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                          <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{recurso}</span>
                        </li>
                      ))}
                    </ul>

                    {salaoAtual.plano === plano.id ? (
                      <button
                        disabled
                        className="w-full py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                      >
                        Plano Atual
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChangePlano(plano.id)}
                        className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Escolher Plano
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Profissional */}
      <Modal
        isOpen={showProfissionalModal}
        onClose={handleCloseProfissionalModal}
        title={editingProfissionalId ? 'Editar Profissional' : 'Novo Profissional'}
        size="md"
      >
        <form onSubmit={handleSubmitProfissional} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={profissionalData.nome}
              onChange={handleProfissionalChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <MaskedInput
                mask="phone"
                name="telefone"
                value={profissionalData.telefone}
                onChange={handleProfissionalChange}
                required
                placeholder="(11) 91111-1111"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={profissionalData.email}
                onChange={handleProfissionalChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidades *
            </label>
            <div className="grid grid-cols-2 gap-2 p-4 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
              {especialidadesDisponiveis.map(esp => (
                <label key={esp} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={profissionalData.especialidades.includes(esp)}
                    onChange={() => handleEspecialidadeToggle(esp)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{esp}</span>
                </label>
              ))}
            </div>
            {profissionalData.especialidades.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Selecione pelo menos uma especialidade</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseProfissionalModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={profissionalData.especialidades.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingProfissionalId ? 'Salvar Alterações' : 'Cadastrar Profissional'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Configuracoes;