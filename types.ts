
export type Language = 'en' | 'fr';
export type Theme = 'light' | 'dark';

export interface Habit {
  id: string;
  name: string;
  startDate: number; // timestamp
  lastResetDate: number; // timestamp
  bestStreak: number; // in milliseconds
  relapseHistory: Relapse[];
  journalEntries: JournalEntry[];
  color: string;
  status: 'active' | 'paused';
  quitReason?: string;
}

export interface Relapse {
  id: string;
  timestamp: number;
  reason: string;
  feeling: string;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  note: string;
  mood: 'great' | 'good' | 'neutral' | 'struggling' | 'bad';
}

export enum SpartanStage {
  INFANT = 'INFANT',           // < 7 days
  KNEELING = 'KNEELING',       // 7-14 days
  CHILD = 'CHILD',            // 14-30 days
  TRAINING = 'TRAINING',       // 30-60 days
  TEENAGER = 'TEENAGER',       // 60-90 days
  SOLDIER = 'SOLDIER'          // 180+ days
}

export type ViewState = 'habits' | 'statistics' | 'journal' | 'settings';
