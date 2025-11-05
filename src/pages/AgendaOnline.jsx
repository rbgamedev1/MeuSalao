// src/pages/AgendaOnline.jsx - CORRIGIDO: Bloqueio para plano inicial

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Crown, Lock } from 'lucide-react';
import AgendaHeader from '../components/agendaOnline/AgendaHeader';
import AgendaStepIndicator from '../components/agendaOnline/AgendaStepIndicator';
import AgendaStepDados from '../components/agendaOnline/AgendaStepDados';
import AgendaStepServico from '../components/agendaOnline/AgendaStepServico';
import AgendaStepDataHora from '../components/agendaOnline/AgendaStepDataHora';
import AgendaSucesso from '../components/agendaOnline/AgendaSucesso';
import AgendaLoading from '../components/agendaOnline/AgendaLoading';
import AgendaErro from '../components/agendaOnline/AgendaErro';
import mailgunService from '../services/mailgunService';
import { hasAccess } from '../utils/planRestrictions';
import { verificarConflitoHorario } from '../utils/agendamentoUtils';
import { useRealtimeAgendamentos } from '../hooks/useRealtimeAgendamentos';

const AgendaOnline = () => {
  const { salaoId } = useParams();
  const navigate = useNavigate();
  
  const [salao, setSalao] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [planLimitError, setPlanLimitError] = useState(null);

  // ✅ NOVO: Estado para verificação de acesso
  const [hasAccessToAgenda, setHasAccessToAgenda] = useState(false);

  const { 
    agendamentos, 
    isUpdating, 
    lastUpdate,
    forceRefresh 
  } = useRealtimeAgendamentos(parseInt(salaoId), 2000);

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

  // ✅ CRÍTICO: Verificar acesso do salão à agenda online
  useEffect(() => {
    loadSalaoData();
  }, [salaoId]);

  const loadSalaoData = () => {
    try {
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const servicosAll = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionaisAll = JSON.parse(localStorage.getItem('profissionais') || '[]');

      const salaoEncontrado = saloes.find(s => s.id === parseInt(salaoId));
      
      if (!salaoEncontrado) {
        setPlanLimitError({
          title: 'Salão não encontrado',
          message: 'Não foi possível encontrar este salão.',
          suggestion: 'Verifique o link e tente novamente.',
          showPhone: false
        });
        setLoading(false);
        return;
      }

      // ✅ VERIFICAÇÃO CRÍTICA: Checar se o plano permite agenda online
      const temAcesso = hasAccess(salaoEncontrado.plano, 'agendamentoOnline');
      
      if (!temAcesso) {
        setPlanLimitError({
          title: 'Agenda Online Indisponível',
          message: `${salaoEncontrado.nome} ainda não ativou a Agenda Online.`,
          suggestion: 'Esta funcionalidade está disponível a partir do Plano Essencial.',
          showPhone: true,
          planoAtual: salaoEncontrado.plano
        });
        setSalao(salaoEncontrado);
        setLoading(false);
        return;
      }

      setHasAccessToAgenda(true);
      setSalao(salaoEncontrado);
      setServicos(servicosAll.filter(s => s.salaoId === parseInt(salaoId) && s.ativo));
      setProfissionais(profissionaisAll.filter(p => p.salaoId === parseInt(salaoId)));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

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

    if (formData.profissionalId && formData.data && formData.horario && formData.servicoId) {
      const servico = servicos.find(s => s.id === parseInt(formData.servicoId));
      
      if (servico) {
        const resultado = verificarConflitoHorario(
          formData.horario,
          servico.duracao,
          agendamentos,
          servicos,
          parseInt(formData.profissionalId),
          formData.data
        );

        if (resultado.conflito) {
          newErrors.horario = 'Este horário não está mais disponível. Por favor, escolha outro.';
        }
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
      
      const agendamentosAtualizados = agendamentosAll.filter(a => a.salaoId === parseInt(salaoId));
      
      const servico = servicos.find(s => s.id === parseInt(formData.servicoId));
      
      if (servico) {
        const resultado = verificarConflitoHorario(
          formData.horario,
          servico.duracao,
          agendamentosAtualizados,
          servicos,
          parseInt(formData.profissionalId),
          formData.data
        );

        if (resultado.conflito) {
          alert('⚠️ Este horário acabou de ser reservado por outro cliente. Por favor, escolha outro horário.');
          setFormData(prev => ({ ...prev, horario: '' }));
          setSendingEmail(false);
          setStep(3);
          return;
        }
      }

      let cliente = clientes.find(c => c.email === formData.email && c.salaoId === parseInt(salaoId));

      if (!cliente) {
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

      window.dispatchEvent(new StorageEvent('storage', {
        key: 'agendamentos',
        newValue: JSON.stringify(agendamentosAll),
        url: window.location.href
      }));

      console.log('✅ Novo agendamento criado:', novoAgendamento);

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

  // ✅ TELA DE BLOQUEIO: Agenda online indisponível para este plano
  if (!hasAccessToAgenda && planLimitError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={48} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {planLimitError.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {planLimitError.message}
            </p>
            {planLimitError.planoAtual && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg mb-4">
                <span className="text-sm text-gray-600">Plano Atual:</span>
                <span className="text-sm font-bold text-gray-800 capitalize">{planLimitError.planoAtual}</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <Crown className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">
                  💡 {planLimitError.suggestion}
                </p>
                <p className="text-sm text-blue-800">
                  A <strong>Agenda Online</strong> está disponível a partir do <strong>Plano Essencial (R$ 29,90/mês)</strong> e permite:
                </p>
                <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc space-y-1">
                  <li>Agendamentos online 24/7</li>
                  <li>Link compartilhável</li>
                  <li>Confirmações automáticas por email</li>
                  <li>Sincronização em tempo real</li>
                  <li>Até 30 clientes cadastrados</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {planLimitError.showPhone && salao && (
              <>
                <p className="text-center text-sm text-gray-600 font-medium mb-3">
                  Enquanto isso, você pode entrar em contato diretamente:
                </p>
                <a
                  href={`tel:${salao.telefone.replace(/\D/g, '')}`}
                  className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-center font-medium"
                >
                  📞 Ligar para {salao.nome}
                </a>
                <a
                  href={`https://wa.me/55${salao.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center font-medium"
                >
                  💬 Chamar no WhatsApp
                </a>
              </>
            )}
          </div>

          {salao && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="font-medium text-gray-800">{salao.nome}</p>
                <p className="mt-1">{salao.endereco}</p>
                <p className="mt-1">{salao.telefone}</p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Proprietário do salão? <a href="/configuracoes" className="text-purple-600 underline hover:text-purple-700">Faça upgrade do seu plano</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!salao) {
    return <AgendaErro onVoltar={() => navigate('/')} />;
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

        <div className={`mb-4 rounded-lg p-3 transition-all ${
          isUpdating 
            ? 'bg-blue-50 border border-blue-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <p className="text-xs text-center">
            {isUpdating ? (
              <span className="text-blue-800">
                🔄 Atualizando horários disponíveis...
              </span>
            ) : (
              <span className="text-green-800">
                ✅ Horários sincronizados em tempo real • Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              </span>
            )}
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

          <div className="mt-8 flex space-x-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={sendingEmail}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={sendingEmail}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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