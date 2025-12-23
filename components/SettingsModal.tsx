import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [key, setKey] = useState(currentKey);

  useEffect(() => {
    setKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-emerald-400">
               <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                 <Key className="w-5 h-5" />
               </div>
               <h2 className="text-lg font-semibold text-white">API Configuration</h2>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-700 font-mono"
              />
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-800/50">
               <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                 To use Capsule, you need a Gemini API key. Your key is stored locally in your browser and never sent to our servers.
               </p>
               <a 
                 href="https://aistudio.google.com/app/apikey" 
                 target="_blank" 
                 rel="noreferrer"
                 className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20"
               >
                 Get API Key <ExternalLink className="w-3 h-3" />
               </a>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(key)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};