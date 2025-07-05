import React from 'react';
import { X, Brain, TrendingUp, MessageCircle, Calendar, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { Lead } from '../type/lead';

interface AISummaryModalProps {
  lead: Lead;
  onClose: () => void;
}

interface AISummary {
  overallAssessment: string;
  keyInsights: string[];
  interestSignals: string[];
  concerns: string[];
  nextSteps: string[];
  recommendedActions: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    reasoning: string;
  }[];
}

const AISummaryModal: React.FC<AISummaryModalProps> = ({ lead, onClose }) => {
  // Mock AI summary data - in real app this would come from API
  const aiSummary: AISummary = {
    overallAssessment: `${lead.name} shows strong interest in automation solutions and appears to be a qualified decision-maker at ${lead.company}. The conversation indicates genuine pain points around manual processes and a clear budget for solutions. High likelihood of conversion with proper follow-up.`,
    keyInsights: [
      'Currently handling customer inquiries manually, causing time constraints',
      'Company is in growth phase and actively seeking efficiency improvements',
      'Has decision-making authority and mentions budget availability',
      'Responds quickly and asks detailed technical questions',
      'Shows understanding of ROI and business impact'
    ],
    interestSignals: [
      'Explicitly stated "That sounds exactly like what we need"',
      'Asked for a demo without hesitation',
      'Inquired about technical implementation details',
      'Mentioned current pain points multiple times',
      'Responded within hours to messages'
    ],
    concerns: [
      'May need to involve team members in final decision',
      'Could be comparing with competitors',
      'Timeline for implementation not yet discussed'
    ],
    nextSteps: [
      'Schedule and conduct product demo',
      'Prepare case studies from similar companies',
      'Discuss pricing and implementation timeline',
      'Identify other stakeholders in decision process'
    ],
    recommendedActions: [
      {
        priority: 'high',
        action: 'Schedule demo within 48 hours',
        reasoning: 'Lead is highly engaged and ready to see the product. Strike while interest is hot.'
      },
      {
        priority: 'high',
        action: 'Prepare customized demo focusing on customer communication automation',
        reasoning: 'Lead specifically mentioned this as their main pain point.'
      },
      {
        priority: 'medium',
        action: 'Research their current tech stack and integrations',
        reasoning: 'Understanding their existing tools will help position our solution better.'
      },
      {
        priority: 'medium',
        action: 'Prepare ROI calculator and case studies',
        reasoning: 'Lead seems business-focused and will appreciate concrete numbers.'
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Target className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
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
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Summary</h2>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overall Assessment */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Overall Assessment
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{aiSummary.overallAssessment}</p>
          </div>

          {/* Key Insights */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Insights</h3>
            <div className="space-y-2">
              {aiSummary.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interest Signals & Concerns */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Interest Signals
              </h3>
              <div className="space-y-2">
                {aiSummary.interestSignals.map((signal, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-green-800">{signal}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Potential Concerns
              </h3>
              <div className="space-y-2">
                {aiSummary.concerns.map((concern, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-amber-800">{concern}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Recommended Actions
            </h3>
            <div className="space-y-3">
              {aiSummary.recommendedActions.map((action, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                      {getPriorityIcon(action.priority)}
                      {action.priority.charAt(0).toUpperCase() + action.priority.slice(1)} Priority
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{action.action}</h4>
                  <p className="text-sm text-gray-600">{action.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              Suggested Next Steps
            </h3>
            <div className="space-y-2">
              {aiSummary.nextSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>AI Analysis completed</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>Based on {lead.messageCount} messages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummaryModal;