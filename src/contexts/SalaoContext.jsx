// src/contexts/SalaoContext.jsx
import { createContext, useState, useEffect, useMemo } from 'react';
import { getTodayBR, dateFromISO } from '../utils/masks';

export const SalaoContext = createContext();

// Função auxiliar para carregar dados do localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Erro ao carregar ${key}:`, error);
    return defaultValue;
  }
};

// Função auxiliar para salvar dados no localStorage
const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
  }
};

export const SalaoProvider = ({ children }) => {
  // Dados iniciais padrão
  const defaultSaloes = [
    {
      id: 1,
      nome: 'Salão Beleza Total',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 98765-4321',
      email: 'contato@belezatotal.com.br',
      logo: null,
      plano: 'profissional'
    }
  ];

  const defaultClientes = [
    {
      id: 1,
      nome: 'Maria Silva',
      telefone: '(11) 98765-4321',
      email: 'maria.silva@email.com',
      dataNascimento: '15/03/1985',
      ultimaVisita: '25/10/2025',
      totalGasto: 2450.00,
      visitas: 18,
      status: 'ativo',
      salaoId: 1
    },
    {
      id: 2,
      nome: 'João Santos',
      telefone: '(11) 91234-5678',
      email: 'joao.santos@email.com',
      dataNascimento: '22/07/1990',
      ultimaVisita: '28/10/2025',
      totalGasto: 890.00,
      visitas: 8,
      status: 'ativo',
      salaoId: 1
    },
    {
      id: 3,
      nome: 'Paula Souza',
      telefone: '(11) 99876-5432',
      email: 'paula.souza@email.com',
      dataNascimento: '10/11/1988',
      ultimaVisita: '30/10/2025',
      totalGasto: 3120.00,
      visitas: 24,
      status: 'ativo',
      salaoId: 1
    }
  ];

  const defaultProfissionais = [
    { 
      id: 1, 
      nome: 'Ana Costa', 
      especialidades: ['Corte', 'Coloração', 'Escova', 'Hidratação'],
      telefone: '(11) 91111-1111',
      email: 'ana@salao.com',
      salaoId: 1
    },
    { 
      id: 2, 
      nome: 'Carlos Lima', 
      especialidades: ['Corte', 'Barba'],
      telefone: '(11) 92222-2222',
      email: 'carlos@salao.com',
      salaoId: 1
    },
    { 
      id: 3, 
      nome: 'Beatriz Silva', 
      especialidades: ['Manicure', 'Pedicure'],
      telefone: '(11) 93333-3333',
      email: 'beatriz@salao.com',
      salaoId: 1
    },
    { 
      id: 4, 
      nome: 'Diego Santos', 
      especialidades: ['Corte', 'Coloração'],
      telefone: '(11) 94444-4444',
      email: 'diego@salao.com',
      salaoId: 1
    }
  ];

  const defaultCategorias = ['Cabelo', 'Coloração', 'Unhas', 'Tratamento', 'Barbearia'];

  const defaultServicos = [
    {
      id: 1,
      nome: 'Corte Feminino',
      categoria: 'Cabelo',
      duracao: 45,
      valor: 80.00,
      comissao: 40,
      descricao: 'Corte personalizado para cabelo feminino',
      profissionaisHabilitados: [1, 4],
      ativo: true,
      salaoId: 1
    },
    {
      id: 2,
      nome: 'Corte Masculino',
      categoria: 'Cabelo',
      duracao: 30,
      valor: 45.00,
      comissao: 40,
      descricao: 'Corte tradicional ou moderno',
      profissionaisHabilitados: [2],
      ativo: true,
      salaoId: 1
    },
    {
      id: 3,
      nome: 'Coloração Completa',
      categoria: 'Coloração',
      duracao: 120,
      valor: 250.00,
      comissao: 35,
      descricao: 'Coloração completa com produtos profissionais',
      profissionaisHabilitados: [1, 4],
      ativo: true,
      salaoId: 1
    },
    {
      id: 4,
      nome: 'Escova',
      categoria: 'Cabelo',
      duracao: 40,
      valor: 60.00,
      comissao: 40,
      descricao: 'Escova modeladora',
      profissionaisHabilitados: [1],
      ativo: true,
      salaoId: 1
    },
    {
      id: 5,
      nome: 'Hidratação',
      categoria: 'Tratamento',
      duracao: 60,
      valor: 90.00,
      comissao: 35,
      descricao: 'Tratamento hidratante profundo',
      profissionaisHabilitados: [1],
      ativo: true,
      salaoId: 1
    },
    {
      id: 6,
      nome: 'Manicure',
      categoria: 'Unhas',
      duracao: 45,
      valor: 35.00,
      comissao: 50,
      descricao: 'Cuidados com as unhas das mãos',
      profissionaisHabilitados: [3],
      ativo: true,
      salaoId: 1
    },
    {
      id: 7,
      nome: 'Barba',
      categoria: 'Barbearia',
      duracao: 30,
      valor: 40.00,
      comissao: 45,
      descricao: 'Corte e design de barba',
      profissionaisHabilitados: [2],
      ativo: true,
      salaoId: 1
    }
  ];

  const defaultFornecedores = [
    { 
      id: 1, 
      nome: 'Distribuidora Beauty', 
      telefone: '(11) 3456-7890',
      email: 'contato@beauty.com',
      cnpj: '12.345.678/0001-90',
      endereco: 'Rua do Comércio, 100',
      salaoId: 1
    },
    { 
      id: 2, 
      nome: 'Beauty Supply', 
      telefone: '(11) 3456-7891',
      email: 'contato@beautysupply.com',
      cnpj: '98.765.432/0001-10',
      endereco: 'Av. dos Fornecedores, 200',
      salaoId: 1
    },
    { 
      id: 3, 
      nome: 'Cosméticos Brasil', 
      telefone: '(11) 3456-7892',
      email: 'contato@cosmeticosbrasil.com',
      cnpj: '11.222.333/0001-44',
      endereco: 'Rua das Indústrias, 300',
      salaoId: 1
    }
  ];

  const defaultProdutos = [
    {
      id: 1,
      nome: 'Shampoo Profissional 1L',
      categoria: 'Cabelo',
      marca: 'L\'Oréal',
      estoque: 15,
      estoqueMinimo: 10,
      valorCusto: 45.00,
      valorVenda: 89.90,
      fornecedorId: 1,
      codigo: 'SHMP001',
      salaoId: 1
    }
  ];

  const defaultAgendamentos = [
    {
      id: 1,
      clienteId: 1,
      servicoId: 1,
      profissionalId: 1,
      data: '01/11/2025',
      horario: '14:00',
      status: 'confirmado',
      salaoId: 1
    }
  ];

  const defaultTransacoes = [
    {
      id: 1,
      tipo: 'receita',
      descricao: 'Serviço - Corte + Escova',
      categoria: 'Serviços',
      valor: 120.00,
      formaPagamento: 'Cartão de Crédito',
      data: '01/11/2025',
      cliente: 'Maria Silva',
      status: 'confirmado',
      salaoId: 1
    }
  ];

  // Estados com carregamento do localStorage
  const [saloes, setSaloes] = useState(() => loadFromStorage('saloes', defaultSaloes));
  const [salaoAtual, setSalaoAtual] = useState(() => {
    const saved = loadFromStorage('salaoAtual', null);
    return saved || saloes[0];
  });
  const [clientes, setClientes] = useState(() => loadFromStorage('clientes', defaultClientes));
  const [profissionais, setProfissionais] = useState(() => loadFromStorage('profissionais', defaultProfissionais));
  const [categorias, setCategorias] = useState(() => loadFromStorage('categorias', defaultCategorias));
  const [servicos, setServicos] = useState(() => loadFromStorage('servicos', defaultServicos));
  const [fornecedores, setFornecedores] = useState(() => loadFromStorage('fornecedores', defaultFornecedores));
  const [produtos, setProdutos] = useState(() => loadFromStorage('produtos', defaultProdutos));
  const [agendamentos, setAgendamentos] = useState(() => loadFromStorage('agendamentos', defaultAgendamentos));
  const [transacoes, setTransacoes] = useState(() => loadFromStorage('transacoes', defaultTransacoes));

  // Salvar no localStorage sempre que os dados mudarem - com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('saloes', saloes);
    }, 300);
    return () => clearTimeout(timer);
  }, [saloes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('salaoAtual', salaoAtual);
    }, 300);
    return () => clearTimeout(timer);
  }, [salaoAtual]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('clientes', clientes);
    }, 300);
    return () => clearTimeout(timer);
  }, [clientes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('profissionais', profissionais);
    }, 300);
    return () => clearTimeout(timer);
  }, [profissionais]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('categorias', categorias);
    }, 300);
    return () => clearTimeout(timer);
  }, [categorias]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('servicos', servicos);
    }, 300);
    return () => clearTimeout(timer);
  }, [servicos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('fornecedores', fornecedores);
    }, 300);
    return () => clearTimeout(timer);
  }, [fornecedores]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('produtos', produtos);
    }, 300);
    return () => clearTimeout(timer);
  }, [produtos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('agendamentos', agendamentos);
    }, 300);
    return () => clearTimeout(timer);
  }, [agendamentos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('transacoes', transacoes);
    }, 300);
    return () => clearTimeout(timer);
  }, [transacoes]);

  // Função para adicionar novo salão
  const adicionarSalao = (dadosSalao) => {
    const novoSalao = {
      ...dadosSalao,
      id: Math.max(...saloes.map(s => s.id), 0) + 1
    };
    setSaloes([...saloes, novoSalao]);
    return novoSalao;
  };

  // Função para atualizar informações do salão
  const atualizarSalao = (salaoId, dadosAtualizados) => {
    const saloesAtualizados = saloes.map(s => 
      s.id === salaoId ? { ...s, ...dadosAtualizados } : s
    );
    setSaloes(saloesAtualizados);
    
    if (salaoAtual.id === salaoId) {
      setSalaoAtual({ ...salaoAtual, ...dadosAtualizados });
    }
  };

  // Função para deletar um salão
  const deletarSalao = (salaoId) => {
    if (saloes.length === 1) {
      alert('Você não pode excluir o único salão cadastrado.');
      return false;
    }

    // Remover todos os dados relacionados ao salão
    setClientes(clientes.filter(c => c.salaoId !== salaoId));
    setProfissionais(profissionais.filter(p => p.salaoId !== salaoId));
    setServicos(servicos.filter(s => s.salaoId !== salaoId));
    setFornecedores(fornecedores.filter(f => f.salaoId !== salaoId));
    setProdutos(produtos.filter(p => p.salaoId !== salaoId));
    setAgendamentos(agendamentos.filter(a => a.salaoId !== salaoId));
    setTransacoes(transacoes.filter(t => t.salaoId !== salaoId));
    
    const novosSaloes = saloes.filter(s => s.id !== salaoId);
    setSaloes(novosSaloes);

    // Se o salão deletado era o atual, mudar para o primeiro disponível
    if (salaoAtual.id === salaoId) {
      setSalaoAtual(novosSaloes[0]);
    }

    return true;
  };

  // Função para resetar dados do salão atual
  const resetarDadosSalao = () => {
    if (confirm(`Tem certeza que deseja resetar todos os dados do salão "${salaoAtual.nome}"? Esta ação não pode ser desfeita!`)) {
      // Remove apenas os dados do salão atual
      setClientes(clientes.filter(c => c.salaoId !== salaoAtual.id));
      setProfissionais(profissionais.filter(p => p.salaoId !== salaoAtual.id));
      setServicos(servicos.filter(s => s.salaoId !== salaoAtual.id));
      setFornecedores(fornecedores.filter(f => f.salaoId !== salaoAtual.id));
      setProdutos(produtos.filter(p => p.salaoId !== salaoAtual.id));
      setAgendamentos(agendamentos.filter(a => a.salaoId !== salaoAtual.id));
      setTransacoes(transacoes.filter(t => t.salaoId !== salaoAtual.id));
      
      alert('Dados do salão resetados com sucesso!');
    }
  };

  // Função para resetar TODOS os dados do sistema
  const resetarTodosSistema = () => {
    if (confirm('Tem certeza que deseja resetar TODOS os dados do sistema? Todos os salões e dados serão perdidos!')) {
      localStorage.clear();
      setSaloes(defaultSaloes);
      setSalaoAtual(defaultSaloes[0]);
      setClientes(defaultClientes);
      setProfissionais(defaultProfissionais);
      setCategorias(defaultCategorias);
      setServicos(defaultServicos);
      setFornecedores(defaultFornecedores);
      setProdutos(defaultProdutos);
      setAgendamentos(defaultAgendamentos);
      setTransacoes(defaultTransacoes);
      alert('Sistema resetado com sucesso!');
    }
  };

  // Filtrar dados pelo salão atual - usando useMemo para performance
  const getClientesPorSalao = useMemo(() => 
    () => clientes.filter(c => c.salaoId === salaoAtual.id),
    [clientes, salaoAtual.id]
  );

  const getProfissionaisPorSalao = useMemo(() => 
    () => profissionais.filter(p => p.salaoId === salaoAtual.id),
    [profissionais, salaoAtual.id]
  );

  const getServicosPorSalao = useMemo(() => 
    () => servicos.filter(s => s.salaoId === salaoAtual.id),
    [servicos, salaoAtual.id]
  );

  const getFornecedoresPorSalao = useMemo(() => 
    () => fornecedores.filter(f => f.salaoId === salaoAtual.id),
    [fornecedores, salaoAtual.id]
  );

  const getProdutosPorSalao = useMemo(() => 
    () => produtos.filter(p => p.salaoId === salaoAtual.id),
    [produtos, salaoAtual.id]
  );

  const getAgendamentosPorSalao = useMemo(() => 
    () => agendamentos.filter(a => a.salaoId === salaoAtual.id),
    [agendamentos, salaoAtual.id]
  );

  const getTransacoesPorSalao = useMemo(() => 
    () => transacoes.filter(t => t.salaoId === salaoAtual.id),
    [transacoes, salaoAtual.id]
  );

  // Valor do contexto memoizado
  const contextValue = useMemo(() => ({
    saloes,
    salaoAtual,
    setSalaoAtual,
    adicionarSalao,
    atualizarSalao,
    deletarSalao,
    clientes,
    setClientes,
    profissionais,
    setProfissionais,
    categorias,
    setCategorias,
    servicos,
    setServicos,
    fornecedores,
    setFornecedores,
    produtos,
    setProdutos,
    agendamentos,
    setAgendamentos,
    transacoes,
    setTransacoes,
    resetarDadosSalao,
    resetarTodosSistema,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getFornecedoresPorSalao,
    getProdutosPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao
  }), [
    saloes,
    salaoAtual,
    clientes,
    profissionais,
    categorias,
    servicos,
    fornecedores,
    produtos,
    agendamentos,
    transacoes,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getFornecedoresPorSalao,
    getProdutosPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao
  ]);

  return (
    <SalaoContext.Provider value={contextValue}>
      {children}
    </SalaoContext.Provider>
  );
};