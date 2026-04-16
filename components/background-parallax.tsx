'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export function BackgroundParallax() {
  const container = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(imageRef.current, {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });

    gsap.from(textRef.current, {
      y: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: container.current,
        start: 'top 60%',
        end: 'top 30%',
        scrub: 1,
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      <div ref={imageRef} className="absolute inset-0 z-0 -top-[50%] h-[150%] w-full">
        <Image 
          src="https://picsum.photos/seed/bgparallax/1920/1080" 
          alt="Background Parallax" 
          fill 
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-zinc-950/60" />
      </div>

      <div ref={textRef} className="relative z-10 text-center px-8">
        <h2 className="font-epilogue text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
          ELEVATE YOUR BRAND
        </h2>
        <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
          We craft digital experiences that resonate with your audience and drive meaningful results.
        </p>
      </div>
    </section>
  );
}
