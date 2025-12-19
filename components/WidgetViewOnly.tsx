
import React, { useState, useEffect } from 'react';
import { Habit, Language, Theme, SpartanStage } from '../types';
import { formatDurationShort, getSpartanStage } from '../utils/dateUtils';
import SpartanAvatar from './SpartanAvatar';

interface WidgetViewOnlyProps {
  habits: Habit[];
  language: Language;
  theme: Theme;
}

const WidgetViewOnly: React.FC<WidgetViewOnlyProps> = ({ habits, language, theme }) => {
  const habit = habits[0] || { 
    id: 'demo', 
    name: 'Discipline', 
    lastResetDate: Date.now() - 86400000, 
    color: '#f59e0b' 
  };

  const [timeSince, setTimeSince] = useState(Date.now() - habit.lastResetDate);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSince(Date.now() - habit.lastResetDate);
    }, 1000);
    return () => clearInterval(timer);
  }, [habit.lastResetDate]);

  const stage = getSpartanStage(timeSince);
  const formattedTime = formatDurationShort(timeSince, language);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-transparent p-4">
      <div className="w-full aspect-square bg-slate-950 border-2 border-slate-800 rounded-[40px] p-6 flex flex-col items-center justify-center text-center shadow-2xl">
        <SpartanAvatar stage={stage} language={language} theme="dark" size="lg" />
        <div className="mt-4">
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1 truncate px-2">
            {habit.name}
          </p>
          <p className="text-amber-500 font-mono text-2xl font-bold tracking-tighter leading-none">
            {formattedTime}
          </p>
        </div>
        <div className="mt-4 w-12 h-1 bg-amber-500/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default WidgetViewOnly;
