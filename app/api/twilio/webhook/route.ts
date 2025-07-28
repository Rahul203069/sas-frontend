

import { NextResponse } from 'next/server';
import twilio from 'twilio';

// Twilio credentials (store these in environment variables)
const accountSid = process.env.SID;
const authToken = process.env.TOKEN;
const twilioPhoneNumber = '+15592457719';

// Initialize Twilio client
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    // Parse the incoming form data from Twilio
    const body = await request.text();
    console.log('Raw body:', body);
    const params = new URLSearchParams(body);
    
    // Extract message details from Twilio webhook
    const messageData = {
      messageSid: params.get('MessageSid'),
      accountSid: params.get('AccountSid'),
      from: params.get('From'),
      to: params.get('To'),
      body: params.get('Body'),
      numMedia: params.get('NumMedia'),
      timestamp: new Date().toISOString()
    };

    console.log('Received SMS:', messageData);

    // Validate the webhook (optional but recommended)
    const twilioSignature = request.headers.get('x-twilio-signature');
    const url = request.url;
    
    // Uncomment below for signature validation
    // const isValid = twilio.validateRequest(
    //   authToken,
    //   twilioSignature,
    //   url,
    //   body
    // );
    
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    // }

    // Process the message based on content
    let responseMessage = '';
    const incomingMessage = messageData.body.toLowerCase().trim();
console.log('Incoming message:', incomingMessage);
    // Basic auto-responder logic
   
    responseMessage = `are bahi weebhook chalu hao bahio`;
    // Send automated response (optional)
 

    // Store message in database (implement your database logic here)
    await storeMessageInDatabase(messageData);

    // Send notification to your team (implement your notification logic here)
    await notifyTeam(messageData);

    // Return TwiML response (optional - for more complex responses)
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>
        <Body>${responseMessage}</Body>
      </Message>
    </Response>`;

    return new Response(twimlResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error processing Twilio webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET method for testing webhook endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'Twilio webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
}

// Helper function to store message in database
async function storeMessageInDatabase(messageData) {
  try {
    // Example with Prisma (adjust based on your database)
    // await prisma.message.create({
    //   data: {
    //     messageSid: messageData.messageSid,
    //     from: messageData.from,
    //     to: messageData.to,
    //     body: messageData.body,
    //     timestamp: messageData.timestamp,
    //   },
    // });
    
    // Example with MongoDB
    // await db.collection('messages').insertOne(messageData);
    
    console.log('Message stored in database:', messageData.messageSid);
  } catch (error) {
    console.error('Error storing message in database:', error);
  }
}

// Helper function to notify your team
async function notifyTeam(messageData) {
  try {
    // Send email notification
    // await sendEmail({
    //   to: 'team@yourcompany.com',
    //   subject: 'New SMS Received',
    //   html: `
    //     <h3>New SMS Message</h3>
    //     <p><strong>From:</strong> ${messageData.from}</p>
    //     <p><strong>Message:</strong> ${messageData.body}</p>
    //     <p><strong>Time:</strong> ${messageData.timestamp}</p>
    //   `
    // });

    // Send Slack notification
    // await sendSlackMessage({
    //   channel: '#customer-messages',
    //   text: `New SMS from ${messageData.from}: ${messageData.body}`
    // });

    // Send push notification
    // await sendPushNotification({
    //   title: 'New SMS Received',
    //   body: `From ${messageData.from}: ${messageData.body}`
    // });

    console.log('Team notified about new message');
  } catch (error) {
    console.error('Error notifying team:', error);
  }
}