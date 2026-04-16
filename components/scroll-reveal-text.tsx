'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollRevealText({ text }: { text: string }) {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;
    
    // Split text into words (simple split for demo, could use SplitText plugin if available)
    const words = textRef.current.innerText.split(' ');
    textRef.current.innerHTML = '';
    
    words.forEach(word => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      span.style.display = 'inline-block';
      span.style.opacity = '0.2';
      textRef.current?.appendChild(span);
    });

    const spans = textRef.current.querySelectorAll('span');

    gsap.to(spans, {
      opacity: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 1,
      }
    });

  }, { scope: container });

  return (
    <section ref={container} className="py-32 px-8 bg-zinc-900 flex items-center justify-center min-h-[50vh]">
      <div className="max-w-5xl mx-auto text-center">
        <h2 ref={textRef} className="font-epilogue text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
          {text}
        </h2>
      </div>
    </section>
  );
}
