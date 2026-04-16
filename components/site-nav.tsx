'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { MobileNav } from '@/components/mobile-nav';
import { scrollToId } from '@/lib/scroll';
import { events } from '@/lib/analytics';

export function SiteNav() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const ctaRef = useRef<HTMLButtonElement>(null);
  const linksWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Magnetic CTA pull
  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 120;
      if (dist < radius) {
        const pull = (1 - dist / radius) * 10;
        btn.style.transform = `translate3d(${(dx / dist) * pull}px, ${(dy / dist) * pull}px, 0)`;
      } else {
        btn.style.transform = 'translate3d(0,0,0)';
      }
    };
    const onLeave = () => { btn.style.transform = 'translate3d(0,0,0)'; };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Cursor-proximity text-pop on each nav link
  useEffect(() => {
    const wrap = linksWrapRef.current;
    if (!wrap) return;
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    const links = Array.from(wrap.querySelectorAll<HTMLElement>('.nav-pop'));
    const radius = 90;

    const onMove = (e: MouseEvent) => {
      for (const el of links) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < radius) {
          const t = 1 - dist / radius;
          const scale = 1 + t * 0.55;
          const lift = -t * 4;
          el.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
          el.style.color = '#ffffff';
        } else {
          el.style.transform = 'translate3d(0, 0, 0) scale(1)';
          el.style.color = '';
        }
      }
    };
    const onLeave = () => {
      for (const el of links) {
        el.style.transform = 'translate3d(0, 0, 0) scale(1)';
        el.style.color = '';
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    if (isHome) {
      e.preventDefault();
      scrollToId(targetId);
    }
  };

  const navLinks = [
    { title: t('founders'), id: 'about', href: isHome ? '#about' : '/#about' },
    { title: t('services'), id: 'services', href: isHome ? '#services' : '/#services' },
    { title: t('work'), id: 'work', href: isHome ? '#work' : '/#work' },
    { title: t('insights'), id: 'insights', href: '/insights' },
  ];

  const goToClaim = () => {
    events.navCtaClick();
    router.push('/claim');
  };

  // Admin + portal have their own headers — hide the public nav there.
  if (pathname.startsWith('/admin') || pathname.startsWith('/portal')) {
    return null;
  }

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#2A8B9D] focus:text-white focus:px-4 focus:py-2 focus:rounded-md">
        {t('skip_to_content')}
      </a>

      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'top-3 sm:top-4' : 'top-4 sm:top-6'}`}
        aria-label="Primary"
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled
              ? 'max-w-5xl 3xl:max-w-6xl h-12 lg:h-14 px-3 sm:px-4 lg:px-5 bg-[#0A0F1C]/55 border-white/12 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7)]'
              : 'max-w-6xl 3xl:max-w-7xl h-14 lg:h-16 px-4 sm:px-5 lg:px-6 bg-[#0A0F1C]/35 border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.55)]'
          } rounded-full backdrop-blur-2xl backdrop-saturate-150 border`}
          style={{ WebkitBackdropFilter: 'blur(24px) saturate(150%)' }}
        >
          {/* Glass highlight overlay */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-60"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0) 60%)',
            }}
          />

          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => { if (isHome) { e.preventDefault(); scrollToId('main-content', 0); } }}
            className={`relative z-10 flex items-center shrink-0 transition-transform duration-500 hover:scale-[1.04] ${
              scrolled ? 'w-20 sm:w-24 h-7 sm:h-8' : 'w-24 sm:w-28 h-8 sm:h-9'
            }`}
          >
            <Image
              src="/logo.png"
              alt="Aspire Kinetic Network"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Center nav with cursor-pop */}
          <div
            ref={linksWrapRef}
            className="hidden md:flex items-center gap-5 lg:gap-7 text-[13px] lg:text-sm font-medium tracking-wide relative z-10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className="nav-pop nav-link inline-block text-zinc-200 hover:text-white focus-visible:text-white focus-visible:outline-none will-change-transform"
                style={{ transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1), color 220ms ease' }}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Right cluster */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 relative z-10">
            <button
              ref={ctaRef}
              onClick={goToClaim}
              className={`group relative inline-flex items-center gap-2 rounded-full pl-3.5 pr-1.5 text-xs lg:text-[13px] font-semibold tracking-wide text-white bg-[#0A0F1C]/70 border border-white/10 hover:border-white/30 backdrop-blur-md will-change-transform ${
                scrolled ? 'py-1.5' : 'py-2'
              }`}
              style={{ transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms, background-color 300ms' }}
            >
              <span className="relative z-10">{t('claim_cta')}</span>
              <span className={`relative z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#C87A4F] to-[#e08a5c] shadow-[0_0_18px_-4px_rgba(200,122,79,0.9)] ${scrolled ? 'w-6 h-6' : 'w-7 h-7'}`}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="translate-x-0 group-hover:translate-x-0.5 transition-transform">
                  <path d="M2 6h7M6 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>

          <div className="md:hidden relative z-10">
            <MobileNav />
          </div>
        </div>
      </nav>
    </>
  );
}
