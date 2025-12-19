
import React from 'react';
import { ViewState, Language, Theme } from '../types';
import { translations } from '../translations';
import { Home, BarChart2, BookOpen, Settings } from 'lucide-react';

interface NavigationProps {
  activeView: ViewState;
  language: Language;
  theme: Theme;
  onViewChange: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, language, theme, onViewChange }) => {
  const t = translations[language];
  const navItems = [
    { id: 'habits', icon: Home, label: t.navHabits },
    { id: 'statistics', icon: BarChart2, label: t.navStats },
    { id: 'journal', icon: BookOpen, label: t.navJournal },
    { id: 'settings', icon: Settings, label: t.navSettings },
  ];

  const bgClass = theme === 'dark' ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-100';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto backdrop-blur-md border-t px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex justify-between items-center z-50 ${bgClass}`}>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(5);
            onViewChange(item.id as ViewState);
          }}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeView === item.id ? 'text-amber-500 scale-110' : theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
