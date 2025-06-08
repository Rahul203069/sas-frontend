


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the input type based on your data structure
interface LeadInput {
  email: string[];
  phonenumber: string[];
  name: string;
  address?: string; // Assuming address is optional

}

// Function to store multiple leads
export async function storeLeads(leadsData: LeadInput[],userId:string) {
  try {
    // Use createMany for bulk insert (more efficient)
    const result = await prisma.lead.createMany({
      data:leadsData.map(lead => ({
        userId: userId,
        name: lead.name,
        email: lead.email,
        address: lead.address || '', // Assuming address is optional
        source:'MANUAL',
        phone: lead.phonenumber,
       
      })),
      skipDuplicates: true, // Skip if duplicate entries exist
    });
    
    console.log(`Successfully stored ${result.count} leads`);
    return {
      success: true,
      count: result.count,
      message: `${result.count} leads stored successfully`
    };
  } catch (error) {
    console.error('Error storing leads:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      count: 0
    };
  } finally {
    await prisma.$disconnect();
  }
}




