import React, { useState } from 'react';

import {
  BarChart3,
  Calendar,
  MessageSquare,
  CreditCard,
  Bot,
  Users,
  LayoutGrid,
  ChevronLeft,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react';

// Inline Button component
const Button = ({ children, variant = 'default', size = 'default', className = '', onClick, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Inline Badge component
const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-full text-xs font-medium px-2 py-1';
  const variants = {
    default: 'bg-gray-900 text-gray-50',
    secondary: 'bg-gray-100 text-gray-900',
  };
  
  return (
    <span 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
};

// Inline Avatar components
const Avatar = ({ children, className = '', ...props }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt = '', className = '', ...props }) => (
  <img 
    src={src} 
    alt={alt} 
    className={`aspect-square h-full w-full object-cover ${className}`} 
    {...props}
  />
);

const AvatarFallback = ({ children, className = '', ...props }) => (
  <div 
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Inline Separator component
const Separator = ({ className = '', orientation = 'horizontal', ...props }) => (
  <div
    className={`shrink-0 bg-gray-200 ${
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
    } ${className}`}
    {...props}
  />
);

// Utility function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutGrid,
    href: '/dashboard',
    isActive: true,
  },
  {
    title: 'Leads',
    icon: Users,
    href: '/leads',
    badge: '12',
  },
  {
    title: 'Appointments',
    icon: Calendar,
    href: '/appointments',
    badge: '3',
  },
  {
    title: 'Conversations',
    icon: MessageSquare,
    href: '/conversations',
    badge: '5',
  },
  {
    title: 'Billing',
    icon: CreditCard,
    href: '/billing',
  },
  {
    title: 'Bot Config',
    icon: Bot,
    href: '/bot-config',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
  },
];

export default function Sidebar({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">SaaSFlow</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  collapsed && 'rotate-180'
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  'w-full justify-start h-10 px-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium',
                  collapsed && 'px-2',
                  item.isActive &&
                    'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:text-blue-800'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto h-5 px-1.5 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </nav>

          {/* User Profile - Moved to Bottom */}
          <div className="mt-auto">
            <Separator className="mx-4 mb-4" />
            <div className="p-4">
              <div
                className={cn(
                  'flex items-center space-x-3',
                  collapsed && 'justify-center space-x-0'
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">JD</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      john@example.com
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500 text-white">
                3
              </Badge>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children || (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Leads</h3>
                  <p className="text-3xl font-bold text-blue-600">127</p>
                  <p className="text-sm text-gray-500">+12% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Conversations</h3>
                  <p className="text-3xl font-bold text-green-600">43</p>
                  <p className="text-sm text-gray-500">+8% from last week</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointments</h3>
                  <p className="text-3xl font-bold text-purple-600">18</p>
                  <p className="text-sm text-gray-500">Next: Today at 2:00 PM</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}