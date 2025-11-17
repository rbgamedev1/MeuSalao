// src/pages/Avaliacao.jsx - Página de Avaliação Pós-Atendimento

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Avaliacao = () => {
  const { salaoId, token } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [salao, setSalao] = useState(null);
  const [agendamento, setAgendamento] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [servico, setServico] = useState(null);
  const [profissional, setProfissional] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [avaliacao, setAvaliacao] = useState({
    nota: 0,
    comentario: '',
    recomendaria: null
  });

  useEffect(() => {
    loadDados();
  }, [salaoId, token]);

  const loadDados = () => {
    try {
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const servicos = JSON.parse(localStorage.getItem('servicos') || '[]');
      const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');

      console.log('🔍 DEBUG Avaliação:', {
        salaoId,
        token,
        'saloes disponíveis': saloes.map(s => ({ id: s.id, nome: s.nome })),
        'agendamentos disponíveis': agendamentos.length
      });

      // Tentar encontrar o salão com ID como string ou número
      const salaoEncontrado = saloes.find(s => 
        String(s.id) === String(salaoId) || s.id === parseInt(salaoId)
      );
      
      if (!salaoEncontrado) {
        console.error('❌ Salão não encontrado:', { salaoId, saloes });
        setError('Salão não encontrado');
        setLoading(false);
        return;
      }

      // Extrair agendamentoId do token
      const agendamentoId = parseInt(token.split('-')[0]);
      console.log('🔍 Procurando agendamento:', { agendamentoId, salaoId });
      
      const agendamentoEncontrado = agendamentos.find(a => 
        a.id === agendamentoId && 
        (String(a.salaoId) === String(salaoId) || a.salaoId === parseInt(salaoId))
      );

      if (!agendamentoEncontrado) {
        console.error('❌ Agendamento não encontrado:', { 
          agendamentoId, 
          salaoId,
          agendamentos: agendamentos.map(a => ({ id: a.id, salaoId: a.salaoId }))
        });
        setError('Agendamento não encontrado');
        setLoading(false);
        return;
      }

      // Verificar se já foi avaliado
      if (agendamentoEncontrado.avaliacaoRealizada) {
        setError('Este agendamento já foi avaliado. Obrigado!');
        setLoading(false);
        return;
      }

      const clienteEncontrado = clientes.find(c => c.id === agendamentoEncontrado.clienteId);
      const servicoEncontrado = servicos.find(s => s.id === agendamentoEncontrado.servicoId);
      const profissionalEncontrado = profissionais.find(p => p.id === agendamentoEncontrado.profissionalId);

      console.log('✅ Dados carregados com sucesso:', {
        salao: salaoEncontrado.nome,
        cliente: clienteEncontrado?.nome,
        servico: servicoEncontrado?.nome,
        profissional: profissionalEncontrado?.nome
      });

      setSalao(salaoEncontrado);
      setAgendamento(agendamentoEncontrado);
      setCliente(clienteEncontrado);
      setServico(servicoEncontrado);
      setProfissional(profissionalEncontrado);
      setLoading(false);

    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setError('Erro ao carregar informações');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (avaliacao.nota === 0) {
      alert('Por favor, selecione uma nota de 1 a 5 estrelas');
      return;
    }

    if (avaliacao.recomendaria === null) {
      alert('Por favor, indique se recomendaria o salão');
      return;
    }

    setSubmitting(true);

    try {
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes') || '[]');

      // Criar avaliação
      const novaAvaliacao = {
        id: Math.max(...avaliacoes.map(a => a.id), 0) + 1,
        agendamentoId: agendamento.id,
        clienteId: agendamento.clienteId,
        profissionalId: agendamento.profissionalId,
        servicoId: agendamento.servicoId,
        salaoId: parseInt(salaoId),
        nota: avaliacao.nota,
        comentario: avaliacao.comentario,
        recomendaria: avaliacao.recomendaria,
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR')
      };

      avaliacoes.push(novaAvaliacao);
      localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));

      // Marcar agendamento como avaliado
      const agendamentosAtualizados = agendamentos.map(ag => 
        ag.id === agendamento.id 
          ? { ...ag, avaliacaoRealizada: true }
          : ag
      );
      localStorage.setItem('agendamentos', JSON.stringify(agendamentosAtualizados));

      console.log('✅ Avaliação salva com sucesso:', novaAvaliacao);

      setSuccess(true);
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        window.close();
      }, 3000);

    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      alert('Erro ao salvar avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={48} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Obrigado pela Avaliação! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Sua opinião é muito importante para nós!
          </p>
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={32}
                className={index < avaliacao.nota ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Esta janela será fechada automaticamente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Como foi sua experiência?</h1>
            <p className="opacity-90">{salao.nome}</p>
          </div>
        </div>

        {/* Informações do Agendamento */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalhes do Atendimento</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Data:</strong> {agendamento.data}</p>
            <p><strong>Serviço:</strong> {servico?.nome}</p>
            <p><strong>Profissional:</strong> {profissional?.nome}</p>
          </div>
        </div>

        {/* Formulário de Avaliação */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Avaliação por Estrelas */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4 text-center">
              Como você avalia o atendimento?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setAvaliacao(prev => ({ ...prev, nota: star }))}
                  className="transform transition-all hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={48}
                    className={
                      star <= avaliacao.nota
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-200'
                    }
                  />
                </button>
              ))}
            </div>
            {avaliacao.nota > 0 && (
              <p className="text-center mt-4 text-gray-600">
                {avaliacao.nota === 5 && '⭐ Excelente!'}
                {avaliacao.nota === 4 && '😊 Muito bom!'}
                {avaliacao.nota === 3 && '🙂 Bom'}
                {avaliacao.nota === 2 && '😐 Regular'}
                {avaliacao.nota === 1 && '😞 Insatisfeito'}
              </p>
            )}
          </div>

          {/* Recomendação */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4 text-center">
              Você recomendaria {salao.nome} para amigos e familiares?
            </label>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setAvaliacao(prev => ({ ...prev, recomendaria: true }))}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  avaliacao.recomendaria === true
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👍 Sim
              </button>
              <button
                type="button"
                onClick={() => setAvaliacao(prev => ({ ...prev, recomendaria: false }))}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  avaliacao.recomendaria === false
                    ? 'bg-red-500 text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👎 Não
              </button>
            </div>
          </div>

          {/* Comentário */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Deixe um comentário (opcional)
            </label>
            <textarea
              value={avaliacao.comentario}
              onChange={(e) => setAvaliacao(prev => ({ ...prev, comentario: e.target.value }))}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Conte-nos mais sobre sua experiência..."
            ></textarea>
          </div>

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={submitting || avaliacao.nota === 0 || avaliacao.recomendaria === null}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            <span className="font-semibold">
              {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Obrigado por escolher {salao.nome}!</p>
          <p className="mt-1">Sua opinião nos ajuda a melhorar sempre.</p>
        </div>
      </div>
    </div>
  );
};

export default Avaliacao;