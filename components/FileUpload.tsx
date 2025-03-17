
"use client"
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Upload, CheckCircle, XCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { useSession } from 'next-auth/react';
interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

type Status = 'idle' | 'uploading' | 'success' | 'error';

export function FileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
const { data: session } = useSession();
const [user, setuser] = useState(session?.user)
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setStatus('error');
      setErrorMessage('File size exceeds 10MB limit');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setStatus('error');
      setErrorMessage('Only CSV files are accepted');
      return;
    }

    setStatus('uploading');
    setUploadProgress(0);

    // Function to upload file using axios
    const uploadFile = async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', session?.user?.id || '');

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        };

        await axios.post('http://localhost:4000/upload-csv', formData, config);
        setStatus('success');
    
      } catch (error: any) {
        setStatus('error');

        setErrorMessage(error.response?.data?.message || 'An error occurred during file upload');
      }
    };

    uploadFile();
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      {session ? JSON.stringify(session.user) : 'No session available'}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 
          ${isDragActive 
            ? 'upload-zone-active border-blue-400 bg-blue-50/50 shadow-lg transform scale-102' 
            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50/50'
          } backdrop-blur-sm bg-white/70`}
        role="button"
        aria-label="Upload CSV file"
      >
        <input {...getInputProps()} aria-label="File input" />

        <div className={`relative mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full 
          ${isDragActive ? 'bg-blue-100' : 'bg-gray-50'} 
          transition-colors duration-300`}>
          <Upload
            className={`transition-all duration-300 ${
              isDragActive ? 'text-blue-500 scale-110' : 'text-gray-400'
            }`}
            size={32}
          />
        </div>

        <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
          isDragActive ? 'text-blue-600' : 'text-gray-700'
        }`}>
          {isDragActive ? 'Drop your CSV file here' : 'Upload CSV File'}
        </h3>
        
        <p className="text-sm text-gray-500 mb-3">
          Drag & drop your file here, or click to select
        </p>
        
        <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
          <span className="flex items-center">
            <FileSpreadsheet size={14} className="mr-1" />
            CSV only
          </span>
          <span>•</span>
          <span>Max 10MB</span>
        </div>

        {status === 'uploading' && (
          <div className="mt-6">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-3 font-medium">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="mt-6 p-4 bg-green-50/50 backdrop-blur-sm rounded-xl border border-green-100 flex items-center text-green-700 transform animate-fade-in">
          <CheckCircle className="mr-3 text-green-500" size={20} />
          <span className="font-medium">File uploaded successfully!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-50/50 backdrop-blur-sm rounded-xl border border-red-100 flex items-center text-red-700 transform animate-fade-in">
          <AlertCircle className="mr-3 text-red-500" size={20} />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
