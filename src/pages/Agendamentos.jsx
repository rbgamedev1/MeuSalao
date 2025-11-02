// src/pages/Agendamentos.jsx
import { useState, useContext, useEffect, useMemo } from 'react';
import { Calendar, Plus, Search, Clock, User, Edit, Trash2, ChevronLeft, ChevronRight, List, CalendarDays } from 'lucide-react';
import Modal from '../components/Modal';
import MaskedInput from '../components/MaskedInput';
import { SalaoContext } from '../contexts/SalaoContext';
import { generateTimeOptions } from '../utils/masks';

const Agendamentos = () => {
  const { 
    salaoAtual,
    clientes, 
    profissionais, 
    servicos,
    agendamentos,
    setAgendamentos,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getAgendamentosPorSalao
  } = useContext(SalaoContext);
  
  const [viewMode, setViewMode] = useState('lista');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    clienteId: '',
    servicoId: '',
    profissionalId: '',
    data: '',
    horario: '',
    status: 'pendente'
  });

  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState([]);

  const timeOptions = generateTimeOptions();

  // Obter dados do salão atual usando useMemo para otimização
  const clientesSalao = useMemo(() => getClientesPorSalao(), [clientes, salaoAtual.id]);
  const profissionaisSalao = useMemo(() => getProfissionaisPorSalao(), [profissionais, salaoAtual.id]);
  const servicosSalao = useMemo(() => getServicosPorSalao(), [servicos, salaoAtual.id]);
  const agendamentosSalao = useMemo(() => getAgendamentosPorSalao(), [agendamentos, salaoAtual.id]);

  const statusColors = {
    confirmado: 'bg-green-100 text-green-800 border-green-300',
    pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    cancelado: 'bg-red-100 text-red-800 border-red-300',
    concluido: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  // Atualizar informações quando cliente é selecionado
  useEffect(() => {
    if (formData.clienteId) {
      const cliente = clientesSalao.find(c => c.id === parseInt(formData.clienteId));
      setClienteSelecionado(cliente);
    } else {
      setClienteSelecionado(null);
    }
  }, [formData.clienteId, clientesSalao]);

  // Atualizar profissionais disponíveis quando serviço é selecionado
  useEffect(() => {
    if (formData.servicoId) {
      const servico = servicosSalao.find(s => s.id === parseInt(formData.servicoId));
      setServicoSelecionado(servico);
      
      if (servico && servico.profissionaisHabilitados) {
        const profsDisponiveis = profissionaisSalao.filter(p => 
          servico.profissionaisHabilitados.includes(p.id)
        );
        setProfissionaisDisponiveis(profsDisponiveis);
        
        // Se o profissional atual não está na lista, limpar seleção
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
      setFormData({
        clienteId: agendamento.clienteId.toString(),
        servicoId: agendamento.servicoId.toString(),
        profissionalId: agendamento.profissionalId.toString(),
        data: agendamento.data,
        horario: agendamento.horario,
        status: agendamento.status
      });
    } else {
      setEditingId(null);
      setFormData({
        clienteId: '',
        servicoId: '',
        profissionalId: '',
        data: '',
        horario: '',
        status: 'pendente'
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
      status: 'pendente'
    });
    setClienteSelecionado(null);
    setServicoSelecionado(null);
    setProfissionaisDisponiveis([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
      setAgendamentos(agendamentos.map(ag => 
        ag.id === editingId ? { ...agendamentoData, id: editingId } : ag
      ));
    } else {
      const newAgendamento = {
        ...agendamentoData,
        id: Math.max(...agendamentos.map(a => a.id), 0) + 1
      };
      setAgendamentos([...agendamentos, newAgendamento]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      setAgendamentos(agendamentos.filter(ag => ag.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Obter informações completas do agendamento - otimizado com useMemo
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
        return ag.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
               ag.servico.nome.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [agendamentosSalao, searchTerm, getAgendamentoCompleto]);

  // Funções do Calendário
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getAgendamentosForDate = (date) => {
    const dateStr = date.toLocaleDateString('pt-BR');
    return agendamentosSalao
      .filter(ag => ag.data === dateStr)
      .map(ag => getAgendamentoCompleto(ag));
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const renderCalendar = () => {
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-32 bg-gray-50 border border-gray-200"></div>
      );
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateAgendamentos = getAgendamentosForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={day}
          className={`min-h-32 border border-gray-200 p-2 ${
            isToday ? 'bg-purple-50 border-purple-300' : 'bg-white'
          } hover:bg-gray-50 transition-colors`}
        >
          <div className={`text-sm font-semibold mb-2 ${
            isToday ? 'text-purple-600' : 'text-gray-700'
          }`}>
            {day}
          </div>
          
          <div className="space-y-1">
            {dateAgendamentos.slice(0, 3).map(ag => (
              <div
                key={ag.id}
                onClick={() => handleOpenModal(ag)}
                className={`text-xs p-1 rounded cursor-pointer border ${statusColors[ag.status]} hover:opacity-80 transition-opacity`}
              >
                <div className="font-medium truncate">{ag.horario} - {ag.cliente?.nome}</div>
                <div className="truncate text-xs opacity-75">{ag.servico?.nome}</div>
              </div>
            ))}
            
            {dateAgendamentos.length > 3 && (
              <div className="text-xs text-gray-600 font-medium">
                +{dateAgendamentos.length - 3} mais
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
  };

  // Estatísticas otimizadas
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie a agenda - {salaoAtual.nome}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por cliente ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <MaskedInput
            mask="date"
            placeholder="DD/MM/AAAA"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">Todos os Status</option>
            <option value="confirmado">Confirmado</option>
            <option value="pendente">Pendente</option>
            <option value="cancelado">Cancelado</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </div>

      {/* Modos de Visualização */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('lista')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'lista'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <List size={18} />
            <span>Lista</span>
          </button>
          <button
            onClick={() => setViewMode('calendario')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'calendario'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <CalendarDays size={18} />
            <span>Calendário</span>
          </button>
        </div>

        {viewMode === 'calendario' && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-gray-800 min-w-40 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Visualização em Lista */}
      {viewMode === 'lista' && (
        filteredAgendamentos.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profissional
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAgendamentos.map((agendamento) => (
                    <tr key={agendamento.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <User size={18} className="text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-800">{agendamento.cliente?.nome}</p>
                            <p className="text-sm text-gray-500">{agendamento.cliente?.telefone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{agendamento.servico?.nome}</p>
                        <p className="text-sm text-gray-500">{formatDuration(agendamento.servico?.duracao || 0)}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {agendamento.profissional?.nome}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-gray-400" />
                          <div>
                            <p className="text-gray-800">{agendamento.data}</p>
                            <p className="text-sm text-gray-500">{agendamento.horario}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        R$ {agendamento.servico?.valor.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[agendamento.status]}`}>
                          {agendamento.status.charAt(0).toUpperCase() + agendamento.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleOpenModal(agendamento)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(agendamento.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum agendamento encontrado para este salão.</p>
            <p className="text-sm mt-2">Clique em "Novo Agendamento" para criar o primeiro agendamento.</p>
          </div>
        )
      )}

      {/* Visualização em Calendário */}
      {viewMode === 'calendario' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {renderCalendar()}
          </div>
        </div>
      )}

      {/* Legenda do Calendário */}
      {viewMode === 'calendario' && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span className="text-sm text-gray-700">Confirmado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
              <span className="text-sm text-gray-700">Pendente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div>
              <span className="text-sm text-gray-700">Concluído</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
              <span className="text-sm text-gray-700">Cancelado</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            {clientesSalao.length > 0 ? (
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um cliente</option>
                {clientesSalao.filter(c => c.status === 'ativo').map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome} - {cliente.telefone}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Nenhum cliente cadastrado neste salão. Cadastre clientes primeiro.
                </p>
              </div>
            )}
          </div>

          {/* Informações do Cliente Selecionado */}
          {clienteSelecionado && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-2">Informações do Cliente:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
                <div>
                  <span className="font-medium">Telefone:</span> {clienteSelecionado.telefone}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {clienteSelecionado.email}
                </div>
                <div>
                  <span className="font-medium">Última Visita:</span> {clienteSelecionado.ultimaVisita}
                </div>
                <div>
                  <span className="font-medium">Total de Visitas:</span> {clienteSelecionado.visitas}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serviço *
            </label>
            {servicosSalao.length > 0 ? (
              <select
                name="servicoId"
                value={formData.servicoId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um serviço</option>
                {servicosSalao.filter(s => s.ativo).map(servico => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome} - R$ {servico.valor.toFixed(2)} ({formatDuration(servico.duracao)})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Nenhum serviço cadastrado neste salão. Cadastre serviços primeiro.
                </p>
              </div>
            )}
          </div>

          {/* Informações do Serviço Selecionado */}
          {servicoSelecionado && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-900 mb-2">Detalhes do Serviço:</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                <div>
                  <span className="font-medium">Categoria:</span> {servicoSelecionado.categoria}
                </div>
                <div>
                  <span className="font-medium">Duração:</span> {formatDuration(servicoSelecionado.duracao)}
                </div>
                <div>
                  <span className="font-medium">Valor:</span> R$ {servicoSelecionado.valor.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Comissão:</span> {servicoSelecionado.comissao}%
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profissional *
            </label>
            <select
              name="profissionalId"
              value={formData.profissionalId}
              onChange={handleChange}
              required
              disabled={!formData.servicoId || profissionaisDisponiveis.length === 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.servicoId 
                  ? 'Selecione um serviço primeiro'
                  : profissionaisDisponiveis.length === 0
                  ? 'Nenhum profissional habilitado'
                  : 'Selecione um profissional'}
              </option>
              {profissionaisDisponiveis.map(prof => (
                <option key={prof.id} value={prof.id}>
                  {prof.nome}
                </option>
              ))}
            </select>
            {formData.servicoId && profissionaisDisponiveis.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Nenhum profissional habilitado para este serviço
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <MaskedInput
                mask="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                placeholder="DD/MM/AAAA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário *
              </label>
              <select
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um horário</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={clientesSalao.length === 0 || servicosSalao.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? 'Salvar Alterações' : 'Criar Agendamento'}
            </button>
          </div>
        </form>
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