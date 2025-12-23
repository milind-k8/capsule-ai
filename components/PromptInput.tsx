import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
      setPrompt('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  return (
    <div className="w-full relative">
      <div className="relative bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-zinc-700 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all shadow-sm overflow-hidden">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the landing page you want to create..."
          className="w-full bg-transparent border-none focus:ring-0 resize-none text-zinc-200 placeholder:text-zinc-500 font-sans text-sm leading-relaxed p-4 pr-14 min-h-[56px] max-h-[200px]"
          disabled={isGenerating}
          rows={1}
        />
        <div className="absolute bottom-2 right-2">
          <button
            onClick={() => handleSubmit()}
            disabled={!prompt.trim() || isGenerating}
            className={`p-2 rounded-full flex items-center justify-center transition-all duration-200 ${
              !prompt.trim() || isGenerating
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 scale-100 hover:scale-105 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
      <div className="flex justify-between px-3 mt-2">
        <span className="text-[10px] text-zinc-600 font-medium tracking-wide uppercase">Gemini 3 Pro</span>
        <span className="text-[10px] text-zinc-600">Enter to run</span>
      </div>
    </div>
  );
};