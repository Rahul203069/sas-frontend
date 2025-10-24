
// File: src/components/UploadWizard.tsx

import React, { useState } from 'react';
import Papa from 'papaparse';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, RefreshCw, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

import FieldMapper from './CSVImport/FieldMapper';
import Alert from './Alert';
import { CSVColumn, MappedField, PredefinedField } from '../type/csv';

// --- THIS IS THE UPDATED PART ---
// Define the system fields *required for a row to be valid*
const REQUIRED_ROW_FIELDS: PredefinedField[] = [
  'address',
  'propertyType',
  'bedrooms',
  'bathrooms',
  'squareFootage',
  'phone', // <-- Phone is included
];
// --- END UPDATED PART ---

type WizardStep = 'upload' | 'map' | 'done';
type AlertState = {
  message: string;
  type: 'success' | 'error' | null;
};

// Helper to check for null, undefined, or empty string
const isValueEmpty = (value: any): boolean => {
  return value === null || value === undefined || String(value).trim() === '';
};

const UploadWizard: React.FC = () => {
  const [columns, setColumns] = useState<CSVColumn[]>([]);
  const [fullData, setFullData] = useState<Record<string, any>[]>([]);
  const [mappedFields, setMappedFields] = useState<MappedField[]>([]);
  const [alert, setAlert] = useState<AlertState>({ message: '', type: null });
  const [step, setStep] = useState<WizardStep>('upload');
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const resetWizard = () => {
    setColumns([]);
    setFullData([]);
    setMappedFields([]);
    setAlert({ message: '', type: null });
    setStep('upload');
    setProcessing(false);
    setFileName('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setAlert({ message: '', type: null }); // Reset alert
      setProcessing(true); // Show loading state on upload

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          const dataRows = results.data as Record<string, any>[];

          if (dataRows.length === 0 || headers.length === 0) {
            setAlert({ message: 'The CSV file is empty or headers could not be read.', type: 'error' });
            setProcessing(false);
            setFileName('');
            return;
          }

          const csvColumns: CSVColumn[] = headers.map((header, index) => ({
            index,
            header,
            sample: dataRows.length > 0 ? String(dataRows[0][header] || '') : '',
            samples: dataRows.slice(0, 5).map(row => String(row[header] || '')),
          }));

          setColumns(csvColumns);
          setFullData(dataRows); // <-- Store all the parsed leads
          setStep('map'); // Move to the mapping step
          setProcessing(false);
        },
        error: (error) => {
          setAlert({ message: `File parsing error: ${error.message}`, type: 'error' });
          setProcessing(false);
          setFileName('');
        }
      });
    }
  };

  const handleFieldsMapped = (newMappedFields: MappedField[]) => {
    setMappedFields(newMappedFields);
  };

  /**
   * THIS IS THE NEW LOGIC YOU ASKED FOR
   * It runs after the user has finished mapping.
   */
  const handleProcessLeads = () => {
    setProcessing(true);
    setAlert({ message: '', type: null });

    // Simulate processing time to allow UI to update
    setTimeout(() => {
      // 1. Find which CSV header corresponds to our required fields
      const requiredColumns: Record<string, string[]> = {};
      let allRequiredFieldsMapped = true;

      // This loop now includes 'phone'
      for (const fieldName of REQUIRED_ROW_FIELDS) {
        const mapping = mappedFields.find(m => m.fieldName === fieldName);
        if (mapping && mapping.sourceColumns.length > 0) {
          // Store the *actual CSV header names* (e.g., "Street Address")
          requiredColumns[fieldName] = mapping.sourceColumns.map(c => c.header);
        } else {
          allRequiredFieldsMapped = false;
        }
      }

      // If user didn't even map all required *columns*, fail fast.
      if (!allRequiredFieldsMapped) {
        setAlert({
          message: 'Validation Error: Please map all required fields (Address, Phone, Bedrooms, etc.) before processing.',
          type: 'error'
        });
        setProcessing(false);
        setStep('map'); // Stay on map step
        return;
      }

      // 2. Filter the leads (rows)
      const validLeads: Record<string, any>[] = fullData.filter(row => {
        // Check every required system field (now including 'phone')
        return REQUIRED_ROW_FIELDS.every(fieldName => {
          const mappedCsvHeaders = requiredColumns[fieldName];
          
          if (!mappedCsvHeaders || mappedCsvHeaders.length === 0) {
            return false;
          }

          // Check if *at least one* of the mapped columns has a non-empty value
          return mappedCsvHeaders.some(header => !isValueEmpty(row[header]));
        });
      });

      // 3. Set the feedback alert for the user
      if (validLeads.length === 0) {
        setAlert({
          message: `Validation Failed: 0 out of ${fullData.length} leads had the required data. Please check your file or mappings.`,
          type: 'error'
        });
      } else {
        setAlert({
          message: `Success! Found ${validLeads.length} valid leads out of ${fullData.length}.`,
          type: 'success'
        });
      }

      setStep('done');
      setProcessing(false);

      // 4. Proceed with only the valid leads
      console.log(`Processing ${validLeads.length} valid leads:`, validLeads);
      // ... send validLeads to your API here
    }, 500); // 500ms delay
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <div className="w-full space-y-4">
        {/* Alert container */}
        <div className="fixed top-5 right-5 z-50 w-full max-w-md">
          {alert.type && (
            <Alert
              type={alert.type}
              message={alert.message}
              onDismiss={() => setAlert({ message: '', type: null })}
            />
          )}
        </div>

        {/* Step: Upload */}
        <AnimatePresence>
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center"
            >
              <UploadCloud className="w-16 h-16 mx-auto text-blue-500" />
              <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Upload Your Lead List</h2>
              <p className="text-gray-500 mb-6">We'll validate your data and find the best leads.</p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
                disabled={processing}
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  processing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } cursor-pointer transition-colors`}
              >
                {processing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <span>Choose File</span>
                )}
              </label>
              {fileName && <p className="mt-4 text-sm text-gray-500">{fileName}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step: Map */}
        <AnimatePresence>
          {step === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >


              <FieldMapper columns={columns} onFieldsMapped={handleFieldsMapped} />
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={resetWizard}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessLeads}
                  disabled={processing}
                  className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                    processing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                  } transition-colors`}
                >
                  {processing ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <span>Validate & Process Leads</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step: Done */}
        <AnimatePresence>
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-center"
            >
              {alert.type === 'success' ? (
                <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              ) : (
                <AlertTriangle className="w-16 h-16 mx-auto text-red-500" />
              )}
              <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">
                {alert.type === 'success' ? 'Processing Complete' : 'Validation Failed'}
              </h2>
              <p className="text-gray-600 mb-6">
                {alert.message}
              </p>
              <button
                onClick={resetWizard}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Upload Another File
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadWizard;