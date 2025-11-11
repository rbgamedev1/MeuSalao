// src/contexts/SalaoContext.jsx

import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from './AuthContext';
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
  const { currentUser } = useContext(AuthContext);

  // Estados - SEMPRE carregam do localStorage
  const [saloes, setSaloes] = useState(() => loadFromStorage('saloes', []));
  const [salaoAtual, setSalaoAtual] = useState(null);
  const [clientes, setClientes] = useState(() => loadFromStorage('clientes', []));
  const [profissionais, setProfissionais] = useState(() => loadFromStorage('profissionais', []));
  const [servicos, setServicos] = useState(() => loadFromStorage('servicos', []));
  const [fornecedores, setFornecedores] = useState(() => loadFromStorage('fornecedores', []));
  const [produtos, setProdutos] = useState(() => loadFromStorage('produtos', []));
  const [agendamentos, setAgendamentos] = useState(() => loadFromStorage('agendamentos', []));
  const [transacoes, setTransacoes] = useState(() => loadFromStorage('transacoes', []));

  // Definir salão atual quando usuário estiver logado
  useEffect(() => {
    if (currentUser && saloes.length > 0) {
      // Buscar salão do usuário
      const salaoUsuario = saloes.find(s => s.userId === currentUser.id);
      
      if (salaoUsuario) {
        setSalaoAtual(salaoUsuario);
      } else {
        // Se não encontrou, usar o primeiro salão (fallback)
        setSalaoAtual(saloes[0]);
      }
    } else if (!currentUser) {
      setSalaoAtual(null);
    }
  }, [currentUser, saloes]);

  // Salvar no localStorage sempre que os dados mudarem
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage('saloes', saloes);
    }, 300);
    return () => clearTimeout(timer);
  }, [saloes]);

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
      id: Math.max(...saloes.map(s => s.id), 0) + 1,
      plano: dadosSalao.plano || 'inicial',
      userId: currentUser?.id,
      categoriasServicos: {} // Inicializar vazio
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
    
    if (salaoAtual && salaoAtual.id === salaoId) {
      setSalaoAtual({ ...salaoAtual, ...dadosAtualizados });
    }
  };

  // Função para deletar um salão
  const deletarSalao = (salaoId) => {
    const saloesUsuario = saloes.filter(s => s.userId === currentUser.id);
    
    if (saloesUsuario.length === 1) {
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

    // Se o salão deletado era o atual, mudar para o primeiro disponível do usuário
    if (salaoAtual && salaoAtual.id === salaoId) {
      const proximoSalao = novosSaloes.find(s => s.userId === currentUser.id);
      setSalaoAtual(proximoSalao || novosSaloes[0]);
    }

    return true;
  };

  // Filtrar dados pelo salão atual - usando useMemo para performance
  const getClientesPorSalao = useMemo(() => 
    () => salaoAtual ? clientes.filter(c => c.salaoId === salaoAtual.id) : [],
    [clientes, salaoAtual]
  );

  const getProfissionaisPorSalao = useMemo(() => 
    () => salaoAtual ? profissionais.filter(p => p.salaoId === salaoAtual.id) : [],
    [profissionais, salaoAtual]
  );

  const getServicosPorSalao = useMemo(() => 
    () => salaoAtual ? servicos.filter(s => s.salaoId === salaoAtual.id) : [],
    [servicos, salaoAtual]
  );

  const getFornecedoresPorSalao = useMemo(() => 
    () => salaoAtual ? fornecedores.filter(f => f.salaoId === salaoAtual.id) : [],
    [fornecedores, salaoAtual]
  );

  const getProdutosPorSalao = useMemo(() => 
    () => salaoAtual ? produtos.filter(p => p.salaoId === salaoAtual.id) : [],
    [produtos, salaoAtual]
  );

  const getAgendamentosPorSalao = useMemo(() => 
    () => salaoAtual ? agendamentos.filter(a => a.salaoId === salaoAtual.id) : [],
    [agendamentos, salaoAtual]
  );

  const getTransacoesPorSalao = useMemo(() => 
    () => salaoAtual ? transacoes.filter(t => t.salaoId === salaoAtual.id) : [],
    [transacoes, salaoAtual]
  );

  // Obter serviços disponíveis (flatten da estrutura de categorias)
  const getServicosDisponiveis = useMemo(() => 
    () => {
      if (!salaoAtual || !salaoAtual.categoriasServicos) return [];
      
      const servicosDisponiveis = [];
      
      Object.entries(salaoAtual.categoriasServicos).forEach(([categoriaId, categoriaData]) => {
        if (categoriaData.ativa && categoriaData.subcategorias) {
          Object.entries(categoriaData.subcategorias).forEach(([subcategoriaId, subcategoriaData]) => {
            if (subcategoriaData.ativa && subcategoriaData.servicos) {
              subcategoriaData.servicos.forEach(servico => {
                servicosDisponiveis.push({
                  categoriaId,
                  subcategoriaId,
                  nome: servico
                });
              });
            }
          });
        }
      });
      
      return servicosDisponiveis;
    },
    [salaoAtual]
  );

  // Valor do contexto memoizado
  const contextValue = useMemo(() => ({
    saloes: saloes.filter(s => s.userId === currentUser?.id),
    salaoAtual,
    setSalaoAtual,
    adicionarSalao,
    atualizarSalao,
    deletarSalao,
    clientes,
    setClientes,
    profissionais,
    setProfissionais,
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
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getFornecedoresPorSalao,
    getProdutosPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao,
    getServicosDisponiveis
  }), [
    saloes,
    salaoAtual,
    clientes,
    profissionais,
    servicos,
    fornecedores,
    produtos,
    agendamentos,
    transacoes,
    currentUser,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getFornecedoresPorSalao,
    getProdutosPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao,
    getServicosDisponiveis
  ]);

  // Não renderizar até ter definido o salão atual (se houver usuário logado)
  if (currentUser && !salaoAtual && saloes.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <SalaoContext.Provider value={contextValue}>
      {children}
    </SalaoContext.Provider>
  );
};