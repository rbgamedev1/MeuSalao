// src/pages/landing/Documentation.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Book, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  BarChart3,
  ChevronRight,
  FileText
} from 'lucide-react';

const Documentation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('inicio');

  const sections = [
    {
      id: 'inicio',
      icon: Book,
      title: 'Introdução',
      content: {
        title: 'Bem-vindo ao SalãoPro',
        description: 'Guia completo para começar a usar o sistema',
        topics: [
          {
            title: 'O que é o SalãoPro?',
            content: 'O SalãoPro é um sistema completo de gestão para salões de beleza. Com ele, você pode gerenciar agendamentos, clientes, financeiro, profissionais e muito mais, tudo em um único lugar.'
          },
          {
            title: 'Primeiros Passos',
            content: 'Após criar sua conta, recomendamos: 1) Configure seu salão em Configurações, 2) Cadastre seus profissionais, 3) Adicione seus serviços e preços, 4) Cadastre seus clientes, 5) Comece a agendar!'
          },
          {
            title: 'Navegação',
            content: 'O menu lateral permite acesso rápido a todas as funcionalidades. No topo, você encontra notificações e seu perfil de usuário.'
          }
        ]
      }
    },
    {
      id: 'agenda',
      icon: Calendar,
      title: 'Agenda',
      content: {
        title: 'Sistema de Agendamentos',
        description: 'Aprenda a gerenciar agendamentos de forma eficiente',
        topics: [
          {
            title: 'Criar Agendamento',
            content: 'Clique no horário desejado na agenda. Selecione cliente, serviço e profissional. Adicione observações se necessário. Confirme o agendamento. O sistema envia notificação automática ao cliente.'
          },
          {
            title: 'Editar Agendamento',
            content: 'Clique no agendamento existente. Modifique as informações necessárias. Salve as alterações. O cliente receberá notificação da mudança.'
          },
          {
            title: 'Cancelar Agendamento',
            content: 'Clique no agendamento. Selecione "Cancelar". Escolha o motivo do cancelamento. Confirme. O horário volta a ficar disponível.'
          },
          {
            title: 'Bloquear Horários',
            content: 'Útil para almoço, reuniões ou folgas. Clique no horário e selecione "Bloquear". O horário fica indisponível para agendamentos.'
          },
          {
            title: 'Visualizações',
            content: 'Dia: Visualização detalhada do dia. Semana: Visão geral da semana. Mês: Planejamento mensal. Por Profissional: Agenda individual de cada profissional.'
          }
        ]
      }
    },
    {
      id: 'clientes',
      icon: Users,
      title: 'Clientes',
      content: {
        title: 'Gestão de Clientes',
        description: 'Cadastro e acompanhamento completo',
        topics: [
          {
            title: 'Cadastrar Cliente',
            content: 'Vá em Clientes > Adicionar Cliente. Preencha: Nome completo, Telefone (obrigatório), Email (para notificações), Data de nascimento, Endereço (opcional).'
          },
          {
            title: 'Ficha do Cliente',
            content: 'Acesse clicando no cliente. Veja: Dados cadastrais, Histórico completo de agendamentos, Observações importantes, Total gasto, Última visita.'
          },
          {
            title: 'Editar Informações',
            content: 'Na ficha do cliente, clique em "Editar". Atualize as informações necessárias. Salve as alterações.'
          },
          {
            title: 'Buscar Clientes',
            content: 'Use a barra de busca no topo da tela de clientes. Busque por: Nome, Telefone, Email. Os resultados aparecem instantaneamente.'
          }
        ]
      }
    },
    {
      id: 'financeiro',
      icon: DollarSign,
      title: 'Financeiro',
      content: {
        title: 'Controle Financeiro',
        description: 'Gerencie receitas, despesas e comissões',
        topics: [
          {
            title: 'Receitas',
            content: 'Receitas são geradas automaticamente ao confirmar agendamentos como realizados. Você também pode adicionar vendas avulsas de produtos ou outros serviços.'
          },
          {
            title: 'Despesas',
            content: 'Cadastre todas as despesas do salão: Aluguel, Produtos e materiais, Salários, Contas (água, luz, internet), Manutenções. Categorize cada despesa para relatórios melhores.'
          },
          {
            title: 'Comissões',
            content: 'Defina a porcentagem de comissão de cada profissional em seu cadastro. O sistema calcula automaticamente com base nos serviços realizados. Veja o relatório de comissões no menu Financeiro.'
          },
          {
            title: 'Fluxo de Caixa',
            content: 'Acompanhe entradas e saídas diariamente. Visualize saldo atual e projeções. Exporte relatórios por período.'
          },
          {
            title: 'Formas de Pagamento',
            content: 'Registre como cada venda foi paga: Dinheiro, Cartão de débito, Cartão de crédito, PIX, Outros. Útil para reconciliação bancária.'
          }
        ]
      }
    },
    {
      id: 'relatorios',
      icon: BarChart3,
      title: 'Relatórios',
      content: {
        title: 'Análises e Relatórios',
        description: 'Entenda o desempenho do seu salão',
        topics: [
          {
            title: 'Dashboard',
            content: 'Visão geral com: Faturamento do mês, Agendamentos realizados, Taxa de ocupação, Clientes atendidos, Comparativo com mês anterior.'
          },
          {
            title: 'Serviços Mais Vendidos',
            content: 'Veja quais serviços geram mais receita. Identifique oportunidades. Ajuste preços e estratégias.'
          },
          {
            title: 'Performance de Profissionais',
            content: 'Compare o desempenho de cada profissional: Quantidade de atendimentos, Receita gerada, Avaliação média, Taxa de retorno de clientes.'
          },
          {
            title: 'Relatórios Personalizados',
            content: 'Filtre por: Período específico, Profissional, Serviço, Cliente. Exporte em PDF ou Excel.'
          }
        ]
      }
    },
    {
      id: 'configuracoes',
      icon: Settings,
      title: 'Configurações',
      content: {
        title: 'Configurações do Sistema',
        description: 'Personalize o SalãoPro para seu salão',
        topics: [
          {
            title: 'Dados do Salão',
            content: 'Configure: Nome do salão, Endereço completo, Telefone e email de contato, Logo (aparece em notificações), Horário de funcionamento.'
          },
          {
            title: 'Profissionais',
            content: 'Adicione e gerencie profissionais: Nome, Especialidades, Porcentagem de comissão, Horários de trabalho, Dias de folga.'
          },
          {
            title: 'Serviços',
            content: 'Cadastre todos os serviços oferecidos: Nome do serviço, Duração, Preço, Categoria, Profissionais habilitados.'
          },
          {
            title: 'Notificações',
            content: 'Configure mensagens automáticas: Confirmação de agendamento, Lembrete (1 dia antes), Agradecimento (após atendimento), Aniversário. Personalize o texto de cada mensagem.'
          },
          {
            title: 'Agendamento Online',
            content: 'Ative o sistema de agendamento online. Copie seu link exclusivo. Compartilhe nas redes sociais. Clientes podem agendar 24/7.'
          }
        ]
      }
    }
  ];

  const activeContent = sections.find(s => s.id === activeSection)?.content;

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText size={40} />
            <h1 className="text-4xl font-bold">Documentação</h1>
          </div>
          <p className="text-xl text-purple-100">
            Guias completos para usar todos os recursos do SalãoPro
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Navegação
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-purple-50 text-purple-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-medium">{section.title}</span>
                      {activeSection === section.id && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeContent?.title}
              </h2>
              <p className="text-gray-600 mb-8">
                {activeContent?.description}
              </p>

              <div className="space-y-8">
                {activeContent?.topics.map((topic, index) => (
                  <div key={index} className="border-l-4 border-purple-600 pl-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {topic.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {topic.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                  }
                }}
                disabled={sections.findIndex(s => s.id === activeSection) === 0}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>

              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1].id);
                  }
                }}
                disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;