// @ts-nocheck
// File: src/components/Alert.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-400" />,
  error: <AlertTriangle className="h-5 w-5 text-red-400" />,
};

const Alert: React.FC<AlertProps> = ({ type, message, onDismiss }) => {
  const baseStyles = 'rounded-md p-4';
  const typeStyles = {
    success: 'bg-green-50 text-green-800',
    error: 'bg-red-50 text-red-800',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: 50 }}
        className={`${baseStyles} ${typeStyles[type]} shadow-md`}
        role="alert"
      >
        <div className="flex">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${
                  type === 'success' ? 'hover:bg-green-100' : 'hover:bg-red-100'
                } focus:outline-none focus:ring-2`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;