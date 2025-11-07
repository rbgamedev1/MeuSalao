// src/pages/landing/About.jsx

import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Lightbulb, Target, Users, Scissors, Sparkles } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
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

      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Nossa História</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sobre o SalãoPro
          </h1>
          
          <p className="text-xl text-gray-600">
            Nascido da experiência real de quem vive o dia a dia dos salões de beleza
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-6">
              <Scissors className="text-purple-600" size={32} />
              <h2 className="text-3xl font-bold text-gray-900">
                Como Tudo Começou
              </h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
              <p>
                O <strong>SalãoPro</strong> foi desenvolvido pelo <strong>Jucely Hair Salon</strong>, 
                um salão que, ao longo de anos de experiência no mercado de beleza, enfrentou 
                os desafios comuns a todo empreendedor do setor.
              </p>
              
              <p>
                Durante anos, lidamos com agendas de papel bagunçadas, planilhas complexas, 
                conflitos de horários, dificuldade em acompanhar o financeiro e a falta de 
                ferramentas adequadas para gerenciar nossos clientes e equipe de forma eficiente.
              </p>
              
              <p>
                Percebemos que não estávamos sozinhos nessa luta. Milhares de salões pelo 
                Brasil enfrentavam os mesmos problemas, perdendo tempo e dinheiro com processos 
                manuais e desorganizados.
              </p>
              
              <p>
                Foi então que decidimos criar nossa própria solução. Uma ferramenta que 
                realmente entendesse as necessidades de um salão de beleza, porque foi 
                construída por quem vive isso todos os dias.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nossos Valores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Paixão por Beleza
              </h3>
              <p className="text-gray-600">
                Entendemos a arte e o cuidado que envolve cada atendimento. 
                Nosso sistema foi feito com carinho para quem ama o que faz.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="text-pink-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Inovação Prática
              </h3>
              <p className="text-gray-600">
                Tecnologia que realmente funciona no dia a dia. Simples de usar, 
                mas poderosa o suficiente para transformar seu negócio.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Foco no Cliente
              </h3>
              <p className="text-gray-600">
                Cada funcionalidade foi pensada para resolver problemas reais 
                que enfrentamos e que outros salões também enfrentam.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <Target size={32} />
              <h2 className="text-3xl font-bold">
                Nossa Missão
              </h2>
            </div>
            
            <p className="text-xl text-purple-100 mb-6">
              Empoderar salões de beleza de todos os tamanhos com tecnologia acessível 
              e eficiente, permitindo que foquem no que realmente importa: cuidar de 
              seus clientes e fazer seu negócio crescer.
            </p>
            
            <p className="text-lg text-purple-100">
              Queremos que cada salão, seja ele pequeno ou grande, tenha acesso às 
              mesmas ferramentas profissionais que as grandes redes utilizam.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Faça Parte Dessa História
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se aos salões que já transformaram sua gestão com o SalãoPro
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-lg font-semibold"
          >
            Começar Agora
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;