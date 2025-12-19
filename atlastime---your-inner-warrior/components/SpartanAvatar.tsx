
import React from 'react';
import { SpartanStage, Language, Theme } from '../types';
import { translations } from '../translations';

interface SpartanAvatarProps {
  stage: SpartanStage;
  language?: Language;
  theme?: Theme;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SpartanAvatar: React.FC<SpartanAvatarProps> = ({ stage, language = 'en', theme = 'dark', size = 'md' }) => {
  const t = translations[language];
  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-32 h-32 text-6xl',
    xl: 'w-48 h-48 text-8xl',
  };

  const getEmoji = () => {
    switch (stage) {
      case SpartanStage.INFANT: return '👶';
      case SpartanStage.KNEELING: return '👦'; // Acolyte: Boy 3-5 years
      case SpartanStage.CHILD: return '🧒';    // Child: Standing child
      case SpartanStage.TRAINING: return '🧔'; // Apprentice: Adult with recent beard
      case SpartanStage.TEENAGER: return '💂‍♂️'; // Warrior: Man in armor/guard (Knight-like)
      case SpartanStage.SOLDIER: return '🤴';  // Legend: King with crown
      default: return '👶';
    }
  };

  const getLabel = () => {
    switch (stage) {
      case SpartanStage.INFANT: return t.stageInfant;
      case SpartanStage.KNEELING: return t.stageKneeling;
      case SpartanStage.CHILD: return t.stageChild;
      case SpartanStage.TRAINING: return t.stageTraining;
      case SpartanStage.TEENAGER: return t.stageTeenager;
      case SpartanStage.SOLDIER: return t.stageSoldier;
      default: return '...';
    }
  };

  const getGlowColor = () => {
    if (theme === 'dark') {
      switch (stage) {
        case SpartanStage.INFANT: return 'from-slate-700 to-slate-800';
        case SpartanStage.KNEELING: return 'from-blue-900 to-slate-800';
        case SpartanStage.CHILD: return 'from-emerald-900 to-slate-800';
        case SpartanStage.TRAINING: return 'from-amber-900 to-slate-800';
        case SpartanStage.TEENAGER: return 'from-orange-900 to-slate-800';
        case SpartanStage.SOLDIER: return 'from-yellow-600 to-amber-900 shadow-[0_0_30px_rgba(251,191,36,0.3)]';
        default: return 'from-slate-700 to-slate-800';
      }
    } else {
      switch (stage) {
        case SpartanStage.INFANT: return 'from-slate-100 to-slate-200';
        case SpartanStage.KNEELING: return 'from-blue-100 to-slate-100';
        case SpartanStage.CHILD: return 'from-emerald-100 to-slate-100';
        case SpartanStage.TRAINING: return 'from-amber-100 to-slate-100';
        case SpartanStage.TEENAGER: return 'from-orange-100 to-slate-100';
        case SpartanStage.SOLDIER: return 'from-yellow-200 to-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.2)]';
        default: return 'from-slate-100 to-slate-200';
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`
        ${sizeClasses[size]} 
        rounded-full flex items-center justify-center 
        bg-gradient-to-br ${getGlowColor()}
        border ${theme === 'dark' ? 'border-white/5' : 'border-slate-200 shadow-sm'} relative
      `}>
        <span>{getEmoji()}</span>
        {stage === SpartanStage.SOLDIER && (
          <div className="absolute inset-0 rounded-full animate-pulse border-2 border-amber-400 opacity-20"></div>
        )}
      </div>
      {size !== 'sm' && (
        <span className="mt-2 text-[10px] font-cinzel uppercase tracking-tighter text-amber-500 font-bold">
          {getLabel()}
        </span>
      )}
    </div>
  );
};

export default SpartanAvatar;
