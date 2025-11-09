// src/components/financeiro/FinanceiroHeader.jsx
const FinanceiroHeader = ({ salaoNome, periodo, setPeriodo }) => {
  const periodos = [
    { value: 'dia', label: 'Hoje' },
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mês' },
    { value: 'ano', label: 'Este Ano' }
  ];

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Financeiro</h1>
        <p className="text-gray-600 mt-1">Controle suas finanças - {salaoNome}</p>
      </div>
      
      {/* Botões de período */}
      <div className="flex items-center space-x-2">
        {periodos.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriodo(p.value)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              periodo === p.value
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FinanceiroHeader;