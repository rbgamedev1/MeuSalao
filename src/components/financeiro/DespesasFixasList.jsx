// src/components/financeiro/DespesasFixasList.jsx
import { Calendar, Edit, Trash2, Power, PowerOff } from 'lucide-react';

const DespesasFixasList = ({ despesasFixas, handleOpenModal, handleDelete, toggleAtiva }) => {
  if (despesasFixas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-12 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Nenhuma despesa fixa cadastrada</p>
          <p className="text-sm mt-2">
            Cadastre suas despesas mensais como água, luz, aluguel, etc.
          </p>
        </div>
      </div>
    );
  }

  const tipoIcons = {
    'Aluguel': '🏢',
    'Água': '💧',
    'Energia': '⚡',
    'Telefone/Internet': '📞',
    'Salários': '💰',
    'Contador': '📊',
    'Seguro': '🛡️',
    'Assinatura/Software': '💻',
    'Limpeza': '🧹',
    'Outros': '📝'
  };

  const totalMensal = despesasFixas
    .filter(d => d.ativa)
    .reduce((sum, d) => sum + d.valor, 0);

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Total de Despesas Fixas Mensais</p>
            <p className="text-3xl font-bold mt-1">R$ {totalMensal.toFixed(2)}</p>
            <p className="text-sm opacity-75 mt-2">
              {despesasFixas.filter(d => d.ativa).length} despesa(s) ativa(s)
            </p>
          </div>
          <Calendar size={48} className="opacity-75" />
        </div>
      </div>

      {/* Lista de Despesas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {despesasFixas.map(despesa => (
          <div
            key={despesa.id}
            className={`bg-white rounded-lg shadow-sm border-2 p-4 transition-all ${
              despesa.ativa 
                ? 'border-purple-200 hover:shadow-md' 
                : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{tipoIcons[despesa.tipo]}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {despesa.tipo}
                      {despesa.descricao && ` - ${despesa.descricao}`}
                    </h4>
                    {!despesa.ativa && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Pausada
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1 mt-3">
                  <p>
                    <span className="font-medium">Vencimento:</span> Todo dia {despesa.diaVencimento}
                  </p>
                  <p>
                    <span className="font-medium">Forma:</span> {despesa.formaPagamento}
                  </p>
                  {despesa.fornecedor && (
                    <p>
                      <span className="font-medium">Fornecedor:</span> {despesa.fornecedor}
                    </p>
                  )}
                </div>
                
                <div className="text-2xl font-bold text-red-600 mt-3">
                  R$ {despesa.valor.toFixed(2)}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => toggleAtiva(despesa.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    despesa.ativa
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={despesa.ativa ? 'Pausar' : 'Reativar'}
                >
                  {despesa.ativa ? <Power size={18} /> : <PowerOff size={18} />}
                </button>
                <button
                  onClick={() => handleOpenModal(despesa)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(despesa.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DespesasFixasList;