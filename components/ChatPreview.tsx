import React, { useState, useRef, useEffect } from 'react';
import { BusinessConfig, ChatMessage, BotPlatform } from '../types';
import { sendMessageToBot } from '../services/geminiService';

interface ChatPreviewProps {
  config: BusinessConfig;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ config, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const stream = sendMessageToBot(userMsg.text);
      let botResponseText = '';
      
      // Initial placeholder for bot message
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      for await (const textChunk of stream) {
        botResponseText += textChunk;
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: botResponseText } : msg
        ));
      }
    } catch (error) {
       setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please check the API key configuration.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Styles based on platform
  const getHeaderColor = () => {
    switch(config.platform) {
      case BotPlatform.WHATSAPP: return 'bg-[#075E54]';
      case BotPlatform.INSTAGRAM: return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default: return 'bg-white shadow-sm border-b border-gray-100'; // Messenger style
    }
  };

  const getBubbleStyle = (role: 'user' | 'model') => {
    if (role === 'user') {
      // User bubble is usually grey or platform generic
      return 'bg-[#E4E6EB] text-black self-end rounded-l-2xl rounded-tr-2xl rounded-br-md';
    } else {
      // Bot bubble
      switch(config.platform) {
        case BotPlatform.WHATSAPP: return 'bg-white text-black self-start rounded-r-2xl rounded-tl-2xl rounded-bl-md shadow-sm';
        case BotPlatform.INSTAGRAM: return 'bg-gray-100 text-black self-start rounded-r-2xl rounded-tl-2xl rounded-bl-md border border-gray-200';
        default: return 'bg-meta-blue text-white self-start rounded-r-2xl rounded-tl-2xl rounded-bl-md'; // Messenger Blue
      }
    }
  };

  const getBackground = () => {
     switch(config.platform) {
      case BotPlatform.WHATSAPP: return 'bg-[#E5DDD5]'; // WhatsApp Wallpaper color
      default: return 'bg-white';
    }
  };

  const TextFormatter = ({ text }: { text: string }) => {
    // Simple bold formatting for *text*
    const parts = text.split(/(\*.*?\*)/g);
    return (
      <span>
        {parts.map((part, i) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return <strong key={i}>{part.slice(1, -1)}</strong>;
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div className="flex-1 h-full bg-gray-100 p-4 md:p-8 flex items-center justify-center overflow-hidden">
      {/* Phone Mockup */}
      <div className="relative w-full max-w-[400px] h-[750px] bg-black rounded-[3rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden flex flex-col">
        {/* Notch/Status Bar Area */}
        <div className="h-7 bg-black w-full flex items-center justify-between px-6 text-white text-xs select-none z-20">
            <span>9:41</span>
            <div className="flex gap-1">
                <i className="fa-solid fa-signal"></i>
                <i className="fa-solid fa-wifi"></i>
                <i className="fa-solid fa-battery-full"></i>
            </div>
        </div>
        
        {/* App Header */}
        <div className={`h-16 flex items-center px-4 justify-between z-10 shrink-0 ${getHeaderColor()} ${config.platform === BotPlatform.MESSENGER ? 'text-black' : 'text-white'}`}>
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <span className="text-sm font-bold text-gray-500">{config.name.charAt(0)}</span>
             </div>
             <div className="leading-tight">
               <div className="font-semibold text-sm truncate max-w-[150px]">{config.name}</div>
               <div className="text-xs opacity-80">{config.platform === BotPlatform.WHATSAPP ? 'Business Account' : 'Typically replies instantly'}</div>
             </div>
          </div>
          <div className="flex gap-4 text-lg opacity-90">
             <i className="fa-solid fa-phone"></i>
             <i className="fa-solid fa-video"></i>
             <i className="fa-solid fa-circle-info"></i>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${getBackground()} relative no-scrollbar`}>
            {/* WhatsApp Wallpaper Pattern Overlay (CSS trick) */}
            {config.platform === BotPlatform.WHATSAPP && (
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
                    backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                    backgroundRepeat: 'repeat',
                    backgroundSize: '400px'
                }}></div>
            )}

            <div className="text-center text-xs text-gray-400 my-4 relative z-10">
              <span className="bg-gray-200/50 px-2 py-1 rounded-full">Today</span>
            </div>
            
            {/* Initial Greeting if no messages */}
            {messages.length === 0 && (
                <div className="flex justify-center mt-8 relative z-10">
                    <div className="bg-white/90 p-4 rounded-xl text-center shadow-sm max-w-[80%]">
                        <h3 className="text-gray-800 font-medium mb-1">Welcome to {config.name}!</h3>
                        <p className="text-xs text-gray-500">This is a preview of how your automated bot will interact with customers on {config.platform}.</p>
                    </div>
                </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col max-w-[80%] relative z-10 ${getBubbleStyle(msg.role)} p-3 text-sm`}>
                 <TextFormatter text={msg.text} />
                 <span className={`text-[10px] mt-1 self-end ${msg.role === 'model' && config.platform === BotPlatform.MESSENGER ? 'text-blue-100' : 'opacity-60'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
              </div>
            ))}
             
            {isTyping && (
                <div className={`relative z-10 self-start p-3 rounded-2xl bg-white shadow-sm w-12 flex items-center justify-center gap-1`}>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-3 flex items-center gap-2 border-t border-gray-100 shrink-0 z-20">
           <button className="text-meta-blue text-xl p-1">
              <i className="fa-solid fa-circle-plus"></i>
           </button>
           <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message..."
                className="bg-transparent w-full text-sm outline-none text-gray-800 placeholder-gray-500"
              />
           </div>
           {input.trim() ? (
               <button onClick={handleSend} className="text-meta-blue text-xl p-2 transition-transform active:scale-95">
                  <i className="fa-solid fa-paper-plane"></i>
               </button>
           ) : (
                <button className="text-meta-blue text-xl p-2">
                  <i className="fa-solid fa-thumbs-up"></i>
               </button>
           )}
        </div>
        
        {/* Home Indicator */}
        <div className="h-6 bg-white w-full flex justify-center items-center rounded-b-[2.5rem]">
            <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>

      </div>
      
      {/* Background decoration elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );
};