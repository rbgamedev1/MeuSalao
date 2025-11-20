// src/components/terapiaCapilar/FormularioSelecaoTratamento.jsx
import { Camera, Package } from 'lucide-react';
import ImageUploader from '../clientes/ImageUploader';
import MaskedInput from '../MaskedInput';

const FormularioSelecaoTratamento = ({ formData, onChange, onImagensChange, produtos = [] }) => {
  const handleCheckboxChange = (field, value) => {
    const current = formData[field] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ target: { name: field, value: updated } });
  };

  const handleAddTratamento = () => {
    const tratamentos = formData.tratamentosSelecionados || [];
    tratamentos.push({
      id: Date.now(),
      nomeProduto: '',
      procedimento: '',
      frequencia: '',
      duracao: ''
    });
    onChange({ target: { name: 'tratamentosSelecionados', value: [...tratamentos] } });
  };

  const handleRemoveTratamento = (id) => {
    const tratamentos = formData.tratamentosSelecionados || [];
    onChange({ 
      target: { 
        name: 'tratamentosSelecionados', 
        value: tratamentos.filter(t => t.id !== id) 
      } 
    });
  };

  const handleTratamentoChange = (id, field, value) => {
    const tratamentos = formData.tratamentosSelecionados || [];
    const updated = tratamentos.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    onChange({ target: { name: 'tratamentosSelecionados', value: updated } });
  };

  const handleAddSessao = () => {
    const sessoes = formData.sessoesAgendadas || [];
    sessoes.push({
      id: Date.now(),
      data: '',
      objetivo: ''
    });
    onChange({ target: { name: 'sessoesAgendadas', value: [...sessoes] } });
  };

  const handleRemoveSessao = (id) => {
    const sessoes = formData.sessoesAgendadas || [];
    onChange({ 
      target: { 
        name: 'sessoesAgendadas', 
        value: sessoes.filter(s => s.id !== id) 
      } 
    });
  };

  const handleSessaoChange = (id, field, value) => {
    const sessoes = formData.sessoesAgendadas || [];
    const updated = sessoes.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    onChange({ target: { name: 'sessoesAgendadas', value: updated } });
  };

  return (
    <div className="space-y-6">
      {/* Necessidades Identificadas */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-4">
          Principais Necessidades Identificadas *
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Hidratação',
            'Nutrição',
            'Reconstrução',
            'Controle de oleosidade',
            'Combate à queda capilar',
            'Tratamento de caspa/descamação',
            'Estímulo ao crescimento',
            'Outros'
          ].map(necessidade => (
            <label key={necessidade} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(formData.necessidadesIdentificadas || []).includes(necessidade)}
                onChange={() => handleCheckboxChange('necessidadesIdentificadas', necessidade)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{necessidade}</span>
            </label>
          ))}
        </div>

        {(formData.necessidadesIdentificadas || []).includes('Outros') && (
          <div className="mt-3">
            <textarea
              name="outrasNecessidades"
              value={formData.outrasNecessidades || ''}
              onChange={onChange}
              rows="2"
              placeholder="Especifique outras necessidades..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        )}
      </div>

      {/* Tratamentos Indicados */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-blue-900">Tratamentos Indicados *</h3>
          <button
            type="button"
            onClick={handleAddTratamento}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            + Adicionar Tratamento
          </button>
        </div>

        {(formData.tratamentosSelecionados || []).length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Nenhum tratamento adicionado. Clique em "Adicionar Tratamento" para começar.
          </p>
        ) : (
          <div className="space-y-4">
            {(formData.tratamentosSelecionados || []).map((tratamento, index) => (
              <div key={tratamento.id} className="bg-white rounded-lg p-4 border border-blue-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-700">Tratamento {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTratamento(tratamento.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remover
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nome do Produto/Técnica *
                    </label>
                    <input
                      type="text"
                      value={tratamento.nomeProduto}
                      onChange={(e) => handleTratamentoChange(tratamento.id, 'nomeProduto', e.target.value)}
                      placeholder="Ex: Máscara de Hidratação Profunda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Procedimento *
                    </label>
                    <input
                      type="text"
                      value={tratamento.procedimento}
                      onChange={(e) => handleTratamentoChange(tratamento.id, 'procedimento', e.target.value)}
                      placeholder="Ex: Aplicação com touca térmica"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Frequência Recomendada
                    </label>
                    <input
                      type="text"
                      value={tratamento.frequencia}
                      onChange={(e) => handleTratamentoChange(tratamento.id, 'frequencia', e.target.value)}
                      placeholder="Ex: 1x por semana"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Duração Estimada
                    </label>
                    <input
                      type="text"
                      value={tratamento.duracao}
                      onChange={(e) => handleTratamentoChange(tratamento.id, 'duracao', e.target.value)}
                      placeholder="Ex: 8 semanas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Observações do Profissional */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">Observações do Profissional</h3>
        <textarea
          name="observacoesTratamento"
          value={formData.observacoesTratamento || ''}
          onChange={onChange}
          rows="4"
          placeholder="Cuidados especiais, contraindicações, ajustes no cronograma..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Plano de Tratamento */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-green-900">Plano de Tratamento</h3>
          <button
            type="button"
            onClick={handleAddSessao}
            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            + Adicionar Sessão
          </button>
        </div>

        {/* Sessões Agendadas */}
        <div className="space-y-3 mb-4">
          {(formData.sessoesAgendadas || []).map((sessao, index) => (
            <div key={sessao.id} className="bg-white rounded-lg p-3 border border-green-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700 text-sm">Sessão {index + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSessao(sessao.id)}
                  className="text-red-600 hover:text-red-700 text-xs"
                >
                  Remover
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Data Prevista
                  </label>
                  <MaskedInput
                    mask="date"
                    value={sessao.data}
                    onChange={(e) => handleSessaoChange(sessao.id, 'data', e.target.value)}
                    placeholder="DD/MM/AAAA"
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Objetivo da Sessão
                  </label>
                  <input
                    type="text"
                    value={sessao.objetivo}
                    onChange={(e) => handleSessaoChange(sessao.id, 'objetivo', e.target.value)}
                    placeholder="Ex: Hidratação profunda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Metas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metas a Alcançar
          </label>
          <textarea
            name="metasTratamento"
            value={formData.metasTratamento || ''}
            onChange={onChange}
            rows="3"
            placeholder="Ex: Reduzir queda em 50% após 2 meses, melhorar brilho e maciez..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>

      {/* Imagens */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-purple-600" />
          Imagens do Plano de Tratamento
        </h3>
        <ImageUploader
          images={formData.imagensSelecao || []}
          onImagesChange={(imgs) => onImagensChange('imagensSelecao', imgs)}
          maxImages={4}
          label="📸 Fotos de produtos ou referências"
          categoria="selecao-tratamento"
        />
      </div>
    </div>
  );
};

export default FormularioSelecaoTratamento;