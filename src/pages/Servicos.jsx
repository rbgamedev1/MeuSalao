// src/pages/Servicos.jsx

import { useState, useContext, useMemo } from 'react';
import { Crown, AlertCircle } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import { CATEGORIAS_SERVICOS } from '../data/categoriasServicosData';
import { generateDurationOptions } from '../utils/masks';
import { canAddMore, getLimitMessage } from '../utils/planRestrictions';
import ServicosHeader from '../components/servicos/ServicosHeader';
import ServicosStats from '../components/servicos/ServicosStats';
import ServicosFilters from '../components/servicos/ServicosFilters';
import ServicosGrid from '../components/servicos/ServicosGrid';
import ServicoModal from '../components/servicos/ServicoModal';

const Servicos = () => {
  const { 
    salaoAtual,
    servicos, 
    setServicos, 
    profissionais,
    getServicosPorSalao,
    getProfissionaisPorSalao
  } = useContext(SalaoContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
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

  // Obter categorias ativas do salão
  const categoriasAtivas = useMemo(() => {
    if (!salaoAtual.categoriasServicos) return [];
    
    return Object.entries(salaoAtual.categoriasServicos)
      .filter(([_, data]) => data.ativa && data.servicos && data.servicos.length > 0)
      .map(([id, data]) => {
        const categoriaInfo = CATEGORIAS_SERVICOS.find(c => c.id === id);
        return {
          id,
          nome: categoriaInfo?.nome || id,
          servicos: data.servicos
        };
      });
  }, [salaoAtual.categoriasServicos]);

  // Verificar se há categorias configuradas
  const hasCategoriasConfiguradas = categoriasAtivas.length > 0;

  // Verificar limites do plano
  const canAddServico = canAddMore(salaoAtual.plano, 'servicosPorCategoria', servicosSalao.length);
  const limiteServicos = getLimitMessage(salaoAtual.plano, 'servicosPorCategoria');

  const handleOpenModal = (servico = null) => {
    // Verificar se há categorias configuradas
    if (!hasCategoriasConfiguradas) {
      alert('Você precisa configurar as categorias e serviços do salão antes de cadastrar serviços.\n\nVá em Configurações > Categorias e Serviços para selecionar as categorias que seu salão oferece.');
      return;
    }

    // Verificar limite ao adicionar novo
    if (!servico && !canAddServico) {
      alert(`Limite de serviços atingido para o plano ${salaoAtual.plano}. ${limiteServicos}\n\nFaça upgrade do seu plano para adicionar mais serviços.`);
      return;
    }

    if (servico) {
      setEditingId(servico.id);
      setFormData({
        nome: servico.nome,
        categoria: servico.categoria,
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
        duracao: 30,
        valor: '',
        comissao: '',
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
              comissao: parseInt(formData.comissao),
              salaoId: salaoAtual.id
            } 
          : s
      ));
    } else {
      const newServico = {
        ...formData,
        id: Math.max(...servicos.map(s => s.id), 0) + 1,
        duracao: parseInt(formData.duracao),
        valor: parseFloat(formData.valor),
        comissao: parseInt(formData.comissao),
        salaoId: salaoAtual.id
      };
      setServicos([...servicos, newServico]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServicos(servicos.filter(s => s.id !== id));
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Configure as categorias do seu salão</p>
              <p className="text-yellow-700 text-sm mt-1">
                Antes de cadastrar serviços, você precisa selecionar as categorias e serviços que seu salão oferece em <strong>Configurações &gt; Categorias e Serviços</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alertas de Limite */}
      {!canAddServico && hasCategoriasConfiguradas && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <Crown className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Limite de serviços atingido!</p>
              <p className="text-yellow-700 text-sm mt-1">
                Seu plano <strong>{salaoAtual.plano}</strong> permite até <strong>{limiteServicos.replace('Máximo: ', '')}</strong> por categoria.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info do Plano */}
      {hasCategoriasConfiguradas && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Serviços cadastrados: {servicosSalao.length} {limiteServicos !== 'Ilimitado' ? `(${limiteServicos})` : '(Ilimitado)'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Categorias configuradas: {categoriasAtivas.length}
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
            totalCategorias={categoriasAtivas.length}
          />

          <ServicosFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            categorias={categoriasAtivas.map(c => c.nome)}
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
        categoriasAtivas={categoriasAtivas}
        profissionaisSalao={profissionaisSalao}
        durationOptions={durationOptions}
        servicosSalao={servicosSalao}
      />
    </div>
  );
};

export default Servicos;