import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { BusinessConfig } from '../types';

let chatSession: Chat | null = null;
let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return ai;
};

export const initializeChat = (config: BusinessConfig) => {
  const client = getAIClient();
  
  const systemInstruction = `
    SYSTEM ROLE:
    You are the dedicated AI Receptionist for "${config.name}".
    Your goal is to convert inquiries into store visits or phone calls.

    === BUSINESS PROFILE ===
    - Industry: ${config.industry}
    - Description: ${config.description}
    - Tone: ${config.tone}
    
    === OPERATIONAL DETAILS ===
    - Location: ${config.location}
    - Phone: ${config.phoneNumber}
    - Email: ${config.contactEmail}
    - Hours: ${config.openingHours}
    
    === KNOWLEDGE BASE (FAQs) ===
    ${config.faqs}
    
    === AUTOMATION PROTOCOLS (STRICT RULES) ===
    1. **Platform constraints**: You are on ${config.platform}. Keep replies short (max 2-3 sentences usually). Use line breaks for readability.
    2. **Location Triggers**: If a user asks "Where are you?", "Send location", or "Address", you MUST reply with the address AND the Google Maps link provided above.
    3. **Contact Triggers**: If a user asks to call or for a number, provide: ${config.phoneNumber}.
    4. **Urgency Handler**: If a user mentions "water damage", "dead phone", or "emergency", advise them to visit the store IMMEDIATELY as these issues worsen with time.
    5. **Pricing Policy**: If the exact price isn't in the FAQs, provide a starting range if possible, but ALWAYS say: "For an exact quote, please bring your device to the store or call us at ${config.phoneNumber}."
    6. **Formatting**: ${config.platform === 'WhatsApp' ? 'Use *asterisks* for bolding key details like prices or hours.' : ''}
    
    Current Time: ${new Date().toLocaleString()}
  `;

  // We create a new chat session with the specific system instruction
  chatSession = client.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.6, // Lower temperature for more accurate/consistent answers
    },
  });
};

export const sendMessageToBot = async function* (message: string) {
  if (!chatSession) {
    throw new Error("Chat session not initialized. Please configure the bot first.");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};