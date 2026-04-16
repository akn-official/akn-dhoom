'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { events } from '@/lib/analytics';

const STORAGE_KEY = 'akn-exit-popup';
const SUPPRESSED_PATHS = ['/admin', '/claim', '/portal'];

export function ExitIntentPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (SUPPRESSED_PATHS.some((p) => pathname?.startsWith(p))) return;
    if (typeof window === 'undefined') return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    const isTouch = window.matchMedia('(hover: none)').matches;

    const show = () => setVisible(true);

    if (isTouch) {
      const timer = setTimeout(show, 45_000);
      return () => clearTimeout(timer);
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    document.addEventListener('mouseout', onMouseLeave);
    return () => document.removeEventListener('mouseout', onMouseLeave);
  }, [pathname]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {}
    setVisible(false);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus('submitting');
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, source: 'exit_intent' });
      if (error && !error.message.includes('duplicate')) throw error;
      events.newsletterSubmit();
      setStatus('success');
      try {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      } catch {}
      setTimeout(() => setVisible(false), 2500);
    } catch {
      setStatus('error');
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        onClick={dismiss}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-labelledby="exit-popup-title"
        className="relative w-full max-w-md rounded-3xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300"
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#2A8B9D]/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-[#2A8B9D]" />
            </div>
            <h3 id="exit-popup-title" className="font-epilogue text-xl font-bold text-white mb-2">
              You&apos;re in.
            </h3>
            <p className="text-sm text-zinc-400">Watch your inbox for real growth tactics — no spam.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Mail size={18} className="text-[#C87A4F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#C87A4F]">Before you go</span>
            </div>
            <h3 id="exit-popup-title" className="font-epilogue text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              Get one growth tactic every week.
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              No fluff. Real playbooks from running a modern growth agency — what&apos;s working, what isn&apos;t, and what to do first.
            </p>
            <form onSubmit={submit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex h-11 w-full rounded-full bg-zinc-950 border border-zinc-800 px-5 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8B9D]"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center justify-center gap-2 h-11 w-full rounded-full bg-gradient-to-r from-[#C87A4F] via-[#e08a5c] to-[#C87A4F] bg-[length:200%_auto] hover:bg-[position:right_center] text-white text-sm font-bold uppercase tracking-widest transition-all duration-500 disabled:opacity-60"
              >
                {status === 'submitting' ? <Loader2 size={16} className="animate-spin" /> : 'Subscribe'}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-400 text-center">Something went wrong. Try again.</p>
              )}
              <button
                type="button"
                onClick={dismiss}
                className="block w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors pt-1"
              >
                No thanks
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
