// src/components/megaHair/FormularioFinalizacaoMegaHair.jsx
import { Camera } from 'lucide-react';
import ImageUploader from '../clientes/ImageUploader';
import MaskedInput from '../MaskedInput';

const FormularioFinalizacaoMegaHair = ({ formData, onChange, onImagensChange }) => {
  return (
    <div className="space-y-6">
      {/* Dados da Sessão */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-4">Dados da Sessão</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Cliente *
            </label>
            <input
              type="text"
              name="nomeCliente"
              value={formData.nomeCliente || ''}
              onChange={onChange}
              placeholder="Nome completo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Finalização *
            </label>
            <MaskedInput
              mask="date"
              name="dataFinalizacao"
              value={formData.dataFinalizacao || ''}
              onChange={onChange}
              placeholder="DD/MM/AAAA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profissional Responsável *
            </label>
            <input
              type="text"
              name="profissionalResponsavel"
              value={formData.profissionalResponsavel || ''}
              onChange={onChange}
              placeholder="Nome do profissional"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Avaliação Pós-Procedimento */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Avaliação Pós-Procedimento</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado Visual das Extensões Após a Aplicação *
            </label>
            <textarea
              name="estadoExtensoes"
              value={formData.estadoExtensoes || ''}
              onChange={onChange}
              rows="3"
              placeholder="Descreva: alinhamento, volume, naturalidade..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição do Couro Cabeludo *
            </label>
            <div className="flex space-x-4">
              {['Normal', 'Sensível', 'Irritado'].map(condicao => (
                <label key={condicao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condicaoCouroCabeludo"
                    value={condicao}
                    checked={formData.condicaoCouroCabeludo === condicao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{condicao}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente Satisfeita com o Resultado Imediato? *
            </label>
            <div className="flex space-x-4">
              {['Sim', 'Não'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="clienteSatisfeita"
                    value={opcao}
                    checked={formData.clienteSatisfeita === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentário do Cliente sobre o Resultado
            </label>
            <textarea
              name="comentarioCliente"
              value={formData.comentarioCliente || ''}
              onChange={onChange}
              rows="3"
              placeholder="Feedback da cliente..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Recomendações para Cuidados e Manutenção */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4">Recomendações para Cuidados e Manutenção</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência Recomendada para Lavagem *
            </label>
            <select
              name="frequenciaLavagem"
              value={formData.frequenciaLavagem || ''}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione...</option>
              <option value="Diariamente">Diariamente</option>
              <option value="Dia sim, dia não">Dia sim, dia não</option>
              <option value="2-3x por semana">2-3x por semana</option>
              <option value="1x por semana">1x por semana</option>
              <option value="Conforme necessidade">Conforme necessidade</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produtos Indicados para Uso Domiciliar *
            </label>
            <textarea
              name="produtosIndicados"
              value={formData.produtosIndicados || ''}
              onChange={onChange}
              rows="3"
              placeholder="Ex: shampoo sem sulfato, condicionador hidratante, leave-in..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Procedimentos Proibidos/Evitados *
            </label>
            <textarea
              name="procedimentosProibidos"
              value={formData.procedimentosProibidos || ''}
              onChange={onChange}
              rows="3"
              placeholder="Ex: uso excessivo de calor, químicas agressivas, dormir com cabelo molhado..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientações sobre Escovação e Desembaraço
            </label>
            <textarea
              name="orientacoesEscovacao"
              value={formData.orientacoesEscovacao || ''}
              onChange={onChange}
              rows="3"
              placeholder="Como escovar, pentear, desembaraçar corretamente..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indicação de Manutenção e Revisões *
            </label>
            <textarea
              name="indicacaoManutencao"
              value={formData.indicacaoManutencao || ''}
              onChange={onChange}
              rows="3"
              placeholder="Tempo ideal entre manutenções, cuidados para evitar desgaste..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Cuidados Específicos */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">Cuidados Específicos</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuidados Pós-Aplicação nas Primeiras 48h *
            </label>
            <textarea
              name="cuidados48h"
              value={formData.cuidados48h || ''}
              onChange={onChange}
              rows="3"
              placeholder="Orientações específicas para as primeiras 48 horas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Como Proceder em Caso de Irritações ou Desconfortos
            </label>
            <textarea
              name="procedimentoIrritacoes"
              value={formData.procedimentoIrritacoes || ''}
              onChange={onChange}
              rows="2"
              placeholder="O que fazer se houver irritação, coceira ou desconforto..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuidados para Prolongar a Duração do Mega Hair
            </label>
            <textarea
              name="cuidadosProlongar"
              value={formData.cuidadosProlongar || ''}
              onChange={onChange}
              rows="3"
              placeholder="Dicas para aumentar a durabilidade das extensões..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Agendamento e Próximos Passos */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-4">Agendamento e Próximos Passos</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Prevista para Manutenção
            </label>
            <MaskedInput
              mask="date"
              name="dataManutencao"
              value={formData.dataManutencao || ''}
              onChange={onChange}
              placeholder="DD/MM/AAAA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações sobre Possibilidade de Ajustes Futuros ou Troca de Materiais
            </label>
            <textarea
              name="observacoesAjustes"
              value={formData.observacoesAjustes || ''}
              onChange={onChange}
              rows="2"
              placeholder="Possíveis ajustes, trocas ou modificações futuras..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Próximos Tratamentos Sugeridos
            </label>
            <textarea
              name="proximosTratamentos"
              value={formData.proximosTratamentos || ''}
              onChange={onChange}
              rows="2"
              placeholder="Ex: hidratação, nutrição, reconstrução para o cabelo natural..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Observações Adicionais */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Observações Adicionais</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anotações do Profissional sobre o Atendimento
            </label>
            <textarea
              name="anotacoesProfissional"
              value={formData.anotacoesProfissional || ''}
              onChange={onChange}
              rows="3"
              placeholder="Observações importantes, particularidades do atendimento..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dúvidas ou Solicitações do Cliente
            </label>
            <textarea
              name="duvidasCliente"
              value={formData.duvidasCliente || ''}
              onChange={onChange}
              rows="2"
              placeholder="Perguntas, dúvidas ou solicitações da cliente..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Imagens Finais */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-purple-600" />
          Imagens do Resultado Final
        </h3>
        <ImageUploader
          images={formData.imagensFinais || []}
          onImagesChange={(imgs) => onImagensChange('imagensFinais', imgs)}
          maxImages={8}
          label="📸 Fotos do resultado final (várias angulações)"
          categoria="mega-hair-finalizacao"
        />
      </div>

      {/* Assinaturas */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Assinaturas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data do Documento
            </label>
            <MaskedInput
              mask="date"
              name="dataDocumento"
              value={formData.dataDocumento || ''}
              onChange={onChange}
              placeholder="DD/MM/AAAA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário
            </label>
            <input
              type="time"
              name="horarioDocumento"
              value={formData.horarioDocumento || ''}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            ℹ️ <strong>Observação:</strong> Este documento digital substitui as assinaturas físicas. 
            O registro completo fica armazenado no sistema com data, hora e identificação do profissional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormularioFinalizacaoMegaHair;