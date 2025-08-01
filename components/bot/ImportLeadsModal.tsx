import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export default function ImportLeadsModal({ isOpen, onClose, bot, onImport }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError("Please select a CSV file");
        return;
      }
      setFile(selectedFile);
      setError("");
      setSuccess(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await onImport(bot, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        resetModal();
      }, 1500);
    } catch (err) {
      setError("Failed to import leads. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      resetModal();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Upload className="w-5 h-5 text-blue-600" />
            Import Leads for {bot?.name}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Upload a CSV file containing your leads data. The file should include columns for name, email, and phone number.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-700">
                Leads imported successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label htmlFor="csv-file" className="text-sm font-semibold text-slate-700">
              Select CSV File
            </Label>
            <div className="relative">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isUploading}
                className="cursor-pointer file:cursor-pointer file:bg-slate-100 file:text-slate-700 file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 hover:file:bg-slate-200 transition-colors"
              />
            </div>
            
            {file && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700 font-medium">{file.name}</span>
                <span className="text-xs text-slate-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Uploading...</span>
                <span className="text-slate-900 font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">CSV Format Requirements:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Include headers: name, email, phone</li>
              <li>• One lead per row</li>
              <li>• Email addresses must be valid</li>
              <li>• Phone numbers should include country code</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isUploading}
            className="hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!file || isUploading || success}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? 'Importing...' : 'Import Leads'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}