import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border  border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50  hover:bg-gray-50">
              <TableHead   className=" p-2 font-semibold text-gray-700">Lead</TableHead>
              <TableHead className="font-semibold text-gray-700">Contact Info</TableHead>
              <TableHead className="font-semibold text-gray-700">Address</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Last Contacted</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />s
                    <Skeleton className="h-3 w-16" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}