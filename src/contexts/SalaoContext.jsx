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

  return (
    <SalaoContext.Provider value={{ saloes, salaoAtual, setSalaoAtual }}>
      {children}
    </SalaoContext.Provider>
  );
};