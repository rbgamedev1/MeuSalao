// src/components/megaHair/FormularioAvaliacaoMegaHair.jsx
import { Camera } from 'lucide-react';
import ImageUploader from '../clientes/ImageUploader';
import MaskedInput from '../MaskedInput';

const FormularioAvaliacaoMegaHair = ({ formData, onChange, onImagensChange }) => {
  const handleCheckboxChange = (field, value) => {
    const current = formData[field] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onChange({ target: { name: field, value: updated } });
  };

  return (
    <div className="space-y-6">
      {/* Identificação do Cliente */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-4">Identificação do Cliente</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nomeCompleto"
              value={formData.nomeCompleto || ''}
              onChange={onChange}
              placeholder="Nome completo do cliente"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento
            </label>
            <MaskedInput
              mask="date"
              name="dataNascimento"
              value={formData.dataNascimento || ''}
              onChange={onChange}
              placeholder="DD/MM/AAAA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone/WhatsApp
            </label>
            <MaskedInput
              mask="phone"
              name="telefone"
              value={formData.telefone || ''}
              onChange={onChange}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={onChange}
              placeholder="email@exemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profissão
            </label>
            <input
              type="text"
              name="profissao"
              value={formData.profissao || ''}
              onChange={onChange}
              placeholder="Profissão do cliente"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Histórico Capilar e de Saúde */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Histórico Capilar e de Saúde</h3>
        
        <div className="space-y-4">
          {/* Tempo que deseja o procedimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Há quanto tempo deseja realizar o procedimento de mega hair? *
            </label>
            <input
              type="text"
              name="tempoProcedimento"
              value={formData.tempoProcedimento || ''}
              onChange={onChange}
              placeholder="Ex: 6 meses, 1 ano, primeira vez..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Uso anterior de extensões */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Você já utilizou extensões ou próteses capilares antes? *
            </label>
            <div className="flex space-x-4 mb-2">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="usouExtensoes"
                    value={opcao}
                    checked={formData.usouExtensoes === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
            {formData.usouExtensoes === 'Sim' && (
              <textarea
                name="tecnicasAnteriores"
                value={formData.tecnicasAnteriores || ''}
                onChange={onChange}
                rows="2"
                placeholder="Quais técnicas? Descreva sua experiência anterior..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            )}
          </div>

          {/* Histórico de queda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Possui histórico de queda de cabelo?
            </label>
            <div className="flex space-x-4 mb-2">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="historicoQueda"
                    value={opcao}
                    checked={formData.historicoQueda === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
            {formData.historicoQueda === 'Sim' && (
              <textarea
                name="detalhesQueda"
                value={formData.detalhesQueda || ''}
                onChange={onChange}
                rows="2"
                placeholder="Detalhe o histórico de queda de cabelo..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            )}
          </div>

          {/* Diagnóstico de enfermidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tem algum diagnóstico de enfermidade relacionada ao couro cabeludo?
            </label>
            <div className="flex space-x-4 mb-2">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="diagnosticoEnfermidade"
                    value={opcao}
                    checked={formData.diagnosticoEnfermidade === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
            {formData.diagnosticoEnfermidade === 'Sim' && (
              <textarea
                name="qualEnfermidade"
                value={formData.qualEnfermidade || ''}
                onChange={onChange}
                rows="2"
                placeholder="Especifique: caspa, dermatite, psoríase, alopecia, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            )}
          </div>

          {/* Medicamentos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faz uso de medicamentos?
            </label>
            <div className="flex space-x-4 mb-2">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="usaMedicamentos"
                    value={opcao}
                    checked={formData.usaMedicamentos === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
            {formData.usaMedicamentos === 'Sim' && (
              <textarea
                name="quaisMedicamentos"
                value={formData.quaisMedicamentos || ''}
                onChange={onChange}
                rows="2"
                placeholder="Liste os medicamentos em uso..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            )}
          </div>

          {/* Alergias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alergias Conhecidas
            </label>
            <textarea
              name="alergias"
              value={formData.alergias || ''}
              onChange={onChange}
              rows="2"
              placeholder="Descreva alergias conhecidas, se houver..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Procedimentos químicos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Já realizou procedimentos químicos recentes?
            </label>
            <div className="flex space-x-4 mb-2">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="procedimentosQuimicos"
                    value={opcao}
                    checked={formData.procedimentosQuimicos === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
            {formData.procedimentosQuimicos === 'Sim' && (
              <textarea
                name="quaisProcedimentos"
                value={formData.quaisProcedimentos || ''}
                onChange={onChange}
                rows="2"
                placeholder="Especifique: descoloração, tintura, alisamento, relaxamento e quando foi realizado..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            )}
          </div>

          {/* Doenças crônicas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Possui alguma doença crônica relevante?
            </label>
            <textarea
              name="doencasCronicas"
              value={formData.doencasCronicas || ''}
              onChange={onChange}
              rows="2"
              placeholder="Descreva doenças crônicas relevantes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Infecção ou irritação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Já teve infecção ou irritação no couro cabeludo?
            </label>
            <div className="flex space-x-4 mb-2">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="infeccaoIrritacao"
                    value={opcao}
                    checked={formData.infeccaoIrritacao === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
            {formData.infeccaoIrritacao === 'Sim' && (
              <textarea
                name="detalhesInfeccao"
                value={formData.detalhesInfeccao || ''}
                onChange={onChange}
                rows="2"
                placeholder="Descreva quando e como foi..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* Análise e Observação Capilar */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4">Análise e Observação Capilar</h3>
        
        <div className="space-y-4">
          {/* Densidade capilar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Densidade Capilar *
            </label>
            <div className="flex space-x-4">
              {['Alta', 'Média', 'Baixa'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="densidadeCapilar"
                    value={opcao}
                    checked={formData.densidadeCapilar === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comprimento dos fios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comprimento dos Fios
            </label>
            <input
              type="text"
              name="comprimentoFios"
              value={formData.comprimentoFios || ''}
              onChange={onChange}
              placeholder="Ex: Na altura dos ombros, curto, médio..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Textura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Textura *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Lisa', 'Ondulada', 'Cacheada', 'Crespa'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="texturaFios"
                    value={opcao}
                    checked={formData.texturaFios === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipo de fio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Fio *
            </label>
            <div className="flex space-x-4">
              {['Fino', 'Médio', 'Grosso'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoFio"
                    value={opcao}
                    checked={formData.tipoFio === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Elasticidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elasticidade
            </label>
            <div className="flex space-x-4">
              {['Boa', 'Média', 'Baixa/Ausente'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="elasticidade"
                    value={opcao}
                    checked={formData.elasticidade === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Porosidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porosidade
            </label>
            <div className="flex space-x-4">
              {['Normal', 'Pouco porosa', 'Muito porosa'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="porosidade"
                    value={opcao}
                    checked={formData.porosidade === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Estabilidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estabilidade dos Fios
            </label>
            <div className="flex space-x-4">
              {['Estável', 'Fragilizada'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="estabilidadeFios"
                    value={opcao}
                    checked={formData.estabilidadeFios === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Falhas visíveis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Presença de Falhas Visíveis?
            </label>
            <input
              type="text"
              name="falhasVisiveis"
              value={formData.falhasVisiveis || ''}
              onChange={onChange}
              placeholder="Descreva localização das falhas, se houver..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Sinais no couro cabeludo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sinais no Couro Cabeludo
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
              {['Saúde normal', 'Descamação', 'Irritação', 'Oleosidade excessiva', 'Feridas'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.sinaisCouroCabeludo || []).includes(opcao)}
                    onChange={() => handleCheckboxChange('sinaisCouroCabeludo', opcao)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Corte químico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Presença de Corte Químico?
            </label>
            <div className="flex space-x-4">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="corteQuimico"
                    value={opcao}
                    checked={formData.corteQuimico === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rotina e Hábitos */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">Rotina e Hábitos</h3>
        
        <div className="space-y-4">
          {/* Frequência de lavagem */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequência de Lavagem
            </label>
            <input
              type="text"
              name="frequenciaLavagem"
              value={formData.frequenciaLavagem || ''}
              onChange={onChange}
              placeholder="Ex: 3 vezes por semana"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Produtos usados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produtos Usados Atualmente
            </label>
            <textarea
              name="produtosUsados"
              value={formData.produtosUsados || ''}
              onChange={onChange}
              rows="2"
              placeholder="Shampoo, condicionador, máscara, óleos, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Dormir com cabelo úmido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tem costume de dormir com cabelo úmido?
            </label>
            <div className="flex space-x-4">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dormeCabeloUmido"
                    value={opcao}
                    checked={formData.dormeCabeloUmido === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ferramentas térmicas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Utiliza ferramentas térmicas?
            </label>
            <div className="flex space-x-4 mb-2">
              {['Não', 'Sim'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="usaFerramentasTermicas"
                    value={opcao}
                    checked={formData.usaFerramentasTermicas === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
            {formData.usaFerramentasTermicas === 'Sim' && (
              <input
                type="text"
                name="quaisFerramentas"
                value={formData.quaisFerramentas || ''}
                onChange={onChange}
                placeholder="Quais ferramentas e com que frequência?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* Alimentação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alimentação
            </label>
            <div className="flex space-x-4">
              {['Regular', 'Irregular', 'Dieta restritiva recente'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="alimentacao"
                    value={opcao}
                    checked={formData.alimentacao === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expectativas e Objetivos */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-4">Expectativas e Objetivos</h3>
        
        <div className="space-y-4">
          {/* Motivo para realizar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo para Realizar o Mega Hair *
            </label>
            <textarea
              name="motivoMegaHair"
              value={formData.motivoMegaHair || ''}
              onChange={onChange}
              rows="3"
              placeholder="Descreva o principal motivo..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Resultado esperado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resultado Esperado *
            </label>
            <textarea
              name="resultadoEsperado"
              value={formData.resultadoEsperado || ''}
              onChange={onChange}
              rows="3"
              placeholder="Comprimento, volume, mudança de visual, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Referências de cor/textura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referências de Cor/Textura Desejadas
            </label>
            <textarea
              name="referenciasCor"
              value={formData.referenciasCor || ''}
              onChange={onChange}
              rows="2"
              placeholder="Descreva cores e texturas desejadas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Aceita manutenção */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aceita manutenção periódica conforme orientação profissional? *
            </label>
            <div className="flex space-x-4">
              {['Sim', 'Não'].map(opcao => (
                <label key={opcao} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="aceitaManutencao"
                    value={opcao}
                    checked={formData.aceitaManutencao === opcao}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{opcao}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Avaliação Profissional */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-4">Avaliação Profissional</h3>
        
        <div className="space-y-4">
          {/* Método indicado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método(s) de Mega Hair Indicados
            </label>
            <textarea
              name="metodosIndicados"
              value={formData.metodosIndicados || ''}
              onChange={onChange}
              rows="2"
              placeholder="Ex: Fita adesiva, queratina, microlink, costura..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Quantidade sugerida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade Sugerida de Cabelo/Extensão
            </label>
            <input
              type="text"
              name="quantidadeSugerida"
              value={formData.quantidadeSugerida || ''}
              onChange={onChange}
              placeholder="Ex: 100g, 150g, 50 mechas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Considerações e contraindicações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Considerações e Contraindicações
            </label>
            <textarea
              name="consideracoesContraindicacoes"
              value={formData.consideracoesContraindicacoes || ''}
              onChange={onChange}
              rows="3"
              placeholder="Observações importantes, restrições, cuidados especiais..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Imagens da Avaliação */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-purple-600" />
          Imagens da Condição Atual do Cabelo
        </h3>
        <ImageUploader
          images={formData.imagensAvaliacao || []}
          onImagesChange={(imgs) => onImagensChange('imagensAvaliacao', imgs)}
          maxImages={6}
          label="📸 Fotos do cabelo atual (várias angulações)"
          categoria="mega-hair-avaliacao"
        />
      </div>

      {/* Termo de Responsabilidade */}
      <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
        <h3 className="font-semibold text-red-900 mb-3 flex items-center">
          ⚠️ Importante - Termo de Responsabilidade
        </h3>
        <div className="space-y-2 text-sm text-red-800">
          <p>
            • Declaro que todas as informações fornecidas são verdadeiras e completas.
          </p>
          <p>
            • Estou ciente dos cuidados necessários e da manutenção periódica do mega hair.
          </p>
          <p>
            • Fui informado(a) sobre possíveis contraindicações e riscos do procedimento.
          </p>
          <p>
            • Autorizo a realização do procedimento conforme avaliação profissional.
          </p>
        </div>
        
        <div className="mt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="termoAceito"
              checked={formData.termoAceito || false}
              onChange={(e) => onChange({ target: { name: 'termoAceito', value: e.target.checked } })}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-red-900">
              Li e aceito os termos acima *
            </span>
          </label>
        </div>
      </div>

      {/* Assinaturas */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-4">Assinaturas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Avaliação
            </label>
            <MaskedInput
              mask="date"
              name="dataAvaliacao"
              value={formData.dataAvaliacao || ''}
              onChange={onChange}
              placeholder="DD/MM/AAAA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Profissional Responsável
            </label>
            <input
              type="text"
              name="nomeProfissional"
              value={formData.nomeProfissional || ''}
              onChange={onChange}
              placeholder="Nome completo"
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

export default FormularioAvaliacaoMegaHair;