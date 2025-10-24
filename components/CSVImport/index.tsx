//@ts-nocheck
"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CSVUploader from './CSVUploader';
import FieldMapper from './FieldMapper';
import MappedDataDisplay from './MappedDataDisplay';
import ProgressSteps from './ProgressSteps';
import SuccessScreen from './SuccessScreen';
import axios from 'axios';
import { 
  parseCSV, getColumnSamples, transformMappedDataToRecords, 
  validateMappedData 
} from '../../functions/csvUtils';
import { 
  CSVData, CSVColumn, MappedField, MappedData 
} from '../../type/csv';
import { useParams } from 'next/navigation';
import { set } from 'react-hook-form';
import CsvLoader from './CSVloader';
import UploadWizard from '../UploadWizard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

interface AlertMessage {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
}

const CSVImport: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [mappedFields, setMappedFields] = useState<MappedField[]>([]);
  const [mappedData, setMappedData] = useState<MappedData[]>([]);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const params = useParams();
  const {userId}=params;
  
  const showAlert = (message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error') => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, message, type }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissAlert(id);
    }, 5000);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'success':
        return 'text-green-500';
      case 'info':
        return 'text-blue-500';
    }
  };
  
  const handleFileLoaded = useCallback(async (file: File) => {
    setIsLoading(true);
    
    try {
      const data = await parseCSV(file);
      console.log('Parsed CSV data:', data);
      
      let limitedData;
      if (Array.isArray(data)) {
        limitedData = data.slice(0, 20);
      } else if (data.data && Array.isArray(data.data)) {
        limitedData = {
          ...data,
          data: data.data.slice(0, 20)
        };
      } else {
        limitedData = data;
      }
      
      setCsvData(limitedData);
      
      const columns = getColumnSamples(limitedData);
      setCsvColumns(columns);
      
      showAlert('CSV file uploaded successfully! Please map the fields.', 'success');
      setStep(2);
    } catch (err) {
      showAlert('Failed to parse CSV file. Please check the file format and try again.', 'error');
      console.error('CSV parse error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleFieldsMapped = useCallback((fields: MappedField[]) => {
    setMappedFields(fields);
    
    if (csvData) {
      const records = transformMappedDataToRecords(csvData, fields);
      setMappedData(records);
    }
  }, [csvData]);
  
  const handleReviewComplete = useCallback(async() => {
    if (mappedData.length === 0) {
      showAlert("No data to submit.", 'error');
      setStep(3);
      return;
    }

    const { valid, errors } = validateMappedData(mappedData);
    
    if (!valid) {
      showAlert(errors.join(' '), 'error');
      setStep(3);
      return;
    }
    
    setIsLoading(true);
    setStep(4);
    
    axios.post('/api/csv', {
        csvData: mappedData,
        botId: userId
    }).then(res => {
        console.log(res, "CSV ");
        if(res.status === 200){
          console.log(res.data, "CSV data saved successfully");
            showAlert('Data saved successfully!', 'success');
            setStep(5);
        } else {
          showAlert('Failed to save data. Please try again.', 'error');
          setStep(3);
        }
    }).catch(err => {
        console.error("API Error:", err);
        showAlert('An error occurred while saving your data. Please try again.', 'error');
        setStep(3);
    }).finally(() => {
        setIsLoading(false);
    });

  }, [mappedData, userId]);
  
  const handleReset = useCallback(() => {
    setStep(1);
    setCsvData(null);
    setCsvColumns([]);
    setMappedFields([]);
    setMappedData([]);
    setAlerts([]);
  }, []);
  
  const proceedToReview = useCallback(() => {
    const hasMappedFields = mappedFields.some(field => field.sourceColumns.length > 0);
    
    if (!hasMappedFields) {
      showAlert('Please map at least one field before proceeding.', 'warning');
      return;
    }
    
    const requiredFieldIds = [
      'phone', 
      'address', 
      'bedrooms', 
      'bathrooms', 
      'squareFootage', 
      'propertyType'
    ];
    
    const missingRequired = requiredFieldIds.filter(fieldName => {
      const field = mappedFields.find(f => f.fieldName === fieldName);
      return !field || field.sourceColumns.length === 0;
    });
    
    if (missingRequired.length > 0) {
      const missingFieldsList = missingRequired
        .map(id => id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'))
        .join(', ');
        
      showAlert(`Please map all required fields: ${missingFieldsList}`, 'warning');
      return;
    }
    
    showAlert('Field mapping complete! Please review your data.', 'info');
    setStep(3);
  }, [mappedFields]);
  
  return (
    <>
      {/* Floating Alert Container - Top Right */}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-96 max-w-[calc(100vw-2rem)]">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Alert className={`${getAlertStyles(alert.type)} shadow-lg border-l-4 pr-12 relative`}>
                <div className="flex items-start gap-3">
                  <div className={`${getIconColor(alert.type)} flex-shrink-0`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <AlertTitle className="font-semibold text-sm mb-1">
                      {alert.type === 'error' ? 'Error' : 
                       alert.type === 'warning' ? 'Warning' : 
                       alert.type === 'success' ? 'Success' : 'Information'}
                    </AlertTitle>
                    <AlertDescription className="text-sm leading-relaxed">
                      {alert.message}
                    </AlertDescription>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-4 sm:pt-4">
        <motion.div 
          className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Import Contact Data</h2>
            <p className="text-gray-500">Upload a CSV file and map the columns to your contact fields</p>
          </div>
          
          <div className="p-6">
            <ProgressSteps currentStep={step} totalSteps={5} />
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CSVUploader 
                    onFileLoaded={handleFileLoaded}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <FieldMapper
                    columns={csvColumns}
                    onFieldsMapped={handleFieldsMapped}
                  />
                  
                  <div className="mt-8 flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={proceedToReview}
                      className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
                    >
                      Continue to Review
                    </motion.button>
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <MappedDataDisplay 
                    data={mappedData}
                    onComplete={handleReviewComplete}
                  />
                </motion.div>
              )}
              
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <SuccessScreen 
                    data={mappedData}
                    onReset={handleReset}
                  />
                </motion.div>
              )}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CsvLoader></CsvLoader>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CSVImport;