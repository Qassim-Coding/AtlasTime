import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Language, Theme } from '../types';
import { translations } from '../translations';

interface AddHabitModalProps {
  isOpen: boolean;
  language: Language;
  theme: Theme;
  onClose: () => void;
  onAdd: (name: string, color: string, quitReason: string) => void;
}

const COLORS = [
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ec4899', // pink
];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, language, theme, onClose, onAdd }) => {
  const t = translations[language];
  const [name, setName] = useState('');
  const [quitReason, setQuitReason] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), color, quitReason.trim());
      setName('');
      setQuitReason('');
    }
  };

  const modalBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const inputBg = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-sm ${modalBg} border rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto`}>
        <div className={`flex justify-between items-center mb-6 sticky top-0 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} py-1 z-10`}>
          <h2 className="text-xl font-cinzel text-amber-500">{t.addTitle}</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-amber-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs text-slate-500 uppercase font-bold block mb-2">{t.addLabelName}</label>
            <input 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full ${inputBg} border rounded-xl p-4 outline-none focus:border-amber-500 transition-colors`}
              placeholder="..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase font-bold block mb-2">{t.addLabelReason}</label>
            <textarea 
              value={quitReason}
              onChange={(e) => setQuitReason(e.target.value)}
              className={`w-full ${inputBg} border rounded-xl p-4 outline-none focus:border-amber-500 transition-colors min-h-[100px]`}
              placeholder="..."
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase font-bold block mb-2">{t.addLabelColor}</label>
            <div className="flex justify-between">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    color === c ? `scale-125 ring-2 ${theme === 'dark' ? 'ring-white ring-offset-slate-900' : 'ring-slate-400 ring-offset-white'} ring-offset-4` : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button 
            disabled={!name.trim()}
            onClick={handleAdd}
            className="w-full bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-4 rounded-xl text-lg shadow-lg shadow-amber-500/10 active:scale-95 transition-all"
          >
            {t.addBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;
