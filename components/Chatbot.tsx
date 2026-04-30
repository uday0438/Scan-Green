import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Leaf, Minimize2, Loader2, Mic } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithGreeny } from '../services/geminiService';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Greeny 🌱, your sustainability assistant. Ask me anything about ScanGreen or how to live plastic-free!" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // --- Voice Synthesis (Text to Speech) ---
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1; // Friendly pitch
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Voice Recognition (Speech to Text) ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Try Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSendMessageFromVoice(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSendMessageFromVoice = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const responseText = await chatWithGreeny(messages, text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      speakText(responseText); // Speak the response!
    } catch (error) {
      const errText = "Sorry, I had trouble reaching the cloud. Try again later! ☁️";
      setMessages(prev => [...prev, { role: 'model', text: errText }]);
      speakText(errText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const responseText = await chatWithGreeny(messages, userMsg.text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      speakText(responseText); // Speak response on typing too!
    } catch (error) {
      const errText = "Sorry, I had trouble reaching the cloud. Try again later! ☁️";
      setMessages(prev => [...prev, { role: 'model', text: errText }]);
      speakText(errText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[380px] h-[500px] bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in ring-1 ring-slate-900/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Greeny AI</h3>
                <span className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="Minimize">
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3.5 text-sm leading-relaxed rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about ScanGreen..." 
                className="w-full pl-4 pr-24 py-3 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
              />
              
              <div className="absolute right-2 top-2 flex items-center gap-1">
                {/* Voice Button */}
                <button 
                  type="button"
                  onClick={startListening}
                  disabled={isLoading}
                  className={`p-1.5 rounded-lg transition-all shadow-sm ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-100'
                  }`}
                  title="Speak to Greeny"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button 
                  type="submit" 
                  disabled={!inputValue.trim() || isLoading}
                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-br from-emerald-500 to-teal-600 animate-bounce-slow'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </button>
      
      {/* Tooltip for FAB (only when closed) */}
      {!isOpen && (
        <span className="absolute right-16 top-3 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Ask Greeny 🌱
        </span>
      )}
    </div>
  );
};