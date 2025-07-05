import React from 'react';
import { X, MessageCircle, User, Bot, Clock } from 'lucide-react';
import { Lead } from '../type/lead';

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
  // Mock chat data - in real app this would come from API
  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      type: 'ai',
      message: `Hi ${lead.name.split(' ')[0]}, I hope you're doing well! I wanted to reach out because I noticed ${lead.company} might benefit from our automation solutions. Would you be interested in a quick 15-minute call to discuss how we can help streamline your processes?`,
      timestamp: '2024-01-15 09:30 AM',
      status: 'read'
    },
    {
      id: '2',
      type: 'lead',
      message: 'Hi! Thanks for reaching out. I\'m definitely interested in learning more about automation. What kind of solutions do you offer?',
      timestamp: '2024-01-15 10:45 AM'
    },
    {
      id: '3',
      type: 'ai',
      message: 'Great to hear! We specialize in workflow automation, customer communication systems, and data integration. Based on your company profile, I think our customer communication automation could save you significant time. Are you currently handling customer inquiries manually?',
      timestamp: '2024-01-15 10:47 AM',
      status: 'read'
    },
    {
      id: '4',
      type: 'lead',
      message: 'Yes, we are! It\'s becoming quite time-consuming as we grow. How does your system work exactly?',
      timestamp: '2024-01-15 11:15 AM'
    },
    {
      id: '5',
      type: 'ai',
      message: 'Perfect! Our AI handles initial customer inquiries, qualifies leads, and can even schedule appointments automatically. It integrates with your existing CRM and can handle multiple communication channels. Would you like to see a demo? I can show you exactly how it would work for your business.',
      timestamp: '2024-01-15 11:18 AM',
      status: 'read'
    },
    {
      id: '6',
      type: 'lead',
      message: 'That sounds exactly like what we need! Yes, I\'d love to see a demo. When would be a good time?',
      timestamp: '2024-01-15 02:30 PM'
    },
    {
      id: '7',
      type: 'ai',
      message: 'Excellent! I have availability this week on Wednesday at 2 PM or Friday at 10 AM. Which works better for you? The demo will take about 30 minutes and I\'ll show you real examples of how other companies like yours have benefited.',
      timestamp: '2024-01-15 02:32 PM',
      status: 'delivered'
    }
  ];

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
              <p className="text-sm text-gray-500">{lead.name} • {lead.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-[70%] ${message.type === 'ai' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'ai'
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-gray-900 text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 px-2 ${
                  message.type === 'ai' ? 'justify-start' : 'justify-end'
                }`}>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                  {message.type === 'ai' && message.status && (
                    <div className="flex items-center gap-1">
                      {getMessageStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              </div>

              {message.type === 'lead' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>{chatMessages.length} messages</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Last message: {lead.lastContact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryModal;