import React from 'react';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export const FilterChip: React.FC<FilterChipProps> = ({ 
  label, 
  value, 
  onRemove, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <div className={`
      inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-sm font-medium
      ${colorClasses[color]} transition-all duration-200
    `}>
      <span className="text-xs opacity-75 uppercase tracking-wider">{label}</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className="ml-1 p-0.5 hover:bg-black/10 rounded-full transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};