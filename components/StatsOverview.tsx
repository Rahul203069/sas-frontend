import React from 'react';
import { TrendingUp, Users, MessageCircle, Calendar } from 'lucide-react';

interface StatsOverviewProps {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  totalMessages: number;
  callsBooked: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalLeads,
  hotLeads,
  warmLeads,
  coldLeads,
  totalMessages,
  callsBooked
}) => {
  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Hot Leads',
      value: hotLeads,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Messages Sent',
      value: totalMessages,
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Calls Booked',
      value: callsBooked,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white border border-gray-200/60 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} ${stat.color} rounded-lg p-2`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;