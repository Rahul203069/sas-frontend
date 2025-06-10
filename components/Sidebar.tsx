"use client"
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bot,
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const navItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/dashboard',
    badge: null
  },
  { 
    icon: Users, 
    label: 'Leads', 
    href: '/leads',
    badge: '12'
  },
  {
    icon: Bot,
    label: 'AI Assistant',
    href: '/bot',
    badge: null
  },
  {
    icon: Calendar, 
    label: 'Appointments', 
    href: '/appointments',
    badge: '3'
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    href: '/settings',
    badge: null
  },
  { 
    icon: CreditCard, 
    label: 'Billing', 
    href: '/billing',
    badge: null
  },
];

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "h-screen bg-white border-r border-gray-100",
        "transition-all duration-300 ease-in-out fixed z-40",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100">
          <div className={cn(
            "flex items-center transition-all duration-300",
            isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          )}>
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-semibold text-gray-900 text-base">LeadAI</h1>
          </div>
          
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <div
                key={item.href}
                className={cn(
                  "group relative flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer",
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  !isExpanded && "justify-center"
                )}
                onClick={() => router.push(item.href)}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r-full" />
                )}

                <item.icon className="w-5 h-5 flex-shrink-0" />
                
                {isExpanded && (
                  <>
                    <span className="ml-3 font-medium text-sm">
                      {item.label}
                    </span>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-12 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                    {item.badge && (
                      <span className="ml-1 px-1 py-0.5 text-xs bg-red-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Upgrade Card */}
        {isExpanded && (
          <div className="p-3 m-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded flex items-center justify-center mr-2">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">Upgrade</span>
            </div>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Get unlimited access to all features
            </p>
            <button className="w-full bg-gray-900 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
              Go Pro
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={cn(
              "w-full group flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200",
              "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
              !isExpanded && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && (
              <span className="ml-3 font-medium text-sm">
                Sign Out
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-12 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}