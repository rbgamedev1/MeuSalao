// src/components/perfil/PerfilHeader.jsx

import { User } from 'lucide-react';

const PerfilHeader = ({ user }) => {
  // Pegar iniciais do nome
  const getInitials = (nome) => {
    if (!nome) return '?';
    const parts = nome.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
          {getInitials(user.nome)}
        </div>
        
        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{user.nome}</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-500">Membro desde</p>
        <p className="text-gray-700 font-medium">
          {new Date(user.criadoEm).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
};

export default PerfilHeader;