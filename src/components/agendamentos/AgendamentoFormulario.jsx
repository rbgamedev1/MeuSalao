// src/components/agendamentos/AgendamentoFormulario.jsx - ATUALIZADO COM SCROLL

import { Phone, Mail, Check } from 'lucide-react';
import { useContext, useMemo } from 'react';
import MaskedInput from '../MaskedInput';
import { formatarDuracao, obterHorariosDisponiveisComDuracao } from '../../utils/agendamentoUtils';
import { generateTimeOptions } from '../../utils/masks';
import { SalaoContext } from '../../contexts/SalaoContext';

const AgendamentoFormulario = ({
  formData,
  handleChange,
  handleSubmit,
  editingId,
  clientesSalao,
  servicosSalao,
  profissionaisDisponiveis,
  clienteSelecionado,
  servicoSelecionado,
  onClose
}) => {
  const { agendamentos, servicos } = useContext(SalaoContext);
  
  const timeOptions = generateTimeOptions();

  // Calcular horários disponíveis com validação de duração
  const horariosDisponiveis = useMemo(() => {
    if (!formData.profissionalId || !formData.data || !servicoSelecionado) {
      return timeOptions.map(time => ({ time, disponivel: true }));
    }

    const resultado = obterHorariosDisponiveisComDuracao(
      timeOptions,
      agendamentos,
      servicos,
      parseInt(formData.profissionalId),
      formData.data,
      servicoSelecionado.duracao,
      editingId
    );

    return resultado.map(r => ({ time: r.horario, disponivel: r.disponivel }));
  }, [formData.profissionalId, formData.data, agendamentos, servicos, servicoSelecionado, timeOptions, editingId]);

  const horariosOcupados = horariosDisponiveis.filter(h => !h.disponivel).length;

  return (
    <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
      {/* Cliente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cliente *
        </label>
        {clientesSalao.length > 0 ? (
          <select
            name="clienteId"
            value={formData.clienteId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione um cliente</option>
            {clientesSalao.filter(c => c.status === 'ativo').map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} - {cliente.telefone}
              </option>
            ))}
          </select>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Nenhum cliente cadastrado neste salão. Cadastre clientes primeiro.
            </p>
          </div>
        )}
      </div>

      {/* Informações do Cliente */}
      {clienteSelecionado && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm font-medium text-purple-900 mb-2">Informações do Cliente:</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
            <div>
              <span className="font-medium">Telefone:</span> {clienteSelecionado.telefone}
            </div>
            <div>
              <span className="font-medium">Email:</span> {clienteSelecionado.email}
            </div>
            <div>
              <span className="font-medium">Última Visita:</span> {clienteSelecionado.ultimaVisita}
            </div>
            <div>
              <span className="font-medium">Total de Visitas:</span> {clienteSelecionado.visitas}
            </div>
          </div>
        </div>
      )}

      {/* Serviço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Serviço *
        </label>
        {servicosSalao.length > 0 ? (
          <select
            name="servicoId"
            value={formData.servicoId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione um serviço</option>
            {servicosSalao.filter(s => s.ativo).map(servico => (
              <option key={servico.id} value={servico.id}>
                {servico.nome} - R$ {servico.valor.toFixed(2)} ({formatarDuracao(servico.duracao)})
              </option>
            ))}
          </select>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Nenhum serviço cadastrado neste salão. Cadastre serviços primeiro.
            </p>
          </div>
        )}
      </div>

      {/* Informações do Serviço */}
      {servicoSelecionado && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-900 mb-2">Detalhes do Serviço:</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
            <div>
              <span className="font-medium">Categoria:</span> {servicoSelecionado.categoria}
            </div>
            <div>
              <span className="font-medium">Duração:</span> {formatarDuracao(servicoSelecionado.duracao)}
            </div>
            <div>
              <span className="font-medium">Valor:</span> R$ {servicoSelecionado.valor.toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Comissão:</span> {servicoSelecionado.comissao}%
            </div>
          </div>
        </div>
      )}

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
          disabled={!formData.servicoId || profissionaisDisponiveis.length === 0}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {!formData.servicoId 
              ? 'Selecione um serviço primeiro'
              : profissionaisDisponiveis.length === 0
              ? 'Nenhum profissional habilitado'
              : 'Selecione um profissional'}
          </option>
          {profissionaisDisponiveis.map(prof => (
            <option key={prof.id} value={prof.id}>
              {prof.nome}
            </option>
          ))}
        </select>
        {formData.servicoId && profissionaisDisponiveis.length === 0 && (
          <p className="text-xs text-red-500 mt-1">
            Nenhum profissional habilitado para este serviço
          </p>
        )}
      </div>

      {/* Data e Horário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data *
          </label>
          <MaskedInput
            mask="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
            placeholder="DD/MM/AAAA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário *
            {formData.profissionalId && formData.data && horariosOcupados > 0 && (
              <span className="text-xs text-red-500 ml-2">
                ({horariosOcupados} horário(s) ocupado(s))
              </span>
            )}
          </label>
          <select
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione um horário</option>
            {horariosDisponiveis.map(({ time, disponivel }) => (
              <option 
                key={time} 
                value={time}
                disabled={!disponivel}
                style={{
                  color: disponivel ? 'inherit' : '#9CA3AF',
                  textDecoration: disponivel ? 'none' : 'line-through'
                }}
              >
                {time} {!disponivel ? '(Ocupado)' : ''}
              </option>
            ))}
          </select>
          {formData.profissionalId && formData.data && servicoSelecionado && (
            <p className="text-xs text-gray-500 mt-1">
              ⏰ Horários ocupados consideram a duração do serviço ({servicoSelecionado.duracao}min)
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Notificações */}
      {clienteSelecionado?.email && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="notificarCliente"
              checked={formData.notificarCliente || false}
              onChange={(e) => handleChange({ 
                target: { 
                  name: 'notificarCliente', 
                  value: e.target.checked 
                }
              })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <div>
              <span className="text-sm font-medium text-blue-900">
                Enviar notificação por email
              </span>
              <p className="text-xs text-blue-700 mt-1">
                {formData.status === 'cancelado' 
                  ? 'Cliente receberá email de cancelamento'
                  : 'Cliente receberá email de confirmação/alteração'}
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Alerta se horário estiver ocupado */}
      {formData.horario && formData.profissionalId && formData.data && (
        (() => {
          const horarioInfo = horariosDisponiveis.find(h => h.time === formData.horario);
          if (horarioInfo && !horarioInfo.disponivel) {
            return (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900">
                  ⚠️ Atenção: Este horário está ocupado!
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Não há tempo suficiente para completar este serviço ({servicoSelecionado?.duracao}min) sem conflitar com outro agendamento.
                </p>
              </div>
            );
          }
          return null;
        })()
      )}

      {/* Botões - fixos no final */}
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
          disabled={clientesSalao.length === 0 || servicosSalao.length === 0}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {editingId ? 'Salvar Alterações' : 'Criar Agendamento'}
        </button>
      </div>
    </div>
  );
};

export default AgendamentoFormulario;