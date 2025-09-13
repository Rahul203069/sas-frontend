"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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

export default function AiBotConfigDialog({ config }) {
  const [isBusinessInfoExpanded, setIsBusinessInfoExpanded] = React.useState(false);
  const [isStartingMessageExpanded, setIsStartingMessageExpanded] = React.useState(false);

  const router = useRouter();
  const handleChangeConfig = () => {
    router.push(`/bot/${config.id}&${config.type}`)
  };

  // Calculate dynamic height based on expanded states
  const getDialogHeight = () => {
    let baseHeight = 400; // Base height in pixels
    if (isBusinessInfoExpanded) baseHeight += 200;
    if (isStartingMessageExpanded) baseHeight += 200;
    return Math.min(baseHeight, window.innerHeight * 0.9 - 100); // Cap at 90% of screen minus margins
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
      <DialogContent className="sm:max-w-3xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            <span>{config?.name || 'AI Bot Configuration'}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Bot configuration details and settings overview</span>
            <div className="flex gap-2 ml-2">
              <Badge 
                variant="outline" 
                className={`${
                  config?.islive
                    ? 'border-green-500/50 text-green-700 bg-green-50'
                    : 'border-yellow-500/50 text-yellow-700 bg-yellow-50'
                }`}
              >
                {config?.islive ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                {config?.islive ? 'Live' : 'Draft'}
              </Badge>
              <Badge variant="outline" className="border-indigo-500/50 text-indigo-700 bg-indigo-50">
                {config?.type || 'Unknown Type'}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <ScrollArea 
          className="flex-1 transition-all duration-500 ease-in-out overflow-y-auto"
          style={{ 
            height: `${getDialogHeight()}px`,
            maxHeight: 'calc(90vh - 180px)'
          }}
        >
          <div className="p-6 space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white border rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 bg-blue-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bot Type</p>
                    <p className="font-medium text-gray-900 text-sm">{config?.type || 'Not Set'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-500/30 bg-purple-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Appointments</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {config?.appointmentsetter ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-green-500/30 bg-green-50 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Questions</p>
                    <p className="font-medium text-gray-900 text-sm">{config?.enrichment?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Business Info */}
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 bg-indigo-50 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">Business Information</h3>
                  </div>
                  <div className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div 
                          className="text-gray-700 text-sm leading-relaxed overflow-hidden transition-all duration-500 ease-in-out"
                          style={{
                            maxHeight: isBusinessInfoExpanded ? '300px' : '4rem'
                          }}
                        >
                          {businessInfo}
                        </div>
                        {shouldShowBusinessExpand && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsBusinessInfoExpanded(!isBusinessInfoExpanded)}
                            className="px-2 py-1 h-auto text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 text-xs font-medium flex items-center gap-1 rounded-md transition-all duration-200"
                          >
                            {isBusinessInfoExpanded ? 'Less' : 'More'}
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isBusinessInfoExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Starting Message */}
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full border-2 border-green-500/30 bg-green-50 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">Starting Message</h3>
                  </div>
                  <div className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div 
                          className="text-gray-700 text-sm leading-relaxed italic overflow-hidden transition-all duration-500 ease-in-out"
                          style={{
                            maxHeight: isStartingMessageExpanded ? '300px' : '4rem'
                          }}
                        >
                          "{startingMessage}"
                        </div>
                        {shouldShowMessageExpand && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsStartingMessageExpanded(!isStartingMessageExpanded)}
                            className="px-2 py-1 h-auto text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 text-xs font-medium flex items-center gap-1 rounded-md transition-all duration-200"
                          >
                            {isStartingMessageExpanded ? 'Less' : 'More'}
                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isStartingMessageExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Enrichment Questions */}
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full border-2 border-teal-500/30 bg-teal-50 flex items-center justify-center">
                    <Settings className="w-4 h-4 text-teal-500" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm flex-1">Enrichment Questions</h3>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {config?.enrichment?.length || 0}
                  </Badge>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1 -mr-1">
                  {config?.enrichment?.length > 0 ? (
                    config.enrichment.map((item, index) => (
                      <div key={item.id} className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full border-2 border-teal-500/30 bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-teal-600 text-xs font-bold">{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed flex-1">{item.question}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                      <div className="w-12 h-12 rounded-full border-2 border-gray-200 border-dashed flex items-center justify-center mb-2">
                        <HelpCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">No questions found</p>
                      <p className="text-xs text-gray-500 mt-1">Add questions to qualify leads</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with Action Button */}
        <DialogFooter className="p-6 border-t bg-white">
          <Button
            onClick={handleChangeConfig}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            Change Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}