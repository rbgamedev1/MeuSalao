// src/pages/Servicos.jsx - CÓDIGO COMPLETO COM RESTRIÇÕES
import { useState, useContext } from 'react';
import { Crown, Lock } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import { generateDurationOptions } from '../utils/masks';
import { canAddMore, getLimitMessage, canAddServiceToCategory } from '../utils/planRestrictions';
import ServicosHeader from '../components/servicos/ServicosHeader';
import ServicosStats from '../components/servicos/ServicosStats';
import ServicosFilters from '../components/servicos/ServicosFilters';
import ServicosGrid from '../components/servicos/ServicosGrid';
import ServicoModal from '../components/servicos/ServicoModal';
import CategoriaModal from '../components/servicos/CategoriaModal';

const Servicos = () => {
  const { 
    salaoAtual,
    servicos, 
    setServicos, 
    categorias, 
    setCategorias, 
    profissionais,
    getServicosPorSalao,
    getProfissionaisPorSalao
  } = useContext(SalaoContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [categoriaParaEditar, setCategoriaParaEditar] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState('');

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

  // Verificar limites do plano
  const canAddServico = canAddMore(salaoAtual.plano, 'servicosPorCategoria', servicosSalao.length);
  const limiteServicos = getLimitMessage(salaoAtual.plano, 'servicosPorCategoria');
  const canAddCategoria = canAddMore(salaoAtual.plano, 'categorias', categorias.length);
  const limiteCategorias = getLimitMessage(salaoAtual.plano, 'categorias');

  const handleOpenModal = (servico = null) => {
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

  // Gerenciamento de Categorias
  const handleAddCategoria = () => {
    if (novaCategoria.trim() && !categorias.includes(novaCategoria.trim())) {
      setCategorias([...categorias, novaCategoria.trim()]);
      setNovaCategoria('');
    }
  };

  const handleDeleteCategoria = (categoria) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoria}"?`)) {
      // Verificar se existem serviços usando esta categoria no salão atual
      const servicosComCategoria = servicosSalao.filter(s => s.categoria === categoria);
      if (servicosComCategoria.length > 0) {
        alert(`Não é possível excluir. Existem ${servicosComCategoria.length} serviço(s) usando esta categoria neste salão.`);
        return;
      }
      setCategorias(categorias.filter(c => c !== categoria));
    }
  };

  const handleEditCategoria = (categoriaAntiga) => {
    setCategoriaEditando(categoriaAntiga);
    setCategoriaParaEditar(categoriaAntiga);
  };

  const handleSaveEditCategoria = () => {
    if (categoriaParaEditar.trim() && categoriaParaEditar !== categoriaEditando) {
      // Atualizar categoria
      setCategorias(categorias.map(c => c === categoriaEditando ? categoriaParaEditar.trim() : c));
      
      // Atualizar serviços que usam esta categoria
      setServicos(servicos.map(s => 
        s.categoria === categoriaEditando 
          ? { ...s, categoria: categoriaParaEditar.trim() }
          : s
      ));
    }
    setCategoriaEditando('');
    setCategoriaParaEditar('');
  };

  const handleCloseCategoriaModal = () => {
    setShowCategoriaModal(false);
    setCategoriaEditando('');
    setNovaCategoria('');
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
        onOpenCategoriaModal={() => setShowCategoriaModal(true)}
        onOpenServicoModal={() => handleOpenModal()}
      />

      {/* Alertas de Limite */}
      {!canAddServico && (
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-blue-900">
              Serviços: {servicosSalao.length} {limiteServicos !== 'Ilimitado' ? `(${limiteServicos})` : '(Ilimitado)'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Categorias: {categorias.length} {limiteCategorias !== 'Ilimitado' ? `/ ${limiteCategorias.replace('Máximo: ', '')}` : '(Ilimitado)'}
            </p>
          </div>
        </div>
      </div>

      <ServicosStats 
        totalServicos={totalServicos}
        valorMedio={valorMedio}
        servicosPremium={servicosMaisCaros}
        totalCategorias={categorias.length}
      />

      <ServicosFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoriaFiltro={categoriaFiltro}
        setCategoriaFiltro={setCategoriaFiltro}
        categorias={categorias}
      />

      <ServicosGrid 
        filteredServicos={filteredServicos}
        profissionais={profissionais}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDelete}
      />

      <ServicoModal 
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        editingId={editingId}
        formData={formData}
        handleChange={handleChange}
        handleProfissionalToggle={handleProfissionalToggle}
        handleSubmit={handleSubmit}
        categorias={categorias}
        profissionaisSalao={profissionaisSalao}
        durationOptions={durationOptions}
        servicosSalao={servicosSalao}
      />

      <CategoriaModal 
        showCategoriaModal={showCategoriaModal}
        handleCloseCategoriaModal={handleCloseCategoriaModal}
        categorias={categorias}
        novaCategoria={novaCategoria}
        setNovaCategoria={setNovaCategoria}
        handleAddCategoria={handleAddCategoria}
        categoriaEditando={categoriaEditando}
        categoriaParaEditar={categoriaParaEditar}
        setCategoriaEditando={setCategoriaEditando}
        setCategoriaParaEditar={setCategoriaParaEditar}
        handleEditCategoria={handleEditCategoria}
        handleSaveEditCategoria={handleSaveEditCategoria}
        handleDeleteCategoria={handleDeleteCategoria}
        servicosSalao={servicosSalao}
      />
    </div>
  );
};

export default Servicos;