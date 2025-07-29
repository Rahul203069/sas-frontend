//@ts-nocheck

import { NextRequest, NextResponse } from 'next/server';
import { SendMessage } from '@/app/action';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { from,to,accountSid,body,timestamp} = body;
        //from and to are phone numebrs body is the message
        // Input validation
        const missingFields = [];
        if (!conversationId) missingFields.push('conversationId');
        if (!message) missingFields.push('message');
        if (!sender) missingFields.push('sender');
        
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
        const conversation =await prisma.conversation.findFirst()



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
        const conversation = await prisma.conversation.findFirst({
           where:{
         leadphone:from,userphone:to,user:{twilio:{sid:accountSid,phone:to}}
        },
            select: {
                messages: { select: { sender: true, content: true }, },
                lead:{select:{name:true,email:true,phone:true,}},
            }
        });


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
                    conversationId,
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
