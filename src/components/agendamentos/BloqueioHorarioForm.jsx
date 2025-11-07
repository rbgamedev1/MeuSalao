import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import MaskedInput from '../MaskedInput';
import { generateTimeOptions } from '../../utils/masks';

const BloqueioHorarioForm = ({ 
  profissionais,
  onSubmit,
  onClose 
}) => {
  const [formData, setFormData] = useState({
    profissionalId: '',
    data: '',
    horarioInicio: '',
    horarioFim: '',
    motivo: '',
    recorrente: false,
    diasSemana: []
  });

  const timeOptions = generateTimeOptions();
  const diasSemanaOpcoes = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDiaSemanaToggle = (dia) => {
    setFormData(prev => ({
      ...prev,
      diasSemana: prev.diasSemana.includes(dia)
        ? prev.diasSemana.filter(d => d !== dia)
        : [...prev.diasSemana, dia]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar horário fim maior que início
    if (formData.horarioInicio && formData.horarioFim) {
      const [hInicio, mInicio] = formData.horarioInicio.split(':').map(Number);
      const [hFim, mFim] = formData.horarioFim.split(':').map(Number);
      const inicioMin = hInicio * 60 + mInicio;
      const fimMin = hFim * 60 + mFim;
      
      if (fimMin <= inicioMin) {
        alert('⚠️ Horário de término deve ser maior que o horário de início!');
        return;
      }
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
      {/* Alerta informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Sobre o bloqueio de horários:</p>
            <p>Horários bloqueados não estarão disponíveis para agendamento online e aparecerão marcados na agenda. O período entre início e fim será completamente bloqueado.</p>
          </div>
        </div>
      </div>

      {/* Profissional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profissional *
        </label>
        <select
          name="profissionalId"
          value={formData.profissionalId}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Selecione um profissional</option>
          {profissionais.map(prof => (
            <option key={prof.id} value={prof.id}>
              {prof.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Recorrente */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          name="recorrente"
          checked={formData.recorrente}
          onChange={handleChange}
          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label className="text-sm font-medium text-gray-700">
          Bloqueio recorrente (repetir semanalmente)
        </label>
      </div>

      {/* Data única OU Dias da semana */}
      {!formData.recorrente ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data *
          </label>
          <MaskedInput
            mask="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required={!formData.recorrente}
            placeholder="DD/MM/AAAA"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Dias da Semana *
          </label>
          <div className="grid grid-cols-7 gap-2">
            {diasSemanaOpcoes.map(dia => (
              <button
                key={dia.value}
                type="button"
                onClick={() => handleDiaSemanaToggle(dia.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  formData.diasSemana.includes(dia.value)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dia.label.substring(0, 3)}
              </button>
            ))}
          </div>
          {formData.recorrente && formData.diasSemana.length === 0 && (
            <p className="text-xs text-red-500 mt-2">
              Selecione pelo menos um dia da semana
            </p>
          )}
        </div>
      )}

      {/* Horários */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário Início *
          </label>
          <select
            name="horarioInicio"
            value={formData.horarioInicio}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário Fim *
          </label>
          <select
            name="horarioFim"
            value={formData.horarioFim}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerta de validação */}
      {formData.horarioInicio && formData.horarioFim && (
        (() => {
          const [hInicio, mInicio] = formData.horarioInicio.split(':').map(Number);
          const [hFim, mFim] = formData.horarioFim.split(':').map(Number);
          const inicioMin = hInicio * 60 + mInicio;
          const fimMin = hFim * 60 + mFim;
          const duracao = fimMin - inicioMin;
          
          if (duracao <= 0) {
            return (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  ⚠️ Horário de término deve ser maior que o horário de início!
                </p>
              </div>
            );
          }
          
          return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✅ Período de {duracao} minutos será bloqueado ({Math.floor(duracao / 30)} slots de 30min)
              </p>
            </div>
          );
        })()
      )}

      {/* Motivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motivo do Bloqueio *
        </label>
        <textarea
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          required
          rows="3"
          placeholder="Ex: Almoço, Reunião, Folga, etc."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Resumo do bloqueio */}
      {formData.profissionalId && (formData.data || formData.diasSemana.length > 0) && formData.horarioInicio && formData.horarioFim && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lock className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-purple-800">
              <p className="font-medium mb-1">Resumo do bloqueio:</p>
              <p>
                <strong>{profissionais.find(p => p.id === parseInt(formData.profissionalId))?.nome}</strong>
                {' - '}
                {formData.recorrente ? (
                  <>
                    Todas as {formData.diasSemana.map(d => diasSemanaOpcoes[d].label).join(', ')}
                  </>
                ) : (
                  formData.data
                )}
                {' de '}
                <strong>{formData.horarioInicio}</strong>
                {' às '}
                <strong>{formData.horarioFim}</strong>
              </p>
              <p className="mt-1 text-xs">
                Todos os horários neste período estarão indisponíveis para agendamento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Bloquear Horário
        </button>
      </div>
    </form>
  );
};

export default BloqueioHorarioForm;