import React from 'react';
import { Users, DollarSign, LineChart, Bell } from 'lucide-react';

const metrics = [
  {
    label: 'Total Leads',
    value: '2,543',
    change: '+12.5%',
    icon: Users,
    trend: 'up'
  },
  {
    label: 'Revenue',
    value: '$45,234',
    change: '+8.2%',
    icon: DollarSign,
    trend: 'up'
  },
  {
    label: 'Conversion Rate',
    value: '3.8%',
    change: '-2.1%',
    icon: LineChart,
    trend: 'down'
  },
  {
    label: 'Active Users',
    value: '1,289',
    change: '+5.7%',
    icon: Bell,
    trend: 'up'
  }
];

export function DashBoardmetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.label}</p>
              <h3 className="text-2xl font-semibold mt-1 text-gray-900">{metric.value}</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
              <metric.icon className="w-6 h-6 text-gray-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
              metric.trend === 'up' 
                ? 'text-green-700 bg-green-50' 
                : 'text-red-700 bg-red-50'
            }`}>
              {metric.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}