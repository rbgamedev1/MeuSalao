import { useState } from 'react';
import { Calendar, Plus, Search, Clock, User, Edit, Trash2, ChevronLeft, ChevronRight, List, CalendarDays } from 'lucide-react';
import Modal from '../components/Modal';

const Agendamentos = () => {
  const [viewMode, setViewMode] = useState('lista');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    cliente: '',
    telefone: '',
    servico: '',
    profissional: '',
    data: '',
    horario: '',
    duracao: '',
    valor: '',
    status: 'pendente'
  });

  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      cliente: 'Maria Silva',
      telefone: '(11) 98765-4321',
      servico: 'Corte + Escova',
      profissional: 'Ana Costa',
      data: '2025-11-01',
      horario: '14:00',
      duracao: '1h',
      valor: 'R$ 120,00',
      status: 'confirmado'
    },
    {
      id: 2,
      cliente: 'João Santos',
      telefone: '(11) 91234-5678',
      servico: 'Barba',
      profissional: 'Carlos Lima',
      data: '2025-11-01',
      horario: '14:30',
      duracao: '30min',
      valor: 'R$ 45,00',
      status: 'pendente'
    },
    {
      id: 3,
      cliente: 'Paula Souza',
      telefone: '(11) 99876-5432',
      servico: 'Coloração',
      profissional: 'Ana Costa',
      data: '2025-11-01',
      horario: '15:00',
      duracao: '2h',
      valor: 'R$ 250,00',
      status: 'confirmado'
    },
    {
      id: 4,
      cliente: 'Roberto Alves',
      telefone: '(11) 97654-3210',
      servico: 'Corte',
      profissional: 'Carlos Lima',
      data: '2025-11-05',
      horario: '10:00',
      duracao: '30min',
      valor: 'R$ 45,00',
      status: 'confirmado'
    },
    {
      id: 5,
      cliente: 'Fernanda Costa',
      telefone: '(11) 99123-4567',
      servico: 'Hidratação',
      profissional: 'Ana Costa',
      data: '2025-11-08',
      horario: '16:00',
      duracao: '1h',
      valor: 'R$ 90,00',
      status: 'pendente'
    },
    {
      id: 6,
      cliente: 'Carlos Mendes',
      telefone: '(11) 98234-5678',
      servico: 'Manicure',
      profissional: 'Beatriz Silva',
      data: '2025-11-12',
      horario: '11:00',
      duracao: '45min',
      valor: 'R$ 35,00',
      status: 'confirmado'
    }
  ]);

  const statusColors = {
    confirmado: 'bg-green-100 text-green-800 border-green-300',
    pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    cancelado: 'bg-red-100 text-red-800 border-red-300',
    concluido: 'bg-blue-100 text-blue-800 border-blue-300'
  };

  const handleOpenModal = (agendamento = null) => {
    if (agendamento) {
      setEditingId(agendamento.id);
      setFormData({
        cliente: agendamento.cliente,
        telefone: agendamento.telefone,
        servico: agendamento.servico,
        profissional: agendamento.profissional,
        data: agendamento.data,
        horario: agendamento.horario,
        duracao: agendamento.duracao,
        valor: agendamento.valor,
        status: agendamento.status
      });
    } else {
      setEditingId(null);
      setFormData({
        cliente: '',
        telefone: '',
        servico: '',
        profissional: '',
        data: '',
        horario: '',
        duracao: '',
        valor: '',
        status: 'pendente'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      cliente: '',
      telefone: '',
      servico: '',
      profissional: '',
      data: '',
      horario: '',
      duracao: '',
      valor: '',
      status: 'pendente'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setAgendamentos(agendamentos.map(ag => 
        ag.id === editingId ? { ...formData, id: editingId } : ag
      ));
    } else {
      const newAgendamento = {
        ...formData,
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

  const filteredAgendamentos = agendamentos.filter(ag =>
    ag.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.servico.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const dateStr = date.toISOString().split('T')[0];
    return agendamentos.filter(ag => ag.data === dateStr);
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
    
    // Dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-32 bg-gray-50 border border-gray-200"></div>
      );
    }
    
    // Dias do mês
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
                <div className="font-medium truncate">{ag.horario} - {ag.cliente}</div>
                <div className="truncate text-xs opacity-75">{ag.servico}</div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie a agenda do seu salão</p>
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

          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            defaultValue="2025-11-01"
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
                          <p className="font-medium text-gray-800">{agendamento.cliente}</p>
                          <p className="text-sm text-gray-500">{agendamento.telefone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{agendamento.servico}</p>
                      <p className="text-sm text-gray-500">{agendamento.duracao}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {agendamento.profissional}
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
                      {agendamento.valor}
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
      )}

      {/* Visualização em Calendário */}
      {viewMode === 'calendario' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header do Calendário */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grid do Calendário */}
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

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total de Agendamentos</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{agendamentos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Confirmados</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {agendamentos.filter(a => a.status === 'confirmado').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {agendamentos.filter(a => a.status === 'pendente').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Faturamento Previsto</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">R$ 585,00</p>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nome do cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="(11) 98765-4321"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serviço *
              </label>
              <select
                name="servico"
                value={formData.servico}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um serviço</option>
                <option value="Corte">Corte</option>
                <option value="Corte + Escova">Corte + Escova</option>
                <option value="Coloração">Coloração</option>
                <option value="Escova">Escova</option>
                <option value="Hidratação">Hidratação</option>
                <option value="Manicure">Manicure</option>
                <option value="Pedicure">Pedicure</option>
                <option value="Barba">Barba</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profissional *
              </label>
              <select
                name="profissional"
                value={formData.profissional}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione um profissional</option>
                <option value="Ana Costa">Ana Costa</option>
                <option value="Carlos Lima">Carlos Lima</option>
                <option value="Beatriz Silva">Beatriz Silva</option>
                <option value="Diego Santos">Diego Santos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário *
              </label>
              <input
                type="time"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração *
              </label>
              <input
                type="text"
                name="duracao"
                value={formData.duracao}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: 1h, 30min"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor *
              </label>
              <input
                type="text"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="R$ 0,00"
              />
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
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {editingId ? 'Salvar Alterações' : 'Criar Agendamento'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Agendamentos;