import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Send, XCircle, CheckCircle, BarChart3, Info } from "lucide-react";

export default function Test() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Rate Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold text-slate-700">
                Response Rate
              </CardTitle>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-4xl font-bold text-slate-900">75%</div>
            <Badge className="bg-blue-100 text-blue-700 border-0 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5%
            </Badge>
          </CardContent>
        </Card>

        {/* SMS Campaign Card */}
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  SMS Campaign
                </CardTitle>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-0 font-medium px-3 py-1">
                In Progress
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: '78.4%' }}></div>
              </div>
            </div>

            {/* Stats Grid - 4 columns in one row */}
            <div className="grid grid-cols-4 gap-3">
              {/* Total */}
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-xs font-medium text-slate-600">Total</span>
                </div>
                <div className="text-xl font-bold text-slate-900">1,250</div>
                <p className="text-xs text-slate-500 mt-1 text-center">messages queued</p>
              </div>

              {/* Sent */}
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-700">Sent</span>
                </div>
                <div className="text-xl font-bold text-emerald-700">980</div>
                <p className="text-xs text-emerald-600 mt-1 text-center">78.4% delivered</p>
              </div>

              {/* Failed */}
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-xs font-medium text-red-700">Failed</span>
                </div>
                <div className="text-xl font-bold text-red-700">45</div>
                <p className="text-xs text-red-600 mt-1 text-center">3.6% errors</p>
              </div>

              {/* Success Rate */}
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Success</span>
                </div>
                <div className="text-xl font-bold text-blue-700">78.4%</div>
                <p className="text-xs text-blue-600 mt-1 text-center">delivery rate</p>
              </div>
            </div>

            {/* Queue Status */}
            <div className="flex items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">225</span> messages remaining in queue
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}