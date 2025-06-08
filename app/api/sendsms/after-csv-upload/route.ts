import { NextRequest, NextResponse } from 'next/server';
import { createsmsQueue } from '@/lib/que/qu'; // Adjust path as needed
import { worker } from '@/lib/que/worker';

export async function POST(request: NextRequest) {
  try {
    const { leadsIds, userId } = await request.json();

    if (!Array.isArray(leadsIds) || !userId) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const intialise_worker= await worker(); 

    const queue = createsmsQueue();

    // Add all jobs in parallel with Promise.all
    await Promise.all(
      leadsIds.map(leadId =>
        queue.add('send-initial-sms', { leadId, userId }, { delay: 1000, attempts: 3 })
      )
    );

    return NextResponse.json(
      { message: 'Initial SMS jobs added to the queue' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding SMS jobs:', error);
    return NextResponse.json(
      { error: 'Failed to add SMS jobs to the queue' },
      { status: 500 }
    );
  }
}
