'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export function ZoomParallax() {
  const container = useRef<HTMLDivElement>(null);
  const image1 = useRef<HTMLDivElement>(null);
  const image2 = useRef<HTMLDivElement>(null);
  const image3 = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=150%',
        scrub: 1,
        pin: true,
      }
    });

    tl.to(image1.current, { scale: 1.5, opacity: 0, duration: 1 }, 0)
      .to(image2.current, { scale: 1.2, opacity: 1, duration: 1 }, 0)
      .to(image3.current, { scale: 1, opacity: 1, duration: 1 }, 0.5)
      .to(textRef.current, { opacity: 1, y: 0, duration: 1 }, 0.5);

  }, { scope: container });

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      
      <div ref={image1} className="absolute inset-0 z-10">
        <Image 
          src="https://picsum.photos/seed/zoom1/1920/1080" 
          alt="Zoom 1" 
          fill 
          className="object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
      </div>

      <div ref={image2} className="absolute inset-0 z-20 opacity-0 scale-50">
        <Image 
          src="https://picsum.photos/seed/zoom2/1920/1080" 
          alt="Zoom 2" 
          fill 
          className="object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
      </div>

      <div ref={image3} className="absolute inset-0 z-30 opacity-0 scale-50">
        <Image 
          src="https://picsum.photos/seed/zoom3/1920/1080" 
          alt="Zoom 3" 
          fill 
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div ref={textRef} className="relative z-40 text-center opacity-0 translate-y-10">
        <h2 className="font-epilogue text-6xl md:text-8xl font-bold tracking-tighter text-white mb-4">
          DEEP DIVE
        </h2>
        <p className="text-xl text-zinc-300 max-w-xl mx-auto">
          Immerse your audience in a world of depth and dimension.
        </p>
      </div>

    </section>
  );
}
