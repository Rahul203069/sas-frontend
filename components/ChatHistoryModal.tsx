import React, { useState, useEffect } from 'react';
import { X, MessageCircle, User, Bot, Clock, Loader2, AlertCircle, MessageSquareOff } from 'lucide-react';
import { Lead } from '../type/lead';
import { getchathistory } from '@/app/action';

interface ChatHistoryModalProps {
  lead: Lead;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'lead';
  message: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({ lead, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getchathistory(lead.id);
      
console.log(data);

      if (!data.success) {
        setError('Failed to load chat history. Please try again.');
        setLoading(false);
        return;
      }
      
      if (!data.messages || data.messages.length === 0) {
        setMessages([]);
        setLoading(false);
        return;
      }
      
      const updatedMessages = data.messages.map((msg: any) => ({
        id: msg.id,
        type: msg.sender === 'AI' ? 'ai' : 'lead',
        message: msg.content,
        timestamp: msg.timestamp ,
        status: 'delivered'
      }));
      //@ts-ignore
      setMessages(updatedMessages);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent':
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
      case 'delivered':
        return <div className="w-2 h-2 bg-blue-400 rounded-full" />;
      case 'read':
        return <div className="w-2 h-2 bg-green-400 rounded-full" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Chat with {lead.name}</h2>
              <p className="text-sm text-gray-500">{lead.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
              <p className="text-lg font-medium">Loading chat history...</p>
              <p className="text-sm text-gray-400 mt-1">Please wait</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Messages</h3>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <button
                  onClick={fetchMessages}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* No Messages State */}
          {!loading && !error && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
              <MessageSquareOff className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Messages Yet</h3>
              <p className="text-sm text-gray-500">No conversation history with this lead.</p>
            </div>
          )}

          {/* Messages Display */}
          {!loading && !error && messages.length > 0 && (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'lead' ? 'justify-start' : 'justify-end'}`}
                >
                  {message.type === 'lead' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] ${message.type === 'lead' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'lead'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 px-2 ${
                      message.type === 'lead' ? 'justify-start' : 'justify-end'
                    }`}>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                      {message.type === 'ai' && message.status && (
                        <div className="flex items-center gap-1">
                          {getMessageStatusIcon(message.status)}
                        </div>
                      )}
                    </div>
                  </div>

                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="p-6 border-t border-gray-200 bg-gray-50/50 flex-shrink-0">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>
                  {messages.length > 0 
                    ? `${messages.length} message${messages.length !== 1 ? 's' : ''} in conversation`
                    : 'No messages yet'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Last contact: {lead.lastContact || 'Never'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryModal;