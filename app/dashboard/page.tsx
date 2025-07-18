import React from 'react';
import { 
  Users, 
  MessageSquare, 
  Phone, 
  TrendingUp, 
  DollarSign, 
  Upload,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { LeadChart } from '@/components/LeadChart';
import { ActivityFeed } from '@/components/ActivityFeed';
import Sidebarwrapper from '@/components/Sidebarwrapper';
import { ConversionFunnel } from '@/components/ConversionFunnel';
import { RevenueChart } from '@/components/RevenueChart';
import { SMSPerformance } from '@/components/SMSPerformance';

function page() {
  const leadData = [
    { label: 'Hot Leads', value: 93, color: '#EF4444' },
    { label: 'Warm Leads', value: 187, color: '#F59E0B' },
    { label: 'Cold Leads', value: 968, color: '#6B7280' }
  ];

  return (
    <Sidebarwrapper>

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     
<header className=" ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
           
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Leads"
            value="1,248"
            change={12.5}
            changeType="increase"
            icon={<Users className="w-6 h-6 text-blue-400" />}
          />
          <MetricCard
            title="SMS Campaigns"
            value="47"
            change={8.2}
            changeType="increase"
            icon={<MessageSquare className="w-6 h-6 text-green-400" />}
            />
          <MetricCard
            title="Calls Booked"
            value="312"
            change={15.3}
            changeType="increase"
            icon={<Phone className="w-6 h-6 text-purple-400" />}
            />
          <MetricCard
            title="Revenue"
            value="$28.4K"
            change={22.1}
            changeType="increase"
            icon={<DollarSign className="w-6 h-6 text-yellow-400" />}
            />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Distribution</h3>
              <div className="space-y-4">
                {leadData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-700 text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-900 font-semibold mr-3">{item.value}</span>
                      <div className="w-20 bg-gray-100 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(item.value / leadData.reduce((sum, i) => sum + i.value, 0)) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SMSPerformance />
          <ConversionFunnel />
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </button>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                New SMS Campaign
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
                            </Sidebarwrapper>
  );
}

export default page;