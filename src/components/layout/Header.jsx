// src/components/layout/Header.jsx - CORRIGIDO: Safe rendering

import { useState, useContext, useEffect, useMemo } from 'react';
import { Bell, ChevronDown, Plus, LogOut, User, Calendar, Clock, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SalaoContext } from "../../contexts/SalaoContext";
import { AuthContext } from "../../contexts/AuthContext";
import { useRealtimeAgendamentos } from '../../hooks/useRealtimeAgendamentos';
import Modal from '../Modal';
import MaskedInput from '../MaskedInput';

const Header = () => {
  const navigate = useNavigate();
  const { 
    salaoAtual, 
    saloes, 
    setSalaoAtual, 
    adicionarSalao, 
    clientes, 
    servicos, 
    profissionais 
  } = useContext(SalaoContext);
  const { currentUser, logout } = useContext(AuthContext);
  
  const [showSaloes, setShowSaloes] = useState(false);
  const [showNovoSalaoModal, setShowNovoSalaoModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoesLidas, setNotificacoesLidas] = useState(() => {
    const saved = localStorage.getItem('notificacoesLidas');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    plano: 'inicial'
  });

  // Hook de tempo real
  const { 
    agendamentos: agendamentosRealtime, 
    isUpdating, 
    lastUpdate,
    forceRefresh 
  } = useRealtimeAgendamentos(salaoAtual?.id, 2000);

  // ✅ CORREÇÃO CRÍTICA: Safe filtering com verificação de dados
  const agendamentosOnline = useMemo(() => {
    if (!salaoAtual) return [];
    
    try {
      return agendamentosRealtime
        .filter(ag => {
          // Verificação segura
          if (!ag || !ag.salaoId || !ag.id) return false;
          
          return (
            ag.salaoId === salaoAtual.id && 
            ag.origemAgendamento === 'online' &&
            !notificacoesLidas.includes(ag.id)
          );
        })
        .sort((a, b) => {
          const dateA = new Date(a.criadoEm || 0);
          const dateB = new Date(b.criadoEm || 0);
          return dateB - dateA;
        });
    } catch (error) {
      console.error('Erro ao filtrar agendamentos:', error);
      return [];
    }
  }, [agendamentosRealtime, salaoAtual, notificacoesLidas]);

  const notificacoesNaoLidas = agendamentosOnline.length;

  // Salvar notificações lidas
  useEffect(() => {
    localStorage.setItem('notificacoesLidas', JSON.stringify(notificacoesLidas));
  }, [notificacoesLidas]);

  // Som de notificação
  useEffect(() => {
    const previousCount = parseInt(localStorage.getItem('previousNotificationCount') || '0');
    
    if (notificacoesNaoLidas > previousCount && previousCount > 0) {
      console.log('🔔 Novo agendamento online recebido!');
    }
    
    localStorage.setItem('previousNotificationCount', notificacoesNaoLidas.toString());
  }, [notificacoesNaoLidas]);

  const marcarComoLida = (agendamentoId) => {
    setNotificacoesLidas(prev => [...prev, agendamentoId]);
  };

  const marcarTodasComoLidas = () => {
    const idsOnline = agendamentosOnline.map(ag => ag.id);
    setNotificacoesLidas(prev => [...prev, ...idsOnline]);
  };

  const handleOpenNovoSalaoModal = () => {
    setShowSaloes(false);
    setShowNovoSalaoModal(true);
  };

  const handleCloseNovoSalaoModal = () => {
    setShowNovoSalaoModal(false);
    setFormData({
      nome: '',
      endereco: '',
      telefone: '',
      email: '',
      plano: 'inicial'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const novoSalao = adicionarSalao({
      ...formData,
      logo: null,
      userId: currentUser.id
    });
    
    setSalaoAtual(novoSalao);
    handleCloseNovoSalaoModal();
    alert('Salão cadastrado com sucesso!');
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/');
    }
  };

  const podeAdicionarSalao = () => {
    const planosLimites = {
      'inicial': 1,
      'essencial': 1,
      'plus': 1,
      'profissional': 2,
      'premium': 5,
      'master': Infinity
    };

    const limite = planosLimites[salaoAtual.plano] || 1;
    return saloes.length < limite;
  };

  // ✅ CORREÇÃO CRÍTICA: Safe getters com fallback
  const getClienteNome = (clienteId) => {
    try {
      const cliente = clientes.find(c => c.id === clienteId);
      return cliente?.nome || 'Cliente não encontrado';
    } catch {
      return 'Cliente';
    }
  };

  const getServicoNome = (servicoId) => {
    try {
      const servico = servicos.find(s => s.id === servicoId);
      return servico?.nome || 'Serviço não encontrado';
    } catch {
      return 'Serviço';
    }
  };

  const getProfissionalNome = (profissionalId) => {
    try {
      const profissional = profissionais.find(p => p.id === profissionalId);
      return profissional?.nome || 'Profissional não encontrado';
    } catch {
      return 'Profissional';
    }
  };

  const formatarDataHora = (dataStr, horaStr) => {
    try {
      return `${dataStr} às ${horaStr}`;
    } catch {
      return 'Data não disponível';
    }
  };

  const getTempoDecorrido = (criadoEm) => {
    try {
      if (!criadoEm) return 'Agora';
      
      const agora = new Date();
      const criado = new Date(criadoEm);
      const diffMs = agora - criado;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `Há ${diffMins} min`;
      
      const diffHoras = Math.floor(diffMins / 60);
      if (diffHoras < 24) return `Há ${diffHoras}h`;
      
      const diffDias = Math.floor(diffHoras / 24);
      return `Há ${diffDias}d`;
    } catch {
      return 'Recente';
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Seletor de Salão */}
          <div className="relative">
            <button
              onClick={() => setShowSaloes(!showSaloes)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="font-medium text-gray-700">{salaoAtual?.nome || 'Sem salão'}</span>
              <ChevronDown size={18} className="text-gray-500" />
            </button>

            {showSaloes && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="max-h-80 overflow-y-auto">
                  {saloes.map((salao) => (
                    <button
                      key={salao.id}
                      onClick={() => {
                        setSalaoAtual(salao);
                        setShowSaloes(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        salao.id === salaoAtual?.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className={`font-medium ${
                            salao.id === salaoAtual?.id ? 'text-purple-600' : 'text-gray-800'
                          }`}>
                            {salao.nome}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">{salao.endereco}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                              {salao.plano}
                            </span>
                          </div>
                        </div>
                        {salao.id === salaoAtual?.id && (
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {podeAdicionarSalao() ? (
                  <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                    <button
                      onClick={handleOpenNovoSalaoModal}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      <Plus size={18} />
                      <span className="font-medium">Adicionar Novo Salão</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                    <div className="text-xs text-gray-600 text-center py-2">
                      Limite de salões atingido para o plano {salaoAtual?.plano || 'atual'}.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notificações e Menu do Usuário */}
          <div className="flex items-center space-x-4">
            {/* Notificações */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={22} className="text-gray-600" />
                {notificacoesNaoLidas > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                    {notificacoesNaoLidas > 9 ? '9+' : notificacoesNaoLidas}
                  </span>
                )}
                {isUpdating && (
                  <div className="absolute -bottom-1 -right-1">
                    <RefreshCw size={12} className="text-blue-500 animate-spin" />
                  </div>
                )}
              </button>

              {/* Dropdown de Notificações */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">
                        Notificações {notificacoesNaoLidas > 0 && `(${notificacoesNaoLidas})`}
                      </h3>
                      {notificacoesNaoLidas > 0 && (
                        <button
                          onClick={marcarTodasComoLidas}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                    </div>
                    
                    <div className={`flex items-center space-x-2 text-xs ${
                      isUpdating ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {isUpdating ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" />
                          <span>Atualizando...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Sincronizado • {lastUpdate.toLocaleTimeString('pt-BR')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Lista de Notificações */}
                  <div className="max-h-80 overflow-y-auto">
                    {agendamentosOnline.length > 0 ? (
                      agendamentosOnline.map(ag => {
                        // ✅ PROTEÇÃO: Verificar se ag existe
                        if (!ag) return null;

                        return (
                          <div 
                            key={ag.id}
                            className={`p-4 hover:bg-gray-50 border-b border-gray-100 transition-all ${
                              isUpdating ? 'opacity-50' : 'opacity-100'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <Calendar size={16} className="text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">
                                    Novo agendamento online
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {getTempoDecorrido(ag.criadoEm)}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => marcarComoLida(ag.id)}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                title="Marcar como lida"
                              >
                                <X size={14} className="text-gray-400" />
                              </button>
                            </div>

                            <div className="ml-10 space-y-1">
                              <p className="text-sm text-gray-700">
                                <strong>{getClienteNome(ag.clienteId)}</strong> agendou <strong>{getServicoNome(ag.servicoId)}</strong>
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Calendar size={12} />
                                  <span>{formatarDataHora(ag.data, ag.horario)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <User size={12} />
                                  <span>{getProfissionalNome(ag.profissionalId)}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setShowNotifications(false);
                                navigate('/agendamentos');
                              }}
                              className="ml-10 mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
                            >
                              Ver detalhes →
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Nenhuma notificação nova</p>
                        <p className="text-xs mt-2">
                          Agendamentos online aparecerão aqui
                        </p>
                        {isUpdating && (
                          <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-blue-600">
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Verificando novos agendamentos...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {agendamentosOnline.length > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/agendamentos');
                        }}
                        className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Ver todos os agendamentos
                      </button>
                    </div>
                  )}
                  
                  <div className="px-3 pb-3">
                    <p className="text-xs text-center text-gray-500">
                      🔄 Atualização automática a cada 2 segundos
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Menu do Usuário */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                  {currentUser?.nome?.charAt(0) || 'U'}
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{currentUser?.nome}</p>
                    <p className="text-sm text-gray-500">{currentUser?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/configuracoes');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                  >
                    <User size={18} className="text-gray-600" />
                    <span className="text-gray-700">Minha Conta</span>
                  </button>

                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center space-x-3 text-red-600"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Novo Salão */}
      <Modal
        isOpen={showNovoSalaoModal}
        onClose={handleCloseNovoSalaoModal}
        title="Cadastrar Novo Salão"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Salão *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Salão Beleza Pura"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço Completo *
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Rua, número - Bairro - Cidade/Estado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <MaskedInput
              mask="phone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              placeholder="(11) 98765-4321"
            />
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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="contato@salao.com.br"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plano Inicial *
            </label>
            <select
              name="plano"
              value={formData.plano}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="inicial">Inicial (Gratuito)</option>
              <option value="essencial">Essencial (R$ 29,90)</option>
              <option value="profissional">Profissional (R$ 79,90)</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> O novo salão será criado sem dados. Você poderá adicionar clientes, profissionais e serviços após a criação.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseNovoSalaoModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Cadastrar Salão
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Header;