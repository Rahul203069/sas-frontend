import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, User, CheckCircle, PlayCircle, StopCircle, CalendarPlus, BadgeCheck, MessageSquare, Phone, Loader2 } from "lucide-react";
import { format } from "date-fns";

const logIcons = {
  start: <PlayCircle className="w-5 h-5 text-blue-500" />,
  bot_message: <Bot className="w-5 h-5 text-indigo-500" />,
  lead_reply: <User className="w-5 h-5 text-green-500" />,
  call_booked: <Phone className="w-5 h-5 text-purple-500" />,
  appointment_success: <BadgeCheck className="w-5 h-5 text-teal-500" />,
  chat_stopped: <StopCircle className="w-5 h-5 text-red-500" />,
};

const logColors = {
  start: "border-blue-500/30 bg-blue-50",
  bot_message: "border-indigo-500/30 bg-indigo-50",
  lead_reply: "border-green-500/30 bg-green-50",
  call_booked: "border-purple-500/30 bg-purple-50",
  appointment_success: "border-teal-500/30 bg-teal-50",
  chat_stopped: "border-red-500/30 bg-red-50",
};

const LogItemSkeleton = () => (
  <div className="flex items-start gap-4 mb-6 animate-pulse">
    <Skeleton className="w-10 h-10 rounded-full" />
    <div className="flex-grow pt-1 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-16 w-full rounded-lg" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

const InitialLoader = () => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <div className="text-center space-y-2">
      <p className="text-lg font-medium text-gray-700">Loading conversation logs...</p>
      <p className="text-sm text-gray-500">Fetching bot interaction data</p>
    </div>
  </div>
);

const LogItem = ({ log, isLast }) => (
  <div className="flex items-start gap-4 mb-6 relative">
    {!isLast && (
      <div className={`absolute left-[19px] top-12 h-[calc(100%-1rem)] w-0.5 bg-gray-200`} />
    )}
    <div className={`z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${logColors[log.type]} ${logColors[log.type]?.replace('bg-', 'border-').replace('/30', '/50')}`}>
      {logIcons[log.type] || <Bot className="w-5 h-5 text-gray-500" />}
    </div>
    <div className="flex-grow pt-1">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="font-semibold text-gray-900">{log.title}</h4>
        {log.leadName && (
          <Badge variant="outline" className="text-xs">
            {log.leadName}
          </Badge>
        )}
      </div>
      
      {log.message && (
        <div className="bg-white border rounded-lg p-3 mb-2 shadow-sm">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 text-sm leading-relaxed">{log.message}</p>
          </div>
        </div>
      )}
      
      {log.details && (
        <div className="text-sm text-gray-600 mb-2">
          {log.details}
        </div>
      )}
      
      {log.callDetails && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-2">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-900">Call Scheduled</span>
          </div>
          <p className="text-sm text-purple-700">{log.callDetails}</p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        {format(new Date(log.timestamp), "MMM d, yyyy 'at' h:mm:ss a")}
      </p>
    </div>
  </div>
);

export default function BotLogs({ 
  isOpen, 
  onOpenChange, 
  logs, 
  botName, 
  onLoadMore, 
  hasMore = false,
  isLoading = false,
  isInitialLoading = false 
}) {
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const logsPerPage = 10;

  // Reset when dialog opens/closes or logs change
  useEffect(() => {
    if (isOpen && !isInitialLoading && logs.length > 0) {
      setDisplayedLogs(logs.slice(0, logsPerPage));
      setPage(0);
    }
  }, [isOpen, logs, isInitialLoading]);

  const loadMoreLogs = useCallback(async () => {
    if (isLoadingMore || isInitialLoading) return;

    setIsLoadingMore(true);

    if (onLoadMore) {
      // External load more function with fake delay
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay
      await onLoadMore();
    } else {
      // Internal pagination for static logs with fake delay
      await new Promise(resolve => setTimeout(resolve, 800)); // 0.8s delay
      
      const nextPage = page + 1;
      const startIndex = nextPage * logsPerPage;
      const endIndex = startIndex + logsPerPage;
      const newLogs = logs.slice(startIndex, endIndex);
      
      if (newLogs.length > 0) {
        setDisplayedLogs(prev => [...prev, ...newLogs]);
        setPage(nextPage);
      }
    }

    setIsLoadingMore(false);
  }, [logs, page, isLoadingMore, isInitialLoading, onLoadMore]);

  const handleScroll = useCallback((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const threshold = 100; // Load more when 100px from bottom
    
    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      const canLoadMore = onLoadMore ? hasMore : displayedLogs.length < logs.length;
      if (canLoadMore && !isLoadingMore && !isInitialLoading) {
        loadMoreLogs();
      }
    }
  }, [displayedLogs.length, logs.length, hasMore, isLoadingMore, isInitialLoading, loadMoreLogs, onLoadMore]);

  const canShowMore = onLoadMore ? hasMore : displayedLogs.length < logs.length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 max-h-[90vh]">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            <span>{botName || 'Bot'} Activity Log</span>
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Complete conversation timeline with detailed interactions</span>
            {!isInitialLoading && (
              <Badge variant="outline" className="ml-2">
                {onLoadMore ? `${displayedLogs.length} logs` : `${displayedLogs.length} of ${logs.length}`}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh]" onScrollCapture={handleScroll}>
          <div className="p-6">
            {isInitialLoading ? (
              <InitialLoader />
            ) : (
              <>
                {displayedLogs.map((log, index) => (
                  <LogItem 
                    key={`${log.timestamp}-${index}`} 
                    log={log} 
                    isLast={index === displayedLogs.length - 1 && !canShowMore && !isLoadingMore} 
                  />
                ))}
                
                {isLoadingMore && (
                  <div className="space-y-4">
                    <div className="flex justify-center py-4">
                      <div className="flex items-center gap-3 text-indigo-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Loading more logs...</span>
                      </div>
                    </div>
                    {Array(2).fill(0).map((_, index) => (
                      <LogItemSkeleton key={`skeleton-${index}`} />
                    ))}
                  </div>
                )}
                
                {canShowMore && !isLoadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      Scroll down to load more logs...
                    </div>
                  </div>
                )}
                
                {!canShowMore && displayedLogs.length > 0 && !isLoadingMore && (
                  <div className="flex justify-center py-4">
                    <Badge variant="outline" className="text-gray-500 bg-gray-50">
                      🎉 End of conversation log
                    </Badge>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}