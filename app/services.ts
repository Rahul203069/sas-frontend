//@ts-nocheck
export async function generateGemniChatResponset(chatRequest: ChatRequest) {
      
      
      console.log(chatRequest,'chat request');
      
            try {
              // Validate the API key
              if (!process.env.GOOGLE_API_KEY) {
                throw new Error('Missing Google API key. Please add it to your environment variables.');
              }
          
              // Get the model (Gemini Pro is used for chat)
              const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:realEstateAgentPrompt||chatRequest.systemPrompt});
          
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
               
            
      if(response.includes('<run_function>check_availability</run_function>')||function mm(){if(yep){return true}else{return false}}()){

        console.log('control transfered to appointment setter ai ');
        
        
        
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




const offerSlotsPrompt = `You are a real estate agent offering appointment times from available slots.

## Available Time Slots:
<available_slots>
${availabaleSlots.map((slot) => {`<slot>${slot}</slot>`}).join('')}
</available_slots>

## Your Task:
1. **Offer the first available slot** from the list above
2. **Be friendly and conversational**: "How about [date] at [time]? Does that work for you?"
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
**Analyze the client's request and return appropriate flag:**

- **Client gives specific availability** ("I'm free tomorrow", "Can we do evening?", "How about Saturday?")
  → Return: \`<generate_new_slots></generate_new_slots>\`

- **Client asks to check other options** ("What other times do you have?", "Any other availability?")
  → Return: \`<check_availability></check_availability>\`

## Response Examples:

### Client Requests Specific Time:
\`\`\`
Client: "Can we do it tomorrow evening instead?"
Agent: Let me check what we have available tomorrow evening for you.
<generate_new_slots></generate_new_slots>
\`\`\`

\`\`\`
Client: "I'm free on weekends"
Agent: Perfect! Let me find some weekend options for you.
<generate_new_slots></generate_new_slots>
\`\`\`

### Client Asks for More Options:
\`\`\`
Client: "What other times do you have available?"
Agent: Let me check all our available appointment times for you.
<check_availability></check_availability>
\`\`\`

### Normal Flow:
\`\`\`
Agent: <person_told_the_availability>
How about August 19th at 3:00 PM? Does that work for you?

Client: "No, I can't do that time"

Agent: <person_told_the_availability>
No problem! How about August 20th at 5:00 PM instead?

Client: "Yes, perfect!"

Agent: <selected_slot>2025-08-20T17:00:00</selected_slot>
\`\`\`

## Flag Decision Logic:
- **\`<generate_new_slots>\`**: When client mentions specific times, days, or availability windows
- **\`<check_availability>\`**: When client wants to see more options without specifying preferences
- **\`<selected_slot>\`**: When client accepts an offered time
- **\`<slots_exhausted>\`**: When all available slots have been declined
- **\`<person_told_the_availability>\`**: When offering the next available slot

## Style:
- Keep it friendly and professional
- Be empathetic when times don't work
- Stay positive and solution-focused
- Always provide appropriate flag for system processing`;
             
         
          
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
${availabaleSlots.map((slot) => {`<slot>${slot}</slot>`}).join('')}
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











          