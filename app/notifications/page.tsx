"use client";
import React, { useState, useMemo } from 'react';

import { SelectItem, SelectContent,SelectTrigger,SelectValue, Select } from "@/components/ui/select";
import {
  Bell,
  Search,
  Filter,
  Calendar,
  MessageCircle,
  Database,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Clock,
  Settings,
  Users,
  FileText,
  Zap,
  RefreshCw,
  MoreVertical,
  Check,
  Mail
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import Sidebarwrapper from '@/components/Sidebarwrapper';

// Mock data types
interface Notification {
  id: string;
  type: 'lead' | 'booking' | 'sync' | 'system';
  status: 'info' | 'success' | 'warning' | 'error';
  source: 'hubspot' | 'sheets' | 'ai' | 'calendar' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  leadName?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'lead',
    status: 'success',
    source: 'ai',
    title: 'AI messaged John Doe',
    description: 'Successfully sent personalized follow-up message about pricing inquiry',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false,
    leadName: 'John Doe'
  },
  {
    id: '2',
    type: 'booking',
    status: 'success',
    source: 'calendar',
    title: 'Call booked with Jane Smith',
    description: 'Demo call scheduled for tomorrow at 2:00 PM EST',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false,
    leadName: 'Jane Smith'
  },
  {
    id: '3',
    type: 'sync',
    status: 'error',
    source: 'sheets',
    title: 'Google Sheets sync failed',
    description: 'Unable to sync lead data from "Q1 Prospects" sheet - permission denied',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true
  },
  {
    id: '4',
    type: 'lead',
    status: 'warning',
    source: 'ai',
    title: 'Lead marked as hot - Michael Chen',
    description: 'High engagement score detected, recommended for immediate follow-up',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    isRead: false,
    leadName: 'Michael Chen'
  },
  {
    id: '5',
    type: 'system',
    status: 'error',
    source: 'system',
    title: 'CSV upload failed',
    description: 'Invalid format detected in row 15 - missing required email field',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '6',
    type: 'sync',
    status: 'warning',
    source: 'hubspot',
    title: 'HubSpot token expires soon',
    description: 'Authentication token will expire in 7 days - renewal required',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false
  },
  {
    id: '7',
    type: 'booking',
    status: 'warning',
    source: 'calendar',
    title: 'Time conflict detected',
    description: 'Overlapping appointments found for Sarah Wilson at 3:00 PM',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: true,
    leadName: 'Sarah Wilson'
  },
  {
    id: '8',
    type: 'lead',
    status: 'info',
    source: 'hubspot',
    title: 'New lead imported - David Park',
    description: 'Lead successfully imported from HubSpot with complete profile data',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: false,
    leadName: 'David Park'
  }
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = searchQuery === '' || 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (notification.leadName && notification.leadName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = selectedType === 'all' || notification.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
      
      // Date filtering
      const matchesDate = (() => {
        if (selectedDateFilter === 'all') return true;
        
        const now = new Date();
        const notificationDate = new Date(notification.timestamp);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const thisWeekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
        const lastWeekStart = new Date(thisWeekStart.getTime() - (7 * 24 * 60 * 60 * 1000));
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        
        switch (selectedDateFilter) {
          case 'today':
            return notificationDate >= today;
          case 'yesterday':
            return notificationDate >= yesterday && notificationDate < today;
          case 'thisWeek':
            return notificationDate >= thisWeekStart;
          case 'lastWeek':
            return notificationDate >= lastWeekStart && notificationDate < thisWeekStart;
          case 'thisMonth':
            return notificationDate >= thisMonthStart;
          case 'lastMonth':
            return notificationDate >= lastMonthStart && notificationDate <= lastMonthEnd;
          case 'last7Days':
            const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            return notificationDate >= last7Days;
          case 'last30Days':
            const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            return notificationDate >= last30Days;
          default:
            return true;
        }
      })();
      
      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [notifications, searchQuery, selectedType, selectedStatus, selectedDateFilter]);

  // Get notification counts
  const notificationCounts = useMemo(() => {
    return {
      all: notifications.length,
      lead: notifications.filter(n => n.type === 'lead').length,
      booking: notifications.filter(n => n.type === 'booking').length,
      sync: notifications.filter(n => n.type === 'sync').length,
      system: notifications.filter(n => n.type === 'system').length,
      unread: notifications.filter(n => !n.isRead).length
    };
  }, [notifications]);

  // Toggle read status
  const toggleReadStatus = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: !notification.isRead }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Clear notifications
  const clearNotifications = (type?: string) => {
    if (type && type !== 'all') {
      setNotifications(prev => prev.filter(notification => notification.type !== type));
    } else {
      setNotifications([]);
    }
  };

  // Get source icon
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'hubspot': return <Database className="w-4 h-4" />;
      case 'sheets': return <FileText className="w-4 h-4" />;
      case 'ai': return <Zap className="w-4 h-4" />;
      case 'calendar': return <Calendar className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  // Get status color
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-3 h-3" />;
      case 'warning': return <AlertTriangle className="w-3 h-3" />;
      case 'error': return <AlertCircle className="w-3 h-3" />;
      case 'info': return <Info className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lead': return <Users className="w-4 h-4" />;
      case 'booking': return <Calendar className="w-4 h-4" />;
      case 'sync': return <RefreshCw className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Sidebarwrapper>

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-50 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-sm text-gray-500">
                    {notificationCounts.unread} unread of {notificationCounts.all} total
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all read
                </button>
                <button
                  onClick={() => clearNotifications()}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications or lead names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4" />
                      <span>All Types ({notificationCounts.all})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="lead">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Lead Activity ({notificationCounts.lead})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="booking">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Calendar & Booking ({notificationCounts.booking})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sync">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>Sync & Integration ({notificationCounts.sync})</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>System Alerts ({notificationCounts.system})</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="info">
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span>Info</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="success">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Success</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="warning">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>Warning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="error">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span>Error</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDateFilter} onValueChange={setSelectedDateFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Today</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="yesterday">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Yesterday</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="last7Days">Last 7 Days</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="lastWeek">Last Week</SelectItem>
                  <SelectItem value="last30Days">Last 30 Days</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'You\'re all caught up! New notifications will appear here.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                  notification.isRead 
                  ? 'border-gray-200' 
                    : 'border-l-4 border-l-blue-500 border-t-gray-200 border-r-gray-200 border-b-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Source Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getSourceIcon(notification.source)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(notification.type)}
                            <h3 className={`text-sm font-semibold ${
                              notification.isRead ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                          </div>
                          
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            getStatusStyles(notification.status)
                          }`}>
                            {getStatusIcon(notification.status)}
                            <span className="ml-1 capitalize">{notification.status}</span>
                          </span>
                        </div>

                        <p className={`text-sm mb-3 ${
                          notification.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                          {notification.leadName && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{notification.leadName}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            {getSourceIcon(notification.source)}
                            <span className="capitalize">{notification.source}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleReadStatus(notification.id)}
                        className={`p-2 rounded-md text-xs font-medium transition-colors ${
                          notification.isRead
                            ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                        title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {notification.isRead ? (
                          <Mail className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More / Pagination */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Load more notifications
            </button>
          </div>
        )}
      </div>
    </div>
          </Sidebarwrapper>
  );
};

export default NotificationsPage;