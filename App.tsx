import React, { useState, useEffect } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { ChatPreview } from './components/ChatPreview';
import { BusinessConfig, BotTone, BotPlatform, ChatMessage } from './types';
import { initializeChat } from './services/geminiService';

const DEFAULT_CONFIG: BusinessConfig = {
  name: "RED APPLE MOBILE REPAIR",
  industry: "Mobile Phone Repair Service",
  description: "Professional mobile repair center in Bangalore specializing in instant screen replacements, battery issues, and chip-level service for iPhone, OnePlus, Samsung, and other major brands.",
  tone: BotTone.FRIENDLY,
  platform: BotPlatform.WHATSAPP,
  openingHours: "Mon-Sat: 10:30 AM - 8:30 PM, Sun: 11:00 AM - 5:00 PM",
  contactEmail: "service@redapplemobile.com",
  phoneNumber: "+91 86606 63776",
  // Constructed link using the CID from the embed code (0xf9ade41a529ebc08)
  location: "Bangalore, Karnataka 560001. Map: https://maps.google.com/?cid=17991440628290210824",
  faqs: `Common Repairs:
- iPhone Screen Replacement: Starts from ₹1500 (approx 30 mins)
- Android Battery Replacement: Starts from ₹800
- Water Damage Service: Inspection charge ₹300 (deducted if repaired)

Policies:
- Warranty: 90 days on all screen and battery replacements.
- Payment: Cash, UPI, and Cards accepted.
- Data Privacy: We do not access user data during hardware repairs.`
};

const App: React.FC = () => {
  const [config, setConfig] = useState<BusinessConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize chat on mount and when explicit simulate is triggered
  useEffect(() => {
    initializeChat(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSimulate = () => {
    initializeChat(config);
    setMessages([]); // Clear chat history to start fresh with new persona
    
    // Add a system welcome message (local only, not from API) to indicate reset
    setMessages([{
      id: 'system-init',
      role: 'model',
      text: `Hello! I'm the automated assistant for ${config.name}. How can I help you with your device today?`,
      timestamp: new Date()
    }]);

    // On mobile, close sidebar after hitting simulate
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:text-meta-blue transition-colors"
        >
          <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Sidebar / Config Panel */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-full md:w-auto h-full shadow-xl md:shadow-none`}
      >
        <ConfigPanel 
          config={config} 
          onConfigChange={setConfig} 
          onSimulate={handleSimulate} 
        />
      </div>

      {/* Main Content / Preview */}
      <div className="flex-1 flex flex-col h-full relative">
        <ChatPreview 
          config={config} 
          messages={messages} 
          setMessages={setMessages}
        />
      </div>
    </div>
  );
};

export default App;