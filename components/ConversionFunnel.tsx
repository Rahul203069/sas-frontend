import React from 'react';

interface FunnelStage {
  label: string;
  value: number;
  color: string;
}
import { DashboardAnalytics } from '@/app/action';



function mapdata(info:DashboardAnalytics){


return   [
  { label: 'First Message sent', value: info.initiatedCount, color: '#3B82F6' },
  { label: 'Leads Replied', value: info.Leadsreplied, color: '#10B981' },
  { label: 'Call Scheduled', value: info.callbooked, color: '#F59E0B' },
  { label: 'Call Completed', value: info.callcompleted, color: '#EF4444' },
  { label: 'Hot Leads', value: info.leadstatus.HOT, color: '#8B5CF6' }
];


}

const funnelData: FunnelStage[] = [
  { label: 'First Message sent', value: 1248, color: '#3B82F6' },
  { label: 'Leads Replied', value: 624, color: '#10B981' },
  { label: 'Call Scheduled', value: 312, color: '#F59E0B' },
  { label: 'Call Completed', value: 187, color: '#EF4444' },
  { label: 'Hot Leads', value: 93, color: '#8B5CF6' }
];

export function ConversionFunnel({info}:{info:DashboardAnalytics}) {
  const maxValue = funnelData[0].value;
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
      <div className="space-y-3">
        {mapdata(info).map((stage, index) => {
          const percentage = (stage.value / maxValue) * 100;
          const conversionRate = index > 0 ? ((stage.value / funnelData[index - 1].value) * 100).toFixed(1) : '100.0';
          
          return (
            <div key={stage.label} className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{stage.value.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 ml-2">({conversionRate}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: stage.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}