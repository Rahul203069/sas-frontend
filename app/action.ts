//@ts-nocheck



"use server"
import { authOptions } from '@/lib/auth';
import { error } from 'console';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import twilio from 'twilio'

import { google } from "googleapis";

import { GoogleGenerativeAI } from '@google/generative-ai';



import { Car, ReceiptEuro, Truck } from 'lucide-react';

import Anthropic from "@anthropic-ai/sdk/index.mjs";
import ChatbotConfig from '@/components/ChatbotConfig';

import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { get } from 'http';
import { extractGeneratedSlots } from '@/utils';
import { bookSlot } from './calender';
import { TwilioPurchaser } from '@/functions/twilio';
import { Item } from '@radix-ui/react-dropdown-menu';
import SuccessScreen from '@/components/CSVImport/SuccessScreen';
import { getMessagesArray, getSelectedSlot, smsScript } from '@/prompts/stage1';
import { extractSlotAndMessage } from '@/lib/utils';









const realEstateAgentPrompt = `You are Tony, a professional real estate agent. Your goal is to engage potential clients, qualify leads, and schedule appointments in a natural, conversational manner.
Core Instructions:
1. Conversation Flow

Always start with this exact message: "Hi, I'm Tony, a real estate agent. Are you interested in selling your property?"
Ask only ONE question at a time
Maintain a natural, human-like tone (not robotic or list-like)
If person is NOT interested in selling, politely end the conversation

2. Information to Gather (Only if interested in selling)
Required Information:

Property address

Optional Context:

Timeline for selling
Reason for selling

3. Appointment Scheduling Process
Step 1 - Initial Interest:
When you have the required information, ask: "Would you be interested in scheduling a phone call to discuss this further?"
Step 2 - Availability Request:
If they agree, ask: "What dates and times work best for you?"
Step 3 - Parse Availability:
When they provide availability, immediately signal this with: <person_told_the_availability>
Then parse their response into specific time slots following these rules:

Use ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
Generate 1-10 time slots based on their availability
Space slots 30 minutes apart
No slots after 9:00 PM
Current date reference: 2025-05-23

Examples of parsing:

"free after 5" → Generate slots from 5:00 PM onwards
"weekends work better" → Generate weekend slots
"tomorrow afternoon" → Generate afternoon slots for next day
"Monday or Tuesday" → Generate slots for both days

Step 4 - Present Options:
Format your generated slots as:
<generated_slots>
[
"2025-05-24T17:00:00",
"2025-05-24T17:30:00",
"2025-05-24T18:00:00"
]
</generated_slots>
<run_function>check_availability</run_function>
Then ask: "I have availability at [list 2-3 options]. Which time works best for you?"
Step 5 - Confirmation:
Once they select a time, confirm: "Perfect! I've scheduled our call for [date/time]. I'll call you then to discuss your property."
4. Lead Classification
Classify each lead at the end:
Hot Lead:

Interested in selling
Provided property address
Agreed to appointment
Selected specific time slot

Warm Lead:

Interested in selling
May have provided some information
Hesitant about appointment or providing details

Junk Lead:

Not interested in selling
Clearly not a serious prospect
Gave fake/invalid information

5. Response Format
<response>
[Your natural conversation response here]
</response>
<lead_classification>
Classification: [Hot/Warm/Junk]
Reason: [Brief explanation of what information was gathered and lead quality]
</lead_classification>
6. Business Information
<BusinessInfo>
We are a full-service real estate company with over 10 years of experience helping homeowners sell their properties quickly and for top dollar. We handle all aspects of the selling process from market analysis to closing.
</BusinessInfo>
Example Conversation Flow:
Tony: Hi, I'm Tony, a real estate agent. Are you interested in selling your property?
Client: Yes, I've been thinking about it.
Tony: That's great! What's the address of the property you're considering selling?
Client: It's 123 Main Street, Springfield.
Tony: Perfect! Would you be interested in scheduling a phone call to discuss this further?
Client: Sure, I'm free tomorrow after 5 PM.
Tony: <person_told_the_availability>
<generated_slots>
["2025-05-24T17:00:00", "2025-05-24T17:30:00", "2025-05-24T18:00:00"]
</generated_slots>
<run_function>check_availability</run_function>
I have availability tomorrow at 5:00 PM, 5:30 PM, or 6:00 PM. Which works best for you?

Input Variables:

{{USER_INPUT}} - The client's message
Current date: 2025-05-23

Remember: Be conversational, ask one question at a time, and focus on qualifying serious sellers.
<user_input>
{{USER_INPUT}}
</user_input>
Provide your response in the following format:
<response>
[Your conversation with the potential client goes here]
</response>
<lead_classification>
Classification: [Hot/Warm/Junk]
Reason: [Brief explanation of what information was gathered and lead quality]
</lead_classification>`;


const prompt1=`Youre name is tony and you are an real estate agent who act as a professional real estate agent. Your primary goal is to engage with potential clients, gather information about their property, and qualify leads. Here's how you should conduct the conversation:
  
  1. Begin each interaction with a friendly greeting and introduce yourself as a real estate agent. and ask whether the perosn in intrested in selling his property
  
  2. Throughout the conversation, maintain a natural, human-like tone. Avoid asking questions in a robotic or list-like manner. Instead, weave questions into the conversation naturally.
  
  3. Your main objective is to determine if the person is interested in selling their property. If they are, proceed to gather more information. If not, politely end the conversation.
  
 
  
  5. Only try to gather the following information about the property:
     1. What is the address of the property?
  
  6. If the person provides all the necessary information, ask if they would be interested in scheduling an appointment on phone call.

  8. Based on the conversation, classify the lead as follows:
     - Hot: If the person is interested in selling, provides all requested information, and agrees to an appointment.
     - Warm: If the person is interested in selling but is hesitant about providing all information or scheduling an appointment.
     - Junk: If the person is not interested in selling or is clearly not a serious prospect.
  
  9. End the conversation politely, thanking them for their time.
  10. ask  only one question at a time and dont ask extra questions only those which are required to get the information mentioned  above


  12. if the person is not interested in selling the property, end the conversation politely.


  
13. you have to always start the conversation with following message
   <StartingMessage>
   
   
hi am tony, i am a real estate agent, are you interested in selling your property?
   
   </StartingMessage>
14. following is the info regarding our realestate buissness , refer the following info if the user ask some question regarding the bussiness 



For seeting appointments follow the following format

1.  when setting   up appointments than be  consise  with your response.
2. ask what date work best for them
3. if they provide a date thant return the data in the following format
4. when the person tells his availablity or tell time for appoitmentor tell when he is free or when his is intrested for the appointment than to signal that by sending <person_told_the_availablity> in the output

<Dateselected>[date]</Dateselected>
4. if they did not provide a exact date but indrectly say what date the are intrested in like for example " i am free on the weenkends " than return the array of  dates of the next weekend, or if they sai something lik " " 

<BussinessInfo>

</BussinessInfo>

  <user_input>
  {{USER_INPUT}}
  </user_input>
  
  Provide your response in the following format:
  
  <response>
  [Your conversation with the potential client goes here]
  </response>
  
  <lead_classification>
  Classification: [Hot/Warm/Junk]
  Reason: [a little detailed explanation of details you gathered from the lead]
  </lead_classification>
  
  
  
  
  
    when trying to book appointment, Your task is to set appointments with people while sounding as human as possible. You will be given information about a person's availability, which you need to parse and convert into specific time slots.
Here is the user's stated availability:
<user_availability>
{{USER_AVAILABILITY}}
</user_availability>
<todays_date> 
${new Date().toLocaleDateString('en-CA')}

<todays_date>
Parse the user's availability and generate an array of time slots based on the following guidelines:
1. Convert vague time descriptions into specific time slots.
2. Use ISO 8601 format for dates and times (YYYY-MM-DDTHH:MM:SS).
3. Generate at least 1 and at most 10 time slots.
4. Try to generate as many slots as possible within these constraints.
5. If the user provides a specific date, try to generate slots around that date.
7. the time slots be equal spaced by 30 minutes.
8. the max time should be 9 pm so time slot should be generated beyond 9 pm.
8.try to generate as many slots as possible within these constraints.
9. even though the user provide specific date you have to genrate multiple slots within the given time-constraints.
10.once a user booked a slot tell them that the appointment is set and you will call them on the given date and time.
For example:
- "free after 5" might generate slots like "2023-05-25T17:00:00", "2023-05-25T18:00:00", etc.
- "free on the weekends" might generate slots like "2023-05-27T10:00:00", "2023-05-27T14:00:00", "2023-05-28T11:00:00", etc.
- "free tomorrow after 4" might generate slots like "2023-05-26T16:00:00", "2023-05-26T17:00:00", etc.
After generating the time slots, indicate that it's time to run the backend function to check availability. Your response should look like this:
<generated_slots>
[
"2025-04-26T17:00:00",
"2025-04-26T18:00:00",
"2025-04-26T19:00:00",
"2025-04-27T17:00:00",
"2025-04-27T18:00:00",
"2025-04-27T19:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>


Remember to maintain a conversational and human-like tone throughout the interaction. Use phrases like "How about [time slot]? Does that work for you?" or "If that doesn't suit you, I have another option at [time slot]. Would that be better?"
above are the two propmpt join them to build anew prompt which can work for both`






export async function getAvailableSlots(dateSlots: any[], calendarMetadata: { 
  access_token?: string; 
  refresh_token?: string; 
  scope?: string; 
  token_type?: string; 
  expiry_date?: number 
}) {
  const auth = new google.auth.OAuth2(
    process.env.ID,
    process.env.SECRET,
    process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/google-calendar/callback"
  );

  console.log(dateSlots, 'dateslots');
  console.log(calendarMetadata, 'calendar metadata');

  // Set credentials
  auth.setCredentials(calendarMetadata);

  // Check if token needs refresh
  if (calendarMetadata.expiry_date && calendarMetadata.expiry_date < Date.now()) {
    try {
      console.log('Token expired, refreshing...');
      const { credentials } = await auth.refreshAccessToken();
      auth.setCredentials(credentials);
      console.log('Token refreshed successfully');
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      return { error: 'Token refresh failed. Please re-authenticate.' };
    }
  }

  const calendar = google.calendar({ version: 'v3', auth });
  const uniqueSlots = [...new Set(dateSlots)];
  const freeSlots = [];

  for (const dateString of uniqueSlots) {
    console.log(dateString, 'date string');
    
    const start = new Date(dateString);
    const end = new Date(start.getTime() + 15 * 60 * 1000); // Add 15 minutes

    console.log(start.toISOString(), end.toISOString(), 'start and end time');

    try {
      const res = await calendar.freebusy.query({
        requestBody: {
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          timeZone: 'UTC',
          items: [{ id: 'primary' }],
        },
      });

      console.log(res.data, 'freebusy response');

      const busyTimes = res.data.calendars?.primary?.busy || [];
      if (busyTimes.length === 0) {
        freeSlots.push(dateString);
      }
    } catch (e) {
      console.error('Calendar API Error:', e.response?.data || e.message);
      
      // Handle specific error cases
      if (e.response?.data?.error === 'invalid_grant') {
        return { error: 'Authentication failed. Please re-authenticate with Google Calendar.' };
      }
      
      // For other errors, continue with next slot instead of returning error
      console.log(`Skipping slot ${dateString} due to error`);
      continue;
    }
  }

  return freeSlots;
}














const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;



const prisma=new PrismaClient()




function extractResponse(text) {
  const match = text.match(/<response>([\s\S]*?)<\/response>/);
  return match ? match[1].trim() : null;
}

function extractClassification(text) {
  const match = text.match(/Classification:\s*(.*)/);
  return match ? match[1].trim() : null;
}

function extractReason(text) {
  const match = text.match(/Reason:\s*([\s\S]*)<\/lead_classification>/);
  return match ? match[1].trim() : null;
}




export async function getuser(){

  try{
    const session= await getServerSession(authOptions);
    console.log(session)
    if(!session?.user?.id){
      return redirect('/login')
            }
        
    

    const user = await prisma.user.findUnique({where:{
id:session?.user?.id
    },include:{
      twilio:true}})
 
      console.log(user, 'user found');

    if(!user){
      redirect('/login')
      return 

    }

    return user

  }catch(e){

return error
  }
}









export async function sendotp(phonenumber:string) {
    console.log(phonenumber);

    console.log(accountSid,authToken)
      const client = twilio(process.env.SID, process.env.TOKEN);

    const session = await getServerSession(authOptions)
    if(!session?.user.id){
        redirect('/login');
        return {error:'user  session missing'}
    }

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    
    
    try{
        const user = await prisma.user.update({where:{id:session.user.id},data:{phonenumber:phonenumber,otp:randomNumber.toString()}})
    

    const success=    await client.messages.create({
          body: `  hey,${user.otp} is your one-time-password to verfiy you phone number ,  heheheh bchsbdh jhbcq Thankyou  `,
          from: '+15592457719',
          to: phonenumber,
        });
        console.log(success, 'sms sent successfully');

        if(success){

            return {success:'otp is sent on your mobile number'}
        }



      }catch(e){
    
        console.log(e)
      return {error:'Something went wrong,try again later'}}


    
}





export async function AddareaCode(areacode:string){

    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return { redirect: "/login", error: "User session missing" };
    }

    const areacod= areacode.toString()

    try{

        const user = await prisma.user.update({where:{id:session.user.id},data:{

            areacode:areacod
        }})


        const twilio = new TwilioPurchaser(process.env.SIDFREE, process.env.TOKENFREE);

       const data=  await twilio.purchaseMultipleNumbers(1)
console.log(data, 'twilio data');
       if(data[0].success){

        await prisma.twilio.create({
            data:{
              
                sid:data[0].sid,
                authToken:data[0].authToken,
                accountSid: data[0].accountSid,
                metadata: {},
                phone:data[0].phoneNumber,
                userId:user.id
            }
        })

        return {success:true,redirect:'/dashboard'}
       }

        if(user){

            return{success:true,redirect:'/dashboard'}


        }
    }


    catch(e){
console.log(e, 'error in adding area code');
        return{error:'Something went wrong try again later'}
    }


}



export async function verifyOtp(enteredOtp: string) {
    const session = await getServerSession(authOptions);
    // Get the session to verify the user
    if (!session?.user.id) {
      return { redirect: "/login", error: "User session missing" };
    }
    
    try {
      // Fetch user from the database
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      });
      
      if (!user || !user.otp) {
        return { error: "No OTP found. Request a new one." };
      }
      
      // Compare OTP
      if (user.otp !== enteredOtp) {
        return { error: "Invalid OTP. Please try again." };
      }
      
      // Clear the OTP after successful verification
      await prisma.user.update({
        where: { id: session.user.id },

        data: { 
          otp: null,


        
          phoneverifed: true,
        }
      });
      
      return {success:true}
      // Return a redirect object instead of using the redirect function
 
    } catch (error) {
      console.log("OTP verification error:", error);
        return { error: "Something went wrong. Please try again later." };
    }
}

    
async function GenrertatPrompt(bot:any,type:string){


  const prompt=`Youre name is ${bot.name} and you are an real estate agent who act as a professional real estate agent. Your primary goal is to engage with potential clients, gather information about their property, and qualify leads. Here's how you should conduct the conversation:
  
  1. Begin each interaction with a friendly greeting and introduce yourself as a real estate agent. and ask whether the perosn in intrested in selling his property
  
  2. Throughout the conversation, maintain a natural, human-like tone. Avoid asking questions in a robotic or list-like manner. Instead, weave questions into the conversation naturally.
  
  3. Your main objective is to determine if the person is interested in selling their property. If they are, proceed to gather more information. If not, politely end the conversation.
  
  4. When asking for property details, phrase your questions indirectly. For example, instead of asking "How many bedrooms and bathrooms does your property have?", say something like "It would be really helpful if you could share the number of bedrooms and bathrooms. This information helps us find the right buyers for your property."
  
  5. Try to gather the following information about the property:
     ${bot.enrichment.map((item,index)=>{return  ` .${index} ${item.question},`})}
  
  6. If the person provides all the necessary information, ask if they would be interested in scheduling an appointment on phone call.

  8. Based on the conversation, classify the lead as follows:
     - Hot: If the person is interested in selling, provides all requested information, and agrees to an appointment.
     - Warm: If the person is interested in selling but is hesitant about providing all information or scheduling an appointment.
     - Junk: If the person is not interested in selling or is clearly not a serious prospect.
  
  9. End the conversation politely, thanking them for their time.
  10. ask  only one question at a time
11. give great reasoning for each question you ask

  12. if the person is not interested in selling the property, end the conversation politely.


  
13. you have to always start the conversation with following message
   <StartingMessage>
   
   
   
   ${bot.startingmessage}
   
   </StartingMessage>
14. following is the info regarding our realestate buissness , refer the following info if the user ask some question regarding the bussiness 



For seeting appointments follow the following format

1.  when setting   up appointments than be  consise  with your response.
2. ask what date work best for them
3. if they provide a date thant return the data in the following format
4. when the person tells his availablity or tell time for appoitmentor tell when he is free or when his is intrested for the appointment than to signal that by sending <person_told_the_availablity> in the output

<Dateselected>[date]</Dateselected>
4. if they did not provide a exact date but indrectly say what date the are intrested in like for example " i am free on the weenkends " than return the array of  dates of the next weekend, or if they sai something lik " " 

<BussinessInfo>
${bot.bussinessinfo }
</BussinessInfo>

  <user_input>
  {{USER_INPUT}}
  </user_input>
  
  Provide your response in the following format:
  
  <response>
  [Your conversation with the potential client goes here]
  </response>
  
  <lead_classification>
  Classification: [Hot/Warm/Junk]
  Reason: [a little detailed explanation of details you gathered from the lead]
  </lead_classification>
  
  
  
  
  
    when trying to book appointment, Your task is to set appointments with people while sounding as human as possible. You will be given information about a person's availability, which you need to parse and convert into specific time slots.
Here is the user's stated availability:
<user_availability>
{{USER_AVAILABILITY}}
</user_availability>
<todays_date> 
2025-05-25
<todays_date>
Parse the user's availability and generate an array of time slots based on the following guidelines:
1. Convert vague time descriptions into specific time slots.
2. Use ISO 8601 format for dates and times (YYYY-MM-DDTHH:MM:SS).
3. Generate at least 1 and at most 10 time slots.
4. Try to generate as many slots as possible within these constraints.
5. If the user provides a specific date, try to generate slots around that date.
7. even though the user provide specific date you have to genrate multiple slots within the given time-constraints.
For example:
- "free after 5" might generate slots like "2023-05-25T17:00:00", "2023-05-25T18:00:00", etc.
- "free on the weekends" might generate slots like "2023-05-27T10:00:00", "2023-05-27T14:00:00", "2023-05-28T11:00:00", etc.
- "free tomorrow after 4" might generate slots like "2023-05-26T16:00:00", "2023-05-26T17:00:00", etc.
After generating the time slots, indicate that it's time to run the backend function to check availability. Your response should look like this:
<generated_slots>
[
"2025-04-26T17:00:00",
"2025-04-26T18:00:00",
"2025-04-26T19:00:00",
"2025-04-27T17:00:00",
"2025-04-27T18:00:00",
"2025-04-27T19:00:00"
]
</generated_slots>
<available_slots>
["2023-08-19T17:00:00","2023-08-20T17:00:00"]
</available_slots>
<run_function>check_availability</run_function>


Remember to maintain a conversational and human-like tone throughout the interaction. Use phrases like "How about [time slot]? Does that work for you?" or "If that doesn't suit you, I have another option at [time slot]. Would that be better?"
above are the two propmpt join them to build anew prompt which can work for both`
  
  
  
  try{
  
    
    
      const bo=await prisma.bot.update({where:{id:bot.id},data:{prompt}})
      console.log(bo)
   
    

    
  }catch(e){
  
  console.log(e)
  return e
    
  }
  
  
  
  
  
      }
  


      export async function ConfigureBot(BotConfigs: ChatbotConfig) {




const{name,type,create}= BotConfigs;
const session = await getServerSession(authOptions);

if (!session?.user?.id) {
  return redirect('/login');
}

if(create){

  
  console.log(BotConfigs, 'bot config');
  
  
  const userId = session.user.id;
  
  try{

    await prisma.bot.create({
      data: {name,type,userid:userId}})
      
      return {success:true,redirect:'/dashboard'}
    }catch(e){

      return{success:false,error:'Something went wrong, try again later'}
    }
  }

      

          if (BotConfigs.id) {
            // Update existing buyer bot
            const existingBot = await prisma.bot.findUnique({
              where: { id: BotConfigs.id },
              include: { enrichment: true }
            });
      
            if (!existingBot) {
              throw new Error('Bot not found');
            }
      
            const existingQuestions = existingBot.enrichment.map(e => e.question);
            const existingQuestionMap: { [key: string]: string } = existingBot.enrichment.reduce((map, e) => {
              map[e.question] = e.id;
              return map;
            }, {});
      
            const newQuestions = BotConfigs.enrichmentQuestions.map(q => q.question);
            const questionsToAdd = newQuestions.filter(q => !existingQuestions.includes(q));
            const questionsToRemove = existingQuestions
              .filter(q => !newQuestions.includes(q))
              .map(q => existingQuestionMap[q]);
      
            console.log(questionsToAdd, 'questions to add');
            console.log(questionsToRemove, 'questions to remove');
      
            const bot = await prisma.bot.update({
              where: { id: BotConfigs.id },
              data: {
                appointmentsetter: BotConfigs.enableAppointmentSetter,
                name: BotConfigs.botName,
                bussinessinfo: BotConfigs.bussinessinfo,
                enrichment: {
                  deleteMany: questionsToRemove.length > 0 ? { id: { in: questionsToRemove } } : undefined,
                  create: questionsToAdd.map(question => ({ question }))
                },
                startingmessage: BotConfigs.startingMessage,
              
              },
              include: { enrichment: true }
            });
      
            await GenrertatPrompt(bot, 'buyer');
            return;
          }
      
          // Create new buyer bot
       
      }


        export async function fetchBots(id:string,type:string) {
 
         

try{

console.log(id,type)

if(id&&type){



const bots= await prisma.bot.findFirst({
  where:{
    id,
    type:type.toUpperCase()
  },
  include:{enrichment:true}
})


return bots


}

const user = await getuser()
if (!user) {
  return { error: "User not found" };
}



const bot = await prisma.bot.findFirst({
  where:{userid:user.id,type:'SELLER'},

  include:{enrichment:true}
 
})


const botmetrics=await getdashboardlytics()

// if(type&&type.toLowerCase().includes('seller')){
//   const bot =await prisma.sellerBot.findUnique({where:{
//     id,
//   },

// include:{enrichment:true}})


//   return bot

// }


// if(type&&type.toLowerCase().includes('buyer')){
//   const bot =await prisma.buyerBot.findUnique({where:{
//     id,
//   },
// include:{enrichment:true}
// })



//   return bot
// }



// const bot= await prisma.user.findUnique({where:{
//   id:user.id,
// },
// select:{buyerbot:true,sellerbot:true}
// })


return {bot,botmetrics}



          
        }catch(e){
          return{error:'something went wrong'+e}
        }


      }


    export   async function IntiateTestchat(botid:string,type:string){

try{
 

  const user = await getuser();
  if(!user){
    return {error:'cnat fetrch uer detail try loigin in again'}
  }


  const chatexist=await prisma.testchat.findFirst({where:{userid:user.id,botid}})

  if(chatexist){
    

    await prisma.testchat.delete({where:{id:chatexist.id}})
    
  }
  
  
      const newtestchat =  await prisma.testchat.create({data:{
     userid:user.id,
     botid,
     
      }})



      return  newtestchat

 


 
  
  
}catch(e){

  console.log(e);
  return{error:`sorry cnat intiate the chat `}
}


    } 




















     export async function  SendMessageapi(message:any,conversationId:string,){



try{

  console.log(message,conversationId)


  const conversation:any = await prisma.conversation.findUnique({where:{id:conversationId},include:{bot:true,user:true}});

const bot=conversation.bot


const  prompt=bot.prompt||''








  // const response = await anthropic.messages.create({
  //   model: 'claude-3-7-sonnet-20250219',
  //   max_tokens: 160,
  //   temperature:0.4,
  //   
  //   messages: [{ role: 'assistant', content: 'hey,joseph i am talking from sunshine realestates , i hope you are in good health ,are you up for talking about your property' }, ...(message.map((item)=>{return({ role:item.sender,content:item.text})}))]
  // });
  

  

  console.log(message,'message');

  const response= await generateGemniChatResponse({ messages: [ ...(message.map((item)=>{return({ role:item.sender,content:item.content})}))],systemPrompt:prompt,conversation:conversation,user:conversation.user})

  

  
  return {role:'assistant', content:response.message}
  
  


}catch(e){

console.log(e);

  return null;
}

    } 












    export async function generateGemniChatResponset(chatRequest: ChatRequest) {
      
      
      console.log(chatRequest,'chat request');
      
            try {
              // Validate the API key
              if (!process.env.GOOGLE_API_KEY) {
                throw new Error('Missing Google API key. Please add it to your environment variables.');
              }
          
              // Get the model (Gemini Pro is used for chat)
 
 
              //realEstateAgentPromp a tyrp fo prompt


              const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:smsScript});
          
              // Format the chat history for Gemini API
              const history = chatRequest.messages.map(msg => ({
                role:msg.role==='user'?'user':'model', 
                parts: [{ text: msg.content }],
              }));
          
              // Remove the last user message to send as the prompt
              
              const formattedHistory = history
              const userMessage =  history.pop();
      
              // Create a chat session
              const chat = model.startChat({
                history: [ ...history]
                       
              });
          
              // Send the message and get the response

          
      
      //check if th reapons of appointment settter
            const yep=await prisma.testdata.findFirst({where:{name:'tony'}});
            let response = '';

            if(!yep){
              
              
              const result = await chat.sendMessage(userMessage?.parts[0].text || '');
              
               response = result.response.candidates[0].content.parts[0].text;
               console.log('response',response);
               
            }
      if(response.includes('<run_function>check_availability</run_function>')||function mm(){if(yep){return true}else{return false}}()){

        console.log('control transfered to appointment setter ai ');
        
        
        
        let user=undefined
        user=await getuser();
       if(!user){
         return {error:'user not found'}
        }
        
        if(!yep){


          console.log('prompt created test data');
          
          const generatedslots = await extractGeneratedSlots(response.toString())
         console.log(generatedslots,'generated slots');
         
          
          const token= JSON.parse(user.googlecalendarmetadata)
          
          
          const availabaleSlots=await getAvailableSlots(generatedslots,JSON.parse(user.googlecalendarmetadata))
          console.log(availabaleSlots,'available slots');




      const offerSlotsPrompt =`You are a real estate agent offering appointment times from available slots.

## Available Time Slots:
<available_slots>
${availabaleSlots.map((slot) => `<slot>${slot}</slot>`).join('')}
</available_slots>

## CRITICAL: ALWAYS START BY OFFERING THE FIRST SLOT
**No matter what the conversation history shows, you must IMMEDIATELY offer the first available slot from the list above.**

## Your Task:
1. **Always offer the first available slot first** - don't ask what they prefer
2. **Be direct and friendly**: "How about [date] at [time]? Does that work for you?"
3. **Add this tag at the start**: \`<person_told_the_availability>\`
4. **Wait for client response**

## Client Response Handling:

### If Client Accepts:
Return \`<selected_slot>[the accepted slot]</selected_slot>\`

### If Client Declines (but doesn't specify other time):
Offer the next available slot with \`<person_told_the_availability>\` tag

### If All Available Slots Are Declined:
Return \`<slots_exhausted></slots_exhausted>\`

### If Client Asks for Different/Specific Time:
**Analyze the client's request carefully:**

- **Client responds to "What time works for you?" question** (First time sharing their preference: "I prefer evenings", "How about 3 PM?", "Tomorrow at 2 PM works")
→ Continue offering from your available slots with \`<person_told_the_availability>\`

- **Client LATER tries to CHANGE their date preference** during conversation ("Actually, can we do Saturday instead?", "Let's try a different day", "Can we switch to next week?")
→ Return: \`<generate_new_slots></generate_new_slots>\`

- **Client asks to check other options** ("What other times do you have?", "Any other availability?")
→ Return: \`<check_availability></check_availability>\`

## IMPORTANT RULES:
- **NEVER say "Let me find options" or "Let me check" UNLESS the client specifically asks for different times**
- **ALWAYS offer concrete slots from the available list first**
- **Only use flags when the client explicitly requests different times or asks to see more options**
- **Don't assume what the client wants - offer what you have available**

## Response Examples:

### Correct Start (Always do this):
\`\`\`
<person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?
\`\`\`

### Wrong Start (Never do this):
\`\`\`
Perfect! Let me find some weekend options for you.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Responds to Initial "What time works?" Question:
\`\`\`
Agent: "What time and date work best for you?"
Client: "I prefer evenings"
Agent: <person_told_the_availability>
How about August 19th at 6:00 PM? Does that work for you?
\`\`\`

\`\`\`
Agent: "What time works for you?"
Client: "How about tomorrow at 3 PM?"
Agent: <person_told_the_availability>
How about August 20th at 3:00 PM? Does that work for you?
\`\`\`

### Client Later Changes Date Preference During Conversation:
\`\`\`
[Earlier client said they prefer evenings, AI offered evening slots]
Client: "Actually, can we do Saturday instead?"
Agent: Let me check what we have available on Saturday for you.
<generate_new_slots></generate_new_slots>
\`\`\`

\`\`\`
[Earlier client wanted specific time, now wants different date]
Client: "Let's try next week instead"
Agent: Let me find some options for next week.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Asks for More Options:
\`\`\`
Client: "What other times do you have available?"
Agent: Let me check all our available appointment times for you.
<check_availability></check_availability>
\`\`\`

### Normal Decline Flow:
\`\`\`
Agent: <person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?

Client: "No, I can't do that time"

Agent: <person_told_the_availability>
No problem! How about August 20th at 5:00 PM instead?
\`\`\`

## Flag Decision Logic:
- **\`<generate_new_slots>\`**: ONLY when client tries to CHANGE their date preference AFTER they have already responded to the initial "what time works for you?" question. 
  - **First response to "what time works?"**: Client says "I prefer evenings" or "Tomorrow at 5 PM" → Continue offering from available slots with \`<person_told_the_availability>\`
  - **Later trying to change date**: After giving initial preference, if client says "Actually, can we do Saturday instead?" → Use \`<generate_new_slots>\`
- **\`<check_availability>\`**: When client wants to see more options without specifying preferences
- **\`<selected_slot>\`**: When client accepts an offered time
- **\`<slots_exhausted>\`**: When all available slots have been declined
- **\`<person_told_the_availability>\`**: When offering any available slot from your list (including when client first shares their time/date preferences)

## Style:
- Start immediately with a concrete time offer
- Keep it friendly and professional
- Be empathetic when times don't work
- Stay focused on your available slots first
- Only generate new options when specifically requested`;

          
          await prisma.testdata.create({data:{name:'tony',data:offerSlotsPrompt}})
  console.log('over offering slots');
      
    const res= await OfferAvailableSlotst(history,userMessage,offerSlotsPrompt);


//check whter the user have slected the date or not
const input= res.toString()

    const hasOpeningTag = input.includes('<selected_slot>');
  const hasClosingTag = input.includes('</selected_slot>');
  const selectedornot= hasOpeningTag && hasClosingTag;
 return { 
        success: true, 
        message:res,
      }


        }
          
          
          
          
     
    // if selected


    if(res.includes('<run_function>check_availability</run_function>')||res.includes('<generate_new_slots>')){



function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); 
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


      const generateSlotsPrompt = `You are a real estate agent generating new appointment time slots based on client availability.

## Your Task:
Generate specific time slots based on what the client tells you about their availability.

## Today's Date: ${getTodayDate} 

## Client Request Analysis:
Convert client's availability into specific time slots using ISO 8601 format: \`YYYY-MM-DDTHH:MM:SS\`

## Generation Rules:
1. **Generate 3-8 specific slots** within their availability window
2. **Be generous with options** - give multiple times even for specific requests
3. **Use reasonable business hours** (9 AM - 8 PM unless specified otherwise)
4. **Space slots reasonably** (every 1-2 hours)

## Time Interpretation Examples:
- **"tomorrow at 6"** → Generate 6PM, 6:30PM, 7PM tomorrow
- **"free after 5 PM"** → Generate 5PM, 6PM, 7PM, 8PM today/soon
- **"weekends"** → Generate Saturday/Sunday morning, afternoon, evening
- **"next week"** → Generate Mon-Fri various times next week
- **"Monday morning"** → Generate 9AM, 10AM, 11AM Monday
- **"evenings this week"** → Generate 6PM, 7PM, 8PM for weekdays
- **"free Wednesday"** → Generate 10AM, 2PM, 4PM, 6PM Wednesday

## Response Format:
\`\`\`
I understand you're looking for [restate their availability]. Let me find some options for you.

<generated_slots>
[
  "2025-08-20T18:00:00",
  "2025-08-20T19:00:00",
  "2025-08-20T20:00:00",
  "2025-08-21T18:00:00",
  "2025-08-21T19:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

## Example Generations:

### Client: "I'm free after 5 PM this week"
\`\`\`
Perfect! Let me find some evening options for you this week.

<generated_slots>
[
  "2025-08-19T17:00:00",
  "2025-08-19T18:00:00",
  "2025-08-19T19:00:00",
  "2025-08-20T17:00:00",
  "2025-08-20T18:00:00",
  "2025-08-21T17:00:00",
  "2025-08-22T17:00:00",
  "2025-08-22T18:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

### Client: "Can we do it Saturday morning?"
\`\`\`
Absolutely! Let me check what we have available Saturday morning.

<generated_slots>
[
  "2025-08-23T09:00:00",
  "2025-08-23T10:00:00",
  "2025-08-23T11:00:00",
  "2025-08-23T12:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

### Client: "I'm busy until next Tuesday, any time after that"
\`\`\`
No problem! Let me look at options starting from next Wednesday.

<generated_slots>
[
  "2025-08-27T10:00:00",
  "2025-08-27T14:00:00",
  "2025-08-27T16:00:00",
  "2025-08-28T10:00:00",
  "2025-08-28T14:00:00",
  "2025-08-29T10:00:00",
  "2025-08-29T14:00:00",
  "2025-08-29T16:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

## Style:
- Acknowledge their availability clearly
- Be helpful and accommodating
- Generate realistic, spaced-out options
- Always end with the function call`



const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:generateSlotsPrompt||chatRequest.systemPrompt});
          
              // Format the chat history for Gemini API
              const history = chatRequest.messages.map(msg => ({
                role:msg.role==='user'?'user':'model',
                parts: [{ text: msg.content }],
              }));
          
              // Remove the last user message to send as the prompt
              
              const formattedHistory = history
              const userMessage =  history.pop();
      
              // Create a chat session
              const chat = model.startChat({
                history: [ ...history]
                       
              });





 const result = await chat.sendMessage(userMessage?.parts[0].text || '');
 const  response = result.response.candidates[0].content.parts[0].text;










 const generatedslots = await extractGeneratedSlots(response.toString())
         console.log(generatedslots,'generated slots');
         
          
          const token= JSON.parse(user.googlecalendarmetadata)
          
          
          const availabaleSlots=await getAvailableSlots(generatedslots,JSON.parse(user.googlecalendarmetadata))
          console.log(availabaleSlots,'available slots');











          const newprompt= `You are a real estate agent whose task is to set up appointments with potential clients. You will be provided with an array of available time slots in the following format:

<available_slots>
${availabaleSlots.map((slot) => `<slot>${slot}</slot>`).join('')}
</available_slots>

## Control Flags

The system will provide these flags to control your behavior:

\`\`\`
<flags>
<offer_available_slots>true</offer_available_slots>
<generate_new_slots>false</generate_new_slots>
<slots_available>true</slots_available>
</flags>
\`\`\`

### Flag Meanings:
- **offer_available_slots**: When \`true\`, offer from existing available slots
- **generate_new_slots**: When \`true\`, generate new slots based on client preferences
- **slots_available**: When \`true\`, there are slots in the available_slots array to offer

## Primary Task: Offer Available Slots

**Only when \`<offer_available_slots>true</offer_available_slots>\` and \`<slots_available>true</slots_available>\`:**

1. **Start with the first available slot** in the array
2. **Offer this slot** to the client in a friendly, conversational manner
   - Example: "How about [date] at [time]? Does that work for you?"
3. **Add this tag at the top of each response**: \`<person_told_the_availability>\`
4. **Wait for client response** in format:
   \`\`\`
   <user_response>
   {{USER_RESPONSE}}
   </user_response>
   \`\`\`

5. **If client accepts**: Stop offering and return \`<selected_slot>[selected date and time]</selected_slot>\`
6. **If client declines**: Move to next slot and repeat
7. **If all slots declined**: Return \`<slots_exhausted></slots_exhausted>\`

## Secondary Task: Handle Custom Time Requests

**Only when \`<generate_new_slots>true</generate_new_slots>\`:**

When the client requests a different time (not in available slots), generate new slots based on their availability.

### Slot Generation Rules:
1. Convert vague descriptions into specific time slots
2. Use ISO 8601 format: \`YYYY-MM-DDTHH:MM:SS\`
3. Generate 1-10 slots (as many as possible within constraints)
4. Use today's date as reference: **2025-08-19** (Tuesday)
5. Generate multiple slots even for specific dates

### Examples:
- "free after 5" → Generate slots at 5PM, 6PM, 7PM, etc.
- "free on weekends" → Generate Saturday/Sunday slots
- "free tomorrow after 4" → Generate slots from 4PM onwards tomorrow
- "free next week" → Generate various slots throughout next week

### Response Format for Custom Requests:
\`\`\`
<generated_slots>
[
  "2025-08-19T17:00:00",
  "2025-08-19T18:00:00",
  "2025-08-19T19:00:00",
  "2025-08-20T17:00:00",
  "2025-08-20T18:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

After this response, the system will programmatically update available slots and you can continue offering them.

## Behavior Based on Flags

### Scenario 1: \`offer_available_slots=true\`, \`slots_available=true\`
- Offer the first available slot from the array
- Use \`<person_told_the_availability>\` tag

### Scenario 2: \`offer_available_slots=false\`, \`slots_available=false\`
- Don't offer any slots
- Wait for client to specify their availability
- Acknowledge that you need to check available times

### Scenario 3: \`generate_new_slots=true\`
- Generate new slots based on client's stated preferences
- Use the slot generation format above

### Scenario 4: \`offer_available_slots=false\`, \`generate_new_slots=false\`
- Acknowledge the client's response
- Ask clarifying questions about their availability
- Prepare to either offer available slots or generate new ones based on their response

## Communication Style:
- Keep interactions **friendly, concise, and human-like**
- Be conversational and professional
- Show empathy when slots don't work
- Stay positive and solution-focused

## Example Interactions:

**Standard Flow (offer_available_slots=true, slots_available=true):**
\`\`\`
Flags: <offer_available_slots>true</offer_available_slots>, <slots_available>true</slots_available>

Agent: <person_told_the_availability>
How about August 19th at 5:00 PM? Does that work for you?

Client: No, sorry, I'm busy then.

Agent: <person_told_the_availability>
No problem! Let's try another option. Would August 20th at 5:00 PM suit you better?

Client: Yes, that works perfectly!

Agent: <selected_slot>2025-08-20T17:00:00</selected_slot>
\`\`\`

**Custom Time Request (generate_new_slots=true):**
\`\`\`
Flags: <generate_new_slots>true</generate_new_slots>

Agent: I understand! Let me check what we have available after 7 PM this week.

<generated_slots>
[
  "2025-08-19T19:00:00",
  "2025-08-19T20:00:00",
  "2025-08-20T19:00:00",
  "2025-08-20T20:00:00",
  "2025-08-21T19:00:00",
  "2025-08-21T20:00:00",
  "2025-08-22T19:00:00",
  "2025-08-22T20:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

**Waiting Mode (offer_available_slots=false, generate_new_slots=false):**
\`\`\`
Flags: <offer_available_slots>false</offer_available_slots>, <generate_new_slots>false</generate_new_slots>

Agent: I'd be happy to help you schedule an appointment! When would be the best time for you? Are there any particular days or times that work better for your schedule?
\`\`\`

## Key Rules:
1. **Always check flags first** before deciding what action to take
2. **Only offer available slots** when \`offer_available_slots=true\`
3. **Only generate new slots** when \`generate_new_slots=true\`
4. **Use appropriate tags** based on the current mode
5. **Maintain conversational flow** while respecting flag constraints`;

// Usage in your code:
// const prompt = realEstateAgentPrompt;`

          await prisma.testdata.updateMany({where:{name:'tony'},data:{data:newprompt}})
 const res= await OfferAvailableSlotst(history,userMessage);
return { 
        success: true, 
        message:res,
      }



    }
  if(selectedornot){

const match = input.match(/<selected_slot>([\s\S]*?)<\/selected_slot>/);
  const selectedate= match ? match[1].trim() : null;
console.log(selectedate,'selected date');
const booked= await bookSlot(selectedate,'test','test',JSON.parse(user.googlecalendarmetadata))

console.log(booked,'booked');



  }
      
    console.log(res,'rest'); 
       // Return the Gemini response
       return { 
        success: true, 
        message:res,
      }
    
      }else{

        


               return { 
                success: true, 
                message: extractResponse(response) || response?.split('</response>')[0] || 'No response generated',
              };
      }
      
      
      // check if the response contains <run_function>check_availability</run_function>
      //
      
      
      
        
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
              // Return the Gemini response
             
            } catch (error: any) {
              console.error('Error generating chat response:', error);
              return { 
                success: false, 
                error: error.message || 'Failed to generate response' 
              };
            }
          }



          export async function OfferAvailableSlotst(history: any[],userMessage:any,testchatid) {
      
            const offerappointmentpropmt=await prisma.testdata.findFirst({where:{id:testchatid}})

            console.log(offerappointmentpropmt.data,'offer appointment propmt');
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:offerappointmentpropmt.data});
           console.log(offerappointmentpropmt,'offer appointment propmt');
           
            const chat = model.startChat({
    
                history: [...history] ,
                       
              });
              
              console.log(history,'user message');
            const result = await chat.sendMessage(userMessage?.parts[0].text || '');
            const response = result.response.candidates[0].content.parts[0].text;
            console.log(response,' comminf g from offer available slots')
   
      return response
        }







function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}



      const generateSlotsPrompt = `You are a real estate agent generating new appointment time slots based on client availability.

## Your Task:
Generate specific time slots based on what the client tells you about their availability.

## Today's Date: ${getTodayDate} (Tuesday)

## Client Request Analysis:
Convert client's availability into specific time slots using ISO 8601 format: \`YYYY-MM-DDTHH:MM:SS\`

## Generation Rules:
1. **Generate 3-8 specific slots** within their availability window
2. **Be generous with options** - give multiple times even for specific requests
3. **Use reasonable business hours** (9 AM - 8 PM unless specified otherwise)
4. **Space slots reasonably** (every 1-2 hours)

## Time Interpretation Examples:
- **"tomorrow at 6"** → Generate 6PM, 6:30PM, 7PM tomorrow
- **"free after 5 PM"** → Generate 5PM, 6PM, 7PM, 8PM today/soon
- **"weekends"** → Generate Saturday/Sunday morning, afternoon, evening
- **"next week"** → Generate Mon-Fri various times next week
- **"Monday morning"** → Generate 9AM, 10AM, 11AM Monday
- **"evenings this week"** → Generate 6PM, 7PM, 8PM for weekdays
- **"free Wednesday"** → Generate 10AM, 2PM, 4PM, 6PM Wednesday

## Response Format:
\`\`\`
I understand you're looking for [restate their availability]. Let me find some options for you.

<generated_slots>
[
  "2025-08-20T18:00:00",
  "2025-08-20T19:00:00",
  "2025-08-20T20:00:00",
  "2025-08-21T18:00:00",
  "2025-08-21T19:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

## Example Generations:

### Client: "I'm free after 5 PM this week"
\`\`\`
Perfect! Let me find some evening options for you this week.

<generated_slots>
[
  "2025-08-19T17:00:00",
  "2025-08-19T18:00:00",
  "2025-08-19T19:00:00",
  "2025-08-20T17:00:00",
  "2025-08-20T18:00:00",
  "2025-08-21T17:00:00",
  "2025-08-22T17:00:00",
  "2025-08-22T18:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

### Client: "Can we do it Saturday morning?"
\`\`\`
Absolutely! Let me check what we have available Saturday morning.

<generated_slots>
[
  "2025-08-23T09:00:00",
  "2025-08-23T10:00:00",
  "2025-08-23T11:00:00",
  "2025-08-23T12:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

### Client: "I'm busy until next Tuesday, any time after that"
\`\`\`
No problem! Let me look at options starting from next Wednesday.

<generated_slots>
[
  "2025-08-27T10:00:00",
  "2025-08-27T14:00:00",
  "2025-08-27T16:00:00",
  "2025-08-28T10:00:00",
  "2025-08-28T14:00:00",
  "2025-08-29T10:00:00",
  "2025-08-29T14:00:00",
  "2025-08-29T16:00:00"
]
</generated_slots>

<run_function>check_availability</run_function>
\`\`\`

## Style:
- Acknowledge their availability clearly
- Be helpful and accommodating
- Generate realistic, spaced-out options
- Always end with the function call`





        export  async function airesponseapifortesting(chatRequest: ChatRequest,testchatid){

   const history = chatRequest.messages.map(msg => ({
                role:msg.role==='user'?'user':'model',
                parts: [{ text: msg.content }],
              }));


 const formattedHistory = history
              const userMessage =  history.pop();
 if (!process.env.GOOGLE_API_KEY) {
                throw new Error('Missing Google API key. Please add it to your environment variables.');
              }



              const data= await prisma.testdata.findFirst({where:{id:testchatid}})



              let response = ''
              //first type of mesag handele simpel uestion awnser
              if(data.status='TALKING'){

                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.4},systemInstruction:chatRequest.systemPrompt});
           
               // Format the chat history for Gemini API
            
       
               // Create a chat session

               const chat = model.startChat({
                 history: [ ...history]
                        
               });


                const resu = await chat.sendMessage(userMessage?.parts[0].text || '');
              
               response = resu.response.candidates[0].content.parts[0].text;
               console.log('response',response);
               

               
               if(!response.includes('<run_function>check_availability</run_function>')){
                 
                return {
                  success:true,
                  message:response
                }
                 
               }
                 //first type of mesag handele simpel uestion awnser
              
              
               if(response.includes('<run_function>check_availability</run_function>')){
                
                
                const generatedslots = await extractGeneratedSlots(response.toString())
                console.log(generatedslots,'generated slots');
                
                const user= await getuser();
                const token= JSON.parse(user.googlecalendarmetadata)
                
                
                const availabaleSlots=await getAvailableSlots(generatedslots,JSON.parse(user.googlecalendarmetadata))
                console.log(availabaleSlots,'available slots');
                
                const offerSlotsPrompt =`You are a real estate agent offering appointment times from available slots.

## Available Time Slots:
<available_slots>
${availabaleSlots.map((slot) => `<slot>${slot}</slot>`).join('')}
</available_slots>

## CRITICAL: ALWAYS START BY OFFERING THE FIRST SLOT
**No matter what the conversation history shows, you must IMMEDIATELY offer the first available slot from the list above.**

## Your Task:
1. **Always offer the first available slot first** - don't ask what they prefer
2. **Be direct and friendly**: "How about [date] at [time]? Does that work for you?"
3. **Add this tag at the start**: \`<person_told_the_availability>\`
4. **Wait for client response**

## Client Response Handling:

### If Client Accepts:
Return \`<selected_slot>[the accepted slot]</selected_slot>\`

### If Client Declines (but doesn't specify other time):
Offer the next available slot with \`<person_told_the_availability>\` tag

### If All Available Slots Are Declined:
Return \`<slots_exhausted></slots_exhausted>\`

### If Client Asks for Different/Specific Time:
**Analyze the client's request carefully:**

- **Client responds to "What time works for you?" question** (First time sharing their preference: "I prefer evenings", "How about 3 PM?", "Tomorrow at 2 PM works")
→ Continue offering from your available slots with \`<person_told_the_availability>\`

- **Client LATER tries to CHANGE their date preference** during conversation ("Actually, can we do Saturday instead?", "Let's try a different day", "Can we switch to next week?")
→ Return: \`<generate_new_slots></generate_new_slots>\`

- **Client asks to check other options** ("What other times do you have?", "Any other availability?")
→ Return: \`<check_availability></check_availability>\`

## IMPORTANT RULES:
- **NEVER say "Let me find options" or "Let me check" UNLESS the client specifically asks for different times**
- **ALWAYS offer concrete slots from the available list first**
- **Only use flags when the client explicitly requests different times or asks to see more options**
- **Don't assume what the client wants - offer what you have available**

## Response Examples:

### Correct Start (Always do this):
\`\`\`
<person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?
\`\`\`

### Wrong Start (Never do this):
\`\`\`
Perfect! Let me find some weekend options for you.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Responds to Initial "What time works?" Question:
\`\`\`
Agent: "What time and date work best for you?"
Client: "I prefer evenings"
Agent: <person_told_the_availability>
How about August 19th at 6:00 PM? Does that work for you?
\`\`\`

\`\`\`
Agent: "What time works for you?"
Client: "How about tomorrow at 3 PM?"
Agent: <person_told_the_availability>
How about August 20th at 3:00 PM? Does that work for you?
\`\`\`

### Client Later Changes Date Preference During Conversation:
\`\`\`
[Earlier client said they prefer evenings, AI offered evening slots]
Client: "Actually, can we do Saturday instead?"
Agent: Let me check what we have available on Saturday for you.
<generate_new_slots></generate_new_slots>
\`\`\`

\`\`\`
[Earlier client wanted specific time, now wants different date]
Client: "Let's try next week instead"
Agent: Let me find some options for next week.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Asks for More Options:
\`\`\`
Client: "What other times do you have available?"
Agent: Let me check all our available appointment times for you.
<check_availability></check_availability>
\`\`\`

### Normal Decline Flow:
\`\`\`
Agent: <person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?

Client: "No, I can't do that time"

Agent: <person_told_the_availability>
No problem! How about August 20th at 5:00 PM instead?
\`\`\`

## Flag Decision Logic:
- **\`<generate_new_slots>\`**: ONLY when client tries to CHANGE their date preference AFTER they have already responded to the initial "what time works for you?" question. 
  - **First response to "what time works?"**: Client says "I prefer evenings" or "Tomorrow at 5 PM" → Continue offering from available slots with \`<person_told_the_availability>\`
  - **Later trying to change date**: After giving initial preference, if client says "Actually, can we do Saturday instead?" → Use \`<generate_new_slots>\`
- **\`<check_availability>\`**: When client wants to see more options without specifying preferences
- **\`<selected_slot>\`**: When client accepts an offered time
- **\`<slots_exhausted>\`**: When all available slots have been declined
- **\`<person_told_the_availability>\`**: When offering any available slot from your list (including when client first shares their time/date preferences)

## Style:
- Start immediately with a concrete time offer
- Keep it friendly and professional
- Be empathetic when times don't work
- Stay focused on your available slots first
- Only generate new options when specifically requested`;
console.log(offerSlotsPrompt,'offer slots prompt');

            const rest=    await prisma.testdata.update({where:{id:testchatid},data:{data:offerSlotsPrompt,status:'APPOINTMENTSETTING'}})
            console.log(rest,'rest');
                const res= await OfferAvailableSlotst(history,userMessage,testchatid);
                
                 return{
    success:true,
    message:res
  }
              }







          

   const result = await chat.sendMessage(userMessage?.parts[0].text || '');
              
               response = result.response.candidates[0].content.parts[0].text;



                 const generatedslots = await extractGeneratedSlots(response.toString())
         console.log(generatedslots,'generated slots');
         
         const user= getuser();
          
          const token= JSON.parse(user.googlecalendarmetadata)
          
          
          const availabaleSlots=await getAvailableSlots(generatedslots,JSON.parse(user.googlecalendarmetadata))
          console.log(availabaleSlots,'available slots');

      const offerSlotsPrompt =`You are a real estate agent offering appointment times from available slots.

## Available Time Slots:
<available_slots>
${availabaleSlots.map((slot) => `<slot>${slot}</slot>`).join('')}
</available_slots>

## CRITICAL: ALWAYS START BY OFFERING THE FIRST SLOT
**No matter what the conversation history shows, you must IMMEDIATELY offer the first available slot from the list above.**

## Your Task:
1. **Always offer the first available slot first** - don't ask what they prefer
2. **Be direct and friendly**: "How about [date] at [time]? Does that work for you?"
3. **Add this tag at the start**: \`<person_told_the_availability>\`
4. **Wait for client response**

## Client Response Handling:

### If Client Accepts:
Return \`<selected_slot>[the accepted slot]</selected_slot>\`

### If Client Declines (but doesn't specify other time):
Offer the next available slot with \`<person_told_the_availability>\` tag

### If All Available Slots Are Declined:
Return \`<slots_exhausted></slots_exhausted>\`

### If Client Asks for Different/Specific Time:
**Analyze the client's request carefully:**

- **Client responds to "What time works for you?" question** (First time sharing their preference: "I prefer evenings", "How about 3 PM?", "Tomorrow at 2 PM works")
→ Continue offering from your available slots with \`<person_told_the_availability>\`

- **Client LATER tries to CHANGE their date preference** during conversation ("Actually, can we do Saturday instead?", "Let's try a different day", "Can we switch to next week?")
→ Return: \`<generate_new_slots></generate_new_slots>\`

- **Client asks to check other options** ("What other times do you have?", "Any other availability?")
→ Return: \`<check_availability></check_availability>\`

## IMPORTANT RULES:
- **NEVER say "Let me find options" or "Let me check" UNLESS the client specifically asks for different times**
- **ALWAYS offer concrete slots from the available list first**
- **Only use flags when the client explicitly requests different times or asks to see more options**
- **Don't assume what the client wants - offer what you have available**

## Response Examples:

### Correct Start (Always do this):
\`\`\`
<person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?
\`\`\`

### Wrong Start (Never do this):
\`\`\`
Perfect! Let me find some weekend options for you.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Responds to Initial "What time works?" Question:
\`\`\`
Agent: "What time and date work best for you?"
Client: "I prefer evenings"
Agent: <person_told_the_availability>
How about August 19th at 6:00 PM? Does that work for you?
\`\`\`

\`\`\`
Agent: "What time works for you?"
Client: "How about tomorrow at 3 PM?"
Agent: <person_told_the_availability>
How about August 20th at 3:00 PM? Does that work for you?
\`\`\`

### Client Later Changes Date Preference During Conversation:
\`\`\`
[Earlier client said they prefer evenings, AI offered evening slots]
Client: "Actually, can we do Saturday instead?"
Agent: Let me check what we have available on Saturday for you.
<generate_new_slots></generate_new_slots>
\`\`\`

\`\`\`
[Earlier client wanted specific time, now wants different date]
Client: "Let's try next week instead"
Agent: Let me find some options for next week.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Asks for More Options:
\`\`\`
Client: "What other times do you have available?"
Agent: Let me check all our available appointment times for you.
<check_availability></check_availability>
\`\`\`

### Normal Decline Flow:
\`\`\`
Agent: <person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?

Client: "No, I can't do that time"

Agent: <person_told_the_availability>
No problem! How about August 20th at 5:00 PM instead?
\`\`\`

## Flag Decision Logic:
- **\`<generate_new_slots>\`**: ONLY when client tries to CHANGE their date preference AFTER they have already responded to the initial "what time works for you?" question. 
  - **First response to "what time works?"**: Client says "I prefer evenings" or "Tomorrow at 5 PM" → Continue offering from available slots with \`<person_told_the_availability>\`
  - **Later trying to change date**: After giving initial preference, if client says "Actually, can we do Saturday instead?" → Use \`<generate_new_slots>\`
- **\`<check_availability>\`**: When client wants to see more options without specifying preferences
- **\`<selected_slot>\`**: When client accepts an offered time
- **\`<slots_exhausted>\`**: When all available slots have been declined
- **\`<person_told_the_availability>\`**: When offering any available slot from your list (including when client first shares their time/date preferences)

## Style:
- Start immediately with a concrete time offer
- Keep it friendly and professional
- Be empathetic when times don't work
- Stay focused on your available slots first
- Only generate new options when specifically requested`;



console.log(offerSlotsPrompt,'offer slots prompt without db update');
const rest=await prisma.testdata.update({where:{id:testchatid},data:{status:'APPOINTMENTSETTING',data:offerSlotsPrompt}})
console.log(rest,'rest after update');
const res= await OfferAvailableSlotst(history,userMessage,offerSlotsPrompt);
 return{
  sucess:true,
  message:res
 }


}


//firts time slots generation and offering




if(data.status='APPOINTMENTSETTING'){

   // Get the model (Gemini Pro is used for chat)


      const offerappointmentpropmt=await prisma.testdata.findFirst({where:{id:testchatid}})
              const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:offerappointmentpropmt.data||chatRequest.systemPrompt});
          
              // Format the chat history for Gemini API
              const history = chatRequest.messages.map(msg => ({
                role:msg.role==='user'?'user':'model',
                parts: [{ text: msg.content }],
              }));
          
              // Remove the last user message to send as the prompt
              
              const formattedHistory = history
              const userMessage =  history.pop();
      
              // Create a chat session
              const chat = model.startChat({
                history: [ ...history]
                       
              });
          
              const result = await chat.sendMessage(userMessage?.parts[0].text || '');
              
               response = result.response.candidates[0].content.parts[0].text;
               console.log('response',response);



             



if(!response.includes('<run_function>check_availability</run_function>')||!response.includes('<generated_slots>')){



  return{
    message:response,
    success:true
  }


}

if(response.includes('<run_function>check_availability</run_function>')||response.includes('<generated_slots>')){
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:generateSlotsPrompt||chatRequest.systemPrompt});
          
              // Format the chat history for Gemini API
              const history = chatRequest.messages.map(msg => ({
                role:msg.role==='user'?'user':'model',
                parts: [{ text: msg.content }],
              }));
          
              // Remove the last user message to send as the prompt
              
              const formattedHistory = history
              const userMessage =  history.pop();
      
              // Create a chat session
              const chat = model.startChat({
                history: [ ...history]
                       
              });
          
              const result = await chat.sendMessage(userMessage?.parts[0].text || '');
              
               response = result.response.candidates[0].content.parts[0].text;
               console.log('response',response);


                 let user=undefined
        user=await getuser();
       if(!user){
         return {error:'user not found'}
        }
        
        


          console.log('prompt created test data');
          
          const generatedslots = await extractGeneratedSlots(response.toString())
         console.log(generatedslots,'generated slots');
         
          
          const token= JSON.parse(user.googlecalendarmetadata)
          
          
          const availabaleSlots=await getAvailableSlots(generatedslots,JSON.parse(user.googlecalendarmetadata))
          console.log(availabaleSlots,'available slots');

               const offerSlotsPrompt =`You are a real estate agent offering appointment times from available slots.

## Available Time Slots:
<available_slots>
${availabaleSlots.map((slot) => `<slot>${slot}</slot>`).join('')}
</available_slots>

## CRITICAL: ALWAYS START BY OFFERING THE FIRST SLOT
**No matter what the conversation history shows, you must IMMEDIATELY offer the first available slot from the list above.**

## Your Task:
1. **Always offer the first available slot first** - don't ask what they prefer
2. **Be direct and friendly**: "How about [date] at [time]? Does that work for you?"
3. **Add this tag at the start**: \`<person_told_the_availability>\`
4. **Wait for client response**

## Client Response Handling:

### If Client Accepts:
Return \`<selected_slot>[the accepted slot]</selected_slot>\`

### If Client Declines (but doesn't specify other time):
Offer the next available slot with \`<person_told_the_availability>\` tag

### If All Available Slots Are Declined:
Return \`<slots_exhausted></slots_exhausted>\`

### If Client Asks for Different/Specific Time:
**Analyze the client's request carefully:**

- **Client responds to "What time works for you?" question** (First time sharing their preference: "I prefer evenings", "How about 3 PM?", "Tomorrow at 2 PM works")
→ Continue offering from your available slots with \`<person_told_the_availability>\`

- **Client LATER tries to CHANGE their date preference** during conversation ("Actually, can we do Saturday instead?", "Let's try a different day", "Can we switch to next week?")
→ Return: \`<generate_new_slots></generate_new_slots>\`

- **Client asks to check other options** ("What other times do you have?", "Any other availability?")
→ Return: \`<check_availability></check_availability>\`

## IMPORTANT RULES:
- **NEVER say "Let me find options" or "Let me check" UNLESS the client specifically asks for different times**
- **ALWAYS offer concrete slots from the available list first**
- **Only use flags when the client explicitly requests different times or asks to see more options**
- **Don't assume what the client wants - offer what you have available**

## Response Examples:

### Correct Start (Always do this):
\`\`\`
<person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?
\`\`\`

### Wrong Start (Never do this):
\`\`\`
Perfect! Let me find some weekend options for you.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Responds to Initial "What time works?" Question:
\`\`\`
Agent: "What time and date work best for you?"
Client: "I prefer evenings"
Agent: <person_told_the_availability>
How about August 19th at 6:00 PM? Does that work for you?
\`\`\`

\`\`\`
Agent: "What time works for you?"
Client: "How about tomorrow at 3 PM?"
Agent: <person_told_the_availability>
How about August 20th at 3:00 PM? Does that work for you?
\`\`\`

### Client Later Changes Date Preference During Conversation:
\`\`\`
[Earlier client said they prefer evenings, AI offered evening slots]
Client: "Actually, can we do Saturday instead?"
Agent: Let me check what we have available on Saturday for you.
<generate_new_slots></generate_new_slots>
\`\`\`

\`\`\`
[Earlier client wanted specific time, now wants different date]
Client: "Let's try next week instead"
Agent: Let me find some options for next week.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Asks for More Options:
\`\`\`
Client: "What other times do you have available?"
Agent: Let me check all our available appointment times for you.
<check_availability></check_availability>
\`\`\`

### Normal Decline Flow:
\`\`\`
Agent: <person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?

Client: "No, I can't do that time"

Agent: <person_told_the_availability>
No problem! How about August 20th at 5:00 PM instead?
\`\`\`

## Flag Decision Logic:
- **\`<generate_new_slots>\`**: ONLY when client tries to CHANGE their date preference AFTER they have already responded to the initial "what time works for you?" question. 
  - **First response to "what time works?"**: Client says "I prefer evenings" or "Tomorrow at 5 PM" → Continue offering from available slots with \`<person_told_the_availability>\`
  - **Later trying to change date**: After giving initial preference, if client says "Actually, can we do Saturday instead?" → Use \`<generate_new_slots>\`
- **\`<check_availability>\`**: When client wants to see more options without specifying preferences
- **\`<selected_slot>\`**: When client accepts an offered time
- **\`<slots_exhausted>\`**: When all available slots have been declined
- **\`<person_told_the_availability>\`**: When offering any available slot from your list (including when client first shares their time/date preferences)

## Style:
- Start immediately with a concrete time offer
- Keep it friendly and professional
- Be empathetic when times don't work
- Stay focused on your available slots first
- Only generate new options when specifically requested`;

             
const rest=await prisma.testdata.update({where:{id:testchatid},data:{status:'APPOINTMENTSETTING',data:offerSlotsPrompt}})
console.log(rest,'rest after update');

const res= await OfferAvailableSlotst(history,userMessage,testchatid);
return{
  success:true,
  message:res
}



}



return {
  success:true,
  message:response
}



}



            }


























      
      






    export async function  SendMessage(message:any,testchatid:string){



try{

  console.log(message,testchatid)


  const testchat:any = await prisma.testdata.findUnique({where:{id:testchatid}});

const botid=testchat.botid;
const prompt=realEstateAgentPrompt

const bot= await prisma.bot.findUnique({where:{id:botid}})


const user= await getuser();




  



  // const response = await anthropic.messages.create({
  //   model: 'claude-3-7-sonnet-20250219',
  //   max_tokens: 160,
  //   temperature:0.4,
  //   
  //   messages: [{ role: 'assistant', content: 'hey,joseph i am talking from sunshine realestates , i hope you are in good health ,are you up for talking about your property' }, ...(message.map((item)=>{return({ role:item.sender,content:item.text})}))]
  // });
  

  

  console.log(message,'message');










  const  aiprompt = await smsScript(new Date(),user.id) 







 

  const   response= await airesponseapifortesting({ messages: [ ...(message.map((item)=>{return({ role:item.sender,content:item.text})}))],systemPrompt:aiprompt||prompt},testchatid)

  

if(response.message.includes('<selected_slot>')&&response.message.includes('</selected_slot>')){

  


   const response2 = getSelectedSlot(response.message);


  const slottime= response2.selectedSlot

  
  const booked =await prisma.testAppointment.create({data:{userId:user.id,scheduledAt:new Date(slottime)}})

console.log('booked',booked)
 
console.log(response , response2.message)


const messagearr =getMessagesArray(response.message)


return {role:'assistant', content:messagearr}

}



  
  return {role:'assistant', content:getMessagesArray(response.message)}
  
  


}catch(e){

console.log(e);

  return null;
}

    } 









    export  async function extractGeneratedSlots(inputString:string) {
      const regex = /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})"/g;
      const matches = [];
      let match:any;
    
      while ((match = regex.exec(inputString)) !== null) {
        matches.push(match[1]);
      }
    
      return matches;
    }

    export interface Message {
      role: 'user' | 'model';
      content: string;
    }
    
    export interface ChatRequest {
      messages: Message[];
      systemPrompt?: string;
      conversation: any
      user:any
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');















    export async function generateGemniChatResponse(chatRequest: ChatRequest) {
      
      
      console.log(chatRequest,'chat request');
      const{conversation,user}=chatRequest
      
            try {
              // Validate the API key
              if (!process.env.GOOGLE_API_KEY) {
                throw new Error('Missing Google API key. Please add it to your environment variables.');
              }
          
              // Get the model (Gemini Pro is used for chat)

              const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:smsScript});
          
              // Format the chat history for Gemini API
              const history = chatRequest.messages.map(msg => ({
                role:msg.role==='LEAD'?'user':'model',
                parts: [{ text: msg.content }],
              }));
          
              // Remove the last user message to send as the prompt
              
              const formattedHistory = history
              const userMessage =  history.pop();
      
              // Create a chat session
              const chat = model.startChat({
                history: [{role:'user',parts:[{text:'start'}]}, ...history]
                       
              });
          
              // Send the message and get the response

          
      
      //check if th reapons of appointment settter
            const yep=conversation.status
       
            let response = '';
            if(yep==='TALKING'){
              
              console.log('reached inside 1')
              const result = await chat.sendMessage(userMessage?.parts[0].text || '');
              
               response = result.response.candidates[0].content.parts[0].text;
               console.log(response,'arer ter sale resonse slele')
            }
                                                                                        
      if(response.includes('<run_function>check_availability</run_function>')|| (yep==='APPOINTMENTSETTING') ){

        console.log('control transfered to appointment setter ai ');
        
        

        if((yep==='TALKING')){


          console.log('prompt created test data');
          
          const generatedslots = await extractGeneratedSlots(response.toString())
         console.log(generatedslots,'generated slots');
         
          
          const token= JSON.parse(user.googlecalendarmetadata)
          
          
          const availabaleSlots=await getAvailableSlots(generatedslots,JSON.parse(user.googlecalendarmetadata))
          console.log(availabaleSlots,'available slots');
             
          const prompte=`You are a real estate agent whose task is to set up appointments with potential clients. You will be provided with an array of available time slots in the following format:
          
          <available_slots>
          ${availabaleSlots.map((slot) => `<slot>${slot}</slot>`).join('')}
          </available_slots>
          
          Your goal is to offer these slots to the client one by one until they accept a slot or all slots are exhausted. Here's how you should proceed:
          
          1. Start with the first available slot in the array.
          2. Offer this slot to the client in a friendly, conversational manner. For example: "How about [date] at [time]? Does that work for you?"
          3. Wait for the client's response, which will be provided in the following format:
          4. Rmber to add <person_told_the_availablity> at top of each response
          <user_response>
          {{USER_RESPONSE}}
          </user_response>
          
          4. If the client accepts the slot (indicates "yes" or similar affirmative response), you should stop offering slots and return the selected slot.
          5. If the client declines the slot (indicates "no" or similar negative response), move to the next available slot in the array and repeat steps 2-4.
          6. If you reach the end of the array and the client has declined all slots, inform them that no more slots are available.

          
          Your final response should be formatted as follows:
          
          - If a slot is selected: <selected_slot>[selected date and time]</selected_slot>
          - If all slots are exhausted: <slots_exhausted></slots_exhausted>

          7.if the client try to book an appointment on a differnt time by providng his availability than you have to generate the time slots based on the following guidelines:



1. Convert vague time descriptions into specific time slots.
2. Use ISO 8601 format for dates and times (YYYY-MM-DDTHH:MM:SS).
3. Generate at least 1 and at most 10 time slots.
4. Try to generate as many slots as possible within these constraints.
5. If the user provides a specific date, try to generate slots around that date.
7. even though the user provide specific date you have to genrate multiple slots within the given time-constraints.
For example:
- "free after 5" might generate slots like "2023-05-25T17:00:00", "2023-05-25T18:00:00", etc.
- "free on the weekends" might generate slots like "2023-05-27T10:00:00", "2023-05-27T14:00:00", "2023-05-28T11:00:00", etc.
- "free tomorrow after 4" might generate slots like "2023-05-26T16:00:00", "2023-05-26T17:00:00", etc.
After generating the time slots, indicate that it's time to run the backend function to check availability. Your response should look like this:
<generated_slots>
[
"2025-04-26T17:00:00",
"2025-04-26T18:00:00",
"2025-04-26T19:00:00",
"2025-04-27T17:00:00",
"2025-04-27T18:00:00",
"2025-04-27T19:00:00"
]
</generated_slots>
<available_slots>
["2023-08-19T17:00:00","2023-08-20T17:00:00"]
</available_slots>
<run_function>check_availability</run_function>
















          Remember to keep your interactions friendly, concise, and human-like. Here are some examples of how your responses should look:
          
          Example 1:
          Agent: How about August 19th at 5:00 PM? Does that work for you?
          Client: No, sorry, I'm busy then.
          Agent: No problem! Let's try another option. Would August 20th at 5:00 PM suit you better?
          Client: Yes, that works perfectly!
          Agent: <selected_slot>2023-08-20T17:00:00</selected_slot>
          
          Example 2:
          Agent: How about August 19th at 5:00 PM? Does that work for you?
          Client: No, that doesn't work for me.
          Agent: I understand. Let me offer you another option. Would August 20th at 5:00 PM be more convenient?
          Client: I'm afraid that doesn't work either.
          Agent: <response>All slots are taken. I apologize for the inconvenience.</response>
          
          Please proceed with offering the available slots one by one, starting with the first slot in the array.`
          
          await prisma.conversation.update({where:{id:conversation.id},data:{status:'APPOINTMENTSETTING',appointmentdataprompt:prompte}})



        }
          
          
          
          
       console.log('over offering slots');
      
    const res= await OfferAvailableSlots(history,userMessage,conversation.id);

//check whter the user have slected the date or not
const input= res.toString()
    const hasOpeningTag = input.includes('<selected_slot>');
  const hasClosingTag = input.includes('</selected_slot>');
  const selectedornot= hasOpeningTag && hasClosingTag;
    // if selected
  if(selectedornot){

const match = input.match(/<selected_slot>([\s\S]*?)<\/selected_slot>/);
  const selectedate= match ? match[1].trim() : null;
console.log(selectedate,'selected date');
const booked= await bookSlot(selectedate,'test','test',JSON.parse(user.googlecalendarmetadata))

console.log(booked,'booked');



  }
      
    console.log(res,'rest'); 
       // Return the Gemini response
       return { 
        success: true, 
        message:res,
      }
    
      }else{

        console.log(response,'response')
console.log( { 
                success: true, 
                message: extractResponse(response) || response?.split('</response>')[0] || 'No response generated',
              })

               return { 
                success: true, 
                message: extractResponse(response) || response?.split('</response>')[0] || 'No response generated',
              };
      }
      
      
      // check if the response contains <run_function>check_availability</run_function>
      //
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
              // Return the Gemini response
             
            } catch (error: any) {
              console.error('Error generating chat response:', error);
              return { 
                success: false, 
                error: error.message || 'Failed to generate response' 
              };
            }
          }































          export async function OfferAvailableSlots(history: any[],userMessage:any, conversationid) {
      
            const offerappointmentpropmt=await prisma.conversation.findFirst({where:{id:conversationid}})
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:offerappointmentpropmt.appointmentdataprompt});
           console.log(offerappointmentpropmt,'offer appointment propmt');
          
           console.log(history)
            const chat = model.startChat({
                history: [{role:'user',parts:[{text:'start'}]}, ...history]
                       
              });
          
              
              console.log(history,'user message');
            const result = await chat.sendMessage(userMessage?.parts[0].text || '');
            const response = result.response.candidates[0].content.parts[0].text;
   
      return response
        }










    const oauth2Client = new google.auth.OAuth2(
      process.env.ID,
      process.env.SECRET,
      process.env.NEXT_PUBLIC_BSE_URL + "/api/auth/google-calendar/callback"
    );
  


    export async function getCalendarEvents() {


      const user=await getuser();
      if(!user){
        return {error:'user not found'}
      }

      const token= JSON.parse(user.googlecalendarmetadata)
      const accessToken=token.access_token
      const refreshToken=token.refresh_token
      
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token:refreshToken,
      });
    
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
      try {
 



const response =  await calendar.calendars.get({
  calendarId:'primary'
});

        console.log(response.data);
    
        return response.data || [];
      } catch (error: any) {
        console.error("Error fetching Google Calendar events:", error);
    
        // Check if error is due to token expiration
        if (error.response?.status === 401) {
          console.log("Access token expired, trying to refresh...");
    
          try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            const newAccessToken = credentials.access_token;
    
            // Save the new access token in the database
         
    await prisma.user.update({
      where:{id:user.id},
    
    data:{googlecalendarmetadata:JSON.stringify(credentials)}})

            console.log("Token refreshed! Fetching events again...");
            return await getCalendarEvents(newAccessToken!, refreshToken);
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }
        }
    
        return [];
      }
    }






     export async function getCalendarEvent() {


      const user=await getuser();
      if(!user){
        return {error:'user not found'}
      }

      const token= JSON.parse(user.googlecalendarmetadata)
      const accessToken=token.access_token
      const refreshToken=token.refresh_token
      
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token:refreshToken,
      });
    
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
      try {
        // Fetch calendar events
        const response = await calendar.events.list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime",
        });


        console.log(response.data.items);
    
        return response.data.items || [];
      } catch (error: any) {
        console.error("Error fetching Google Calendar events:", error);
    
        // Check if error is due to token expiration
        if (error.response?.status === 401) {
          console.log("Access token expired, trying to refresh...");
    
          try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            const newAccessToken = credentials.access_token;
    
            // Save the new access token in the database
         
    await prisma.user.update({
      where:{id:user.id},
    
    data:{googlecalendarmetadata:JSON.stringify(credentials)}})

            console.log("Token refreshed! Fetching events again...");
            return await getCalendarEvent(newAccessToken!, refreshToken);
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
          }
        }
    
        return [];
      }
    }



    export async function addAvailableSlots(availableslots:any){

      try{

        const user=await getuser();
        if(!user){
          return {error:'user not found'}
        }



        const repsone= await getCalendarEvents();
        console.log(response,'response')
        const slot= await prisma.user.update({where:{id:user.id},data:{availabaleSlots:availableslots,timeZone:repsone.timeZone}})

console.log(slot,'slot')
return {success:true}
      }catch(e){
console.log(e)
        return {error:'something wrong'}
      }
      



    }








    export async function testchat(ids:string){
      console.log(ids,'ids')

const {id} = await prisma.testdata.create({data:{name:'dcwdc',botid:ids}})

return id
    }





async function getLeadStatusCounts(userId: string) {
  const leads = await prisma.lead.findMany({
    where: { userId },
    select: { status: true },
  });

  // Initialize counts
  const counts = { JUNK: 0, WARM: 0, HOT: 0 };

  // Loop through leads and count
  leads.forEach((lead) => {
    if (lead.status === "JUNK") counts.JUNK++;
    if (lead.status === "WARM") counts.WARM++;
    if (lead.status === "HOT") counts.HOT++;
  });

  return counts;
}

type LeadStatusCounts = {
  JUNK: number;
  WARM: number;
  HOT: number;
};

export type DashboardAnalytics = {
  leadstatus: LeadStatusCounts;
  callbooked: number;
  Leadsreplied: number;
 initiatedCount:number;
  callcompleted:number;
   totalLeadsContacted: number;
  responseRate: number; // percentage
  avgTimeToFirstResponse: number; // in minutes
  dropOffRate: number; // percentage
  monthData?: MonthData[];
}

export async function getdashboardlytics(): Promise<DashboardAnalytics> {
  const { userid }: { userid: string } = await getuser();

  console.log(userid,'userid for analytics')
  const leadstatus: LeadStatusCounts = await getLeadStatusCounts(userid);

  const callbooked: number = await prisma.appointment.count({ where: { userId: userid } });
  const Leadsreplied: number = await prisma.lead.count({
    where: {
      userId: userid,
      NOT: { state: 'INITIATED' },
    },
  });
  console.log(callbooked, 'call booked');


  const initiatedCount = await prisma.lead.count({
    where: {
      userId:userid,
      initiated: true,
    },
  });
  const callcompleted = await prisma.appointment.count({where:{userId:userid, completed:true}})

const smsMetrics = await getSmsMetrics(userid);

  return { leadstatus, callbooked, Leadsreplied , initiatedCount, callcompleted, ...smsMetrics}; 
}

export type SmsMetrics = {
  totalReplied: number;
  totalLeadsContacted: number;
  responseRate: number; // percentage
  avgTimeToFirstResponse: number; // in minutes
  dropOffRate: number; // percentage
  monthData?: MonthData[];
};

export async function getSmsMetrics(userId: string): Promise<SmsMetrics> {
  // 1. Total Leads Contacted
  const totalLeadsContacted = await prisma.lead.count({
    where: { userId, initiated: true },
  });

  // 2. Response Rate
  const totalReplied = await prisma.lead.count({
    where: {
      userId,
      state: { not: "INITIATED" },
    },
  });
  const responseRate =
    totalLeadsContacted > 0
      ? Math.round((totalReplied / totalLeadsContacted) * 100)
      : 0;

  // 3. Time to First Response
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    include: { messages: true },
  });

  let totalDiff = 0;
  let countDiffs = 0;
  for (const conv of conversations) {
    const botMsg = conv.messages.find((m) => m.sender === "AI");
    const leadMsg = conv.messages.find((m) => m.sender === "LEAD");
    if (botMsg && leadMsg) {
      const diff =
        (new Date(leadMsg.timestamp).getTime() -
          new Date(botMsg.timestamp).getTime()) /
        1000 /
        60;
      if (diff >= 0) {
        totalDiff += diff;
        countDiffs++;
      }
    }
  }
  const avgTimeToFirstResponse =
    countDiffs > 0 ? Math.round(totalDiff / countDiffs) : 0;

  // 4. Drop-off Rate
  let dropOffCount = 0;
  for (const conv of conversations) {
    const leadMsgs = conv.messages.filter((m) => m.sender === "LEAD");
    if (leadMsgs.length === 1) dropOffCount++;
  }
  const dropOffRate =
    totalReplied > 0 ? Math.round((dropOffCount / totalReplied) * 100) : 0;


    const monthData = await getMonthlyData(userId);



  return {
    totalLeadsContacted,
    totalReplied,
    responseRate,
    avgTimeToFirstResponse,
    dropOffRate,
    ...monthData
  };
}


type MonthData = {
  month: string;
  fullMonth: string;
  callsBooked: number;
  leadsEngaged: number;
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

async function getMonthlyData(userId: string): Promise<MonthData[]> {
  const currentYear = new Date().getFullYear();

  // Fetch appointments per month
  const appointments = await prisma.appointment.groupBy({
    by: ['scheduledAt'],
    where: {
      userId,
      scheduledAt: {
 gte: new Date('2025-01-01'),  // 2025-09-01T00:00:00.000Z
  lte: new Date('2025-12-30'),  // 2025-09-30T00:00:00.000Z -> excludes later times!
      },
   
    },
    _count: {
      id: true,
    },
  });

  console.log(appointments,'appointments')

  // Fetch conversations per month
  const conversations = await prisma.conversation.groupBy({
    by: ['createdAt'],
    where: {
      userId,
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear}-12-31`),
      },
    },
    _count: {
      id: true,
    },
  });

  // Map data into MonthData[]
  const monthlyData: MonthData[] = monthNames.map((fullMonth, idx) => {
    const month = idx + 1; // 1-based month number

    // Count appointments in this month
    const callsBooked = appointments
      .filter(app => app.scheduledAt.getMonth() + 1 === month)
      .reduce((acc, app) => acc + app._count.id, 0);

    // Count conversations in this month
    const leadsEngaged = conversations
      .filter(conv => conv.createdAt.getMonth() + 1 === month)
      .reduce((acc, conv) => acc + conv._count.id, 0);

    return {
      month: fullMonth.slice(0, 3),
      fullMonth,
      callsBooked,
      leadsEngaged,
    };
  });

  return {monthlyData, callbooked:appointments.length};
}



export async function getLeads({
  sortby,
  filterby,
  search,
  page = 1,
  pageSize = 10,
}: {
  sortby?: string;
  filterby?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    // Build the where clause
    const where: any = {};

    // Filter by status (HOT, COLD, WARM, etc.)
    if (filterby && filterby !== 'all') {
      // Convert COLD to JUNK
      const statusValue = filterby.toUpperCase() === 'COLD' ? 'JUNK' : filterby.toUpperCase();
      where.status = statusValue as LeadStatus;
    }

    // Search functionality - search in name, address, email, and phone
    if (search && search.trim() !== '') {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive', // Case-insensitive search
          },
        },
        {
          address: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            hasSome: [search], // Search in email array
          },
        },
        {
          phone: {
            hasSome: [search], // Search in phone array
          },
        },
      ];
    }

    // Build the orderBy clause
    let orderBy: any = { createdAt: 'desc' }; // Default sort

    if (sortby) {
      // Handle sorting with - prefix for descending
      const isDescending = sortby.startsWith('-');
      const field = isDescending ? sortby.substring(1) : sortby;

      // Map common sort fields
      switch (field) {
        case 'name':
          orderBy = { name: isDescending ? 'desc' : 'asc' };
          break;
        case 'created':
        case 'createdAt':
          orderBy = { createdAt: isDescending ? 'desc' : 'asc' };
          break;
        case 'updated':
        case 'updatedAt':
          orderBy = { updatedAt: isDescending ? 'desc' : 'asc' };
          break;
        case 'status':
          orderBy = { status: isDescending ? 'desc' : 'asc' };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    }

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Fetch leads with pagination
    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          conversations:{select:{messages:true,id:true}},
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          bot: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              contacts: true,
              conversations: true,
              appointments: true,
            },
          },
        },
      }),
      // Get total count for pagination
      prisma.lead.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;


    const leadstatusCounts = await getLeadStatusCounts();
    return {
      success: true,
      data: leads,
      leadstatusCounts,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };



  } catch (error) {
    console.error('Error fetching leads:', error);
    return {
      success: false,
      error: 'Failed to fetch leads',
      data: [],
      pagination: {
        page,
        pageSize,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}




export async function getLeadsStats() {
  try {
    // Build the where clause - optionally filter by userId



const user= await getuser();

const  userId=user.userid;
    
    // Get counts for each status using groupBy
    const statusCounts = await prisma.lead.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true,
      },
    });

    // Initialize counts
    let totalLeads = 0;
    let hotLeads = 0;
    let warmLeads = 0;
    let junkLeads = 0;

    // Process the grouped results
    statusCounts.forEach((item) => {
      const count = item._count.status;
      totalLeads += count;

      switch (item.status) {
        case 'HOT':
          hotLeads = count;
          break;
        case 'WARM':
          warmLeads = count;
          break;
        case 'JUNK':
        case 'COLD':
          junkLeads += count;
          break;
      }
    });

    return {
      success: true,
      data: {
        totalLeads,
        hotLeads,
        warmLeads,
        junkLeads,
        breakdown: {
          HOT: hotLeads,
          WARM: warmLeads,
          JUNK: junkLeads,
        },
        percentages: {
          hot: totalLeads > 0 ? ((hotLeads / totalLeads) * 100).toFixed(1) : '0.0',
          warm: totalLeads > 0 ? ((warmLeads / totalLeads) * 100).toFixed(1) : '0.0',
          junk: totalLeads > 0 ? ((junkLeads / totalLeads) * 100).toFixed(1) : '0.0',
        },
      },
    };
  } catch (error) {
    console.error('Error fetching leads stats:', error);
    return {
      success: false,
      error: 'Failed to fetch leads statistics',
      data: {
        totalLeads: 0,
        hotLeads: 0,
        warmLeads: 0,
        junkLeads: 0,
        breakdown: {
          HOT: 0,
          WARM: 0,
          JUNK: 0,
        },
        percentages: {
          hot: '0.0',
          warm: '0.0',
          junk: '0.0',
        },
      },
    };
  }
}