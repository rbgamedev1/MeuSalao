// src/components/perfil/PerfilSeguranca.jsx

import { useState } from 'react';
import { Lock, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';

const PerfilSeguranca = ({ user }) => {
  const [formData, setFormData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar senha atual
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userActual = users.find(u => u.id === user.id);
    
    if (!formData.senhaAtual) {
      newErrors.senhaAtual = 'Senha atual é obrigatória';
    } else if (formData.senhaAtual !== userActual?.password) {
      newErrors.senhaAtual = 'Senha atual incorreta';
    }

    // Validar nova senha
    if (!formData.novaSenha) {
      newErrors.novaSenha = 'Nova senha é obrigatória';
    } else if (formData.novaSenha.length < 6) {
      newErrors.novaSenha = 'Senha deve ter no mínimo 6 caracteres';
    } else if (formData.novaSenha === formData.senhaAtual) {
      newErrors.novaSenha = 'Nova senha deve ser diferente da atual';
    }

    // Validar confirmação
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação é obrigatória';
    } else if (formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Atualizar senha no localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, password: formData.novaSenha }
          : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      alert('Senha alterada com sucesso!');
      
      // Limpar formulário
      setFormData({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Alterar Senha
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Use uma senha forte com no mínimo 6 caracteres
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Senha Atual */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha Atual *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPasswords.senhaAtual ? 'text' : 'password'}
              name="senhaAtual"
              value={formData.senhaAtual}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.senhaAtual ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite sua senha atual"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('senhaAtual')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.senhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.senhaAtual && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.senhaAtual}
            </p>
          )}
        </div>

        {/* Nova Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nova Senha *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPasswords.novaSenha ? 'text' : 'password'}
              name="novaSenha"
              value={formData.novaSenha}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.novaSenha ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite sua nova senha"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('novaSenha')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.novaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.novaSenha && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.novaSenha}
            </p>
          )}
          {formData.novaSenha && !errors.novaSenha && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Senha válida
            </p>
          )}
        </div>

        {/* Confirmar Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Nova Senha *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPasswords.confirmarSenha ? 'text' : 'password'}
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.confirmarSenha ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirme sua nova senha"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword('confirmarSenha')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmarSenha && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.confirmarSenha}
            </p>
          )}
          {formData.confirmarSenha && formData.novaSenha === formData.confirmarSenha && !errors.confirmarSenha && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Senhas coincidem
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Save size={18} />
            Alterar Senha
          </button>
        </div>
      </form>

      {/* Dicas de Segurança */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          💡 Dicas de Segurança
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use uma senha única que você não usa em outros sites</li>
          <li>• Combine letras maiúsculas, minúsculas, números e símbolos</li>
          <li>• Evite informações pessoais óbvias (nome, data de nascimento)</li>
          <li>• Altere sua senha regularmente</li>
        </ul>
      </div>
    </div>
  );
};

export default PerfilSeguranca;