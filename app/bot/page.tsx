//@ts-nocheck
"use client"

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Bot as BotIcon } from "lucide-react";
import Sidebarwrapper from "@/components/Sidebarwrapper";
import { fetchBots } from "@/app/action";
import BotCard from "@/components/bot/BotCard";
import BotSelector from "@/components/bot/BotSelector";
import ImportLeadsModal from "@/components/bot/ImportLeadsModal";
import TestBotDialog from "@/components/bot/TestBotDialog";
import AnalyticsOverview from "@/components/bot/AnalyticsOverview";
import { get } from "http";


// Simple toast implementation for demonstration
function useToast() {
  return {
    toast: ({ title, description, variant }) => {
      // Replace with your toast library or UI
      alert(`${title}\n${description}`);
      // Optionally handle variant (e.g., destructive)
    },
  };
}






// Simulated Bot API
const Bot = {
  async list() {
    // Replace with real API call
    return [
      {
        id:  "1f6a7e14-6cf4-40e5-b125-71034cd5993e",
        name: "Buyer Bot",
        type: "buyer",
        status: "active",
        leads_contacted: 120,
        replies: 30,
        calls_booked: 10,
        hot_leads: 5,
        warm_leads: 10,
        cold_leads: 105,
        last_sync: new Date().toISOString(),
        config: {
          model: "gpt-4",
          temperature: 0.7,
          max_tokens: 150,
          system_prompt: "",
        },
      },
      {
        id: "1f6a7e14-6cf4-40e5-b125-71034cd5993e",
        name: "Seller Bot",
        type: "seller",
        status: "inactive",
        leads_contacted: 80,
        replies: 20,
        calls_booked: 5,
        hot_leads: 2,
        warm_leads: 8,
        cold_leads: 70,
        last_sync: new Date().toISOString(),
        config: {
          model: "gpt-4",
          temperature: 0.7,
          max_tokens: 150,
          system_prompt: "",
        },
      },
    ];
  },
  async update(id, data) {
    // Replace with real API call
    return { success: true };
  },
};






export default function Page() {
  const [bots, setBots] = useState([]);
  const [botids, setidBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBot, setActiveBot] = useState('buyer');
  const [selectedBot, setSelectedBot] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
const [metrics, setmetrics] = useState(null)

const [create, setCreate] = useState(false);
  const [reload, setReload] = useState(false);


  // useEffect(() => {
  //   setLoading(true);
  //   fetchBots()
  //     .then((res) => {
  //       if (res) setidBots(res);

  //       const {sellerBot, buyerBot} = res

  //       console.log(res, "bots");
  //     })
  //     .catch(() =>{})
  //     .finally(() => setLoading(false));
  // }, [reload]);


  const { toast } = useToast();

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = async () => {
    try {
      const botList = await fetchBots();
      console.log(botList, "Loaded Bots");

      setBots([botList.bot]);

      setmetrics(botList.botmetrics);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (bot, newStatus) => {
    try {
      await Bots.update(bot.id, { status: newStatus });
      setBots(prev => prev.map(b => 
        b.id === bot.id ? { ...b, status: newStatus } : b
      ));
      
      toast({
        title: "Success",
        description: `${bot.name} is now ${newStatus}.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bot status",
        variant: "destructive",
      });
    }
  };

  const handleTestBot = (bot) => {
    setSelectedBot(bot);
    setTestDialogOpen(true);
  };

  const handleImportLeads = (bot) => {
    setSelectedBot(bot);
    setImportModalOpen(true);
  };

  const handleImportSubmit = async (bot, file) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update bot stats (simulated)
    const newLeadsCount = Math.floor(Math.random() * 50) + 10;
    await Bot.update(bot.id, {
      leads_contacted: bot.leads_contacted + newLeadsCount,
      cold_leads: bot.cold_leads + Math.floor(newLeadsCount * 0.7),
      warm_leads: bot.warm_leads + Math.floor(newLeadsCount * 0.2),
      hot_leads: bot.hot_leads + Math.floor(newLeadsCount * 0.1),
    });

    loadBots();
    
    toast({
      title: "Success",
      description: `Imported ${newLeadsCount} leads for ${bot.name}`,
      variant: "default",
    });
  };

  const handleSyncNow = async (bot) => {
    try {
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await Bot.update(bot.id, {
        last_sync: new Date().toISOString(),
      });

      loadBots();
      
      toast({
        title: "Success",
        description: `${bot.name} synced successfully`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync bot",
        variant: "destructive",
      });
    }
  };


  const sellerBot = bots.find(bot => bot.type === 'SELLER');
  const currentBot = sellerBot;

  if (loading) {
    return (
      <Sidebarwrapper>

      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="h-24 bg-slate-200 rounded-lg"></div>
              <div className="h-24 bg-slate-200 rounded-lg"></div>
              <div className="h-24 bg-slate-200 rounded-lg"></div>
              <div className="h-24 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-48 bg-slate-200 rounded-lg"></div>
            <div className="h-48 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-96 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
      </Sidebarwrapper>
    );
  }

  return (
    <Sidebarwrapper>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto bg-gray-50">
      
        
     

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Bot Management
          </h2>
          <p className="text-slate-600">
            Select a bot to view details and manage settings
          </p>
        </div>

   

        {currentBot ? (

          <BotCard
          botmetrics={metrics}
            bot={currentBot}
            onChangeStatus={handleChangeStatus}
            onTestBot={handleTestBot}
            onImportLeads={handleImportLeads}
            onSyncNow={handleSyncNow}
          />


        ) : (
          <Card className="border-dashed border-2 border-slate-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BotIcon className="w-12 h-12 text-slate-400 mb-4" />

              <CardTitle className="text-slate-600 mb-2">

                No {activeBot === 'buyer' ? 'Buyer' : 'Seller'} Bot Found   
                 
              </CardTitle>
              <p className="text-slate-500 text-center mb-6">
                Create a {activeBot} bot to start {activeBot === 'buyer' ? 'qualifying and managing purchase leads' : 'qualifying leads and booking sales calls'}
              </p>
              <Button className={activeBot === 'buyer' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}>
                <Plus className="w-4 h-4 mr-2" />
                Create {activeBot === 'buyer' ? 'Buyer' : 'Seller'} Bot
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <ImportLeadsModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        bot={selectedBot}
        onImport={handleImportSubmit}
      />

      <TestBotDialog
        isOpen={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        bot={selectedBot}
      />
    </Sidebarwrapper>
  );
}