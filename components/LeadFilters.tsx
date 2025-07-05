import React from 'react';
import { Search, SortDesc } from 'lucide-react';

interface LeadFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50/50 focus:bg-white transition-all"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
            >
              <option value="all">All</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <SortDesc className="w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
            >
              <option value="score">Score</option>
              <option value="lastContact">Last Contact</option>
              <option value="interestLevel">Interest Level</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadFilters;