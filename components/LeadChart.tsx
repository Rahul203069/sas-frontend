import React from 'react';

interface LeadChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export function LeadChart({ data, title }: LeadChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700 text-sm">{item.label}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-900 font-semibold mr-3">{item.value}</span>
              <div className="w-20 bg-gray-100 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(item.value / total) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}