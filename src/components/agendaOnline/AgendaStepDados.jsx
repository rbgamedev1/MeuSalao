// src/components/agendaOnline/AgendaStepDados.jsx

import { User, Phone, Mail } from 'lucide-react';
import { maskPhone } from '../../utils/masks';

const AgendaStepDados = ({ formData, errors, onChange }) => {
  const handlePhoneChange = (e) => {
    const masked = maskPhone(e.target.value);
    onChange({ target: { name: 'telefone', value: masked } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Seus Dados
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome Completo *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Seu nome completo"
          />
        </div>
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Telefone *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handlePhoneChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="(11) 98765-4321"
          />
        </div>
        {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="seu@email.com"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        <p className="text-xs text-gray-500 mt-1">📧 Você receberá a confirmação neste email</p>
      </div>
    </div>
  );
};

export default AgendaStepDados;