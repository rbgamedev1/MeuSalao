// src/components/terapiaCapilar/FormularioAvaliacaoInicial.jsx
import { useState } from 'react';
import { FileText, Camera } from 'lucide-react';
import ImageUploader from '../clientes/ImageUploader';
import MaskedInput from '../MaskedInput';

const FormularioAvaliacaoInicial = ({ formData, onChange, onImagensChange }) => {
  const handleCheckboxChange = (field, value) => {
    const current = formData[field] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ target: { name: field, value: updated } });
  };

  return (
    <div className="space-y-6">
      {/* Histórico Capilar */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-4 flex items-center">
          <FileText size={18} className="mr-2" />
          Histórico Capilar
        </h3>
        
        <div className="space-y-4">
          {/* Problemas Capilares */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quais problemas capilares apresenta? *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Queda', 'Oleosidade', 'Ressecamento', 'Descamação', 'Quebra', 'Outros'].map(problema => (
                <label key={problema} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.problemasCapilares || []).includes(problema)}
                    onChange={() => handleCheckboxChange('problemasCapilares', problema)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{problema}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tempo dos Problemas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Há quanto tempo apresenta esses problemas?
            </label>
            <input
              type="text"
              name="tempoProblemas"
              value={formData.tempoProblemas || ''}
              onChange={onChange}
              placeholder="Ex: 6 meses, 2 anos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Histórico de Tratamentos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Histórico de tratamentos ou procedimentos anteriores?
            </label>
            <textarea
              name="historicoTratamentos"
              value={formData.historicoTratamentos || ''}
              onChange={onChange}
              rows="3"
              placeholder="Descreva tratamentos anteriores..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Medicamentos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usa medicamentos ou suplementos que possam afetar o cabelo?
            </label>
            <textarea
              name="medicamentos"
              value={formData.medicamentos || ''}
              onChange={onChange}
              rows="2"
              placeholder="Liste medicamentos e suplementos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Saúde Geral */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Saúde Geral</h3>
        
        <div className="space-y-4">
          {/* Gravidez/Amamentação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Está grávida ou amamentando?
            </label>
            <div className="flex space-x-4">
              {['Não', 'Grávida', 'Amamentando'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gravidezAmamentacao"
                    value={opcao}
                    checked={formData.gravidezAmamentacao === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condições Dermatológicas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnóstico de condição dermatológica ou autoimune?
            </label>
            <textarea
              name="condicoesDermatologicas"
              value={formData.condicoesDermatologicas || ''}
              onChange={onChange}
              rows="2"
              placeholder="Descreva condições existentes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Hábitos e Cuidados */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4">Hábitos e Cuidados</h3>
        
        <div className="space-y-4">
          {/* Frequência de Lavagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Com que frequência lava o cabelo?
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
              <option value="Menos de 1x por semana">Menos de 1x por semana</option>
            </select>
          </div>

          {/* Produtos Utilizados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produtos utilizados atualmente
            </label>
            <textarea
              name="produtosAtuais"
              value={formData.produtosAtuais || ''}
              onChange={onChange}
              rows="3"
              placeholder="Shampoo, condicionador, tônicos, tratamentos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Rotina de Cuidados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotina de cuidados específicos
            </label>
            <textarea
              name="rotinaCuidados"
              value={formData.rotinaCuidados || ''}
              onChange={onChange}
              rows="2"
              placeholder="Máscaras, tratamentos profissionais, fisioterapia capilar..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Estilo de Vida */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">Estilo de Vida</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fatores que podem influenciar a saúde capilar
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {['Estresse', 'Alimentação inadequada', 'Uso de químicas', 'Exposição ao calor', 'Poluição', 'Outros'].map(fator => (
              <label key={fator} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.fatoresInfluencia || []).includes(fator)}
                  onChange={() => handleCheckboxChange('fatoresInfluencia', fator)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">{fator}</span>
              </label>
            ))}
          </div>
          <textarea
            name="detalhesEstiloVida"
            value={formData.detalhesEstiloVida || ''}
            onChange={onChange}
            rows="2"
            placeholder="Detalhes adicionais sobre estilo de vida..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>

      {/* Expectativas */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-4">Expectativas do Tratamento</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Principal objetivo com o tratamento capilar *
          </label>
          <textarea
            name="objetivoTratamento"
            value={formData.objetivoTratamento || ''}
            onChange={onChange}
            rows="3"
            placeholder="Ex: crescimento, fortalecimento, controle de oleosidade..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>

      {/* Avaliação Visual */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-4">Avaliação Visual</h3>
        
        <div className="space-y-4">
          {/* Tipo de Couro Cabeludo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de couro cabeludo *
            </label>
            <div className="flex space-x-4">
              {['Oleoso', 'Seco', 'Normal', 'Misto'].map(tipo => (
                <label key={tipo} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoCouroCabeludo"
                    value={tipo}
                    checked={formData.tipoCouroCabeludo === tipo}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Observações Visuais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descamação?
              </label>
              <div className="flex space-x-4">
                {['Sim', 'Não'].map(opcao => (
                  <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="descamacao"
                      value={opcao}
                      checked={formData.descamacao === opcao}
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
                Irritação?
              </label>
              <div className="flex space-x-4">
                {['Sim', 'Não'].map(opcao => (
                  <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="irritacao"
                      value={opcao}
                      checked={formData.irritacao === opcao}
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
                Vermelhidão?
              </label>
              <div className="flex space-x-4">
                {['Sim', 'Não'].map(opcao => (
                  <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="vermelhidao"
                      value={opcao}
                      checked={formData.vermelhidao === opcao}
                      onChange={onChange}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{opcao}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Estado dos Fios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado dos fios
            </label>
            <textarea
              name="estadoFios"
              value={formData.estadoFios || ''}
              onChange={onChange}
              rows="2"
              placeholder="Fragilidade, quebras, ressecamento, aspecto geral..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Padrão de Queda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padrão de queda (se identificada)
            </label>
            <input
              type="text"
              name="padraoQueda"
              value={formData.padraoQueda || ''}
              onChange={onChange}
              placeholder="Descreva o padrão de queda observado..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Imagens da Avaliação */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-purple-600" />
          Imagens da Avaliação Inicial
        </h3>
        <ImageUploader
          images={formData.imagensAvaliacao || []}
          onImagesChange={(imgs) => onImagensChange('imagensAvaliacao', imgs)}
          maxImages={6}
          label="📸 Fotos do couro cabeludo e fios"
          categoria="avaliacao-inicial"
        />
      </div>

      {/* Finalização */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Finalização da Avaliação</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recomendações iniciais
            </label>
            <textarea
              name="recomendacoesIniciais"
              value={formData.recomendacoesIniciais || ''}
              onChange={onChange}
              rows="3"
              placeholder="Orientações gerais para a cliente..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Próximos passos
            </label>
            <textarea
              name="proximosPassos"
              value={formData.proximosPassos || ''}
              onChange={onChange}
              rows="2"
              placeholder="Procedimentos indicados, próxima etapa..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previsão para próximo atendimento
            </label>
            <MaskedInput
              mask="date"
              name="dataProximoAtendimento"
              value={formData.dataProximoAtendimento || ''}
              onChange={onChange}
              placeholder="DD/MM/AAAA"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioAvaliacaoInicial;