// src/pages/Perfil.jsx - Página de Perfil do Usuário

import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SalaoContext } from '../contexts/SalaoContext';
import PerfilHeader from '../components/perfil/PerfilHeader';
import PerfilTabs from '../components/perfil/PerfilTabs';
import PerfilDadosPessoais from '../components/perfil/PerfilDadosPessoais';
import PerfilPlanos from '../components/perfil/PerfilPlanos';
import PerfilSeguranca from '../components/perfil/PerfilSeguranca';

const Perfil = () => {
  const { currentUser } = useContext(AuthContext);
  const { saloes, atualizarSalao } = useContext(SalaoContext);
  
  const [activeTab, setActiveTab] = useState('dados-pessoais');

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PerfilHeader user={currentUser} />
      
      <PerfilTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'dados-pessoais' && (
          <PerfilDadosPessoais user={currentUser} />
        )}

        {activeTab === 'planos' && (
          <PerfilPlanos 
            saloes={saloes}
            atualizarSalao={atualizarSalao}
          />
        )}

        {activeTab === 'seguranca' && (
          <PerfilSeguranca user={currentUser} />
        )}
      </div>
    </div>
  );
};

export default Perfil;