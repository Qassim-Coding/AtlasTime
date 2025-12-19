
import React, { useState } from 'react';
import { QUOTES } from '../quotes';
import { Quote as QuoteIcon } from 'lucide-react';
import { Theme, Language } from '../types';
import { translations } from '../translations';

interface MotivationalQuoteProps {
  theme?: Theme;
  language?: Language;
}

const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ theme = 'dark', language = 'en' }) => {
  const t = translations[language];
  const getInitialIndex = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return dayOfYear % QUOTES.length;
  };

  const [currentIndex, setCurrentIndex] = useState(getInitialIndex());

  const handleNextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const quote = QUOTES[currentIndex];
  const bgClass = theme === 'dark' ? 'bg-slate-900/40 border-amber-500/20' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div 
      onClick={handleNextQuote}
      className={`relative border rounded-2xl p-6 mb-6 overflow-hidden group cursor-pointer hover:opacity-90 active:scale-[0.99] transition-all ${bgClass}`}
    >
      <QuoteIcon className="absolute -left-2 -top-2 w-16 h-16 text-amber-500/5 rotate-12 group-hover:scale-110 transition-transform" />
      
      <div className="relative z-10 space-y-3">
        <p className={`text-sm leading-relaxed italic font-medium text-center animate-in fade-in zoom-in-95 duration-300 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
          "{quote.text}"
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] w-4 bg-amber-500/30"></div>
          <p className="text-amber-500 font-cinzel text-[10px] uppercase tracking-widest font-bold">
            {quote.author}
          </p>
          <div className="h-[1px] w-4 bg-amber-500/30"></div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-amber-500/5 to-transparent rounded-tr-2xl"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tl from-amber-500/5 to-transparent rounded-bl-2xl"></div>
      
      <div className="absolute bottom-2 right-4 text-[8px] text-slate-500 uppercase font-bold tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">
        {t.nextQuote}
      </div>
    </div>
  );
};

export default MotivationalQuote;
