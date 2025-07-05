"use client";
import React, { useState, useMemo } from 'react';
import { Bot, Bell, Settings, User, Users } from 'lucide-react';
import LeadCard from '@/components/LeadCard';
import LeadFilters from '@/components/LeadFilters';
import StatsOverview from '@/components/StatsOverview';
import ChatHistoryModal from '@/components/ChatHistoryModal';
import AISummaryModal from '@/components/AISummaryModal';
import { mockLeads } from '@/data/mockLeads';
import { Lead } from '@/type/lead';
import Sidebarwrapper from '@/components/Sidebarwrapper';
function page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [selectedLeadForChat, setSelectedLeadForChat] = useState<Lead | null>(null);
  const [selectedLeadForSummary, setSelectedLeadForSummary] = useState<Lead | null>(null);

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = mockLeads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'interestLevel':
          return b.interestLevel - a.interestLevel;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastContact':
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const totalLeads = mockLeads.length;
    const hotLeads = mockLeads.filter(lead => lead.status === 'hot').length;
    const warmLeads = mockLeads.filter(lead => lead.status === 'warm').length;
    const coldLeads = mockLeads.filter(lead => lead.status === 'cold').length;
    const totalMessages = mockLeads.reduce((sum, lead) => sum + lead.messageCount, 0);
    const callsBooked = Math.floor(hotLeads * 0.7 + warmLeads * 0.3);

    return { totalLeads, hotLeads, warmLeads, coldLeads, totalMessages, callsBooked };
  }, []);

  const handleViewChat = (leadId: string) => {
    const lead = mockLeads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLeadForChat(lead);
    }
  };

  const handleViewSummary = (leadId: string) => {
    const lead = mockLeads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLeadForSummary(lead);
    }
  };

  const handleBookCall = (leadId: string) => {
    console.log(`Booking call for lead ${leadId}`);
  };

  return (
    <Sidebarwrapper>

    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Leads</h1>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-gray-600">Leads management page coming soon...</p>
      </div>
    </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview {...stats} />

        {/* Filters */}
        <LeadFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Leads List */}
        <div className="space-y-3">
          {filteredAndSortedLeads.map((lead) => (
            <LeadCard
            key={lead.id}
            lead={lead}
            onViewChat={handleViewChat}
            onViewSummary={handleViewSummary}
            onBookCall={handleBookCall}
            />
          ))}
        </div>

        {filteredAndSortedLeads.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedLeadForChat && (
        <ChatHistoryModal
        lead={selectedLeadForChat}
          onClose={() => setSelectedLeadForChat(null)}
          />
        )}

      {selectedLeadForSummary && (
        <AISummaryModal
        lead={selectedLeadForSummary}
        onClose={() => setSelectedLeadForSummary(null)}
        />
      )}
    </div>
      </Sidebarwrapper>
  );
}

export default page;