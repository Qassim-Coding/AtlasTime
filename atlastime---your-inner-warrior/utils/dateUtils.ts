
import { SpartanStage, Language } from '../types';
import { translations } from '../translations';

export const getSpartanStage = (ms: number): SpartanStage => {
  const days = ms / (1000 * 60 * 60 * 24);
  if (days < 7) return SpartanStage.INFANT;        // 0-7 days: baby
  if (days < 14) return SpartanStage.KNEELING;     // 1-2 weeks: on knees
  if (days < 30) return SpartanStage.CHILD;        // 2-4 weeks: stands up
  if (days < 60) return SpartanStage.TRAINING;     // 1-2 months: ~5 years old
  if (days < 90) return SpartanStage.TEENAGER;     // 2-3 months: ~10 years old practicing
  if (days < 180) return SpartanStage.TEENAGER;    // 3-6 months: teenager solid with shield
  return SpartanStage.SOLDIER;                      // 6+ months: adult soldier
};

export const formatDurationShort = (ms: number, language: Language = 'en'): string => {
  const t = translations[language];
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}${t.timeDays} ${hours % 24}${t.timeHours} ${minutes % 60}${t.timeMinutes}`;
  if (hours > 0) return `${hours}${t.timeHours} ${minutes % 60}${t.timeMinutes} ${seconds % 60}${t.timeSeconds}`;
  return `${minutes}${t.timeMinutes} ${seconds % 60}${t.timeSeconds}`;
};

export const formatDurationDetailed = (ms: number, language: Language = 'en'): string => {
  const t = translations[language];
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return `${days} ${t.timeDaysFull}, ${hours % 24} ${t.timeHoursFull}, ${minutes % 60} ${t.timeMinutesFull}`;
};
