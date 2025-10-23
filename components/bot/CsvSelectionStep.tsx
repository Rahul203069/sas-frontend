//@ts-nocheck
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { FileText, Upload, Calendar, Users, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";











const CsvFile = {
  "name": "CsvFile",
  "type": "object",
  "properties": {
    "filename": {
      "type": "string",
      "description": "Original filename"
    },
    "file_url": {
      "type": "string",
      "description": "URL of the uploaded file"
    },
    "upload_date": {
      "type": "string",
      "format": "date-time",
      "description": "When the file was uploaded"
    },
    "row_count": {
      "type": "number",
      "description": "Number of rows in the CSV"
    },
    "headers": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "CSV column headers"
    }
  },
  "required": [
    "filename",
    "file_url"
  ]
}





export default function CsvSelectionStep({ selectedCsv, onCsvSelect, onUploadNew }) {
  const [csvFiles, setCsvFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCsvFiles();
  }, []);

  const loadCsvFiles = async () => {
    try {
      const files = await CsvFile.list('-upload_date', 10);
      setCsvFiles(files);
    } catch (error) {
      console.error('Error loading CSV files:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockCsvFiles = csvFiles.length > 0 ? csvFiles : [
    {
      id: 1,
      filename: "qualified_leads_2024.csv",
      upload_date: "2024-01-15T10:30:00Z",
      row_count: 1250,
      headers: ["name", "email", "company", "phone", "source"]
    },
    {
      id: 2,
      filename: "prospects_database.csv",
      upload_date: "2024-01-10T14:20:00Z",
      row_count: 850,
      headers: ["name", "email", "industry", "company_size", "budget"]
    },
    {
      id: 3,
      filename: "webinar_attendees.csv",
      upload_date: "2024-01-08T09:15:00Z",
      row_count: 420,
      headers: ["name", "email", "job_title", "company", "attended"]
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Select Data Source</h3>
        <p className="text-sm text-slate-500">Choose a CSV file for your bot.</p>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-slate-900">Available Files</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={onUploadNew}
          className="flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          Upload New Leads
        </Button>
      </div>

      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 -mr-2">
        {mockCsvFiles.length > 0 ? (
          mockCsvFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedCsv?.id === file.id 
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => onCsvSelect(file)}
              >
                <div className="mr-3">
                  {selectedCsv?.id === file.id ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-800">{file.filename}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(file.upload_date), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {file.row_count.toLocaleString()} leads
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-lg">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-700">No CSV Files Found</h4>
            <p className="text-sm text-slate-500">Click "Upload New Leads" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}