
import React from 'react';
import { Theme, Language } from '../types';
import { translations } from '../translations';
import { Trophy, Medal, Award, Star, Shield, Crown, Zap, Flame, Swords } from 'lucide-react';

interface TrophySectionProps {
  currentStreak: number;
  theme: Theme;
  language: Language;
}

const MILESTONES = [
  { id: '24h', label: 'trophy24h', icon: Zap, duration: 24 * 60 * 60 * 1000 },
  { id: '3d', label: 'trophy3d', icon: Flame, duration: 3 * 24 * 60 * 60 * 1000 },
  { id: '1w', label: 'trophy1w', icon: Medal, duration: 7 * 24 * 60 * 60 * 1000 },
  { id: '10d', label: 'trophy10d', icon: Swords, duration: 10 * 24 * 60 * 60 * 1000 },
  { id: '16d', label: 'trophy16d', icon: Shield, duration: 16 * 24 * 60 * 60 * 1000 },
  { id: '1m', label: 'trophy1m', icon: Award, duration: 30 * 24 * 60 * 60 * 1000 },
  { id: '3m', label: 'trophy3m', icon: Star, duration: 90 * 24 * 60 * 60 * 1000 },
  { id: '6m', label: 'trophy6m', icon: Trophy, duration: 180 * 24 * 60 * 60 * 1000 },
  { id: '1y', label: 'trophy1y', icon: Crown, duration: 365 * 24 * 60 * 60 * 1000 },
];

const TrophySection: React.FC<TrophySectionProps> = ({ currentStreak, theme, language }) => {
  const t = translations[language];
  const cardBg = theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className={`${cardBg} p-6 rounded-xl border`}>
      <h4 className="text-sm font-cinzel text-amber-500/70 mb-4 uppercase tracking-wider flex items-center gap-2">
        <Trophy className="w-4 h-4" />
        {t.trophiesTitle}
      </h4>
      <div className="grid grid-cols-3 gap-4">
        {MILESTONES.map((m) => {
          const isEarned = currentStreak >= m.duration;
          const Icon = m.icon;
          return (
            <div 
              key={m.id} 
              className={`flex flex-col items-center text-center space-y-2 transition-all duration-500 ${isEarned ? 'scale-100 opacity-100' : 'scale-90 opacity-20 grayscale'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                isEarned 
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900' 
                  : theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className={`text-[8px] font-bold uppercase tracking-tight leading-none h-4 flex items-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {t[m.label as keyof typeof t]}
              </p>
              <p className="text-[7px] font-mono opacity-50">
                {m.id}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrophySection;
