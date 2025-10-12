
import { PrismaClient } from '@prisma/client';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}







const leadsData = [
  {
    id: 1,
    name: "Robert Taylor",
    company: "Pro Consulting Group",
    phone: "+1 (555) 678-9012",
    email: "rob.t@consulting.pro",
    address: "987 Consultant Dr, Boston, MA 02101",
    status: "Hot",
    date: "Jan 14, 2025",
    time: "10:00 PM",
    avatar: "R",
    avatarColor: "#5B7EE5"
  },
  {
    id: 2,
    name: "Daniel Wilson",
    company: "Logistics Hub",
    phone: "+1 (555) 234-8765",
    email: "dan.w@logistics.hub",
    address: "963 Supply Chain St, Dallas, TX 75201",
    status: "Hot",
    date: "Jan 14, 2025",
    time: "8:30 PM",
    avatar: "D",
    avatarColor: "#5B7EE5"
  },
  {
    id: 3,
    name: "Amanda Brown",
    company: "HealthTech AI",
    phone: "+1 (555) 901-2345",
    email: "amanda.b@healthtech.ai",
    address: "369 Health Innovation Rd, Denver, CO 80201",
    status: "Hot",
    date: "Jan 14, 2025",
    time: "4:30 PM",
    avatar: "A",
    avatarColor: "#5B7EE5"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    company: "TechCorp Inc",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@techcorp.com",
    address: "123 Tech Street, San Francisco, CA 94102",
    status: "Hot",
    date: "Jan 14, 2025",
    time: "4:00 PM",
    avatar: "S",
    avatarColor: "#5B7EE5"
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    company: "Design Studio Pro",
    phone: "+1 (555) 345-6789",
    email: "emily.r@design.studio",
    address: "789 Creative Blvd, New York, NY 10001",
    status: "Hot",
    date: "Jan 14, 2025",
    time: "2:30 PM",
    avatar: "E",
    avatarColor: "#5B7EE5"
  },
  {
    id: 6,
    name: "Michael Chen",
    company: "StartupIO",
    phone: "+1 (555) 234-5678",
    email: "m.chen@startup.io",
    address: "456 Innovation Ave, Austin, TX 78701",
    status: "Warm",
    date: "Jan 13, 2025",
    time: "7:45 PM",
    avatar: "M",
    avatarColor: "#5B7EE5"
  },
  {
    id: 7,
    name: "Michelle Garcia",
    company: "EdTech Solutions",
    phone: "+1 (555) 123-9876",
    email: "michelle.g@education.tech",
    address: "852 Learning Blvd, Portland, OR 97201",
    status: "Warm",
    date: "Jan 13, 2025",
    time: "3:45 PM",
    avatar: "M",
    avatarColor: "#5B7EE5"
  },
  {
    id: 8,
    name: "James Martinez",
    company: "CloudFirst Systems",
    phone: "+1 (555) 876-5432",
    email: "james.m@cloudfirst.io",
    address: "741 Cloud Computing Way, Seattle, WA 98101",
    status: "Warm",
    date: "Jan 13, 2025",
    time: "1:20 PM",
    avatar: "J",
    avatarColor: "#5B7EE5"
  },
  {
    id: 9,
    name: "Lisa Anderson",
    company: "FinTech Innovations",
    phone: "+1 (555) 654-3210",
    email: "lisa.a@fintech-innov.com",
    address: "258 Finance District, Chicago, IL 60601",
    status: "Cold",
    date: "Jan 12, 2025",
    time: "11:15 AM",
    avatar: "L",
    avatarColor: "#9CA3AF"
  },
  {
    id: 10,
    name: "David Thompson",
    company: "Digital Marketing Plus",
    phone: "+1 (555) 789-0123",
    email: "d.thompson@digitalmarketing.plus",
    address: "963 Marketing Plaza, Miami, FL 33101",
    status: "Hot",
    date: "Jan 14, 2025",
    time: "9:15 PM",
    avatar: "D",
    avatarColor: "#5B7EE5"
  },
  {
    id: 11,
    name: "Patricia Lee",
    company: "GreenEnergy Corp",
    phone: "+1 (555) 456-7890",
    email: "patricia.l@greenenergy.corp",
    address: "147 Sustainable Way, Phoenix, AZ 85001",
    status: "Warm",
    date: "Jan 13, 2025",
    time: "5:30 PM",
    avatar: "P",
    avatarColor: "#5B7EE5"
  },
  {
    id: 12,
    name: "Christopher White",
    company: "AI Research Labs",
    phone: "+1 (555) 321-6547",
    email: "chris.w@airesearch.labs",
    address: "369 Algorithm Street, Cambridge, MA 02139",
    status: "Hot",
    date: "Jan 14, 2025",
    time: "6:45 PM",
    avatar: "C",
    avatarColor: "#5B7EE5"
  }
];

export default leadsData;
