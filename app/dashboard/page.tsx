import React from 'react';
import { DashBoardmetrics } from '@/components/DashBoardmetrics';
import Sidebarwrapper from '@/components/Sidebarwrapper';

export default function Dashboard() {
  return (
    <Sidebarwrapper>

    <div className="p-8">
      <div className="mb-8 group cursor-pointer">
        <h1 className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 group-hover:text-gray-500 transition-colors duration-300">
          Welcome back! Here's an overview of your metrics.
        </p>
      </div>

<DashBoardmetrics/>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
              <div 
              key={i} 
              className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
              >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    New lead captured
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    John Doe submitted a contact form
                  </p>
                </div>
                <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">2h ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
          </Sidebarwrapper>
  );
}