import React from 'react';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  currentStep, 
  steps 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
              ${index < currentStep
                ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white'
                : index === currentStep
                ? 'bg-teal-400 text-white'
                : 'bg-gray-700 text-gray-400'
              }
            `}>
              {index < currentStep ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            
            <span className={`
              ml-3 text-sm font-medium
              ${index <= currentStep ? 'text-white' : 'text-gray-400'}
            `}>
              {step}
            </span>
            
            {index < steps.length - 1 && (
              <div className={`
                w-16 h-0.5 mx-4
                ${index < currentStep ? 'bg-gradient-to-r from-teal-400 to-blue-500' : 'bg-gray-700'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 