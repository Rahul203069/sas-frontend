import { createsmsQueue } from '@/lib/que/qu'; // Adjust path as needed
import { worker } from '@/lib/que/worker';
import { storeLeads } from "@/functions/csvUpload";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


const prisma = new PrismaClient();

export async function POST(request: NextRequest) {

    try{
        const session = await getServerSession(authOptions);
        const userid= session?.user?.id;

        const {csvData,userId} = await request.json();
        if (!csvData || !userId) {
            return NextResponse.json({ error: 'Missing csvData or userId'},{status:400} );
        }
        // Process the CSV data
        console.log('Received CSV data:', csvData); 
       const response= await storeLeads(csvData,userid);
       const {count}= response;
//count=100

const leadsIds= await prisma.lead.findMany({ where: { userId: userid }, take: count, select:{id:true}, orderBy: { createdAt: 'desc' } });

       if(response.success){

     const intialise_worker= await worker(); 
     
         const queue = createsmsQueue();
     
         // Add all jobs in parallel with Promise.all
         await Promise.all(
           leadsIds.map(leadId =>
             queue.add('send-initial-sms', { leadId, userId }, { delay: 1000, attempts: 3 })
           )
         );
        return NextResponse.json({ message: `${response.count} leads stored successfully` }, { status: 200 });
       }
       else{
        return NextResponse.json({ error: response.error || 'Failed to store leads' }, { status: 500 });
       }
    }catch{

        return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }
}