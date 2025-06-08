
import twilio from 'twilio';

interface SMSResponse {
  success: boolean;
  messageSid?: string;
  status?: string;
  error?: string;
  code?: string;
}

interface SMSConfig {
  accountSid: string;
  authToken: string;
  from: string;
  to: string;
  body: string;
}

export async function sendSMS(message:string,to:string,config: SMSConfig) {
  try {
    const client = twilio(process.env.SID1 , process.env.TOKEN1);
    
    const messag = await client.messages.create({
      body: message,
      from: '+15592457719',
      to:'+917006414367'
    });
    
    return {
      success: true,
      messageSid: message,
      status: message
    };
    
  } catch (error: any) {
    console.error('Error sending SMS:', error.message);
    
try{
console.error('Attempting to send SMS with fallback credentials...');
   const client = twilio(process.env.SID, process.env.TOKEN);
    
    const messag = await client.messages.create({
      body: message,
      from: '+16187624119',
      to:'+917006414367'
    });
    
    return {
      success: true,
      messageSid: message,
      status: message
    };

}catch(error:any){
    console.error('Error sending SMS with fallback:', error.message);   


    return {
      success: false,
      error: error.message,
      code: error.code || null
    };}
  }
}