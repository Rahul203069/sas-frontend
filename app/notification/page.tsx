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
  ExternalLink
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

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 days');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  
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
      message_sent: 'bg-blue-25',
      meeting_booked: 'bg-green-25',
      hot_lead: 'bg-orange-25',
      reply_received: 'bg-purple-25',
      call_completed: 'bg-emerald-25',
      error: 'bg-red-25',
      automation_complete: 'bg-blue-25'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 dark:bg-gray-950/30';
  };

  return (
    <Sidebarwrapper>

    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
     

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Notifications & Logs
          </h2>
          <p className="text-gray-600">
            Track all lead interactions, automations, and system events
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px] relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by lead name or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                <span>{selectedCategory}</span>
                <ChevronDown size={16} />
              </button>
              
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {filterCategories.map((category) => (
                      <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Range Filter */}
            <div className="relative" ref={dateDropdownRef}>
              <button
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>{selectedDateRange}</span>
                <ChevronDown size={16} />
              </button>
              
              {dateDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {dateRanges.map((range) => (
                    <button
                    key={range}
                    onClick={() => {
                        setSelectedDateRange(range);
                        setDateDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Timeline */}
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                  <div
                  key={notification.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getBgColor(notification.type)} flex items-center justify-center`}>
                    <Icon size={20} className={getNotificationColor(notification.type)} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <span className="text-sm text-gray-500">
                          {notification.timestamp}
                        </span>
                      </div>
                      
                      {/* Action Button */}
                      <button className="ml-4 flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <span>View Lead</span>
                        <ExternalLink size={14} />
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
            <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No notifications found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
        </Sidebarwrapper>
  );
}

export default App;