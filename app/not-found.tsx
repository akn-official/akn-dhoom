'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.nf-code', { y: 60, opacity: 0, duration: 1, delay: 0.2, ease: 'power4.out' });
    gsap.from('.nf-heading', { y: 40, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
    gsap.from('.nf-desc', { y: 30, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    gsap.from('.nf-cta', { y: 20, opacity: 0, duration: 0.8, delay: 0.8, ease: 'power3.out', stagger: 0.1 });
    gsap.from('.nf-links', { y: 20, opacity: 0, duration: 0.8, delay: 1.1, ease: 'power3.out' });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1C] text-zinc-50 flex items-center justify-center px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2A8B9D]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C87A4F]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <p className="nf-code font-epilogue text-8xl sm:text-9xl md:text-[12rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#2A8B9D] via-[#C87A4F] to-[#2A8B9D] leading-none mb-4">
          404
        </p>
        <h1 className="nf-heading font-epilogue text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4 sm:mb-6">
          Page Not Found
        </h1>
        <p className="nf-desc text-lg sm:text-xl text-zinc-400 max-w-md mx-auto leading-relaxed mb-8 sm:mb-10">
          The page you&apos;re looking for doesn&apos;t exist — but we&apos;re still giving away free websites to early clients.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="/claim"
            className="nf-cta group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#C87A4F] via-[#e08a5c] to-[#C87A4F] bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-bold text-sm tracking-widest uppercase transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(200,122,79,0.6)]"
          >
            <Sparkles size={16} /> Claim a Free Website
          </Link>
          <Link
            href="/"
            className="nf-cta inline-flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-zinc-200 hover:border-zinc-500 font-bold text-sm tracking-widest uppercase transition-colors group"
          >
            Back to Home <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        <div className="nf-links flex items-center justify-center gap-6 text-xs sm:text-sm text-zinc-500 flex-wrap">
          <Link href="/founders" className="hover:text-[#2A8B9D] transition-colors">Founders</Link>
          <span className="text-zinc-700">&middot;</span>
          <Link href="/insights" className="hover:text-[#2A8B9D] transition-colors">Insights</Link>
          <span className="text-zinc-700">&middot;</span>
          <Link href="/work" className="hover:text-[#2A8B9D] transition-colors">Our Work</Link>
          <span className="text-zinc-700">&middot;</span>
          <Link href="/careers" className="hover:text-[#2A8B9D] transition-colors">Careers</Link>
        </div>
      </div>
    </div>
  );
}
