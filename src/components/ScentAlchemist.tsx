
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import { aiService } from '../lib/ai';

const ScentAlchemist: React.FC = () => {
  const { settings, products } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Welcome to the inner sanctum of Nafs. I am your Scent Alchemist. How may I guide your senses today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const recommendation = await aiService.getScentRecommendation(userMsg, products);
    
    setMessages(prev => [...prev, { role: 'ai', text: recommendation }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[100] size-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 group"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <span className="material-symbols-outlined text-black font-bold group-hover:rotate-12 transition-transform">
          {isOpen ? 'close' : 'temp_orient_low'}
        </span>
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-[100] w-[350px] max-h-[500px] flex flex-col bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
            <div className="size-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${settings.primaryColor}22`, color: settings.primaryColor }}>
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
            </div>
            <div>
              <p className="text-sm font-bold">Scent Alchemist</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Nafs Essence AI</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] scroll-smooth custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-primary/20 text-white border border-primary/20' 
                  : 'bg-white/5 text-gray-300'
                }`} style={m.role === 'user' ? { borderColor: `${settings.primaryColor}44` } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl flex gap-1 items-center">
                  <div className="size-1 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="size-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="size-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-white/[0.02]">
            <div className="relative">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask the Alchemist..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-4 pr-10 text-xs outline-none focus:border-primary transition-colors"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform"
                style={{ color: settings.primaryColor }}
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScentAlchemist;
