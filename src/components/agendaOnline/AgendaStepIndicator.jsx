// src/components/agendaOnline/AgendaStepIndicator.jsx

const AgendaStepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Seus Dados' },
    { number: 2, label: 'Serviço' },
    { number: 3, label: 'Data e Hora' }
  ];

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`flex-1 h-2 rounded-full ${
              index < steps.length - 1 ? 'mr-1' : ''
            } ${
              step.number <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex items-center justify-between text-sm">
        {steps.map(step => (
          <span
            key={step.number}
            className={
              step.number <= currentStep
                ? 'text-purple-600 font-medium'
                : 'text-gray-400'
            }
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AgendaStepIndicator;