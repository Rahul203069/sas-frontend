import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Loader2, CheckCircle, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';
import { User } from 'lucide-react';

export default function LeadInfoPanel({ lead, onLeadUpdate }) {
  const [editableLead, setEditableLead] = useState(lead);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setEditableLead(lead);
  }, [lead]);

  const handleInputChange = (field, value) => {
    setEditableLead(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    
    onLeadUpdate(editableLead);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 1000);
  };

  if (!editableLead) {
    return (
      <div className="w-96 p-6 border-l border-gray-100 bg-white">
        <Skeleton className="h-8 w-3/4 mb-6" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 flex-shrink-0 p-6 border-l border-gray-100 bg-white flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Lead Information</h3>
      <div className="space-y-4 flex-grow">
        <div className="flex-grow p-6 pt-0">
        <div className="space-y-6">
          {/* Name Field */}
          <div className="group">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              Full Name
            </Label>
            <Input
              id="name"
              value={editableLead.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter lead's full name"
              className="h-12 border-2 mt-4 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
          </div>
          
          {/* Property Address Field */}
          <div className="group">
            <Label htmlFor="propertyAddress" className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Property Address
            </Label>
            <Textarea
              id="propertyAddress"
              value={editableLead.propertyAddress || ''}
              onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
              placeholder="Enter complete property address including street, city, state, and zip code"
              className="min-h-[80px] mt-4 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>
      </div>
      <Button onClick={handleSave} disabled={isSaving || saveSuccess} className="w-full mt-4">
        {isSaving ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
        ) : saveSuccess ? (
          <><CheckCircle className="mr-2 h-4 w-4" /> Saved!</>
        ) : (
          <><Save className="mr-2 h-4 w-4" /> Save Changes</>
        )}
      </Button>
    </div>
  );
}