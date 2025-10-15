import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles, Info, Phone, Mail, MapPin } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  HOT: {
    color: "bg-red-100 text-red-700 border-red-200",
    label: "Hot",
    icon: "🔥"
  },
  WARM: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    label: "Warm",
    icon: "⚡"
  },
  JUNK: {
    color: "bg-blue-50 text-blue-600 border-blue-200",
    label: "Junk",
    icon: "❄️"
  },
  COLD: {
    color: "bg-blue-50 text-blue-600 border-blue-200",
    label: "Junk",
    icon: "❄️"
  }
};

export default function LeadsTable({ 
  leads, 
  onViewChat, 
  onViewAISummary, 
  onViewInfo 
}) {
  console.log(leads, "from LeadsTable");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Lead</TableHead>
              <TableHead className="font-semibold text-gray-700">Contact Info</TableHead>
              <TableHead className="font-semibold text-gray-700">Address</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              // Extract first phone and email from arrays
              const primaryPhone = Array.isArray(lead.phone) ? lead.phone[0] : lead.phone;
              const primaryEmail = Array.isArray(lead.email) ? lead.email[0] : lead.email;
              
              return (
                <TableRow 
                  key={lead.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {lead.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{lead.name}</div>
                        {lead.bot?.name && (
                          <div className="text-sm text-gray-500">{lead.bot.name}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {primaryPhone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{primaryPhone}</span>
                        </div>
                      )}
                      {primaryEmail && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[200px]">{primaryEmail}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 text-sm text-gray-600 max-w-[200px]">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{lead.address || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`font-medium border ${statusConfig[lead.status]?.color || statusConfig.JUNK.color}`}
                    >
                      <span className="mr-1">{statusConfig[lead.status]?.icon}</span>
                      {statusConfig[lead.status]?.label || 'Junk'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {lead.updatedAt ? (
                        <>
                          <div className="font-medium text-gray-900">
                            {format(new Date(lead.updatedAt), 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(lead.updatedAt), 'h:mm a')}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">No updates</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewChat(lead)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                      <Button
                      
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewAISummary(lead)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                          Chat Analysis
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewInfo(lead)}

                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"

                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}