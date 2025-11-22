// src/components/megaHair/FormularioEntregaMegaHair.jsx
import { Camera, Package } from 'lucide-react';
import ImageUploader from '../clientes/ImageUploader';
import MaskedInput from '../MaskedInput';

const FormularioEntregaMegaHair = ({ formData, onChange, onImagensChange }) => {
  const handleChecklistChange = (field, value) => {
    onChange({ target: { name: field, value } });
  };

  const handleTermoChange = (field, checked) => {
    onChange({ target: { name: field, value: checked } });
  };

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
              Data do Recebimento *
            </label>
            <MaskedInput
              mask="date"
              name="dataRecebimento"
              value={formData.dataRecebimento || ''}
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

      {/* Tipo de Material Recebido */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
          <Package size={18} className="mr-2" />
          Tipo de Material Recebido *
        </h3>
        
        <div className="space-y-2">
          {[
            'Cabelo natural fornecido pelo cliente',
            'Cabelo natural fornecido pelo salão',
            'Cabelo sintético',
            'Mecha pré-confeccionada',
            'Outro'
          ].map(tipo => (
            <label key={tipo} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="tipoMaterial"
                value={tipo}
                checked={formData.tipoMaterial === tipo}
                onChange={onChange}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{tipo}</span>
            </label>
          ))}
        </div>

        {formData.tipoMaterial === 'Outro' && (
          <div className="mt-3">
            <input
              type="text"
              name="outroTipoMaterial"
              value={formData.outroTipoMaterial || ''}
              onChange={onChange}
              placeholder="Especifique o tipo de material..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
      </div>

      {/* Características do Material */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4">Características do Cabelo/Extensão</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origem/Procedência */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origem/Procedência
              </label>
              <input
                type="text"
                name="origemProcedencia"
                value={formData.origemProcedencia || ''}
                onChange={onChange}
                placeholder="Ex: Brasileiro, Indiano, Europeu..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor (código ou descrição) *
              </label>
              <input
                type="text"
                name="cor"
                value={formData.cor || ''}
                onChange={onChange}
                placeholder="Ex: Castanho escuro, Loiro médio, #4..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Comprimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprimento (em cm) *
              </label>
              <input
                type="text"
                name="comprimento"
                value={formData.comprimento || ''}
                onChange={onChange}
                placeholder="Ex: 50cm, 60cm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Peso/Quantidade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso/Quantidade (em gramas) *
              </label>
              <input
                type="text"
                name="peso"
                value={formData.peso || ''}
                onChange={onChange}
                placeholder="Ex: 100g, 150g..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Textura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Textura *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {['Lisa', 'Ondulada', 'Cacheada', 'Crespa', 'Outra'].map(textura => (
                <label key={textura} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="textura"
                    value={textura}
                    checked={formData.textura === textura}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{textura}</span>
                </label>
              ))}
            </div>
            {formData.textura === 'Outra' && (
              <input
                type="text"
                name="outraTextura"
                value={formData.outraTextura || ''}
                onChange={onChange}
                placeholder="Especifique a textura..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* Tipo de Fio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Fio *
            </label>
            <div className="flex space-x-4">
              {['Fino', 'Médio', 'Grosso'].map(tipo => (
                <label key={tipo} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoFio"
                    value={tipo}
                    checked={formData.tipoFio === tipo}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condição Observada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição Observada *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Novo', 'Usado', 'Danificado', 'Outro'].map(condicao => (
                <label key={condicao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condicaoObservada"
                    value={condicao}
                    checked={formData.condicaoObservada === condicao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{condicao}</span>
                </label>
              ))}
            </div>
            {formData.condicaoObservada === 'Outro' && (
              <input
                type="text"
                name="outraCondicao"
                value={formData.outraCondicao || ''}
                onChange={onChange}
                placeholder="Especifique a condição..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Conferência e Condições do Material */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">Checklist de Inspeção *</h3>
        
        <div className="space-y-3">
          {[
            { field: 'quantidadeConforme', label: 'Quantidade conforme solicitado pela profissional' },
            { field: 'corConforme', label: 'Cor conforme esperado pela profissional' },
            { field: 'clienteCiente', label: 'Cliente está ciente que a profissional não se responsabiliza por serviços extras de corte, modelagem nem coloração' },
            { field: 'comprimentoConforme', label: 'Comprimento conforme esperado pela profissional' },
            { field: 'ausenciaDanos', label: 'Ausência de danos, nós ou queimaduras' },
            { field: 'semOdor', label: 'Sem odor anômalo' },
            { field: 'materialIntegro', label: 'Material íntegro' },
            { field: 'certificado', label: 'Presença de certificado/garantia (se aplicável)' }
          ].map(item => (
            <div key={item.field} className="bg-white rounded-lg p-3 border border-yellow-300">
              <p className="text-sm text-gray-700 mb-2">{item.label}</p>
              <div className="flex space-x-4">
                {['Sim', 'Não'].map(opcao => (
                  <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={item.field}
                      value={opcao}
                      checked={formData[item.field] === opcao}
                      onChange={onChange}
                      className={opcao === 'Sim' ? 'text-green-600 focus:ring-green-500' : 'text-red-600 focus:ring-red-500'}
                    />
                    <span className={`text-sm font-medium ${opcao === 'Sim' ? 'text-green-700' : 'text-red-700'}`}>
                      {opcao}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações sobre Possíveis Problemas Identificados
          </label>
          <textarea
            name="observacoesProblemas"
            value={formData.observacoesProblemas || ''}
            onChange={onChange}
            rows="3"
            placeholder="Descreva qualquer problema ou observação importante..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>

      {/* Termo de Responsabilidade */}
      <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
        <h3 className="font-semibold text-red-900 mb-4 flex items-center">
          ⚠️ Termo de Responsabilidade e Consentimento *
        </h3>
        
        <p className="text-sm text-red-800 mb-4 font-medium">
          O cliente declara e concorda que:
        </p>

        <div className="space-y-3">
          {[
            { field: 'termoMaterialConforme', label: 'O material está conforme descrito neste formulário' },
            { field: 'termoAutorizaUso', label: 'Autoriza o salão a utilizar o material exclusivamente para o procedimento de mega hair contratado' },
            { field: 'termoNaoResponsabiliza', label: 'Compreende que o salão não se responsabiliza por danos ao material antes da entrega causados por fatores externos (armazenamento inadequado do cliente, umidade, pragas, etc.)' },
            { field: 'termoAutorizaManipulacao', label: 'Autoriza a manipulação do material para confecção estando ciente e em pleno acordo com possível perda de comprimento e volume, ciente de que o salão e/ou a profissional não poderão estornar quaisquer valores relacionados ao material após este ser modificado devido à natureza do serviço' }
          ].map(item => (
            <label key={item.field} className="flex items-start space-x-3 cursor-pointer bg-white rounded-lg p-3 border border-red-200 hover:bg-red-50 transition-colors">
              <input
                type="checkbox"
                name={item.field}
                checked={formData[item.field] || false}
                onChange={(e) => handleTermoChange(item.field, e.target.checked)}
                className="mt-1 rounded text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 flex-1">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Especificações Técnicas */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-4">Especificações Técnicas do Procedimento</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Aplicação a Ser Utilizado *
            </label>
            <input
              type="text"
              name="metodoAplicacao"
              value={formData.metodoAplicacao || ''}
              onChange={onChange}
              placeholder="Ex: Fita adesiva, queratina, microlink, costura..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimativa de Duração do Processo de Confecção
              </label>
              <input
                type="text"
                name="duracaoConfeccao"
                value={formData.duracaoConfeccao || ''}
                onChange={onChange}
                placeholder="Ex: 2 horas, 3 horas..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimativa de Duração do Mega Hair
              </label>
              <input
                type="text"
                name="duracaoMegaHair"
                value={formData.duracaoMegaHair || ''}
                onChange={onChange}
                placeholder="Ex: 2 a 3 meses, 4 meses..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Necessidade de Manutenção Periódica
            </label>
            <div className="flex items-center space-x-4 mb-2">
              {['Sim', 'Não'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="necessidadeManutencao"
                    value={opcao}
                    checked={formData.necessidadeManutencao === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
            {formData.necessidadeManutencao === 'Sim' && (
              <input
                type="text"
                name="frequenciaManutencao"
                value={formData.frequenciaManutencao || ''}
                onChange={onChange}
                placeholder="Frequência sugerida: Ex: A cada 30 dias, mensal..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Valor e Condições Financeiras */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-4">Valor e Condições Financeiras</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Material Adquirido no Salão
              </label>
              <input
                type="text"
                name="valorMaterial"
                value={formData.valorMaterial || ''}
                onChange={onChange}
                placeholder="R$ 0,00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Serviço de Confecção
              </label>
              <input
                type="text"
                name="valorConfeccao"
                value={formData.valorConfeccao || ''}
                onChange={onChange}
                placeholder="R$ 0,00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Serviço de Aplicação
              </label>
              <input
                type="text"
                name="valorAplicacao"
                value={formData.valorAplicacao || ''}
                onChange={onChange}
                placeholder="R$ 0,00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Total *
              </label>
              <input
                type="text"
                name="valorTotal"
                value={formData.valorTotal || ''}
                onChange={onChange}
                placeholder="R$ 0,00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Pagamento
              </label>
              <input
                type="text"
                name="formaPagamento"
                value={formData.formaPagamento || ''}
                onChange={onChange}
                placeholder="Ex: Dinheiro, PIX, Cartão..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Pagamento/Vencimento
              </label>
              <MaskedInput
                mask="date"
                name="dataPagamento"
                value={formData.dataPagamento || ''}
                onChange={onChange}
                placeholder="DD/MM/AAAA"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Imagens do Material */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-purple-600" />
          Imagens do Material Recebido
        </h3>
        <ImageUploader
          images={formData.imagensMaterial || []}
          onImagesChange={(imgs) => onImagensChange('imagensMaterial', imgs)}
          maxImages={6}
          label="📸 Fotos do cabelo/extensão recebido"
          categoria="mega-hair-material"
        />
      </div>

      {/* Observações Adicionais */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Observações Adicionais</h3>
        <textarea
          name="observacoesAdicionais"
          value={formData.observacoesAdicionais || ''}
          onChange={onChange}
          rows="4"
          placeholder="Informações adicionais relevantes..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Assinaturas */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Assinaturas e Identificação</h3>
        
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
              RG/CPF do Cliente
            </label>
            <input
              type="text"
              name="rgCpfCliente"
              value={formData.rgCpfCliente || ''}
              onChange={onChange}
              placeholder="Documento de identificação"
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

export default FormularioEntregaMegaHair;