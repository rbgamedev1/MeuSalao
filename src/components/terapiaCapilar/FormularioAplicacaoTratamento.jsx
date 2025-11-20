// src/components/terapiaCapilar/FormularioAplicacaoTratamento.jsx
import { Camera } from 'lucide-react';
import ImageUploader from '../clientes/ImageUploader';
import MaskedInput from '../MaskedInput';

const FormularioAplicacaoTratamento = ({ formData, onChange, onImagensChange }) => {
  const handleProdutoChange = (index, field, value) => {
    const produtos = [...(formData.produtosUtilizados || [])];
    produtos[index] = { ...produtos[index], [field]: value };
    onChange({ target: { name: 'produtosUtilizados', value: produtos } });
  };

  const handleAddProduto = () => {
    const produtos = formData.produtosUtilizados || [];
    onChange({
      target: {
        name: 'produtosUtilizados',
        value: [...produtos, { nome: '', marca: '', quantidade: '' }]
      }
    });
  };

  const handleRemoveProduto = (index) => {
    const produtos = formData.produtosUtilizados || [];
    onChange({
      target: {
        name: 'produtosUtilizados',
        value: produtos.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Dados da Sessão */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-4">Dados da Sessão</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Aplicação *
            </label>
            <MaskedInput
              mask="date"
              name="dataAplicacao"
              value={formData.dataAplicacao || ''}
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
              name="horarioAplicacao"
              value={formData.horarioAplicacao || ''}
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
              name="numeroSessao"
              value={formData.numeroSessao || ''}
              onChange={onChange}
              min="1"
              placeholder="Ex: 1, 2, 3..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Procedimentos Realizados */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-4">Procedimentos Realizados</h3>
        
        <div className="space-y-4">
          {/* Tipo de Tratamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Tratamento *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Hidratação', 'Nutrição', 'Reconstrução', 'Outros'].map(tipo => (
                <label key={tipo} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoTratamento"
                    value={tipo}
                    checked={formData.tipoTratamento === tipo}
                    onChange={onChange}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{tipo}</span>
                </label>
              ))}
            </div>
            {formData.tipoTratamento === 'Outros' && (
              <input
                type="text"
                name="outroTipoTratamento"
                value={formData.outroTipoTratamento || ''}
                onChange={onChange}
                placeholder="Especifique o tipo de tratamento..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}
          </div>

          {/* Produtos Utilizados */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Produtos Utilizados *
              </label>
              <button
                type="button"
                onClick={handleAddProduto}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                + Adicionar Produto
              </button>
            </div>

            {(formData.produtosUtilizados || []).length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Nenhum produto adicionado. Clique em "Adicionar Produto".
              </p>
            ) : (
              <div className="space-y-3">
                {(formData.produtosUtilizados || []).map((produto, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-blue-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700 text-sm">Produto {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduto(index)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Remover
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={produto.nome}
                        onChange={(e) => handleProdutoChange(index, 'nome', e.target.value)}
                        placeholder="Nome do produto"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={produto.marca}
                        onChange={(e) => handleProdutoChange(index, 'marca', e.target.value)}
                        placeholder="Marca"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={produto.quantidade}
                        onChange={(e) => handleProdutoChange(index, 'quantidade', e.target.value)}
                        placeholder="Quantidade"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Técnica Empregada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Técnica Empregada *
            </label>
            <input
              type="text"
              name="tecnicaEmpregada"
              value={formData.tecnicaEmpregada || ''}
              onChange={onChange}
              placeholder="Ex: Massagem, vaporização, laserterapia, peeling..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Temperatura/Instrumento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperatura ou Instrumento Usado
            </label>
            <input
              type="text"
              name="temperaturaInstrumento"
              value={formData.temperaturaInstrumento || ''}
              onChange={onChange}
              placeholder="Ex: Touca térmica, prancha, vapor..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Observações Durante Aplicação */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-4">Observações Durante a Aplicação</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição Antes da Aplicação
            </label>
            <textarea
              name="condicaoAntes"
              value={formData.condicaoAntes || ''}
              onChange={onChange}
              rows="2"
              placeholder="Aparência do cabelo e couro cabeludo antes do tratamento..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição Após a Aplicação
            </label>
            <textarea
              name="condicaoDepois"
              value={formData.condicaoDepois || ''}
              onChange={onChange}
              rows="2"
              placeholder="Aparência, sensibilidade, reações observadas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dificuldades Encontradas
            </label>
            <textarea
              name="dificuldades"
              value={formData.dificuldades || ''}
              onChange={onChange}
              rows="2"
              placeholder="Descreva qualquer dificuldade durante a aplicação..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ajustes Feitos no Protocolo
            </label>
            <textarea
              name="ajustesProtocolo"
              value={formData.ajustesProtocolo || ''}
              onChange={onChange}
              rows="2"
              placeholder="Aumento de tempo, troca de produto, complemento..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reações Adversas (se houver)
            </label>
            <textarea
              name="reacoesAdversas"
              value={formData.reacoesAdversas || ''}
              onChange={onChange}
              rows="2"
              placeholder="Descreva qualquer reação adversa observada..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Recomendações Pós-Tratamento */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h3 className="font-semibold text-green-900 mb-4">Recomendações Pós-Tratamento</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuidados até o Próximo Atendimento
            </label>
            <textarea
              name="cuidadosProximoAtendimento"
              value={formData.cuidadosProximoAtendimento || ''}
              onChange={onChange}
              rows="3"
              placeholder="Orientações de cuidados diários..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produtos Indicados para Uso Domiciliar
            </label>
            <textarea
              name="produtosDomiciliares"
              value={formData.produtosDomiciliares || ''}
              onChange={onChange}
              rows="2"
              placeholder="Lista de produtos recomendados..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientações para Manutenção dos Resultados
            </label>
            <textarea
              name="orientacoesManutencao"
              value={formData.orientacoesManutencao || ''}
              onChange={onChange}
              rows="2"
              placeholder="Como manter os resultados do tratamento..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Agendamento Próxima Sessão */}
      <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
        <h3 className="font-semibold text-pink-900 mb-4">Agendamento da Próxima Sessão</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Prevista para Retorno
            </label>
            <MaskedInput
              mask="date"
              name="dataRetorno"
              value={formData.dataRetorno || ''}
              onChange={onChange}
              placeholder="DD/MM/AAAA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Tratamento na Próxima Etapa
            </label>
            <input
              type="text"
              name="tratamentoProximaEtapa"
              value={formData.tratamentoProximaEtapa || ''}
              onChange={onChange}
              placeholder="Ex: Nutrição, Reconstrução..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Imagens da Aplicação */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <Camera size={18} className="mr-2 text-purple-600" />
          Imagens da Aplicação do Tratamento
        </h3>
        
        <div className="space-y-4">
          <ImageUploader
            images={formData.imagensAntes || []}
            onImagesChange={(imgs) => onImagensChange('imagensAntes', imgs)}
            maxImages={4}
            label="📸 Fotos Antes da Aplicação"
            categoria="antes-aplicacao"
          />
          
          <ImageUploader
            images={formData.imagensDepois || []}
            onImagesChange={(imgs) => onImagensChange('imagensDepois', imgs)}
            maxImages={4}
            label="📸 Fotos Depois da Aplicação"
            categoria="depois-aplicacao"
          />
        </div>
      </div>
    </div>
  );
};

export default FormularioAplicacaoTratamento;