import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, Phone, Mail, MapPin, Building2, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const statusConfig = {
  hot: { color: "bg-red-50 text-red-700 border-red-200", label: "Hot", icon: "🔥" },
  warm: { color: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Warm", icon: "⚡" },
  cold: { color: "bg-blue-50 text-blue-600 border-blue-200", label: "Cold", icon: "❄️" }
};

export default function InfoDialog({ isOpen, onClose, lead }) {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-600" />
            Lead Information
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {lead.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{lead.name}</h3>
              {lead.company && (
                <p className="text-gray-600 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {lead.company}
                </p>
              )}
              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  className={`font-medium border ${statusConfig[lead.status]?.color}`}
                >
                  <span className="mr-1">{statusConfig[lead.status]?.icon}</span>
                  {statusConfig[lead.status]?.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Contact Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
                {lead.address && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span>{lead.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Last Contacted</div>
                    <div className="font-medium">
                      {lead.last_contacted 
                        ? format(new Date(lead.last_contacted), 'MMM d, yyyy h:mm a')
                        : 'Not contacted yet'
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Added</div>
                    {lead.created_date&&  
                    <div className="font-medium">
                      {format(new Date(lead.created_date), 'MMM d, yyyy')}
                    </div>
                    
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {(lead.source || lead.notes) && (
            <div className="space-y-4 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Additional Information</h4>
              {lead.source && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Source</div>
                  <div className="text-gray-700">{lead.source}</div>
                </div>
              )}
              {lead.notes && (
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Notes
                  </div>
                  <div className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                    {lead.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}