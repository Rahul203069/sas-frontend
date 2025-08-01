import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {


const {leadId, userId, botId} = await request.json();
    if (!leadId || !userId || !botId) {
        return NextResponse.json({ error: 'Missing leadId, userId or botId' }, { status: 400 });
    }   



    try{

        const CreateConversation = await prisma.conversation.create({
            data: {botId, userId,leadId}})
 return NextResponse.json({ status:'sucess', message: 'Conversation created successfully', conversation: CreateConversation }, { status: 200 });

    }catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ status:'error', error: 'Internal server error' }, { status: 500 });
    }


}
