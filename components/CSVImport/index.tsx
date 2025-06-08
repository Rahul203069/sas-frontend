//@ts-nocheck
"use client"
import React, { useState, useCallback } from 'react';
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

const CSVImport: React.FC = () => {
  const [step, setStep] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [mappedFields, setMappedFields] = useState<MappedField[]>([]);
  const [mappedData, setMappedData] = useState<MappedData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const {userId}=params;
  const handleFileLoaded = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await parseCSV(file);
      setCsvData(data);
      
      const columns = getColumnSamples(data);
      setCsvColumns(columns);
      
      // Move to the next step
      setStep(2);
    } catch (err) {
      setError('Failed to parse CSV file. Please check the file format and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleFieldsMapped = useCallback((fields: MappedField[]) => {
    setMappedFields(fields);
    
    // Transform the data based on the field mapping
    if (csvData) {
      const records = transformMappedDataToRecords(csvData, fields);
      setMappedData(records);
    }
  }, [csvData]);
  
  const handleReviewComplete = useCallback(() => {
    // Validate the mapped data
    if (mappedData.length > 0) {
      const { valid, errors } = validateMappedData(mappedData);
      
      if (!valid) {
        setError(errors.join(' '));
    
      }
      setStep(4)
      
      // If valid, move to the success screen

axios.post('/api/csv', {
        csvData: mappedData,
        userId}).then(res=>{
          if(res.status===200){
             setStep(5);

          }else{
            setError('Failed to save data. Please try again.');
          }
        }).finally(() => {setIsLoading(false);});



     
    }
  }, [mappedData]);
  
  const handleReset = useCallback(() => {
    // Reset the state to start over
    setStep(1);
    setCsvData(null);
    setCsvColumns([]);
    setMappedFields([]);
    setMappedData([]);
    setError(null);
  }, []);
  
  const proceedToReview = useCallback(() => {
    // Check if at least one field is mapped
    const hasMappedFields = mappedFields.some(field => field.sourceColumns.length > 0);
    
    if (!hasMappedFields) {
      setError('Please map at least one field before proceeding.');
      return;
    }
    
    // Check if required fields are mapped
    const requiredFields = ['email'];
    const missingRequired = requiredFields.filter(fieldName => {
      const field = mappedFields.find(f => f.fieldName === fieldName);
      return !field || field.sourceColumns.length === 0;
    });
    
    if (missingRequired.length > 0) {
      setError(`Please map the required field: ${missingRequired.join(', ')}`);
      return;
    }
    
    setError(null);
    setStep(3);
  }, [mappedFields]);
  
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-4 sm:pt-4">
      <motion.div 
        className="bg-white shadow-xl rounded-xl  overflow-hidden border border-gray-200"
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.5 }}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Import Contact Data</h2>
          <p className="text-gray-500">Upload a CSV file and map the columns to your contact fields</p>
        </div>
        
        <div className="p-6">
          <ProgressSteps currentStep={step} totalSteps={5} />
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
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
  );
};

export default CSVImport;
