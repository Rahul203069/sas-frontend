import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User } from "lucide-react";


export default function TestBotDialog({ isOpen, onClose, bot }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello! I'm ${bot?.name}. I'm a ${bot?.type} bot ready to help you. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const systemPrompt = bot?.type === 'buyer' 
        ? "You are a buyer bot that helps identify and qualify potential purchases. Be helpful and ask relevant questions about buying needs."
        : "You are a seller bot that helps qualify leads and book sales calls. Be professional and focus on understanding customer needs.";
const response='server is not available right now';

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: `Hello! I'm ${bot?.name}. I'm a ${bot?.type} bot ready to help you. What would you like to know?`,
        timestamp: new Date()
      }
    ]);
    setInputMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl sm:max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Test {bot?.name}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Have a conversation with your bot to test its responses and behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-slate-100 px-4 py-3 rounded-xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetChat}
                className="text-slate-600 hover:bg-slate-50"
              >
                Reset Chat
              </Button>
              <p className="text-xs text-slate-500">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}