// src/components/clientes/ProntuarioForm.jsx
import { useState, useContext } from 'react';
import { X, Save, Calendar, Clock, FileText, Package, AlertCircle } from 'lucide-react';
import { SalaoContext } from '../../contexts/SalaoContext';
import MaskedInput from '../MaskedInput';
import ImageUploader from './ImageUploader';
import { getTodayBR, isValidDate } from '../../utils/masks';

const ProntuarioForm = ({ clienteId, prontuarioEdit = null, onClose, onSave }) => {
  const { getProdutosPorSalao } = useContext(SalaoContext);
  const produtos = getProdutosPorSalao();
  
  const [formData, setFormData] = useState({
    data: prontuarioEdit?.data || getTodayBR(),
    hora: prontuarioEdit?.hora || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    diagnostico: prontuarioEdit?.diagnostico || '',
    tratamento: prontuarioEdit?.tratamento || '',
    produtosUsados: prontuarioEdit?.produtosUsados || [],
    observacoes: prontuarioEdit?.observacoes || '',
    proximaSessao: prontuarioEdit?.proximaSessao || '',
    imagens: {
      tricoscopia: prontuarioEdit?.imagens?.tricoscopia || [],
      anteDepois: prontuarioEdit?.imagens?.anteDepois || []
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProdutosChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      produtosUsados: selectedOptions
    }));
  };

  const handleImagensChange = (tipo, novasImagens) => {
    setFormData(prev => ({
      ...prev,
      imagens: {
        ...prev.imagens,
        [tipo]: novasImagens
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.data || !isValidDate(formData.data)) {
      newErrors.data = 'Data inválida';
    }

    if (!formData.diagnostico.trim()) {
      newErrors.diagnostico = 'Diagnóstico é obrigatório';
    }

    if (!formData.tratamento.trim()) {
      newErrors.tratamento = 'Tratamento é obrigatório';
    }

    if (formData.proximaSessao && !isValidDate(formData.proximaSessao)) {
      newErrors.proximaSessao = 'Data inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      ...formData,
      clienteId
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {prontuarioEdit ? 'Editar Sessão' : 'Nova Sessão de Terapia Capilar'}
                </h3>
                <p className="text-purple-100 text-sm mt-1">
                  Registre os detalhes do atendimento
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

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2 text-purple-600" />
                  Data da Sessão *
                </label>
                <MaskedInput
                  mask="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  placeholder="DD/MM/AAAA"
                />
                {errors.data && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.data}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock size={16} className="mr-2 text-purple-600" />
                  Horário
                </label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Diagnóstico Capilar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FileText size={16} className="mr-2 text-purple-600" />
                Diagnóstico Capilar *
              </label>
              <textarea
                name="diagnostico"
                value={formData.diagnostico}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Descreva o estado atual do cabelo/couro cabeludo..."
              />
              {errors.diagnostico && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.diagnostico}
                </p>
              )}
            </div>

            {/* Tratamento Aplicado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FileText size={16} className="mr-2 text-purple-600" />
                Tratamento Aplicado *
              </label>
              <textarea
                name="tratamento"
                value={formData.tratamento}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Descreva o procedimento realizado..."
              />
              {errors.tratamento && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.tratamento}
                </p>
              )}
            </div>

            {/* Produtos Utilizados */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Package size={16} className="mr-2 text-purple-600" />
                Produtos Utilizados
              </label>
              <select
                multiple
                value={formData.produtosUsados.map(String)}
                onChange={handleProdutosChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
              >
                <option value="" disabled className="text-gray-400">
                  Segure Ctrl/Cmd para selecionar múltiplos
                </option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - {produto.marca}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                💡 Segure Ctrl (Windows) ou Cmd (Mac) para selecionar múltiplos produtos
              </p>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações Gerais
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Anotações adicionais, reações, recomendações..."
              />
            </div>

            {/* Próxima Sessão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar size={16} className="mr-2 text-purple-600" />
                Previsão da Próxima Sessão
              </label>
              <MaskedInput
                mask="date"
                name="proximaSessao"
                value={formData.proximaSessao}
                onChange={handleChange}
                placeholder="DD/MM/AAAA"
              />
              {errors.proximaSessao && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.proximaSessao}
                </p>
              )}
            </div>

            {/* Upload de Imagens - Tricoscopia */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">📸 Imagens da Sessão</h4>
              
              <ImageUploader
                images={formData.imagens.tricoscopia}
                onImagesChange={(imgs) => handleImagensChange('tricoscopia', imgs)}
                maxImages={4}
                label="🔬 Tricoscopia (Microscópio)"
                categoria="tricoscopia"
              />
            </div>

            {/* Upload de Imagens - Antes/Depois */}
            <div className="pt-4">
              <ImageUploader
                images={formData.imagens.anteDepois}
                onImagesChange={(imgs) => handleImagensChange('anteDepois', imgs)}
                maxImages={4}
                label="📷 Antes/Depois do Tratamento"
                categoria="antes-depois"
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2"
              >
                <Save size={18} />
                <span>{prontuarioEdit ? 'Salvar Alterações' : 'Registrar Sessão'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProntuarioForm;