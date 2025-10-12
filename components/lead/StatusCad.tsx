import React, { use } from 'react';
import { Card } from "@/components/ui/card";
import { Users, Flame, Thermometer, Snowflake, TrendingUp } from "lucide-react";
import { useEffect } from 'react';
import { set } from 'date-fns';
import { useState } from 'react';
export default function StatsCads({ leads }) {
  
  const [count, setcount] = useState(null)
  
  useEffect(() => {
    
    console.log(leads,"from statscard")
    const hotLeads = leads.HOT
    const warmLeads = leads.WARM
    const coldLeads = leads.JUNK
    const totalLeads = parseInt(hotLeads) +  parseInt(warmLeads) + parseInt(coldLeads);

const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      change: "+12.5%",
      changeColor: "text-green-500"
    },
    {
      title: "Hot Leads",
      value: leads.HOT,
      icon: Flame,
      color: "bg-red-50",
      iconColor: "text-red-500",
      change: `${totalLeads > 0 ? ((hotLeads / totalLeads) * 100).toFixed(1) : 0}%`,
      changeColor: "text-red-500"
    },
    {
      title: "Warm Leads",
      value: leads.WARM,
      icon: Thermometer,
      color: "bg-yellow-50",
      iconColor: "text-yellow-500",
      change: `${totalLeads > 0 ? ((warmLeads / totalLeads) * 100).toFixed(1) : 0}%`,
      changeColor: "text-yellow-500"
    },
    {
      title: "Cold Leads",
      value: leads.JUNK,
      icon: Snowflake,
      color: "bg-blue-50",
      iconColor: "text-blue-400",
      change: `${totalLeads > 0 ? ((coldLeads / totalLeads) * 100).toFixed(1) : 0}%`,
      changeColor: "text-blue-400"
    }
  ];

setcount(stats);

},[])


  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {count?.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className={`text-xs font-medium ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}