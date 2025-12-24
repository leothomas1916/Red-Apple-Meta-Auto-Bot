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
    You are an automated customer support AI agent for a business named "${config.name}".
    
    Business Details:
    - Industry: ${config.industry}
    - Description: ${config.description}
    - Operating Hours: ${config.openingHours}
    - Contact Email: ${config.contactEmail}
    - Contact Phone: ${config.phoneNumber}
    - Location: ${config.location}
    - Specific Knowledge/FAQs: ${config.faqs}
    
    Your Personality/Tone: ${config.tone}.
    Platform Constraints: You are messaging on ${config.platform}. Keep responses relatively short and mobile-friendly. 
    ${config.platform === 'WhatsApp' ? 'You can use *bold* for emphasis.' : ''}
    
    Goal: Assist customers, answer questions based ONLY on provided information or general industry knowledge if safe. If you don't know, ask them to contact support via email or phone.
    Never break character. You are the official bot for ${config.name}.
  `;

  // We create a new chat session with the specific system instruction
  chatSession = client.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
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