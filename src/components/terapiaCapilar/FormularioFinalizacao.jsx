// src/components/terapiaCapilar/FormularioFinalizacao.jsx
import { Camera, Star } from 'lucide-react';
import ImageUploader from '../clientes/ImageUploader';
import MaskedInput from '../MaskedInput';

const FormularioFinalizacao = ({ formData, onChange, onImagensChange }) => {
  return (
    <div className="space-y-6">
      {/* Dados da Sessão */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-4">Dados da Sessão</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Horário
            </label>
            <input
              type="time"
              name="horarioFinalizacao"
              value={formData.horarioFinalizacao || ''}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número da Sessão
            </label>
            <input
              type="number"
              name="numeroSessaoFinal"
              value={formData.numeroSessaoFinal || ''}
              onChange={onChange}
              min="1"
              placeholder="Ex: 1, 2, 3..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Condição Final Observada */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Condição Final Observada</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado dos Fios Após o Tratamento *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              {['Brilho', 'Maciez', 'Maleabilidade', 'Hidratação', 'Força', 'Volume'].map(caracteristica => (
                <label key={caracteristica} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.caracteristicasFinais || []).includes(caracteristica)}
                    onChange={() => {
                      const current = formData.caracteristicasFinais || [];
                      const updated = current.includes(caracteristica)
                        ? current.filter(c => c !== caracteristica)
                        : [...current, caracteristica];
                      onChange({ target: { name: 'caracteristicasFinais', value: updated } });
                    }}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{caracteristica}</span>
                </label>
              ))}
            </div>
            <textarea
              name="estadoFiosDetalhes"
              value={formData.estadoFiosDetalhes || ''}
              onChange={onChange}
              rows="2"
              placeholder="Descreva detalhadamente o estado dos fios..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição do Couro Cabeludo
            </label>
            <textarea
              name="condicaoCouroCabeludo"
              value={formData.condicaoCouroCabeludo || ''}
              onChange={onChange}
              rows="2"
              placeholder="Sinais de melhora, sensibilidade, irritações..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avaliação do Cliente sobre o Resultado
            </label>
            <div className="flex items-center space-x-4 mb-2">
              {[1, 2, 3, 4, 5].map(nota => (
                <button
                  key={nota}
                  type="button"
                  onClick={() => onChange({ target: { name: 'avaliacaoCliente', value: nota } })}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={
                      nota <= (formData.avaliacaoCliente || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              name="comentarioCliente"
              value={formData.comentarioCliente || ''}
              onChange={onChange}
              rows="2"
              placeholder="Comentários do cliente sobre o resultado..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Recomendações para Cuidados Domiciliares */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4">Recomendações para Cuidados Domiciliares</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produtos Indicados *
            </label>
            <textarea
              name="produtosIndicados"
              value={formData.produtosIndicados || ''}
              onChange={onChange}
              rows="3"
              placeholder="Liste produtos recomendados para uso em casa..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instruções Específicas
            </label>
            <textarea
              name="instrucoesEspecificas"
              value={formData.instrucoesEspecificas || ''}
              onChange={onChange}
              rows="3"
              placeholder="Como aplicar produtos, frequência de uso, técnicas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuidados Gerais
            </label>
            <textarea
              name="cuidadosGerais"
              value={formData.cuidadosGerais || ''}
              onChange={onChange}
              rows="2"
              placeholder="Evitar calor excessivo, proteção solar, alimentação..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Orientações Gerais */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">Orientações Gerais</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência Recomendada para Lavagem
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
              Tratamentos Complementares em Casa
            </label>
            <textarea
              name="tratamentosComplementares"
              value={formData.tratamentosComplementares || ''}
              onChange={onChange}
              rows="2"
              placeholder="Máscaras, ampolas, tratamentos semanais..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dicas para Couro Cabeludo Saudável
            </label>
            <textarea
              name="dicasCouroCabeludo"
              value={formData.dicasCouroCabeludo || ''}
              onChange={onChange}
              rows="2"
              placeholder="Massagens, esfoliação, hidratação..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hábitos que Favorecem a Saúde Capilar
            </label>
            <textarea
              name="habitosSaudaveis"
              value={formData.habitosSaudaveis || ''}
              onChange={onChange}
              rows="3"
              placeholder="Alimentação balanceada, hidratação, sono adequado, redução de estresse..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Agendamento */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-4">Agendamento da Próxima Sessão</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Próxima Sessão
            </label>
            <MaskedInput
              mask="date"
              name="dataProximaSessao"
              value={formData.dataProximaSessao || ''}
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
              name="horarioProximaSessao"
              value={formData.horarioProximaSessao || ''}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivo da Próxima Sessão
          </label>
          <input
            type="text"
            name="objetivoProximaSessao"
            value={formData.objetivoProximaSessao || ''}
            onChange={onChange}
            placeholder="Ex: Manutenção, intensificação do tratamento..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Observações Adicionais */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Observações Adicionais</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anotações do Profissional
            </label>
            <textarea
              name="anotacoesProfissional"
              value={formData.anotacoesProfissional || ''}
              onChange={onChange}
              rows="3"
              placeholder="Ajustes no tratamento, cuidados especiais, progressão observada..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solicitações ou Dúvidas do Cliente
            </label>
            <textarea
              name="solicitacoesCliente"
              value={formData.solicitacoesCliente || ''}
              onChange={onChange}
              rows="2"
              placeholder="Dúvidas, solicitações especiais, feedbacks..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Imagens Finais */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-purple-600" />
          Imagens Finais do Tratamento
        </h3>
        <ImageUploader
          images={formData.imagensFinais || []}
          onImagesChange={(imgs) => onImagensChange('imagensFinais', imgs)}
          maxImages={6}
          label="📸 Resultado Final - Antes/Depois"
          categoria="finalizacao"
        />
      </div>
    </div>
  );
};

export default FormularioFinalizacao;