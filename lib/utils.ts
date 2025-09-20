
import { PrismaClient } from '@prisma/client';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export function extractSlotAndMessage(input: string): { selectedSlot: string | null; message: string | null } {
    // Extract the selected slot using regex
    const slotMatch = input.match(/<selected_slot>(.*?)<\/selected_slot>/);
    const messageMatch = input.match(/<message>([\s\S]*?)<\/message>/);

    const selectedSlot: string | null = slotMatch ? slotMatch[1].trim() : null;
    const message: string | null = messageMatch ? messageMatch[1].trim() : null;

    return {
        selectedSlot,
        message
    };
}


