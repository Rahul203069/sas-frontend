import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BotLogs from './BotLogs';
import { PanelTopOpen } from 'lucide-react';
import { ScrollText } from 'lucide-react';
// Generate more sample data to demonstrate lazy loading
const generateLogs = (count, startIndex = 0) => {
  const types = ['bot_message', 'lead_reply', 'call_booked', 'appointment_success'];
  const names = ['Rohit Johnson', 'Sarah Smith', 'Mike Davis', 'Emily Chen', 'Alex Rodriguez'];
  const messages = [
    "I'm interested in solar installation for my home",
    "What are your financing options?",
    "Can you provide a quote for a 5kW system?",
    "Yes, that sounds good. Let's schedule a consultation",
    "I need more information about the warranty",
    "What's the installation timeline?",
    "Do you offer maintenance services?",
    "I'd like to compare your prices with other companies"
  ];

  const logs = [];

  if (startIndex === 0) {
    logs.push({
      type: 'start',
      title: 'Conversation Started',
      details: 'Bot initiated contact with lead',
      timestamp: new Date('2023-10-27T10:00:00Z')
    });
  }

  for (let i = 0; i < count; i++) {
    const actualIndex = startIndex + i;
    const type = types[actualIndex % types.length];
    const name = names[actualIndex % names.length];
    const message = messages[actualIndex % messages.length];
    const timestamp = new Date(Date.now() - (count + startIndex - i) * 60000); // 1 minute intervals

    logs.push({
      type,
      title: type === 'bot_message' ? 'Bot Message Sent' : 
             type === 'lead_reply' ? 'Lead Response' :
             type === 'call_booked' ? 'Call Scheduled' : 'Appointment Success',
      leadName: type !== 'bot_message' ? name : undefined,
      message: type === 'call_booked' ? undefined : 
               type === 'bot_message' ? `Thank you for your interest! ${message.replace('I', 'You')}` : message,
      callDetails: type === 'call_booked' ? `Call booked with ${name} for ${new Date(timestamp.getTime() + 86400000).toLocaleDateString()}` : undefined,
      details: `${type.replace('_', ' ')} interaction logged`,
      timestamp
    });
  }

  if (startIndex + count >= 45) { // Add end marker near the end
    logs.push({
      type: 'chat_stopped',
      title: 'Conversation Ended',
      details: 'The chat has been stopped by the user',
      timestamp: new Date()
    });
  }

  return logs;
};

export default function BotLogsBox() {
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allLogs, setAllLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const logsPerPage = 15;

  // Simulate initial data fetching when dialog opens
  useEffect(() => {
    if (isLogDialogOpen && allLogs.length === 0) {
      fetchInitialLogs();
    }
  }, [isLogDialogOpen]);

  const fetchInitialLogs = async () => {
    setIsInitialLoading(true);
    
    // Simulate API delay for initial load
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    
    const initialLogs = generateLogs(logsPerPage, 0);
    setAllLogs(initialLogs);
    setCurrentPage(1);
    setIsInitialLoading(false);
  };

  // Simulate loading more data
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    
    // Simulate API delay for loading more
    await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
    
    const startIndex = currentPage * logsPerPage;
    const newLogs = generateLogs(logsPerPage, startIndex);
    
    setAllLogs(prev => [...prev, ...newLogs]);
    setCurrentPage(prev => prev + 1);
    
    // Stop loading more after 50 total logs
    if (startIndex + logsPerPage >= 50) {
      setHasMore(false);
    }
    
    setIsLoadingMore(false);
  };

  const handleDialogClose = (open) => {
    setIsLogDialogOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setAllLogs([]);
      setCurrentPage(0);
      setHasMore(true);
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  return (
    
    <>
        <Button onClick={() => setIsLogDialogOpen(true)} size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
           <ScrollText className="w-4 h-4" />
              Logs
     </Button>
    
      <BotLogs
        isOpen={isLogDialogOpen}
        onOpenChange={handleDialogClose}
        logs={allLogs}
        botName="Apex Solar Bot"
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoadingMore}
        isInitialLoading={isInitialLoading}
      />
    </>
  );
}