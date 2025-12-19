
import React, { useState } from 'react';
import { Habit, Theme, Language } from '../types';
import { translations } from '../translations';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface HabitCalendarProps {
  habit: Habit;
  theme: Theme;
  language: Language;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habit, theme, language }) => {
  const t = translations[language];
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' }).format(currentDate);

  const isRelapseDay = (date: Date) => {
    return habit.relapseHistory.some(r => {
      const d = new Date(r.timestamp);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    });
  };

  const isStreakDay = (date: Date) => {
    // A day is a streak day if it's after the last reset date and before/on today
    const dayStart = new Date(date.setHours(0,0,0,0)).getTime();
    const dayEnd = new Date(date.setHours(23,59,59,999)).getTime();
    const lastReset = habit.lastResetDate;
    const now = Date.now();
    
    return dayEnd >= lastReset && dayStart <= now;
  };

  const days = [];
  // Fill empty spaces for the first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isRelapse = isRelapseDay(date);
    const isStreak = isStreakDay(date);
    const isToday = date.toDateString() === new Date().toDateString();

    // Check if the next day is also a streak day to draw the connector
    const nextDate = new Date(year, month, d + 1);
    const hasConnector = isStreak && isStreakDay(nextDate) && d < daysInMonth && (firstDayOfMonth + d) % 7 !== 0;

    const circleBaseClass = "h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10";
    
    let circleClass = circleBaseClass;
    if (isRelapse) {
      circleClass += theme === 'dark' ? " bg-red-950/50 text-red-500 border border-red-500/50" : " bg-red-100 text-red-600 border border-red-200";
    } else if (isStreak) {
      circleClass += theme === 'dark' ? " bg-amber-500 text-slate-950" : " bg-amber-500 text-slate-950";
    } else {
      circleClass += theme === 'dark' ? " bg-slate-800/50 text-slate-600" : " bg-slate-100 text-slate-400";
    }

    if (isToday && !isStreak && !isRelapse) {
      circleClass += " ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950";
    }

    days.push(
      <div key={d} className="relative flex items-center justify-center mb-2">
        <div className={circleClass}>
          {isRelapse ? <AlertCircle className="w-4 h-4" /> : d}
        </div>
        {hasConnector && (
          <div className="absolute left-[50%] right-[-50%] top-[50%] -translate-y-[50%] h-[2px] bg-amber-500/40 z-0 flex items-center justify-center">
            <LinkIcon className="w-3 h-3 text-amber-500/60" />
          </div>
        )}
      </div>
    );
  }

  const cardBg = theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className={`${cardBg} p-6 rounded-xl border`}>
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-cinzel text-amber-500/70 uppercase tracking-wider flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          {t.calendarTitle}
        </h4>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:text-amber-500"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-[10px] font-bold uppercase min-w-[100px] text-center">{monthName}</span>
          <button onClick={nextMonth} className="p-1 hover:text-amber-500"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {t.daysShort.map(day => (
          <span key={day} className="text-[10px] text-slate-500 font-bold uppercase">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {days}
      </div>
      
      <div className="mt-4 flex gap-4 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-[8px] text-slate-500 font-bold uppercase">Streak</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-[8px] text-slate-500 font-bold uppercase">Relapse</span>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;
