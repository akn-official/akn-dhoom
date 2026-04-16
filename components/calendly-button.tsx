'use client';

import { Calendar } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

// Update this URL once the user sets up Calendly/Cal.com.
// Placeholder routes to WhatsApp so the button is always functional.
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || '';
const FALLBACK_URL = 'https://wa.me/919840311092?text=Hi%20AKN!%20I%27d%20like%20to%20book%20a%20short%20discovery%20call.';

export function CalendlyButton({ className = '', label = 'Book a 15-min chat' }: { className?: string; label?: string }) {
  const target = CALENDLY_URL || FALLBACK_URL;

  const handleClick = () => {
    trackEvent('book_call_click', { provider: CALENDLY_URL ? 'calendly' : 'whatsapp' });
  };

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest border border-zinc-700 text-zinc-200 hover:border-[#2A8B9D] hover:text-[#2A8B9D] transition-colors ${className}`}
    >
      <Calendar size={16} />
      {label}
    </a>
  );
}
