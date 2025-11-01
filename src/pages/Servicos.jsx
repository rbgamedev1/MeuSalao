import { useState } from 'react';
import { Plus, Search, Clock, DollarSign, Edit, Trash2, Scissors } from 'lucide-react';

const Servicos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [servicos] = useState([
    {
      id: 1,
      nome: 'Corte Feminino',
      categoria: 'Cabelo',
      duracao: '45min',
      valor: 80.00,
      comissao: 40,
      descricao: 'Corte personalizado para cabelo feminino',
      ativo: true
    },
    {
      id: 2,
      nome: 'Corte Masculino',
      categoria: 'Cabelo',
      duracao: '30min',
      valor: 45.00,
      comissao: 40,
      descricao: 'Corte tradicional ou moderno',
      ativo: true
    },
    {
      id: 3,
      nome: 'Coloração Completa',
      categoria: 'Cabelo',
      duracao: '2h',
      valor: 250.00,
      comissao: 35,
      descricao: 'Coloração completa com produtos profissionais',
      ativo: true
    },
    {
      id: 4,
      nome: 'Escova',
      categoria: 'Cabelo',
      duracao: '40min',
      valor: 60.00,
      comissao: 40,
      descricao: 'Escova modeladora',
      ativo: true
    },
    {
      id: 5,
      nome: 'Hidratação',
      categoria: 'Tratamento',
      duracao: '1h',
      valor: 90.00,
      comissao: 35,
      descricao: 'Tratamento hidratante profundo',
      ativo: true
    },
    {
      id: 6,
      nome: 'Manicure',
      categoria: 'Unhas',
      duracao: '45min',
      valor: 35.00,
      comissao: 50,
      descricao: 'Cuidados com as unhas das mãos',
      ativo: true
    },
    {
      id: 7,
      nome: 'Pedicure',
      categoria: 'Unhas',
      duracao: '50min',
      valor: 40.00,
      comissao: 50,
      descricao: 'Cuidados com as unhas dos pés',
      ativo: true
    },
    {
      id: 8,
      nome: 'Barba',
      categoria: 'Barbearia',
      duracao: '30min',
      valor: 40.00,
      comissao: 45,
      descricao: 'Corte e design de barba',
      ativo: true
    }
  ]);

  const categorias = ['Todos', 'Cabelo', 'Tratamento', 'Unhas', 'Barbearia'];
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  const filteredServicos = servicos.filter(servico => {
    const matchSearch = servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servico.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === 'Todos' || servico.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const totalServicos = servicos.length;
  const valorMedio = servicos.reduce((acc, s) => acc + s.valor, 0) / servicos.length;
  const servicosMaisCaros = servicos.filter(s => s.valor > 100).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Serviços</h1>
          <p className="text-gray-600 mt-1">Gerencie os serviços do seu salão</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Serviços</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalServicos}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Scissors className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Médio</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                R$ {valorMedio.toFixed(0)}
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
              <p className="text-sm text-gray-600">Serviços Premium</p>
              <p className="text-3xl font-bold text-pink-600 mt-1">{servicosMaisCaros}</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <Scissors className="text-pink-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Duração Média</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">52min</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select 
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServicos.map((servico) => (
          <div key={servico.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{servico.nome}</h3>
                  <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {servico.categoria}
                  </span>
                </div>
                <div className={`w-3 h-3 rounded-full ${servico.ativo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{servico.descricao}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={16} />
                    <span>Duração</span>
                  </div>
                  <span className="font-medium text-gray-800">{servico.duracao}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign size={16} />
                    <span>Valor</span>
                  </div>
                  <span className="font-bold text-green-600">R$ {servico.valor.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Comissão</span>
                  <span className="font-medium text-purple-600">{servico.comissao}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

export default Servicos;