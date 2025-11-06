// src/contexts/AuthContext.jsx - Contexto de Autenticação

import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar usuário do localStorage ao iniciar
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      // Obter usuários existentes
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar se email já existe
      const emailExists = users.some(u => u.email === userData.email);
      if (emailExists) {
        throw new Error('Email já cadastrado');
      }

      // Criar novo usuário
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        nome: userData.nome,
        email: userData.email,
        password: userData.password,
        telefone: userData.telefone,
        criadoEm: new Date().toISOString()
      };

      // Salvar usuário
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Criar salão inicial para o usuário
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const novoSalao = {
        id: Math.max(...saloes.map(s => s.id), 0) + 1,
        nome: userData.nomeSalao,
        endereco: '',
        telefone: userData.telefone,
        email: userData.email,
        logo: null,
        plano: 'inicial',
        userId: newUser.id
      };
      saloes.push(novoSalao);
      localStorage.setItem('saloes', JSON.stringify(saloes));

      // Fazer login automático
      const userToSave = { ...newUser };
      delete userToSave.password;
      userToSave.salaoAtualId = novoSalao.id;
      
      setCurrentUser(userToSave);
      localStorage.setItem('currentUser', JSON.stringify(userToSave));

      return { success: true, user: userToSave };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Email ou senha incorretos');
      }

      // Obter salão do usuário
      const saloes = JSON.parse(localStorage.getItem('saloes') || '[]');
      const salaoUser = saloes.find(s => s.userId === user.id);

      const userToSave = { ...user };
      delete userToSave.password;
      userToSave.salaoAtualId = salaoUser?.id || null;

      setCurrentUser(userToSave);
      localStorage.setItem('currentUser', JSON.stringify(userToSave));

      return { success: true, user: userToSave };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};