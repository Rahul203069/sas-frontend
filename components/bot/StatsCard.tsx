import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = "blue",
  tooltip 
}) {
  const [showTooltip, setShowTooltip] = useState(false);

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
    <div className="relative z-10">
      <Card className="group hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border-slate-200/60 overflow-visible">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-slate-600 tracking-tight">
              {title}
            </CardTitle>
            {tooltip && (
              <div 
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
                
                {/* Tooltip box */}
                {showTooltip && (
                  <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs text-slate-600 w-max max-w-[200px] z-50">
                    {tooltip}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-slate-200 rotate-45"></div>
                  </div>
                )}
              </div>
            )}
          </div>
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
    </div>
  );
}
