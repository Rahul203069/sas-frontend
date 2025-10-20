import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, DollarSign, Maximize, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PropertyInfoModal({ appointment, isOpen, onClose }) {
  if (!appointment) return null;

  const propertyTypeColors = {
    house: "bg-blue-50 text-blue-700 border-blue-200",
    apartment: "bg-purple-50 text-purple-700 border-purple-200",
    condo: "bg-green-50 text-green-700 border-green-200",
    villa: "bg-orange-50 text-orange-700 border-orange-200",
    land: "bg-amber-50 text-amber-700 border-amber-200",
    commercial: "bg-indigo-50 text-indigo-700 border-indigo-200",
    other: "bg-gray-50 text-gray-700 border-gray-200"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Home className="w-6 h-6 text-blue-600" />
            Property Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{appointment.client_name}'s Property</h3>
              <p className="text-sm text-gray-500">Property details for upcoming call</p>
            </div>
            {appointment.property_type && (
              <Badge className={`${propertyTypeColors[appointment.property_type]} border font-medium`}>
                {appointment.property_type}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Address</p>
                  <p className="text-sm text-gray-900">
                    {appointment.property_address || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg mt-0.5">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Expected Price</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {appointment.property_price 
                      ? `$${appointment.property_price.toLocaleString()}` 
                      : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                  <Maximize className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Size</p>
                  <p className="text-sm text-gray-900">
                    {appointment.property_size || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg mt-0.5">
                  <Home className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Property Type</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {appointment.property_type || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {appointment.property_details && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg mt-0.5">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Additional Details</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {appointment.property_details}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}