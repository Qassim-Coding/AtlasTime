import React from 'react';
import { Habit, Language, Theme } from '../types';
import { translations } from '../translations';
import { formatDurationShort } from '../utils/dateUtils';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatisticsViewProps {
  habits: Habit[];
  language: Language;
  theme: Theme;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ habits, language, theme }) => {
  const t = translations[language];
  const totalRelapses = habits.reduce((acc, h) => acc + h.relapseHistory.length, 0);
  const bestOverallStreak = habits.reduce((acc, h) => Math.max(acc, h.bestStreak), 0);
  const longestHabitName = habits.length > 0 ? habits.reduce((prev, curr) => prev.bestStreak > curr.bestStreak ? prev : curr).name : 'N/A';

  const textColor = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const labelColor = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className={`text-2xl font-cinzel ${textColor}`}>{t.statsTitle}</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-amber-500/10' : 'from-amber-500/5'} to-transparent border ${theme === 'dark' ? 'border-amber-500/20' : 'border-amber-500/10'} p-6 rounded-2xl flex items-center gap-6`}>
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.statsBest}</p>
            <p className={`text-2xl font-bold mt-1 ${labelColor}`}>{formatDurationShort(bestOverallStreak, language)}</p>
            <p className="text-amber-500 text-[10px] font-bold uppercase mt-1">{longestHabitName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`${cardBg} p-5 rounded-2xl border`}>
            <AlertTriangle className="text-red-500 w-5 h-5 mb-2" />
            <p className="text-slate-500 text-[10px] font-bold uppercase">{t.habitRelapses}</p>
            <p className={`text-2xl font-bold ${labelColor}`}>{totalRelapses}</p>
          </div>
          <div className={`${cardBg} p-5 rounded-2xl border`}>
            <TrendingUp className="text-blue-500 w-5 h-5 mb-2" />
            <p className="text-slate-500 text-[10px] font-bold uppercase">{t.statsActive}</p>
            <p className={`text-2xl font-bold ${labelColor}`}>{habits.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-cinzel text-amber-500/70 uppercase">{t.statsPerformance}</h3>
        {habits.map(h => (
          <div key={h.id} className={`${cardBg} border rounded-xl p-4`}>
            <div className="flex justify-between items-center mb-3">
              <span className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{h.name}</span>
              <span className="text-xs text-slate-500">{h.relapseHistory.length} {t.habitRelapses.toLowerCase()}</span>
            </div>
            <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} w-full h-1.5 rounded-full overflow-hidden`}>
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(100, ( (Date.now() - h.lastResetDate) / (h.bestStreak || 1)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] uppercase font-bold">
              <span className="text-slate-600">Current</span>
              <span className="text-amber-500">{formatDurationShort(Date.now() - h.lastResetDate, language)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsView;
