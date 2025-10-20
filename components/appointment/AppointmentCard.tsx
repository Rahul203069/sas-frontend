import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, Mail, MessageSquare, Info, MapPin, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function AppointmentCard({ appointment, onShowInfo, onShowChat, onMarkComplete }) {
  const statusColors = {
    PENDING: "bg-blue-50 text-blue-700 border-blue-200",
    CONFIRMED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  };

  // Format date and time from scheduledAt
  const scheduledDate = new Date(appointment.scheduledAt);
  const formattedDate = format(scheduledDate, 'MMM dd, yyyy');
  const formattedTime = format(scheduledDate, 'hh:mm a');

  // Get lead data
  const leadName = appointment.lead?.name || 'Unknown Client';
  const leadEmail = appointment.lead?.email?.[0] || 'No email';
  const leadPhone = appointment.lead?.phone?.[0] || 'No phone';
  const leadAddress = appointment.lead?.address || 'No address provided';

  return (
    <Card className="bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{leadName}</h3>
              <Badge className={`${statusColors[appointment.status]} border font-medium`}>
                {appointment.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{leadAddress}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowChat(appointment)}
              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-1.5" />
              Chat History
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowInfo(appointment)}
              className="hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all"
            >
              <Info className="w-4 h-4 mr-1.5" />
              Property Info
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <p className="text-sm font-semibold text-gray-900">{formattedTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium text-gray-900">{appointment.duration} min</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Phone className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-medium text-gray-900">Call</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Phone Number</p>
              <a 
                href={`tel:${leadPhone}`} 
                className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {leadPhone}
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Email</p>
              <a 
                href={`mailto:${leadEmail}`} 
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors block truncate"
              >
                {leadEmail}
              </a>
            </div>
          </div>
        </div>

        {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && !appointment.completed && (
          <div className="mt-4 pt-4 flex justify-end border-t border-gray-100">
            <Button
              onClick={() => onMarkComplete(appointment)}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Completed
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}