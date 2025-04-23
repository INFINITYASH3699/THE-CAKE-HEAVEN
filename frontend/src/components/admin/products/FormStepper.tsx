// components/admin/products/FormStepper.tsx
import { FiInfo, FiSettings, FiImage, FiDollarSign } from 'react-icons/fi';

interface FormStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function FormStepper({ currentStep, onStepClick }: FormStepperProps) {
  const steps = [
    { number: 1, title: 'Basic Info', icon: <FiInfo /> },
    { number: 2, title: 'Specifications', icon: <FiSettings /> },
    { number: 3, title: 'Images', icon: <FiImage /> },
    { number: 4, title: 'Pricing', icon: <FiDollarSign /> },
  ];

  return (
    <div className="bg-gray-50 px-6 py-4 border-b">
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex flex-col items-center cursor-pointer ${
              step.number <= currentStep ? 'text-pink-600' : 'text-gray-400'
            }`}
            onClick={() => onStepClick(step.number)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.number === currentStep
                  ? 'bg-pink-600 text-white'
                  : step.number < currentStep
                  ? 'bg-pink-100 text-pink-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step.icon}
            </div>
            <span className="mt-2 text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-pink-500 transition-all duration-300"
          style={{ width: `${(currentStep - 1) * 33.33}%` }}
        ></div>
      </div>
    </div>
  );
}