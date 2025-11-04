// src/pages/Agendamentos.jsx - COM SINCRONIZAÇÃO EM TEMPO REAL

import { useState, useContext, useEffect, useMemo } from 'react';
import Modal from '../components/Modal';
import { SalaoContext } from '../contexts/SalaoContext';
import notificationService from '../services/notificationService';
import AgendamentoHeader from '../components/agendamentos/AgendamentoHeader';
import AgendamentoFiltros from '../components/agendamentos/AgendamentoFiltros';
import AgendamentoLista from '../components/agendamentos/AgendamentoLista';
import AgendamentoCalendario from '../components/agendamentos/AgendamentoCalendario';
import AgendamentoFormulario from '../components/agendamentos/AgendamentoFormulario';
import { formatarDuracao } from '../utils/agendamentoUtils';
import { useRealtimeAgendamentos } from '../hooks/useRealtimeAgendamentos';
import { RefreshCw } from 'lucide-react';

const Agendamentos = () => {
  const { 
    salaoAtual,
    clientes, 
    profissionais, 
    servicos,
    setAgendamentos,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao
  } = useContext(SalaoContext);
  
  // ✅ USAR HOOK DE TEMPO REAL
  const { 
    agendamentos: agendamentosSalaoRealtime, 
    isUpdating, 
    lastUpdate,
    forceRefresh 
  } = useRealtimeAgendamentos(salaoAtual.id, 2000);
  
  // Estados
  const [viewMode, setViewMode] = useState('lista');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    clienteId: '',
    servicoId: '',
    profissionalId: '',
    data: '',
    horario: '',
    status: 'pendente',
    notificarCliente: true
  });

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState([]);

  // Dados do salão atual
  const clientesSalao = useMemo(() => getClientesPorSalao(), [clientes, salaoAtual.id]);
  const profissionaisSalao = useMemo(() => getProfissionaisPorSalao(), [profissionais, salaoAtual.id]);
  const servicosSalao = useMemo(() => getServicosPorSalao(), [servicos, salaoAtual.id]);

  // ✅ USAR AGENDAMENTOS DO HOOK REALTIME
  const agendamentosSalao = agendamentosSalaoRealtime;

  // Constantes
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Atualizar cliente selecionado
  useEffect(() => {
    if (formData.clienteId) {
      const cliente = clientesSalao.find(c => c.id === parseInt(formData.clienteId));
      setClienteSelecionado(cliente);
    } else {
      setClienteSelecionado(null);
    }
  }, [formData.clienteId, clientesSalao]);

  // Atualizar profissionais disponíveis quando serviço muda
  useEffect(() => {
    if (formData.servicoId) {
      const servico = servicosSalao.find(s => s.id === parseInt(formData.servicoId));
      setServicoSelecionado(servico);
      
      if (servico && servico.profissionaisHabilitados) {
        const profsDisponiveis = profissionaisSalao.filter(p => 
          servico.profissionaisHabilitados.includes(p.id)
        );
        setProfissionaisDisponiveis(profsDisponiveis);
        
        if (formData.profissionalId && !servico.profissionaisHabilitados.includes(parseInt(formData.profissionalId))) {
          setFormData(prev => ({ ...prev, profissionalId: '' }));
        }
      }
    } else {
      setServicoSelecionado(null);
      setProfissionaisDisponiveis([]);
    }
  }, [formData.servicoId, servicosSalao, profissionaisSalao, formData.profissionalId]);

  // Handlers
  const handleOpenModal = (agendamento = null) => {
    if (agendamento) {
      setEditingId(agendamento.id);
      setFormData({
        clienteId: agendamento.clienteId.toString(),
        servicoId: agendamento.servicoId.toString(),
        profissionalId: agendamento.profissionalId.toString(),
        data: agendamento.data,
        horario: agendamento.horario,
        status: agendamento.status,
        notificarCliente: true
      });
    } else {
      setEditingId(null);
      setFormData({
        clienteId: '',
        servicoId: '',
        profissionalId: '',
        data: '',
        horario: '',
        status: 'pendente',
        notificarCliente: true
      });
      setClienteSelecionado(null);
      setServicoSelecionado(null);
      setProfissionaisDisponiveis([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      clienteId: '',
      servicoId: '',
      profissionalId: '',
      data: '',
      horario: '',
      status: 'pendente',
      notificarCliente: true
    });
    setClienteSelecionado(null);
    setServicoSelecionado(null);
    setProfissionaisDisponiveis([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar se horário está disponível
    const horarioOcupado = agendamentosSalao.some(ag => 
      ag.id !== editingId &&
      ag.data === formData.data && 
      ag.horario === formData.horario &&
      ag.profissionalId === parseInt(formData.profissionalId) &&
      ag.status !== 'cancelado'
    );

    if (horarioOcupado) {
      alert('⚠️ Este horário já está ocupado. Por favor, escolha outro horário.');
      return;
    }

    const agendamentosAll = JSON.parse(localStorage.getItem('agendamentos') || '[]');

    const agendamentoData = {
      clienteId: parseInt(formData.clienteId),
      servicoId: parseInt(formData.servicoId),
      profissionalId: parseInt(formData.profissionalId),
      data: formData.data,
      horario: formData.horario,
      status: formData.status,
      salaoId: salaoAtual.id
    };

    if (editingId) {
      // Atualizar agendamento existente
      const agendamentoAntigo = agendamentosAll.find(ag => ag.id === editingId);
      
      const updated = agendamentosAll.map(ag => 
        ag.id === editingId ? { ...agendamentoData, id: editingId } : ag
      );
      
      localStorage.setItem('agendamentos', JSON.stringify(updated));
      setAgendamentos(updated);

      // ✅ DISPARAR EVENTO STORAGE
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'agendamentos',
        newValue: JSON.stringify(updated),
        url: window.location.href
      }));

      // Notificações
      if (agendamentoAntigo.status !== 'cancelado' && formData.status === 'cancelado') {
        if (formData.notificarCliente && clienteSelecionado?.email) {
          await notificationService.notifyCancelamento(editingId);
        }
      } else {
        if (formData.notificarCliente && clienteSelecionado?.email) {
          await notificationService.notifyNovoAgendamento(editingId);
        }
      }
    } else {
      // Criar novo agendamento
      const newAgendamento = {
        ...agendamentoData,
        id: Math.max(...agendamentosAll.map(a => a.id), 0) + 1,
        origemAgendamento: 'sistema'
      };
      
      const updated = [...agendamentosAll, newAgendamento];
      localStorage.setItem('agendamentos', JSON.stringify(updated));
      setAgendamentos(updated);

      // ✅ DISPARAR EVENTO STORAGE
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'agendamentos',
        newValue: JSON.stringify(updated),
        url: window.location.href
      }));

      // Enviar notificações
      if (formData.notificarCliente && clienteSelecionado?.email) {
        await notificationService.notifyNovoAgendamento(newAgendamento.id);
      }
    }
    
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      const agendamentosAll = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const agendamento = agendamentosAll.find(ag => ag.id === id);
      
      // Notificar cancelamento
      if (agendamento && agendamento.status !== 'cancelado') {
        const cliente = clientes.find(c => c.id === agendamento.clienteId);
        if (cliente?.email) {
          await notificationService.notifyCancelamento(id);
        }
      }
      
      const updated = agendamentosAll.filter(ag => ag.id !== id);
      localStorage.setItem('agendamentos', JSON.stringify(updated));
      setAgendamentos(updated);

      // ✅ DISPARAR EVENTO STORAGE
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'agendamentos',
        newValue: JSON.stringify(updated),
        url: window.location.href
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  // Obter agendamentos completos com dados relacionados
  const getAgendamentoCompleto = useMemo(() => {
    return (agendamento) => {
      const cliente = clientes.find(c => c.id === agendamento.clienteId);
      const servico = servicos.find(s => s.id === agendamento.servicoId);
      const profissional = profissionais.find(p => p.id === agendamento.profissionalId);
      
      return {
        ...agendamento,
        cliente,
        servico,
        profissional
      };
    };
  }, [clientes, servicos, profissionais]);

  // Filtrar agendamentos
  const filteredAgendamentos = useMemo(() => {
    return agendamentosSalao
      .map(ag => getAgendamentoCompleto(ag))
      .filter(ag => {
        if (!ag.cliente || !ag.servico) return false;
        
        const matchSearch = ag.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ag.servico.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = !statusFiltro || ag.status === statusFiltro;
        
        return matchSearch && matchStatus;
      });
  }, [agendamentosSalao, searchTerm, statusFiltro, getAgendamentoCompleto]);

  // Estatísticas
  const stats = useMemo(() => ({
    total: agendamentosSalao.length,
    confirmados: agendamentosSalao.filter(a => a.status === 'confirmado').length,
    pendentes: agendamentosSalao.filter(a => a.status === 'pendente').length,
    faturamentoPrevisto: agendamentosSalao.reduce((acc, ag) => {
      const serv = servicos.find(s => s.id === ag.servicoId);
      return acc + (serv ? serv.valor : 0);
    }, 0)
  }), [agendamentosSalao, servicos]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <AgendamentoHeader 
        salaoNome={salaoAtual.nome}
        onNovoAgendamento={() => handleOpenModal()}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentDate={currentDate}
        changeMonth={changeMonth}
        monthNames={monthNames}
      />

      {/* ✅ Indicador de Sincronização */}
      {isUpdating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-2 text-blue-800">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm font-medium">Sincronizando agendamentos...</span>
          </div>
        </div>
      )}

      {!isUpdating && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-center text-sm text-green-800">
            ✅ Agendamentos sincronizados • Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      )}

      {/* Filtros */}
      <AgendamentoFiltros 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
      />

      {/* Visualização Lista */}
      {viewMode === 'lista' && (
        <AgendamentoLista 
          agendamentos={filteredAgendamentos}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      {/* Visualização Calendário */}
      {viewMode === 'calendario' && (
        <AgendamentoCalendario 
          currentDate={currentDate}
          agendamentos={agendamentosSalao}
          clientes={clientes}
          servicos={servicos}
          onAgendamentoClick={handleOpenModal}
        />
      )}

      {/* Modal de Cadastro/Edição */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
        size="lg"
      >
        <AgendamentoFormulario 
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingId={editingId}
          clientesSalao={clientesSalao}
          servicosSalao={servicosSalao}
          profissionaisDisponiveis={profissionaisDisponiveis}
          clienteSelecionado={clienteSelecionado}
          servicoSelecionado={servicoSelecionado}
          onClose={handleCloseModal}
        />
      </Modal>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total de Agendamentos</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Confirmados</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.confirmados}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendentes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Faturamento Previsto</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            R$ {stats.faturamentoPrevisto.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;