//@ts-nocheck
"use client";
import ChatbotConfig from "@/components/ChatbotConfig";
import Sidebarwrapper from "@/components/Sidebarwrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import Sorrybot from "@/components/ui/Sorrybot";
import { fetchBots } from "../action";
import { toast } from "sonner";
import { BotCard } from "@/components/BotCard";
import { Loader2 } from "lucide-react"; // Import loader icon

export default function Leads() {
  const [create, setCreate] = useState(false);
  const [reload, setReload] = useState(false);
  const [bots, setBots] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBots()
      .then((res) => {
        if (res) setBots(res);
        console.log(res, "bots");
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setLoading(false));
  }, [reload]);

  return (
    <Sidebarwrapper>
      <div className="p-8 h-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bot</h1>

        <div className="w-full h-full">
          <div className="mx-auto flex justify-end">
            <Button
              onClick={() => setCreate((prev) => !prev)}
              size="default"
              className="text-xl p-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Bot
              <div className="text-xl scale-150 pl-4">
                <Plus />
              </div>
            </Button>
          </div>

          {/* Show loading indicator while fetching bots */}
          {loading ? (
            <div className="flex justify-center items-center mt-6">
              <Loader2 className="animate-spin text-blue-600" size={40} />

            </div>
          ) : (
            <>
              {bots?.sellerbot && (
                <BotCard
                  id={bots.sellerbot.id}
                  isLive={bots.sellerbot.islive}
                  name={bots.sellerbot.name}
                  type="Seller bot"
                  key={bots.sellerbot.id}
                  onConfigure={() => {}}
                  onToggleLive={() => {}}
                />
              )}

              {bots?.buyerbot && (
                <BotCard
                  id={bots.buyerbot.id}
                  isLive={bots.buyerbot.islive}
                  name={bots.buyerbot.name}
                  type="Buyer bot"
                  key={bots.buyerbot.id}
                  onConfigure={() => {}}
                  onToggleLive={() => {}}
                />
              )}

              {/* Show chatbot config or fallback message */}
              {create ? (
                <ChatbotConfig setrelode={setReload}   setclose={setCreate} />
              ) : (
                <Sorrybot description="Sorry, no bot created yet. Click on 'Create Bot' to get started." />
              )}
            </>
          )}
        </div>
      </div>
    </Sidebarwrapper>
  );
}
