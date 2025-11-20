// src/pages/ClienteDetalhesPage.jsx - NOVA PÁGINA COMPLETA
import { useState, useMemo, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Calendar, Clock, Package, TrendingUp, CheckCircle, XCircle, AlertCircle, Send, MessageSquare, ShoppingCart, Scissors, FileText, Camera, Upload } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import ProntuarioTab from '../components/clientes/ProntuarioTab';

const ClienteDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const { 
    clientes, 
    updateCliente,
    agendamentos, 
    transacoes, 
    servicos, 
    profissionais, 
    historicoEmails,
    salaoAtual, 
    prontuarios, 
    setProntuarios, 
    getProdutosPorSalao 
  } = useContext(SalaoContext);
  
  const produtos = getProdutosPorSalao();
  
  const [abaAtiva, setAbaAtiva] = useState('info');

  // Encontrar cliente
  const cliente = clientes.find(c => c.id === parseInt(id));

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Cliente não encontrado</p>
          <button
            onClick={() => navigate('/clientes')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar para Clientes
          </button>
        </div>
      </div>
    );
  }

  // Funções de manipulação de prontuários
  const handleAddProntuario = (dadosProntuario) => {
    const novoProntuario = {
      ...dadosProntuario,
      id: Math.max(...prontuarios.map(p => p.id), 0) + 1,
      salaoId: salaoAtual.id
    };
    setProntuarios([...prontuarios, novoProntuario]);
  };

  const handleEditProntuario = (id, dadosAtualizados) => {
    setProntuarios(prontuarios.map(p => 
      p.id === id ? { ...p, ...dadosAtualizados } : p
    ));
  };

  const handleDeleteProntuario = (id) => {
    setProntuarios(prontuarios.filter(p => p.id !== id));
  };

  // Upload de foto do cliente
  const handleFotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande! Máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        updateCliente(cliente.id, { foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverFoto = () => {
    if (confirm('Deseja remover a foto do cliente?')) {
      updateCliente(cliente.id, { foto: null });
    }
  };

  // Filtrar agendamentos do cliente
  const agendamentosCliente = useMemo(() => {
    return agendamentos
      .filter(ag => ag.clienteId === cliente.id)
      .map(ag => ({
        ...ag,
        servico: servicos.find(s => s.id === ag.servicoId),
        profissional: profissionais.find(p => p.id === ag.profissionalId)
      }))
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      });
  }, [agendamentos, cliente.id, servicos, profissionais]);

  // Filtrar vendas do caixa
  const comprasCliente = useMemo(() => {
    return transacoes
      .filter(t => 
        t.tipo === 'receita' && 
        (t.cliente === cliente.nome || t.clienteId === cliente.id) &&
        (t.categoria === 'Venda de Produtos' || 
         t.categoria === 'Serviços' ||
         t.descricao?.includes('Venda Caixa'))
      )
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      });
  }, [transacoes, cliente.nome, cliente.id]);

  // Filtrar emails do cliente
  const emailsCliente = useMemo(() => {
    if (!historicoEmails || historicoEmails.length === 0) return [];
    
    return historicoEmails
      .filter(email => 
        email.clienteNome === cliente.nome || 
        email.clienteEmail === cliente.email ||
        email.clienteId === cliente.id
      )
      .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));
  }, [historicoEmails, cliente]);

  // Estatísticas do cliente
  const stats = useMemo(() => {
    const totalAgendamentos = agendamentosCliente.length;
    const agendamentosConcluidos = agendamentosCliente.filter(ag => ag.status === 'concluido').length;
    const agendamentosCancelados = agendamentosCliente.filter(ag => ag.status === 'cancelado').length;
    const totalGastoAgendamentos = agendamentosCliente
      .filter(ag => ag.status === 'concluido')
      .reduce((acc, ag) => acc + (ag.servico?.valor || 0), 0);
    const totalGastoCompras = comprasCliente.reduce((acc, c) => acc + c.valor, 0);
    const totalGeral = totalGastoAgendamentos + totalGastoCompras;
    const ticketMedio = agendamentosConcluidos > 0 ? totalGeral / agendamentosConcluidos : 0;

    return {
      totalAgendamentos,
      agendamentosConcluidos,
      agendamentosCancelados,
      totalGastoAgendamentos,
      totalGastoCompras,
      totalGeral,
      ticketMedio
    };
  }, [agendamentosCliente, comprasCliente]);

  const getStatusIcon = (status) => {
    const icons = {
      confirmado: <CheckCircle size={16} className="text-green-600" />,
      concluido: <CheckCircle size={16} className="text-blue-600" />,
      cancelado: <XCircle size={16} className="text-red-600" />,
      pendente: <AlertCircle size={16} className="text-yellow-600" />
    };
    return icons[status] || <Clock size={16} className="text-gray-600" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmado: 'bg-green-100 text-green-800 border-green-300',
      concluido: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300',
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getEmailIcon = (tipo) => {
    const icons = {
      confirmacao: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Confirmação' },
      cancelamento: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelamento' },
      alteracao: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Alteração' },
      avaliacao: { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Avaliação' },
      aniversario: { icon: Calendar, color: 'text-pink-600', bg: 'bg-pink-100', label: 'Aniversário' }
    };
    return icons[tipo] || { icon: Send, color: 'text-gray-600', bg: 'bg-gray-100', label: tipo };
  };

  const getEmailStatusBadge = (status) => {
    const badges = {
      enviado: 'bg-green-100 text-green-700',
      falhado: 'bg-red-100 text-red-700',
      pendente: 'bg-yellow-100 text-yellow-700',
      entregue: 'bg-blue-100 text-blue-700'
    };
    const colorClass = badges[status] || 'bg-gray-100 text-gray-700';
    return <span className={`px-2 py-1 ${colorClass} text-xs rounded-full font-medium`}>{status}</span>;
  };

  const getVendaIcon = (categoria, descricao) => {
    if (categoria === 'Serviços' || descricao?.includes('Serviços')) {
      return { icon: Scissors, color: 'text-purple-500', label: 'Serviços' };
    }
    if (categoria === 'Venda de Produtos' || descricao?.includes('Venda Caixa')) {
      return { icon: Package, color: 'text-pink-500', label: 'Produtos' };
    }
    return { icon: ShoppingCart, color: 'text-blue-500', label: 'Venda' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/clientes')}
            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Voltar para Clientes</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Foto do Cliente */}
              <div className="relative group">
                {cliente.foto ? (
                  <img
                    src={cliente.foto}
                    alt={cliente.nome}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-purple-600 font-bold text-3xl border-4 border-white shadow-lg">
                    {cliente.nome.charAt(0)}
                  </div>
                )}
                
                {/* Botões de edição da foto */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Alterar foto"
                    >
                      <Camera size={16} className="text-gray-700" />
                    </button>
                    {cliente.foto && (
                      <button
                        onClick={handleRemoverFoto}
                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                        title="Remover foto"
                      >
                        <XCircle size={16} className="text-white" />
                      </button>
                    )}
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFotoUpload}
                  className="hidden"
                />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-white">{cliente.nome}</h1>
                <p className="text-purple-100 text-sm mt-1">Histórico Completo do Cliente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <p className="text-xs text-purple-600 font-medium">Total de Agendamentos</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">{stats.totalAgendamentos}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-xs text-green-600 font-medium">Agendamentos Concluídos</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{stats.agendamentosConcluidos}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Total Gasto</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">R$ {stats.totalGeral.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
              <p className="text-xs text-pink-600 font-medium">Ticket Médio</p>
              <p className="text-3xl font-bold text-pink-700 mt-1">R$ {stats.ticketMedio.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'info', icon: User, label: 'Informações' },
              { id: 'agendamentos', icon: Calendar, label: `Agendamentos (${agendamentosCliente.length})` },
              { id: 'caixa', icon: ShoppingCart, label: `Caixa (${comprasCliente.length})` },
              { id: 'prontuario', icon: FileText, label: `Prontuário (${prontuarios.filter(p => p.clienteId === cliente.id).length})` },
              { id: 'emails', icon: Send, label: `Emails (${emailsCliente.length})` }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAbaAtiva(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    abaAtiva === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Aba Informações */}
        {abaAtiva === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2 text-purple-600" size={20} />
                  Dados Pessoais
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-sm font-medium text-gray-800">{cliente.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-800">{cliente.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Data de Nascimento</p>
                      <p className="text-sm font-medium text-gray-800">{cliente.dataNascimento}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        cliente.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {cliente.ultimaVisita && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Clock className="text-blue-600" size={32} />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Última Visita</p>
                      <p className="text-2xl font-bold text-blue-700">{cliente.ultimaVisita}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aba Agendamentos */}
        {abaAtiva === 'agendamentos' && (
          <div className="space-y-4">
            {agendamentosCliente.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Nenhum agendamento encontrado para este cliente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {agendamentosCliente.map((ag) => (
                  <div key={ag.id} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(ag.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ag.status)}`}>
                            {ag.status.charAt(0).toUpperCase() + ag.status.slice(1)}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-800 mb-2">{ag.servico?.nome || 'Serviço não encontrado'}</h5>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{ag.data} às {ag.horario}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User size={14} className="text-gray-400" />
                            <span>{ag.profissional?.nome || 'Profissional'}</span>
                          </div>
                          {ag.servico?.duracao && (
                            <div className="flex items-center space-x-2">
                              <Clock size={14} className="text-gray-400" />
                              <span>{ag.servico.duracao} min</span>
                            </div>
                          )}
                          {ag.servico?.valor && (
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-green-600">R$ {ag.servico.valor.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba Caixa (Vendas + Estatísticas) */}
        {abaAtiva === 'caixa' && (
          <div className="space-y-6">
            {/* Estatísticas Financeiras */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="mr-2 text-green-600" size={20} />
                Estatísticas Financeiras
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total em Agendamentos</span>
                  <span className="text-lg font-bold text-green-600">R$ {stats.totalGastoAgendamentos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total em Vendas Caixa</span>
                  <span className="text-lg font-bold text-blue-600">R$ {stats.totalGastoCompras.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Agendamentos Cancelados</span>
                  <span className="text-lg font-bold text-red-600">{stats.agendamentosCancelados}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold text-gray-800">Total Geral</span>
                  <span className="text-2xl font-bold text-purple-600">R$ {stats.totalGeral.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Lista de Vendas */}
            {comprasCliente.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Nenhuma venda do Caixa encontrada para este cliente.</p>
                <p className="text-xs text-gray-400 mt-2">
                  💡 Vendas realizadas no módulo Caixa aparecem aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {comprasCliente.map((compra) => {
                  const vendaInfo = getVendaIcon(compra.categoria, compra.descricao);
                  const IconComponent = vendaInfo.icon;
                  
                  return (
                    <div key={index} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${emailInfo.bg} flex-shrink-0`}>
                          <IconComponent className={emailInfo.color} size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-800">{emailInfo.label}</span>
                              {getEmailStatusBadge(email.status || 'enviado')}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(email.dataEnvio).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            📧 {email.assunto}
                          </p>
                          {email.agendamentoId && (
                            <p className="text-xs text-gray-500">
                              🔗 Relacionado ao agendamento #{email.agendamentoId}
                            </p>
                          )}
                          {email.erro && (
                            <p className="text-xs text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-200">
                              ⚠️ Erro: {email.erro}
                            </p>
                          )}
                        </div>
                      </div>
                    </div key={compra.id} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <IconComponent size={16} className={vendaInfo.color} />
                            <h5 className="font-semibold text-gray-800">{compra.descricao}</h5>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar size={14} className="text-gray-400" />
                              <span>{compra.data}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                compra.categoria === 'Serviços' 
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-pink-100 text-pink-700'
                              }`}>
                                {vendaInfo.label}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">{compra.formaPagamento}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                {compra.status === 'recebido' ? 'Pago' : compra.status}
                              </span>
                            </div>
                          </div>
                          {compra.observacoes && (
                            <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-300 pt-2">
                              📦 Itens: {compra.observacoes}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-green-600">R$ {compra.valor.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Aba Prontuário */}
        {abaAtiva === 'prontuario' && (
          <ProntuarioTab
            clienteId={cliente.id}
            prontuarios={prontuarios}
            produtos={produtos}
            onAddProntuario={handleAddProntuario}
            onEditProntuario={handleEditProntuario}
            onDeleteProntuario={handleDeleteProntuario}
          />
        )}

        {/* Aba Emails */}
        {abaAtiva === 'emails' && (
          <div className="space-y-4">
            {emailsCliente.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <Send size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Nenhum email enviado para este cliente ainda.</p>
                <p className="text-xs text-gray-400 mt-2">
                  📧 Os emails serão registrados automaticamente quando enviados
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {emailsCliente.map((email, index) => {
                  const emailInfo = getEmailIcon(email.tipo);
                  const IconComponent = emailInfo.icon;
                  
                  return (
                    <div