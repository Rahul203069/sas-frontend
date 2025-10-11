import React, { useEffect, useState } from 'react';
import { Send, MessageCircle, Clock, CheckCircle, Info } from 'lucide-react';

const smsMetrics = [
  { 
    label: 'Total Leads Contacted',
    description: 'total number of calls scheduled through the bot.', 
    value: '2,847', 
    icon: Send, 
    color: 'text-blue-400' 
  },
  { 
    label: 'Response Rate',
    description: '% of leads that replied at least once.', 
    value: '2,731', 
    icon: CheckCircle, 
    color: 'text-green-400' 
  },
  { 
    label: 'Time to First Response',
    description: 'avg. time it takes for a lead to reply after bot\'s first SMS.', 
    value: '1,243', 
    icon: MessageCircle, 
    color: 'text-purple-400' 
  },
  { 
    label: 'Drop-off Rate',
    description: '% of leads who replied once but didn\'t continue the conversation', 
    value: '116', 
    icon: Clock, 
    color: 'text-yellow-400' 
  }
];

function mapinfo(info:DashboardAnalytics){


console.log(info);

  return [{ 
    label: 'Total Leads Contacted',
    description: 'total number of calls scheduled through the bot.', 
    value: info.initiatedCount, 
    icon: Send, 
    color: 'text-blue-400' 
  },
  { 
    label: 'Response Rate',
    description: '% of leads that replied at least once.', 
    value: info.responseRate, 
    icon: CheckCircle, 
    color: 'text-green-400' 
  },
  { 
    label: 'Time to First Response',
    description: 'avg. time it takes for a lead to reply after bot\'s first SMS.', 
    value: info.avgTimeToFirstResponse, 
    icon: MessageCircle, 
    color: 'text-purple-400' 
  },
  { 
    label: 'Drop-off Rate',
    description: '% of leads who replied once but didn\'t continue the conversation', 
    value: info.dropOffRate, 
    icon: Clock, 
    color: 'text-yellow-400' 
  }
];
}

import { DashboardAnalytics } from '@/app/action';

export function SMSPerformance({ info }:{info:DashboardAnalytics}) {
  const [hoveredMetric, setHoveredMetric] = useState(null);

useEffect(() => {

  console.log(info, "info in sms performance");
}, [])


  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Bot Engagement Performance</h3>
      <div className="grid grid-cols-2 gap-4">
        {mapinfo(info).map((metric, index) => (
          <div 
            key={metric.label} 
            className="bg-gray-50 rounded-lg p-4 relative group cursor-pointer transition-all duration-200 hover:bg-gray-100"
            onMouseEnter={() => setHoveredMetric(index)}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold gap-4 text-gray-900">{metric.value}{metric.label.includes('Rate')&&'%'}  </span>
                <Info className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
            <p className="text-sm text-gray-600">{metric.label}</p>
            
            {/* Tooltip */}
            {hoveredMetric === index && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                <div className="bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                  {metric.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Response Rate</span>
          <span className="text-sm font-semibold text-green-400">45.5%</span>
        </div>
        <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
          <div className="w-[45.5%] bg-green-400 h-2 rounded-full" />
        </div>
      </div>
    </div>
  );
}