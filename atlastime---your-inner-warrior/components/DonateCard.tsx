
import React from 'react';
import { Heart } from 'lucide-react';
import { Theme, Language } from '../types';
import { translations } from '../translations';

interface DonateCardProps {
  theme: Theme;
  language: Language;
}

const DonateCard: React.FC<DonateCardProps> = ({ theme, language }) => {
  const t = translations[language];
  
  // Update these URLs with your actual donation links
  const PAYPAL_URL = "https://www.paypal.me/yourusername";
  const STRIPE_URL = "https://buy.stripe.com/yourlink";

  const handleDonate = () => {
    // You can choose which one to open or show a choice
    window.open(PAYPAL_URL, '_blank');
  };

  const cardBg = theme === 'dark' ? 'bg-slate-900/40 border-amber-500/20' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`relative border rounded-2xl p-5 mb-6 overflow-hidden group transition-all ${cardBg}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Heart className="w-6 h-6 animate-pulse" fill="currentColor" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-cinzel text-amber-500 font-bold uppercase tracking-wider mb-1">
            {t.donateTitle}
          </h4>
          <p className={`text-[11px] leading-relaxed mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.donateDesc}
          </p>
          <button
            onClick={handleDonate}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-tighter hover:bg-amber-400 transition-colors active:scale-95"
          >
            {t.donateBtn}
          </button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/5 to-transparent rounded-tr-2xl pointer-events-none"></div>
    </div>
  );
};

export default DonateCard;
