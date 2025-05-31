export function extractGeneratedSlots(inputString:string) {
    const regex = /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})"/g;
    const matches = [];
    let match:any;
  
    while ((match = regex.exec(inputString)) !== null) {
      matches.push(match[1]);
    }
  
    return matches;
  }






  export async function generateGemniChatResponse(chatRequest: ChatRequest) {
  
  
  console.log(chatRequest,'chat request');
  
        try {
          // Validate the API key
          if (!process.env.GOOGLE_API_KEY) {
            throw new Error('Missing Google API key. Please add it to your environment variables.');
          }
      
          // Get the model (Gemini Pro is used for chat)
          const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:chatRequest.systemPrompt});
      
          // Format the chat history for Gemini API
          const history = chatRequest.messages.map(msg => ({
            role:msg.role==='user'?'user':'model',
            parts: [{ text: msg.content }],
          }));
      
          // Remove the last user message to send as the prompt
          
          const formattedHistory = history
          const userMessage =  history.pop();
      console.log(formattedHistory,'formatted history');
      console.log(userMessage,'user message');
          // Create a chat session
          const chat = model.startChat({
            history: [ ...history]
                   
          });
      
          // Send the message and get the response
          const result = await chat.sendMessage(userMessage?.parts[0].text || '');
          const response = result.response.candidates[0].content.parts[0].text;
  
          console.log(result,'result');
          console.log(response);
          console.log(response,'response');
  
      
  
  //check if th reapons of appointment settter
  
  
  if(response.includes('<run_function>check_availability</run_function>')){
  const generatedslots = await extractGeneratedSlots(response.toString())
  
  console.log(generatedslots,'generated slots');
  
  const user=await getuser();
  if(!user){
    return {error:'user not found'}
  }
  
  const token= JSON.parse(user.googlecalendarmetadata)
  
  
  const availabaleSlots=await getAvailableSlots(generatedslots,JSON.parse(user.googlecalendarmetadata))
  console.log(availabaleSlots,'available slots');
  
  
const res= await OfferAvailableSlots(availabaleSlots,formattedHistory)
  

  }
  
  
  // check if the response contains <run_function>check_availability</run_function>
  //
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
          // Return the Gemini response
          return { 
            success: true, 
            message: extractResponse(result.response.candidates[0].content.parts[0].text) || result.response.candidates[0].content.parts[0].text?.split('</response>')[0] || 'No response generated',
          };
        } catch (error: any) {
          console.error('Error generating chat response:', error);
          return { 
            success: false, 
            error: error.message || 'Failed to generate response' 
          };
        }
      }
  















      export async function OfferAvailableSlots(availabaleSlots:Date[],history: any[]) {
      
        const offerappointmentpropmt=`You are a real estate agent whose task is to set up appointments with potential clients. You will be provided with an array of available time slots in the following format:
      
      <available_slots>
      ${availabaleSlots.map((slot) => `<slot>${slot}</slot>`).join('')}
      </available_slots>
      
      Your goal is to offer these slots to the client one by one until they accept a slot or all slots are exhausted. Here's how you should proceed:
      
      1. Start with the first available slot in the array.
      2. Offer this slot to the client in a friendly, conversational manner. For example: "How about [date] at [time]? Does that work for you?"
      3. Wait for the client's response, which will be provided in the following format:
      
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
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' , generationConfig:{maxOutputTokens:1100,temperature:0.8},systemInstruction:offerappointmentpropmt});
        const chat = model.startChat({
            history: [ { role: 'user', parts: [{ text:'s' }] }],
                   
          });
          const userMessage=history.pop();
        const result = await chat.sendMessage(userMessage?.parts[0].text || '');
        const response = result.response.candidates[0].content.parts[0].text;
  
  
    }
    