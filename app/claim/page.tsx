'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, Loader2, CheckCircle2, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { events } from '@/lib/analytics';
import { CalendlyButton } from '@/components/calendly-button';
import { ActivityCounter } from '@/components/activity-counter';
import { captureUtm, type UtmPayload } from '@/lib/utm';

const DRAFT_KEY = 'akn-claim-draft';
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type Draft = {
  ts: number;
  name: string;
  phone: string;
  business: string;
  businessType: string;
  email: string;
  notes: string;
};

const EMPTY_DRAFT: Omit<Draft, 'ts'> = {
  name: '', phone: '', business: '', businessType: '', email: '', notes: '',
};

export default function ClaimPage() {
  const t = useTranslations('claim');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [draftRestored, setDraftRestored] = useState(false);
  const [form, setForm] = useState<Omit<Draft, 'ts'>>(EMPTY_DRAFT);
  const utmRef = useRef<UtmPayload | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLUListElement>(null);

  // Capture UTM + referrer on mount; hydrate draft if present
  useEffect(() => {
    events.claimFormView();
    utmRef.current = captureUtm();
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Draft;
        if (parsed?.ts && Date.now() - parsed.ts < DRAFT_TTL_MS) {
          const { ts: _ts, ...rest } = parsed;
          const hasContent = Object.values(rest).some((v) => (v || '').trim().length > 0);
          if (hasContent) {
            setForm({ ...EMPTY_DRAFT, ...rest });
            setDraftRestored(true);
          }
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Debounced autosave
  useEffect(() => {
    const hasContent = Object.values(form).some((v) => (v || '').trim().length > 0);
    if (!hasContent) return;
    const id = setTimeout(() => {
      try {
        const payload: Draft = { ts: Date.now(), ...form };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(id);
  }, [form]);

  const updateField = useCallback(
    <K extends keyof typeof EMPTY_DRAFT>(key: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setForm(EMPTY_DRAFT);
    setDraftRestored(false);
  };

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(titleRef.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(subRef.current, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo(benefitsRef.current, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo(cardRef.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5');
  }, { scope: container });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMsg('');

    const utm = utmRef.current || {};

    try {
      const supabase = createClient();
      const { error } = await supabase.from('contact_submissions').insert({
        name: form.name,
        phone: form.phone,
        business_name: form.business,
        business_type: form.businessType || null,
        email: form.email || null,
        message: form.notes || null,
        source: 'free_website_claim',
        status: 'new',
        ...utm,
      });

      if (error) throw error;

      events.claimFormSubmit(form.businessType);

      // Fire-and-forget email alert — never block the user
      fetch('/api/notify-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'claim',
          name: form.name,
          email: form.email,
          phone: form.phone,
          business: form.business,
          business_type: form.businessType,
          notes: form.notes,
        }),
      }).catch(() => {});

      setStatus('success');
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      setForm(EMPTY_DRAFT);
      setDraftRestored(false);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main ref={container} className="min-h-screen bg-[#0A0F1C] text-zinc-50 overflow-hidden">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2A8B9D]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C87A4F]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#2A8B9D] text-sm font-bold uppercase tracking-widest mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t('back_home')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
            {/* Left — pitch */}
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C87A4F]/10 border border-[#C87A4F]/30 text-[#C87A4F] text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} />
                {t('badge')}
              </div>
              <h1
                ref={titleRef}
                className="opacity-0 font-epilogue text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[1.05] mb-6"
              >
                {t('headline_before')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A8B9D] to-[#C87A4F]">
                  {t('headline_accent')}
                </span>
              </h1>
              <p ref={subRef} className="opacity-0 text-base sm:text-lg text-zinc-300 leading-relaxed mb-8">
                {t('intro')}
              </p>
              <ul ref={benefitsRef} className="opacity-0 space-y-4">
                {[t('benefit_1'), t('benefit_2'), t('benefit_3'), t('benefit_4'), t('benefit_5')].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-zinc-200">
                    <CheckCircle2 size={20} className="text-[#2A8B9D] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ActivityCounter />
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 mb-3 uppercase tracking-widest font-bold">Rather talk first?</p>
                <CalendlyButton />
              </div>
            </div>

            {/* Right — form */}
            <div ref={cardRef} className="opacity-0 lg:col-span-3">
              {status === 'success' ? (
                <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl">
                  <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#2A8B9D]/20 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-[#2A8B9D]" />
                    </div>
                    <h3 className="font-epilogue text-2xl sm:text-3xl font-bold text-white mb-4">
                      {t('success_title')}
                    </h3>
                    <p className="text-zinc-300 text-lg mb-2">{t('success_line1')}</p>
                    <p className="text-zinc-400 mb-8">
                      {t('success_line2')}
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-[#2A8B9D] to-[#3ab0c5] text-white hover:shadow-[0_0_30px_-5px_rgba(42,139,157,0.6)] transition-shadow"
                    >
                      {t('back_home')}
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl text-white font-epilogue">
                      {t('card_title')}
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      {t('card_description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      {draftRestored && (
                        <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-[#2A8B9D]/10 border border-[#2A8B9D]/30 text-[#89c9d5] text-sm">
                          <span>We saved your progress — continue where you left off.</span>
                          <button
                            type="button"
                            onClick={clearDraft}
                            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[#2A8B9D] hover:text-white transition-colors"
                          >
                            <RotateCcw size={12} />
                            Start Fresh
                          </button>
                        </div>
                      )}
                      {status === 'error' && (
                        <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">
                          {errorMsg || 'Something went wrong.'} Please try again or WhatsApp us at{' '}
                          <a href="https://wa.me/919840311092" className="underline text-red-200">
                            +91 98403 11092
                          </a>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-zinc-300">
                            {t('name')} <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Full name"
                            value={form.name}
                            onChange={updateField('name')}
                            className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-zinc-300">
                            {t('phone')} <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="+91 98xxx xxxxx"
                            value={form.phone}
                            onChange={updateField('phone')}
                            className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business" className="text-zinc-300">
                          {t('business')} <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="business"
                          name="business"
                          required
                          placeholder="Your business or brand"
                          value={form.business}
                          onChange={updateField('business')}
                          className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessType" className="text-zinc-300">
                          {t('business_type')}
                        </Label>
                        <select
                          id="businessType"
                          name="businessType"
                          value={form.businessType}
                          onChange={updateField('businessType')}
                          className="flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8B9D]"
                        >
                          <option value="" disabled>Select category</option>
                          <option value="retail">Retail</option>
                          <option value="food_beverage">Food &amp; Beverage</option>
                          <option value="professional_services">Professional Services</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="education">Education</option>
                          <option value="real_estate">Real Estate</option>
                          <option value="salon_beauty">Salon &amp; Beauty</option>
                          <option value="automotive">Automotive</option>
                          <option value="hospitality">Hospitality</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-300">{t('email_optional')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={updateField('email')}
                          className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-zinc-300">{t('notes_optional')}</Label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          placeholder="Current website, social handles, or what you're hoping for…"
                          value={form.notes}
                          onChange={updateField('notes')}
                          className="flex w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8B9D] resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#C87A4F] via-[#e08a5c] to-[#C87A4F] bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-bold tracking-widest uppercase py-6 disabled:opacity-80 transition-all duration-500"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            {t('submitting')}
                          </span>
                        ) : (
                          t('submit')
                        )}
                      </Button>
                      <p className="text-center text-xs text-zinc-500">
                        {t('consent')}
                      </p>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
