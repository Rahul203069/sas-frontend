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



import { ReceiptEuro, Truck } from 'lucide-react';

import Anthropic from "@anthropic-ai/sdk/index.mjs";
import ChatbotConfig from '@/components/ChatbotConfig';

import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
import { get } from 'http';
import { extractGeneratedSlots } from '@/utils';
import { bookSlot } from './calender';











const prompt=`Youre name is tony and you are an real estate agent who act as a professional real estate agent. Your primary goal is to engage with potential clients, gather information about their property, and qualify leads. Here's how you should conduct the conversation:
  
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
2025-05-23
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
    }})
 

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
      const client = twilio(process.env.SID1, process.env.TOKEN1);

    const session = await getServerSession(authOptions)
    if(!session?.user.id){
        redirect('/login');
        return {error:'user  session missing'}
    }

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    
    
    try{
        const user = await prisma.user.update({where:{id:session.user.id},data:{phonenumber:phonenumber,otp:randomNumber.toString()}})
    

    const success=    await client.messages.create({
          body: `  hey,${user.otp} is your one-time-password to verfiy you phone number ,Thankyou  `,
          from: '+16187624119',
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

    try{

        const user = await prisma.user.update({where:{id:session.user.id},data:{

            areacode
        }})


        if(user){

            return{success:true,redirect:'/dashboard'}


        }
    }


    catch(e){

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
  
    
    if(type==='seller'){
      const bo=await prisma.sellerBot.update({where:{id:bot.id},data:{prompt}})
      console.log(bo)
    }
    
    else{
      
      const bo= await prisma.buyerBot.update({where:{id:bot.id},data:{prompt}})
      console.log(bo)
    }
    
  }catch(e){
  
  console.log(e)
  return e
    
  }
  
  
  
  
  
      }
  


      export async function ConfigureBot(BotConfigs: ChatbotConfig) {
        console.log(BotConfigs, 'bot config');
      
        const session = await getServerSession(authOptions);
      
        if (!session?.user?.id) {
          return redirect('/login');
        }
      
        const userId = session.user.id;
      
        if (BotConfigs.leadType.toLowerCase() === 'buyer') {
          if (BotConfigs.id) {
            // Update existing buyer bot
            const existingBot = await prisma.buyerBot.findUnique({
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
      
            const bot = await prisma.buyerBot.update({
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
                userid: userId,
              },
              include: { enrichment: true }
            });
      
            await GenrertatPrompt(bot, 'buyer');
            return;
          }
      
          // Create new buyer bot
          const bot = await prisma.buyerBot.create({
            data: {
              appointmentsetter: BotConfigs.enableAppointmentSetter,
              name: BotConfigs.botName,
              bussinessinfo: BotConfigs.bussinessinfo,
              enrichment: {
                create: BotConfigs.enrichmentQuestions.map(q => ({ question: q.question }))
              },
              startingmessage: BotConfigs.startingMessage,
              userid: userId,
            },
            include: { enrichment: true }
          });
      
          await GenrertatPrompt(bot, 'buyer');
          return;
        } else {
          if (BotConfigs.id) {
            // Update existing seller bot
            const existingBot = await prisma.sellerBot.findUnique({
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
      
            console.log(`Added ${questionsToAdd.length} new questions and removed ${questionsToRemove.length} old questions`);
      
            const bot = await prisma.sellerBot.update({
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
                userid: userId,
              },
              include: { enrichment: true }
            });
      
            await GenrertatPrompt(bot, 'seller');
            return;
          }
      
          // Create new seller bot
          const bot = await prisma.sellerBot.create({
            data: {
              appointmentsetter: BotConfigs.enableAppointmentSetter,
              name: BotConfigs.botName,
              bussinessinfo: BotConfigs.bussinessinfo,
              enrichment: {
                create: BotConfigs.enrichmentQuestions.map(q => ({ question: q.question }))
              },
              startingmessage: BotConfigs.startingMessage,
              userid: userId,
            },
            include: { enrichment: true }
          });
      
          await GenrertatPrompt(bot, 'seller');
          return;
        }
      }


        export async function fetchBots(id:string,type:string) {
 
         

try{

console.log(id,type)

const user = await getuser()
if (!user) {
  return { error: "User not found" };
}

if(type&&type.toLowerCase().includes('seller')){
  const bot =await prisma.sellerBot.findUnique({where:{
    id,
  },

include:{enrichment:true}})


  return bot

}


if(type&&type.toLowerCase().includes('buyer')){
  const bot =await prisma.buyerBot.findUnique({where:{
    id,
  },
include:{enrichment:true}
})



  return bot
}



const bot= await prisma.user.findUnique({where:{
  id:user.id,
},
select:{buyerbot:true,sellerbot:true}
})


return bot



          
        }catch(e){
          return{error:'something went wrong'+e}
        }


      }


    export   async function IntiateTestchat(botid:string,type:string){

try{
  console.log(botid,type,'gjhvjhvjhvukvtfhvytfvutfjhvtg')

  const user = await getuser();
  if(!user){
    return {error:'cnat fetrch uer detail try loigin in again'}
  }


  const chatexist=await prisma.testchat.findFirst({where:{userid:user.id,...(type === 'buyer' ? { buyerbotid: botid } : { sellerbotid: botid })}})

  if(chatexist){
    return chatexist
  }

 const newtestchat =  await prisma.testchat.create({data:{

userid:user.id,
type,

...(type === 'buyer' ? { buyerbotid: botid } : { sellerbotid: botid })


 }}) 

 console.log(chatexist,'chat exist')
  
  
}catch(e){

  console.log(e);
  return{error:`sorry cnat intiate the chat `}
}


    } 


    export async function  SendMessage(message:{role:'user'|'assistant',content:string},testchatid:string){



try{

  console.log(message,testchatid)

  const testchat:any = await prisma.testchat.findUnique({where:{id:testchatid}});

const botid=testchat.buyerbotid || testchat.sellerbotid;
let prompt:string=''
if(testchat.type.toLowerCase()==='buyer'){
const bot= await prisma.buyerBot.findUnique({where:{id:botid}})
 prompt=bot.prompt||''



}else{
  
  const bot= await prisma.sellerBot.findUnique({where:{id:botid}})
   prompt=bot.prompt||''
 
}




  // const response = await anthropic.messages.create({
  //   model: 'claude-3-7-sonnet-20250219',
  //   max_tokens: 160,
  //   temperature:0.4,
  //   
  //   messages: [{ role: 'assistant', content: 'hey,joseph i am talking from sunshine realestates , i hope you are in good health ,are you up for talking about your property' }, ...(message.map((item)=>{return({ role:item.sender,content:item.text})}))]
  // });
  

  

  console.log(message,'message');

  const response= await generateGemniChatResponse({ messages: [ ...(message.map((item)=>{return({ role:item.sender,content:item.text})}))],systemPrompt:prompt})

  

  
  return {role:'assistant', content:response.message}
  
  


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
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');















    export async function generateGemniChatResponse(chatRequest: ChatRequest) {
      
      
      console.log(chatRequest,'chat request');
      
            try {
              // Validate the API key
              if (!process.env.GOOGLE_API_KEY) {
                throw new Error('Missing Google API key. Please add it to your environment variables.');
              }
          
              // Get the model (Gemini Pro is used for chat)
              const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:prompt||chatRequest.systemPrompt});
          
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
          
          await prisma.testdata.create({data:{name:'tony',data:prompte}})



        }
          
          
          
          
       console.log('over offering slots');
      
    const res= await OfferAvailableSlots(history,userMessage);

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































          export async function OfferAvailableSlots(history: any[],userMessage:any) {
      
            const offerappointmentpropmt=await prisma.testdata.findFirst({where:{name:'tony'}})
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:offerappointmentpropmt.data});
           console.log(offerappointmentpropmt,'offer appointment propmt');
           
            const chat = model.startChat({
    
                history: [...history] ,
                       
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

