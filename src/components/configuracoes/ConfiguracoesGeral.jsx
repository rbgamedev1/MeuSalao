// src/components/configuracoes/ConfiguracoesGeral.jsx

import { Upload, MapPin, Phone, Mail } from 'lucide-react';
import MaskedInput from '../MaskedInput';

const ConfiguracoesGeral = ({ 
  formData, 
  handleChange, 
  handleLogoUpload, 
  handleSaveGeral, 
  handleDeletarSalao,
  logoPreview,
  saloes 
}) => {
  return (
    <form onSubmit={handleSaveGeral} className="space-y-6">
      {/* Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo do Salão
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
            {logoPreview || formData.logo ? (
              <img 
                src={logoPreview || formData.logo} 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="text-gray-400" size={32} />
            )}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Upload size={18} />
              <span>Upload Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Formatos aceitos: JPG, PNG (máx. 2MB)
            </p>
          </div>
        </div>
      </div>

      {/* Nome do Salão */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Salão *
        </label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Localização */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Localização (Endereço Completo) *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Rua, número - Bairro - Cidade/Estado"
          />
        </div>
      </div>

      {/* Contatos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <MaskedInput
              mask="phone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        {saloes.length > 1 && (
          <button
            type="button"
            onClick={handleDeletarSalao}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Excluir Este Salão
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all ml-auto"
        >
          Salvar Alterações
        </button>
      </div>
    </form>
  );
};

export default ConfiguracoesGeral;