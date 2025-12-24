export enum BotTone {
  PROFESSIONAL = 'Professional',
  FRIENDLY = 'Friendly',
  ENTHUSIASTIC = 'Enthusiastic',
  EMPATHETIC = 'Empathetic',
  WITTY = 'Witty'
}

export enum BotPlatform {
  WHATSAPP = 'WhatsApp',
  MESSENGER = 'Messenger',
  INSTAGRAM = 'Instagram'
}

export interface BusinessConfig {
  name: string;
  industry: string;
  description: string;
  tone: BotTone;
  platform: BotPlatform;
  openingHours: string;
  contactEmail: string;
  phoneNumber: string;
  location: string;
  faqs: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}