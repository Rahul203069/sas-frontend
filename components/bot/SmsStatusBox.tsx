import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Send, CheckCircle, XCircle, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SmsStatusBox({ 
  totalMessages = 1250, 
  messagesSent = 980, 
  messagesFailed = 45,
  onRefresh,
  isRefreshing = false 
}) {
  const isComplete = totalMessages > 0 && messagesSent + messagesFailed >= totalMessages;
  const sentPercentage = totalMessages > 0 ? (messagesSent / totalMessages) * 100 : 0;
  const failedPercentage = totalMessages > 0 ? (messagesFailed / totalMessages) * 100 : 0;
  const successRate = totalMessages > 0 ? ((messagesSent / totalMessages) * 100).toFixed(1) : 0;
  const remaining = totalMessages - messagesSent - messagesFailed;

  return (
    <TooltipProvider>
      <motion.div
        className="bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30 p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 backdrop-blur-md w-full"
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)" }}
      >
        {/* Header Row */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2.5 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl shadow-sm"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Activity className="w-4 h-4 text-indigo-600" />
              </motion.div>
              <h3 className="font-semibold text-slate-800 text-lg tracking-tight">SMS Campaign</h3>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isComplete ? (
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md shadow-emerald-200/50 px-3 py-1.5 rounded-full">
                  ✓ Complete
                </Badge>
              ) : (
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200/50 shadow-sm shadow-amber-100/50 px-3 py-1.5 rounded-full">
                  ⏳ In Progress
                </Badge>
              )}
            </motion.div>
          </div>
          {onRefresh && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/60 h-10 w-10 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''} transition-transform duration-300`} />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 text-white border-slate-700 rounded-xl">
                <p>Refresh Statistics</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Soft Progress Bar */}
        <div className="relative w-full bg-slate-100/70 rounded-full h-2.5 mb-6 overflow-hidden shadow-inner">
          <motion.div
            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 h-2.5 rounded-full shadow-sm relative overflow-hidden"
            initial={{ width: '0%' }}
            animate={{ width: `${sentPercentage}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Soft glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </motion.div>
          <motion.div
            className="bg-gradient-to-r from-rose-400 to-red-400 h-2.5 absolute top-0 rounded-full shadow-sm"
            style={{ left: `${sentPercentage}%` }}
            initial={{ width: '0%' }}
            animate={{ width: `${failedPercentage}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          />
        </div>

        {/* Gentle Stats Grid */}
        <div className="grid grid-cols-4 gap-5">
          {/* Total Messages */}
          <motion.div 
            className="text-center group cursor-default"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200/80 rounded-xl group-hover:from-slate-200 group-hover:to-slate-300/80 transition-all duration-300 shadow-sm">
                <Send className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-600 tracking-wide">Total</span>
            </div>
            <div className="font-bold text-xl text-slate-800 mb-1">{totalMessages.toLocaleString()}</div>
            <div className="text-xs text-slate-500/80 font-medium">messages queued</div>
          </motion.div>

          {/* Messages Sent */}
          <motion.div 
            className="text-center group cursor-default"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100/80 rounded-xl group-hover:from-emerald-200 group-hover:to-teal-200/80 transition-all duration-300 shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-700 tracking-wide">Sent</span>
            </div>
            <div className="font-bold text-xl text-emerald-700 mb-1">{messagesSent.toLocaleString()}</div>
            <div className="text-xs text-emerald-600/80 font-medium">{sentPercentage.toFixed(1)}% delivered</div>
          </motion.div>

          {/* Failed Messages */}
          <motion.div 
            className="text-center group cursor-default"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-rose-100 to-red-100/80 rounded-xl group-hover:from-rose-200 group-hover:to-red-200/80 transition-all duration-300 shadow-sm">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <span className="text-sm font-medium text-rose-700 tracking-wide">Failed</span>
            </div>
            <div className="font-bold text-xl text-rose-700 mb-1">{messagesFailed.toLocaleString()}</div>
            <div className="text-xs text-rose-600/80 font-medium">{failedPercentage.toFixed(1)}% errors</div>
          </motion.div>

          {/* Success Rate */}
          <motion.div 
            className="text-center group cursor-default"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100/80 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200/80 transition-all duration-300 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-700 tracking-wide">Success</span>
            </div>
            <div className="font-bold text-xl text-blue-700 mb-1">{successRate}%</div>
            <div className="text-xs text-blue-600/80 font-medium">delivery rate</div>
          </motion.div>
        </div>

        {/* Soft Remaining Messages */}
        {!isComplete && remaining > 0 && (
          <motion.div 
            className="mt-5 pt-4 border-t border-slate-200/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center text-sm text-slate-600/80">
              <span className="font-semibold text-slate-700">{remaining.toLocaleString()}</span> messages remaining in queue
            </div>
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}