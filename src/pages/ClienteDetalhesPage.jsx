// src/pages/ClienteDetalhesPage.jsx - CORRIGIDO (Header unificado)
import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SalaoContext } from '../contexts/SalaoContext';
import { useClienteData } from '../hooks/useClienteData';
import ClienteHeader from '../components/clientes/detalhes/ClienteHeader';
import ClienteStats from '../components/clientes/detalhes/ClienteStats';
import ClienteTabs from '../components/clientes/detalhes/ClienteTabs';
import ClienteInfoTab from '../components/clientes/detalhes/ClienteInfoTab';
import ClienteAgendamentosTab from '../components/clientes/detalhes/ClienteAgendamentosTab';
import ClienteCaixaTab from '../components/clientes/detalhes/ClienteCaixaTab';
import ClienteEmailsTab from '../components/clientes/detalhes/ClienteEmailsTab';
import ProntuarioTab from '../components/clientes/ProntuarioTab';

const ClienteDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('info');
  
  const { 
    clientes, 
    setClientes,
    salaoAtual, 
    prontuarios, 
    setProntuarios, 
    getProdutosPorSalao,
    servicos,
    profissionais
  } = useContext(SalaoContext);
  
  const produtos = getProdutosPorSalao();
  const cliente = clientes.find(c => c.id === parseInt(id));

  // Hook customizado para dados do cliente
  const {
    agendamentosCliente,
    comprasCliente,
    emailsCliente,
    stats
  } = useClienteData(cliente);

  // Função para atualizar cliente
  const handleUpdateCliente = (clienteId, dadosAtualizados) => {
    setClientes(clientes.map(c => 
      c.id === clienteId ? { ...c, ...dadosAtualizados } : c
    ));
  };

  // Handlers de prontuário
  const handleAddProntuario = (dadosProntuario) => {
    const novoProntuario = {
      ...dadosProntuario,
      id: Math.max(...prontuarios.map(p => p.id), 0) + 1,
      salaoId: salaoAtual.id
    };
    setProntuarios([...prontuarios, novoProntuario]);
  };

  const handleEditProntuario = (id, dadosAtualizados) => {
    setProntuarios(prontuarios.map(p => 
      p.id === id ? { ...p, ...dadosAtualizados } : p
    ));
  };

  const handleDeleteProntuario = (id) => {
    setProntuarios(prontuarios.filter(p => p.id !== id));
  };

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Cliente não encontrado</p>
          <button
            onClick={() => navigate('/clientes')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar para Clientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ CORREÇÃO 1: Header unificado sem espaço */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate('/clientes')}
            className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Voltar para Clientes</span>
          </button>

          {/* Foto e Nome do Cliente */}
          <ClienteHeader 
            cliente={cliente} 
            onUpdateCliente={handleUpdateCliente}
          />
        </div>
      </div>

      {/* Estatísticas */}
      <ClienteStats stats={stats} />

      {/* Tabs */}
      <ClienteTabs 
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        counts={{
          agendamentos: agendamentosCliente.length,
          caixa: comprasCliente.length,
          prontuario: prontuarios.filter(p => p.clienteId === cliente.id).length,
          emails: emailsCliente.length
        }}
      />

      {/* Conteúdo das Abas */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {abaAtiva === 'info' && (
          <ClienteInfoTab cliente={cliente} />
        )}

        {abaAtiva === 'agendamentos' && (
          <ClienteAgendamentosTab 
            agendamentos={agendamentosCliente}
            servicos={servicos}
            profissionais={profissionais}
          />
        )}

        {abaAtiva === 'caixa' && (
          <ClienteCaixaTab 
            compras={comprasCliente} 
            stats={stats}
          />
        )}

        {abaAtiva === 'prontuario' && (
          <ProntuarioTab
            clienteId={cliente.id}
            prontuarios={prontuarios}
            produtos={produtos}
            onAddProntuario={handleAddProntuario}
            onEditProntuario={handleEditProntuario}
            onDeleteProntuario={handleDeleteProntuario}
          />
        )}

        {abaAtiva === 'emails' && (
          <ClienteEmailsTab emails={emailsCliente} />
        )}
      </div>
    </div>
  );
};

export default ClienteDetalhesPage;