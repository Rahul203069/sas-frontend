import { NextRequest, NextResponse } from 'next/server';
import { SendMessage } from '@/app/action';



export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // converstion id
        // message and from whome

        const { conversationId, message, sender } = body;


        if (!conversationId || !message || !sender) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }


        const response = await SendMessage({role:sender,content:message}, conversationId);





        // Process the request body as needed










        return NextResponse.json({ success: true, data: response }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
