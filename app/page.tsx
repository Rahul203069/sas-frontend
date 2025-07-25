"use client"
import React, { ReactNode, useState } from 'react';

import { Bell, X } from 'lucide-react';



import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Sidebar } from "@/components/Sidebar";
import { ModeToggle } from '@/components/ui/ThemTogle';
export default function Home() {



const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
const [showNotification, setShowNotification] = useState(true);


  return (


    <div className="flex h-screen bg-gray-50">
    <Sidebar 
      isExpanded={isSidebarExpanded} 
      onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} 
    />
    
    <main className={`flex-1 overflow-auto transition-all duration-300 ${
      isSidebarExpanded ? 'ml-64' : 'ml-20'
    }`}>
      {showNotification && (
        <div className="bg-blue-50 p-4 m-4 rounded-lg border border-blue-100 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-blue-500" />
            <p className="text-blue-700">Welcome to your new dashboard! Take a tour of the new features.</p>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

  
      <div className='w-full flex justify-end items-center'></div>
    </main>
  </div>
  );
}
