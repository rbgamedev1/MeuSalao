import { createContext, useState } from 'react';

export const SalaoContext = createContext();

export const SalaoProvider = ({ children }) => {
  const [saloes] = useState([
    {
      id: 1,
      nome: 'Salão Beleza Total',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 98765-4321',
      email: 'contato@belezatotal.com.br'
    },
    {
      id: 2,
      nome: 'Estilo & Charme',
      endereco: 'Av. Principal, 456 - Jardins',
      telefone: '(11) 91234-5678',
      email: 'contato@estilocharme.com.br'
    }
  ]);

  const [salaoAtual, setSalaoAtual] = useState(saloes[0]);

  // Clientes
  const [clientes, setClientes] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      telefone: '(11) 98765-4321',
      email: 'maria.silva@email.com',
      dataNascimento: '15/03/1985',
      ultimaVisita: '25/10/2025',
      totalGasto: 2450.00,
      visitas: 18,
      status: 'ativo'
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
      status: 'ativo'
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
      status: 'ativo'
    }
  ]);

  // Profissionais
  const [profissionais, setProfissionais] = useState([
    { 
      id: 1, 
      nome: 'Ana Costa', 
      especialidades: ['Corte', 'Coloração', 'Escova', 'Hidratação'],
      telefone: '(11) 91111-1111',
      email: 'ana@salao.com'
    },
    { 
      id: 2, 
      nome: 'Carlos Lima', 
      especialidades: ['Corte', 'Barba'],
      telefone: '(11) 92222-2222',
      email: 'carlos@salao.com'
    },
    { 
      id: 3, 
      nome: 'Beatriz Silva', 
      especialidades: ['Manicure', 'Pedicure'],
      telefone: '(11) 93333-3333',
      email: 'beatriz@salao.com'
    },
    { 
      id: 4, 
      nome: 'Diego Santos', 
      especialidades: ['Corte', 'Coloração'],
      telefone: '(11) 94444-4444',
      email: 'diego@salao.com'
    }
  ]);

  // Categorias de Serviços
  const [categorias, setCategorias] = useState([
    'Cabelo',
    'Coloração',
    'Unhas',
    'Tratamento',
    'Barbearia'
  ]);

  // Serviços
  const [servicos, setServicos] = useState([
    {
      id: 1,
      nome: 'Corte Feminino',
      categoria: 'Cabelo',
      duracao: 45,
      valor: 80.00,
      comissao: 40,
      descricao: 'Corte personalizado para cabelo feminino',
      profissionaisHabilitados: [1, 4],
      ativo: true
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
      ativo: true
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
      ativo: true
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
      ativo: true
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
      ativo: true
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
      ativo: true
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
      ativo: true
    }
  ]);

  // Fornecedores
  const [fornecedores, setFornecedores] = useState([
    { 
      id: 1, 
      nome: 'Distribuidora Beauty', 
      telefone: '(11) 3456-7890',
      email: 'contato@beauty.com',
      cnpj: '12.345.678/0001-90',
      endereco: 'Rua do Comércio, 100'
    },
    { 
      id: 2, 
      nome: 'Beauty Supply', 
      telefone: '(11) 3456-7891',
      email: 'contato@beautysupply.com',
      cnpj: '98.765.432/0001-10',
      endereco: 'Av. dos Fornecedores, 200'
    },
    { 
      id: 3, 
      nome: 'Cosméticos Brasil', 
      telefone: '(11) 3456-7892',
      email: 'contato@cosmeticosbrasil.com',
      cnpj: '11.222.333/0001-44',
      endereco: 'Rua das Indústrias, 300'
    }
  ]);

  return (
    <SalaoContext.Provider value={{
      saloes,
      salaoAtual,
      setSalaoAtual,
      clientes,
      setClientes,
      profissionais,
      setProfissionais,
      categorias,
      setCategorias,
      servicos,
      setServicos,
      fornecedores,
      setFornecedores
    }}>
      {children}
    </SalaoContext.Provider>
  );
};