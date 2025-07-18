import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 12400, fullMonth: 'January', growth: null },
  { month: 'Feb', revenue: 15600, fullMonth: 'February', growth: 25.8 },
  { month: 'Mar', revenue: 18900, fullMonth: 'March', growth: 21.2 },
  { month: 'Apr', revenue: 22100, fullMonth: 'April', growth: 16.9 },
  { month: 'May', revenue: 25800, fullMonth: 'May', growth: 16.7 },
  { month: 'Jun', revenue: 28400, fullMonth: 'June', growth: 10.1 }
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
              <div className="w-full flex justify-center mb-3 relative group">
                <div 
                  className="w-10 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-700 ease-out hover:from-blue-600 hover:to-blue-500 cursor-pointer shadow-sm"
                  style={{ height: `${heightPx}px` }}
                >
                  {/* Sophisticated Tooltip */}
                  <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out scale-95 group-hover:scale-100 z-10">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-4 min-w-[200px]">
                      {/* Arrow */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45"></div>
                      
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm">{data.fullMonth} 2024</h4>
                        {data.growth !== null && (
                          <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                            data.growth > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {data.growth > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {data.growth > 0 ? '+' : ''}{data.growth}%
                          </div>
                        )}
                      </div>
                      
                      {/* Revenue */}
                      <div className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                        <p className="text-xl font-bold text-gray-900">${data.revenue.toLocaleString()}</p>
                      </div>
                      
                      {/* Additional Metrics */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Avg Deal Size</p>
                          <p className="text-sm font-semibold text-gray-700">${Math.round(data.revenue / 15).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Deals Closed</p>
                          <p className="text-sm font-semibold text-gray-700">{Math.round(data.revenue / (data.revenue / 15))}</p>
                        </div>
                      </div>
                    </div>
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