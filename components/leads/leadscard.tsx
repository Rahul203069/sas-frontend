import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Mail, Phone, MessageSquare, Calendar, Thermometer } from "lucide-react";
import { format } from "date-fns";

const temperatureColors = {
  hot: "bg-red-100 text-red-800 border-red-200",
  warm: "bg-amber-100 text-amber-800 border-amber-200",
  cold: "bg-slate-100 text-slate-800 border-slate-200"
};

const temperatureIcons = {
  hot: "🔥",
  warm: "🌡️", 
  cold: "❄️"
};

export default function LeadCard({ lead, onViewDetails, onStartConversation }) {
  const lastMessage = lead.conversation_history?.slice(-1)[0];
  
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">{lead.name}</h3>
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <Building className="w-4 h-4" />
              <span className="font-medium">{lead.company}</span>
            </div>
            {lead.job_title && (
              <p className="text-slate-500 text-sm">{lead.job_title}</p>
            )}
          </div>
          <Badge className={`${temperatureColors[lead.temperature]} border font-semibold`}>
            {temperatureIcons[lead.temperature]} {lead.temperature}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Mail className="w-4 h-4" />
            <span>{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Phone className="w-4 h-4" />
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        {lead.ai_summary && (
          <div className="bg-indigo-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-700 line-clamp-3">{lead.ai_summary}</p>
          </div>
        )}

        {lastMessage && (
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-3 h-3 text-slate-500" />
              <span className="text-xs font-medium text-slate-500">Last conversation</span>
            </div>
            <p className="text-sm text-slate-700 line-clamp-2">{lastMessage.message}</p>
            <p className="text-xs text-slate-500 mt-1">
              {format(new Date(lastMessage.timestamp), 'MMM d, h:mm a')}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Calendar className="w-3 h-3" />
          <span>Added {format(new Date(lead.created_date), 'MMM d, yyyy')}</span>
          {lead.last_contact && (
            <>
              <span>•</span>
              <span>Last contact {format(new Date(lead.last_contact), 'MMM d')}</span>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 hover:bg-slate-50"
            onClick={() => onViewDetails(lead)}
          >
            View Details
          </Button>
          <Button 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => onStartConversation(lead)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}