import React from 'react';
import { MessageSquare, Phone, Upload, Target } from 'lucide-react';

interface Activity {
  id: string;
  type: 'sms' | 'call' | 'upload' | 'conversion';
  message: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'sms',
    message: 'SMS sent to 45 leads in "Enterprise Q1" campaign',
    timestamp: '2 minutes ago',
    status: 'success'
  },
  {
    id: '2',
    type: 'call',
    message: 'Call scheduled with Sarah Johnson',
    timestamp: '15 minutes ago',
    status: 'success'
  },
  {
    id: '3',
    type: 'upload',
    message: 'CSV file processed: 127 new leads imported',
    timestamp: '1 hour ago',
    status: 'success'
  },
  {
    id: '4',
    type: 'conversion',
    message: 'Lead marked as HOT: Michael Chen',
    timestamp: '2 hours ago',
    status: 'success'
  },
  {
    id: '5',
    type: 'sms',
    message: 'SMS campaign "Follow-up Sequence" completed',
    timestamp: '3 hours ago',
    status: 'success'
  }
];

export function ActivityFeed() {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'sms':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'call':
        return <Phone className="w-4 h-4 text-green-400" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-purple-400" />;
      case 'conversion':
        return <Target className="w-4 h-4 text-orange-400" />;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                {getIcon(activity.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">{activity.message}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
          </div>
        ))}
      </div>
    </div>
  );
}