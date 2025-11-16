// src/pages/Clientes.jsx - COM HISTÓRICO DE EMAILS

import { useState, useContext, useMemo } from 'react';
import { Plus, Search, User, Phone, Mail, Calendar, DollarSign, Edit, Trash2, Eye, Crown, Lock } from 'lucide-react';
import Modal from '../components/Modal';
import MaskedInput from '../components/MaskedInput';
import ClienteDetalhes from '../components/clientes/ClienteDetalhes';
import { SalaoContext } from '../contexts/SalaoContext';
import { isValidDate } from '../utils/masks';
import { canAddMore, getLimitMessage } from '../utils/planRestrictions';
import { useEmailHistorico } from '../hooks/useEmailHistorico'; // ✅ NOVO

const Clientes = () => {
  const { 
    salaoAtual, 
    clientes, 
    setClientes, 
    getClientesPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao,
    servicos,
    profissionais
  } = useContext(SalaoContext);
  
  // ✅ NOVO: Hook de histórico de emails
  const { buscarTodosEmails } = useEmailHistorico();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    dataNascimento: '',
    status: 'ativo'
  });

  const [errors, setErrors] = useState({});

  const clientesSalao = getClientesPorSalao();
  const agendamentosSalao = getAgendamentosPorSalao();
  const transacoesSalao = getTransacoesPorSalao();

  // ✅ NOVO: Buscar histórico de emails
  const historicoEmails = useMemo(() => {
    return buscarTodosEmails();
  }, []);

  const canAddCliente = canAddMore(salaoAtual.plano, 'clientes', clientesSalao.length);
  const limiteMessage = getLimitMessage(salaoAtual.plano, 'clientes');

  const handleOpenModal = (cliente = null) => {
    if (!cliente && !canAddCliente) {
      alert(`Limite de clientes atingido para o plano ${salaoAtual.plano}. ${limiteMessage}\n\nFaça upgrade do seu plano para adicionar mais clientes.`);
      return;
    }

    if (cliente) {
      setEditingId(cliente.id);
      setFormData({
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
        dataNascimento: cliente.dataNascimento,
        status: cliente.status
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        dataNascimento: '',
        status: 'ativo'
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      dataNascimento: '',
      status: 'ativo'
    });
    setErrors({});
  };

  const handleViewCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setShowDetalhesModal(true);
  };

  const handleCloseDetalhes = () => {
    setShowDetalhesModal(false);
    setClienteSelecionado(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.telefone || formData.telefone.length < 15) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.dataNascimento || !isValidDate(formData.dataNascimento)) {
      newErrors.dataNascimento = 'Data inválida (DD/MM/AAAA)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editingId) {
      setClientes(clientes.map(c => 
        c.id === editingId 
          ? { 
              ...c, 
              ...formData
            } 
          : c
      ));
    } else {
      const newCliente = {
        ...formData,
        id: Math.max(...clientes.map(c => c.id), 0) + 1,
        ultimaVisita: new Date().toLocaleDateString('pt-BR'),
        totalGasto: 0,
        visitas: 0,
        salaoId: salaoAtual.id
      };
      setClientes([...clientes, newCliente]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClientes(clientes.filter(c => c.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const filteredClientes = clientesSalao.filter(cliente =>
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
          <p className="text-gray-600 mt-1">Gerencie seus clientes - {salaoAtual.nome}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={!canAddCliente}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all shadow-lg ${
            canAddCliente
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canAddCliente ? <Plus size={20} /> : <Lock size={20} />}
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Alerta de Limite */}
      {!canAddCliente && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <Crown className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Limite de clientes atingido!</p>
              <p className="text-yellow-700 text-sm mt-1">
                Seu plano <strong>{salaoAtual.plano}</strong> permite até <strong>{limiteMessage.replace('Máximo: ', '')}</strong>. 
                Faça upgrade para adicionar mais clientes.
              </p>
              <button 
                onClick={() => window.location.href = '/configuracoes'}
                className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
              >
                Ver Planos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info do Plano */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Clientes: {clientesSalao.length} {limiteMessage !== 'Ilimitado' ? `/ ${limiteMessage.replace('Máximo: ', '')}` : '(Ilimitado)'}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Plano {salaoAtual.plano} • 👁️ Clique no ícone do olho para ver o histórico completo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{clientesSalao.length}</p>
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
                {clientesSalao.filter(c => c.status === 'ativo').length}
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
              <p className="text-3xl font-bold text-purple-600 mt-1">
                {clientesSalao.filter(c => {
                  const hoje = new Date();
                  const mesAtual = hoje.getMonth();
                  const anoAtual = hoje.getFullYear();
                  return true;
                }).length}
              </p>
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
              <p className="text-3xl font-bold text-pink-600 mt-1">
                R$ {clientesSalao.length > 0 
                  ? (clientesSalao.reduce((sum, c) => sum + c.totalGasto, 0) / clientesSalao.length).toFixed(2)
                  : '0.00'}
              </p>
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
        {filteredClientes.length > 0 ? (
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
                      R$ {cliente.totalGasto.toFixed(2)}
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
                        <button 
                          onClick={() => handleViewCliente(cliente)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Ver Histórico Completo"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(cliente)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cliente.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
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
        ) : (
          <div className="text-center py-12 text-gray-500">
            <User size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum cliente encontrado para este salão.</p>
            <p className="text-sm mt-2">Clique em "Novo Cliente" para adicionar o primeiro cliente.</p>
          </div>
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Cliente' : 'Novo Cliente'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite o nome completo"
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <MaskedInput
                mask="phone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 98765-4321"
              />
              {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento *
              </label>
              <MaskedInput
                mask="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                placeholder="DD/MM/AAAA"
              />
              {errors.dataNascimento && <p className="text-red-500 text-xs mt-1">{errors.dataNascimento}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="email@exemplo.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
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
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ✅ NOVO: Modal de Detalhes COM histórico de emails */}
      {showDetalhesModal && clienteSelecionado && (
        <ClienteDetalhes
          cliente={clienteSelecionado}
          onClose={handleCloseDetalhes}
          agendamentos={agendamentosSalao}
          transacoes={transacoesSalao}
          servicos={servicos}
          profissionais={profissionais}
          historicoEmails={historicoEmails}
        />
      )}
    </div>
  );
};

export default Clientes;