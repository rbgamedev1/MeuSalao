// src/components/agendaOnline/AgendaSucesso.jsx

import { CheckCircle } from 'lucide-react';

const AgendaSucesso = ({ formData, servicos, profissionais, salao, onNovoAgendamento }) => {
  const servicoSelecionado = servicos.find(s => s.id === parseInt(formData.servicoId));
  const profissionalSelecionado = profissionais.find(p => p.id === parseInt(formData.profissionalId));

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
            <p><strong>Duração:</strong> {servicoSelecionado?.duracao} minutos</p>
            <p><strong>Profissional:</strong> {profissionalSelecionado?.nome}</p>
            <p><strong>Local:</strong> {salao.endereco}</p>
            <p><strong>Telefone:</strong> {salao.telefone}</p>
          </div>
        </div>

        <button
          onClick={onNovoAgendamento}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
        >
          Fazer Novo Agendamento
        </button>
      </div>
    </div>
  );
};

export default AgendaSucesso;