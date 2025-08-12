import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, MessageCircle, HelpCircle, Building, Edit } from "lucide-react";

export default function ConfigurationStep({ botData, onConfigure }) {
  const mockBotData = botData || {
    name: "LeadGen Pro Bot",
    starting_message: "Hi! I'm here to help you with your business needs. What can I assist you with today?",
    enrichment_questions: [
      "What's your company size?",
      "What's your budget range?",
      "When are you looking to implement?"
    ],
    business_info: "AI-powered SaaS solutions for growing businesses"
  };

  const InfoRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-start gap-4 py-4 border-b border-slate-200/80 last:border-b-0">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="text-slate-800 font-medium mt-1">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900">Review Configuration</h3>
        <p className="text-sm text-slate-500">Confirm your bot's settings before proceeding.</p>
      </div>

      <Card className="bg-white/70 shadow-sm border-slate-200/80">
        <CardContent className="p-4">
          <InfoRow icon={Settings} label="Bot Name">
            <p>{mockBotData.name}</p>
          </InfoRow>

          <InfoRow icon={MessageCircle} label="Starting Message">
            <p className="text-sm italic">"{mockBotData.starting_message}"</p>
          </InfoRow>

          <InfoRow icon={HelpCircle} label="Enrichment Questions">
            <div className="space-y-1.5">
              {mockBotData.enrichment_questions.map((q, i) => (
                <p key={i} className="text-sm">{i + 1}. {q}</p>
              ))}
            </div>
          </InfoRow>

          <InfoRow icon={Building} label="Business Info">
            <p className="text-sm">{mockBotData.business_info}</p>
          </InfoRow>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={onConfigure}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Configuration
          </Button>
      </div>
    </div>
  );
}