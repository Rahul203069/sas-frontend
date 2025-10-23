import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Home, MapPin, Mail, Phone, User, Hash, Bed, Bath, Maximize, Calendar, Grid, Car } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function InfoDialog({ appointment, isOpen, onClose }) {

  // --- START: DUMMY DATA FALLBACK ---
  const dummyData = {
    property_type: "House",
    full_name: "Johnathan Doe",
    client_name: "John D.",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, USA",
    property_address: "123 Main St",
    zip_code: "12345",
    property_zip: "12345",
    bedrooms: 4,
    bathrooms: 2.5,
    square_footage: 2200,
    year_built: 1995,
    lot_size: "0.25 acres (10,890 sq ft)",
    garage_count: 2,
  };

  // Use the real 'appointment' data, but fill in any missing keys with dummy data.
  // If 'appointment' is null/undefined, 'data' will just be the dummyData.
  const data = { ...dummyData, ...appointment };
  // --- END: DUMMY DATA FALLBACK ---


  // We no longer need this, as 'data' will always be populated
  // if (!appointment) return null; 

  const propertyTypeColors = {
    house: "bg-blue-50 text-blue-700 border-blue-200",
    apartment: "bg-purple-50 text-purple-700 border-purple-200",
    condo: "bg-green-50 text-green-700 border-green-200",
    villa: "bg-orange-50 text-orange-700 border-orange-200",
    land: "bg-amber-50 text-amber-700 border-amber-200",
    commercial: "bg-indigo-50 text-indigo-700 border-indigo-200",
    other: "bg-gray-50 text-gray-700 border-gray-200"
  };

  // Helper to safely get the color class, defaulting to 'other'
  const getPropertyTypeColor = (type) => {
    const key = type ? type.toLowerCase() : 'other';
    return propertyTypeColors[key] || propertyTypeColors['other'];
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
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Details</h3>
              <p className="text-sm text-gray-500">Complete property and owner information</p>
            </div>
            {data.property_type && (
              <Badge className={`${getPropertyTypeColor(data.property_type)} border font-medium`}>
                {data.property_type}
              </Badge>
            )}
          </div>

          <Separator />

          {/* Contact Information Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Full Name</p>
                  <p className="text-sm text-gray-900">
                    {data.full_name || data.client_name || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email Address</p>
                  <p className="text-sm text-gray-900">
                    {data.email || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 rounded-lg mt-0.5">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Phone Number</p>
                  <p className="text-sm text-gray-900">
                    {data.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg mt-0.5">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Address</p>
                  <p className="text-sm text-gray-900">
                    {data.address || data.property_address || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-lg mt-0.5">
                  <Hash className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Property Zip Code</p>
                  <p className="text-sm text-gray-900">
                    {data.zip_code || data.property_zip || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Specifications Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Property Specifications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg mt-0.5">
                  <Bed className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Bedrooms</p>
                  <p className="text-sm text-gray-900">
                    {data.bedrooms ? `${data.bedrooms}` : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-50 rounded-lg mt-0.5">
                  <Bath className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Bathrooms</p>
                  <p className="text-sm text-gray-900">
                    {data.bathrooms ? `${data.bathrooms}` : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                  <Maximize className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Square Footage</p>
                  <p className="text-sm text-gray-900">
                    {data.square_footage ? `${data.square_footage.toLocaleString()} sq ft` : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Property Type</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {data.property_type || 'Not specified'}
                  </p>
                </div>
              </div>

  
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 rounded-lg mt-0.5">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Year Built</p>
                  <p className="text-sm text-gray-900">
                    {data.year_built || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-50 rounded-lg mt-0.5">
                  <Grid className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Lot Size</p>
                  <p className="text-sm text-gray-900">
                    {data.lot_size || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg mt-0.5">
                  <Car className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Garage Count</p>
                  <p className="text-sm text-gray-900">
                    {data.garage_count ? `${data.garage_count} car${data.garage_count > 1 ? 's' : ''}` : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}