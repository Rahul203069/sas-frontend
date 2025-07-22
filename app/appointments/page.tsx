"use client"
import React, { useState, useMemo } from 'react';
import { Search, Calendar, Clock, Phone, Mail, MessageSquare, Video, MapPin, User, Filter, Plus, CheckCircle, XCircle, AlertCircle, Eye, FileText, CalendarDays, ChevronDown, SlidersHorizontal, Circle, Check, CheckCircle2 } from 'lucide-react';
import { Appointment } from '@/type/appointment';
import { generateMockAppointments } from '@/data/mockData';
import { Pagination } from '@/components/Pagination';
import { CalendarDatePicker } from '@/components/CalendarDatePicker';
import { FilterChip } from '@/components/FilterChip';
import Sidebarwrapper from '@/components/Sidebarwrapper';
import { Select } from '@/components/ui/Select';

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  { 
    value: 'all', 
    label: 'All Status', 
    icon: <Circle className="w-4 h-4" />,
    color: 'bg-blue-400',
    description: 'Show all items'
  },
  { 
    value: 'confirmed', 
    label: 'Confirmed', 
    icon: <Check className="w-4 h-4" />,
    color: 'bg-green-400',
    description: 'Verified and approved'
  },
  { 
    value: 'pending', 
    label: 'Pending', 
    icon: <Clock className="w-4 h-4" />,
    color: 'bg-orange-400',
    description: 'Awaiting action'
  },
  { 
    value: 'cancelled', 
    label: 'Cancelled', 
    icon: <XCircle className="w-4 h-4" />,
    color: 'bg-red-400',
    description: 'No longer needed'
  },
  { 
    value: 'completed', 
    label: 'Completed', 
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'bg-purple-400',
    description: 'Successfully finished'
  },
];

function App() {
  const [appointments, setAppointments] = useState<Appointment[]>(() => generateMockAppointments(150));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showPreparation, setShowPreparation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const markAsComplete = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'completed' as const }
          : apt
      )
    );
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = appointment.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        const appointmentDate = new Date(appointment.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end + 'T23:59:59');
        matchesDate = appointmentDate >= startDate && appointmentDate <= endDate;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchTerm, statusFilter, dateRange]);

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateRange]);

  const openChatHistory = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowChatHistory(true);
  };

  const openPreparation = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPreparation(true);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
  };

  const getActiveFilters = () => {
    const filters = [];
    if (statusFilter !== 'all') {
      const status = STATUS_OPTIONS.find(s => s.value === statusFilter);
      if (status) filters.push({ type: 'status', label: 'Status', value: status.label, onRemove: () => setStatusFilter('all') });
    }
    if (dateRange.start || dateRange.end) {
      const dateLabel = dateRange.start && dateRange.end
        ? `${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`
        : dateRange.start 
          ? `From ${new Date(dateRange.start).toLocaleDateString()}`
          : `Until ${new Date(dateRange.end).toLocaleDateString()}`;
      filters.push({ type: 'date', label: 'Date Range', value: dateLabel, onRemove: () => setDateRange({ start: '', end: '' }) });
    }
    if (searchTerm) {
      filters.push({ type: 'search', label: 'Search', value: `"${searchTerm}"`, onRemove: () => setSearchTerm('') });
    }
    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <Sidebarwrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Filters Section */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            {/* Main Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or service..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/90 hover:bg-white hover:shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
               <Select
              label="Filter by Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_OPTIONS}
              placeholder="Select a status..."
            />
                
                {/* Date Range Picker */}
                <CalendarDatePicker
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onChange={(start, end) => setDateRange({ start, end })}
                  onClear={() => setDateRange({ start: '', end: '' })}
                />

                {/* Results Count */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium border border-blue-200 shadow-sm">
                  {filteredAppointments.length} of {appointments.length}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium mr-2">Active filters:</span>
                    {activeFilters.map((filter, index) => (
                      <FilterChip
                        key={index}
                        label={filter.label}
                        value={filter.value}
                        onRemove={filter.onRemove}
                        color={filter.type === 'status' ? 'green' : filter.type === 'date' ? 'blue' : 'purple'}
                      />
                    ))}
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Appointments List */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-200">
              {paginatedAppointments.map((appointment) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{appointment.leadName}</h3>
                        <p className="text-gray-600 font-medium">{appointment.service}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200' :
                            appointment.status === 'pending' ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-200' :
                            appointment.status === 'completed' ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-200' :
                            'bg-red-100 text-red-800 ring-1 ring-red-200'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openChatHistory(appointment)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Chat History</span>
                      </button>
                      <button
                        onClick={() => openPreparation(appointment)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Preparation</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(appointment.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <Clock className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Time</p>
                            <p className="font-medium text-gray-900">{appointment.time} ({appointment.duration}m)</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <MapPin className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium text-gray-900">{appointment.location || 'Virtual'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <User className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="text-sm text-gray-600">Source</p>
                            <p className="font-medium text-gray-900">{appointment.leadSource}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-900">{appointment.email}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-900">{appointment.phone}</span>
                          </div>
                          {appointment.meetingLink && (
                            <div className="flex items-center space-x-3">
                              <Video className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-blue-600">Meeting Link Available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => markAsComplete(appointment.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </button>
                      
                      <div className="text-sm text-gray-500">
                        {new Date(appointment.date + ' ' + appointment.time).getTime() > new Date().getTime() ? (
                          <span className="text-emerald-600 font-medium">Upcoming</span>
                        ) : (
                          <span className="text-gray-600">Past</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {filteredAppointments.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or book a new appointment.</p>
                <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  Book New Appointment
                </button>
              </div>
            )}
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredAppointments.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>

        {/* Chat History Modal */}
        {showChatHistory && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Chat History - {selectedAppointment.leadName}</h3>
                  <button 
                    onClick={() => setShowChatHistory(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="space-y-4">
                  {selectedAppointment.chatHistory.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'bot' 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'bot' ? 'text-gray-500' : 'text-blue-100'
                        }`}>
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preparation Modal */}
        {showPreparation && selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Call Preparation - {selectedAppointment.leadName}</h3>
                  <button 
                    onClick={() => setShowPreparation(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Conversation Summary
                    </h4>
                    <p className="text-sm text-blue-800 leading-relaxed">{selectedAppointment.chatSummary}</p>
                  </div>
                  
                  {selectedAppointment.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Additional Notes
                      </h4>
                      <p className="text-sm text-amber-800">{selectedAppointment.notes}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Discussion Points</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Review their current challenges and pain points</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Present relevant solutions based on their needs</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Discuss implementation timeline and next steps</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebarwrapper>
  );
}

export default App;