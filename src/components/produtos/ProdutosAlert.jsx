// src/components/produtos/ProdutosAlert.jsx
import { AlertTriangle } from 'lucide-react';

const ProdutosAlert = ({ produtosBaixoEstoque }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
      <div className="flex items-center">
        <AlertTriangle className="text-yellow-600 mr-3" size={24} />
        <div>
          <p className="font-semibold text-yellow-800">Atenção!</p>
          <p className="text-yellow-700 text-sm">
            {produtosBaixoEstoque} produto(s) com estoque baixo ou abaixo do mínimo
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProdutosAlert;