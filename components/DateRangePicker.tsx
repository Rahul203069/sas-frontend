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
    if (startDate && !endDate) return `From ${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    if (!startDate && endDate) return `Until ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
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
  };

  const isDateInRange = (date: Date) => {
    if (!tempStartDate) return false;
    if (!tempEndDate && !hoverDate) return isSameDay(date, tempStartDate);
    
    const endDate = tempEndDate || hoverDate;
    if (!endDate) return isSameDay(date, tempStartDate);
    
    return date >= tempStartDate && date <= endDate;
  };

  const isDateRangeStart = (date: Date) => {
    return tempStartDate && isSameDay(date, tempStartDate);
  };

  const isDateRangeEnd = (date: Date) => {
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
    if (tempStartDate && tempEndDate) {
      onChange(
        tempStartDate.toISOString().split('T')[0],
        tempEndDate.toISOString().split('T')[0]
      );
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
          flex items-center justify-between w-full min-w-[280px] px-4 py-3 
          bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200 text-sm group
          ${(startDate || endDate) ? 'text-gray-900' : 'text-gray-500'}
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
            <Calendar className="w-4 h-4 text-gray-600" />
          </div>
          <span className="font-medium">{formatDateRange()}</span>
        </div>
        <div className="flex items-center space-x-2">
          {(startDate || endDate) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[320px]">
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <h3 className="text-sm font-semibold text-gray-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) => {
                if (!date) {
                  return <div key={index} className="h-9" />;
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
                    onMouseEnter={() => setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                    disabled={isPast}
                    className={`
                      h-9 w-9 text-sm font-medium rounded-lg transition-all duration-150 relative
                      ${isPast 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }
                      ${isCurrentDay && !inRange ? 'bg-gray-100 font-semibold' : ''}
                      ${inRange && !isStart && !isEnd ? 'bg-blue-50 text-blue-600' : ''}
                      ${isStart || isEnd ? 'bg-blue-600 text-white font-semibold shadow-sm' : ''}
                      ${isStart && isEnd ? 'bg-blue-600' : ''}
                    `}
                  >
                    {date.getDate()}
                    {isCurrentDay && (
                      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!tempStartDate || !tempEndDate}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
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