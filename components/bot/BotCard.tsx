//@ts-nocheck
"use client"
import 
 React, { use, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ScrollText,
  Power,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import StatsCard from "./StatsCard";
import ShowConfig from "./ShowConfig";
import BotLogs from "./BotLogs";
import BotLogsBox from "./BotlogBox";
import ChatTest from "../chat/ChatTest";
import SmsStatusBox from "./SmsStatusBox";

export default function BotCard({botmetrics, bot, onChangeStatus, onTestBot, onImportLeads, onSyncNow }) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleToggleStatus = (checked) => {
    const newStatus = checked ? 'active' : 'inactive';
    setPendingStatus(newStatus);
    setShowConfirmDialog(true);
  };

  const confirmStatusChange = async () => {
    if (isChangingStatus || !pendingStatus) return;
    
    setIsChangingStatus(true);
    await onChangeStatus(bot, pendingStatus);
    setIsChangingStatus(false);
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

  const cancelStatusChange = () => {
    setShowConfirmDialog(false);
    setPendingStatus(null);
  };

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

  console.log(botmetrics, "bot metrics in bot card");

  return (
    <>
      <div className="space-y-6 ">
        {/* Bot Header */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Leads Contacted"
            value={botmetrics?.totalLeadsContacted}
            icon={Users}
            color="blue"
            trend="up"
            trendValue="+12%"
            tooltip="Total number of potential leads that have been contacted by the bot"
          />
          
          <StatsCard
            title="Replies"
            value={botmetrics?.totalReplied}
            icon={MessageCircle}
            color="green"
            trend="up"
            trendValue="+8%"
            tooltip="Number of leads who responded to the initial outreach messages"
          />
          
          <StatsCard
            title="Calls Booked"
            value={botmetrics?.callbooked}
            icon={Phone}
            color="amber"
            trend="up"
            trendValue="+15%"
            tooltip="Total number of calls successfully scheduled with interested leads"
          />
          
          <StatsCard
            title="Drop Off Rate"
            value={`${botmetrics?.dropOffRate}%`}
            icon={TrendingDown}
            color="red"
            trend="down"
            trendValue="-3%"
            tooltip="Percentage of leads who stopped responding during the conversation flow"
          />
        </div>

        {/* Second Row - Response Rate and SMS Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard
            title="Response Rate"
            value={`${botmetrics?.responseRate}%`}
            icon={Activity}
            color="blue"
            trend="up"
            trendValue="+5%"
            tooltip="Percentage of contacted leads who provided at least one response"
          />
          
          {/* SMS Status Box takes full available width */}
          <div className="w-full">
            <SmsStatusBox />
          </div>
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
                    <p className="text-2xl font-bold text-slate-900">{botmetrics.leadstatus.HOT}</p>
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
                    <p className="text-2xl font-bold text-slate-900">{botmetrics.leadstatus.WARM}</p>
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
                    <p className="text-2xl font-bold text-slate-900">{botmetrics.leadstatus.JUNK}</p>
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

              <div className="flex items-center gap-4">
                {/* Toggle Switch */}
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <Power className={`w-4 h-4 ${bot.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <Switch
                    checked={bot.status === 'active'}
                    onCheckedChange={handleToggleStatus}
                    disabled={isChangingStatus}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {bot.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="border-slate-200/60">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
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
            </div>
          </CardHeader>
        </Card>

        {/* Action Buttons */}
        <Card className="border-slate-200/60 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {/* <ShowConfig config={bot}></ShowConfig> */}

              {/* <Button 
                onClick={() => {router.push(`bot/${bot.id}&${bot.type}`)}}
                variant="outline" 
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
              >
                <Settings className="w-4 h-4" />
                Configure Bot
              </Button> */}

              <Button 
                onClick={() =>{router.push(`csv-upload/${bot.id}`)}}
                variant="outline"
                className="flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
              >
                <Upload className="w-4 h-4" />
                Import Leads
              </Button>

              <BotLogsBox></BotLogsBox>
               <ChatTest></ChatTest>
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

      {/* Status Change Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Confirm Status Change
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {pendingStatus === 'active' ? 'activate' : 'deactivate'} the bot "{bot.name}"?
              {pendingStatus === 'inactive' && (
                <span className="block mt-2 text-amber-600 font-medium">
                  This will stop all ongoing conversations and lead outreach.
                </span>
              )}
              {pendingStatus === 'active' && (
                <span className="block mt-2 text-emerald-600 font-medium">
                  This will resume bot operations and lead outreach.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={cancelStatusChange}
              disabled={isChangingStatus}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={isChangingStatus}
              className={`${
                pendingStatus === 'active' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isChangingStatus ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {pendingStatus === 'active' ? 'Activating...' : 'Deactivating...'}
                </>
              ) : (
                <>
                  {pendingStatus === 'active' ? (
                    <PlayCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <PauseCircle className="w-4 h-4 mr-2" />
                  )}
                  {pendingStatus === 'active' ? 'Activate Bot' : 'Deactivate Bot'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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