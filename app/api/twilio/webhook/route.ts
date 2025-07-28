//@ts-nocheck
import { NextResponse ,NextRequest} from 'next/server';
import twilio from 'twilio';

// Initialize Twilio client for sending responses
const twilioClient = twilio(
  process.env.SID,
  process.env.TOKEN
);

export async function POST(request: NextRequest) {
  try {
    // Parse the form data from Twilio webhook
    const formData = await request.formData();
    
    // Extract SMS webhook parameters
    const smsData = {
      MessageSid: formData.get('MessageSid'),
      AccountSid: formData.get('AccountSid'),
      MessagingServiceSid: formData.get('MessagingServiceSid'),
      From: formData.get('From'),
      To: formData.get('To'),
      Body: formData.get('Body'),
      NumMedia: formData.get('NumMedia'),
      MediaUrl0: formData.get('MediaUrl0'),
      MediaContentType0: formData.get('MediaContentType0'),
      SmsSid: formData.get('SmsSid'),
      SmsStatus: formData.get('SmsStatus'),
      ApiVersion: formData.get('ApiVersion'),
      FromCity: formData.get('FromCity'),
      FromState: formData.get('FromState'),
      FromZip: formData.get('FromZip'),
      FromCountry: formData.get('FromCountry'),
      ToCity: formData.get('ToCity'),
      ToState: formData.get('ToState'),
      ToZip: formData.get('ToZip'),
      ToCountry: formData.get('ToCountry'),
    };

    // Log incoming SMS for debugging
    console.log('📱 INCOMING SMS WEBHOOK');
    console.log('Timestamp:', new Date().toISOString());
    console.log('From:', smsData.From);
    console.log('To:', smsData.To);
    console.log('Message:', smsData.Body);
    console.log('Message SID:', smsData.MessageSid);
    console.log('Has Media:', parseInt(smsData.NumMedia || '0') > 0);
    
    // Process the incoming SMS
    const incomingSMS = {
      messageId: smsData.MessageSid,
      from: smsData.From,
      to: smsData.To,
      body: smsData.Body || '',
      timestamp: new Date(),
      hasMedia: parseInt(smsData.NumMedia || '0') > 0,
      mediaUrl: smsData.MediaUrl0 || null,
      mediaType: smsData.MediaContentType0 || null,
      location: {
        city: smsData.FromCity,
        state: smsData.FromState,
        zip: smsData.FromZip,
        country: smsData.FromCountry
      },
      status: 'received'
    };

    // Here's where you'd implement your business logic:
    
    // 1. Save to database
    // await saveMessageToDatabase(incomingSMS);
    
    // 2. Process message for lead qualification
    const response = await processLeadMessage(incomingSMS);
    
    // 3. Send auto-response if needed

      await sendSMSResponse(smsData.To, 'hey weebhook is working just fine', smsData.From);
    
    
    // 4. Update lead status and trigger notifications
    // await updateLeadStatus(smsData.From, response.leadScore);
    // await triggerNotifications(response);

    // Return TwiML response (optional - for immediate replies)
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      ${response.shouldReply ? `<Message>${response.message}</Message>` : ''}
    </Response>`;

    return new NextResponse(twimlResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('❌ SMS Webhook Error:', error);
    
    // Return empty TwiML response on error
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      }
    );
  }
}

// Business logic functions
async function processLeadMessage(smsData) {
  const message = smsData.body.toLowerCase();
  const phoneNumber = smsData.from;
  
  // Simple lead qualification logic (replace with your AI logic)
  let leadScore = 0;
  let responseMessage = '';
  let shouldReply = true;
  
  // Keywords that indicate interest
  const hotKeywords = ['price', 'cost', 'buy', 'purchase', 'demo', 'meeting'];
  const warmKeywords = ['interested', 'info', 'learn more', 'tell me'];
  const coldKeywords = ['stop', 'unsubscribe', 'not interested'];
  
  if (coldKeywords.some(keyword => message.includes(keyword))) {
    leadScore = 10; // Cold lead
    responseMessage = "Thanks for letting us know. You've been removed from our list.";
  } else if (hotKeywords.some(keyword => message.includes(keyword))) {
    leadScore = 85; // Hot lead
    responseMessage = "Great! I'd love to help you with that. Let me connect you with one of our specialists. What's the best time to call you?";
  } else if (warmKeywords.some(keyword => message.includes(keyword))) {
    leadScore = 60; // Warm lead
    responseMessage = "Thanks for your interest! Here's some quick info about our services. Would you like to schedule a brief call to discuss your needs?";
  } else {
    leadScore = 30; // Neutral
    responseMessage = "Hi! Thanks for reaching out. How can I help you today?";
  }
  
  console.log(`🎯 Lead Score: ${leadScore}/100 for ${phoneNumber}`);
  
  return {
    leadScore,
    message: responseMessage,
    shouldReply,
    leadStatus: leadScore >= 70 ? 'hot' : leadScore >= 50 ? 'warm' : 'cold'
  };
}

async function sendSMSResponse(to, message, from) {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: from, // Your Twilio number
      to: to // Lead's number
    });
    
    console.log(`✅ SMS Response sent: ${response.sid}`);
    return response;
  } catch (error) {
    console.error('❌ Failed to send SMS response:', error);
    throw error;
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({ 
    message: 'Twilio SMS Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}