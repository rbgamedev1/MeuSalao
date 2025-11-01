import { useState } from 'react';
import { Plus, Search, Clock, DollarSign, Edit, Trash2, Scissors } from 'lucide-react';
import Modal from '../components/Modal';

const Servicos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    duracao: '',
    valor: '',
    comissao: '',
    descricao: '',
    ativo: true
  });

  const [servicos, setServicos] = useState([
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

  const handleOpenModal = (servico = null) => {
    if (servico) {
      setEditingId(servico.id);
      setFormData({
        nome: servico.nome,
        categoria: servico.categoria,
        duracao: servico.duracao,
        valor: servico.valor.toString(),
        comissao: servico.comissao.toString(),
        descricao: servico.descricao,
        ativo: servico.ativo
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: '',
        categoria: '',
        duracao: '',
        valor: '',
        comissao: '',
        descricao: '',
        ativo: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      nome: '',
      categoria: '',
      duracao: '',
      valor: '',
      comissao: '',
      descricao: '',
      ativo: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setServicos(servicos.map(s => 
        s.id === editingId 
          ? { 
              ...formData, 
              id: editingId,
              valor: parseFloat(formData.valor),
              comissao: parseInt(formData.comissao)
            } 
          : s
      ));
    } else {
      const newServico = {
        ...formData,
        id: Math.max(...servicos.map(s => s.id), 0) + 1,
        valor: parseFloat(formData.valor),
        comissao: parseInt(formData.comissao)
      };
      setServicos([...servicos, newServico]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServicos(servicos.filter(s => s.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
          onClick={() => handleOpenModal()}
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
                <button 
                  onClick={() => handleOpenModal(servico)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button 
                  onClick={() => handleDelete(servico.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro/Edição */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Serviço' : 'Novo Serviço'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Serviço *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Corte Feminino"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Cabelo">Cabelo</option>
                <option value="Tratamento">Tratamento</option>
                <option value="Unhas">Unhas</option>
                <option value="Barbearia">Barbearia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração *
              </label>
              <input
                type="text"
                name="duracao"
                value={formData.duracao}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: 1h, 30min"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
              </label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comissão (%) *
              </label>
              <input
                type="number"
                name="comissao"
                value={formData.comissao}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Descreva o serviço..."
            ></textarea>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Serviço ativo
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              {editingId ? 'Salvar Alterações' : 'Cadastrar Serviço'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Servicos;