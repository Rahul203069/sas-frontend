//@ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Sparkles, Download } from 'lucide-react';
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

  const handleBackToDashboard = () => {
    // Redirect to the main dashboard/bot page
    window.location.href = '/bot';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center justify-center py-8 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg"
      >
        <CheckCircle className="w-12 h-12 text-green-600" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        {data.length} lead{data.length !== 1 ? 's' : ''} successfully uploaded to the backend.
      </p>
      
      <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 max-w-lg w-full shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-blue-900 text-lg">AI Outreach Initiated</h4>
        </div>
        
        <p className="text-blue-700 mb-4 leading-relaxed">
          Our AI system is now initiating personalized SMS outreach to your leads. You'll be able to monitor the campaign progress and responses from your dashboard.
        </p>
        
        <ul className="text-sm text-blue-600 space-y-3">
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">1</span>
            <span>AI is analyzing each lead and crafting personalized messages</span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">2</span>
            <span>SMS will be sent know in no time</span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5 flex-shrink-0">3</span>
            <span>Track responses and engagement in real-time from your dashboard</span>
          </li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadData}
          className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Data
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToDashboard}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SuccessScreen;