'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Work } from '@/lib/supabase/types';

gsap.registerPlugin(ScrollTrigger);

export function WorkPageContent({ works }: { works: Work[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.work-hero-label', { y: 30, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from('.work-hero-heading', { y: 50, opacity: 0, duration: 1, delay: 0.4 });

    gsap.utils.toArray('.work-card').forEach((el, i) => {
      gsap.from(el as HTMLElement, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      <section id="main-content" className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <div className="work-hero-label inline-block px-4 py-1.5 rounded-full border border-[#2A8B9D] text-[#2A8B9D] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
              Portfolio
            </div>
            <h1 className="work-hero-heading font-epilogue text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter">
              Our Work. <span className="text-[#2A8B9D]">Real Results.</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {works.map((work) => (
              <div key={work.id} className="work-card group rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors">
                {work.cover_image_url && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={work.cover_image_url}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-6 sm:p-8">
                  {work.client_name && (
                    <span className="text-xs font-bold text-[#C87A4F] tracking-widest uppercase mb-2 block">{work.client_name}</span>
                  )}
                  <h2 className="font-epilogue text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#2A8B9D] transition-colors">
                    {work.title}
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">{work.description}</p>
                  {work.services_used.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {work.services_used.map((service) => (
                        <span key={service} className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-zinc-700 text-zinc-400">
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                  {work.results && (
                    <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                      <span className="text-xs font-bold text-[#2A8B9D] tracking-widest uppercase block mb-1">Results</span>
                      <p className="text-zinc-300 text-sm">{work.results}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C87A4F] hover:bg-[#A6623D] text-white font-bold tracking-widest uppercase text-sm transition-colors group"
            >
              Start Your Project <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
