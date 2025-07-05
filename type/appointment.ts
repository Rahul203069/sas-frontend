export interface ChatMessage {
  id: string;
  timestamp: string;
  sender: 'lead' | 'bot';
  message: string;
}

export interface Appointment {
  id: string;
  leadName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  service: string;
  chatSummary: string;
  leadSource: string;
  notes?: string;
  location?: string;
  meetingLink?: string;
  chatHistory: ChatMessage[];
}