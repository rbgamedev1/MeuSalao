// src/components/agendaOnline/AgendaStepServico.jsx

import { Scissors, Clock, ArrowLeft } from 'lucide-react';

const AgendaStepServico = ({ formData, errors, servicos, onChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Escolha o Serviço
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicos.map(servico => (
          <button
            key={servico.id}
            onClick={() => {
              onChange({ target: { name: 'servicoId', value: servico.id.toString() } });
              // Resetar profissional quando mudar serviço
              onChange({ target: { name: 'profissionalId', value: '' } });
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
              <span className="text-gray-600 flex items-center">
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
  );
};

export default AgendaStepServico;