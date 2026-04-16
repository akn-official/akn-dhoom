'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Briefcase, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Career } from '@/lib/supabase/types';

type Props = { className?: string };

export function CareersTeaser({ className = '' }: Props) {
  const [careers, setCareers] = useState<Career[]>([]);
  const [hiringEnabled, setHiringEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const supabase = createClient();
        const [careersRes, settingRes] = await Promise.all([
          supabase
            .from('careers')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'hiring_enabled')
            .maybeSingle(),
        ]);
        if (!mounted) return;
        setCareers(careersRes.data || []);
        setHiringEnabled(settingRes.data?.value === 'true');
      } catch {
        // Supabase not ready
      } finally {
        if (mounted) setLoaded(true);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useGSAP(() => {
    if (!loaded || !hiringEnabled || careers.length === 0) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.careers-teaser-heading', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: container.current, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
    gsap.from('.careers-teaser-card', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: container.current, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  }, { scope: container, dependencies: [loaded, hiringEnabled, careers.length] });

  if (!loaded || !hiringEnabled || careers.length === 0) return null;

  return (
    <section
      ref={container}
      id="careers-teaser"
      className={`relative py-24 sm:py-32 px-4 sm:px-8 bg-zinc-950 border-t border-zinc-900 overflow-hidden ${className}`}
    >
      {/* Soft ambient glows */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#C87A4F]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-[#2A8B9D]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl 3xl:max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        <div className="careers-teaser-heading lg:col-span-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C87A4F]/40 bg-[#C87A4F]/5 mb-5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#C87A4F] opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C87A4F]" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#C87A4F]">We&rsquo;re Hiring</span>
          </div>
          <h2 className="font-epilogue text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold tracking-tighter mb-5 text-white">
            Build the future <br />
            <span className="text-[#C87A4F]">with us.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 max-w-md">
            We&rsquo;re a young studio with big ambitions. If you care about craft and growth, we want to hear from you.
          </p>
          <Link
            href="/careers"
            className="group inline-flex items-center gap-2 text-[#C87A4F] hover:text-white font-bold text-sm uppercase tracking-widest transition-colors"
          >
            View All Roles
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="lg:col-span-3 space-y-3 sm:space-y-4">
          {careers.map((c) => (
            <Link
              key={c.id}
              href={`/careers/${c.slug}`}
              className="careers-teaser-card group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-[#C87A4F]/60 transition-colors"
            >
              <div>
                <h3 className="font-epilogue text-lg sm:text-xl font-bold text-white group-hover:text-[#C87A4F] transition-colors mb-2">
                  {c.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={13} />
                    <span className="capitalize">{c.type.replace('-', ' ')}</span>
                  </span>
                  <span className="text-zinc-700">&middot;</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} />
                    {c.location}
                  </span>
                  {c.department && (
                    <>
                      <span className="text-zinc-700">&middot;</span>
                      <span>{c.department}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#C87A4F] text-sm font-semibold shrink-0">
                <span className="hidden sm:inline">Apply</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
