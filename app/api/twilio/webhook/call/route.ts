//@ts-nocheck
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const { VoiceResponse } = twilio.twiml;

export async function POST(request) {
    try {
        // Get form data from Twilio webhook
        const formData = await request.formData();
        const from = formData.get('From');
        const to = formData.get('To');
        const callSid = formData.get('CallSid');

        // Log incoming call details
        console.log('OTP Call received:', { from, to, callSid });

        // Create TwiML response
        const twiml = new VoiceResponse();
        
        // Forward call to your personal phone
        const dial = twiml.dial({
            timeout: 30,
            callerId: from // Show original caller ID
        });
        
        dial.number('+917006414367'); // Replace with YOUR phone number

        // Return TwiML response
        return new NextResponse(twiml.toString(), {
            status: 200,
            headers: {
                'Content-Type': 'text/xml',
            },
        });

    } catch (error) {
        console.error('Error handling call:', error);
        
        // Return empty TwiML on error
        const twiml = new VoiceResponse();
        return new NextResponse(twiml.toString(), {
            status: 200,
            headers: {
                'Content-Type': 'text/xml',
            },
        });
    }
}

// Handle other HTTP methods
export async function GET() {
    return NextResponse.json({ message: 'This endpoint only accepts POST requests' }, { status: 405 });
}