"use client"
import React from 'react';
import CSVImport from '@/components/CSVImport';
import Sidebarwrapper from '@/components/Sidebarwrapper';
import IntegrationCard from '@/components/ui/Integrationcard';
import { cn } from '@/lib/utils';
import { Building, Building2, FileSpreadsheet } from 'lucide-react';

function page() {

  const handleIntegrationSelect = (integrationId: string) => {

    console.log(`Selected integration: ${integrationId}`);
  }
  return (
    <Sidebarwrapper>
    <div className="min-h-screen bg-gray-100 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
       
        
        <CSVImport />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IntegrationCard
              id="zillow"
              title="Zillow"
              description="Connect with Zillow's API to sync property data and listings."
              icon={<Building className="h-6 w-5 text-blue-600" />}
              status="inactive"
              onClick={() => handleIntegrationSelect('zillow')}
            />
            <IntegrationCard
              id="hubspot"
              title="HubSpot"
              description="Integrate with HubSpot CRM to sync contacts and deals."
              icon={<Building2 className="h-6 w-5 text-orange-600" />}
              status="inactive"
              onClick={() => handleIntegrationSelect('hubspot')}
            />
            <IntegrationCard
              id="google-sheets"
              title="Google Sheets"
              description="Connect to Google Sheets to import/export data."
              icon={<FileSpreadsheet className="h-6 w-5 text-green-600" />}
              status="inactive"
              onClick={() => handleIntegrationSelect('google-sheets')}
            />
          </div>
      </div>
    </div>
        </Sidebarwrapper>
  );
}

export default page;