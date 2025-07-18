import React from 'react';
import { Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';

const smsMetrics = [
  { label: 'Messages Sent', value: '2,847', icon: Send, color: 'text-blue-400' },
  { label: 'Delivered', value: '2,731', icon: CheckCircle, color: 'text-green-400' },
  { label: 'Replied', value: '1,243', icon: MessageCircle, color: 'text-purple-400' },
  { label: 'Pending', value: '116', icon: Clock, color: 'text-yellow-400' }
];

export function SMSPerformance() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">SMS Campaign Performance</h3>
      <div className="grid grid-cols-2 gap-4">
        {smsMetrics.map((metric) => (
          <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
              <span className="text-xl font-bold text-gray-900">{metric.value}</span>
            </div>
            <p className="text-sm text-gray-600">{metric.label}</p>
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