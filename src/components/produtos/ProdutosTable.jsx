// src/components/produtos/ProdutosTable.jsx
import { Package, AlertTriangle, Edit, Trash2, Phone } from 'lucide-react';

const ProdutosTable = ({ filteredProdutos, getFornecedor, handleOpenModal, handleDelete }) => {
  if (filteredProdutos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="text-center py-12 text-gray-500">
          <Package size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum produto encontrado para este salão.</p>
          <p className="text-sm mt-2">Clique em "Novo Produto" para adicionar o primeiro produto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fornecedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estoque
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Custo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Venda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProdutos.map((produto) => {
              const margem = ((produto.valorVenda - produto.valorCusto) / produto.valorCusto * 100).toFixed(1);
              const estoqueBaixo = produto.estoque <= produto.estoqueMinimo;
              const fornecedor = getFornecedor(produto.fornecedorId);
              
              return (
                <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">{produto.nome}</p>
                      <p className="text-sm text-gray-500">{produto.marca} • {produto.codigo}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {produto.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {fornecedor ? (
                      <div>
                        <p className="text-sm font-medium text-gray-800">{fornecedor.nome}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <Phone size={12} />
                          <span>{fornecedor.telefone}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sem fornecedor</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${estoqueBaixo ? 'text-red-600' : 'text-gray-800'}`}>
                        {produto.estoque}
                      </span>
                      {estoqueBaixo && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Mín: {produto.estoqueMinimo}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    R$ {produto.valorCusto.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    R$ {produto.valorVenda.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-purple-600">{margem}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpenModal(produto)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(produto.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProdutosTable;