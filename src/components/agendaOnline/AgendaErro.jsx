// src/components/agendaOnline/AgendaErro.jsx

import { Calendar, AlertCircle } from 'lucide-react';

const AgendaErro = ({ error, salao, onVoltar }) => {
  // Se for erro de limite de plano
  if (error && error.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {error.title}
            </h2>
            <p className="text-gray-600">
              {error.message}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>{error.suggestion}</strong>
            </p>
          </div>

          <div className="space-y-3">
            {error.showPhone && salao && (
              <>
                <a
                  href={`tel:${salao.telefone.replace(/\D/g, '')}`}
                  className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-center font-medium"
                >
                  📞 Ligar para {salao.nome}
                </a>
                <a
                  href={`https://wa.me/55${salao.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center font-medium"
                >
                  💬 Chamar no WhatsApp
                </a>
              </>
            )}
            <button
              onClick={onVoltar}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Voltar
            </button>
          </div>

          {salao && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="font-medium">{salao.nome}</p>
                <p className="mt-1">{salao.endereco}</p>
                <p className="mt-1">{salao.telefone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Erro genérico (salão não encontrado)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={48} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Salão não encontrado
        </h2>
        <p className="text-gray-600 mb-6">
          Não foi possível carregar as informações deste salão.
        </p>
        <button
          onClick={onVoltar}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default AgendaErro;