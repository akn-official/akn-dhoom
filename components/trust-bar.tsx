'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Globe, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const trustPoints = [
  {
    icon: Zap,
    value: 'Limited',
    label: 'Free websites available',
    accent: '#C87A4F',
  },
  {
    icon: Globe,
    value: 'Global',
    label: 'Remote-first studio',
    accent: '#C87A4F',
  },
  {
    icon: Clock,
    value: '< 24h',
    label: 'Typical response time',
    accent: '#2A8B9D',
  },
];

export function TrustBar() {
  const wrap = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>('.trust-item');
    items.forEach((el, i) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, { scope: wrap });

  return (
    <section
      ref={wrap}
      className="relative px-4 sm:px-8 py-10 sm:py-14 bg-[#0A0F1C] border-y border-white/5"
      aria-label="Why businesses pick AKN"
    >
      <div className="max-w-5xl 2xl:max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {trustPoints.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.label}
              className="trust-item group relative flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-400"
            >
              <div
                className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl"
                style={{
                  background: `${p.accent}14`,
                  border: `1px solid ${p.accent}40`,
                }}
              >
                <Icon size={18} style={{ color: p.accent }} />
              </div>
              <div className="min-w-0">
                <div className="font-epilogue font-bold text-white text-base sm:text-lg leading-tight tracking-tight">
                  {p.value}
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 uppercase tracking-wider mt-0.5 leading-tight">
                  {p.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
