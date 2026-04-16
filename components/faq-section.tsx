'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';

export function FaqSection() {
  const t = useTranslations('faq');
  const container = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.faq-heading', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: container.current, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
    gsap.from('.faq-item', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.faq-list', start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  }, { scope: container });

  const items = [
    { q: t.raw('q1'), a: t.raw('a1') },
    { q: t.raw('q2'), a: t.raw('a2') },
    { q: t.raw('q3'), a: t.raw('a3') },
    { q: t.raw('q4'), a: t.raw('a4') },
    { q: t.raw('q5'), a: t.raw('a5') },
    { q: t.raw('q6'), a: t.raw('a6') },
  ];

  return (
    <section
      ref={container}
      id="faq"
      className="relative py-24 sm:py-32 px-4 sm:px-8 bg-[#0A0F1C] overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#2A8B9D]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="faq-heading text-center mb-12 sm:mb-16">
          <h2 className="font-epilogue text-3xl sm:text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tighter mb-4 sm:mb-6 text-white">
            {t('heading')}
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400">{t('subtitle')}</p>
        </div>

        <div className="faq-list space-y-3 sm:space-y-4">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`faq-item rounded-2xl border bg-zinc-900/50 transition-colors ${
                  isOpen ? 'border-[#C87A4F]/50' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                >
                  <span
                    className="font-epilogue text-base sm:text-lg font-bold text-white pr-2"
                    dangerouslySetInnerHTML={{ __html: item.q }}
                  />
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-[#C87A4F] text-white rotate-45' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-zinc-400 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.a }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
