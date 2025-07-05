import { Appointment } from '../types/appointment';

const services = [
  'Marketing Consultation',
  'Sales Automation Demo',
  'Enterprise Solutions',
  'Startup Package',
  'Digital Marketing Automation',
  'E-commerce Integration',
  'Lead Generation Strategy',
  'CRM Implementation',
  'Social Media Automation',
  'Email Marketing Setup'
];

const leadSources = [
  'LinkedIn',
  'Website',
  'Referral',
  'Social Media',
  'Google Ads',
  'Facebook',
  'Email Campaign',
  'Cold Outreach',
  'Webinar',
  'Content Marketing'
];

const statuses: Array<'confirmed' | 'pending' | 'cancelled' | 'completed'> = [
  'confirmed',
  'pending',
  'cancelled',
  'completed'
];

const firstNames = [
  'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'James',
  'Maria', 'John', 'Ashley', 'Christopher', 'Jessica', 'Matthew', 'Amanda',
  'Daniel', 'Stephanie', 'Anthony', 'Melissa', 'Mark', 'Deborah', 'Steven',
  'Rachel', 'Kenneth', 'Carolyn', 'Paul', 'Janet', 'Joshua', 'Catherine',
  'Kevin', 'Frances', 'Brian', 'Christine', 'George', 'Samantha', 'Edward',
  'Debra', 'Ronald', 'Rachel', 'Timothy', 'Carolyn', 'Jason', 'Janet'
];

const lastNames = [
  'Johnson', 'Chen', 'Rodriguez', 'Park', 'Thompson', 'Kim', 'Williams',
  'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson',
  'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Martinez',
  'Robinson', 'Clark', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young',
  'Hernandez', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green', 'Adams',
  'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts'
];

const chatSummaries = [
  'Interested in lead generation for real estate business. Currently spending $2k/month on ads with poor ROI. Looking for automated lead nurturing solution.',
  'SaaS founder looking to automate outreach for B2B sales. Mentioned difficulty in personalizing messages at scale. Team of 8 salespeople.',
  'Consulting firm wanting to implement AI chatbots for client onboarding. Handles 500+ clients monthly. Interested in custom integration.',
  'Early-stage startup founder. Interested in affordable automation tools. Budget constraint mentioned - looking for basic package.',
  'Marketing agency owner looking to streamline client reporting and campaign management. Handles 20+ clients with manual processes.',
  'E-commerce store owner with high cart abandonment rates. Interested in automated email sequences and customer recovery.',
  'Small business owner struggling with manual follow-up processes. Wants to automate customer communication and scheduling.',
  'Enterprise client looking for comprehensive CRM solution. Multiple departments need integration with existing systems.',
  'Digital marketing consultant seeking tools to manage multiple client campaigns efficiently. Time management is key concern.',
  'Restaurant chain owner interested in automated customer feedback collection and response system.'
];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateRandomTime(): string {
  const hours = Math.floor(Math.random() * 12) + 9; // 9 AM to 8 PM
  const minutes = Math.random() < 0.5 ? '00' : '30';
  const ampm = hours < 12 ? 'AM' : 'PM';
  const displayHour = hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes} ${ampm}`;
}

function generateChatHistory(leadName: string): any[] {
  const messageCount = Math.floor(Math.random() * 6) + 3; // 3-8 messages
  const messages = [];
  
  for (let i = 0; i < messageCount; i++) {
    messages.push({
      id: (i + 1).toString(),
      timestamp: `2025-01-${10 + Math.floor(Math.random() * 5)} ${Math.floor(Math.random() * 12) + 9}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      sender: i % 2 === 0 ? 'bot' : 'lead',
      message: i === 0 
        ? `Hi ${leadName.split(' ')[0]}! Thanks for your interest in our services. How can we help you today?`
        : i % 2 === 0 
          ? 'That sounds like a great opportunity! Would you like to schedule a call to discuss this further?'
          : 'Yes, I\'d be very interested in learning more about your solutions.'
    });
  }
  
  return messages;
}

export function generateMockAppointments(count: number): Appointment[] {
  const appointments: Appointment[] = [];
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // Next 30 days
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const leadName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${Math.random() < 0.5 ? 'company' : 'business'}.com`;
    const phone = `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    appointments.push({
      id: i.toString(),
      leadName,
      email,
      phone,
      date: generateRandomDate(startDate, endDate),
      time: generateRandomTime(),
      duration: [30, 45, 60][Math.floor(Math.random() * 3)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      service: services[Math.floor(Math.random() * services.length)],
      chatSummary: chatSummaries[Math.floor(Math.random() * chatSummaries.length)],
      leadSource: leadSources[Math.floor(Math.random() * leadSources.length)],
      location: Math.random() < 0.7 ? 'Virtual' : 'In-person',
      meetingLink: Math.random() < 0.8 ? 'https://meet.example.com/abc123' : undefined,
      notes: Math.random() < 0.3 ? 'Follow up on technical requirements and pricing discussion.' : undefined,
      chatHistory: generateChatHistory(leadName)
    });
  }
  
  return appointments;
}