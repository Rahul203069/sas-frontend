//@ts-nocheck



"use client"
import React, { useState,useEffect } from 'react';
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
import DashboardSkeleton from '@/components/DashBoardSkeleton';
import { DashboardAnalytics, getdashboardlytics } from '../action';
import { set } from 'date-fns';


 function getConversionRate(totalLeads: number, callsBooked: number): number {
  if (totalLeads === 0) return 0; // Avoid division by zero
  return (callsBooked / totalLeads) * 100;
}

type LeadCounts = {
  JUNK: number;
  WARM: number;
  HOT: number;
};

type LeadDataItem = {
  label: string;
  value: number;
  color: string;
};

 function mapLeadCountsToData(counts: LeadCounts): LeadDataItem[] {
  return [
    { label: 'Hot Leads', value: counts.HOT, color: '#EF4444' },
    { label: 'Warm Leads', value: counts.WARM, color: '#F59E0B' },
    { label: 'Cold Leads', value: counts.JUNK, color: '#6B7280' }
  ];
}



function page() {
  const leadData = [
    { label: 'Hot Leads', value: 93, color: '#EF4444' },
    { label: 'Warm Leads', value: 187, color: '#F59E0B' },
    { label: 'Cold Leads', value: 968, color: '#6B7280' }
  ];

  
  const [Dashboardinfoobject, setDashboardinfoobject] = useState<DashboardAnalytics|null>(null)
const [loading, setloading] = useState(true)
async function fetchData() {



 return await getdashboardlytics();


} 


useEffect(() => {


  fetchData().then((res)=>{ 

    console.log(res, "dashboard data");
setDashboardinfoobject(res);
 setloading(false);
})


  


  
}, [])





  if(loading){
    return(

      <Sidebarwrapper>


  <DashboardSkeleton></DashboardSkeleton>
    </Sidebarwrapper>
    );
  }else{

  return (
    <Sidebarwrapper>

    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <header className=" ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-7">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="mb-2">
                  <p className="text-lg text-gray-600">👋 Hey Rahul, welcome back!</p>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </header>
     
{/* <header className=" ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>
           
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Leads"
            value={Dashboardinfoobject?.leadstatus?.HOT + Dashboardinfoobject?.leadstatus?.WARM + Dashboardinfoobject?.leadstatus?.JUNK || '0'}
            change={12.5}
            changeType="increase"
            icon={<Users className="w-6 h-6 text-blue-400" />}
          />
          <MetricCard
            title="Leads Replied "
            value={Dashboardinfoobject?.Leadsreplied || '0'}
            change={8.2}
            changeType="increase"
            icon={<MessageSquare className="w-6 h-6 text-green-400" />}
            />
          <MetricCard
            title="Calls Booked"
            value={Dashboardinfoobject?.callbooked || '0'}
            change={15.3}
            changeType="increase"
            icon={<Phone className="w-6 h-6 text-purple-400" />}
            />
          <MetricCard
            title="Drop Off Rate"
            value={Dashboardinfoobject?.dropOffRate+'%' || '0%'}
            change={15.3}
            changeType="increase"
            icon={<Phone className="w-6 h-6 text-purple-400" />}
            />
          <MetricCard
            title="Convertion Rate"
            value={getConversionRate((Dashboardinfoobject?.leadstatus?.HOT + Dashboardinfoobject?.leadstatus?.WARM + Dashboardinfoobject?.leadstatus?.JUNK), Dashboardinfoobject?.callbooked ).toFixed(1) + '%'}
            change={22.1}
            changeType="increase"
            icon={<DollarSign className="w-6 h-6 text-yellow-400" />}
            />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {Dashboardinfoobject&&<RevenueChart MonthData={Dashboardinfoobject?.monthlyData} />}
          </div>
          <div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Lead Distribution</h3>
              <div className="space-y-4">
                {mapLeadCountsToData(Dashboardinfoobject.leadstatus).map((item, index) => (
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
                            width: `${(item.value / mapLeadCountsToData(Dashboardinfoobject.leadstatus).reduce((sum, i) => sum + i.value, 0)) * 100}%`,
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
           {Dashboardinfoobject&&<SMSPerformance  info={Dashboardinfoobject} />}
          {Dashboardinfoobject&&<ConversionFunnel info={Dashboardinfoobject} />}
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center">
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
  );}
}

export default page;

