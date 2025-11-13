// src/components/configuracoes/ConfiguracoesProfissionais.jsx - CORRIGIDO

import { Plus, Lock, Crown, Edit, Trash2, Phone, Mail, Users } from 'lucide-react';

const ConfiguracoesProfissionais = ({ 
  profissionaisSalao,
  canAddProfissional,
  limiteProfissionais,
  salaoPlano,
  onOpenModal,
  onEditProfissional,
  onDeleteProfissional
}) => {
  // ✅ CORREÇÃO: Função auxiliar para formatar a mensagem de limite
  const formatarLimite = () => {
    if (!limiteProfissionais) return '';
    
    // Se for string, processar normalmente
    if (typeof limiteProfissionais === 'string') {
      if (limiteProfissionais === 'Ilimitado') {
        return '(Ilimitado)';
      }
      // Remove "Máximo: " se existir (retorno de getLimitMessage)
      const numero = limiteProfissionais.replace('Máximo: ', '').trim();
      return `/ ${numero}`;
    }
    
    // Se for número, retornar diretamente
    if (typeof limiteProfissionais === 'number') {
      return `/ ${limiteProfissionais}`;
    }
    
    return '';
  };

  // ✅ CORREÇÃO: Extrair número do limite para mensagem de alerta
  const extrairNumeroLimite = () => {
    if (typeof limiteProfissionais === 'string') {
      return limiteProfissionais.replace('Máximo: ', '').trim();
    }
    if (typeof limiteProfissionais === 'number') {
      return limiteProfissionais.toString();
    }
    return limiteProfissionais;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Gerenciar Profissionais
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Profissionais: {profissionaisSalao?.length || 0} {formatarLimite()}
          </p>
        </div>
        <button
          onClick={onOpenModal}
          disabled={!canAddProfissional}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            canAddProfissional
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canAddProfissional ? <Plus size={18} /> : <Lock size={18} />}
          <span>Adicionar Profissional</span>
        </button>
      </div>

      {/* Alerta de Limite */}
      {!canAddProfissional && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <Crown className="text-yellow-600 mr-3 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">Limite de profissionais atingido!</p>
              <p className="text-yellow-700 text-sm mt-1">
                Seu plano <strong>{salaoPlano}</strong> permite até <strong>{extrairNumeroLimite()}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Profissionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profissionaisSalao && profissionaisSalao.length > 0 ? (
          profissionaisSalao.map(prof => (
            <div key={prof.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                    {prof.nome?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{prof.nome}</h4>
                    <p className="text-sm text-gray-600">
                      {prof.especialidades?.join(', ') || 'Sem especialidades'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onEditProfissional(prof)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar profissional"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteProfissional(prof.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir profissional"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                {prof.telefone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <span>{prof.telefone}</span>
                  </div>
                )}
                {prof.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <span>{prof.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum profissional cadastrado neste salão.</p>
            <p className="text-sm mt-2">Clique em "Adicionar Profissional" para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracoesProfissionais;