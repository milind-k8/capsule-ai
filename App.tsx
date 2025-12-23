import React, { useState, useEffect } from 'react';
import { LivePreview } from './components/LivePreview';
import { ChatPanel } from './components/ChatPanel';
import { SettingsModal } from './components/SettingsModal';
import { generateLandingPage } from './services/gemini';
import { downloadProject } from './utils/zipUtils';
import { Code, MonitorPlay, Pill, Download, Settings, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatMessage } from './types';

const INITIAL_CODE = `
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Code2, Cpu, LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, desc }) => (
  <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-colors group">
    <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
      <Icon className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-zinc-500">{desc}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-emerald-50 font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-md fixed w-full z-50 top-0 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <span className="font-bold text-black">C</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Capsule</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Platform</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Solutions</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a>
          </div>
          <button className="px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/10 transition-all">
            Login
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>The next generation of dev tools</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-tight"
          >
            Code at the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 animate-pulse">
              Speed of Thought
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Instantly generate production-ready landing pages with our Gemini-powered engine. 
            Styled with Neon Green aesthetics and ready to deploy.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="px-8 py-4 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              Start Generating
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 rounded-full bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors border border-zinc-800">
              Read the Docs
            </button>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
          >
            {[
              { icon: Code2, title: "Clean Code", desc: "Generated output is clean, readable, and standard React code." },
              { icon: Zap, title: "Lightning Fast", desc: "Go from idea to deployed site in seconds, not days." },
              { icon: Cpu, title: "AI Powered", desc: "Leveraging the latest Gemini 3 models for superior reasoning." }
            ].map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
`;

function App() {
  // Initialize state from LocalStorage if available
  const [code, setCode] = useState<string>(() => {
    return localStorage.getItem('capsule_code') || INITIAL_CODE;
  });
  
  const [history, setHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('capsule_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('capsule_code', code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem('capsule_history', JSON.stringify(history));
  }, [history]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setIsSettingsOpen(false);
  };

  const handleGenerate = async (prompt: string) => {
    if (!apiKey && !process.env.API_KEY) {
      setIsSettingsOpen(true);
      // Optional: Add a system message saying key is needed
      const msg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        content: "Please set your API Key to start generating.",
        timestamp: Date.now(),
        isError: true
      };
      setHistory(prev => [...prev, msg]);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };
    setHistory(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const generatedCode = await generateLandingPage(prompt, apiKey);
      setCode(generatedCode);
      setActiveTab('preview');
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "I've generated the landing page based on your requirements. You can see the preview on the right.",
        timestamp: Date.now(),
      };
      setHistory(prev => [...prev, modelMsg]);

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `Something went wrong: ${err.message || "Unknown error"}`,
        timestamp: Date.now(),
        isError: true,
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    downloadProject(code);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#09090b] font-sans overflow-hidden text-slate-200">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />

      {/* Dark Theme Header */}
      <header className="h-14 bg-[#09090b] border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
            <Pill className="w-5 h-5 fill-current rotate-45" />
          </div>
          <span className="text-lg font-medium text-zinc-200 tracking-tight">Capsule.ai</span>
          <span className="text-zinc-700 text-xl font-light mx-1">/</span>
          <span className="text-sm font-medium text-zinc-500">Generator</span>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleDownload}
             className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-emerald-500 text-xs font-medium transition-all group"
           >
             <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
             Export
           </button>
           
           <button
             onClick={() => setIsSettingsOpen(true)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
               apiKey 
                 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                 : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
             }`}
           >
             <Key className="w-3.5 h-3.5" />
             {apiKey ? 'API Key Set' : 'Set API Key'}
           </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Chat & Configuration */}
        <div className="w-[400px] border-r border-zinc-800 flex flex-col shrink-0 z-10 bg-[#09090b]">
          <ChatPanel 
            history={history}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right Area - Preview Canvas */}
        <div className="flex-1 flex flex-col min-w-0 bg-black p-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 px-1">
             <div className="flex items-center gap-6">
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`text-sm font-medium pb-1 transition-colors relative ${
                    activeTab === 'preview' 
                    ? 'text-emerald-400' 
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4" />
                    Preview
                  </div>
                  {activeTab === 'preview' && (
                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full translate-y-2" />
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`text-sm font-medium pb-1 transition-colors relative ${
                    activeTab === 'code' 
                    ? 'text-emerald-400' 
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Code
                  </div>
                   {activeTab === 'code' && (
                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full translate-y-2" />
                  )}
                </button>
             </div>
             <div className="text-xs text-zinc-600">
               {isGenerating ? 'Gemini is thinking...' : 'Ready'}
             </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-zinc-900/50 rounded-2xl shadow-inner border border-zinc-800 overflow-hidden relative">
             {activeTab === 'preview' ? (
               <LivePreview code={code} />
             ) : (
               <div className="absolute inset-0 overflow-auto bg-[#0d1117]">
                 <pre className="p-6 text-sm font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                   <code>{code}</code>
                 </pre>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;