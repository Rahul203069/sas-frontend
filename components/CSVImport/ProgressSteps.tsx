//@ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileUp, Columns, TableProperties, Check, ArrowRight, Loader2
} from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { label: 'Upload CSV', icon: FileUp },
    { label: 'Map Fields', icon: Columns },
    { label: 'Review Data', icon: TableProperties },
    {label:'loading', icon: Loader2},
    { label: 'Complete', icon: Check }
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.slice(0, totalSteps).map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          
          return (
            <React.Fragment key={index}>
              <motion.div 
                className="flex flex-col items-center"
                animate={{
                  opacity: isActive || isCompleted ? 1 : 0.5
                }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive 
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-500' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-600 border-2 border-green-500' 
                        : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    scale: isActive ? 1.1 : 1
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </motion.div>
                <span className={`text-xs font-medium ${
                  isActive 
                    ? 'text-blue-600' 
                    : isCompleted 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </motion.div>
              
              {index < totalSteps - 1 && (
                <motion.div 
                  className="flex-grow h-0.5 mx-2"
                  style={{
                    background: `linear-gradient(to ${index + 1 < currentStep ? 'right' : 'left'}, ${
                      index + 1 < currentStep 
                        ? '#10B981 0%, #10B981 100%' 
                        : index + 1 === currentStep 
                          ? '#10B981 0%, #D1D5DB 100%' 
                          : '#D1D5DB 0%, #D1D5DB 100%'
                    })`
                  }}
                >
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ 
                      opacity: index + 1 === currentStep ? 1 : 0,
                      y: index + 1 === currentStep ? -10 : 0
                    }}
                  >
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                  </motion.div>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
