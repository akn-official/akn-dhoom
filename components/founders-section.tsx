'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type Socials = {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  behance?: string;
  website?: string;
};

type Founder = {
  id: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  image: string;
  socials?: Socials;
};

const founders: Founder[] = [
  {
    id: 'ashraf',
    name: 'Shaik Ashraf Ali',
    role: 'CEO & Sales',
    quote: '"Sales isn\'t about closing deals. It\'s about opening relationships."',
    bio: "Ashraf leads AKN as CEO and heads sales. He's the first voice every business hears — translating what they actually need into what we actually build. No scripts, no upsells, just honest conversations and a clear path from where you are to where you want to be.",
    image: '/ashraf.png',
    socials: {},
  },
  {
    id: 'koushal',
    name: 'Koushal PR',
    role: 'Content Head',
    quote: '"Content without strategy is just noise. We don\'t make noise."',
    bio: "Koushal understands that attention is earned, not bought. He leads content strategy and creative direction at AKN — shaping how each client's brand sounds, looks, and feels across every platform.",
    image: '/koushal.png',
    socials: {},
  },
];

function BehanceIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.8 11c1.6 0 2.5-.9 2.5-2.2 0-1.5-1-2.3-2.5-2.3H2v10.1h6.1c1.8 0 3-1 3-2.7 0-1.3-.8-2.4-2.3-2.9zM4.9 8.7h2.3c.9 0 1.5.4 1.5 1.1 0 .7-.4 1.2-1.5 1.2H4.9V8.7zm2.8 5.8H4.9v-2.5h2.7c1.1 0 1.7.4 1.7 1.2 0 .8-.5 1.3-1.6 1.3zM22 12.5c0-2.3-1.4-4.2-4-4.2-2.5 0-4.1 1.8-4.1 4.2 0 2.4 1.5 4.2 4.2 4.2 2 0 3.4-1 3.8-2.6h-2.1c-.2.5-.8.9-1.7.9-1.1 0-1.8-.7-1.9-1.8H22c0-.2 0-.5 0-.7zm-5.8-.9c.1-1 .9-1.6 1.8-1.6 1 0 1.7.6 1.8 1.6h-3.6zM20.5 7h-5v-1h5v1z" />
    </svg>
  );
}

function FounderSocials({ socials }: { socials?: Socials }) {
  if (!socials) return null;
  const links = [
    { key: 'instagram', url: socials.instagram, Icon: Instagram, label: 'Instagram' },
    { key: 'linkedin', url: socials.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitter', url: socials.twitter, Icon: Twitter, label: 'Twitter' },
    { key: 'behance', url: socials.behance, Icon: BehanceIcon, label: 'Behance' },
    { key: 'website', url: socials.website, Icon: Globe, label: 'Website' },
  ].filter((l) => l.url && l.url.trim().length > 0);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-6">
      {links.map(({ key, url, Icon, label }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-800 text-zinc-400 hover:border-[#2A8B9D] hover:text-[#2A8B9D] hover:scale-110 transition-all"
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}

function FounderBio({ bio }: { bio: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 160;
  const shouldTruncate = bio.length > maxLength;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
  };

  return (
    <div className="text-lg text-zinc-400 leading-relaxed">
      <span className="transition-all duration-300">
        {isExpanded || !shouldTruncate ? bio : `${bio.slice(0, maxLength)}...`}
      </span>
      {shouldTruncate && (
        <button
          onClick={toggleExpand}
          className="ml-2 text-[#2A8B9D] hover:text-[#C87A4F] font-bold text-sm uppercase tracking-wider transition-colors focus:outline-none"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}

function FounderCollage() {
  const collageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tiles = gsap.utils.toArray('.collage-tile') as HTMLElement[];
    gsap.from(tiles, {
      y: 60,
      opacity: 0,
      rotation: (i) => (i === 0 ? -8 : i === 2 ? 8 : 0),
      duration: 1,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: collageRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    // Gentle floating idle animation
    tiles.forEach((tile, i) => {
      gsap.to(tile, {
        y: i % 2 === 0 ? -10 : 10,
        duration: 3 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }, { scope: collageRef });

  return (
    <div
      ref={collageRef}
      className="relative w-full h-[380px] sm:h-[440px] lg:h-[500px] flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#2A8B9D]/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-[#C87A4F]/20 rounded-full blur-[80px]" />

      {/* Tile 1 — left, tilted back */}
      <div
        className="collage-tile absolute left-[8%] top-[8%] w-[46%] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#2A8B9D]/40 shadow-2xl -rotate-6 hover:rotate-0 hover:scale-105 transition-transform duration-500 bg-zinc-900"
        style={{ zIndex: 2 }}
      >
        <Image
          src={founders[0].image}
          alt=""
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
          sizes="(max-width: 1024px) 45vw, 22vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
      </div>

      {/* Tile 2 — right, tilted forward */}
      <div
        className="collage-tile absolute right-[8%] top-[8%] w-[46%] aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#C87A4F]/40 shadow-2xl rotate-6 hover:rotate-0 hover:scale-105 transition-transform duration-500 bg-zinc-900"
        style={{ zIndex: 3 }}
      >
        <Image
          src={founders[1].image}
          alt=""
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
          sizes="(max-width: 1024px) 45vw, 22vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
      </div>

      {/* Decorative dotted line connecting them */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-px border-t border-dashed border-zinc-700" />
      <div className="absolute bottom-[18px] left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-bold tracking-widest uppercase text-[#C87A4F]">
        One Network
      </div>
    </div>
  );
}

export function FoundersSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray('.founder-section') as HTMLElement[];

    sections.forEach((section) => {
      const imageContainer = section.querySelector('.image-container');
      const textContainer = section.querySelector('.founder-text');

      gsap.from(imageContainer, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from(textContainer, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textContainer,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative w-full bg-zinc-950">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="mb-16 sm:mb-32 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 className="font-epilogue text-3xl sm:text-5xl md:text-7xl 2xl:text-8xl font-bold tracking-tighter mb-6 sm:mb-8 text-white">
              TWO FOUNDERS.<br/>
              <span className="text-[#2A8B9D]">TWO DISCIPLINES.</span><br/>
              ONE NETWORK.
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 leading-relaxed">
              AKN didn&apos;t start in a boardroom. It started in a classroom — two friends who looked at the digital marketing industry and saw the same thing: a lot of noise, very little honesty, and thousands of businesses being ignored or overcharged. We built AKN to change that.
            </p>
          </div>
          <FounderCollage />
        </div>

        <div className="flex flex-col gap-16 sm:gap-32">
          {founders.map((founder, index) => (
            <div key={founder.id} className="founder-section group relative grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 md:min-h-[80vh]">
              <div className={`h-full ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                <div className="image-container relative aspect-square sm:aspect-[3/4] w-full max-w-sm sm:max-w-md mx-auto overflow-hidden rounded-2xl bg-zinc-900">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-6xl font-epilogue font-bold text-zinc-700 -z-0">
                    {founder.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                </div>
              </div>

              <div className={`flex flex-col justify-center ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                <div className="founder-text bg-zinc-950/80 backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-zinc-800 relative z-10 -mt-16 sm:-mt-20 md:mt-0 transition-all duration-500 group-hover:bg-zinc-900/90 group-hover:border-[#2A8B9D]/40 group-hover:shadow-2xl">
                  <div className="inline-block px-3 sm:px-4 py-1 rounded-full border border-[#C87A4F] text-[#C87A4F] text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 sm:mb-6 w-fit transition-colors group-hover:bg-[#C87A4F]/10">
                    {founder.role}
                  </div>
                  <h3 className="font-epilogue text-2xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold text-white mb-4 sm:mb-6 transition-colors group-hover:text-[#2A8B9D]">
                    {founder.name}
                  </h3>
                  <blockquote className="text-base sm:text-xl text-zinc-300 italic mb-6 sm:mb-8 border-l-4 border-[#2A8B9D] pl-4 sm:pl-6 py-2">
                    {founder.quote}
                  </blockquote>
                  <FounderBio bio={founder.bio} />
                  <FounderSocials socials={founder.socials} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
