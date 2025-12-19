
import React from 'react';
import { Habit, Language, Theme } from '../types';
import { translations } from '../translations';
import HabitCard from './HabitCard';
import MotivationalQuote from './MotivationalQuote';
import DonateCard from './DonateCard';

interface HabitListProps {
  habits: Habit[];
  language: Language;
  theme: Theme;
  onSelectHabit: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, language, theme, onSelectHabit }) => {
  const t = translations[language];
  
  return (
    <div className="animate-in fade-in duration-500">
      <MotivationalQuote theme={theme} language={language} />
      
      {/* Donation Encart */}
      <DonateCard theme={theme} language={language} />
      
      {habits.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center text-4xl">
            ⚔️
          </div>
          <div>
            <h3 className="text-xl font-cinzel">{t.noHabits}</h3>
            <p className="text-sm">{t.noHabitsSub}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              language={language}
              theme={theme}
              onClick={() => onSelectHabit(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitList;
