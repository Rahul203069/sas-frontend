'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  Calendar, 
  Flame, 
  X, 
  MessageCircle, 
  User, 
  Phone,
  AlertTriangle,
  CheckCircle,
  Settings,
  Home,
  Users,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Menu
} from 'lucide-react';
import Sidebarwrapper from '@/components/Sidebarwrapper';

// Mock notification data
const notifications = [
  {
    id: 1,
    type: 'message_sent',
    icon: Mail,
    title: 'Message sent to Sarah Johnson',
    message: 'Introductory email sent via Gmail at 2:35 PM',
    timestamp: 'Today, 2:35 PM',
    leadId: 'lead_001',
    category: 'Messages'
  },
  {
    id: 2,
    type: 'meeting_booked',
    icon: Calendar,
    title: 'Meeting booked with David Chen',
    message: 'Property viewing scheduled for tomorrow at 10:00 AM via Calendly',
    timestamp: 'Today, 1:20 PM',
    leadId: 'lead_002',
    category: 'Meetings'
  },
  {
    id: 3,
    type: 'hot_lead',
    icon: Flame,
    title: 'Hot lead detected: Jennifer Smith',
    message: 'Lead scored 95/100 - responded within 2 minutes, high engagement',
    timestamp: 'Today, 12:45 PM',
    leadId: 'lead_003',
    category: 'Manual'
  },
  {
    id: 4,
    type: 'reply_received',
    icon: MessageCircle,
    title: 'Reply received from Michael Brown',
    message: '"Very interested in the downtown property. Can we schedule a call?"',
    timestamp: 'Today, 11:30 AM',
    leadId: 'lead_004',
    category: 'Replies'
  },
  {
    id: 5,
    type: 'call_completed',
    icon: Phone,
    title: 'Call completed with Lisa Anderson',
    message: '15-minute discovery call completed - marked as qualified lead',
    timestamp: 'Today, 10:15 AM',
    leadId: 'lead_005',
    category: 'Manual'
  },
  {
    id: 6,
    type: 'error',
    icon: AlertTriangle,
    title: 'Email delivery failed',
    message: 'Failed to send follow-up email to robert.wilson@example.com - invalid email',
    timestamp: 'Yesterday, 6:20 PM',
    leadId: 'lead_006',
    category: 'Errors'
  },
  {
    id: 7,
    type: 'automation_complete',
    icon: CheckCircle,
    title: 'Automation sequence completed',
    message: 'Welcome series (5 emails) completed for Emma Davis - 80% open rate',
    timestamp: 'Yesterday, 4:45 PM',
    leadId: 'lead_007',
    category: 'Messages'
  },
  {
    id: 8,
    type: 'meeting_booked',
    icon: Calendar,
    title: 'Meeting booked with James Wilson',
    message: 'Consultation call scheduled for Friday at 3:00 PM via Zoom',
    timestamp: 'Yesterday, 2:10 PM',
    leadId: 'lead_008',
    category: 'Meetings'
  }
];

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'conversations', label: 'Conversations', icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell, active: true },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const filterCategories = [
  'All',
  'Messages', 
  'Replies',
  'Meetings',
  'Errors',
  'Manual'
];

const dateRanges = [
  'Last 7 days',
  'Last 30 days',
  'Last 90 days',
  'Custom'
];

function page() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 days');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesCategory = selectedCategory === 'All' || notification.category === selectedCategory;
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const getNotificationColor = (type: string) => {
    const colors = {
      message_sent: 'text-blue-500',
      meeting_booked: 'text-green-500',
      hot_lead: 'text-orange-500',
      reply_received: 'text-purple-500',
      call_completed: 'text-emerald-500',
      error: 'text-red-500',
      automation_complete: 'text-blue-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-500';
  };

  const getBgColor = (type: string) => {
    const colors = {
      message_sent: 'bg-blue-50',
      meeting_booked: 'bg-green-50',
      hot_lead: 'bg-orange-50',
      reply_received: 'bg-purple-50',
      call_completed: 'bg-emerald-50',
      error: 'bg-red-50',
      automation_complete: 'bg-blue-50'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50';
  };

  return (
   <Sidebarwrapper>
  <div className="min-h-screen bg-gray-50 text-gray-900">
    {/* Page Layout Wrapper */}
    <div className=" p-4 sm:p-6 lg:p-8 w-full">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Notifications & Logs
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Track all lead interactions, automations, and system events
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 lg:mb-8 shadow-sm w-full">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-700 font-medium"
            >
              <span className="flex items-center space-x-2">
                <Filter size={16} />
                <span>Filters</span>
              </span>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${filtersExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Filter Content */}
          <div className={`${filtersExpanded ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 min-w-0 relative order-1 lg:order-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by lead name or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 order-2 lg:order-2">
                {/* Category Filter */}
                <div className="relative flex-1 sm:flex-none" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="flex items-center justify-between w-full sm:w-auto space-x-2 px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    <div className="flex items-center space-x-2">
                      <Filter size={16} className="sm:hidden" />
                      <span className="whitespace-nowrap">{selectedCategory}</span>
                    </div>
                    <ChevronDown size={16} />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      {filterCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setCategoryDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm sm:text-base"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Filter */}
                <div className="relative flex-1 sm:flex-none" ref={dateDropdownRef}>
                  <button
                    onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                    className="flex items-center justify-between w-full sm:w-auto space-x-2 px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    <span className="whitespace-nowrap">{selectedDateRange}</span>
                    <ChevronDown size={16} />
                  </button>

                  {dateDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      {dateRanges.map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setSelectedDateRange(range);
                            setDateDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-sm sm:text-base"
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 sm:space-y-4 w-full">
          {filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 group w-full max-w-3xl mx-auto"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${getBgColor(notification.type)} flex items-center justify-center`}
                  >
                    <Icon size={16} className={`sm:w-5 sm:h-5 ${getNotificationColor(notification.type)}`} />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 leading-tight">
                          {notification.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-2 line-clamp-2 sm:line-clamp-none">
                          {notification.message}
                        </p>
                        <span className="text-xs sm:text-sm text-gray-500">{notification.timestamp}</span>
                      </div>

                      {/* View Lead Button */}
                      <button className="flex items-center space-x-1 px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100 self-start">
                        <span className="whitespace-nowrap">View Lead</span>
                        <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <Bell size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Result Count (Mobile Only) */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center sm:hidden">
            <p className="text-sm text-gray-500">
              Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
</Sidebarwrapper>
  );
}

export default page;