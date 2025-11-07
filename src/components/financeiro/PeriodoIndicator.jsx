// ============================================
// 5. src/components/financeiro/PeriodoIndicator.jsx
// ============================================
const PeriodoIndicator = ({ periodo }) => {
  const periodoLabels = {
    dia: 'Hoje',
    semana: 'Esta Semana',
    mes: 'Este Mês',
    ano: 'Este Ano'
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <p className="text-sm text-blue-800">
        📊 Exibindo dados de: <span className="font-semibold">
          {periodoLabels[periodo]}
        </span>
      </p>
    </div>
  );
};

export default PeriodoIndicator;