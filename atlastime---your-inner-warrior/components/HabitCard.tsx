
import React, { useState, useEffect } from 'react';
import { Habit, Language, Theme } from '../types';
import { translations } from '../translations';
import { getSpartanStage, formatDurationShort } from '../utils/dateUtils';
import SpartanAvatar from './SpartanAvatar';
import { ChevronRight } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  language: Language;
  theme: Theme;
  onClick: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, language, theme, onClick }) => {
  const t = translations[language];
  const [timeSince, setTimeSince] = useState(Date.now() - habit.lastResetDate);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSince(Date.now() - habit.lastResetDate);
    }, 1000);
    return () => clearInterval(timer);
  }, [habit.lastResetDate]);

  const stage = getSpartanStage(timeSince);
  const formattedTime = formatDurationShort(timeSince, language);
  const cardBg = theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm';

  return (
    <div 
      onClick={onClick}
      className={`border rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer hover:border-amber-500/30 group ${cardBg}`}
    >
      <div className="relative">
        <SpartanAvatar stage={stage} language={language} theme={theme} size="sm" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-slate-500 text-[9px] uppercase font-bold tracking-tight mb-0.5">
          {t.commitmentText}
        </p>
        <h3 className={`text-lg font-bold truncate flex items-center gap-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }}></span>
          {habit.name}
        </h3>
        <p className="text-amber-500/90 font-mono text-sm font-bold tracking-tight">
          {formattedTime}
        </p>
        <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">
          {t.stageLabel}
        </p>
      </div>

      <ChevronRight className={`${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} group-hover:text-amber-500 transition-colors`} />
    </div>
  );
};

export default HabitCard;
