//@ts-nocheck
"use client"

import React, { useState, useEffect } from 'react';
import { 
  X, MessageCircle, User, Bot, Brain, TrendingUp, 
  CheckCircle, AlertCircle, Target 
} from 'lucide-react';
import { set } from 'date-fns';

// --- TYPE DEFINITIONS ---
// These should ideally be in a central types file (e.g., types/index.ts)
// but are included here for completeness.
interface Lead {
  name: string;
  company: string;
  messageCount: number;
  lastContact: string;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'lead';
  message: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface AISummary {
  overallAssessment: string;
  keyInsights: string[];
  interestSignals: string[];
  concerns: string[];
  recommendedActions: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    reasoning: string;
  }[];
}

// --- PROPS INTERFACE ---
// This defines what properties the component expects to receive from its parent.
interface CombinedModalProps {
  lead: Lead;
  onClose: () => void;
}

// --- COMPONENT DEFINITION ---
const CombinedModal: React.FC<CombinedModalProps> = ({ lead, onClose }) => {
  // --- DYNAMIC MOCK DATA ---
  // This data is now generated based on the `lead` prop passed into the component.
  // In a real application, you would fetch this data using the lead's ID.


  const [chatMessages, setchatMessages] = useState([])
useEffect(() => {

    
    const messages=lead.conversations[0].messages;
    
     const chat= messages.map((msg:any)=>{
    
      return {
          id: msg.id,
          type: msg.sender === 'AI' ? 'ai' : 'lead',
          message:msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read' // Assuming status is part of the message object
      }
    })

    console.log(chat,"chatsups baby")

    setchatMessages(chat)
  }


, [])




  const aiSummary: AISummary = {
    overallAssessment: `${lead.name} shows strong interest in automation solutions and appears to be a qualified decision-maker at ${lead.company}. High likelihood of conversion with proper follow-up.`,
    keyInsights: [ 'Currently handling customer inquiries manually', 'Company in growth phase seeking efficiency', 'Has decision-making authority' ],
    interestSignals: [ 'Stated "That sounds exactly like what we need"', 'Asked for demo without hesitation' ],
    concerns: [ 'May need to involve team members', 'Timeline not yet discussed' ],
    recommendedActions: [
      { priority: 'high', action: 'Schedule demo within 48 hours', reasoning: 'Lead is highly engaged and ready to see the product.' },
      { priority: 'medium', action: 'Research their tech stack', reasoning: 'Better position our solution.' }
    ]
  };

  // --- HELPER FUNCTIONS (No changes needed) ---
  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'read': return <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />;
      case 'delivered': return <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />;
      default: return null;
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-lg">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-sm text-gray-500">{lead.company}</p>
            </div>
          </div>
          {/* CORRECTED: The onClick now calls the function passed down from the parent */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content - Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Chat Messages */}
          <div className="w-1/2 flex flex-col border-r border-gray-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Conversation</h3>
                <span className="ml-auto text-sm text-gray-500">{chatMessages.length} messages</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
              {chatMessages?.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] ${message.type === 'ai' ? 'order-2' : 'order-1'}`}>
                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${message.type === 'ai' ? 'bg-white border border-gray-200' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'}`}>
                      <p className="text-sm leading-relaxed">{message.message}</p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1.5 px-2 ${message.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <span className="text-xs text-gray-400">{message.timestamp}</span>
                      {message.type === 'ai' && message.status && getMessageStatusIcon(message.status)}
                    </div>
                  </div>

                  {message.type === 'lead' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - AI Summary */}
          <div className="w-1/2 flex flex-col bg-gradient-to-b from-purple-50/30 to-white">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Analysis</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Overall Assessment */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Overall Assessment</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{aiSummary.overallAssessment}</p>
              </div>

              {/* Key Insights, Signals, Concerns, Actions... */}
              {/* (The rest of the JSX for the AI summary remains unchanged) */}
              <div>
                 <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Insights</h4>
                 <div className="space-y-2">
                   {aiSummary.keyInsights.map((insight, index) => (
                     <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                       <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                       <p className="text-sm text-gray-700">{insight}</p>
                     </div>
                   ))}
                 </div>
               </div>

               <div>
                 <div className="flex items-center gap-2 mb-3">
                   <CheckCircle className="w-4 h-4 text-green-600" />
                   <h4 className="text-sm font-semibold text-gray-900">Interest Signals</h4>
                 </div>
                 <div className="space-y-2">
                   {aiSummary.interestSignals.map((signal, index) => (
                     <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                       <p className="text-sm text-green-800">{signal}</p>
                     </div>
                   ))}
                 </div>
               </div>
                
               <div>
                 <div className="flex items-center gap-2 mb-3">
                   <AlertCircle className="w-4 h-4 text-amber-600" />
                   <h4 className="text-sm font-semibold text-gray-900">Potential Concerns</h4>
                 </div>
                 <div className="space-y-2">
                   {aiSummary.concerns.map((concern, index) => (
                     <div key={index} className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 shadow-sm">
                       <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                       <p className="text-sm text-amber-800">{concern}</p>
                     </div>
                   ))}
                 </div>
               </div>

               <div>
                 <div className="flex items-center gap-2 mb-3">
                   <Target className="w-4 h-4 text-blue-600" />
                   <h4 className="text-sm font-semibold text-gray-900">Recommended Actions</h4>
                 </div>
                 <div className="space-y-3">
                   {aiSummary.recommendedActions.map((action, index) => (
                     <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border mb-2 ${getPriorityStyles(action.priority)}`}>
                         {action.priority.toUpperCase()} PRIORITY
                       </span>
                       <h5 className="font-medium text-gray-900 mb-1 text-sm">{action.action}</h5>
                       <p className="text-xs text-gray-600">{action.reasoning}</p>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{lead.messageCount} messages</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span>AI Analysis completed</span>
              </div>
            </div>
            <span className="text-gray-400">
              Last activity: {
                (() => {
                  const aiMessages = chatMessages.filter((m: any) => m.type === 'ai');
                  return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1].timestamp : 'N/A';
                })()
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedModal;