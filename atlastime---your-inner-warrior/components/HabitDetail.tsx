
import React, { useState, useEffect } from 'react';
import { Habit, SpartanStage, Relapse, JournalEntry, Language, Theme } from '../types';
import { translations } from '../translations';
import { getSpartanStage, formatDurationShort } from '../utils/dateUtils';
import SpartanAvatar from './SpartanAvatar';
import { ArrowLeft, History, RotateCcw, Book, Trash2, ShieldCheck, Quote, FastForward } from 'lucide-react';
import StatsGraph from './StatsGraph';
import TrophySection from './TrophySection';
import HabitCalendar from './HabitCalendar';

interface HabitDetailProps {
  habit: Habit;
  language: Language;
  theme: Theme;
  isDebug: boolean;
  initialRelapseOpen?: boolean;
  onBack: () => void;
  onUpdate: (habit: Habit) => void;
  onDelete: () => void;
}

const HabitDetail: React.FC<HabitDetailProps> = ({ 
  habit, 
  language, 
  theme, 
  isDebug, 
  initialRelapseOpen = false,
  onBack, 
  onUpdate, 
  onDelete 
}) => {
  const t = translations[language];
  const [timeSince, setTimeSince] = useState(Date.now() - habit.lastResetDate);
  const [isRelapsing, setIsRelapsing] = useState(initialRelapseOpen);
  const [relapseNote, setRelapseNote] = useState('');
  const [relapseFeeling, setRelapseFeeling] = useState('frustrated');
  const [journalNote, setJournalNote] = useState('');
  const [journalMood, setJournalMood] = useState<JournalEntry['mood']>('neutral');
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'journal'>('overview');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSince(Date.now() - habit.lastResetDate);
    }, 1000);
    return () => clearInterval(timer);
  }, [habit.lastResetDate]);

  useEffect(() => {
    if (initialRelapseOpen) setIsRelapsing(true);
  }, [initialRelapseOpen]);

  const handleReset = () => {
    // Haptic feedback for relapse (Heavy double pulse)
    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);

    const currentStreak = Date.now() - habit.lastResetDate;
    const newBest = Math.max(habit.bestStreak, currentStreak);
    
    const newRelapse: Relapse = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      reason: relapseNote,
      feeling: relapseFeeling
    };

    onUpdate({
      ...habit,
      lastResetDate: Date.now(),
      bestStreak: newBest,
      relapseHistory: [newRelapse, ...habit.relapseHistory]
    });
    
    setIsRelapsing(false);
    setRelapseNote('');
  };

  const handleTimeTravel = (days: number) => {
    const msToAdd = days * 24 * 60 * 60 * 1000;
    onUpdate({
      ...habit,
      lastResetDate: habit.lastResetDate - msToAdd
    });
  };

  const handleAddJournal = () => {
    if (!journalNote.trim()) return;
    if (navigator.vibrate) navigator.vibrate(20);

    const newEntry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      note: journalNote,
      mood: journalMood
    };
    onUpdate({
      ...habit,
      journalEntries: [newEntry, ...habit.journalEntries]
    });
    setJournalNote('');
  };

  const stage = getSpartanStage(timeSince);
  const cardBg = theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className={`p-2 -ml-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} hover:text-amber-500`}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-cinzel text-amber-500">{habit.name}</h2>
        <button onClick={() => { if(confirm(t.confirmDelete)) onDelete(); }} className="p-2 text-slate-700 hover:text-red-500">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center mb-8 text-center">
        <SpartanAvatar stage={stage} language={language} theme={theme} size="xl" />
        <h3 className={`mt-4 text-3xl font-mono font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{formatDurationShort(timeSince, language)}</h3>
        <p className="text-slate-500 uppercase text-xs tracking-[0.2em] font-bold mt-2">{t.cleanSince}</p>
        
        {isDebug && (
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => handleTimeTravel(7)}
              className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
            >
              <FastForward className="w-3 h-3" /> +7 DAYS
            </button>
            <button 
              onClick={() => handleTimeTravel(30)}
              className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
            >
              <FastForward className="w-3 h-3" /> +30 DAYS
            </button>
          </div>
        )}
      </div>

      <div className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-200'} rounded-xl p-1 mb-6 flex`}>
        {[
          { id: 'overview', icon: ShieldCheck, label: t.tabIntel },
          { id: 'history', icon: History, label: t.tabPast },
          { id: 'journal', icon: Book, label: t.tabNotes },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? theme === 'dark' ? 'bg-slate-800 text-amber-500 shadow-sm' : 'bg-white text-amber-600 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <HabitCalendar habit={habit} theme={theme} language={language} />

          <TrophySection currentStreak={timeSince} theme={theme} language={language} />

          {habit.quitReason && (
            <div className={`${theme === 'dark' ? 'bg-slate-900/80 border-amber-500' : 'bg-white border-amber-500'} border-l-4 p-5 rounded-r-xl relative overflow-hidden group shadow-sm`}>
              <Quote className="absolute -right-2 -top-2 w-16 h-16 text-amber-500/5 rotate-12 group-hover:scale-110 transition-transform" />
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-2 tracking-widest">{t.habitMotivation}</p>
              <p className={`text-sm italic font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                "{habit.quitReason}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className={`${cardBg} p-4 rounded-xl border`}>
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">{t.habitBestStreak}</p>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{formatDurationShort(habit.bestStreak, language)}</p>
            </div>
            <div className={`${cardBg} p-4 rounded-xl border`}>
              <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">{t.habitRelapses}</p>
              <p className={`text-lg font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{habit.relapseHistory.length}</p>
            </div>
          </div>

          <div className={`${cardBg} p-6 rounded-xl border`}>
            <h4 className="text-sm font-cinzel text-amber-500/70 mb-4 uppercase tracking-wider">{t.habitWarProgress}</h4>
            <StatsGraph habit={habit} height={150} />
          </div>

          {!isRelapsing ? (
            <button 
              onClick={() => setIsRelapsing(true)}
              className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all ${
                theme === 'dark' ? 'bg-slate-900 border border-red-900/50 text-red-500' : 'bg-white border border-red-200 text-red-600 shadow-sm'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              {t.habitRelapseBtn}
            </button>
          ) : (
            <div id="relapse-form" className={`${cardBg} border-red-500/30 p-6 rounded-2xl space-y-4 animate-in zoom-in-95 duration-200`}>
              <h4 className="text-lg font-cinzel text-red-500">{t.habitRelapseTitle}</h4>
              <div>
                <label className="text-xs text-slate-500 block mb-2">{t.habitRelapseTrigger}</label>
                <textarea 
                  autoFocus
                  value={relapseNote}
                  onChange={(e) => setRelapseNote(e.target.value)}
                  className={`w-full border rounded-lg p-3 text-sm outline-none focus:border-red-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  placeholder="..."
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm"
                >
                  {t.habitRelapseConfirm}
                </button>
                <button 
                  onClick={() => setIsRelapsing(false)}
                  className={`px-6 font-bold py-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}
                >
                  {t.habitCancel}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {habit.relapseHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-600">No defeats yet. A legendary start!</div>
          ) : (
            habit.relapseHistory.map((relapse) => (
              <div key={relapse.id} className={`${cardBg} p-4 rounded-xl border`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-slate-400">{new Date(relapse.timestamp).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                  <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded uppercase font-bold">Relapse</span>
                </div>
                <p className={`text-sm italic ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>"{relapse.reason || '...'}"</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'journal' && (
        <div className="space-y-6">
          <div className={`${cardBg} p-4 rounded-xl border space-y-3`}>
            <h4 className={`text-sm font-cinzel ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t.journalNew}</h4>
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
              {(['great', 'good', 'neutral', 'struggling', 'bad'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setJournalMood(m)}
                  className={`flex-1 py-1 px-1 rounded text-[9px] font-bold uppercase min-w-[60px] ${
                    journalMood === m ? 'bg-amber-500 text-slate-950' : theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {t[`mood${m.charAt(0).toUpperCase() + m.slice(1)}` as keyof typeof t]}
                </button>
              ))}
            </div>
            <textarea 
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              className={`w-full border rounded-lg p-3 text-sm outline-none focus:border-amber-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              placeholder={t.journalPlaceholder}
              rows={3}
            />
            <button 
              onClick={handleAddJournal}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-lg text-xs"
            >
              {t.journalAdd}
            </button>
          </div>

          <div className="space-y-3">
            {habit.journalEntries.map(entry => (
              <div key={entry.id} className={`${theme === 'dark' ? 'bg-slate-900/30 border-slate-800/50' : 'bg-white border-slate-100 shadow-sm'} p-4 rounded-xl border`}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] text-slate-500">{new Date(entry.timestamp).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    entry.mood === 'great' ? 'bg-green-950 text-green-400' :
                    entry.mood === 'struggling' ? 'bg-orange-950 text-orange-400' :
                    entry.mood === 'bad' ? 'bg-red-950 text-red-400' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {t[`mood${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}` as keyof typeof t]}
                  </span>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{entry.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitDetail;
