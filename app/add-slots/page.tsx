//@ts-nocheck
"use client"
import React, { useState } from 'react';
import { Clock, Calendar, Trash2, Plus, ChevronRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebarwrapper from '@/components/Sidebarwrapper';
import { addAvailableSlots } from '../action';
import { useRouter } from 'next/navigation';
import { error } from 'console';
import { toast } from 'sonner';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot[];
  synced: boolean;
}

type WeeklySchedule = {
  [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']: DaySchedule;
};

function App() {
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    monday: { enabled: true, timeSlots: [], synced: false },
    tuesday: { enabled: true, timeSlots: [], synced: true },
    wednesday: { enabled: true, timeSlots: [], synced: true },
    thursday: { enabled: true, timeSlots: [], synced: true },
    friday: { enabled: true, timeSlots: [], synced: true },
    saturday: { enabled: false, timeSlots: [], synced: false },
    sunday: { enabled: false, timeSlots: [], synced: false },
  });

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const syncWithMonday = (currentSchedule: WeeklySchedule) => {
    const mondaySlots = currentSchedule.monday.timeSlots;
    const newSchedule = { ...currentSchedule };
    
    ['tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
      if (newSchedule[day as keyof WeeklySchedule].synced) {
        newSchedule[day as keyof WeeklySchedule].timeSlots = [...mondaySlots];
      }
    });
    
    return newSchedule;
  };

  const handleDayToggle = (day: keyof WeeklySchedule) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          enabled: !prev[day].enabled,
          timeSlots: !prev[day].enabled && prev[day].timeSlots.length === 0 
            ? [{ start: '09:00', end: '17:00' }] 
            : prev[day].timeSlots
        }
      };

      if (day === 'monday') {
        return syncWithMonday(newSchedule);
      }
      return newSchedule;
    });
  };

  const addTimeSlot = (day: keyof WeeklySchedule) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: [...prev[day].timeSlots, { start: '09:00', end: '17:00' }]
        }
      };

      if (day === 'monday') {
        return syncWithMonday(newSchedule);
      }
      return newSchedule;
    });
  };

  const updateTimeSlot = (day: keyof WeeklySchedule, index: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: prev[day].timeSlots.map((slot, i) => 
            i === index ? { ...slot, [field]: value } : slot
          )
        }
      };

      if (day === 'monday') {
        return syncWithMonday(newSchedule);
      }
      return newSchedule;
    });
  };

  const removeTimeSlot = (day: keyof WeeklySchedule, index: number) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: prev[day].timeSlots.filter((_, i) => i !== index)
        }
      };

      if (day === 'monday') {
        return syncWithMonday(newSchedule);
      }
      return newSchedule;
    });
  };
const router= useRouter();
  const toggleSync = (day: keyof WeeklySchedule) => {
    setSchedule(prev => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          synced: !prev[day].synced,
          timeSlots: !prev[day].synced ? [...prev.monday.timeSlots] : prev[day].timeSlots
        }
      };
      return newSchedule;
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

const response = await addAvailableSlots(schedule)
if(response.success){
  router.push('/appointments');
}
if(response.error){
toast(response.error);
}

    console.log('Weekly Schedule:', schedule);
    // Here you would typically send this data to your backend
  };

  return (
    <Sidebarwrapper>

    <div className="min-h-screen bg-gray-50">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-10"
      >
        
      </motion.header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          >
          <h2 className="text-3xl font-bold text-gray-900">Availability Preferences</h2>
          <p className="mt-2 text-lg text-gray-600">Define your weekly schedule when you're available for meetings.</p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          >
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {(Object.keys(schedule) as Array<keyof WeeklySchedule>).map((day, index) => (
                  <motion.div 
                  key={day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`border rounded-xl transition-all duration-200 ${
                      schedule[day].enabled 
                      ? 'border-gray-200 bg-white hover:border-blue-200' 
                        : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                      }`}
                      >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="flex items-center h-5"
                            whileTap={{ scale: 0.9 }}
                          >
                            <input
                              type="checkbox"
                              id={`enable-${day}`}
                              checked={schedule[day].enabled}
                              onChange={() => handleDayToggle(day)}
                              className="h-5 w-5 text-blue-600 border-gray-300 rounded-md cursor-pointer focus:ring-blue-500 focus:ring-offset-0"
                              />
                          </motion.div>
                          <div className="flex items-center space-x-3">
                            <label htmlFor={`enable-${day}`} className="text-lg font-medium text-gray-900 cursor-pointer">
                              {formatDay(day)}
                            </label>
                            {day !== 'monday' && day !== 'saturday' && day !== 'sunday' && (
                              <motion.button
                                type="button"
                                onClick={() => toggleSync(day)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                                  schedule[day].synced 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-gray-100 text-gray-600'
                                }`}
                                >
                               
                              </motion.button>
                            )}
                            <AnimatePresence>
                              {schedule[day].enabled && schedule[day].timeSlots.length > 0 && (
                                <motion.span 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
                                >
                                  {schedule[day].timeSlots.length} slot{schedule[day].timeSlots.length !== 1 ? 's' : ''}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        {schedule[day].enabled && (
                          <motion.button
                          type="button"
                          onClick={() => addTimeSlot(day)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-1.5" />
                            Add Time Slot
                          </motion.button>
                        )}
                      </div>

                      <AnimatePresence>
                        {schedule[day].enabled && (
                          <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 space-y-3"
                          >
                            {schedule[day].timeSlots.map((slot, index) => (
                              <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg group"
                              >
                                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <div className="flex items-center space-x-3 flex-grow">
                                  <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                                    className="block w-36 rounded-lg p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                  />
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                  <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                                    className="block w-36 rounded-lg p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <motion.button
                                  type="button"
                                  onClick={() => removeTimeSlot(day, index)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 rounded"
                                  >
                                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                                </motion.button>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="pt-6 border-t border-gray-200 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                >
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex justify-center items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                  >
                  Save Changes
                </motion.button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
                  </Sidebarwrapper>
  );
}

export default App;
