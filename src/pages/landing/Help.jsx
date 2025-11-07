// src/pages/landing/Help.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, HelpCircle, ChevronDown, ChevronUp, MessageCircle, Mail, Book } from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      category: 'Primeiros Passos',
      questions: [
        {
          q: 'Como criar minha conta no SalãoPro?',
          a: 'Clique em "Começar Agora" na página inicial, preencha seus dados e comece a usar imediatamente. O plano gratuito não requer cartão de crédito.'
        },
        {
          q: 'Preciso instalar algum programa?',
          a: 'Não! O SalãoPro funciona 100% online através do navegador. Acesse de qualquer computador, tablet ou celular.'
        },
        {
          q: 'Como adicionar meus profissionais?',
          a: 'Vá em Configurações > Profissionais e clique em "Adicionar Profissional". Preencha nome, serviços e porcentagem de comissão.'
        }
      ]
    },
    {
      category: 'Agendamentos',
      questions: [
        {
          q: 'Como fazer um agendamento?',
          a: 'Na tela de Agenda, clique no horário desejado, selecione o cliente, serviço e profissional. Confirme e pronto!'
        },
        {
          q: 'Posso bloquear horários?',
          a: 'Sim! Clique no horário e selecione "Bloquear Horário". Útil para almoço, reuniões ou horários indisponíveis.'
        },
        {
          q: 'Como meus clientes agendam online?',
          a: 'Compartilhe seu link de agendamento (disponível em Configurações > Agendamento Online). Seus clientes podem agendar 24/7.'
        }
      ]
    },
    {
      category: 'Clientes',
      questions: [
        {
          q: 'Como cadastrar um novo cliente?',
          a: 'Vá em Clientes > Adicionar Cliente. Preencha nome, telefone e email. As outras informações são opcionais.'
        },
        {
          q: 'Posso ver o histórico de atendimentos?',
          a: 'Sim! Clique no cliente e veja todos os agendamentos realizados, datas e serviços feitos.'
        },
        {
          q: 'Como enviar mensagens aos clientes?',
          a: 'As notificações são enviadas automaticamente por email quando configuradas. Você pode personalizar as mensagens em Configurações.'
        }
      ]
    },
    {
      category: 'Financeiro',
      questions: [
        {
          q: 'Como registrar uma venda?',
          a: 'Ao confirmar o agendamento como realizado, o valor é automaticamente adicionado ao financeiro. Você também pode adicionar vendas avulsas.'
        },
        {
          q: 'Como calcular comissões?',
          a: 'As comissões são calculadas automaticamente com base na porcentagem definida para cada profissional.'
        },
        {
          q: 'Posso registrar despesas?',
          a: 'Sim! Em Financeiro > Despesas, adicione aluguel, produtos, salários e outras despesas do salão.'
        }
      ]
    },
    {
      category: 'Planos e Pagamento',
      questions: [
        {
          q: 'O plano gratuito tem prazo de validade?',
          a: 'Não! O plano gratuito é para sempre. Faça upgrade quando precisar de mais recursos.'
        },
        {
          q: 'Como fazer upgrade do plano?',
          a: 'Em Configurações > Plano, escolha o plano desejado e siga as instruções de pagamento.'
        },
        {
          q: 'Posso cancelar a qualquer momento?',
          a: 'Sim! Sem fidelidade ou multa. Você pode cancelar quando quiser e voltar para o plano gratuito.'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <HelpCircle size={64} className="text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Central de Ajuda
          </h1>
          <p className="text-xl text-gray-600">
            Tire suas dúvidas e aprenda a usar o SalãoPro
          </p>
        </div>

        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar dúvidas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            onClick={() => navigate('/documentation')}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <Book className="text-purple-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Documentação
            </h3>
            <p className="text-gray-600 text-sm">
              Guias completos e tutoriais passo a passo
            </p>
          </div>

          <div 
            onClick={() => navigate('/contact')}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <Mail className="text-pink-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Contato
            </h3>
            <p className="text-gray-600 text-sm">
              Entre em contato com nossa equipe de suporte
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <MessageCircle className="text-blue-600 mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Comunidade
            </h3>
            <p className="text-gray-600 text-sm">
              Troque experiências com outros usuários
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Perguntas Frequentes
          </h2>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma pergunta encontrada com "{searchTerm}"</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-purple-600 mb-4">
                    {category.category}
                  </h3>
                  
                  <div className="space-y-3">
                    {category.questions.map((faq, questionIndex) => {
                      const key = `${categoryIndex}-${questionIndex}`;
                      const isExpanded = expandedFaq === key;
                      
                      return (
                        <div
                          key={questionIndex}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleFaq(categoryIndex, questionIndex)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900 pr-4">
                              {faq.q}
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={20} className="text-purple-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <div className="px-6 pb-4 text-gray-600 border-t border-gray-100">
                              <p className="pt-4">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            Ainda tem dúvidas?
          </h3>
          <p className="text-purple-100 mb-6">
            Nossa equipe está pronta para ajudar você
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-semibold"
          >
            Falar com Suporte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Help;