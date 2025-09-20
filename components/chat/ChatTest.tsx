import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/chat/ChatBox";

export default function ChatTest() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    
        <>
        
     




    <Button 
                onClick={() => setIsChatOpen(true)}
                variant="outline" 
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
              >
                  <MessageCircle className="w-4 h-4" />
                Chat
              </Button>

      <AnimatePresence>
        {isChatOpen && (
            <ChatBox 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            />
        )}
      </AnimatePresence>
   
      </>
  );
}