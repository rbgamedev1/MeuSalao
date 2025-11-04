// src/components/agendaOnline/AgendaStepDataHora.jsx - COM ATUALIZAÇÃO VISUAL EM TEMPO REAL

import { Calendar, RefreshCw } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { maskDate } from '../../utils/masks';
import { 
  gerarHorariosDisponiveis, 
  obterHorariosDisponiveisComDuracao 
} from '../../utils/agendamentoUtils';

const AgendaStepDataHora = ({ formData, errors, servicos, profissionais, agendamentos, onChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const servicoSelecionado = useMemo(() => 
    servicos.find(s => s.id === parseInt(formData.servicoId)),
    [servicos, formData.servicoId]
  );

  const profissionaisFiltrados = useMemo(() => {
    if (!servicoSelecionado) return [];
    return profissionais.filter(p => 
      servicoSelecionado.profissionaisHabilitados?.includes(p.id)
    );
  }, [servicoSelecionado, profissionais]);

  // ✨ NOVO: Monitorar mudanças nos agendamentos
  useEffect(() => {
    if (formData.profissionalId && formData.data) {
      setIsUpdating(true);
      setLastUpdate(new Date());
      
      // Animação de atualização
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [agendamentos.length, formData.profissionalId, formData.data]);

  // Calcular horários disponíveis considerando DURAÇÃO do serviço
  const horariosDisponiveis = useMemo(() => {
    if (!formData.profissionalId || !formData.data || !servicoSelecionado) {
      const todosHorarios = gerarHorariosDisponiveis('08:00', '20:00', 30);
      return todosHorarios.map(time => ({ time, disponivel: true }));
    }

    const todosHorarios = gerarHorariosDisponiveis('08:00', '20:00', 30);
    
    // IMPORTANTE: Usar função que considera duração do serviço
    const resultado = obterHorariosDisponiveisComDuracao(
      todosHorarios,
      agendamentos,
      servicos,
      parseInt(formData.profissionalId),
      formData.data,
      servicoSelecionado.duracao
    );

    return resultado.map(r => ({ time: r.horario, disponivel: r.disponivel }));
  }, [formData.profissionalId, formData.data, agendamentos, servicos, servicoSelecionado]);

  const horariosOcupados = horariosDisponiveis.filter(h => !h.disponivel).length;
  const horariosDisponiveis_ = horariosDisponiveis.filter(h => h.disponivel).length;

  const handleDateChange = (e) => {
    const masked = maskDate(e.target.value);
    onChange({ target: { name: 'data', value: masked } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Data, Hora e Profissional
      </h2>

      {/* Mostrar serviço selecionado */}
      {servicoSelecionado && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-purple-900 font-medium">
            Serviço Selecionado:
          </p>
          <p className="text-lg font-bold text-purple-900">
            {servicoSelecionado.nome}
          </p>
          <p className="text-sm text-purple-700 mt-1">
            ⏱️ Duração: {servicoSelecionado.duracao} minutos
          </p>
          <p className="text-xs text-purple-600 mt-2">
            💡 Os horários disponíveis já consideram o tempo necessário para este serviço
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profissional *
        </label>
        <select
          name="profissionalId"
          value={formData.profissionalId}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Selecione um profissional</option>
          {profissionaisFiltrados.map(prof => (
            <option key={prof.id} value={prof.id}>
              {prof.nome}
            </option>
          ))}
        </select>
        {errors.profissionalId && <p className="text-red-500 text-xs mt-1">{errors.profissionalId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="data"
            value={formData.data}
            onChange={handleDateChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="DD/MM/AAAA"
          />
        </div>
        {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data}</p>}
      </div>

      {formData.profissionalId && formData.data && servicoSelecionado && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Horário Disponível *
              {horariosOcupados > 0 && (
                <span className="text-xs text-red-500 ml-2">
                  ({horariosOcupados} ocupado(s) • {horariosDisponiveis_} disponível(eis))
                </span>
              )}
            </label>
            
            {/* ✨ NOVO: Indicador de atualização em tempo real */}
            {isUpdating && (
              <div className="flex items-center text-xs text-green-600 animate-pulse">
                <RefreshCw size={12} className="mr-1 animate-spin" />
                <span>Atualizando...</span>
              </div>
            )}
            
            {!isUpdating && (
              <div className="flex items-center text-xs text-gray-500">
                <span>Atualizado {lastUpdate.toLocaleTimeString('pt-BR')}</span>
              </div>
            )}
          </div>

          <div className={`grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg transition-all ${
            isUpdating ? 'opacity-50' : 'opacity-100'
          }`}>
            {horariosDisponiveis.map(({ time, disponivel }) => (
              <button
                key={time}
                type="button"
                onClick={() => disponivel && onChange({ target: { name: 'horario', value: time } })}
                disabled={!disponivel}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.horario === time
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : disponivel
                    ? 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through opacity-50'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {errors.horario && <p className="text-red-500 text-xs mt-1">{errors.horario}</p>}
          
          {/* ✨ NOVO: Informações sobre atualização em tempo real */}
          <div className="mt-3 space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                ⏰ <strong>Horários riscados</strong> estão ocupados ou não têm tempo suficiente para completar seu serviço ({servicoSelecionado.duracao} min)
              </p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800">
                🔄 <strong>Atualização automática:</strong> Os horários são atualizados automaticamente quando outros clientes fazem agendamentos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta se horário estiver ocupado */}
      {formData.horario && formData.profissionalId && formData.data && (
        (() => {
          const horarioInfo = horariosDisponiveis.find(h => h.time === formData.horario);
          if (horarioInfo && !horarioInfo.disponivel) {
            return (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                <p className="text-sm font-medium text-red-900">
                  ⚠️ Atenção: Este horário não está mais disponível!
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Outro cliente acabou de fazer um agendamento. Escolha outro horário disponível para continuar.
                </p>
              </div>
            );
          }
          return null;
        })()
      )}
    </div>
  );
};

export default AgendaStepDataHora;