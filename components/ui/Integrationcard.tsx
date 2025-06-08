import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

type IntegrationStatus = 'active' | 'inactive' | 'error';

interface IntegrationCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: IntegrationStatus;
  onClick: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  status,
  onClick,
}) => {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
          {status === 'active' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </span>
          ) : status === 'error' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <XCircle className="w-3 h-3 mr-1" />
              Error
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Not Connected
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          {status === 'active' ? 'Configure' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

export default IntegrationCard;