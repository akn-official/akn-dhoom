'use client';

import { useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function LenisScrollTriggerSync() {
  const lenisRef = useRef<ReturnType<typeof useLenis>>(null);

  useLenis((lenis) => {
    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      (window as unknown as { lenis?: unknown }).lenis = lenis;
    }
  });

  useEffect(() => {
    // Sync Lenis scroll position with GSAP ScrollTrigger
    const update = () => ScrollTrigger.update();

    // Connect Lenis scroll events to ScrollTrigger
    const onScroll = () => {
      update();
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Also tell ScrollTrigger to use the scroller proxy
    ScrollTrigger.defaults({ invalidateOnRefresh: true });
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
