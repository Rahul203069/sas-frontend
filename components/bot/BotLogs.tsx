
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
import { Bot, User, CheckCircle, PlayCircle, StopCircle, CalendarPlus, BadgeCheck, MessageSquare, Phone, Loader2, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const logIcons = {
  start: <PlayCircle className="w-5 h-5" />,
  bot_message: <Bot className="w-5 h-5" />,
  lead_reply: <User className="w-5 h-5" />,
  call_booked: <Phone className="w-5 h-5" />,
  appointment_success: <BadgeCheck className="w-5 h-5" />,
  chat_stopped: <StopCircle className="w-5 h-5" />,
};

const logStyles = {
  start: {
    icon: "text-emerald-600",
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    border: "border-emerald-200/60",
    glow: "shadow-emerald-100/50"
  },
  bot_message: {
    icon: "text-violet-600",
    bg: "bg-gradient-to-br from-violet-50 to-purple-50",
    border: "border-violet-200/60",
    glow: "shadow-violet-100/50"
  },
  lead_reply: {
    icon: "text-blue-600",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    border: "border-blue-200/60",
    glow: "shadow-blue-100/50"
  },
  call_booked: {
    icon: "text-amber-600",
    bg: "bg-gradient-to-br from-amber-50 to-orange-50",
    border: "border-amber-200/60",
    glow: "shadow-amber-100/50"
  },
  appointment_success: {
    icon: "text-teal-600",
    bg: "bg-gradient-to-br from-teal-50 to-cyan-50",
    border: "border-teal-200/60",
    glow: "shadow-teal-100/50"
  },
  chat_stopped: {
    icon: "text-rose-600",
    bg: "bg-gradient-to-br from-rose-50 to-pink-50",
    border: "border-rose-200/60",
    glow: "shadow-rose-100/50"
  },
};

const LogItemSkeleton = () => (
  <motion.div 
    
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    
    className="flex items-start gap-6 mb-8"
  >
    <div className="relative">
      <Skeleton className="w-12 h-12 rounded-2xl" />
    </div>
    <div className="flex-grow pt-1 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-4 w-32" />
    </div>
  </motion.div>
);

const InitialLoader = () => (
  <motion.div 
    
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    
    className="flex flex-col items-center justify-center py-16 space-y-6"
  >
    <div className="relative">
      <div className="w-20 h-20 border-4 border-gray-100 rounded-full"></div>
      <div className="absolute top-0 left-0 w-20 h-20 border-4 border-violet-500 rounded-full animate-spin border-t-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Bot className="w-8 h-8 text-violet-600" />
      </div>
    </div>
    <div className="text-center space-y-3">
      <h3 className="text-xl font-semibold text-gray-800">Loading conversation timeline</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
        Gathering all bot interactions and conversation data for detailed analysis
      </p>
    </div>
  </motion.div>
);

const LogItem = ({ log, isLast, index }) => {
  const style = logStyles[log.type] || logStyles.bot_message;
  
  return (
    <motion.div 
      
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      
      className="flex items-start gap-6 mb-8 group relative"
    >
      {!isLast && (
        <div className="absolute left-[23px] top-14 h-[calc(100%-2rem)] w-0.5 bg-gradient-to-b from-gray-200 via-gray-100 to-transparent" />
      )}
      
      <motion.div 
        className={`z-10 flex-shrink-0 w-12 h-12 rounded-2xl border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${style.bg} ${style.border} ${style.glow} shadow-lg`}
        whileHover={{ scale: 1.1 }}
      >
        <span className={style.icon}>
          {logIcons[log.type] || <Bot className="w-5 h-5" />}
        </span>
      </motion.div>
      
      <div className="flex-grow pt-1 space-y-4">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-gray-900 text-lg">{log.title}</h4>
          {log.leadName && (
            <Badge 
              variant="secondary" 
              className="text-xs font-medium px-3 py-1 bg-gray-100/80 text-gray-700 border border-gray-200/50 rounded-full"
            >
              {log.leadName}
            </Badge>
          )}
        </div>
        
        {log.message && (
          <motion.div 
            
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-gray-500" />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">{log.message}</p>
            </div>
          </motion.div>
        )}
        
        {log.details && (
          <div className="text-sm text-gray-600 font-medium pl-2 border-l-2 border-gray-200">
            {log.details}
          </div>
        )}
        
        {log.callDetails && (
          <motion.div 
            
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                <Phone className="w-4 h-4 text-amber-600" />
              </div>
              <span className="font-semibold text-amber-900">Call Scheduled</span>
            </div>
            <p className="text-sm text-amber-800 font-medium pl-11">{log.callDetails}</p>
          </motion.div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
          <Clock className="w-3 h-3" />
          <time className="font-medium">
            {format(new Date(log.timestamp), "MMM d, yyyy 'at' h:mm:ss a")}
          </time>
        </div>
      </div>
    </motion.div>
  );
};

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      await onLoadMore();
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
      
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
    const threshold = 100;
    
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
      <DialogContent className="sm:max-w-4xl p-0 max-h-[90vh] border-0 shadow-2xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
        <DialogHeader className="p-8 border-b border-gray-100/50 bg-gradient-to-r from-violet-50/50 via-purple-50/30 to-blue-50/50 backdrop-blur-sm">
          <DialogTitle className="text-3xl font-bold flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900">{botName || 'Bot'} Activity Timeline</span>
              <span className="text-sm font-normal text-gray-500 mt-1">Complete conversation history</span>
            </div>
          </DialogTitle>
          {!isInitialLoading && (
            <div className="flex items-center gap-4 mt-4">
              <Badge 
                variant="outline" 
                className="bg-white/60 border-violet-200/50 text-violet-700 font-semibold px-4 py-2 rounded-full"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                {onLoadMore ? `${displayedLogs.length} interactions` : `${displayedLogs.length} of ${logs.length} logs`}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Live tracking enabled
              </div>
            </div>
          )}
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] bg-gradient-to-b from-gray-50/30 to-white" onScrollCapture={handleScroll}>
          <div className="p-8">
            {isInitialLoading ? (
              <InitialLoader />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  
                >
                  {displayedLogs.map((log, index) => (
                    <LogItem 
                      key={`${log.timestamp}-${index}`} 
                      log={log} 
                      isLast={index === displayedLogs.length - 1 && !canShowMore && !isLoadingMore}
                      index={index}
                    />
                  ))}
                  
                  {isLoadingMore && (
                    <motion.div 
                      
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      
                      className="space-y-6"
                    >
                      <div className="flex justify-center py-6">
                        <div className="flex items-center gap-3 text-violet-600 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-violet-200/50 shadow-sm">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">Loading more interactions...</span>
                        </div>
                      </div>
                      {Array(2).fill(0).map((_, index) => (
                        <LogItemSkeleton key={`skeleton-${index}`} />
                      ))}
                    </motion.div>
                  )}
                  
                  {canShowMore && !isLoadingMore && (
                    <motion.div 
                      
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      
                      className="flex justify-center py-6"
                    >
                      <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200/50">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        Scroll to load more conversations
                      </div>
                    </motion.div>
                  )}
                  
                  {!canShowMore && displayedLogs.length > 0 && !isLoadingMore && (
                    <motion.div 
                      
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      
                      className="flex justify-center py-8"
                    >
                      <div className="flex items-center gap-3 text-gray-500 bg-gradient-to-r from-gray-50 to-white px-6 py-4 rounded-2xl border border-gray-200/50 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-700">Timeline complete</p>
                          <p className="text-xs text-gray-500 mt-1">All interactions loaded successfully</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
