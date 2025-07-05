import React, { useState } from 'react';
import { MessageCircle, Phone, Calendar, TrendingUp, Eye, FileText, Star, Clock, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Lead } from '../types/lead';

interface LeadCardProps {
  lead: Lead;
  onViewChat: (leadId: string) => void;
  onViewSummary: (leadId: string) => void;
  onBookCall: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onViewChat, onViewSummary, onBookCall }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warm':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cold':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <TrendingUp className="w-3 h-3" />;
      case 'warm':
        return <Star className="w-3 h-3" />;
      case 'cold':
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white border border-gray-200/60 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {lead.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>

            {/* Lead Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">{lead.name}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                  {getStatusIcon(lead.status)}
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{lead.email}</span>
                <span>•</span>
                <span>{lead.company}</span>
                <span>•</span>
                <span>{lead.lastContact}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="hidden md:flex items-center gap-6 text-xs">
              <div className="text-center">
                <div className={`font-semibold ${getScoreColor(lead.score)}`}>{lead.score}</div>
                <div className="text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{lead.interestLevel}%</div>
                <div className="text-gray-500">Interest</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">{lead.messageCount}</div>
                <div className="text-gray-500">Messages</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onViewChat(lead.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="View Chat"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onViewSummary(lead.id)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="View Summary"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onBookCall(lead.id)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Book Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowActions(!showActions)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        onViewChat(lead.id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <MessageCircle className="w-4 h-4" />
                      View Chat History
                    </button>
                    <button 
                      onClick={() => {
                        onViewSummary(lead.id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FileText className="w-4 h-4" />
                      View AI Summary
                    </button>
                    <button 
                      onClick={() => {
                        onBookCall(lead.id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Phone className="w-4 h-4" />
                      Schedule Call
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <ExternalLink className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Metrics */}
        <div className="md:hidden mt-4 flex items-center gap-6 text-xs">
          <div className="text-center">
            <div className={`font-semibold ${getScoreColor(lead.score)}`}>{lead.score}</div>
            <div className="text-gray-500">Score</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{lead.interestLevel}%</div>
            <div className="text-gray-500">Interest</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{lead.messageCount}</div>
            <div className="text-gray-500">Messages</div>
          </div>
        </div>

        {/* Notes Preview */}
        {lead.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2">{lead.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;