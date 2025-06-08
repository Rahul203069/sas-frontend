//@ts-nocheck

import React from 'react';
import { FileSpreadsheet, Loader2, Check } from 'lucide-react';

const CsvLoader = () => {


  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full border border-gray-100">
        {/* Icon container */}
        <div className="flex justify-center mb-4">
          <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
            false
              ? 'bg-green-100 text-green-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
          }`}>
            {false ? (
              <Check className="w-8 h-8" />
            ) : (
              <FileSpreadsheet className="w-8 h-8" />
            )}
            
            {/* Spinning ring for loading */}
            {true && (
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-spin"></div>
            )}
          </div>
        </div>

        {/* Text content */}
        <div className="text-center mb-4">
          <h3 className={`text-lg font-semibold transition-colors duration-300 ${
            false ? 'text-green-700' : 'text-gray-800'
          }`}>
            {false ? 'Processing Complete' : 'Processing CSV'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {false 
              ? 'Your file is ready' 
              : 'Please wait while we process your file...'
            }
          </p>
        </div>

        {/* Progress indicator */}
        {true && (
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
            
            {/* Processing dots */}
            <div className="flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Success indicator */}
        {false && (
          <div className="w-full bg-green-100 rounded-lg p-3 text-center">
            <div className="text-green-600 text-sm font-medium">
              ✓ File processed successfully
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvLoader;
