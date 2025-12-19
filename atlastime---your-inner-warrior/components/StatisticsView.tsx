
import React from 'react';
import { Habit, Language } from '../types';
import { translations } from '../translations';
import { formatDurationShort } from '../utils/dateUtils';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatisticsViewProps {
  habits: Habit[];
  language: Language;
}

const StatisticsView: React.FC<StatisticsViewProps> = ({ habits, language }) => {
  const t = translations[language];
  const totalRelapses = habits.reduce((acc, h) => acc + h.relapseHistory.length, 0);
  const bestOverallStreak = habits.reduce((acc, h) => Math.max(acc, h.bestStreak), 0);
  const longestHabitName = habits.length > 0 ? habits.reduce((prev, curr) => prev.bestStreak > curr.bestStreak ? prev : curr).name : 'N/A';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-cinzel text-slate-100">{t.statsTitle}</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 p-6 rounded-2xl flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.statsBest}</p>
            <p className="text-2xl font-bold text-white mt-1">{formatDurationShort(bestOverallStreak, language)}</p>
            <p className="text-amber-500 text-[10px] font-bold uppercase mt-1">{longestHabitName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <AlertTriangle className="text-red-500 w-5 h-5 mb-2" />
            <p className="text-slate-500 text-[10px] font-bold uppercase">{t.habitRelapses}</p>
            <p className="text-2xl font-bold text-white">{totalRelapses}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <TrendingUp className="text-blue-500 w-5 h-5 mb-2" />
            <p className="text-slate-500 text-[10px] font-bold uppercase">{t.statsActive}</p>
            <p className="text-2xl font-bold text-white">{habits.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-cinzel text-amber-500/70 uppercase">{t.statsPerformance}</h3>
        {habits.map(h => (
          <div key={h.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-slate-200">{h.name}</span>
              <span className="text-xs text-slate-500">{h.relapseHistory.length} {t.habitRelapses.toLowerCase()}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
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
