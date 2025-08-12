"use client"
import React, { useState } from 'react';
import { Calendar, ArrowRight, Zap, Clock, CheckCircle, Bot } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';
import clsx from 'clsx';
import Sidebarwrapper from '@/components/Sidebarwrapper';

function CalendarConnect() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const handleGoogleCalendarConnect = () => {
    setLoader(true);
    axios.get("/api/auth/google-calendar").then((res) => {
      router.push(res.data.redirect);
      setLoader(false);
    }).catch(() => {
      setLoader(false);
    });
  };

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Scheduling",
      description: "Let AI automatically find the best meeting times"
    },
    {
      icon: Clock,
      title: "Smart Availability",
      description: "Real-time calendar sync prevents double bookings"
    },
    {
      icon: CheckCircle,
      title: "Seamless Integration", 
      description: "Works perfectly with your existing workflow"
    }
  ];

  return (
    <Sidebarwrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
          <div className="max-w-4xl w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Main Content */}
              <div className="space-y-8">
                <div className="text-center lg:text-left space-y-6">
                  <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    AI-Powered Booking
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Connect Your 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Calendar</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Enable intelligent scheduling by connecting your Google Calendar. Our AI will automatically manage your availability and book meetings at optimal times.
                  </p>
                </div>

                {/* Connection Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                  <button
                    onClick={handleGoogleCalendarConnect}
                    disabled={loader}
                    className={clsx(
                      "w-full group relative overflow-hidden",
                      "bg-gradient-to-r from-blue-600 to-indigo-600",
                      "hover:from-blue-700 hover:to-indigo-700",
                      "text-white rounded-2xl p-6",
                      "transition-all duration-300 transform",
                      "hover:scale-[1.02] hover:shadow-xl",
                      "disabled:opacity-70 disabled:cursor-not-allowed",
                      "focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    )}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        {loader ? (
                          <div className="w-12 h-12 flex items-center justify-center">
                            <ClipLoader color="#ffffff" size={24} />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Image 
                              src="/icons8-google-calendar-48.png"
                              alt="Google Calendar"
                              width={32}
                              height={32}
                              className="rounded-lg"
                            />
                          </div>
                        )}
                        <div className="text-left">
                          <p className="font-bold text-lg">
                            {loader ? "Connecting..." : "Connect Google Calendar"}
                          </p>
                          <p className="text-white/80 text-sm">
                            Enable AI booking in seconds
                          </p>
                        </div>
                      </div>
                      {!loader && (
                        <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" />
                      )}
                    </div>
                    
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Secure & Private
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    No Data Stored
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Instant Setup
                  </div>
                </div>
              </div>

              {/* Right Column - Features */}
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Why Connect Your Calendar?
                  </h2>
                </div>

                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/80 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional info card */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900 mb-1">
                        AI Booking Requirement
                      </h4>
                      <p className="text-sm text-amber-700 leading-relaxed">
                        Calendar connection is required for our AI to check availability, prevent conflicts, and automatically schedule meetings at the best times.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Your calendar data remains private and secure with enterprise-grade encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebarwrapper>
  );
}

export default CalendarConnect;