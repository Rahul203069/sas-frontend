import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Phone } from "lucide-react";

export default function AnalyticsOverview() {
  return (
    <div className="mb-8">
       <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Overall Performance
          </h2>
          <p className="text-slate-600">
            A high-level overview of your bots' key metrics.
          </p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Leads</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2,847</div>
            <p className="text-xs text-emerald-600 font-medium">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Calls Booked</CardTitle>
            <Phone className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">341</div>
            <p className="text-xs text-emerald-600 font-medium">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Response Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">24.8%</div>
            <p className="text-xs text-emerald-600 font-medium">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12.0%</div>
            <p className="text-xs text-emerald-600 font-medium">+4.3% from last month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}