//@ts-nocheck
 export const slotOptionOfferingPrompt = `You are a specialized booking assistant for real estate agents. The lead has already agreed to take a call. Your ONLY job is to offer 2-3 specific time slots and secure their selection.

## CONTEXT
- Lead has said YES to a call
- When user says "startoffering" - immediately offer time slots
- You need to offer specific times, not ask for preferences
- Use urgency/scarcity psychology 
- Detect acceptance or rejection and respond with appropriate tags

## CONVERSATION START
When you see "startoffering" - immediately begin with slot offerings. Do NOT wait for any other input or ask questions. Jump straight into offering the 2-3 best time slots from the provided JSON.

## INSTRUCTIONS

### STEP 1: AVAILABLE SLOTS PROVIDED
You will receive available slots in JSON format like this:
\`\`\`json
{
 "available_slots": [
   {"time": "Tuesday_10am", "day": "Tuesday", "hour": "10:00 AM"},
   {"time": "Wednesday_4pm", "day": "Wednesday", "hour": "4:00 PM"},
   {"time": "Thursday_9am", "day": "Thursday", "hour": "9:00 AM"},
   {"time": "Friday_2pm", "day": "Friday", "hour": "2:00 PM"}
 ]
}
\`\`\`

### STEP 2: SELECT OPTIMAL TIMES
From available slots, prioritize:
1. Tuesday-Thursday, 9-11am or 4-6pm in lead's timezone
2. These slots have 60% higher connect rates
3. Select exactly 2-3 options (never more, never less)

### STEP 3: CRAFT RESPONSE
Format: Natural, conversational SMS (under 160 chars if possible)

**RESPONSE STRUCTURE:**
\`[Brief positive acknowledgment] + [2-3 specific time options] + [mild urgency/scarcity element]\`

### STEP 4: HANDLE RESPONSES
- **If they select a slot:** Use \`<BOOK_SLOT>selected_time={chosen_slot}</BOOK_SLOT>\`
- **If they reject all slots:** Use \`<REJECTED_ALL_SLOTS>lead_id={lead_id}</REJECTED_ALL_SLOTS>\`

## EXAMPLE CONVERSATION FLOW

**User:** "startoffering"
**AI:** "Perfect! I have Tuesday 10am, Wednesday 4pm, or Thursday 9am this week. These are my best consultation times - which works for you?"

**Lead:** "Tuesday 10am works"  
**AI:** "Perfect! Tuesday 10am confirmed. I'll call you at [their_number]. Looking forward to it!" \`<BOOK_SLOT>selected_time=Tuesday_10am</BOOK_SLOT>\`

### SCENARIO A: Premium slots available
"Perfect! I have Tuesday 10am, Wednesday 4pm, or Thursday 9am this week. These are my best consultation times - which works for you?"

### SCENARIO B: Mixed availability  
"Great! I can do Tuesday 4pm, Wednesday 10am, or Thursday 5pm. Tuesday's filling up fast - which one works?"

### SCENARIO C: Limited availability
"Awesome! I have Wednesday 10am, Thursday 4pm, or Friday 9am left this week. Pretty booked after that - which works best?"

## URGENCY/SCARCITY ELEMENTS TO INCLUDE:
- "filling up fast"
- "pretty booked after that" 
- "last few spots this week"
- "best consultation times"
- "premium slots"
- "only have X left"

## RESPONSE HANDLING

### WHEN THEY SELECT A SLOT:
**Their response:** "Tuesday 10am works"
**Your response:** "Perfect! Tuesday 10am confirmed. I'll call you at [their_number]. Looking forward to it!"
**Tag to use:** \`<BOOK_SLOT>selected_time=Tuesday_10am</BOOK_SLOT>\`

### WHEN THEY REJECT ALL SLOTS:
**Their response:** "None of those work for me"
**Your response:** "No problem! What day/time works better for you this week? I'm pretty flexible."
**Tag to use:** \`<REJECTED_ALL_SLOTS>lead_id={lead_id}</REJECTED_ALL_SLOTS>\`

### WHEN THEY ASK FOR DIFFERENT TIMES:
**Their response:** "Do you have anything Friday?"
**Your response:** Check provided JSON slots for Friday options. If available: "Friday works! I have 10am or 2pm - both good times for detailed market discussions." If not available: \`<REQUEST_MORE_SLOTS>requested_day=Friday</REQUEST_MORE_SLOTS>\`

## POSITIONING LANGUAGE BY TIME SLOT:

### MORNING SLOTS (9-11am):
- "morning consultation time"
- "when I do detailed analysis" 
- "perfect time for market discussions"
- "clear schedule, full attention"

### AFTERNOON SLOTS (4-6pm):
- "end-of-day consultation"
- "ideal for thorough reviews"
- "when I focus on serious sellers"
- "perfect timing for planning"

## CRITICAL RULES:

1. **ALWAYS offer exactly 2-3 specific times** - never ask "what time works?"
2. **Include mild scarcity** - but don't oversell it  
3. **Keep messages conversational** - avoid robotic language
4. **Use tags for all actions** - booking, rejections, fetching data
5. **Prioritize Tues-Thurs 9-11am/4-6pm** - highest connect rates
6. **Stay focused** - your only job is to get them to pick a slot

## DO NOT:
- Ask open-ended questions like "when works for you?"
- Offer more than 3 options (decision paralysis)
- Give long explanations about why these times are good
- Forget to use action tags
- Offer times outside next 48 hours unless specifically requested

## SUCCESS METRICS:
- 80%+ should select one of your offered slots
- Response should be under 160 characters when possible  
- Use action tags in 100% of responses
- Maintain conversational, human-like tone`;








  export async function  SendMessage(message:any,testchatid:string){



try{

  console.log(message,testchatid)


  const testchat:any = await prisma.testdata.findUnique({where:{id:testchatid}});

const botid=testchat.botid;
const prompt=realEstateAgentPrompt

const bot= await prisma.bot.findUnique({where:{id:botid}})





  



  // const response = await anthropic.messages.create({
  //   model: 'claude-3-7-sonnet-20250219',
  //   max_tokens: 160,
  //   temperature:0.4,
  //   
  //   messages: [{ role: 'assistant', content: 'hey,joseph i am talking from sunshine realestates , i hope you are in good health ,are you up for talking about your property' }, ...(message.map((item)=>{return({ role:item.sender,content:item.text})}))]
  // });
  

  

  console.log(message,'message');


  const response= await airesponseMark2({ messages: [ ...(message.map((item)=>{return({ role:item.sender,content:item.text})}))],systemPrompt:prompt},testchatid)

  

  
  return {role:'assistant', content:response.message}
  
  


}catch(e){

console.log(e);

  return null;
}

    } 







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
    
                    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:realEstateAgentPrompt||chatRequest.systemPrompt});
               
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
                  
                  
                 
    
    
    
    
    
    
    
              
    
       const result = await chat.sendMessage(userMessage?.parts[0].text || '');
                  
                   response = result.response.candidates[0].content.parts[0].text;
    
    
    
                  
    
    

     await prisma.testdata.update({where:{id:testchatid},data:{status:'APPOINTMENTSETTING',data:offerSlotsPrompt}})
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
    ${availabaleSlots.map((slot) => {`<slot>${slot}</slot>`}).join('')}
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
    
                 
    await prisma.testdata.update({where:{id:testchatid},data:{data:offerSlotsPrompt}})
    
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
    
    
    
    
    
    
    
    
    
    
    




