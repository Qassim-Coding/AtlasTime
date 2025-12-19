
import React, { useState, useEffect } from 'react';
import { Habit, ViewState, Language, Theme } from './types';
import { translations } from './translations';
import HabitList from './components/HabitList';
import StatisticsView from './components/StatisticsView';
import JournalView from './components/JournalView';
import Navigation from './components/Navigation';
import AddHabitModal from './components/AddHabitModal';
import HabitDetail from './components/HabitDetail';
import WidgetPreview from './components/WidgetPreview';
import WidgetViewOnly from './components/WidgetViewOnly';
import { Plus, Globe, Moon, Sun, Terminal } from 'lucide-react';

const STORAGE_KEY = 'atlas_time_habits';
const LANG_KEY = 'atlas_time_lang';
const THEME_KEY = 'atlas_time_theme';
const DEBUG_KEY = 'atlas_time_debug';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [activeView, setActiveView] = useState<ViewState>('habits');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isDebug, setIsDebug] = useState(false);
  const [autoRelapse, setAutoRelapse] = useState(false);
  const [isWidgetMode, setIsWidgetMode] = useState(false);

  const t = translations[language];

  // Load data & Check URL Params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'widget') {
      setIsWidgetMode(true);
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHabits(JSON.parse(saved));
    
    const savedLang = localStorage.getItem(LANG_KEY) as Language;
    if (savedLang) setLanguage(savedLang);

    const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
    if (savedTheme) setTheme(savedTheme);

    const savedDebug = localStorage.getItem(DEBUG_KEY) === 'true';
    setIsDebug(savedDebug);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(DEBUG_KEY, String(isDebug));
  }, [isDebug]);

  const addHabit = (name: string, color: string, quitReason: string) => {
    if (navigator.vibrate) navigator.vibrate(50);
    const now = Date.now();
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      startDate: now,
      lastResetDate: now,
      bestStreak: 0,
      relapseHistory: [],
      journalEntries: [],
      color,
      status: 'active',
      quitReason
    };
    setHabits([...habits, newHabit]);
    setIsAddModalOpen(false);
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h));
  };

  const deleteHabit = (id: string) => {
    if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
    setHabits(habits.filter(h => h.id !== id));
    setSelectedHabitId(null);
  };

  const handleWidgetClick = (id: string) => {
    setSelectedHabitId(id);
    setAutoRelapse(true);
  };

  // Render minimal view for Home Screen Widgets
  if (isWidgetMode) {
    return <WidgetViewOnly habits={habits} language={language} theme={theme} />;
  }

  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  const themeClasses = theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#FDFCF8] text-slate-900';

  return (
    <div className={`flex flex-col h-full max-w-md mx-auto shadow-2xl overflow-hidden transition-colors duration-300 ${themeClasses}`}>
      <header className="pt-[calc(1.5rem+env(safe-area-inset-top))] p-6 pb-2">
        <h1 className="text-3xl font-cinzel font-bold text-amber-500 tracking-wider uppercase">{t.appName}</h1>
        <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-sm`}>{t.tagline}</p>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4 pb-32">
        {selectedHabitId && selectedHabit ? (
          <HabitDetail 
            habit={selectedHabit} 
            language={language}
            theme={theme}
            isDebug={isDebug}
            initialRelapseOpen={autoRelapse}
            onBack={() => {
              setSelectedHabitId(null);
              setAutoRelapse(false);
            }}
            onUpdate={updateHabit}
            onDelete={() => deleteHabit(selectedHabit.id)}
          />
        ) : (
          <>
            {activeView === 'habits' && (
              <HabitList 
                habits={habits} 
                language={language}
                theme={theme}
                onSelectHabit={setSelectedHabitId}
              />
            )}
            {activeView === 'statistics' && <StatisticsView habits={habits} language={language} theme={theme} />}
            {activeView === 'journal' && <JournalView habits={habits} language={language} theme={theme} />}
            {activeView === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-cinzel">{t.settingsTitle}</h2>
                
                <div className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-4 border`}>
                  <div className="flex items-center gap-3 mb-4">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <h3 className="text-sm font-semibold text-slate-400 uppercase">{t.settingsTheme}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setTheme('dark')} className={`py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500'}`}>Dark</button>
                    <button onClick={() => setTheme('light')} className={`py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>Light</button>
                  </div>
                </div>

                <div className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-4 border`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-semibold text-slate-400 uppercase">{t.settingsLanguage}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setLanguage('en')} className={`py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500'}`}>English</button>
                    <button onClick={() => setLanguage('fr')} className={`py-2 rounded-lg text-sm font-bold transition-all ${language === 'fr' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>Français</button>
                  </div>
                </div>

                <WidgetPreview 
                  theme={theme} 
                  language={language} 
                  habits={habits} 
                  onWidgetClick={handleWidgetClick}
                />

                <div className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-4 border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-amber-500" />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase">{t.settingsDebug}</h3>
                        <p className="text-[10px] text-slate-500">{t.settingsDebugDesc}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsDebug(!isDebug)} className={`w-10 h-6 rounded-full transition-colors relative ${isDebug ? 'bg-amber-500' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDebug ? 'left-5' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <div className={`${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-4 border`}>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">{t.settingsAccount}</h3>
                  <button 
                    onClick={() => {
                      const data = JSON.stringify(habits, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'atlastime_backup.json';
                      a.click();
                    }}
                    className={`w-full text-left p-3 hover:bg-opacity-80 rounded-lg transition-colors flex items-center gap-3 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-amber-500 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>💾</div>
                    {t.settingsExport}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {activeView === 'habits' && !selectedHabitId && (
        <button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-6 w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-900/20 active:scale-95 transition-transform z-40">
          <Plus className="text-slate-950 w-8 h-8" />
        </button>
      )}

      {!selectedHabitId && <Navigation activeView={activeView} language={language} theme={theme} onViewChange={setActiveView} />}

      <AddHabitModal isOpen={isAddModalOpen} language={language} theme={theme} onClose={() => setIsAddModalOpen(false)} onAdd={addHabit} />
    </div>
  );
};

export default App;
