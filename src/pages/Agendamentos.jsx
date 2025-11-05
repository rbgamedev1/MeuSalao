// src/pages/Agendamentos.jsx - CORRIGIDO: Email de avaliação ao concluir

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
  
  const { 
    agendamentos: agendamentosSalaoRealtime, 
    isUpdating, 
    lastUpdate,
    forceRefresh 
  } = useRealtimeAgendamentos(salaoAtual.id, 2000);
  
  const [viewMode, setViewMode] = useState('lista');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dadosOriginais, setDadosOriginais] = useState(null);

  const [formData, setFormData] = useState({
    clienteId: '',
    servicoId: '',
    profissionalId: '',
    data: '',
    horario: '',
    status: 'pendente',
    notificarCliente: true,
    motivoAlteracao: ''
  });

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState([]);

  const clientesSalao = useMemo(() => getClientesPorSalao(), [clientes, salaoAtual.id]);
  const profissionaisSalao = useMemo(() => getProfissionaisPorSalao(), [profissionais, salaoAtual.id]);
  const servicosSalao = useMemo(() => getServicosPorSalao(), [servicos, salaoAtual.id]);
  const agendamentosSalao = agendamentosSalaoRealtime;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    if (formData.clienteId) {
      const cliente = clientesSalao.find(c => c.id === parseInt(formData.clienteId));
      setClienteSelecionado(cliente);
    } else {
      setClienteSelecionado(null);
    }
  }, [formData.clienteId, clientesSalao]);

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

  const handleOpenModal = (agendamento = null) => {
    if (agendamento) {
      setEditingId(agendamento.id);
      
      setDadosOriginais({
        data: agendamento.data,
        horario: agendamento.horario,
        profissionalId: agendamento.profissionalId,
        profissionalNome: profissionais.find(p => p.id === agendamento.profissionalId)?.nome,
        status: agendamento.status // ✨ ADICIONAR STATUS ORIGINAL
      });
      
      setFormData({
        clienteId: agendamento.clienteId.toString(),
        servicoId: agendamento.servicoId.toString(),
        profissionalId: agendamento.profissionalId.toString(),
        data: agendamento.data,
        horario: agendamento.horario,
        status: agendamento.status,
        notificarCliente: true,
        motivoAlteracao: ''
      });
    } else {
      setEditingId(null);
      setDadosOriginais(null);
      setFormData({
        clienteId: '',
        servicoId: '',
        profissionalId: '',
        data: '',
        horario: '',
        status: 'pendente',
        notificarCliente: true,
        motivoAlteracao: ''
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
    setDadosOriginais(null);
    setFormData({
      clienteId: '',
      servicoId: '',
      profissionalId: '',
      data: '',
      horario: '',
      status: 'pendente',
      notificarCliente: true,
      motivoAlteracao: ''
    });
    setClienteSelecionado(null);
    setServicoSelecionado(null);
    setProfissionaisDisponiveis([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      const agendamentoAntigo = agendamentosAll.find(ag => ag.id === editingId);
      
      // ✨ DETECTAR MUDANÇA DE STATUS PARA CONCLUÍDO
      const foiConcluido = dadosOriginais.status !== 'concluido' && formData.status === 'concluido';
      
      // Verificar se houve alterações significativas de data/hora/profissional
      const houveAlteracao = 
        dadosOriginais.data !== formData.data ||
        dadosOriginais.horario !== formData.horario ||
        dadosOriginais.profissionalId !== parseInt(formData.profissionalId);
      
      const updated = agendamentosAll.map(ag => 
        ag.id === editingId ? { ...agendamentoData, id: editingId } : ag
      );
      
      localStorage.setItem('agendamentos', JSON.stringify(updated));
      setAgendamentos(updated);

      window.dispatchEvent(new StorageEvent('storage', {
        key: 'agendamentos',
        newValue: JSON.stringify(updated),
        url: window.location.href
      }));

      // ✨ LÓGICA DE NOTIFICAÇÕES ATUALIZADA
      if (agendamentoAntigo.status !== 'cancelado' && formData.status === 'cancelado') {
        // CANCELAMENTO
        if (formData.notificarCliente && clienteSelecionado?.email) {
          await notificationService.notifyCancelamento(editingId);
        }
      } else if (foiConcluido) {
        // ✅ ATENDIMENTO CONCLUÍDO - Solicitar avaliação SEMPRE
        const settings = notificationService.getSettings();
        if (settings.avaliacoes && clienteSelecionado?.email) {
          console.log('🎯 Solicitando avaliação para agendamento concluído:', editingId);
          const sucesso = await notificationService.solicitarAvaliacao(editingId);
          if (sucesso) {
            alert('✅ Solicitação de avaliação enviada para o cliente!');
          } else {
            alert('⚠️ Não foi possível enviar solicitação de avaliação. Verifique o email do cliente.');
          }
        } else if (!settings.avaliacoes) {
          console.log('⏭️ Avaliações desabilitadas nas configurações');
        } else if (!clienteSelecionado?.email) {
          console.log('⚠️ Cliente sem email cadastrado');
        }
      } else if (houveAlteracao) {
        // ALTERAÇÃO DE DATA/HORA/PROFISSIONAL
        if (formData.notificarCliente && clienteSelecionado?.email) {
          await notificationService.notifyAlteracaoAgendamento(
            editingId,
            dadosOriginais,
            formData.motivoAlteracao
          );
          alert('✅ Email de alteração enviado para o cliente!');
        }
      } else {
        // OUTRAS ALTERAÇÕES (ex: apenas mudança de status de pendente para confirmado)
        if (formData.notificarCliente && clienteSelecionado?.email) {
          await notificationService.notifyNovoAgendamento(editingId);
        }
      }
    } else {
      // NOVO AGENDAMENTO
      const newAgendamento = {
        ...agendamentoData,
        id: Math.max(...agendamentosAll.map(a => a.id), 0) + 1,
        origemAgendamento: 'sistema'
      };
      
      const updated = [...agendamentosAll, newAgendamento];
      localStorage.setItem('agendamentos', JSON.stringify(updated));
      setAgendamentos(updated);

      window.dispatchEvent(new StorageEvent('storage', {
        key: 'agendamentos',
        newValue: JSON.stringify(updated),
        url: window.location.href
      }));

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
      
      if (agendamento && agendamento.status !== 'cancelado') {
        const cliente = clientes.find(c => c.id === agendamento.clienteId);
        if (cliente?.email) {
          await notificationService.notifyCancelamento(id);
        }
      }
      
      const updated = agendamentosAll.filter(ag => ag.id !== id);
      localStorage.setItem('agendamentos', JSON.stringify(updated));
      setAgendamentos(updated);

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
      <AgendamentoHeader 
        salaoNome={salaoAtual.nome}
        onNovoAgendamento={() => handleOpenModal()}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentDate={currentDate}
        changeMonth={changeMonth}
        monthNames={monthNames}
      />

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

      <AgendamentoFiltros 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFiltro={statusFiltro}
        setStatusFiltro={setStatusFiltro}
      />

      {viewMode === 'lista' && (
        <AgendamentoLista 
          agendamentos={filteredAgendamentos}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      {viewMode === 'calendario' && (
        <AgendamentoCalendario 
          currentDate={currentDate}
          agendamentos={agendamentosSalao}
          clientes={clientes}
          servicos={servicos}
          onAgendamentoClick={handleOpenModal}
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Campo para motivo da alteração */}
          {editingId && dadosOriginais && (
            dadosOriginais.data !== formData.data ||
            dadosOriginais.horario !== formData.horario ||
            dadosOriginais.profissionalId !== parseInt(formData.profissionalId)
          ) && (
            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo da Alteração (opcional)
              </label>
              <textarea
                name="motivoAlteracao"
                value={formData.motivoAlteracao}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: Conflito de horário, solicitação do cliente..."
              />
              <p className="text-xs text-gray-500 mt-1">
                📧 Este motivo será incluído no email de notificação ao cliente
              </p>
            </div>
          )}

          {/* ✨ ALERTA quando marcar como concluído */}
          {editingId && dadosOriginais && dadosOriginais.status !== 'concluido' && formData.status === 'concluido' && (
            <div className="pt-4 border-t border-gray-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-900">
                  ⭐ Ao marcar como concluído, o cliente receberá automaticamente um email solicitando avaliação do atendimento.
                </p>
              </div>
            </div>
          )}
        </form>
      </Modal>

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