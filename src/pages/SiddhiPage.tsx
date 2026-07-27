import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar as MainNavbar } from '@/components/layout/Navbar';
import { 
  Bot, Plus, MessageSquare, Search, Trash2, Edit3, Send, Cpu, Globe, 
  Brain, Code, Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, 
  RotateCcw, ThumbsUp, ThumbsDown, ExternalLink, PanelLeft, User, LogOut, Zap
} from 'lucide-react';
import { 
  SiddhiStorageManager, 
  generateSiddhiResponse, 
  ChatThread, 
  ChatMessage 
} from '@/services/siddhiAi';
import { siddhiAudio } from '@/utils/siddhiAudioPlayer';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function SiddhiPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<'siddhi-omni' | 'siddhi-reasoning' | 'siddhi-search' | 'siddhi-code'>('siddhi-omni');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isSpeakingMsgId, setIsSpeakingMsgId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load User & Chat History on Mount
  useEffect(() => {
    async function loadData() {
      // 1. Auth check
      const { data: { session } } = await supabase.auth.getSession();
      setUserEmail(session?.user?.email || null);

      // 2. Load stored chat threads
      const loadedThreads = await SiddhiStorageManager.getThreads();
      setThreads(loadedThreads);

      if (loadedThreads.length > 0) {
        setActiveThreadId(loadedThreads[0].id);
        setActiveThread(loadedThreads[0]);
      } else {
        createNewThread();
      }
    }
    loadData();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, isGenerating]);

  // Sync active thread changes
  const updateCurrentThread = async (updated: ChatThread) => {
    setActiveThread(updated);
    setThreads(prev => prev.map(t => t.id === updated.id ? updated : t));
    await SiddhiStorageManager.saveThread(updated);
  };

  const createNewThread = () => {
    const newThread: ChatThread = {
      id: `thread-${Date.now()}`,
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: selectedModel,
      messages: []
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setActiveThread(newThread);
  };

  const handleDeleteThread = async (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    await SiddhiStorageManager.deleteThread(threadId);
    const updated = threads.filter(t => t.id !== threadId);
    setThreads(updated);
    if (activeThreadId === threadId) {
      if (updated.length > 0) {
        setActiveThreadId(updated[0].id);
        setActiveThread(updated[0]);
      } else {
        createNewThread();
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isGenerating) return;

    let current = activeThread;
    if (!current) {
      current = {
        id: `thread-${Date.now()}`,
        title: textToSend.slice(0, 30) + '...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        model: selectedModel,
        messages: []
      };
    }

    // Set thread title on first message
    if (current.messages.length === 0) {
      current.title = textToSend.length > 35 ? textToSend.slice(0, 35) + '...' : textToSend;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedWithUser: ChatThread = {
      ...current,
      updatedAt: new Date().toISOString(),
      messages: [...current.messages, userMsg]
    };

    await updateCurrentThread(updatedWithUser);
    if (!queryText) setInputQuery('');
    setIsGenerating(true);

    // Generate response
    setTimeout(async () => {
      const assistantMsg = generateSiddhiResponse(textToSend, selectedModel);
      const updatedWithAssistant: ChatThread = {
        ...updatedWithUser,
        messages: [...updatedWithUser.messages, assistantMsg]
      };
      await updateCurrentThread(updatedWithAssistant);
      setIsGenerating(false);
    }, 600);
  };

  const toggleThinkingAccordion = (msgId: string) => {
    setExpandedThinking(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const toggleSpeakMessage = (msgId: string, text: string) => {
    if (isSpeakingMsgId === msgId) {
      siddhiAudio.stopSpeech();
      setIsSpeakingMsgId(null);
    } else {
      setIsSpeakingMsgId(msgId);
      siddhiAudio.speakWisdom(text, () => setIsSpeakingMsgId(null));
    }
  };

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <MainNavbar />

      <div className="flex-1 pt-20 flex overflow-hidden relative">
        {/* LEFT SIDEBAR (ChatGPT / Perplexity Style) */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-72 sm:w-80 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 z-20 backdrop-blur-2xl"
            >
              {/* Sidebar Header & New Chat */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <Bot className="w-5 h-5 text-slate-950 font-bold" />
                    </div>
                    <span className="font-bold text-base tracking-wide text-slate-100 font-sans">
                      Siddhi <span className="text-cyan-400 font-mono text-xs">AI 4.0</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <PanelLeft className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={createNewThread}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Conversation</span>
                </button>

                {/* Filter Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={e => setSearchFilter(e.target.value)}
                    placeholder="Search past chats..."
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Chat Thread History List */}
              <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-1">
                  Recent Threads
                </span>
                {filteredThreads.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-slate-500 text-center italic">
                    No matching conversations found.
                  </div>
                ) : (
                  filteredThreads.map(thread => (
                    <div
                      key={thread.id}
                      onClick={() => {
                        setActiveThreadId(thread.id);
                        setActiveThread(thread);
                      }}
                      className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                        activeThreadId === thread.id
                          ? 'bg-slate-800/90 text-cyan-300 border border-cyan-500/30 shadow-md'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${activeThreadId === thread.id ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="truncate">{thread.title}</span>
                      </div>

                      <button
                        onClick={e => handleDeleteThread(e, thread.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar Footer User Info */}
              <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {userEmail || 'Guest Mode'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {userEmail ? 'Cloud History Active' : 'Local Storage Only'}
                    </span>
                  </div>
                </div>

                {!userEmail && (
                  <button
                    onClick={() => navigate('/portal')}
                    className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/20"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN VIEWPORT */}
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
          {/* Top Bar Navigation */}
          <div className="h-14 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between bg-slate-900/60 backdrop-blur-xl z-10">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
                  title="Open Sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}

              {/* Model Switcher Pill Dropdown */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                {[
                  { id: 'siddhi-omni', label: 'Omni 4.0', icon: Cpu },
                  { id: 'siddhi-reasoning', label: 'Deep Reasoning', icon: Brain },
                  { id: 'siddhi-search', label: 'Web Search', icon: Globe },
                  { id: 'siddhi-code', label: 'Code Architect', icon: Code }
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedModel === m.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={createNewThread}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Chat</span>
              </button>
            </div>
          </div>

          {/* Messages Stream / Empty Workspace */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
            {(!activeThread || activeThread.messages.length === 0) ? (
              /* Modern Empty State Greeting */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-12">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                  <Bot className="w-10 h-10 text-slate-950 font-bold" />
                </div>

                <div className="space-y-2 max-w-lg">
                  <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                    What would you like to build or solve?
                  </h1>
                  <p className="text-sm text-slate-400 font-light">
                    Siddhi AI combines multi-modal intelligence, deep reasoning pipelines, and real-time search synthesis.
                  </p>
                </div>

                {/* Prompt Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
                  {[
                    {
                      title: "🧠 Deep Strategic Reasoning",
                      desc: "Analyze a complex decision or workplace scenario step-by-step",
                      prompt: "Analyze how to approach a high-stakes career transition with zero risk."
                    },
                    {
                      title: "🌐 Market & Tech Search",
                      desc: "Synthesize latest insights with sources and structured citations",
                      prompt: "What are the latest enterprise automation trends for 2026?"
                    },
                    {
                      title: "💻 Clean Code Architecture",
                      desc: "Generate production-ready TypeScript, Python, or API logic",
                      prompt: "Write a high-throughput async queue system in TypeScript."
                    },
                    {
                      title: "⚡ 7-Day Execution Blueprint",
                      desc: "Build an actionable plan for deep work and high output",
                      prompt: "Create a 7-day blueprint for overcoming burnout and mastering execution."
                    }
                  ].map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(card.prompt)}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-left group shadow-lg"
                    >
                      <h4 className="font-bold text-xs text-cyan-300 group-hover:text-cyan-200">
                        {card.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {card.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Chat Stream */
              activeThread.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] sm:max-w-[85%] p-5 rounded-3xl space-y-4 shadow-xl ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {/* Assistant Header */}
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-slate-300">
                            {msg.modelUsed || 'Siddhi AI'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    {/* Thinking Accordion (Gemini / OpenAI o3 Style) */}
                    {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                        <button
                          onClick={() => toggleThinkingAccordion(msg.id)}
                          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-cyan-400 hover:bg-slate-900/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Brain className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                            <span>Thinking Process ({msg.thinkingSteps.length} steps)</span>
                          </div>
                          {expandedThinking[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {expandedThinking[msg.id] && (
                          <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/80">
                            {msg.thinkingSteps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 text-[11px] text-slate-400 font-mono">
                                <span className="text-cyan-500 font-bold">›</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Web Search Sources (Perplexity Style) */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Sources & Citations
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {msg.sources.map((src, srcIdx) => (
                            <a
                              key={srcIdx}
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all block group"
                            >
                              <span className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-300 truncate block">
                                {src.title}
                              </span>
                              <span className="text-[10px] text-slate-500 truncate block">
                                {src.url}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Text */}
                    <div className="prose prose-invert prose-sm leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Suggested Followups */}
                    {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                      <div className="pt-3 border-t border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Suggested Follow-ups:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedFollowups.map((f, fIdx) => (
                            <button
                              key={fIdx}
                              onClick={() => handleSend(f)}
                              className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-300 text-xs hover:bg-slate-800 hover:border-cyan-500/30 transition-all text-left"
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assistant Action Bar */}
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                          >
                            {copiedMsgId === msg.id ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => toggleSpeakMessage(msg.id, msg.text)}
                            className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isSpeakingMsgId === msg.id ? 'Stop' : 'Recite'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isGenerating && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 max-w-xs">
                <Brain className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Siddhi AI is reasoning & synthesizing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Fixed Prompt Input Footer */}
          <div className="p-4 sm:p-6 bg-slate-900/80 border-t border-slate-800/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto space-y-2">
              <div className="relative flex items-center bg-slate-950 rounded-2xl border border-slate-800 focus-within:border-cyan-500/50 p-2 shadow-2xl transition-all">
                <textarea
                  rows={2}
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Siddhi AI anything (e.g. strategy, code analysis, web synthesis)..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
                />

                <div className="flex items-center gap-2 px-2">
                  <button
                    onClick={() => setSelectedModel(selectedModel === 'siddhi-search' ? 'siddhi-omni' : 'siddhi-search')}
                    className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedModel === 'siddhi-search'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-cyan-300'
                    }`}
                    title="Toggle Web Search Mode"
                  >
                    <Globe className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSend()}
                    disabled={isGenerating || !inputQuery.trim()}
                    className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
                <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for line break.</span>
                <span>Siddhi AI v4.0 Omni • Enterprise Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
