// src/components/relatorios/RelatoriosTables.jsx
import { Users } from 'lucide-react';

const RelatoriosTables = ({ topClientes, profissionaisPerformance }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Clientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Top 5 Clientes</h3>
        </div>
        {topClientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topClientes.map((cliente, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{cliente.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cliente.visitas}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      R$ {cliente.totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum cliente cadastrado</p>
          </div>
        )}
      </div>

      {/* Performance dos Profissionais */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Performance dos Profissionais</h3>
        </div>
        {profissionaisPerformance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profissional</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atend.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profissionaisPerformance.map((prof, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{prof.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{prof.atendimentos}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                      R$ {prof.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum profissional cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatoriosTables;