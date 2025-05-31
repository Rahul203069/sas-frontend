
"use client"
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  CalendarClockIcon,
  BotMessageSquare,
  LogOut,
  icons
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Router } from 'express';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { URLPattern } from 'next/server';
import path from 'path';
import { MdOutlineCalendarMonth } from "react-icons/md"
interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const navItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: 'http://localhost:3000/dashboard' 
  },
  { 
    icon: Users, 
    label: 'Leads', 
    href: 'http://localhost:3000/leads' 
  },
  {icon: BotMessageSquare,
    label:'Bot',
    herf:'http://localhost:3000/bot'
  },
  {
    icon: CalendarClockIcon, 
    label: 'Appointments', 
    href: 'http://localhost:3000/appointments' 
  },

  { 
    icon: Settings, 
    label: 'Settings', 
    href: 'http://localhost:3000/settings' 
  },
  { 
    icon: CreditCard, 
    label: 'Billing', 
    href: 'http://localhost:3000/billing' 
  },
];

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
//   const location = useLocation();

//   const handleLogout = () => {
//     // Add logout logic here
//     console.log('Logging out...');
//   };
const Router=useRouter()
const pathname= usePathname()


  return (
    <aside 
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out fixed",
        isExpanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className={cn(
            "font-semibold transition-opacity duration-300 justify-center pl-4 flex",
            isExpanded ? "opacity-100" : "opacity-0 hidden"
          )}>
            Lead ai
          </h1>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
     
            const isActive = pathname === item.href
            return (
              <div
                key={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  isActive 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-700 hover:bg-gray-50",
                  !isExpanded && "justify-center"
                )}
                onClick={()=>{Router.replace(item.href)}}
              >
              
                
              
                <item.icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-gray-900" : "text-gray-700"
                )} />
                {isExpanded && (
                  <span className="ml-3 transition-opacity duration-300 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={()=>{ signOut({callbackUrl: '/login'})}}
            className={cn(
              "w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300",
              "text-red-600 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98]",
              !isExpanded && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {isExpanded && (
              <span className="ml-3 font-medium transition-opacity duration-300 whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}