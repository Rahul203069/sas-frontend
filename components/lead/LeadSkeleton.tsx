import React from "react";

export default function LeadSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
        <div className="h-5 w-80 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-slate-200 rounded-2xl h-36 animate-pulse"></div>
        ))}
      </div>

      {/* Search and Filters Row */}
      <div className="flex gap-4">
        <div className="flex-1 bg-slate-200 rounded-2xl h-14 animate-pulse"></div>
        <div className="w-40 bg-slate-200 rounded-2xl h-14 animate-pulse"></div>
      </div>

      {/* Large Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-200 rounded-2xl h-[420px] animate-pulse"></div>
        <div className="bg-slate-200 rounded-2xl h-[420px] animate-pulse"></div>
      </div>

      {/* Bottom Two Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-200 rounded-2xl h-64 animate-pulse"></div>
        <div className="bg-slate-200 rounded-2xl h-64 animate-pulse"></div>
      </div>
    </div>
  );
}