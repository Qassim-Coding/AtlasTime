
import React from 'react';
import { Habit, Language } from '../types';
import { translations } from '../translations';
import { BookOpen } from 'lucide-react';

interface JournalViewProps {
  habits: Habit[];
  language: Language;
}

const JournalView: React.FC<JournalViewProps> = ({ habits, language }) => {
  const t = translations[language];
  const allEntries = habits.flatMap(h => 
    h.journalEntries.map(e => ({ ...e, habitName: h.name }))
  ).sort((a, b) => b.timestamp - a.timestamp);

  if (allEntries.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-slate-600 space-y-4">
        <BookOpen className="w-16 h-16 opacity-20" />
        <p className="text-sm font-cinzel">{t.journalNoEntries}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-cinzel text-slate-100">{t.journalTitle}</h2>
      <div className="space-y-4">
        {allEntries.map(entry => (
          <div key={entry.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{entry.habitName}</span>
                <p className="text-xs text-slate-500 mt-0.5">{new Date(entry.timestamp).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
              </div>
              <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                entry.mood === 'great' ? 'bg-green-950 text-green-400' :
                entry.mood === 'struggling' ? 'bg-orange-950 text-orange-400' :
                entry.mood === 'bad' ? 'bg-red-950 text-red-400' :
                'bg-slate-800 text-slate-400'
              }`}>
                {t[`mood${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}` as keyof typeof t]}
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed italic text-sm">
              "{entry.note}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalView;
