//@ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, RotateCcw } from 'lucide-react';
import { MappedData } from '../../types/csv';

interface SuccessScreenProps {
  data: MappedData[];
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ data, onReset }) => {
  const downloadData = () => {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imported_data.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center justify-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-12 h-12 text-green-600" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Import Successful!</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {data.length} records have been successfully imported and are ready to use.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadData}
          className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Data
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Import Another File
        </motion.button>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
        <h4 className="font-medium text-blue-700 mb-2">What's Next?</h4>
        <ul className="text-sm text-blue-600 space-y-2">
          <li className="flex items-start">
            <span className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
            <span>Your data is now available in your system</span>
          </li>
          <li className="flex items-start">
            <span className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
            <span>You can search, filter, and manage your contacts</span>
          </li>
          <li className="flex items-start">
            <span className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
            <span>Add more data anytime by importing another CSV file</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default SuccessScreen;
