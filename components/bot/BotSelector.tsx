import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot,
  ShoppingCart, 
  TrendingUp,
  Users,
  Activity,
  CheckCircle2
} from "lucide-react";

export default function BotSelector({ activeBot, onBotChange, buyerBot, sellerBot }) {
  const bots = [
    {
      id: 'buyer',
      name: 'Buyer Bot',
      icon: ShoppingCart,
      description: 'Identifies and qualifies potential purchases',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      bot: buyerBot,
      features: ['Lead Qualification', 'Purchase Intent Analysis', 'Buying Process Guidance']
    },
    {
      id: 'seller',
      name: 'Seller Bot',
      icon: TrendingUp,
      description: 'Qualifies leads and books sales calls',
      color: 'purple',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      bot: sellerBot,
      features: ['Sales Qualification', 'Call Scheduling', 'Customer Needs Analysis']
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {bots.map((botType) => {
        const isActive = activeBot === botType.id;
        const hasBot = !!botType.bot;
        const Icon = botType.icon;

        return (
          <Card
            key={botType.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
              isActive
                ? `ring-2 ring-${botType.color}-500 shadow-lg bg-gradient-to-br ${botType.bgGradient}`
                : 'hover:shadow-md border-slate-200/60'
            }`}
            onClick={() => onBotChange(botType.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${botType.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {botType.name}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {botType.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {hasBot && (
                    <Badge 
                      className={`${
                        botType.bot.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      } border font-medium`}
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      {botType.bot.status}
                    </Badge>
                  )}
                  
                  {isActive && (
                    <div className={`w-8 h-8 rounded-full bg-${botType.color}-500 flex items-center justify-center`}>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {hasBot && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {botType.bot.leads_contacted}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Contacted
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {botType.bot.replies}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Replies
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {botType.bot.calls_booked}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Calls
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Key Features
                </p>
                <div className="flex flex-wrap gap-1">
                  {botType.features.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-white/80 text-slate-600 border border-slate-200"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {!hasBot && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Bot className="w-4 h-4" />
                    <span className="text-sm font-medium">Bot not configured</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}