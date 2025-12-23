import React, { useRef, useEffect } from 'react';
import { PromptInput } from './PromptInput';
import { ChatMessage } from '../types';
import { Bot, User, Sparkles, Loader2, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatPanelProps {
  history: ChatMessage[];
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
  history, 
  onGenerate, 
  isGenerating
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when history changes or generating starts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isGenerating]);

  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      {/* Chat History Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth custom-scrollbar"
      >
        <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
               <Pill className="w-6 h-6 rotate-45" />
            </div>
            <h3 className="text-zinc-200 font-medium mb-2">Welcome to Capsule</h3>
            <p className="text-sm text-zinc-500 max-w-[260px] mx-auto leading-relaxed">
               Describe the landing page you want to build, and I'll generate the React code for you.
            </p>
        </div>

        {history.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
              msg.role === 'user' 
                ? 'bg-zinc-800 text-zinc-400' 
                : 'bg-emerald-600 text-black shadow-lg shadow-emerald-500/30'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                msg.role === 'user'
                  ? 'bg-zinc-800 text-zinc-100 rounded-tr-none border-zinc-700'
                  : 'bg-zinc-900/50 text-zinc-300 rounded-tl-none border-zinc-800'
              } ${msg.isError ? 'bg-red-900/20 border-red-900/30 text-red-400' : ''}`}>
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Loading State / Progress Steps */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-3"
            >
               <div className="w-8 h-8 rounded-full bg-emerald-600 text-black flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-emerald-500/20">
                  <Bot className="w-4 h-4" />
               </div>
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl rounded-tl-none p-4 shadow-sm w-full max-w-[85%]">
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium text-zinc-300">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Generating your landing page...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-emerald-500"
                         initial={{ width: "0%" }}
                         animate={{ width: "100%" }}
                         transition={{ duration: 4, ease: "linear" }}
                       />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500">
                      <span>Analyzing requirements</span>
                      <span>Writing code</span>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#09090b] border-t border-zinc-800/50">
         <PromptInput onGenerate={onGenerate} isGenerating={isGenerating} />
      </div>
    </div>
  );
};