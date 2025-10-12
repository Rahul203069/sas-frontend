"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Loader2, Upload } from "lucide-react";
import { useRef } from "react";
import leadsData from "@/lib/utils";
import  FilterBar from "@/components/lead/FilterBar"
import LeadsTable from "@/components/lead/LeadsTable"
import TableSkeleton from "@/components/lead/TableSkeleton"
import Pagination from "@/components/lead/Pagination";
import ChatHistoryModal from "@/components/ChatHistoryModal";
import AISummaryModal from "@/components/AISummaryModal";

import InfoDialog from "@/components/lead/InfoDialog";

import StatsCard from "@/components/bot/StatsCard";
import StatsCads from "@/components/lead/StatusCad";
import { set } from "date-fns";
import Sidebarwrapper from "@/components/Sidebarwrapper";
import LeadSkeleton from "@/components/lead/LeadSkeleton";
import { getLeads } from "../action";
import { all } from "axios";


const ITEMS_PER_PAGE = 10;

export default function LeadsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-last_contacted");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [pagination, setpagination] = useState(null)
  const [leadsCount, setleadsCount] = useState(null)
  const [selectedLeadForChat, setSelectedLeadForChat] = useState(null);
  const [selectedLeadForAI, setSelectedLeadForAI] = useState(null);
  const [selectedLeadForInfo, setSelectedLeadForInfo] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

const [allLeads, setAllLeads] = useState([]);
const [isLoading, setIsLoading] = useState(true);

  const isFirstRender = useRef(true);






useEffect(() => {

 if (isFirstRender.current) {
      isFirstRender.current = false; // skip first run
      return;
    }

    setCurrentPage(1);

 setIsFiltering(true)
  

getLeads({ sortby:sortBy,filterby:statusFilter,search:searchQuery,page:currentPage}).then((res)=>{
if(res.success){
console.log(res)
  setAllLeads(res.data);

  setpagination(res.pagination); 


  setIsFiltering(false);
}


})

 
}, [searchQuery, statusFilter, sortBy,currentPage]);




 useEffect(() => {
  
   if (isFirstRender.current) {
        isFirstRender.current = false; // skip first run
        return;
      }
  
  
   setIsLoading(true)
    
  
  getLeads({ sortby:sortBy,filterby:statusFilter,search:searchQuery,page:currentPage}).then((res)=>{



  if(res.success){
  console.log(res)

  
   setpagination(res.pagination); 
setleadsCount(res.leadstatusCounts
)
    setAllLeads(res.data);
    setIsLoading(false);
  }
  
  
  })
  
   
  }, []);
    
    

  // Simulate loading when filters change
  
  // const filteredAndSortedLeads = useMemo(() => {
  //   let filtered = [...allLeads];

  //   if (searchQuery) {
  //     const query = searchQuery.toLowerCase();
  //     filtered = filtered.filter(lead => 
  //       lead.name?.toLowerCase().includes(query) ||
  //       lead.email?.toLowerCase().includes(query) ||
  //       lead.phone?.toLowerCase().includes(query) ||
  //       lead.company?.toLowerCase().includes(query)
  //     );
  //   }

  //   if (statusFilter !== "all") {
  //     filtered = filtered.filter(lead => lead.status === statusFilter);
  //   }

  //   return filtered;
  // }, [allLeads, searchQuery, statusFilter]);



  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImportClick = () => {
    setIsRedirecting(true);
    router.push('/csv-upload/2b805b86-1f5c-404e-8263-b0f3617054a2');
  };

  if (isLoading) {
    return (
      <Sidebarwrapper>

      <LeadSkeleton></LeadSkeleton>
      </Sidebarwrapper>
    );
  }

  return (
    <Sidebarwrapper>

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Leads</h1>
            <p className="text-gray-600 text-lg">Manage and track your sales leads</p>
          </div>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            disabled={isRedirecting}
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Import Leads
              </>
            )}
          </button>
        </div>

        {/* Stats Cards */}
      <StatsCads leads={leadsCount} ></StatsCads>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Leads Table with Skeleton Loading */}
        {isFiltering ? (
          <TableSkeleton />
        ) : allLeads.length > 0 ? (
          <>
            <LeadsTable
              leads={allLeads}
              onViewChat={setSelectedLeadForChat}
              onViewAISummary={setSelectedLeadForAI}
              onViewInfo={setSelectedLeadForInfo}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                                            
                      


               <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={pagination.totalCount}
                itemsPerPage={ITEMS_PER_PAGE}
                               />

                                                                 
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters or search query"
                  : "Start by adding your first lead"}
              </p>
            </div>
          </div>
        )}

        {/* Dialogs */}

        {selectedLeadForChat &&
        
        <ChatHistoryModal
        onClose={() => setSelectedLeadForChat(null)}
        lead={selectedLeadForChat}
        />

      }
        {selectedLeadForAI&& <AISummaryModal
         
          onClose={() => setSelectedLeadForAI(null)}
          lead={selectedLeadForAI}
        />}
        

        {selectedLeadForInfo&&
        <InfoDialog
       isOpen={true}
        onClose={() => setSelectedLeadForInfo(
          null)}
          lead={selectedLeadForInfo}
          />
        }
      </div>
 
    </div>
 
 </Sidebarwrapper>
  );
}