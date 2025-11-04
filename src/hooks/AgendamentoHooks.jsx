import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { format, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Hook para gerenciar agendamentos do Firebase
 */
export const useAgendamentos = (dataAtual) => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const inicio = startOfMonth(dataAtual);
    const fim = endOfMonth(dataAtual);

    const q = query(
      collection(db, 'agendamentos'),
      where('userId', '==', auth.currentUser.uid),
      where('data', '>=', Timestamp.fromDate(inicio)),
      where('data', '<=', Timestamp.fromDate(fim))
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const dados = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          data: doc.data().data?.toDate(),
        }));
        setAgendamentos(dados);
        setLoading(false);
      },
      (err) => {
        console.error('Erro ao carregar agendamentos:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dataAtual, auth.currentUser]);

  return { agendamentos, loading, error };
};

/**
 * Hook para gerenciar clientes
 */
export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'clientes'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(dados);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  return { clientes, loading };
};

/**
 * Hook para gerenciar serviços
 */
export const useServicos = () => {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'servicos'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServicos(dados);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  return { servicos, loading };
};

/**
 * Hook para verificar plano do usuário
 */
export const usePlanoUsuario = () => {
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'usuarios'),
      where('uid', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setPlano(userData.plano || 'gratuito');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  return { plano, loading, isEssencial: plano === 'essencial' };
};

/**
 * Hook para operações CRUD de agendamentos
 */
export const useAgendamentoOperacoes = () => {
  const auth = getAuth();

  const criarAgendamento = async (dados) => {
    if (!auth.currentUser) throw new Error('Usuário não autenticado');

    const agendamentoData = {
      ...dados,
      userId: auth.currentUser.uid,
      criadoEm: Timestamp.now(),
      data: Timestamp.fromDate(new Date(dados.data)),
    };

    const docRef = await addDoc(collection(db, 'agendamentos'), agendamentoData);
    
    // Se é plano essencial e notificações estão ativadas, envia email
    if (dados.notificarCliente && dados.clienteEmail) {
      await enviarNotificacao({
        tipo: 'novo',
        agendamento: { ...agendamentoData, id: docRef.id },
        emailCliente: dados.clienteEmail,
      });
    }

    return docRef.id;
  };

  const atualizarAgendamento = async (id, dados) => {
    if (!auth.currentUser) throw new Error('Usuário não autenticado');

    const updateData = {
      ...dados,
      atualizadoEm: Timestamp.now(),
    };

    if (dados.data) {
      updateData.data = Timestamp.fromDate(new Date(dados.data));
    }

    await updateDoc(doc(db, 'agendamentos', id), updateData);

    // Notifica sobre alteração se necessário
    if (dados.notificarCliente && dados.clienteEmail) {
      await enviarNotificacao({
        tipo: 'alteracao',
        agendamento: { ...dados, id },
        emailCliente: dados.clienteEmail,
      });
    }
  };

  const deletarAgendamento = async (id, agendamento) => {
    if (!auth.currentUser) throw new Error('Usuário não autenticado');
    
    await deleteDoc(doc(db, 'agendamentos', id));

    // Notifica sobre cancelamento se necessário
    if (agendamento.notificarCliente && agendamento.clienteEmail) {
      await enviarNotificacao({
        tipo: 'cancelamento',
        agendamento,
        emailCliente: agendamento.clienteEmail,
      });
    }
  };

  const enviarNotificacao = async ({ tipo, agendamento, emailCliente }) => {
    try {
      // Chama Cloud Function para enviar email
      const response = await fetch('https://us-central1-seu-projeto.cloudfunctions.net/enviarNotificacaoAgendamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo,
          agendamento,
          emailCliente,
          userId: auth.currentUser.uid,
        }),
      });

      if (!response.ok) {
        console.error('Erro ao enviar notificação');
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  };

  return {
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento,
  };
};

/**
 * Hook para agenda online (link público)
 */
export const useAgendaOnline = () => {
  const auth = getAuth();
  const [linkAgenda, setLinkAgenda] = useState('');
  const [configuracao, setConfiguracao] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'agendaOnline'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const config = snapshot.docs[0].data();
        setConfiguracao({ id: snapshot.docs[0].id, ...config });
        setLinkAgenda(`${window.location.origin}/agenda/${config.slug}`);
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const criarLinkAgenda = async (dados) => {
    if (!auth.currentUser) throw new Error('Usuário não autenticado');

    const slug = dados.slug || auth.currentUser.uid.substring(0, 8);
    
    const configData = {
      userId: auth.currentUser.uid,
      slug,
      ativo: true,
      configuracoes: {
        horarioInicio: dados.horarioInicio || '08:00',
        horarioFim: dados.horarioFim || '18:00',
        intervaloMinutos: dados.intervaloMinutos || 30,
        diasAtendimento: dados.diasAtendimento || [1, 2, 3, 4, 5], // Seg-Sex
        antecedenciaMinimaDias: dados.antecedenciaMinimaDias || 0,
        antecedenciaMaximaDias: dados.antecedenciaMaximaDias || 30,
      },
      criadoEm: Timestamp.now(),
    };

    await addDoc(collection(db, 'agendaOnline'), configData);
  };

  const atualizarConfiguracao = async (dados) => {
    if (!configuracao) throw new Error('Configuração não encontrada');

    await updateDoc(doc(db, 'agendaOnline', configuracao.id), {
      ...dados,
      atualizadoEm: Timestamp.now(),
    });
  };

  return {
    linkAgenda,
    configuracao,
    criarLinkAgenda,
    atualizarConfiguracao,
  };
};