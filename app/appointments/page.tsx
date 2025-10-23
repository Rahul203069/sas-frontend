//@ts-nocheck

"use client"
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Phone } from "lucide-react";



import StatsCard from "@/components/bot/StatsCard";
import AppointmentCard from "@/components/appointment/AppointmentCard";
import PropertyInfoModal from "@/components/appointment/PropertInfoModal";
import ChatHistoryModal from "@/components/ChatHistoryModal";
import ConfirmCompleteDialog from '@/components/appointment/ConfirmationDialog';
import Sidebarwrapper from "@/components/Sidebarwrapper";
import { getAppointmentsWithStats, updateAppointmentStatus } from "../action";
import LeadSkeleton from "@/components/lead/LeadSkeleton";
import { Fascinate } from "next/font/google";


export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);
  const [render, setrender] = useState(false )

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    getAppointmentsWithStats()
      .then((data) => {
        console.log(data, 'appointment data');
        
        if (data.success && data.data) {
          setStats(data.data.stats);
          setAppointments(data.data.appointments);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e, 'error');
        setError(true);
        setLoading(false);
      });
  }, [render]);

  // Helper function to check if date is today
  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to check if date is tomorrow
  const isTomorrow = (dateString) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(dateString);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };

  const scheduledAppointments = useMemo(() => {
    return appointments.filter(apt => 
      apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED'
    );
  }, [appointments]);

  const completedAppointments = useMemo(() => {
    return appointments.filter(apt => 
      apt.status === 'COMPLETED' || apt.completed === true
    );
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    return scheduledAppointments.filter(apt => isToday(apt.scheduledAt));
  }, [scheduledAppointments]);

  const tomorrowAppointments = useMemo(() => {
    return scheduledAppointments.filter(apt => isTomorrow(apt.scheduledAt));
  }, [scheduledAppointments]);

  const filteredAppointments = useMemo(() => {
    if (activeFilter === "today") return todayAppointments;
    if (activeFilter === "tomorrow") return tomorrowAppointments;
    if (activeFilter === "completed") return completedAppointments;
    return scheduledAppointments;
  }, [activeFilter, todayAppointments, tomorrowAppointments, scheduledAppointments, completedAppointments]);

  const handleShowInfo = (appointment) => {
    setSelectedAppointment(appointment);
    setShowInfoModal(true);
  };

  const handleShowChat = (appointment) => {
    setSelectedAppointment(appointment);
    setShowChatModal(true);
  };

  const handleMarkComplete = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCompleteDialog(true);
  };
const handleConfirmComplete = async () => {
  if (selectedAppointment) {
    setIsProcessing(true);
    
    try {
      const data = await updateAppointmentStatus(
        selectedAppointment.id, 
        'COMPLETED'
      );
      
      if (data.success) {
        console.log(data);
        setrender(!render);
        setShowCompleteDialog(false);  // ✅ Close on success
        setSelectedAppointment(null);
      } else {
        console.error('Failed to update appointment');
        // Optionally show error toast/message
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      // Optionally show error toast/message
    } finally {
      setIsProcessing(false);  // ✅ Always reset processing state
    }
  }
};
  const handleSaveNotes = async (id, notes) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id 
          ? { ...apt, notes } 
          : apt
      )
    );
  };

  if (loading) {
    return (
      <Sidebarwrapper>
        <LeadSkeleton />
      </Sidebarwrapper>
    );
  }

  if (error) {
    return (
      <Sidebarwrapper>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading appointments</h2>
            <p className="text-gray-500">Please try refreshing the page</p>
          </div>
        </div>
      </Sidebarwrapper>
    );
  }

  return (
    <Sidebarwrapper>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Appointments</h1>
            <p className="text-gray-500">Manage your scheduled property consultation calls</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Calls Booked"
                value={stats.totalCallsBooked}
                icon={Calendar}
                iconBg="bg-blue-50"
                iconColor="text-blue-600"
                trend="+12% this week"
              />
              <StatsCard
                title="Total Calls Completed"
                value={stats.totalCallsCompleted}
                icon={Calendar}
                iconBg="bg-green-50"
                iconColor="text-green-600"
              />
              <StatsCard
                title="Calls Today"
                value={stats.totalAppointmentsToday}
                icon={Phone}
                iconBg="bg-orange-50"
                iconColor="text-orange-600"
              />
              <StatsCard
                title="Completed Today"
                value={stats.totalCompletedToday}
                icon={Clock}
                iconBg="bg-purple-50"
                iconColor="text-purple-600"
              />
            </div>
          )}

          {/* Appointments List */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeFilter === "today" && `Today's Appointments (${filteredAppointments.length})`}
                {activeFilter === "tomorrow" && `Tomorrow's Appointments (${filteredAppointments.length})`}
                {activeFilter === "completed" && `Completed Appointments (${filteredAppointments.length})`}
                {activeFilter === "all" && `All Appointments (${filteredAppointments.length})`}
              </h2>
              
              <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full md:w-auto">
                <TabsList className="grid w-full md:w-auto grid-cols-4 bg-gray-100">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white cursor-pointer">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="today" className="data-[state=active]:bg-white cursor-pointer">
                    Today
                  </TabsTrigger>
                  <TabsTrigger value="tomorrow" className="data-[state=active]:bg-white cursor-pointer">
                    Tomorrow
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-white cursor-pointer">
                    Completed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeFilter === "today" && "No appointments today"}
                  {activeFilter === "tomorrow" && "No appointments tomorrow"}
                  {activeFilter === "completed" && "No completed appointments"}
                  {activeFilter === "all" && "No appointments scheduled"}
                </h3>
                <p className="text-gray-500">
                  {activeFilter === "all" 
                    ? "Appointments will appear here once they are booked"
                    : "Try viewing all appointments to see your full schedule"
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onShowInfo={handleShowInfo}
                    onShowChat={handleShowChat}
                    onMarkComplete={handleMarkComplete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <PropertyInfoModal
          appointment={selectedAppointment}
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />

       
       {(selectedAppointment&&showChatModal)&&<ChatHistoryModal
          lead={selectedAppointment.lead}
        
          onClose={() => setShowChatModal(false)}
           />}
        <ConfirmCompleteDialog
        setrender={setrender}
          appointment={selectedAppointment}
          isOpen={showCompleteDialog}
          onClose={() => setShowCompleteDialog(false)}
          onConfirm={handleConfirmComplete}
          isProcessing={isProcessing}
        />
      </div>
    </Sidebarwrapper>
  );
}