import React from 'react';
import { FileUpload } from '@/components/FileUpload';

function page() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <FileUpload  />
      </div>
    </div>
  );
}

export default page;