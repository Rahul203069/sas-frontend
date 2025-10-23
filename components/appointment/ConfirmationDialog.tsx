import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from '../ui/button';

export default function ConfirmCompleteDialog({ 
  setrender, 
  appointment, 
  isOpen, 
  onClose, 
  onConfirm, 
  isProcessing 
}) {
  if (!appointment) return null;

  // Format date and time from scheduledAt
  const scheduledDate = new Date(appointment.scheduledAt);
  const formattedDate = format(scheduledDate, 'MMM dd, yyyy');
  const formattedTime = format(scheduledDate, 'hh:mm a');

  // Get lead data
  const leadName = appointment.lead?.name || 'Unknown Client';
  const leadAddress = appointment.lead?.address || 'No address provided';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-xl">Mark as Completed?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Are you sure you want to mark this appointment as completed?
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900 mb-1">{leadName}</p>
              <p className="text-sm text-gray-600">
                {formattedDate} at {formattedTime}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Property: {leadAddress}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Duration: {appointment.duration} minutes
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? 'Marking...' : 'Yes, Mark as Completed'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}