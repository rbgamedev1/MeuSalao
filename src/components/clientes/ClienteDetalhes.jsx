// src/components/clientes/ClienteDetalhes.jsx - COMPLETO COM HISTÓRICO DE EMAILS
import { useState, useMemo } from 'react';
import { X, User, Phone, Mail, Calendar, DollarSign, Clock, Package, TrendingUp, CheckCircle, XCircle, AlertCircle, Send, MessageSquare } from 'lucide-react';

const ClienteDetalhes = ({ 
  cliente, 
  onClose, 
  agendamentos = [],
  transacoes = [],
  servicos = [],
  profissionais = [],
  historicoEmails = [] // ✅ NOVO: receber histórico de emails
}) => {
  const [abaAtiva, setAbaAtiva] = useState('info');

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

  // Filtrar compras do cliente
  const comprasCliente = useMemo(() => {
    return transacoes
      .filter(t => 
        t.tipo === 'receita' && 
        t.cliente === cliente.nome && 
        t.categoria === 'Venda de Produtos'
      )
      .sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('/');
        const [diaB, mesB, anoB] = b.data.split('/');
        const dataA = new Date(anoA, mesA - 1, diaA);
        const dataB = new Date(anoB, mesB - 1, diaB);
        return dataB - dataA;
      });
  }, [transacoes, cliente.nome]);

  // ✅ NOVO: Filtrar emails do cliente
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

  // ✅ NOVO: Função para obter ícone do tipo de email
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

  // ✅ NOVO: Função para formatar status do email
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-6xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-purple-600 font-bold text-2xl">
                  {cliente.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{cliente.nome}</h3>
                  <p className="text-purple-100 text-sm mt-1">Histórico Completo do Cliente</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600">Total de Agendamentos</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalAgendamentos}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600">Agendamentos Concluídos</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.agendamentosConcluidos}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600">Total Gasto</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">R$ {stats.totalGeral.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-pink-600 mt-1">R$ {stats.ticketMedio.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'info', icon: User, label: 'Informações' },
                { id: 'agendamentos', icon: Calendar, label: `Agendamentos (${agendamentosCliente.length})` },
                { id: 'compras', icon: Package, label: `Compras (${comprasCliente.length})` },
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

          {/* Content com scroll interno */}
          <div className="bg-white px-6 py-6 max-h-[55vh] overflow-y-auto">
            {/* Aba Informações */}
            {abaAtiva === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
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

                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="mr-2 text-green-600" size={20} />
                      Estatísticas Financeiras
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Total em Agendamentos</span>
                        <span className="text-sm font-bold text-green-600">R$ {stats.totalGastoAgendamentos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Total em Compras</span>
                        <span className="text-sm font-bold text-blue-600">R$ {stats.totalGastoCompras.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Agendamentos Cancelados</span>
                        <span className="text-sm font-bold text-red-600">{stats.agendamentosCancelados}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-semibold text-gray-800">Total Geral</span>
                        <span className="text-lg font-bold text-purple-600">R$ {stats.totalGeral.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {cliente.ultimaVisita && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="text-blue-600" size={24} />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Última Visita</p>
                        <p className="text-lg font-bold text-blue-700">{cliente.ultimaVisita}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Aba Agendamentos */}
            {abaAtiva === 'agendamentos' && (
              <div className="space-y-4">
                {agendamentosCliente.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nenhum agendamento encontrado para este cliente.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Total: {agendamentosCliente.length} agendamento(s)</p>
                      <p className="text-xs text-gray-500">Rolagem disponível ↓</p>
                    </div>
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                      {agendamentosCliente.map((ag) => (
                        <div key={ag.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getStatusIcon(ag.status)}
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ag.status)}`}>
                                  {ag.status.charAt(0).toUpperCase() + ag.status.slice(1)}
                                </span>
                              </div>
                              <h5 className="font-semibold text-gray-800 mb-1">{ag.servico?.nome || 'Serviço não encontrado'}</h5>
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
                                    <DollarSign size={14} className="text-gray-400" />
                                    <span className="font-semibold text-green-600">R$ {ag.servico.valor.toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Aba Compras */}
            {abaAtiva === 'compras' && (
              <div className="space-y-4">
                {comprasCliente.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nenhuma compra de produto encontrada para este cliente.</p>
                    <p className="text-xs text-gray-400 mt-2">
                      💡 Apenas vendas de produtos do PDV aparecem aqui.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Total: {comprasCliente.length} compra(s) de produto(s)</p>
                      <p className="text-xs text-gray-500">Rolagem disponível ↓</p>
                    </div>
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                      {comprasCliente.map((compra) => (
                        <div key={compra.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-2">{compra.descricao}</h5>
                              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <Calendar size={14} className="text-gray-400" />
                                  <span>{compra.data}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Package size={14} className="text-gray-400" />
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">{compra.categoria}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign size={14} className="text-gray-400" />
                                  <span>{compra.formaPagamento}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CheckCircle size={14} className="text-green-600" />
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
                              <p className="text-xl font-bold text-green-600">R$ {compra.valor.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ✅ NOVA ABA: Histórico de Emails */}
            {abaAtiva === 'emails' && (
              <div className="space-y-4">
                {emailsCliente.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Send size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nenhum email enviado para este cliente ainda.</p>
                    <p className="text-xs text-gray-400 mt-2">
                      📧 Os emails serão registrados automaticamente quando enviados
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Total: {emailsCliente.length} email(s) enviado(s)</p>
                      <p className="text-xs text-gray-500">Rolagem disponível ↓</p>
                    </div>
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                      {emailsCliente.map((email, index) => {
                        const emailInfo = getEmailIcon(email.tipo);
                        const IconComponent = emailInfo.icon;
                        
                        return (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${emailInfo.bg} flex-shrink-0`}>
                                <IconComponent className={emailInfo.color} size={20} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
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
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {emailsCliente.length > 0 && (
                  <p>✅ Histórico de comunicações disponível</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDetalhes;