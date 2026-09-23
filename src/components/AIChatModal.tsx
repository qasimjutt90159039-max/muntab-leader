import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/apiService';
import { BUSINESS_INFO } from '../data/business';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  'Cash on Delivery available?',
  'Can I personalize with my name?',
  'Where is your Multan workshop?',
  'How to care for genuine leather?',
];

export const AIChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Assalam-o-Alaikum! Welcome to Mutalib's Leather Factory Multan. How can I assist you today with our handcrafted genuine leather collection?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageToSend = input) => {
    const text = messageToSend.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const replyText = await apiService.sendAiMessage(text);
      const aiMsg: Message = {
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        sender: 'ai',
        text: `For immediate assistance, please call our Multan workshop directly at ${BUSINESS_INFO.phone}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#8C5D38] hover:bg-[#6E472A] text-white rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer border border-[#C89D6E]/40"
        aria-label="Open Leather Concierge Chat"
      >
        <Sparkles className="w-5 h-5 text-[#FAF8F5]" />
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider pr-1">
          Leather Concierge
        </span>
      </button>

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-white border border-[#EBE5DF] shadow-2xl rounded-xs flex flex-col h-[520px] max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#1E1511] text-[#FAF8F5] p-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8C5D38] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-white">Mutalib Leather Concierge</h3>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span>Multan Workshop Assistant</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick hotline notice */}
          <div className="bg-[#FAF8F5] px-3 py-1.5 border-b border-[#EBE5DF] flex items-center justify-between text-[11px] text-stone-600">
            <span>Direct Call / WhatsApp:</span>
            <a href={`tel:${BUSINESS_INFO.phone}`} className="font-mono font-bold text-[#8C5D38] hover:underline">
              {BUSINESS_INFO.phone}
            </a>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]/30 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#8C5D38] text-white'
                      : 'bg-white text-stone-800 border border-[#EBE5DF] shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-stone-400 mt-0.5 px-1 font-mono">
                  {m.time}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 text-stone-400 text-xs italic p-2">
                <span className="w-2 h-2 bg-[#8C5D38] rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-[#8C5D38] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-[#8C5D38] rounded-full animate-bounce [animation-delay:0.4s]" />
                <span>Craftsman is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="p-2 bg-white border-t border-[#EBE5DF] overflow-x-auto flex gap-1.5 whitespace-nowrap">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[10px] px-2.5 py-1 bg-[#FAF8F5] border border-[#EBE5DF] text-stone-600 hover:border-[#8C5D38] hover:text-[#8C5D38] rounded-full transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-[#EBE5DF] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask in English or Urdu..."
              className="flex-1 text-xs px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#8C5D38]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-[#8C5D38] hover:bg-[#6E472A] text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
