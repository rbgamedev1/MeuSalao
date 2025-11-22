// src/components/megaHair/FormularioConfeccaoMegaHair.jsx
import { Camera, Scissors, CheckCircle } from 'lucide-react';
import ImageUploader from '../clientes/ImageUploader';
import MaskedInput from '../MaskedInput';

const FormularioConfeccaoMegaHair = ({ formData, onChange, onImagensChange }) => {
  return (
    <div className="space-y-6">
      {/* Identificação */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-4">Identificação</h3>
        
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
              Data da Confecção/Aplicação *
            </label>
            <MaskedInput
              mask="date"
              name="dataConfeccaoAplicacao"
              value={formData.dataConfeccaoAplicacao || ''}
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

      {/* Confecção do Material */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
          <Scissors size={18} className="mr-2" />
          Confecção do Material
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Mega Hair Confeccionado *
            </label>
            <input
              type="text"
              name="tipoMegaHair"
              value={formData.tipoMegaHair || ''}
              onChange={onChange}
              placeholder="Ex: Cabelo natural, fibra sintética, misto..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade de Mechas Confeccionadas *
              </label>
              <input
                type="text"
                name="quantidadeMechas"
                value={formData.quantidadeMechas || ''}
                onChange={onChange}
                placeholder="Ex: 50 mechas, 100 mechas..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho das Mechas Confeccionadas
              </label>
              <input
                type="text"
                name="tamanhoMechas"
                value={formData.tamanhoMechas || ''}
                onChange={onChange}
                placeholder="Ex: 50cm, 60cm, 70cm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações sobre a Confecção
            </label>
            <textarea
              name="observacoesConfeccao"
              value={formData.observacoesConfeccao || ''}
              onChange={onChange}
              rows="3"
              placeholder="Detalhes do processo, particularidades, ajustes realizados..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Imagens da Confecção */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-blue-600" />
          Imagens do Material Confeccionado
        </h3>
        <ImageUploader
          images={formData.imagensConfeccao || []}
          onImagesChange={(imgs) => onImagensChange('imagensConfeccao', imgs)}
          maxImages={6}
          label="📸 Fotos do material confeccionado"
          categoria="mega-hair-confeccao"
        />
      </div>

      {/* Aprovação do Cliente */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4 flex items-center">
          <CheckCircle size={18} className="mr-2" />
          Aprovação do Cliente
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              O cliente aprovou o produto antes da aplicação? *
            </label>
            <div className="flex space-x-4">
              {['Sim', 'Não'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="clienteAprovou"
                    value={opcao}
                    checked={formData.clienteAprovou === opcao}
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
              Comentários do Cliente sobre o Material Confeccionado
            </label>
            <textarea
              name="comentariosCliente"
              value={formData.comentariosCliente || ''}
              onChange={onChange}
              rows="3"
              placeholder="Feedback do cliente sobre o material..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Imagens da Aprovação */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-green-600" />
          Imagens da Aprovação do Cliente
        </h3>
        <ImageUploader
          images={formData.imagensAprovacao || []}
          onImagesChange={(imgs) => onImagensChange('imagensAprovacao', imgs)}
          maxImages={4}
          label="📸 Fotos do cliente aprovando o material"
          categoria="mega-hair-aprovacao"
        />
      </div>

      {/* Aplicação do Mega Hair */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">Aplicação do Mega Hair</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Técnica de Aplicação Utilizada *
            </label>
            <div className="space-y-2">
              {[
                'Cola de queratina',
                'Microlink',
                'Fita adesiva',
                'Costura (telinha)',
                'Nó italiano',
                'Outro'
              ].map(tecnica => (
                <label key={tecnica} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tecnicaAplicacao"
                    value={tecnica}
                    checked={formData.tecnicaAplicacao === tecnica}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{tecnica}</span>
                </label>
              ))}
            </div>

            {formData.tecnicaAplicacao === 'Outro' && (
              <div className="mt-3">
                <input
                  type="text"
                  name="outraTecnica"
                  value={formData.outraTecnica || ''}
                  onChange={onChange}
                  placeholder="Especifique a técnica utilizada..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Mechas Aplicadas *
            </label>
            <input
              type="text"
              name="numeroMechasAplicadas"
              value={formData.numeroMechasAplicadas || ''}
              onChange={onChange}
              placeholder="Ex: 48 mechas, 60 mechas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações e Ocorrências Durante a Aplicação
            </label>
            <textarea
              name="observacoesAplicacao"
              value={formData.observacoesAplicacao || ''}
              onChange={onChange}
              rows="3"
              placeholder="Ex: irritação, dificuldades técnicas, tempo de aplicação..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Imagens da Aplicação */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-yellow-600" />
          Imagens Durante a Aplicação
        </h3>
        <ImageUploader
          images={formData.imagensAplicacao || []}
          onImagesChange={(imgs) => onImagensChange('imagensAplicacao', imgs)}
          maxImages={6}
          label="📸 Fotos do processo de aplicação"
          categoria="mega-hair-aplicacao"
        />
      </div>

      {/* Avaliação Pós-Aplicação */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-4">Avaliação Pós-Aplicação</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado do Couro Cabeludo após Aplicação *
            </label>
            <div className="flex space-x-4">
              {['Normal', 'Sensível', 'Irritado'].map(estado => (
                <label key={estado} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="estadoCouroCabeludo"
                    value={estado}
                    checked={formData.estadoCouroCabeludo === estado}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{estado}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aparência Inicial do Mega Hair *
            </label>
            <div className="flex space-x-4 mb-2">
              {['Natural', 'Perceptível', 'Outro'].map(aparencia => (
                <label key={aparencia} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="aparenciaMegaHair"
                    value={aparencia}
                    checked={formData.aparenciaMegaHair === aparencia}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{aparencia}</span>
                </label>
              ))}
            </div>
            {formData.aparenciaMegaHair === 'Outro' && (
              <input
                type="text"
                name="outraAparencia"
                value={formData.outraAparencia || ''}
                onChange={onChange}
                placeholder="Descreva a aparência..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Satisfação Imediata do Cliente *
            </label>
            <div className="flex space-x-4 mb-2">
              {['Satisfeito', 'Neutro', 'Insatisfeito'].map(satisfacao => (
                <label key={satisfacao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="satisfacaoCliente"
                    value={satisfacao}
                    checked={formData.satisfacaoCliente === satisfacao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{satisfacao}</span>
                </label>
              ))}
            </div>
            <textarea
              name="comentarioSatisfacao"
              value={formData.comentarioSatisfacao || ''}
              onChange={onChange}
              rows="2"
              placeholder="Comentário sobre a satisfação..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Imagens Pós-Aplicação */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-pink-600" />
          Imagens do Resultado Final
        </h3>
        <ImageUploader
          images={formData.imagensResultado || []}
          onImagesChange={(imgs) => onImagensChange('imagensResultado', imgs)}
          maxImages={8}
          label="📸 Fotos do resultado final (várias angulações)"
          categoria="mega-hair-resultado"
        />
      </div>

      {/* Instruções e Cuidados */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-4">Instruções e Cuidados Imediatos Pós-Aplicação</h3>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="recebeuOrientacoes"
                checked={formData.recebeuOrientacoes || false}
                onChange={(e) => onChange({ target: { name: 'recebeuOrientacoes', value: e.target.checked } })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Cliente recebeu orientações sobre lavagem e cuidados *
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principais Orientações Fornecidas
            </label>
            <textarea
              name="orientacoesFornecidas"
              value={formData.orientacoesFornecidas || ''}
              onChange={onChange}
              rows="4"
              placeholder="Liste as principais orientações dadas ao cliente: como lavar, produtos indicados, o que evitar, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data para Manutenção e Revisão Agendada
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
              Informações Adicionais sobre Manutenção
            </label>
            <textarea
              name="infoManutencao"
              value={formData.infoManutencao || ''}
              onChange={onChange}
              rows="2"
              placeholder="Detalhes sobre a manutenção: o que será feito, tempo estimado..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Observações Adicionais */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Observações Adicionais do Profissional</h3>
        <textarea
          name="observacoesAdicionais"
          value={formData.observacoesAdicionais || ''}
          onChange={onChange}
          rows="4"
          placeholder="Anotações importantes, particularidades do atendimento, recomendações especiais..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
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
              Horário do Término
            </label>
            <input
              type="time"
              name="horarioTermino"
              value={formData.horarioTermino || ''}
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

export default FormularioConfeccaoMegaHair;