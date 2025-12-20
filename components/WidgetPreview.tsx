import React, { useState } from 'react';
import { Theme, Language, Habit, SpartanStage } from '../types';
import { translations } from '../translations';
import { formatDurationShort, getSpartanStage } from '../utils/dateUtils';
import { Layout, Copy, Check } from 'lucide-react';

interface WidgetPreviewProps {
  theme: Theme;
  language: Language;
  habits: Habit[];
  onWidgetClick: (id: string) => void;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ theme, language, habits, onWidgetClick }) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  
  const habit = habits[0];
  const isPlaceholder = !habit;
  
  const displayHabit = habit || { 
    id: 'placeholder', 
    name: 'Discipline', 
    lastResetDate: Date.now() - 3600000, 
    color: '#f59e0b' 
  };

  const streakMs = Date.now() - displayHabit.lastResetDate;
  const time = formatDurationShort(streakMs, language);
  const stage = getSpartanStage(streakMs);

  const getEmoji = (s: SpartanStage) => {
    switch (s) {
      case SpartanStage.INFANT: return '👶';
      case SpartanStage.KNEELING: return '👦';
      case SpartanStage.CHILD: return '🧒';
      case SpartanStage.TRAINING: return '🧔';
      case SpartanStage.TEENAGER: return '💂‍♂️';
      case SpartanStage.SOLDIER: return '🤴';
      default: return '👶';
    }
  };

  const copyWidgetUrl = () => {
    // Nettoyage de l'URL pour éviter les doubles slashes (ex: domain.com//?view=widget)
    const baseUrl = window.location.origin + window.location.pathname;
    const cleanUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const widgetUrl = `${cleanUrl}?view=widget`;
    
    navigator.clipboard.writeText(widgetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-4 border`}>
      <div className="flex items-center gap-3 mb-4">
        <Layout className="w-5 h-5 text-amber-500" />
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase">{t.settingsWidget}</h3>
          <p className="text-[10px] text-slate-500">{t.settingsWidgetDesc}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <button 
          onClick={() => !isPlaceholder && onWidgetClick(displayHabit.id)}
          disabled={isPlaceholder}
          className="group relative w-32 h-32 bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-1 active:scale-95 transition-all hover:border-amber-500/50 mb-4"
        >
           <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 rounded-3xl transition-colors"></div>
           
           <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 text-xl font-bold mb-1">
             {getEmoji(stage)}
           </div>
           <p className="text-slate-200 text-[10px] uppercase font-bold tracking-tighter truncate w-full relative z-10">
             {displayHabit.name}
           </p>
           <p className="text-amber-500 font-mono text-sm font-bold tracking-tight leading-none relative z-10">
             {time}
           </p>
           <div className="mt-1 h-0.5 w-8 bg-amber-500/30 rounded-full"></div>
        </button>

        <button 
          onClick={copyWidgetUrl}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
            copied ? 'bg-green-500 text-slate-950' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy Widget URL'}
        </button>
        
        <p className="text-[9px] text-slate-500 italic text-center mt-3 leading-tight">
          Use an app like <span className="text-amber-500 font-bold">"Web Widget"</span> on the Play Store and paste this URL to get a home-screen box.
        </p>
      </div>
    </div>
  );
};

export default WidgetPreview;
