// src/pages/Servicos.jsx - CORRIGIDO: Melhor tratamento de serviços disponíveis

import { useState, useContext } from 'react';
import { AlertCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SalaoContext } from '../contexts/SalaoContext';
import { CATEGORIAS_SERVICOS } from '../data/categoriasServicosData';
import { generateDurationOptions } from '../utils/masks';
import ServicosHeader from '../components/servicos/ServicosHeader';
import ServicosStats from '../components/servicos/ServicosStats';
import ServicosFilters from '../components/servicos/ServicosFilters';
import ServicosGrid from '../components/servicos/ServicosGrid';
import ServicoModal from '../components/servicos/ServicoModal';

const Servicos = () => {
  const navigate = useNavigate();
  const { 
    salaoAtual,
    servicos, 
    setServicos, 
    profissionais,
    getServicosPorSalao,
    getProfissionaisPorSalao,
    getServicosDisponiveis
  } = useContext(SalaoContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    subcategoria: '',
    duracao: 30,
    valor: '',
    comissao: '',
    descricao: '',
    profissionaisHabilitados: [],
    ativo: true
  });

  const durationOptions = generateDurationOptions();

  // Obter apenas serviços e profissionais do salão atual
  const servicosSalao = getServicosPorSalao();
  const profissionaisSalao = getProfissionaisPorSalao();
  const servicosDisponiveis = getServicosDisponiveis();

  // Verificar se há categorias configuradas
  const hasCategoriasConfiguradas = servicosDisponiveis.length > 0;

  // Obter lista de categorias únicas para filtro
  const categoriasParaFiltro = [...new Set(
    servicosDisponiveis.map(s => {
      const cat = CATEGORIAS_SERVICOS.find(c => c.id === s.categoriaId);
      return cat?.nome;
    })
  )].filter(Boolean);

  const handleOpenModal = (servico = null) => {
    // Verificar se há categorias configuradas
    if (!hasCategoriasConfiguradas) {
      const confirmar = window.confirm(
        '⚠️ Nenhum serviço configurado!\n\n' +
        'Você precisa configurar as categorias e serviços do salão antes de cadastrar serviços.\n\n' +
        'Deseja ir para a página de Configurações agora?'
      );
      
      if (confirmar) {
        navigate('/configuracoes');
      }
      return;
    }

    if (servico) {
      setEditingId(servico.id);
      setFormData({
        nome: servico.nome,
        categoria: servico.categoria,
        subcategoria: servico.subcategoria,
        duracao: servico.duracao,
        valor: servico.valor.toFixed(2),
        comissao: servico.comissao.toString(),
        descricao: servico.descricao,
        profissionaisHabilitados: servico.profissionaisHabilitados || [],
        ativo: servico.ativo
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        categoria: '',
        subcategoria: '',
        duracao: 30,
        valor: '',
        comissao: '0',
        descricao: '',
        profissionaisHabilitados: [],
        ativo: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setServicos(servicos.map(s => 
        s.id === editingId 
          ? { 
              ...formData, 
              id: editingId,
              duracao: parseInt(formData.duracao),
              valor: parseFloat(formData.valor),
              comissao: formData.comissao ? parseInt(formData.comissao) : 0,
              salaoId: salaoAtual.id
            } 
          : s
      ));
      alert('Serviço atualizado com sucesso!');
    } else {
      const newServico = {
        ...formData,
        id: Math.max(...servicos.map(s => s.id), 0) + 1,
        duracao: parseInt(formData.duracao),
        valor: parseFloat(formData.valor),
        comissao: formData.comissao ? parseInt(formData.comissao) : 0,
        salaoId: salaoAtual.id
      };
      setServicos([...servicos, newServico]);
      alert('Serviço cadastrado com sucesso!');
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServicos(servicos.filter(s => s.id !== id));
      alert('Serviço excluído com sucesso!');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfissionalToggle = (profissionalId) => {
    setFormData(prev => ({
      ...prev,
      profissionaisHabilitados: prev.profissionaisHabilitados.includes(profissionalId)
        ? prev.profissionaisHabilitados.filter(id => id !== profissionalId)
        : [...prev.profissionaisHabilitados, profissionalId]
    }));
  };

  const filteredServicos = servicosSalao.filter(servico => {
    const matchSearch = servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servico.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || servico.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  // Estatísticas
  const totalServicos = servicosSalao.length;
  const valorMedio = servicosSalao.length > 0 
    ? servicosSalao.reduce((acc, s) => acc + s.valor, 0) / servicosSalao.length 
    : 0;
  const servicosMaisCaros = servicosSalao.filter(s => s.valor > 100).length;

  return (
    <div className="space-y-6">
      <ServicosHeader 
        salaoNome={salaoAtual.nome}
        onOpenServicoModal={() => handleOpenModal()}
      />

      {/* Alerta se não há categorias configuradas */}
      {!hasCategoriasConfiguradas && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Settings className="text-yellow-600 w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 text-lg mb-2">
                Configure os serviços do seu salão primeiro
              </h3>
              <p className="text-yellow-800 mb-4">
                Antes de cadastrar serviços com preços e profissionais, você precisa selecionar 
                quais categorias e serviços seu salão oferece.
              </p>
              <button
                onClick={() => navigate('/configuracoes')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                <Settings className="w-4 h-4" />
                Ir para Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alertas de Limite - REMOVIDO */}

      {/* Info do Plano */}
      {hasCategoriasConfiguradas && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-blue-900">
                <span className="font-bold">{servicosSalao.length}</span> serviços cadastrados
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                <span className="font-bold">{servicosDisponiveis.length}</span> serviços disponíveis para cadastro
              </p>
            </div>
          </div>
        </div>
      )}

      {hasCategoriasConfiguradas && (
        <>
          <ServicosStats 
            totalServicos={totalServicos}
            valorMedio={valorMedio}
            servicosPremium={servicosMaisCaros}
            totalCategorias={categoriasParaFiltro.length}
          />

          <ServicosFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            categorias={categoriasParaFiltro}
          />

          <ServicosGrid 
            filteredServicos={filteredServicos}
            profissionais={profissionais}
            handleOpenModal={handleOpenModal}
            handleDelete={handleDelete}
          />
        </>
      )}

      <ServicoModal 
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        editingId={editingId}
        formData={formData}
        handleChange={handleChange}
        handleProfissionalToggle={handleProfissionalToggle}
        handleSubmit={handleSubmit}
        servicosDisponiveis={servicosDisponiveis}
        profissionaisSalao={profissionaisSalao}
        durationOptions={durationOptions}
        servicosSalao={servicosSalao}
      />
    </div>
  );
};

export default Servicos;