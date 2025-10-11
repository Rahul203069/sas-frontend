import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="animate-pulse space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
            <div className="h-24 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
        
        {/* Main Content Grid - Revenue Chart (2/3) + Lead Distribution (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 rounded-lg"></div>
          <div className="h-80 bg-slate-200 rounded-lg"></div>
        </div>
        
        {/* Bottom Grid - SMS Campaign (1/3) + Conversion Funnel (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 rounded-lg"></div>
          <div className="lg:col-span-2 h-64 bg-slate-200 rounded-lg"></div>
        </div>
        
        {/* Recent Activity and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-48 bg-slate-200 rounded-lg"></div>
          <div className="h-48 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;