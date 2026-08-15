import React from 'react';

const Timeline = ({ steps = [], currentStatus }) => {
  const statusOrder = ['SOLICITADO', 'ASIGNADO', 'EN_PROGRESO', 'FINALIZADO'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const defaultSteps = [
    { key: 'SOLICITADO', label: 'Solicitado', icon: 'send' },
    { key: 'ASIGNADO', label: 'Asignado', icon: 'person_check' },
    { key: 'EN_PROGRESO', label: 'En Progreso', icon: 'build' },
    { key: 'FINALIZADO', label: 'Finalizado', icon: 'check_circle' },
  ];

  const displaySteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="flex items-center w-full">
      {displaySteps.map((step, index) => {
        const stepIndex = statusOrder.indexOf(step.key);
        const isCompleted = stepIndex < currentIndex;
        const isActive = stepIndex === currentIndex;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCompleted ? 'bg-success text-white' :
                isActive ? 'bg-primary text-on-primary shadow-soft' :
                'bg-surface-container text-on-surface-variant border border-outline-variant'
              }`}>
                <span className="material-symbols-outlined text-sm"
                  style={isCompleted || isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {isCompleted ? 'check_circle' : step.icon}
                </span>
              </div>
              <span className={`mt-2 text-xs font-label-sm text-center max-w-[70px] ${
                isActive ? 'text-primary font-bold' :
                isCompleted ? 'text-success' :
                'text-on-surface-variant'
              }`}>
                {step.label}
              </span>
            </div>
            {index < displaySteps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-5 transition-all duration-300 ${
                stepIndex < currentIndex ? 'bg-success' : 'bg-outline-variant'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Timeline;
