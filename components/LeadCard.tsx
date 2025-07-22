import React, { useState } from 'react';
import { MessageCircle, Phone, Calendar, TrendingUp, Eye, FileText, Star, Clock, MoreHorizontal, ExternalLink, Zap, Target, Mail } from 'lucide-react';
import { Lead } from '../type/lead';

interface LeadCardProps {
  lead: Lead;
  onViewChat: (leadId: string) => void;
  onViewSummary: (leadId: string) => void;
  onBookCall: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onViewChat, onViewSummary, onBookCall }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'hot':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-red-600',
          text: 'text-white',
          icon: <Zap className="w-3 h-3" />,
          border: 'border-red-200',
          glow: 'shadow-red-100'
        };
      case 'warm':
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
          text: 'text-white',
          icon: <Target className="w-3 h-3" />,
          border: 'border-amber-200',
          glow: 'shadow-amber-100'
        };
      case 'cold':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          text: 'text-white',
          icon: <Clock className="w-3 h-3" />,
          border: 'border-blue-200',
          glow: 'shadow-blue-100'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          text: 'text-white',
          icon: null,
          border: 'border-gray-200',
          glow: 'shadow-gray-100'
        };
    }
  };

  const getScoreConfig = (score: number) => {
    if (score >= 80) return {
      color: 'text-red-600',
      bg: 'bg-red-50',
      ring: 'ring-red-100'
    };
    if (score >= 60) return {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      ring: 'ring-amber-100'
    };
    return {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      ring: 'ring-blue-100'
    };
  };

  const statusConfig = getStatusConfig(lead.status);
  const scoreConfig = getScoreConfig(lead.score);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowActions(false);
    if (showActions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showActions]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {/* Status indicator line */}
      <div className={`h-1 ${statusConfig.bg}`} />
      
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Enhanced Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-gray-700">
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusConfig.bg} rounded-full border-2 border-white flex items-center justify-center`}>
                {statusConfig.icon}
              </div>
            </div>

            {/* Lead Information */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold text-gray-900 truncate">{lead.name}</h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} shadow-sm`}>
                  {statusConfig.icon}
                  {lead.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="font-medium">{lead.company}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>Last contact: {lead.lastContact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 ml-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewChat(lead.id);
              }}
              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-105"
              title="View Chat"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewSummary(lead.id);
              }}
              className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 opacity-100 hover:scale-105"
              title="View Summary"
            >
              <FileText className="w-4 h-4" />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onBookCall(lead.id);
              }}
              className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-105"
              title="Book Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            
            <div className="relative">
              <button 
                onClick={handleActionClick}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        onViewChat(lead.id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      View Chat History
                    </button>
                    <button 
                      onClick={() => {
                        onViewSummary(lead.id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-purple-500" />
                      View AI Summary
                    </button>
                    <button 
                      onClick={() => {
                        onBookCall(lead.id);
                        setShowActions(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-green-500" />
                      Schedule Call
                    </button>
                    <hr className="border-gray-100 my-1" />
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                      View Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className={`${scoreConfig.bg} ${scoreConfig.ring} ring-1 rounded-lg p-3 text-center transition-all group-hover:scale-[1.02]`}>
            <div className={`text-lg font-bold ${scoreConfig.color}`}>{lead.score}</div>
            <div className="text-xs text-gray-600 font-medium">Lead Score</div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 ring-1 ring-indigo-100 rounded-lg p-3 text-center transition-all group-hover:scale-[1.02]">
            <div className="text-lg font-bold text-indigo-700">{lead.interestLevel}%</div>
            <div className="text-xs text-gray-600 font-medium">Interest</div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 ring-1 ring-slate-100 rounded-lg p-3 text-center transition-all group-hover:scale-[1.02]">
            <div className="text-lg font-bold text-slate-700">{lead.messageCount}</div>
            <div className="text-xs text-gray-600 font-medium">Messages</div>
          </div>
        </div>

        {/* Notes Section */}
        {lead.notes && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Notes</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{lead.notes}</p>
          </div>
        )}
      </div>

      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
    </div>
  );
};

export default LeadCard;