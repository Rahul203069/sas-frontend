//@ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { SendMessage } from '@/app/action';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const bod = await request.json();
        const { from, to, accountSid, body, timestamp } = bod;

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
        
        // Find conversation using correct schema fields
        // Assuming you need to find by lead phone and user's Twilio phone
        const conversation = await prisma.conversation.findFirst({
            where: {
                lead: {
                    smscapablephone:{has:from}
                },
                user: {
                    twilio: {
                        phone: to,
                        accountSid: accountSid
                    }
                }
            },
            select: {
                id: true,
                botId: true,
                leadId: true,
                messages: { 
                    select: { 
                        sender: true, 
                        content: true 
                    },
                    orderBy: {
                        timestamp: 'asc'
                    }
                },
                lead: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                }
            }
        });

        // Check if conversation exists BEFORE using it
        if (!conversation) {
            return NextResponse.json(
                { success: false, error: 'Conversation not found' },
                { status: 404 }
            );
        }

        // Save user message with all required fields
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                botId: conversation.botId,      // ✅ Now included
                leadId: conversation.leadId,    // ✅ Now included
                sender: 'LEAD',
                content: body,
                timestamp: new Date(timestamp)
            }
        });

        // Get AI response
        const response = await SendMessage(conversation.messages, conversation.id);

        // Save AI response with all required fields
        if (response?.content) {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    botId: conversation.botId,      // ✅ Now included
                    leadId: conversation.leadId,    // ✅ Now included
                    sender: 'AI',
                    content: response.content,
                    timestamp: new Date()
                }
            });
        }

        return NextResponse.json({ 
            success: true, 
            data: {
                response,
                phone: conversation.lead.phone
            } 
        }, { status: 200 });

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