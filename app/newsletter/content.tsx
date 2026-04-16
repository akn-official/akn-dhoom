'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export function NewsletterPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useGSAP(() => {
    gsap.from('.nl-label', { y: 30, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from('.nl-heading', { y: 50, opacity: 0, duration: 1, delay: 0.4 });
    gsap.from('.nl-desc', { y: 30, opacity: 0, duration: 0.8, delay: 0.6 });
    gsap.from('.nl-form', { y: 40, opacity: 0, duration: 0.8, delay: 0.8 });
  }, { scope: containerRef });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Send to Formspree for email notification
      const response = await fetch('https://formspree.io/f/mdawzbrj', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      // Also save to Supabase for subscriber management
      const supabase = createClient();
      await supabase.from('newsletter_subscribers').insert({
        name: formData.get('name') as string || null,
        email: formData.get('email') as string,
        is_active: true,
        source: 'newsletter_page',
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      <section id="main-content" className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="nl-label inline-block px-4 py-1.5 rounded-full border border-[#C87A4F] text-[#C87A4F] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8">
            Newsletter
          </div>
          <h1 className="nl-heading font-epilogue text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 sm:mb-8">
            Stay In The{' '}
            <span className="text-[#C87A4F]">Loop.</span>
          </h1>
          <p className="nl-desc text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed mb-12 sm:mb-16">
            Get honest insights on digital growth for local businesses, delivered straight to your inbox. No spam. No fluff. Just value.
          </p>

          <div className="nl-form max-w-md mx-auto">
            {status === 'success' ? (
              <div className="p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#2A8B9D]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#2A8B9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-epilogue text-2xl font-bold text-white mb-3">You&apos;re In!</h3>
                <p className="text-zinc-400">We&apos;ll send you our best insights when they&apos;re ready. No spam, ever.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-[#2A8B9D] hover:text-[#C87A4F] font-bold text-sm uppercase tracking-widest transition-colors"
                >
                  Subscribe Another Email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">
                    Something went wrong. Please try again.
                  </div>
                )}
                <div className="space-y-2 text-left">
                  <Label htmlFor="name" className="text-zinc-300">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your Name"
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C87A4F] hover:bg-[#A6623D] text-white font-bold tracking-widest uppercase py-6 disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Subscribing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Subscribe <ArrowRight size={16} />
                    </span>
                  )}
                </Button>
                <p className="text-xs text-zinc-500 text-center">
                  We respect your inbox. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
