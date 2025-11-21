// src/components/clientes/detalhes/ClienteAgendamentosTab.jsx - CORRIGIDO
import { Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, Scissors } from 'lucide-react';

const ClienteAgendamentosTab = ({ agendamentos, servicos = [], profissionais = [] }) => {
  const getStatusIcon = (status) => {
    const icons = {
      confirmado: <CheckCircle size={16} className="text-green-600" />,
      concluido: <CheckCircle size={16} className="text-blue-600" />,
      cancelado: <XCircle size={16} className="text-red-600" />,
      pendente: <AlertCircle size={16} className="text-yellow-600" />
    };
    return icons[status] || <Clock size={16} className="text-gray-600" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmado: 'bg-green-100 text-green-800 border-green-300',
      concluido: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300',
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // ✅ CORREÇÃO: Função para buscar serviço corretamente
  const getServico = (agendamento) => {
    // Se o agendamento já tem o objeto servico completo
    if (agendamento.servico && typeof agendamento.servico === 'object') {
      return agendamento.servico;
    }
    
    // Se tem servicoId, buscar na lista
    if (agendamento.servicoId && servicos.length > 0) {
      const servicoEncontrado = servicos.find(s => s.id === agendamento.servicoId);
      if (servicoEncontrado) return servicoEncontrado;
    }
    
    // Fallback: retornar objeto com nome padrão
    return {
      nome: agendamento.servicoNome || 'Serviço',
      valor: agendamento.valor || 0,
      duracao: agendamento.duracao || 0
    };
  };

  // ✅ CORREÇÃO: Função para buscar profissional
  const getProfissional = (agendamento) => {
    // Se o agendamento já tem o objeto profissional completo
    if (agendamento.profissional && typeof agendamento.profissional === 'object') {
      return agendamento.profissional;
    }
    
    // Se tem profissionalId, buscar na lista
    if (agendamento.profissionalId && profissionais.length > 0) {
      const profissionalEncontrado = profissionais.find(p => p.id === agendamento.profissionalId);
      if (profissionalEncontrado) return profissionalEncontrado;
    }
    
    // Fallback
    return {
      nome: agendamento.profissionalNome || 'Profissional'
    };
  };

  if (agendamentos.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
        <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Nenhum agendamento encontrado para este cliente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {agendamentos.map((ag) => {
        const servico = getServico(ag);
        const profissional = getProfissional(ag);
        
        return (
          <div key={ag.id} className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(ag.status)}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ag.status)}`}>
                    {ag.status.charAt(0).toUpperCase() + ag.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Scissors size={18} className="text-purple-600" />
                  <h5 className="font-semibold text-gray-800">{servico.nome}</h5>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{ag.data} às {ag.horario}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User size={14} className="text-gray-400" />
                    <span>{profissional.nome}</span>
                  </div>
                  {servico.duracao && (
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-gray-400" />
                      <span>{servico.duracao} min</span>
                    </div>
                  )}
                  {servico.valor && (
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-green-600">R$ {servico.valor.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClienteAgendamentosTab;