// src/contexts/AuthContext.jsx - INTEGRADO COM SUPABASE

import { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escutar mudanças de autenticação
  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          ...session.user.user_metadata
        });
      }
      setLoading(false);
    });

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          ...session.user.user_metadata
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Função de REGISTRO
  const register = async (userData) => {
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            nome: userData.nome,
            telefone: userData.telefone
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao criar usuário');
      }

      // 2. Criar salão inicial para o usuário
      const { data: salaoData, error: salaoError } = await supabase
        .from('saloes')
        .insert([
          {
            user_id: authData.user.id,
            nome: userData.nomeSalao,
            telefone: userData.telefone,
            email: userData.email,
            plano: 'inicial'
          }
        ])
        .select()
        .single();

      if (salaoError) throw salaoError;

      // 3. Atualizar estado do usuário
      const user = {
        id: authData.user.id,
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        salaoAtualId: salaoData.id
      };

      setCurrentUser(user);

      return { 
        success: true, 
        user,
        message: 'Conta criada com sucesso! Verifique seu email para confirmar.' 
      };

    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        error: error.message || 'Erro ao criar conta' 
      };
    }
  };

  // Função de LOGIN
  const login = async (email, password) => {
    try {
      // 1. Fazer login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Credenciais inválidas');
      }

      // 2. Buscar salão do usuário
      const { data: saloesData, error: saloesError } = await supabase
        .from('saloes')
        .select('*')
        .eq('user_id', authData.user.id)
        .limit(1);

      if (saloesError) throw saloesError;

      // 3. Atualizar estado do usuário
      const user = {
        id: authData.user.id,
        email: authData.user.email,
        nome: authData.user.user_metadata?.nome || '',
        telefone: authData.user.user_metadata?.telefone || '',
        salaoAtualId: saloesData?.[0]?.id || null
      };

      setCurrentUser(user);

      return { 
        success: true, 
        user,
        message: 'Login realizado com sucesso!' 
      };

    } catch (error) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'Email ou senha incorretos';
      
      if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      }

      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  // Função de LOGOUT
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setCurrentUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Função para ATUALIZAR PERFIL
  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;

      setCurrentUser(prev => ({
        ...prev,
        ...updates
      }));

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Função para RECUPERAR SENHA
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      return { 
        success: true,
        message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
      };
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};