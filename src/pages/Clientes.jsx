import { useState } from 'react';
import { Plus, Search, User, Phone, Mail, Calendar, DollarSign, Edit, Trash2, Eye } from 'lucide-react';

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [clientes] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      telefone: '(11) 98765-4321',
      email: 'maria.silva@email.com',
      dataNascimento: '15/03/1985',
      ultimaVisita: '25/10/2025',
      totalGasto: 'R$ 2.450,00',
      visitas: 18,
      status: 'ativo'
    },
    {
      id: 2,
      nome: 'João Santos',
      telefone: '(11) 91234-5678',
      email: 'joao.santos@email.com',
      dataNascimento: '22/07/1990',
      ultimaVisita: '28/10/2025',
      totalGasto: 'R$ 890,00',
      visitas: 8,
      status: 'ativo'
    },
    {
      id: 3,
      nome: 'Paula Souza',
      telefone: '(11) 99876-5432',
      email: 'paula.souza@email.com',
      dataNascimento: '10/11/1988',
      ultimaVisita: '30/10/2025',
      totalGasto: 'R$ 3.120,00',
      visitas: 24,
      status: 'ativo'
    },
    {
      id: 4,
      nome: 'Roberto Alves',
      telefone: '(11) 97654-3210',
      email: 'roberto.alves@email.com',
      dataNascimento: '05/05/1995',
      ultimaVisita: '15/09/2025',
      totalGasto: 'R$ 450,00',
      visitas: 5,
      status: 'inativo'
    }
  ]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600 mt-1">Gerencie seus clientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{clientes.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Ativos</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {clientes.filter(c => c.status === 'ativo').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <User className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Novos Este Mês</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">12</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Plus className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-3xl font-bold text-pink-600 mt-1">R$ 145</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <DollarSign className="text-pink-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Visita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Gasto
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
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {cliente.nome.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{cliente.nome}</p>
                        <p className="text-sm text-gray-500">{cliente.dataNascimento}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Phone size={14} className="text-gray-400" />
                        <span>{cliente.telefone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Mail size={14} className="text-gray-400" />
                        <span>{cliente.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-700">{cliente.ultimaVisita}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-purple-600">{cliente.visitas}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {cliente.totalGasto}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cliente.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
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
    </div>
  );
};

export default Clientes;