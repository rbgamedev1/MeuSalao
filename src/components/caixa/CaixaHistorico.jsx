// src/components/caixa/CaixaHistorico.jsx
import { useState } from 'react';
import { Receipt, Calendar, User, DollarSign, Package, Scissors, CreditCard } from 'lucide-react';

const CaixaHistorico = ({ vendas }) => {
  const [dataFiltro, setDataFiltro] = useState('');

  const vendasFiltradas = dataFiltro
    ? vendas.filter(v => v.data === dataFiltro)
    : vendas;

  const vendasOrdenadas = [...vendasFiltradas].sort((a, b) => {
    const [diaA, mesA, anoA] = a.data.split('/');
    const [diaB, mesB, anoB] = b.data.split('/');
    const dataA = new Date(anoA, mesA - 1, diaA, ...a.hora.split(':'));
    const dataB = new Date(anoB, mesB - 1, diaB, ...b.hora.split(':'));
    return dataB - dataA;
  });

  const totalDia = vendasFiltradas.reduce((sum, v) => sum + v.total, 0);

  return (
    <div className="space-y-6">
      {/* Header com Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vendas Hoje</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{vendasFiltradas.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Receipt className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vendido</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                R$ {totalDia.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                R$ {vendasFiltradas.length > 0 ? (totalDia / vendasFiltradas.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Receipt className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vendas</p>
              <p className="text-3xl font-bold text-pink-600 mt-1">{vendas.length}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <Calendar className="text-pink-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtro */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por data:</label>
          <input
            type="date"
            value={dataFiltro ? dataFiltro.split('/').reverse().join('-') : ''}
            onChange={(e) => {
              if (e.target.value) {
                const [ano, mes, dia] = e.target.value.split('-');
                setDataFiltro(`${dia}/${mes}/${ano}`);
              } else {
                setDataFiltro('');
              }
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {dataFiltro && (
            <button
              onClick={() => setDataFiltro('')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Limpar Filtro
            </button>
          )}
        </div>
      </div>

      {/* Lista de Vendas */}
      {vendasOrdenadas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Receipt size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg font-medium">Nenhuma venda encontrada</p>
          <p className="text-gray-400 text-sm mt-2">
            {dataFiltro ? 'Tente outra data' : 'As vendas aparecerão aqui'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Venda
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Itens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vendasOrdenadas.map(venda => (
                  <tr key={venda.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Receipt size={18} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Venda #{venda.id}</p>
                          <p className="text-sm text-gray-500">
                            {venda.data} às {venda.hora}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-gray-700">{venda.clienteNome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {venda.itens.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            {item.tipo === 'servico' ? (
                              <Scissors size={12} className="text-purple-500" />
                            ) : (
                              <Package size={12} className="text-pink-500" />
                            )}
                            <span className="text-gray-700">
                              {item.quantidade}x {item.nome}
                            </span>
                          </div>
                        ))}
                        {venda.itens.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{venda.itens.length - 2} mais
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <CreditCard size={16} className="text-gray-400" />
                        <span className="text-gray-700 text-sm">{venda.formaPagamento}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-green-600 text-lg">
                          R$ {venda.total.toFixed(2)}
                        </p>
                        {venda.desconto > 0 && (
                          <p className="text-xs text-gray-500">
                            Desc: R$ {venda.desconto.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaixaHistorico;