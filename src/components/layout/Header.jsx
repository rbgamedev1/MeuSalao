import { useState, useContext } from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { SalaoContext } from "../../contexts/SalaoContext";
const Header = () => {
  const { salaoAtual, saloes, setSalaoAtual } = useContext(SalaoContext);
  const [showSaloes, setShowSaloes] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Seletor de Salão */}
        <div className="relative">
          <button
            onClick={() => setShowSaloes(!showSaloes)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <span className="font-medium text-gray-700">{salaoAtual.nome}</span>
            <ChevronDown size={18} className="text-gray-500" />
          </button>

          {showSaloes && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {saloes.map((salao) => (
                <button
                  key={salao.id}
                  onClick={() => {
                    setSalaoAtual(salao);
                    setShowSaloes(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                    salao.id === salaoAtual.id ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">{salao.nome}</div>
                  <div className="text-sm text-gray-500">{salao.endereco}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Busca e Notificações */}
        <div className="flex items-center space-x-4">
          {/* Busca */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Notificações */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={22} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;