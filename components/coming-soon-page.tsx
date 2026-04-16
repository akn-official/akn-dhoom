'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ComingSoonPageProps {
  label: string;
  heading: string;
  headingAccent: string;
  description: string;
  accentColor?: 'teal' | 'copper';
}

export function ComingSoonPage({ label, heading, headingAccent, description, accentColor = 'teal' }: ComingSoonPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const accent = accentColor === 'teal' ? '#2A8B9D' : '#C87A4F';

  useGSAP(() => {
    gsap.from('.cs-label', { y: 30, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from('.cs-heading', { y: 50, opacity: 0, duration: 1, delay: 0.4 });
    gsap.from('.cs-desc', { y: 30, opacity: 0, duration: 0.8, delay: 0.6 });
    gsap.from('.cs-image', { y: 40, opacity: 0, scale: 0.95, duration: 1, delay: 0.8, ease: 'power3.out' });
    gsap.from('.cs-cta', { y: 20, opacity: 0, duration: 0.6, delay: 1 });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      <section id="main-content" className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="cs-label inline-block px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8" style={{ borderColor: accent, color: accent }}>
            {label}
          </div>
          <h1 className="cs-heading font-epilogue text-4xl sm:text-5xl md:text-7xl 2xl:text-8xl font-bold tracking-tighter mb-6 sm:mb-8">
            {heading}{' '}
            <span style={{ color: accent }}>{headingAccent}</span>
          </h1>
          <p className="cs-desc text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12 sm:mb-16">
            {description}
          </p>

          {/* Coming Soon Image */}
          <div className="cs-image relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <Image
              src="/coming-soon.png"
              alt="Coming Soon"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>

          <div className="cs-cta mt-10 sm:mt-12">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C87A4F] hover:bg-[#A6623D] text-white font-bold tracking-widest uppercase text-sm transition-colors group"
            >
              Get Notified When We Launch <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
