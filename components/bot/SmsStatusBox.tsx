import React from "react";
import { RefreshCw, Send, CheckCircle, XCircle, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SmsStatusBox({
  totalMessages = 1250,
  messagesSent = 980,
  messagesFailed = 45,
  onRefresh,
  isRefreshing = false,
}) {
  const isComplete = totalMessages > 0 && messagesSent + messagesFailed >= totalMessages;
  const sentPercentage = totalMessages > 0 ? (messagesSent / totalMessages) * 100 : 0;
  const failedPercentage = totalMessages > 0 ? (messagesFailed / totalMessages) * 100 : 0;
  const successRate = totalMessages > 0 ? ((messagesSent / totalMessages) * 100).toFixed(1) : 0;
  const remaining = totalMessages - messagesSent - messagesFailed;

  return (
    <TooltipProvider>
      <div className="relative bg-white p-6 rounded-xl border border-slate-200/60 shadow-xl shadow-slate-200/40 backdrop-blur-md w-full">
        {/* 🔁 Refresh Button (Top-right Corner) */}
        {onRefresh && (
          <div className="absolute top-4 right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/60 h-9 w-9 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 text-white border-slate-700 rounded-xl">
                <p>Refresh Statistics</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Header */}
        <div className="flex min-w-80 justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl shadow-sm">
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-800 text-lg tracking-tight">SMS Campaign</h3>

            {isComplete ? (
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md shadow-emerald-200/50 px-3 py-1.5 rounded-full">
                ✓ Complete
              </Badge>
            ) : (
              <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200/50 shadow-sm shadow-amber-100/50 px-3 py-1.5 rounded-full">
                ⏳ In Progress
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full bg-slate-100/70 rounded-full h-2.5 mb-6 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 h-2.5 rounded-full shadow-sm relative overflow-hidden"
            style={{ width: `${sentPercentage}%` }}
          />
          <div
            className="bg-gradient-to-r from-rose-400 to-red-400 h-2.5 absolute top-0 rounded-full shadow-sm"
            style={{ left: `${sentPercentage}%`, width: `${failedPercentage}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-5">
          {/* Total Messages */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200/80 rounded-xl shadow-sm">
                <Send className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-600 tracking-wide">Total</span>
            </div>
            <div className="font-bold text-xl text-slate-800 mb-1">
              {totalMessages.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500/80 font-medium">messages queued</div>
          </div>

          {/* Messages Sent */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100/80 rounded-xl shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-700 tracking-wide">Sent</span>
            </div>
            <div className="font-bold text-xl text-emerald-700 mb-1">
              {messagesSent.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600/80 font-medium">
              {sentPercentage.toFixed(1)}% delivered
            </div>
          </div>

          {/* Failed Messages */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-rose-100 to-red-100/80 rounded-xl shadow-sm">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <span className="text-sm font-medium text-rose-700 tracking-wide">Failed</span>
            </div>
            <div className="font-bold text-xl text-rose-700 mb-1">
              {messagesFailed.toLocaleString()}
            </div>
            <div className="text-xs text-rose-600/80 font-medium">
              {failedPercentage.toFixed(1)}% errors
            </div>
          </div>

          {/* Success Rate */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100/80 rounded-xl shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-700 tracking-wide">Success</span>
            </div>
            <div className="font-bold text-xl text-blue-700 mb-1">{successRate}%</div>
            <div className="text-xs text-blue-600/80 font-medium">delivery rate</div>
          </div>
        </div>

        {/* Remaining Messages */}
        {!isComplete && remaining > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200/50">
            <div className="text-center text-sm text-slate-600/80">
              <span className="font-semibold text-slate-700">{remaining.toLocaleString()}</span>{" "}
              messages remaining in queue
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
