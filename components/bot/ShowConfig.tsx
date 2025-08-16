"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter, // Import DialogFooter for semantics
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Settings,
  User,
  Eye,
  ExternalLink,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  HelpCircle,
  Building2,
  ChevronDown,
} from "lucide-react";

import { useRouter } from "next/navigation";

// The 'useNavigate' import was not used, so it can be removed for cleaner code.
// import { useNavigate } from "react-router-dom";

export default function AiBotConfigDialog({ config }) {
  const [isBusinessInfoExpanded, setIsBusinessInfoExpanded] = React.useState(false);
  const [isStartingMessageExpanded, setIsStartingMessageExpanded] = React.useState(false);

  const router= useRouter();
  const handleChangeConfig = () => {
    // Navigation or state update logic would go here
    
    router.push(`/bot/${config.id}&${config.type}`)
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const businessInfo = config?.bussinessinfo || 'No business information provided';
  const startingMessage = config?.startingmessage || 'No starting message configured';

  const shouldShowBusinessExpand = businessInfo.length > 150;
  const shouldShowMessageExpand = startingMessage.length > 150;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 hover:bg-gray-50 transition-colors">
          <Eye className="w-4 h-4" />
          View Config
        </Button>
      </DialogTrigger>
      {/* Set a max-width for the dialog and use a grid layout to separate header, content, and footer */}
      <DialogContent className="sm:max-w-4xl p-0 grid grid-rows-[auto_1fr_auto] max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="  p-6 border-b bg-gradient-to-r from-indigo-50 to-blue-50  rounded-t-lg">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-blue-300 rounded-lg backdrop-blur-sm">
              <Bot className="w-6 h-6" />
            </div>
            {config?.name || 'AI Bot Configuration'}
          </DialogTitle>
          {/* Status Pills */}
          <div className="flex gap-2 pt-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                config?.islive
                  ? 'bg-green-500 text-green-100 border border-green-400/30'
                  : 'bg-yellow-500 text-yellow-100 border border-yellow-400/30'
              }`}
            >
              {config?.islive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {config?.islive ? 'Live' : 'Draft'}
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-400 text-white border border-white/30">
              {config?.type || 'Unknown Type'}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="p-5 space-y-8 overflow-y-auto bg-gray-50/50">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Bot Type</p>
                  <p className="font-semibold text-gray-900 text-lg">{config?.type || 'Not Set'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Appointments</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {config?.appointmentsetter ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Questions</p>
                  <p className="font-semibold text-gray-900 text-lg">{config?.enrichment?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Business Info */}
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-lg text-gray-900">Business Information</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {isBusinessInfoExpanded ? businessInfo : truncateText(businessInfo)}
                  </p>
                  {shouldShowBusinessExpand && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBusinessInfoExpanded(!isBusinessInfoExpanded)}
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent text-sm font-semibold flex items-center gap-1"
                    >
                      {isBusinessInfoExpanded ? 'Show Less' : 'Show More'}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isBusinessInfoExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Starting Message */}
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-lg text-gray-900">Starting Message</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed italic bg-gray-50 p-4 rounded-md border">
                    "{isStartingMessageExpanded ? startingMessage : truncateText(startingMessage)}"
                  </p>
                  {shouldShowMessageExpand && (
                     <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsStartingMessageExpanded(!isStartingMessageExpanded)}
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent text-sm font-semibold flex items-center gap-1"
                    >
                      {isStartingMessageExpanded ? 'Show Less' : 'Show More'}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isStartingMessageExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Enrichment Questions */}
            <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-lg text-gray-900">Enrichment Questions</h3>
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  {config?.enrichment?.length || 0} questions
                </Badge>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-2 -mr-2">
                {config?.enrichment?.length > 0 ? (
                  config.enrichment.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-3 p-4 bg-gray-50/80 rounded-lg border">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-800 flex-1">{item.question}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8 text-gray-500 rounded-lg bg-gray-50 border-2 border-dashed">
                    <HelpCircle className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium">No enrichment questions found.</p>
                    <p className="text-xs text-gray-400 mt-1">Add questions to help the bot qualify leads.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action Button */}
        <DialogFooter className="p-4 border-t bg-white rounded-b-lg">
          <Button
            onClick={handleChangeConfig}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            Change Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}