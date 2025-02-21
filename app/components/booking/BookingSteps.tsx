import { CheckIcon } from '@heroicons/react/24/solid';

interface Step {
  id: string;
  name: string;
  status: 'upcoming' | 'current' | 'complete';
}

interface BookingStepsProps {
  currentStep: number;
}

export default function BookingSteps({ currentStep }: BookingStepsProps) {
  const steps: Step[] = [
    { id: '01', name: 'Palvelut', status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'current' : 'upcoming' },
    { id: '02', name: 'Aika', status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'current' : 'upcoming' },
    { id: '03', name: 'Tiedot', status: currentStep > 3 ? 'complete' : currentStep === 3 ? 'current' : 'upcoming' },
    { id: '04', name: 'Yhteenveto', status: currentStep > 4 ? 'complete' : currentStep === 4 ? 'current' : 'upcoming' },
    { id: '05', name: 'Maksu', status: currentStep === 5 ? 'current' : 'upcoming' },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={stepIdx !== steps.length - 1 ? 'flex-1' : ''}>
            <div className="group flex items-center">
              <span className="flex items-center">
                {step.status === 'complete' ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                    <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                ) : step.status === 'current' ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-600">
                    <span className="text-blue-600">{step.id}</span>
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300">
                    <span className="text-gray-500">{step.id}</span>
                  </span>
                )}
              </span>
              <span
                className={`ml-4 text-sm font-medium ${
                  step.status === 'complete' ? 'text-blue-600' :
                  step.status === 'current' ? 'text-blue-600' :
                  'text-gray-500'
                }`}
              >
                {step.name}
              </span>
              {stepIdx !== steps.length - 1 && (
                <div className={`ml-4 flex-1 border-t-2 ${
                  step.status === 'complete' ? 'border-blue-600' : 'border-gray-300'
                }`} />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
