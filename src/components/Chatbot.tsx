import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, X, MessageCircle, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import { chatWithEcoBot } from '../services/gemini';

export function Chatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: "Hi! I'm EcoBot. Ask me about EcoPulse features or how to live more sustainably!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);
    
    try {
      const reply = await chatWithEcoBot(userMsg, chatMessages);
      setChatMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-[2rem] shadow-2xl border border-gray-100 mb-4 flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-green-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Leaf size={20} />
                </div>
                <div>
                  <h4 className="font-black">EcoBot</h4>
                  <p className="text-xs text-green-100 font-medium">Powered by Gemini</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm font-medium",
                    msg.role === 'user' 
                      ? "bg-green-700 text-white rounded-tr-sm" 
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about EcoPulse or sustainability..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <button 
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-green-700 text-white p-3 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-16 h-16 bg-green-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200 hover:scale-105 hover:bg-green-600 transition-all"
      >
        {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
