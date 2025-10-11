import React, { useEffect } from 'react';
import { Phone, Users, TrendingUp, TrendingDown } from 'lucide-react';

interface MonthData {
  month: string;
  fullMonth: string;
  callsBooked: number;
  leadsEngaged: number;
}


export function RevenueChart({ MonthData }: { MonthData: MonthData[] }) {

useEffect(() => {

  console.log(MonthData,'month data in revenue chart');
 
}, [])


  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0-based (0 = Jan)
  const currentYear = now.getFullYear();

  // Keep only the latest 6 months including current month
  const latestSixMonths = MonthData.filter((d, idx) => {
    const monthNumber = new Date(`${d.fullMonth} 1, ${currentYear}`).getMonth();
    const diff = currentMonthIndex - monthNumber;
    return diff >= 0 && diff < 6;
  });

  const maxValue = Math.max(
    ...latestSixMonths.map(d => Math.max(d.callsBooked, d.leadsEngaged))
  );

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return null;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Performance Comparison</h3>
        
        {/* Legend */}
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Calls Booked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Leads Engaged</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between h-56 space-x-4 px-2">
        {latestSixMonths.map((data, index) => {
          const callsHeight = Math.max((data.callsBooked / maxValue) * 200, 8);
          const leadsHeight = Math.max((data.leadsEngaged / maxValue) * 200, 8);
          
          const prevMonth = index > 0 ? latestSixMonths[index - 1] : null;
          const callsGrowth = prevMonth ? calculateGrowth(data.callsBooked, prevMonth.callsBooked) : null;
          const leadsGrowth = prevMonth ? calculateGrowth(data.leadsEngaged, prevMonth.leadsEngaged) : null;
          const conversionRate = Math.round((data.callsBooked / data.leadsEngaged) * 100);

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              {/* Bars Container */}
              <div className="flex items-end space-x-1 mb-3 relative group">
                {/* Calls Booked Bar */}
                <div
                  className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-700 ease-out hover:from-blue-600 hover:to-blue-500 cursor-pointer shadow-sm"
                  style={{ height: `${callsHeight}px` }}
                />
                
                {/* Leads Engaged Bar */}
                <div
                  className="w-8 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-700 ease-out hover:from-green-600 hover:to-green-500 cursor-pointer shadow-sm"
                  style={{ height: `${leadsHeight}px` }}
                />

                {/* Tooltip */}
                <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out scale-95 group-hover:scale-100 z-10">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-4 min-w-[240px]">
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-8 border-transparent border-t-white filter drop-shadow-sm"></div>
                    </div>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{data.fullMonth} {currentYear}</h4>
                      <div className="flex items-center text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                        <span>{conversionRate}% conversion</span>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-600">Calls Booked</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{data.callsBooked}</span>
                          {callsGrowth !== null && (
                            <div className={`flex items-center text-xs px-1.5 py-0.5 rounded ${
                              callsGrowth > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {callsGrowth > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                              {callsGrowth > 0 ? '+' : ''}{callsGrowth}%
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600">Leads Engaged</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{data.leadsEngaged}</span>
                          {leadsGrowth !== null && (
                            <div className={`flex items-center text-xs px-1.5 py-0.5 rounded ${
                              leadsGrowth > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                              {leadsGrowth > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                              {leadsGrowth > 0 ? '+' : ''}{leadsGrowth}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500">Avg per day</p>
                          <p className="font-semibold text-gray-700">{Math.round(data.callsBooked / 30)} calls</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Success rate</p>
                          <p className="font-semibold text-gray-700">{conversionRate}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Month Label */}
              <span className="text-sm text-gray-600 font-medium">{data.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
