// src/components/clientes/ClienteDetalhes.jsx - REFATORADO (redireciona para página)
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ClienteDetalhes = ({ cliente, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (cliente) {
      // Redirecionar para a página dedicada
      navigate(`/clientes/${cliente.id}`);
      // Fechar o modal se ainda estiver aberto
      if (onClose) {
        onClose();
      }
    }
  }, [cliente, navigate, onClose]);

  return null; // Não renderiza nada, apenas redireciona
};

export default ClienteDetalhes;