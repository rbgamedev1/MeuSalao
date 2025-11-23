// src/contexts/SalaoContext.jsx - INTEGRADO COM SUPABASE

import { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../services/supabase';

export const SalaoContext = createContext();

export const SalaoProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // Estados principais
  const [saloes, setSaloes] = useState([]);
  const [salaoAtual, setSalaoAtual] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [comandas, setComandas] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [prontuarios, setProntuarios] = useState([]);

  const [loading, setLoading] = useState(true);

  // ========================================
  // CARREGAR DADOS INICIAIS
  // ========================================

  useEffect(() => {
    if (currentUser) {
      carregarDadosIniciais();
    } else {
      limparDados();
    }
  }, [currentUser]);

  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);

      // 1. Carregar salões do usuário
      const { data: saloesData, error: saloesError } = await supabase
        .from('saloes')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: true });

      if (saloesError) throw saloesError;

      setSaloes(saloesData || []);

      // 2. Definir salão atual
      if (saloesData && saloesData.length > 0) {
        const salaoInicial = saloesData.find(s => s.id === currentUser.salaoAtualId) || saloesData[0];
        setSalaoAtual(salaoInicial);

        // 3. Carregar dados do salão atual
        await carregarDadosSalao(salaoInicial.id);
      }

    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosSalao = async (salaoId) => {
    try {
      // Carregar todos os dados em paralelo
      const [
        clientesRes,
        profissionaisRes,
        servicosRes,
        fornecedoresRes,
        produtosRes,
        agendamentosRes,
        transacoesRes,
        comandasRes,
        vendasRes,
        prontuariosRes
      ] = await Promise.all([
        supabase.from('clientes').select('*').eq('salao_id', salaoId),
        supabase.from('profissionais').select('*').eq('salao_id', salaoId),
        supabase.from('servicos').select('*').eq('salao_id', salaoId),
        supabase.from('fornecedores').select('*').eq('salao_id', salaoId),
        supabase.from('produtos').select('*').eq('salao_id', salaoId),
        supabase.from('agendamentos').select('*').eq('salao_id', salaoId),
        supabase.from('transacoes').select('*').eq('salao_id', salaoId),
        supabase.from('comandas').select('*').eq('salao_id', salaoId),
        supabase.from('vendas').select('*').eq('salao_id', salaoId),
        supabase.from('prontuarios').select('*').eq('salao_id', salaoId)
      ]);

      setClientes(clientesRes.data || []);
      setProfissionais(profissionaisRes.data || []);
      setServicos(servicosRes.data || []);
      setFornecedores(fornecedoresRes.data || []);
      setProdutos(produtosRes.data || []);
      setAgendamentos(agendamentosRes.data || []);
      setTransacoes(transacoesRes.data || []);
      setComandas(comandasRes.data || []);
      setVendas(vendasRes.data || []);
      setProntuarios(prontuariosRes.data || []);

    } catch (error) {
      console.error('Erro ao carregar dados do salão:', error);
    }
  };

  const limparDados = () => {
    setSaloes([]);
    setSalaoAtual(null);
    setClientes([]);
    setProfissionais([]);
    setServicos([]);
    setFornecedores([]);
    setProdutos([]);
    setAgendamentos([]);
    setTransacoes([]);
    setComandas([]);
    setVendas([]);
    setProntuarios([]);
    setLoading(false);
  };

  // ========================================
  // TROCAR DE SALÃO
  // ========================================

  const trocarSalao = async (salaoId) => {
    const salao = saloes.find(s => s.id === salaoId);
    if (!salao) return;

    setSalaoAtual(salao);
    await carregarDadosSalao(salaoId);
  };

  // ========================================
  // CRUD DE SALÃO
  // ========================================

  const adicionarSalao = async (dadosSalao) => {
    try {
      const { data, error } = await supabase
        .from('saloes')
        .insert([
          {
            user_id: currentUser.id,
            nome: dadosSalao.nome,
            telefone: dadosSalao.telefone,
            email: dadosSalao.email,
            endereco: dadosSalao.endereco,
            plano: saloes.length > 0 ? saloes[0].plano : 'inicial'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setSaloes([...saloes, data]);
      return data;
    } catch (error) {
      console.error('Erro ao adicionar salão:', error);
      return null;
    }
  };

  const atualizarSalao = async (salaoId, dadosAtualizados) => {
    try {
      const { data, error } = await supabase
        .from('saloes')
        .update(dadosAtualizados)
        .eq('id', salaoId)
        .select()
        .single();

      if (error) throw error;

      setSaloes(saloes.map(s => s.id === salaoId ? data : s));
      
      if (salaoAtual?.id === salaoId) {
        setSalaoAtual(data);
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar salão:', error);
      return null;
    }
  };

  const deletarSalao = async (salaoId) => {
    try {
      if (saloes.length === 1) {
        alert('Você não pode excluir o único salão cadastrado.');
        return false;
      }

      const { error } = await supabase
        .from('saloes')
        .delete()
        .eq('id', salaoId);

      if (error) throw error;

      const novosSaloes = saloes.filter(s => s.id !== salaoId);
      setSaloes(novosSaloes);

      if (salaoAtual?.id === salaoId) {
        const proximoSalao = novosSaloes[0];
        setSalaoAtual(proximoSalao);
        await carregarDadosSalao(proximoSalao.id);
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar salão:', error);
      return false;
    }
  };

  // ========================================
  // FUNÇÕES DE FILTRAGEM (COMPATIBILIDADE)
  // ========================================

  const getClientesPorSalao = useMemo(() => 
    () => salaoAtual ? clientes : [],
    [clientes, salaoAtual]
  );

  const getProfissionaisPorSalao = useMemo(() => 
    () => salaoAtual ? profissionais : [],
    [profissionais, salaoAtual]
  );

  const getServicosPorSalao = useMemo(() => 
    () => salaoAtual ? servicos : [],
    [servicos, salaoAtual]
  );

  const getFornecedoresPorSalao = useMemo(() => 
    () => salaoAtual ? fornecedores : [],
    [fornecedores, salaoAtual]
  );

  const getProdutosPorSalao = useMemo(() => 
    () => salaoAtual ? produtos : [],
    [produtos, salaoAtual]
  );

  const getAgendamentosPorSalao = useMemo(() => 
    () => salaoAtual ? agendamentos : [],
    [agendamentos, salaoAtual]
  );

  const getTransacoesPorSalao = useMemo(() => 
    () => salaoAtual ? transacoes : [],
    [transacoes, salaoAtual]
  );

  const getComandasPorSalao = useMemo(() => 
    () => salaoAtual ? comandas : [],
    [comandas, salaoAtual]
  );

  const getVendasPorSalao = useMemo(() => 
    () => salaoAtual ? vendas : [],
    [vendas, salaoAtual]
  );

  const getProntuariosPorSalao = useMemo(() => 
    () => salaoAtual ? prontuarios : [],
    [prontuarios, salaoAtual]
  );

  const getServicosDisponiveis = useMemo(() => 
    () => {
      if (!salaoAtual || !salaoAtual.categorias_servicos) return [];
      
      const servicosDisponiveis = [];
      
      Object.entries(salaoAtual.categorias_servicos).forEach(([categoriaId, categoriaData]) => {
        if (categoriaData.subcategorias) {
          Object.entries(categoriaData.subcategorias).forEach(([subcategoriaId, subcategoriaData]) => {
            if (subcategoriaData.servicos && Array.isArray(subcategoriaData.servicos)) {
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

  // ========================================
  // HELPERS PARA CRUD (GENÉRICO)
  // ========================================

  const adicionarItem = async (tabela, dados, setState, state) => {
    try {
      const { data, error } = await supabase
        .from(tabela)
        .insert([{ ...dados, salao_id: salaoAtual.id }])
        .select()
        .single();

      if (error) throw error;

      setState([...state, data]);
      return data;
    } catch (error) {
      console.error(`Erro ao adicionar ${tabela}:`, error);
      return null;
    }
  };

  const atualizarItem = async (tabela, id, dados, setState, state) => {
    try {
      const { data, error } = await supabase
        .from(tabela)
        .update(dados)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setState(state.map(item => item.id === id ? data : item));
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar ${tabela}:`, error);
      return null;
    }
  };

  const deletarItem = async (tabela, id, setState, state) => {
    try {
      const { error } = await supabase
        .from(tabela)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setState(state.filter(item => item.id !== id));
      return true;
    } catch (error) {
      console.error(`Erro ao deletar ${tabela}:`, error);
      return false;
    }
  };

  // ========================================
  // WRAPPERS PARA COMPATIBILIDADE
  // ========================================

  // Clientes
  const adicionarCliente = (dados) => adicionarItem('clientes', dados, setClientes, clientes);
  const atualizarCliente = (id, dados) => atualizarItem('clientes', id, dados, setClientes, clientes);
  const deletarCliente = (id) => deletarItem('clientes', id, setClientes, clientes);

  // Profissionais
  const adicionarProfissional = (dados) => adicionarItem('profissionais', dados, setProfissionais, profissionais);
  const atualizarProfissional = (id, dados) => atualizarItem('profissionais', id, dados, setProfissionais, profissionais);
  const deletarProfissional = (id) => deletarItem('profissionais', id, setProfissionais, profissionais);

  // Serviços
  const adicionarServico = (dados) => adicionarItem('servicos', dados, setServicos, servicos);
  const atualizarServico = (id, dados) => atualizarItem('servicos', id, dados, setServicos, servicos);
  const deletarServico = (id) => deletarItem('servicos', id, setServicos, servicos);

  // Produtos
  const adicionarProduto = (dados) => adicionarItem('produtos', dados, setProdutos, produtos);
  const atualizarProduto = (id, dados) => atualizarItem('produtos', id, dados, setProdutos, produtos);
  const deletarProduto = (id) => deletarItem('produtos', id, setProdutos, produtos);

  // Fornecedores
  const adicionarFornecedor = (dados) => adicionarItem('fornecedores', dados, setFornecedores, fornecedores);
  const atualizarFornecedor = (id, dados) => atualizarItem('fornecedores', id, dados, setFornecedores, fornecedores);
  const deletarFornecedor = (id) => deletarItem('fornecedores', id, setFornecedores, fornecedores);

  // Agendamentos
  const adicionarAgendamento = (dados) => adicionarItem('agendamentos', dados, setAgendamentos, agendamentos);
  const atualizarAgendamento = (id, dados) => atualizarItem('agendamentos', id, dados, setAgendamentos, agendamentos);
  const deletarAgendamento = (id) => deletarItem('agendamentos', id, setAgendamentos, agendamentos);

  // Transações
  const adicionarTransacao = (dados) => adicionarItem('transacoes', dados, setTransacoes, transacoes);
  const atualizarTransacao = (id, dados) => atualizarItem('transacoes', id, dados, setTransacoes, transacoes);
  const deletarTransacao = (id) => deletarItem('transacoes', id, setTransacoes, transacoes);

  // Comandas
  const adicionarComanda = (dados) => adicionarItem('comandas', dados, setComandas, comandas);
  const atualizarComanda = (id, dados) => atualizarItem('comandas', id, dados, setComandas, comandas);
  const deletarComanda = (id) => deletarItem('comandas', id, setComandas, comandas);

  // Vendas
  const adicionarVenda = (dados) => adicionarItem('vendas', dados, setVendas, vendas);

  // Prontuários
  const adicionarProntuario = (dados) => adicionarItem('prontuarios', dados, setProntuarios, prontuarios);
  const atualizarProntuario = (id, dados) => atualizarItem('prontuarios', id, dados, setProntuarios, prontuarios);
  const deletarProntuario = (id) => deletarItem('prontuarios', id, setProntuarios, prontuarios);

  // ========================================
  // VALOR DO CONTEXTO
  // ========================================

  const contextValue = useMemo(() => ({
    // Estados
    saloes,
    salaoAtual,
    clientes,
    profissionais,
    servicos,
    fornecedores,
    produtos,
    agendamentos,
    transacoes,
    comandas,
    vendas,
    prontuarios,
    loading,

    // Setters (para compatibilidade com código existente)
    setSaloes,
    setSalaoAtual,
    setClientes,
    setProfissionais,
    setServicos,
    setFornecedores,
    setProdutos,
    setAgendamentos,
    setTransacoes,
    setComandas,
    setVendas,
    setProntuarios,

    // Funções de Salão
    trocarSalao,
    adicionarSalao,
    atualizarSalao,
    deletarSalao,

    // Funções CRUD
    adicionarCliente,
    atualizarCliente,
    deletarCliente,
    adicionarProfissional,
    atualizarProfissional,
    deletarProfissional,
    adicionarServico,
    atualizarServico,
    deletarServico,
    adicionarProduto,
    atualizarProduto,
    deletarProduto,
    adicionarFornecedor,
    atualizarFornecedor,
    deletarFornecedor,
    adicionarAgendamento,
    atualizarAgendamento,
    deletarAgendamento,
    adicionarTransacao,
    atualizarTransacao,
    deletarTransacao,
    adicionarComanda,
    atualizarComanda,
    deletarComanda,
    adicionarVenda,
    adicionarProntuario,
    atualizarProntuario,
    deletarProntuario,

    // Funções de Filtragem
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getFornecedoresPorSalao,
    getProdutosPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao,
    getComandasPorSalao,
    getVendasPorSalao,
    getProntuariosPorSalao,
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
    comandas,
    vendas,
    prontuarios,
    loading,
    getClientesPorSalao,
    getProfissionaisPorSalao,
    getServicosPorSalao,
    getFornecedoresPorSalao,
    getProdutosPorSalao,
    getAgendamentosPorSalao,
    getTransacoesPorSalao,
    getComandasPorSalao,
    getVendasPorSalao,
    getProntuariosPorSalao,
    getServicosDisponiveis
  ]);

  if (loading) {
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