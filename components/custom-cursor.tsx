'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices - disable custom cursor on mobile/tablet
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
    if (hasTouch) return;

    // Add cursor-none only on non-touch devices
    document.body.classList.add('cursor-none');

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const onMouseEnterLink = () => {
      gsap.to(cursor, { scale: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.5)' });
      gsap.to(follower, { scale: 0.5, opacity: 0 });
    };

    const onMouseLeaveLink = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: 'white' });
      gsap.to(follower, { scale: 1, opacity: 1 });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Use event delegation for dynamic elements
    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [role="button"]');
      if (target) onMouseEnterLink();
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button, [role="button"]');
      if (target) onMouseLeaveLink();
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      document.body.classList.remove('cursor-none');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[9998] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
