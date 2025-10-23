import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function SmsStatusBox({
  totalMessages = 1250,
  messagesSent = 980,
  messagesFailed = 45,

  pastCampaigns = [
    {
      id: 1,
      name: "Holiday Sale 2024",
      date: "2024-12-15",
      total: 2500,
      sent: 2450,
      failed: 50,
    },
    {
      id: 2,
      name: "New Year Promo",
      date: "2024-12-31",
      total: 1800,
      sent: 1750,
      failed: 50,
    },
    {
      id: 3,
      name: "Flash Sale Alert",
      date: "2025-01-10",
      total: 3200,
      sent: 3100,
      failed: 100,
    },
    {
      id: 4,
      name: "Product Launch",
      date: "2025-01-25",
      total: 1500,
      sent: 1480,
      failed: 20,
    },
    {
      id: 5,
      name: "Weekly Newsletter",
      date: "2025-02-01",
      total: 2200,
      sent: 2150,
      failed: 50,
    },
  ],
}) {



  const [refreshing, setrefreshing] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);





  const isComplete =
    totalMessages > 0 && messagesSent + messagesFailed >= totalMessages;
  const sentPercentage =
    totalMessages > 0 ? (messagesSent / totalMessages) * 100 : 0;
  const failedPercentage =
    totalMessages > 0 ? (messagesFailed / totalMessages) * 100 : 0;
  const successRate =
    totalMessages > 0 ? ((messagesSent / totalMessages) * 100).toFixed(1) : 0;
  const remaining = totalMessages - messagesSent - messagesFailed;

  return (
    <>
      <div className="relative bg-white p-6 rounded-xl border border-slate-200/60 shadow-xl shadow-slate-200/40 backdrop-blur-md w-full">
        {/* History & Refresh Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
       <Button
  variant="ghost"
  size="sm"
  onClick={() => setIsHistoryOpen(true)}
  className="flex items-center cursor-pointer gap-2 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 rounded-lg transition-all duration-200 shadow-sm backdrop-blur-sm"
  aria-label="View Campaign History"
>
  <History className="w-4 h-4" />
  <span className="hidden sm:inline font-medium">History</span>
</Button>
{true && (
  <Button
    variant="ghost"
    size="sm"

    onClick={()=>{setrefreshing(true)}}
    disabled={refreshing}
    className="flex  cursor-pointer items-center gap-2 px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 rounded-lg transition-all duration-200 shadow-sm backdrop-blur-sm"
    aria-label="Refresh Campaign Status"
  >
    <RefreshCw
      className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
    />

  </Button>
)}
        </div>

        {/* Header */}
        <div className="flex min-w-80 justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl shadow-sm">
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-slate-800 text-lg tracking-tight">
              SMS Campaign
            </h3>

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
              <span className="text-sm font-medium text-slate-600 tracking-wide">
                Total
              </span>
            </div>
            <div className="font-bold text-xl text-slate-800 mb-1">
              {totalMessages.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500/80 font-medium">
              messages queued
            </div>
          </div>

          {/* Messages Sent */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100/80 rounded-xl shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-700 tracking-wide">
                Sent
              </span>
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
              <span className="text-sm font-medium text-rose-700 tracking-wide">
                Failed
              </span>
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
              <span className="text-sm font-medium text-blue-700 tracking-wide">
                Success
              </span>
            </div>
            <div className="font-bold text-xl text-blue-700 mb-1">
              {successRate}%
            </div>
            <div className="text-xs text-blue-600/80 font-medium">
              delivery rate
            </div>
          </div>
        </div>

        {/* Remaining Messages */}
        {!isComplete && remaining > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200/50">
            <div className="text-center text-sm text-slate-600/80">
              <span className="font-semibold text-slate-700">
                {remaining.toLocaleString()}
              </span>{" "}
              messages remaining in queue
            </div>
          </div>
        )}
      </div>

     {/* History Sheet */}
<Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
  <SheetContent className="w-[400px] sm:w-[540px] flex flex-col">
    <SheetHeader className="pb-6 border-b border-slate-200">
      <SheetTitle className="flex items-center gap-2.5 text-slate-900">
        <History className="w-5 h-5 text-slate-700" />
        Campaign History
      </SheetTitle>
      <SheetDescription className="text-slate-600">
        A log of all past SMS campaigns and their performance.
      </SheetDescription>
    </SheetHeader>

    <div className="flex-1 overflow-y-auto -mx-6 px-6 py-6">
      {pastCampaigns.length > 0 ? (
        <div className="space-y-5">
          {pastCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className=" rounded-xl p-5  bg-white   transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-base text-slate-900">
                  {campaign.name}
                </h4>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {campaign.date}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                      Sent
                    </span>
                  </div>
                  <span className="block font-bold text-2xl text-emerald-700 text-center">
                    {campaign.sent.toLocaleString()}
                  </span>
                </div>

                <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                      Failed
                    </span>
                  </div>
                  <span className="block font-bold text-2xl text-rose-700 text-center">
                    {campaign.failed.toLocaleString()}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <Send className="w-4 h-4 text-slate-600" />
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Total
                    </span>
                  </div>
                  <span className="block font-bold text-2xl text-slate-800 text-center">
                    {campaign.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <div className="bg-slate-100 rounded-full p-6 mb-4">
            <History className="w-12 h-12 text-slate-400" />
            
          </div>
          <h4 className="font-semibold text-lg text-slate-800 mb-2">
            No History Found
          </h4>
          <p className="text-sm text-slate-600 max-w-[280px]">
            There are no past campaigns to display. Your campaign history will appear here once you start sending messages.
          </p>
        </div>
      )}
    </div>
  </SheetContent>
</Sheet>
    </>
  );
}
