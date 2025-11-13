// src/components/perfil/PerfilDadosPessoais.jsx

import { useState } from 'react';
import { User, Phone, Mail, Save } from 'lucide-react';
import MaskedInput from '../MaskedInput';

const PerfilDadosPessoais = ({ user }) => {
  const [formData, setFormData] = useState({
    nome: user.nome || '',
    email: user.email || '',
    telefone: user.telefone || ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    try {
      // Atualizar dados no localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, ...formData }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Atualizar currentUser
      const currentUser = { ...user, ...formData };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      alert('Dados atualizados com sucesso!');
      setIsEditing(false);
      
      // Recarregar página para atualizar contexto
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar dados. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Informações Pessoais
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Editar
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>

        {/* Email */}
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
              disabled={!isEditing}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>

        {/* Telefone */}
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
              disabled={!isEditing}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  nome: user.nome || '',
                  email: user.email || '',
                  telefone: user.telefone || ''
                });
                setIsEditing(false);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <Save size={18} />
              Salvar Alterações
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PerfilDadosPessoais;