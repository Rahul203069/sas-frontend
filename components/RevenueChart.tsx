import React from 'react';

const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15600 },
  { month: 'Mar', revenue: 18900 },
  { month: 'Apr', revenue: 22100 },
  { month: 'May', revenue: 25800 },
  { month: 'Jun', revenue: 28400 }
];

export function RevenueChart() {
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">${(28400).toLocaleString()}</p>
          <p className="text-sm text-gray-400">This month</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-40 space-x-2">
        {revenueData.map((data, index) => {
          const height = (data.revenue / maxRevenue) * 100;
          
          return (
            <div key={data.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center mb-2">
                <div 
                  className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-700 ease-out hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">{data.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}