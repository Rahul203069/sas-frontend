
"use client"
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import clsx from 'clsx';
import Image from 'next/image'
import { FcGoogle } from "react-icons/fc";
import { Sidebar } from '@/components/Sidebar';
import Sidebarwrapper from '@/components/Sidebarwrapper';
import { google } from 'googleapis';
import axios from 'axios';

import { useRouter } from 'next/navigation';
function App() {


    const router= useRouter()
  const handleGoogleCalendarConnect = () => {
    
    axios.get("/api/auth/google-calendar").then((res) => {
    router.push(res.data.redirect)
    })
  };

  return (
    <Sidebarwrapper>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 ">
          {/* Header */}
          <div className="text-center space-y-2 cursor-pointer">
            <div className="flex justify-center cursor-pointer">
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Connect Your Calendar</h1>
            <p className="text-gray-600">
              Sync your calendar to automatically manage your availability and schedule meetings efficiently.
            </p>
          </div>

          {/* Integration Button */}
          <button
            onClick={handleGoogleCalendarConnect}
            className={clsx(
                "w-full flex items-center justify-between",
                "px-6 py-4 rounded-xl",
              "bg-white border-2 border-gray-200",
              "hover:border-blue-500 hover:shadow-md",
              "transition-all duration-200",
              "group"
            )}
            >
            <div className="flex items-center gap-4 cursor-pointer">
            <Image 
  src="/icons8-google-calendar-48.png"
  alt="Google Calendar"
  width={48}
  height={48}
/>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Google Calendar</p>
                <p className="text-sm text-gray-600">Connect your Google Calendar</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </button>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Your calendar will be used to check for conflicts and update your availability.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Your calendar events will remain private and secure.
        </p>
      </div>
    </div>
              </Sidebarwrapper>
  );
}

export default App;