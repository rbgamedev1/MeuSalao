// src/pages/AgendaOnline.jsx - Página Pública de Agendamento Online com Mailgun

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Scissors, Phone, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { maskPhone, maskDate, getTodayBR, dateToISO, isValidDate } from '../utils/masks';
import mailgunService from '../services/mailgunService';

const AgendaOnline = () => {
  const { salaoId } = useParams();
  const navigate = useNavigate();
  
  const [salao, setSalao] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    servicoId: '',
    profissionalId: '',
    data: '',
    horario: ''
  });

  const [errors, setErrors] = useState({});

  // Carregar dados do salão
  useEffect(() => {
    loadSalaoData();
  }, [salaoId]);

  const loadSalaoData = () => {
    try {
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const servicosAll = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionaisAll = JSON.parse(localStorage.getItem('profissionais') || '[]');
      const agendamentosAll = JSON.parse(localStorage.getItem('agendamentos') || '[]');

      const salaoEncontrado = saloes.find(s => s.id === parseInt(salaoId));
      
      if (!salaoEncontrado) {
        alert('Salão não encontrado');
        return;
      }

      setSalao(salaoEncontrado);
      setServicos(servicosAll.filter(s => s.salaoId === parseInt(salaoId) && s.ativo));
      setProfissionais(profissionaisAll.filter(p => p.salaoId === parseInt(salaoId)));
      setAgendamentos(agendamentosAll.filter(a => a.salaoId === parseInt(salaoId)));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let maskedValue = value;
    if (name === 'telefone') {
      maskedValue = maskPhone(value);
    } else if (name === 'data') {
      maskedValue = maskDate(value);
    }

    setFormData(prev => ({ ...prev, [name]: maskedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.servicoId) {
      newErrors.servicoId = 'Selecione um serviço';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.profissionalId) {
      newErrors.profissionalId = 'Selecione um profissional';
    }

    if (!formData.data || !isValidDate(formData.data)) {
      newErrors.data = 'Data inválida';
    }

    if (!formData.horario) {
      newErrors.horario = 'Selecione um horário';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSendingEmail(true);
    
    try {
      // Verificar se já existe cliente com este email
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      let cliente = clientes.find(c => c.email === formData.email);

      if (!cliente) {
        // Criar novo cliente
        cliente = {
          id: Math.max(...clientes.map(c => c.id), 0) + 1,
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          dataNascimento: '',
          ultimaVisita: formData.data,
          totalGasto: 0,
          visitas: 0,
          status: 'ativo',
          salaoId: parseInt(salaoId)
        };
        clientes.push(cliente);
        localStorage.setItem('clientes', JSON.stringify(clientes));
      }

      // Criar agendamento
      const agendamentosAll = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const novoAgendamento = {
        id: Math.max(...agendamentosAll.map(a => a.id), 0) + 1,
        clienteId: cliente.id,
        servicoId: parseInt(formData.servicoId),
        profissionalId: parseInt(formData.profissionalId),
        data: formData.data,
        horario: formData.horario,
        status: 'confirmado',
        salaoId: parseInt(salaoId),
        origemAgendamento: 'online'
      };

      agendamentosAll.push(novoAgendamento);
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAll));

      // Enviar email de confirmação via Mailgun
      try {
        const servico = servicos.find(s => s.id === parseInt(formData.servicoId));
        const profissional = profissionais.find(p => p.id === parseInt(formData.profissionalId));
        
        await mailgunService.sendConfirmacaoAgendamento({
          cliente,
          servico,
          profissional,
          salao,
          agendamento: novoAgendamento
        });
        
        console.log('✅ Email de confirmação enviado com sucesso!');
      } catch (emailError) {
        console.error('❌ Erro ao enviar email:', emailError);
        // Não bloquear o agendamento se o email falhar
      }

      setSuccess(true);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setSendingEmail(false);
    }
  };

  const servicoSelecionado = servicos.find(s => s.id === parseInt(formData.servicoId));
  const profissionaisFiltrados = formData.servicoId 
    ? profissionais.filter(p => servicoSelecionado?.profissionaisHabilitados?.includes(p.id))
    : [];

  const gerarHorarios = () => {
    const horarios = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const horario = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
        // Verificar se horário está ocupado
        const ocupado = agendamentos.some(ag => 
          ag.data === formData.data && 
          ag.horario === horario &&
          ag.profissionalId === parseInt(formData.profissionalId) &&
          ag.status !== 'cancelado'
        );

        horarios.push({ horario, ocupado });
      }
    }
    return horarios;
  };

  const horariosDisponiveis = gerarHorarios();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!salao) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <p className="text-gray-800 text-lg mb-4">Salão não encontrado</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Agendamento Confirmado! 🎉
            </h2>
            <p className="text-gray-600">
              Enviamos uma confirmação por email com todos os detalhes.
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-purple-900 mb-3">Detalhes do Agendamento:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Data:</strong> {formData.data}</p>
              <p><strong>Horário:</strong> {formData.horario}</p>
              <p><strong>Serviço:</strong> {servicoSelecionado?.nome}</p>
              <p><strong>Local:</strong> {salao.endereco}</p>
            </div>
          </div>

          {sendingEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
              📧 Enviando confirmação por email...
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
          >
            Fazer Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header do Salão */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">{salao.nome}</h1>
            <p className="opacity-90">{salao.endereco}</p>
            <p className="opacity-90">{salao.telefone}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map(num => (
              <div
                key={num}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  num <= step ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className={step >= 1 ? 'text-purple-600 font-medium' : 'text-gray-400'}>
              Seus Dados
            </span>
            <span className={step >= 2 ? 'text-purple-600 font-medium' : 'text-gray-400'}>
              Serviço
            </span>
            <span className={step >= 3 ? 'text-purple-600 font-medium' : 'text-gray-400'}>
              Data e Hora
            </span>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Dados Pessoais */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Seus Dados
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Seu nome completo"
                  />
                </div>
                {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="(11) 98765-4321"
                  />
                </div>
                {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                <p className="text-xs text-gray-500 mt-1">📧 Você receberá a confirmação neste email</p>
              </div>
            </div>
          )}

          {/* Step 2: Escolher Serviço */}
          {step === 2 && (
            <div className="space-y-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
              >
                <ArrowLeft size={20} className="mr-2" />
                Voltar
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Escolha o Serviço
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicos.map(servico => (
                  <button
                    key={servico.id}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, servicoId: servico.id.toString(), profissionalId: '' }));
                      setErrors(prev => ({ ...prev, servicoId: '' }));
                    }}
                    className={`text-left p-6 rounded-lg border-2 transition-all ${
                      formData.servicoId === servico.id.toString()
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Scissors className={`${
                        formData.servicoId === servico.id.toString()
                          ? 'text-purple-600'
                          : 'text-gray-400'
                      }`} size={24} />
                      <span className="text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {servico.categoria}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{servico.nome}</h3>
                    <p className="text-sm text-gray-600 mb-3">{servico.descricao}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        <Clock size={16} className="inline mr-1" />
                        {servico.duracao} min
                      </span>
                      <span className="font-bold text-green-600">
                        R$ {servico.valor.toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.servicoId && <p className="text-red-500 text-sm">{errors.servicoId}</p>}
            </div>
          )}

          {/* Step 3: Data, Hora e Profissional */}
          {step === 3 && (
            <div className="space-y-6">
              <button
                onClick={() => setStep(2)}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
              >
                <ArrowLeft size={20} className="mr-2" />
                Voltar
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Data, Hora e Profissional
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissional *
                </label>
                <select
                  name="profissionalId"
                  value={formData.profissionalId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione um profissional</option>
                  {profissionaisFiltrados.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome}
                    </option>
                  ))}
                </select>
                {errors.profissionalId && <p className="text-red-500 text-xs mt-1">{errors.profissionalId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="DD/MM/AAAA"
                  />
                </div>
                {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data}</p>}
              </div>

              {formData.profissionalId && formData.data && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário *
                  </label>
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2">
                    {horariosDisponiveis.map(({ horario, ocupado }) => (
                      <button
                        key={horario}
                        onClick={() => !ocupado && setFormData(prev => ({ ...prev, horario }))}
                        disabled={ocupado}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.horario === horario
                            ? 'bg-purple-600 text-white'
                            : ocupado
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border-2 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {horario}
                      </button>
                    ))}
                  </div>
                  {errors.horario && <p className="text-red-500 text-xs mt-1">{errors.horario}</p>}
                </div>
              )}
            </div>
          )}

          {/* Botão de Ação */}
          <div className="mt-8 flex space-x-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={sendingEmail}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingEmail ? 'Processando...' : step === 3 ? 'Confirmar Agendamento' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaOnline;