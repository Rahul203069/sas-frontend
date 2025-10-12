import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, SortAsc } from "lucide-react";

export default function FilterBar({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  sortBy,
  setSortBy 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search leads by name, email, or phone..."
            value={searchQuery}
            onChange={(e) =>{ console.log(e.target.value);  setSearchQuery(e.target.value)}}
            className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 border-gray-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="All Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="hot">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Hot Leads
                </div>
              </SelectItem>
              <SelectItem value="warm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Warm Leads
                </div>
              </SelectItem>
              <SelectItem value="cold">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Cold Leads
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="w-full lg:w-56">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-11 border-gray-200">
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-last_contacted">Last Contacted (Newest)</SelectItem>
              <SelectItem value="last_contacted">Last Contacted (Oldest)</SelectItem>
              <SelectItem value="-created_date">Recently Added</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="-name">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}