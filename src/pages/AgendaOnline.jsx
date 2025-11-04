// src/pages/AgendaOnline.jsx - COM ATUALIZAÇÃO EM TEMPO REAL

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgendaHeader from '../components/agendaOnline/AgendaHeader';
import AgendaStepIndicator from '../components/agendaOnline/AgendaStepIndicator';
import AgendaStepDados from '../components/agendaOnline/AgendaStepDados';
import AgendaStepServico from '../components/agendaOnline/AgendaStepServico';
import AgendaStepDataHora from '../components/agendaOnline/AgendaStepDataHora';
import AgendaSucesso from '../components/agendaOnline/AgendaSucesso';
import AgendaLoading from '../components/agendaOnline/AgendaLoading';
import AgendaErro from '../components/agendaOnline/AgendaErro';
import mailgunService from '../services/mailgunService';
import { canAddMore } from '../utils/planRestrictions';
import { calcularHorariosOcupados } from '../utils/agendamentoUtils';

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
  const [planLimitError, setPlanLimitError] = useState(null);

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

  // ✨ NOVO: Listener para atualização em tempo real
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Detectar mudanças no localStorage
      if (e.key === 'agendamentos' || e.key === null) {
        console.log('📡 Detectada mudança nos agendamentos, atualizando...');
        reloadAgendamentos();
      }
    };

    // Listener para mudanças de outras abas/janelas
    window.addEventListener('storage', handleStorageChange);

    // ✨ NOVO: Polling interno para detectar mudanças na mesma aba
    // (storage event não dispara na mesma aba que fez a mudança)
    const pollInterval = setInterval(() => {
      reloadAgendamentos();
    }, 2000); // Verifica a cada 2 segundos

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [salaoId, formData.data, formData.profissionalId]);

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

  // ✨ NOVO: Função para recarregar apenas agendamentos
  const reloadAgendamentos = () => {
    try {
      const agendamentosAll = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const agendamentosFiltrados = agendamentosAll.filter(a => a.salaoId === parseInt(salaoId));
      
      // Só atualizar se realmente mudou
      if (JSON.stringify(agendamentosFiltrados) !== JSON.stringify(agendamentos)) {
        console.log('🔄 Agendamentos atualizados em tempo real');
        setAgendamentos(agendamentosFiltrados);
        
        // Se estiver na tela de seleção de horário e o horário selecionado foi ocupado
        if (step === 3 && formData.horario && formData.profissionalId && formData.data) {
          const servicosAll = JSON.parse(localStorage.getItem('servicos') || '[]');
          const servico = servicosAll.find(s => s.id === parseInt(formData.servicoId));
          
          if (servico) {
            const horariosOcupados = calcularHorariosOcupados(
              agendamentosFiltrados,
              servicosAll,
              parseInt(formData.profissionalId),
              formData.data
            );
            
            // Se o horário atual foi ocupado, alertar e limpar
            if (horariosOcupados.includes(formData.horario)) {
              alert('⚠️ O horário que você selecionou acabou de ser reservado por outro cliente. Por favor, escolha outro horário.');
              setFormData(prev => ({ ...prev, horario: '' }));
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao recarregar agendamentos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Resetar horário quando data ou profissional mudar
    if (name === 'data' || name === 'profissionalId') {
      setFormData(prev => ({ ...prev, horario: '' }));
    }
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

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.telefone || formData.telefone.length < 15) newErrors.telefone = 'Telefone inválido';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Email inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.servicoId) newErrors.servicoId = 'Selecione um serviço';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.profissionalId) newErrors.profissionalId = 'Selecione um profissional';
    if (!formData.data) newErrors.data = 'Selecione uma data';
    if (!formData.horario) newErrors.horario = 'Selecione um horário';

    // Verificar se horário ainda está disponível
    if (formData.profissionalId && formData.data && formData.horario) {
      const servico = servicos.find(s => s.id === parseInt(formData.servicoId));
      const horariosOcupados = calcularHorariosOcupados(
        agendamentos,
        servicos,
        parseInt(formData.profissionalId),
        formData.data
      );

      if (horariosOcupados.includes(formData.horario)) {
        newErrors.horario = 'Este horário não está mais disponível. Por favor, escolha outro.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSendingEmail(true);
    setPlanLimitError(null);
    
    try {
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const agendamentosAll = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      
      // Recarregar agendamentos atualizados
      const agendamentosAtualizados = agendamentosAll.filter(a => a.salaoId === parseInt(salaoId));
      
      // VERIFICAÇÃO FINAL: Horário ainda disponível considerando duração?
      const servico = servicos.find(s => s.id === parseInt(formData.servicoId));
      const horariosOcupados = calcularHorariosOcupados(
        agendamentosAtualizados,
        servicos,
        parseInt(formData.profissionalId),
        formData.data
      );

      if (horariosOcupados.includes(formData.horario)) {
        alert('⚠️ Este horário acabou de ser reservado por outro cliente. Por favor, escolha outro horário.');
        setFormData(prev => ({ ...prev, horario: '' }));
        setSendingEmail(false);
        setStep(3);
        return;
      }

      // Verificar se cliente já existe
      let cliente = clientes.find(c => c.email === formData.email && c.salaoId === parseInt(salaoId));

      if (!cliente) {
        // Verificar limite de clientes do plano
        const clientesSalao = clientes.filter(c => c.salaoId === parseInt(salaoId));
        const canAdd = canAddMore(salao.plano, 'clientes', clientesSalao.length);
        
        if (!canAdd) {
          setPlanLimitError({
            title: 'Agenda Cheia no Momento',
            message: 'Desculpe, não estamos aceitando novos agendamentos online no momento devido à alta demanda.',
            suggestion: 'Entre em contato diretamente conosco por telefone para verificar disponibilidade.',
            showPhone: true
          });
          setSendingEmail(false);
          return;
        }

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
      const novoAgendamento = {
        id: Math.max(...agendamentosAll.map(a => a.id), 0) + 1,
        clienteId: cliente.id,
        servicoId: parseInt(formData.servicoId),
        profissionalId: parseInt(formData.profissionalId),
        data: formData.data,
        horario: formData.horario,
        status: 'confirmado',
        salaoId: parseInt(salaoId),
        origemAgendamento: 'online',
        criadoEm: new Date().toISOString()
      };

      agendamentosAll.push(novoAgendamento);
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAll));

      // ✨ NOVO: Disparar evento customizado para outras instâncias
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'agendamentos',
        newValue: JSON.stringify(agendamentosAll),
        url: window.location.href
      }));

      console.log('✅ Novo agendamento criado:', novoAgendamento);

      // Enviar email de confirmação
      try {
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
      }

      setSuccess(true);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return <AgendaLoading />;
  }

  if (!salao) {
    return <AgendaErro onVoltar={() => navigate('/')} />;
  }

  if (planLimitError) {
    return (
      <AgendaErro 
        error={planLimitError}
        salao={salao}
        onVoltar={() => window.location.reload()}
      />
    );
  }

  if (success) {
    return (
      <AgendaSucesso 
        formData={formData}
        servicos={servicos}
        profissionais={profissionais}
        salao={salao}
        onNovoAgendamento={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <AgendaHeader salao={salao} />
        
        <AgendaStepIndicator currentStep={step} />

        {/* ✨ NOVO: Indicador de atualização em tempo real */}
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-800 text-center">
            🔄 Horários atualizados em tempo real • Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <AgendaStepDados 
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
          )}

          {step === 2 && (
            <AgendaStepServico 
              formData={formData}
              errors={errors}
              servicos={servicos}
              onChange={handleChange}
            />
          )}

          {step === 3 && (
            <AgendaStepDataHora 
              formData={formData}
              errors={errors}
              servicos={servicos}
              profissionais={profissionais}
              agendamentos={agendamentos}
              onChange={handleChange}
            />
          )}

          {/* Botões de Navegação */}
          <div className="mt-8 flex space-x-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={sendingEmail}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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