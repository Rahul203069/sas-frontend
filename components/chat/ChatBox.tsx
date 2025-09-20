import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import MessageBubble from "./MessageBubble";
import LeadInfoPanel from "./LeadInfoPanel";

// --- Mock Data ---
const mockLeads = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", status: "new", notes: "Interested in property X" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "9876543210", status: "contacted", notes: "" }
];

const mockPreviousMessages = [
  { id: 1, message: "Welcome to the chat!", sender: "bot", timestamp: new Date().toISOString() }
];

// --- Typing Indicator ---
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-end gap-2"
  >
    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
      <Bot className="w-5 h-5 text-gray-600" />
    </div>
    <div className="bg-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
      <div className="flex items-center justify-center gap-1 h-5">
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  </motion.div>
);

export default function ChatBox({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && !currentLead) {
      const lead = mockLeads[0]; // Pick the first lead for demo
      setCurrentLead(lead);
      setConversationId(`conv_${lead.id}_${Date.now()}`);
      setMessages(mockPreviousMessages);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, currentLead]);

  const handleCloseChat = () => {
    setCurrentLead(null);
    setMessages([]);
    setInputValue("");
    setIsTyping(false);
    setConversationId(null);
    onClose();
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentLead) return;

    const userMessage = {
      id: Date.now(),
      message: inputValue,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate a longer bot conversation
    setTimeout(() => {
      const botResponse = [
        "Hello! 👋 How can I help you today?",
        "We have several properties you might be interested in.",
        "Are you looking for a residential or commercial property?",
        "Our latest listings include apartments in downtown and offices in the tech park area.",
        "I can also schedule a visit for you if you like.",
        "Do you have a preferred budget range?",
        "Also, do you want the property to be ready to move in or under construction?",
        "I can send you the latest pictures and floor plans as well."
      ];

      // Add messages one by one with 1s delay
      (async () => {
        for (let i = 0; i < botResponse.length; i++) {
          const botMessage = {
            id: Date.now() + i,
            message: botResponse[i],
            sender: "bot",
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, botMessage]);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setIsTyping(false);
      })();
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
      onClick={handleCloseChat}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="relative w-full max-w-5xl h-[90vh] max-h-[800px] bg-white rounded-3xl shadow-2xl flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Chat Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white ring-1 ring-green-400"></span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">SMS Bot Assistant</h3>
                <p className="text-xs text-gray-500">
                  {currentLead ? `Chatting with ${currentLead.name}` : "Loading lead..."}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCloseChat} className="text-gray-400 hover:bg-gray-100 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <MessageBubble key={msg.id || index} message={msg} />
              ))}
            </AnimatePresence>
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
            <div className="relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full pl-4 pr-12 py-6 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                disabled={isTyping || !currentLead}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping || !currentLead}
                className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg disabled:shadow-none disabled:bg-gray-300 transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Lead Info Panel */}
        <LeadInfoPanel lead={currentLead} onLeadUpdate={setCurrentLead} />
      </motion.div>
    </motion.div>
  );
}
