import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Volume2, VolumeX, Maximize2, Copy, Check, Brain, Globe, Cpu } from 'lucide-react';
import { generateSiddhiResponse, SiddhiResponse, ChatMessage, SiddhiStorageManager } from '@/services/siddhiAi';
import { siddhiAudio } from '@/utils/siddhiAudioPlayer';
import { useNavigate } from 'react-router-dom';

export const SiddhiWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<'siddhi-omni' | 'siddhi-reasoning' | 'siddhi-search' | 'siddhi-code'>('siddhi-omni');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      modelUsed: 'Siddhi 4.0 Omni',
      text: 'Hello! I am Siddhi AI, your high-performance intelligent assistant. What strategy, search query, or code architecture can I help you build today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');

    // Generate Divine / Professional AI Response
    setTimeout(() => {
      const assistantMsg = generateSiddhiResponse(textToSend, selectedModel);
      setMessages(prev => [...prev, assistantMsg]);
    }, 400);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSpeak = (text: string) => {
    if (isSpeaking) {
      siddhiAudio.stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      siddhiAudio.speakWisdom(text, () => setIsSpeaking(false));
    }
  };

  return (
    <>
      {/* Floating Trigger Button (ChatGPT style Pill) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[999] group flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-bold shadow-2xl shadow-cyan-500/30 border border-cyan-300/40 hover:scale-105 active:scale-95 transition-all duration-300"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-950/20">
          <Bot className="w-4 h-4 text-slate-950 font-bold" />
        </div>
        <span className="text-sm font-bold tracking-wide">Siddhi AI</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-950"></span>
        </span>
      </motion.button>

      {/* Slide-Over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[1000] w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[82vh] flex flex-col rounded-3xl bg-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-2xl text-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <Bot className="w-5 h-5 text-cyan-400 font-bold" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 tracking-wide flex items-center gap-2">
                    Siddhi AI Assistant
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                      v4.0 Omni
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">ChatGPT • Perplexity • Gemini Intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsOpen(false); navigate('/siddhi'); }}
                  title="Expand to Full AI Workspace"
                  className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-cyan-300 border border-slate-700 transition-all"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model Selector Pills */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/90 border-b border-slate-800 overflow-x-auto no-scrollbar">
              {[
                { id: 'siddhi-omni', label: 'Omni 4.0', icon: Cpu },
                { id: 'siddhi-reasoning', label: 'Deep Logic', icon: Brain },
                { id: 'siddhi-search', label: 'Web Search', icon: Globe }
              ].map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedModel === m.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 border border-slate-700/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] p-4 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-slate-950 font-semibold rounded-tr-none shadow-md'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line text-xs">{msg.text}</p>

                    {/* Thinking steps preview */}
                    {msg.thinkingSteps && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
                        <span className="text-cyan-400 font-bold">🧠 Reasoning Steps:</span>
                        {msg.thinkingSteps.slice(0, 2).map((s, idx) => (
                          <p key={idx}>• {s}</p>
                        ))}
                      </div>
                    )}

                    {/* Sources preview */}
                    {msg.sources && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] space-y-1">
                        <span className="text-cyan-400 font-bold block">🌐 Sources:</span>
                        {msg.sources.map((src, idx) => (
                          <a key={idx} href={src.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline block truncate">
                            • {src.title}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
                        <button
                          onClick={() => copyText(msg.text, msg.id)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => toggleSpeak(msg.text)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{isSpeaking ? 'Stop' : 'Recite'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleSend("Analyze a strategy for technical execution.")}
                className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] whitespace-nowrap hover:bg-cyan-500/20"
              >
                🧠 Deep Strategy
              </button>
              <button
                onClick={() => handleSend("Write a TypeScript API utility function.")}
                className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] whitespace-nowrap hover:bg-cyan-500/20"
              >
                💻 Code Architecture
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Siddhi AI (e.g. reasoning, code, search)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:opacity-90 font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
