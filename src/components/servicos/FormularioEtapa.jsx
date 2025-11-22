// src/components/servicos/FormularioEtapa.jsx
import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { getTodayBR } from '../../utils/masks';

import FormularioAvaliacaoInicial from '../terapiaCapilar/FormularioAvaliacaoInicial';
import FormularioSelecaoTratamento from '../terapiaCapilar/FormularioSelecaoTratamento';
import FormularioAplicacaoTratamento from '../terapiaCapilar/FormularioAplicacaoTratamento';
import FormularioFinalizacao from '../terapiaCapilar/FormularioFinalizacao';

import FormularioAvaliacaoMegaHair from '../megaHair/FormularioAvaliacaoMegaHair';
import FormularioEntregaMegaHair from '../megaHair/FormularioEntregaMegaHair';
import FormularioConfeccaoMegaHair from '../megaHair/FormularioConfeccaoMegaHair';
import FormularioFinalizacaoMegaHair from '../megaHair/FormularioFinalizacaoMegaHair';

const FormularioEtapa = ({ clienteSelecionado, tipoAtendimento, etapaSelecionada, onClose, onSave, produtos }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagensChange = (campo, imagens) => {
    setFormData(prev => ({ ...prev, [campo]: imagens }));
  };

  const handleSalvar = () => {
    const prontuario = {
      clienteId: clienteSelecionado.id,
      tipo: tipoAtendimento,
      data: getTodayBR(),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      etapaPreenchida: etapaSelecionada,
      dadosTerapiaCapilar: formData,
      etapasCompletas: [etapaSelecionada]
    };
    onSave(prontuario);
  };

  const renderFormulario = () => {
    if (tipoAtendimento === 'terapia_capilar') {
      switch (etapaSelecionada) {
        case 'avaliacao':
          return <FormularioAvaliacaoInicial formData={formData} onChange={handleChange} onImagensChange={handleImagensChange} />;
        case 'selecao':
          return <FormularioSelecaoTratamento formData={formData} onChange={handleChange} onImagensChange={handleImagensChange} produtos={produtos} />;
        case 'aplicacao':
          return <FormularioAplicacaoTratamento formData={formData} onChange={handleChange} onImagensChange={handleImagensChange} />;
        case 'finalizacao':
          return <FormularioFinalizacao formData={formData} onChange={handleChange} onImagensChange={handleImagensChange} />;
        default:
          return null;
      }
    }
    
    if (tipoAtendimento === 'mega_hair') {
      switch (etapaSelecionada) {
        case 'avaliacao':
          return <FormularioAvaliacaoMegaHair formData={formData} onChange={handleChange} onImagensChange={handleImagensChange} />;
        case 'entrega':
          return <FormularioEntregaMegaHair formData={formData} onChange={handleChange} onImagensChange={handleImagensChange} />;
        case 'confeccao':
          return <FormularioConfeccaoMegaHair formData={formData} onChange={handleChange} onImagensChange={handleImagensChange} />;
        case 'finalizacao':
          return <FormularioFinalizacaoMegaHair formData={formData} onChange={handleChange} onImagensChange={handleImagensChange} />;
        default:
          return null;
      }
    }

    return null;
  };

  const getNomeEtapa = () => {
    if (tipoAtendimento === 'terapia_capilar') {
      const nomes = {
        avaliacao: '🔍 Avaliação Inicial',
        selecao: '💊 Seleção de Tratamento',
        aplicacao: '✨ Aplicação do Tratamento',
        finalizacao: '🎯 Finalização'
      };
      return nomes[etapaSelecionada] || '';
    } else {
      const nomes = {
        avaliacao: '🔍 Avaliação Inicial',
        entrega: '📦 Entrega de Material',
        confeccao: '✂️ Confecção e Aplicação',
        finalizacao: '🎯 Finalização e Orientações'
      };
      return nomes[etapaSelecionada] || '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{getNomeEtapa()}</h3>
                <p className="text-purple-100 text-sm mt-1">
                  {clienteSelecionado.nome} • {tipoAtendimento === 'terapia_capilar' ? 'Terapia Capilar' : 'Mega Hair'}
                </p>
              </div>
              <button onClick={onClose} className="text-white hover:text-gray-200 p-2 hover:bg-white/20 rounded-lg">
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {renderFormulario()}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Salvar Registro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioEtapa;