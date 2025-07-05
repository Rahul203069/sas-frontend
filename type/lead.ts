export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'hot' | 'warm' | 'cold';
  score: number;
  interestLevel: number;
  messageCount: number;
  lastContact: string;
  source: string;
  notes: string;
}