import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CalendarDatePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  onClear: () => void;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  startDate,
  endDate,
  onChange,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState<Date | null>(
    startDate ? new Date(startDate) : null
  );
  const [tempEndDate, setTempEndDate] = useState<Date | null>(
    endDate ? new Date(endDate) : null
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectionMode, setSelectionMode] = useState<'single' | 'range'>('range');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateRange = () => {
    if (!startDate && !endDate) return 'Select date range';
    if (startDate && !endDate) return `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    if (!startDate && endDate) return `Until ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    if (startDate === endDate) {
      return `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    
    return `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    if (selectionMode === 'single') {
      setTempStartDate(date);
      setTempEndDate(date);
    } else {
      if (!tempStartDate || (tempStartDate && tempEndDate)) {
        // Start new selection
        setTempStartDate(date);
        setTempEndDate(null);
      } else if (date < tempStartDate) {
        // If clicked date is before start date, make it the new start date
        setTempStartDate(date);
        setTempEndDate(null);
      } else {
        // Set as end date
        setTempEndDate(date);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!tempStartDate) return false;
    if (selectionMode === 'single') return isSameDay(date, tempStartDate);
    if (!tempEndDate && !hoverDate) return isSameDay(date, tempStartDate);
    
    const endDate = tempEndDate || (hoverDate && tempStartDate && hoverDate >= tempStartDate ? hoverDate : null);
    if (!endDate) return isSameDay(date, tempStartDate);
    
    return date >= tempStartDate && date <= endDate;
  };

  const isDateRangeStart = (date: Date) => {
    return tempStartDate && isSameDay(date, tempStartDate);
  };

  const isDateRangeEnd = (date: Date) => {
    if (selectionMode === 'single') return false;
    const endDate = tempEndDate || (hoverDate && tempStartDate && hoverDate > tempStartDate ? hoverDate : null);
    return endDate && isSameDay(date, endDate);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleApply = () => {
    if (tempStartDate) {
      if (selectionMode === 'single' || !tempEndDate) {
        onChange(
          tempStartDate.toISOString().split('T')[0],
          tempStartDate.toISOString().split('T')[0]
        );
      } else {
        onChange(
          tempStartDate.toISOString().split('T')[0],
          tempEndDate.toISOString().split('T')[0]
        );
      }
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onClear();
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full min-w-[320px] px-5 py-4 
          bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg
          focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500
          transition-all duration-300 text-sm group shadow-sm
          ${(startDate || endDate) ? 'text-gray-900' : 'text-gray-500'}
        `}
      >
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-base">{formatDateRange()}</span>
        </div>
        <div className="flex items-center space-x-2">
          {(startDate || endDate) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 bg-white border border-gray-200 rounded-3xl shadow-2xl z-50 overflow-hidden min-w-[420px] backdrop-blur-sm">
          {/* Selection Mode Toggle */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setSelectionMode('single')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectionMode === 'single'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Single Day
                </button>
                <button
                  onClick={() => setSelectionMode('range')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectionMode === 'range'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Date Range
                </button>
              </div>
            </div>
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h4 className="text-xl font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>
              <button
                onClick={() => navigateMonth('next')}
                className="p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-500 py-3">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentMonth).map((date, index) => {
                if (!date) {
                  return <div key={index} className="h-12" />;
                }

                const inRange = isDateInRange(date);
                const isStart = isDateRangeStart(date);
                const isEnd = isDateRangeEnd(date);
                const isCurrentDay = isToday(date);
                const isPast = isPastDate(date);

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => selectionMode === 'range' && setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                    disabled={isPast}
                    className={`
                      h-12 w-12 text-sm font-semibold rounded-2xl transition-all duration-200 relative
                      ${isPast 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
                      }
                      ${isCurrentDay && !inRange ? 'bg-gray-100 ring-2 ring-gray-300' : ''}
                      ${inRange && !isStart && !isEnd ? 'bg-blue-50 text-blue-600' : ''}
                      ${isStart || isEnd ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105' : ''}
                      ${isStart && isEnd && selectionMode === 'single' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}
                    `}
                  >
                    {date.getDate()}
                    {isCurrentDay && !inRange && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={handleClear}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Clear Selection
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-white transition-all duration-200 hover:shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!tempStartDate}
                className="px-6 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};