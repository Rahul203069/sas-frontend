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
      
      <div className="flex items-end justify-between h-48 space-x-3 px-2">
        {revenueData.map((data, index) => {
          const heightPercentage = (data.revenue / maxRevenue) * 100;
          const heightPx = Math.max((heightPercentage / 100) * 160, 20); // Minimum 20px height
          
          return (
            <div key={data.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex justify-center mb-3 relative">
                <div 
                  className="w-10 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-700 ease-out hover:from-blue-600 hover:to-blue-500 cursor-pointer shadow-sm"
                  style={{ height: `${heightPx}px` }}
                  title={`$${data.revenue.toLocaleString()}`}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${data.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-600 font-medium">{data.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}