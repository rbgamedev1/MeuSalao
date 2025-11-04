// src/hooks/useRealtimeAgendamentos.js - Hook para sincronização em tempo real

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook customizado para sincronização em tempo real de agendamentos
 * Monitora mudanças no localStorage e atualiza automaticamente
 * 
 * @param {number} salaoId - ID do salão para filtrar agendamentos
 * @param {number} pollInterval - Intervalo de polling em ms (padrão: 2000)
 * @returns {Object} { agendamentos, isUpdating, lastUpdate, forceRefresh }
 */
export const useRealtimeAgendamentos = (salaoId, pollInterval = 2000) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Função para carregar agendamentos
  const loadAgendamentos = useCallback(() => {
    try {
      const agendamentosAll = JSON.parse(localStorage.getItem('agendamentos') || '[]');
      const filtered = salaoId 
        ? agendamentosAll.filter(a => a.salaoId === parseInt(salaoId))
        : agendamentosAll;
      
      // Só atualizar se realmente mudou
      if (JSON.stringify(filtered) !== JSON.stringify(agendamentos)) {
        setIsUpdating(true);
        setAgendamentos(filtered);
        setLastUpdate(new Date());
        
        // Remover animação de atualização após 500ms
        setTimeout(() => setIsUpdating(false), 500);
        
        console.log('🔄 Agendamentos atualizados:', filtered.length);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      return false;
    }
  }, [salaoId, agendamentos]);

  // Carregar inicial
  useEffect(() => {
    loadAgendamentos();
  }, [salaoId]);

  // Listener para mudanças de outras abas/janelas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'agendamentos' || e.key === null) {
        console.log('📡 Storage event detectado');
        loadAgendamentos();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadAgendamentos]);

  // Polling para detectar mudanças na mesma aba
  useEffect(() => {
    const interval = setInterval(() => {
      loadAgendamentos();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [loadAgendamentos, pollInterval]);

  // Função para forçar refresh manual
  const forceRefresh = useCallback(() => {
    console.log('🔄 Refresh manual solicitado');
    return loadAgendamentos();
  }, [loadAgendamentos]);

  return {
    agendamentos,
    isUpdating,
    lastUpdate,
    forceRefresh
  };
};

/**
 * Hook para sincronização de qualquer item do localStorage
 * 
 * @param {string} key - Chave do localStorage
 * @param {*} defaultValue - Valor padrão
 * @param {Function} filter - Função de filtro opcional
 * @param {number} pollInterval - Intervalo de polling em ms
 * @returns {Object} { data, isUpdating, lastUpdate, forceRefresh }
 */
export const useRealtimeStorage = (key, defaultValue = [], filter = null, pollInterval = 2000) => {
  const [data, setData] = useState(defaultValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const loadData = useCallback(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
      const filtered = filter ? filter(stored) : stored;
      
      if (JSON.stringify(filtered) !== JSON.stringify(data)) {
        setIsUpdating(true);
        setData(filtered);
        setLastUpdate(new Date());
        setTimeout(() => setIsUpdating(false), 500);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
      return false;
    }
  }, [key, defaultValue, filter, data]);

  // Carregar inicial
  useEffect(() => {
    loadData();
  }, [key]);

  // Listener storage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key || e.key === null) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadData, key]);

  // Polling
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [loadData, pollInterval]);

  const forceRefresh = useCallback(() => loadData(), [loadData]);

  return {
    data,
    isUpdating,
    lastUpdate,
    forceRefresh
  };
};

export default useRealtimeAgendamentos;