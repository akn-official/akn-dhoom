'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import type { Insight } from '@/lib/supabase/types';

gsap.registerPlugin(ScrollTrigger);

export function InsightsPageContent({ insights }: { insights: Insight[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = [...new Set(insights.flatMap(i => i.tags))].sort();
  const filtered = activeTag ? insights.filter(i => i.tags.includes(activeTag)) : insights;

  useGSAP(() => {
    gsap.from('.insights-hero-label', { y: 30, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from('.insights-hero-heading', { y: 50, opacity: 0, duration: 1, delay: 0.4 });

    gsap.utils.toArray('.insight-card').forEach((el, i) => {
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
  }, { scope: containerRef, dependencies: [activeTag], revertOnUpdate: true });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      <section id="main-content" className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <div className="insights-hero-label inline-block px-4 py-1.5 rounded-full border border-[#C87A4F] text-[#C87A4F] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
              Insights
            </div>
            <h1 className="insights-hero-heading font-epilogue text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter">
              Straight Talk. <span className="text-[#C87A4F]">Real Value.</span>
            </h1>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 sm:mb-14 justify-center">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase border transition-colors ${
                  activeTag === null
                    ? 'border-[#C87A4F] bg-[#C87A4F]/10 text-[#C87A4F]'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase border transition-colors ${
                    activeTag === tag
                      ? 'border-[#C87A4F] bg-[#C87A4F]/10 text-[#C87A4F]'
                      : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-6">
            {filtered.length === 0 && (
              <p className="text-zinc-500 text-center py-12">No articles found for &ldquo;{activeTag}&rdquo;.</p>
            )}
            {filtered.map((insight) => (
              <Link
                key={insight.id}
                href={`/insights/${insight.slug}`}
                className="insight-card block group rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-[#C87A4F]/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row">
                  {insight.cover_image_url && (
                    <div className="relative w-full md:w-72 aspect-video md:aspect-auto shrink-0 overflow-hidden">
                      <Image
                        src={insight.cover_image_url}
                        alt={insight.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 288px"
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-[#C87A4F] tracking-widest uppercase">{insight.author}</span>
                      <span className="text-zinc-600 text-xs">{formatDate(insight.created_at)}</span>
                    </div>
                    <h2 className="font-epilogue text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-[#C87A4F] transition-colors">
                      {insight.title}
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed">{insight.excerpt}</p>
                    {insight.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {insight.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs text-zinc-500 border border-zinc-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
