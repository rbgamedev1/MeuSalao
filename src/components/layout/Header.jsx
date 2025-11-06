// src/components/layout/Header.jsx - ATUALIZADO COM LOGOUT

import { useState, useContext } from 'react';
import { Bell, Search, ChevronDown, Plus, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SalaoContext } from "../../contexts/SalaoContext";
import { AuthContext } from "../../contexts/AuthContext";
import Modal from '../Modal';
import MaskedInput from '../MaskedInput';

const Header = () => {
  const navigate = useNavigate();
  const { salaoAtual, saloes, setSalaoAtual, adicionarSalao } = useContext(SalaoContext);
  const { currentUser, logout } = useContext(AuthContext);
  
  const [showSaloes, setShowSaloes] = useState(false);
  const [showNovoSalaoModal, setShowNovoSalaoModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    plano: 'inicial'
  });

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
              <span className="font-medium text-gray-700">{salaoAtual.nome}</span>
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
                        salao.id === salaoAtual.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className={`font-medium ${
                            salao.id === salaoAtual.id ? 'text-purple-600' : 'text-gray-800'
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
                        {salao.id === salaoAtual.id && (
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
                      Limite de salões atingido para o plano {salaoAtual.plano}.
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                  <div className="text-xs text-gray-500">
                    {saloes.length} de {podeAdicionarSalao() ? 
                      (salaoAtual.plano === 'master' ? '∞' : 
                       salaoAtual.plano === 'premium' ? '5' : 
                       salaoAtual.plano === 'profissional' ? '2' : '1') 
                      : saloes.length} salões cadastrados
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Busca e Ações */}
          <div className="flex items-center space-x-4">
            {/* Busca */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Notificações */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={22} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

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