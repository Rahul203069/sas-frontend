//@ts-nocheck
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

import ConfigurationStep from "./ConfigurationStep";
import CsvSelectionStep from "./CsvSelectionStep";
import ActivationStep from "./ActivationStep";

const steps = [
  { id: 1, title: "Configuration" },
  { id: 2, title: "Data Source" },
  { id: 3, title: "Activation" },
];

export default function BotActivationDialog({ open, onOpenChange, botData, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCsv, setSelectedCsv] = useState(null);
  const [isActivating, setIsActivating] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleActivate = async () => {
    setIsActivating(true);
    setCurrentStep(3);
    
    // Simulate bot activation
    setTimeout(() => {
      onSuccess?.();
    }, 3000);
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden shadow-2xl rounded-xl">
        <div className="bg-slate-50">
          {/* COMPACT HEADER */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Deploy Bot
              </h2>
              <div className="text-sm text-slate-500 font-medium">
                Step {currentStep} <span className="text-slate-400">/</span> {steps.length}
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-2 bg-slate-200" />
            
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              {steps.map((step) => (
                <span
                  key={step.id}
                  className={`w-1/3 text-center transition-colors duration-300 ${
                    currentStep === step.id
                      ? 'font-semibold text-blue-600'
                      : currentStep > step.id
                      ? 'font-medium text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6 min-h-[360px]">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ConfigurationStep 
                    botData={botData}
                    onConfigure={() => window.open('/configuration', '_blank')}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CsvSelectionStep 
                    selectedCsv={selectedCsv}
                    onCsvSelect={setSelectedCsv}
                    onUploadNew={() => window.open('/csv-upload', '_blank')}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ActivationStep 
                    botData={botData}
                    selectedCsv={selectedCsv}
                    isActivating={isActivating}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {currentStep < 3 && (
            <div className="px-6 py-4 bg-slate-100/70 border-t border-slate-200 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6"
              >
                Back
              </Button>
              
              {currentStep === 1 ? (
                <Button
                  onClick={handleNext}
                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white shadow"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleActivate}
                  disabled={!selectedCsv}
                  className="px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Activate Bot
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
