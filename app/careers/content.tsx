'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, ChevronDown } from 'lucide-react';
import type { Career } from '@/lib/supabase/types';

const TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  'contract': 'Contract',
  'internship': 'Internship',
};

export function CareersPageContent({ careers }: { careers: Career[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useGSAP(() => {
    gsap.from('.careers-label', { y: 30, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from('.careers-heading', { y: 50, opacity: 0, duration: 1, delay: 0.4 });
    gsap.from('.careers-desc', { y: 30, opacity: 0, duration: 0.8, delay: 0.6 });
    gsap.from('.career-card', {
      y: 40, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.8,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  const departments = [...new Set(careers.map(c => c.department))];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      <section id="main-content" className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <div className="careers-label inline-block px-4 py-1.5 rounded-full border border-[#C87A4F] text-[#C87A4F] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8">
              Careers
            </div>
            <h1 className="careers-heading font-epilogue text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 sm:mb-8">
              Join The{' '}
              <span className="text-[#C87A4F]">Movement.</span>
            </h1>
            <p className="careers-desc text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;re building something different. If you&apos;re obsessed with growth, thrive in ambiguity, and want to help local businesses win online — we want you.
            </p>
          </div>

          {departments.map((dept) => (
            <div key={dept} className="mb-12">
              <h2 className="font-epilogue text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-0.5 bg-[#2A8B9D]" />
                {dept}
              </h2>
              <div className="space-y-4">
                {careers.filter(c => c.department === dept).map((career) => (
                  <div
                    key={career.id}
                    className="career-card rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-4 p-5 sm:p-6 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === career.id ? null : career.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-epilogue text-lg sm:text-xl font-bold text-white mb-2">{career.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
                          <span className="flex items-center gap-1.5"><MapPin size={14} /> {career.location}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {TYPE_LABELS[career.type]}</span>
                        </div>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-zinc-500 transition-transform duration-300 shrink-0 ${expandedId === career.id ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {expandedId === career.id && (
                      <div className="px-5 sm:px-6 pb-6 border-t border-zinc-800 pt-5 space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">About This Role</h4>
                          <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{career.description}</div>
                        </div>
                        {career.requirements && (
                          <div>
                            <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-2">Requirements</h4>
                            <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{career.requirements}</div>
                          </div>
                        )}
                        <a
                          href={`mailto:aspirekineticnetwork@gmail.com?subject=Application: ${career.title}&body=Hi AKN team,%0D%0A%0D%0AI'm interested in the ${career.title} position.%0D%0A%0D%0A`}
                          className="inline-flex items-center gap-2 text-[#2A8B9D] hover:text-[#C87A4F] font-bold text-sm uppercase tracking-widest transition-colors group"
                        >
                          Apply Now <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center mt-16 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="font-epilogue text-xl font-bold text-white mb-3">Don&apos;t see your role?</h3>
            <p className="text-zinc-400 text-sm mb-6">We&apos;re always looking for talented people. Send us your portfolio and tell us why you&apos;d be a great fit.</p>
            <a
              href="mailto:aspirekineticnetwork@gmail.com?subject=General Application"
              className="inline-flex items-center gap-2 text-[#C87A4F] hover:text-[#2A8B9D] font-bold text-sm uppercase tracking-widest transition-colors group"
            >
              Get In Touch <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
