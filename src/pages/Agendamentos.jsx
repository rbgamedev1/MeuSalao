import { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, User, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Agendamentos = () => {
  const [viewMode, setViewMode] = useState('lista'); // 'lista' ou 'calendario'
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    }
  ]);

  const statusColors = {
    confirmado: 'bg-green-100 text-green-800',
    pendente: 'bg-yellow-100 text-yellow-800',
    cancelado: 'bg-red-100 text-red-800',
    concluido: 'bg-blue-100 text-blue-800'
  };

  const filteredAgendamentos = agendamentos.filter(ag =>
    ag.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ag.servico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie a agenda do seu salão</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
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

          {/* Data */}
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            defaultValue="2025-11-01"
          />

          {/* Filtro Status */}
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
      <div className="flex space-x-2">
        <button
          onClick={() => setViewMode('lista')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'lista'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Lista
        </button>
        <button
          onClick={() => setViewMode('calendario')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'calendario'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Calendário
        </button>
      </div>

      {/* Lista de Agendamentos */}
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
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
          <p className="text-2xl font-bold text-purple-600 mt-1">R$ 415,00</p>
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;