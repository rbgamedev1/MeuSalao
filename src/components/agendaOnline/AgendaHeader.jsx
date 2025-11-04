// src/components/agendaOnline/AgendaHeader.jsx

const AgendaHeader = ({ salao }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">{salao.nome}</h1>
        <p className="opacity-90">{salao.endereco}</p>
        <p className="opacity-90">{salao.telefone}</p>
      </div>
    </div>
  );
};

export default AgendaHeader;