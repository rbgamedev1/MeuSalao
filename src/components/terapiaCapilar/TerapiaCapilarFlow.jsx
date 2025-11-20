// src/components/terapiaCapilar/TerapiaCapilarFlow.jsx
import { useState } from 'react';
import { X, Save, Check, AlertCircle, ChevronRight } from 'lucide-react';
import { getTodayBR } from '../../utils/masks';
import FormularioAvaliacaoInicial from './FormularioAvaliacaoInicial';
import FormularioSelecaoTratamento from './FormularioSelecaoTratamento';
import FormularioAplicacaoTratamento from './FormularioAplicacaoTratamento';
import FormularioFinalizacao from './FormularioFinalizacao';

const ETAPAS = [
  { id: 'avaliacao', nome: 'Avaliação Inicial', icon: '🔍' },
  { id: 'selecao', nome: 'Seleção de Tratamento', icon: '💊' },
  { id: 'aplicacao', nome: 'Aplicação', icon: '✨' },
  { id: 'finalizacao', nome: 'Finalização', icon: '🎯' }
];

const TerapiaCapilarFlow = ({ clienteId, onClose, onSave, prontuarioEdit = null, produtos = [] }) => {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [formData, setFormData] = useState(
    prontuarioEdit?.dadosTerapiaCapilar || {
      // Avaliação Inicial
      problemasCapilares: [],
      tempoProblemas: '',
      historicoTratamentos: '',
      medicamentos: '',
      gravidezAmamentacao: 'Não',
      condicoesDermatologicas: '',
      frequenciaLavagem: '',
      produtosAtuais: '',
      rotinaCuidados: '',
      fatoresInfluencia: [],
      detalhesEstiloVida: '',
      objetivoTratamento: '',
      tipoCouroCabeludo: '',
      descamacao: '',
      irritacao: '',
      vermelhidao: '',
      estadoFios: '',
      padraoQueda: '',
      recomendacoesIniciais: '',
      proximosPassos: '',
      dataProximoAtendimento: '',
      imagensAvaliacao: [],

      // Seleção de Tratamento
      necessidadesIdentificadas: [],
      outrasNecessidades: '',
      tratamentosSelecionados: [],
      observacoesTratamento: '',
      sessoesAgendadas: [],
      metasTratamento: '',
      imagensSelecao: [],

      // Aplicação
      dataAplicacao: getTodayBR(),
      horarioAplicacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      numeroSessao: '1',
      tipoTratamento: '',
      outroTipoTratamento: '',
      produtosUtilizados: [],
      tecnicaEmpregada: '',
      temperaturaInstrumento: '',
      condicaoAntes: '',
      condicaoDepois: '',
      dificuldades: '',
      ajustesProtocolo: '',
      reacoesAdversas: '',
      cuidadosProximoAtendimento: '',
      produtosDomiciliares: '',
      orientacoesManutencao: '',
      dataRetorno: '',
      tratamentoProximaEtapa: '',
      imagensAntes: [],
      imagensDepois: [],

      // Finalização
      dataFinalizacao: getTodayBR(),
      horarioFinalizacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      numeroSessaoFinal: '1',
      caracteristicasFinais: [],
      estadoFiosDetalhes: '',
      condicaoCouroCabeludo: '',
      avaliacaoCliente: 0,
      comentarioCliente: '',
      produtosIndicados: '',
      instrucoesEspecificas: '',
      cuidadosGerais: '',
      frequenciaLavagem: '',
      tratamentosComplementares: '',
      dicasCouroCabeludo: '',
      habitosSaudaveis: '',
      dataProximaSessao: '',
      horarioProximaSessao: '',
      objetivoProximaSessao: '',
      anotacoesProfissional: '',
      solicitacoesCliente: '',
      imagensFinais: []
    }
  );

  const [etapasCompletas, setEtapasCompletas] = useState(
    prontuarioEdit?.etapasCompletas || []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagensChange = (campo, imagens) => {
    setFormData(prev => ({
      ...prev,
      [campo]: imagens
    }));
  };

  const validateEtapaAtual = () => {
    const etapaId = ETAPAS[etapaAtual].id;
    const errors = [];

    switch (etapaId) {
      case 'avaliacao':
        if (!formData.problemasCapilares || formData.problemasCapilares.length === 0) {
          errors.push('Selecione pelo menos um problema capilar');
        }
        if (!formData.objetivoTratamento?.trim()) {
          errors.push('Informe o objetivo do tratamento');
        }
        if (!formData.tipoCouroCabeludo) {
          errors.push('Informe o tipo de couro cabeludo');
        }
        break;

      case 'selecao':
        if (!formData.necessidadesIdentificadas || formData.necessidadesIdentificadas.length === 0) {
          errors.push('Selecione pelo menos uma necessidade');
        }
        if (!formData.tratamentosSelecionados || formData.tratamentosSelecionados.length === 0) {
          errors.push('Adicione pelo menos um tratamento');
        } else {
          const tratamentosIncompletos = formData.tratamentosSelecionados.some(
            t => !t.nomeProduto?.trim() || !t.procedimento?.trim()
          );
          if (tratamentosIncompletos) {
            errors.push('Preencha nome e procedimento de todos os tratamentos');
          }
        }
        break;

      case 'aplicacao':
        if (!formData.dataAplicacao) {
          errors.push('Informe a data da aplicação');
        }
        if (!formData.tipoTratamento) {
          errors.push('Selecione o tipo de tratamento');
        }
        if (!formData.tecnicaEmpregada?.trim()) {
          errors.push('Informe a técnica empregada');
        }
        if (!formData.produtosUtilizados || formData.produtosUtilizados.length === 0) {
          errors.push('Adicione pelo menos um produto utilizado');
        }
        break;

      case 'finalizacao':
        if (!formData.dataFinalizacao) {
          errors.push('Informe a data da finalização');
        }
        if (!formData.produtosIndicados?.trim()) {
          errors.push('Informe os produtos indicados para uso domiciliar');
        }
        break;
    }

    if (errors.length > 0) {
      alert('⚠️ Campos obrigatórios:\n\n' + errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleProximaEtapa = () => {
    if (!validateEtapaAtual()) {
      return;
    }

    const etapaId = ETAPAS[etapaAtual].id;
    if (!etapasCompletas.includes(etapaId)) {
      setEtapasCompletas([...etapasCompletas, etapaId]);
    }

    if (etapaAtual < ETAPAS.length - 1) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const handleEtapaAnterior = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const handleSalvar = () => {
    if (!validateEtapaAtual()) {
      return;
    }

    const etapaId = ETAPAS[etapaAtual].id;
    const etapasAtualizadas = etapasCompletas.includes(etapaId)
      ? etapasCompletas
      : [...etapasCompletas, etapaId];

    const prontuario = {
      clienteId,
      tipo: 'terapia_capilar',
      data: getTodayBR(),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      dadosTerapiaCapilar: formData,
      etapasCompletas: etapasAtualizadas,
      etapaAtual: ETAPAS[etapaAtual].id
    };

    onSave(prontuario);
  };

  const isEtapaCompleta = (etapaId) => {
    return etapasCompletas.includes(etapaId);
  };

  const renderEtapaAtual = () => {
    const etapaId = ETAPAS[etapaAtual].id;

    switch (etapaId) {
      case 'avaliacao':
        return (
          <FormularioAvaliacaoInicial
            formData={formData}
            onChange={handleChange}
            onImagensChange={handleImagensChange}
          />
        );
      case 'selecao':
        return (
          <FormularioSelecaoTratamento
            formData={formData}
            onChange={handleChange}
            onImagensChange={handleImagensChange}
            produtos={produtos}
          />
        );
      case 'aplicacao':
        return (
          <FormularioAplicacaoTratamento
            formData={formData}
            onChange={handleChange}
            onImagensChange={handleImagensChange}
          />
        );
      case 'finalizacao':
        return (
          <FormularioFinalizacao
            formData={formData}
            onChange={handleChange}
            onImagensChange={handleImagensChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  🌸 Terapia Capilar - Atendimento Completo
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  {ETAPAS[etapaAtual].icon} {ETAPAS[etapaAtual].nome}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Indicador de Etapas */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              {ETAPAS.map((etapa, index) => (
                <div key={etapa.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => {
                        if (index <= etapaAtual || isEtapaCompleta(etapa.id)) {
                          setEtapaAtual(index);
                        }
                      }}
                      disabled={index > etapaAtual && !isEtapaCompleta(etapa.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        index === etapaAtual
                          ? 'bg-purple-600 text-white scale-110'
                          : isEtapaCompleta(etapa.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      } ${
                        (index <= etapaAtual || isEtapaCompleta(etapa.id))
                          ? 'cursor-pointer hover:scale-105'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                    >
                      {isEtapaCompleta(etapa.id) ? (
                        <Check size={20} />
                      ) : (
                        <span className="text-lg">{etapa.icon}</span>
                      )}
                    </button>
                    <span className={`text-xs mt-2 text-center ${
                      index === etapaAtual ? 'font-semibold text-purple-700' : 'text-gray-600'
                    }`}>
                      {etapa.nome}
                    </span>
                  </div>
                  {index < ETAPAS.length - 1 && (
                    <ChevronRight 
                      className={`mx-2 flex-shrink-0 ${
                        isEtapaCompleta(etapa.id) ? 'text-green-500' : 'text-gray-400'
                      }`} 
                      size={20} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Guia de Orientação */}
          <div className="bg-blue-50 border-l-4 border-blue-500 px-6 py-3 flex-shrink-0">
            <div className="flex items-start">
              <AlertCircle className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-900">
                <strong className="font-semibold">Orientação:</strong>
                {etapaAtual === 0 && ' Realize uma avaliação completa do estado capilar da cliente.'}
                {etapaAtual === 1 && ' Selecione os tratamentos adequados com base na avaliação.'}
                {etapaAtual === 2 && ' Registre todos os procedimentos realizados durante a aplicação.'}
                {etapaAtual === 3 && ' Finalize o atendimento com orientações e agendamento.'}
              </div>
            </div>
          </div>

          {/* Conteúdo do Formulário */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {renderEtapaAtual()}
          </div>

          {/* Footer com Botões */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
            <button
              onClick={handleEtapaAnterior}
              disabled={etapaAtual === 0}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                etapaAtual === 0
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              ← Anterior
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleSalvar}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
              >
                <Save size={18} />
                <span>Salvar Progresso</span>
              </button>

              {etapaAtual < ETAPAS.length - 1 ? (
                <button
                  onClick={handleProximaEtapa}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
                >
                  <span>Próxima Etapa</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (validateEtapaAtual()) {
                      handleSalvar();
                      onClose();
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
                >
                  <Check size={18} />
                  <span>Finalizar Atendimento</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerapiaCapilarFlow;