import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ title, value, icon: Icon, trend, trendValue, color = "blue" }) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      badge: "bg-blue-100 text-blue-700"
    },
    green: {
      bg: "bg-emerald-50", 
      icon: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700"
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600", 
      badge: "bg-amber-100 text-amber-700"
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      badge: "bg-red-100 text-red-700"
    }
  };

  return (
    <Card className="group hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border-slate-200/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-slate-600 tracking-tight">
          {title}
        </CardTitle>
        <div className={`p-2.5 rounded-xl ${colorClasses[color].bg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-4 h-4 ${colorClasses[color].icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </div>
          {trend && (
            <Badge variant="secondary" className={`${colorClasses[color].badge} border-0 font-medium`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {trendValue}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}