//@ts-nocheck

import { NextRequest, NextResponse } from 'next/server';
import { SendMessage } from '@/app/action';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const bod = await request.json();
        const { from, to, accountSid, body, timestamp } = bod;
        //from and to are phone numebrs body is the message
        // Input validation
        const missingFields = [];
        if (!from) missingFields.push('from');
        if (!to) missingFields.push('to');
        if (!accountSid) missingFields.push('accountSid');
        if (!body) missingFields.push('body');
        if (!timestamp) missingFields.push('timestamp');
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Missing required field(s): ${missingFields.join(', ')}`
                },
                { status: 400 }
            );
        }
        

        //finding the conversaiontion session
   


        const conversation = await prisma.conversation.findFirst({
           where:{
         leadphone:from,userphone:to,user:{twilio:{sid:accountSid,phone:to}}
        },
            select: {
                messages: { select: { sender: true, content: true }, },
                lead:{select:{name:true,email:true,phone:true,}},
            }
        });

        // Save user message

        await prisma.message.create({
            data: {
                conversationId:conversation.id,
                sender:'LEAD',
                content: body,
                timestamp: new Date(timestamp)
            }
        });



        // Fetch message history


        if (!conversation) {
            return NextResponse.json(
                { success: false, error: 'Conversation not found' },
                { status: 404 }
            );
        }


        

        const response = await SendMessage(conversation.messages, conversation.id);

        // Save AI response
        if (response?.content) {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    sender: 'AI',
                    content: response.content,
                    timestamp: new Date()
                }
            });
        }

        return NextResponse.json({ success: true, data: {response,phone:conversation.lead.phone} }, { status: 200 });

    } catch (error: any) {
        console.error('POST /api/message error:', {
            message: error?.message || 'Unknown error',
            stack: error?.stack,
            time: new Date().toISOString()
        });

        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
