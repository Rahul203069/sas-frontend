
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BotActivationDialog from "./BotActivationDialog";
import { Link } from "react-router-dom";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bot, 
  Settings, 
  MessageSquare, 
  Upload, 
  RefreshCw, 
  Activity,
  Phone,
  MessageCircle,
  Users,
  Flame,
  Thermometer,
  Snowflake,
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  ScrollText
} from "lucide-react";
import { format } from "date-fns";
import StatsCard from "./StatsCard";
import ShowConfig from "./ShowConfig";
import BotLogs from "./BotLogs";
import BotLogsBox from "./BotlogBox";

export default function BotCard({ bot, onChangeStatus, onTestBot, onImportLeads, onSyncNow }) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [loading, setLoading] = useState(true);


const router = useRouter();
  const handleChangeStatus = async (newStatus) => {
    if (isChangingStatus) return;
    setIsChangingStatus(true);
    await onChangeStatus(bot, newStatus);
    setIsChangingStatus(false);
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await onSyncNow(bot);
    setIsSyncing(false);
  };

  const getBotTypeColor = (type) => {
    return type === 'buyer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700';
  };






const handleActivationSuccess = () => {
    setShowActivationDialog(false);
    
  };





  return (
<>
    <div className="space-y-6 ">
      {/* Bot Header */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Leads Contacted"
          value={bot.leads_contacted}
          icon={Users}
          color="blue"
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Replies"
          value={bot.replies}
          icon={MessageCircle}
          color="green"
          trend="up"
          trendValue="+8%"
        />
        <StatsCard
          title="Calls Booked"
          value={bot.calls_booked}
          icon={Phone}
          color="amber"
          trend="up"
          trendValue="+15%"
        />
        <StatsCard
          title="Response Rate"
          value={`${bot.leads_contacted > 0 ? Math.round((bot.replies / bot.leads_contacted) * 100) : 0}%`}
          icon={Activity}
          color="blue"
          trend="up"
          trendValue="+5%"
        />
      </div>

      {/* Lead Quality Stats */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Lead Quality Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Flame className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Hot Leads</p>
                  <p className="text-2xl font-bold text-slate-900">{bot.hot_leads}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Thermometer className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Warm Leads</p>
                  <p className="text-2xl font-bold text-slate-900">{bot.warm_leads}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Snowflake className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Cold Leads</p>
                  <p className="text-2xl font-bold text-slate-900">{bot.cold_leads}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                  {bot.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${getBotTypeColor(bot.type)} border-0  m-1 p-2 font-medium`}>
                    {bot.type} bot
                  </Badge>
                  <Badge className={`${getStatusColor(bot.status)} border-0 m-1 p-2 font-medium`}>
                    <Activity className="w-4 h-4 mr-1" />
                    {bot.status}
                  </Badge>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-slate-200/60">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleChangeStatus('active')}
                  disabled={bot.status === 'active' || isChangingStatus}
                  className="cursor-pointer"
                >
                  <PlayCircle className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>Activate</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleChangeStatus('inactive')}
                  disabled={bot.status === 'inactive' || isChangingStatus}
                  className="cursor-pointer"
                >
                  <PauseCircle className="mr-2 h-4 w-4 text-slate-600" />
                  <span>Deactivate</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            {/* <Link to={`http://localhost:3000/bot/${bot.id}/settings`} className="flex-1">
              <Button variant="outline" className="flex items-center gap-2 hover:bg-slate-50 border-slate-200">
                <Settings className="w-4 h-4" />
                View Config
              </Button>
            </Link> */}

            <ShowConfig config={bot}></ShowConfig>

            <Button 
              onClick={() => {router.push(`bot/${bot.id}&${bot.type}`)}}
              variant="outline" 
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
            >
              <Settings className="w-4 h-4" />
              Configure Bot
            </Button>

            <Button 
              onClick={() =>{router.push(`csv-upload/${bot.id}`)}}
              variant="outline"
              className="flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
            >
              <Upload className="w-4 h-4" />
              Import Leads
            </Button>
        



            <BotLogsBox></BotLogsBox>

            <Button 
              onClick={handleSync}
              disabled={isSyncing}
              variant="outline"
              className="flex items-center gap-2 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
          

          {bot.last_sync && (
            <p className="text-sm text-slate-500 mt-4">
              Last sync: {format(new Date(bot.last_sync), 'MMM d, yyyy at h:mm a')}
            </p>
          )}
        </CardContent>
      </Card>
      
    </div>
     {/* Bot Activation Dialog */}
        <BotActivationDialog
          open={showActivationDialog}
          onOpenChange={setShowActivationDialog}
          botData={bot}
          onSuccess={handleActivationSuccess}
        />
    </>
  );
}
