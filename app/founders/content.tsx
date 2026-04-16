'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const founders = [
  {
    id: 'ashraf',
    name: 'Shaik Ashraf Ali',
    role: 'Co-Founder, CEO & Sales',
    image: '/ashraf.png',
    bio: [
      'Ashraf leads AKN as CEO and heads sales. He\'s the first voice every business hears — translating what they actually need into what we actually build.',
      'He believes sales isn\'t about closing deals; it\'s about opening relationships. Every conversation starts with listening — understanding the business, the goal, the constraint — before any proposal is written. No scripts, no upsells, just a clear path from where you are to where you want to be.',
      'His job is to make sure every engagement AKN signs is one we can genuinely win for the client. If it isn\'t the right fit, he\'ll say so.',
    ],
    quote: 'Sales isn\'t about closing deals. It\'s about opening relationships that compound over time.',
    leads: [
      'Company vision and direction',
      'Client relationships and sales strategy',
      'New business and partnerships',
    ],
  },
  {
    id: 'koushal',
    name: 'Koushal PR',
    role: 'Co-Founder & Content Head',
    image: '/koushal.png',
    bio: [
      'Koushal is the voice behind AKN\'s content engine. He architects the narratives that turn browsers into buyers — building content systems that are not just consistent, but compounding.',
      'Where most agencies treat content as an afterthought, Koushal treats it as the primary growth lever. He understands that in a crowded digital landscape, the brand that communicates with the most clarity and conviction wins.',
      'He does not just produce content. He builds content machines — systems that generate trust, authority, and inbound leads systematically. Every piece of communication AKN produces carries his strategic fingerprint.',
    ],
    quote: 'Content is not what you post. It is what people remember about you after they stop scrolling.',
    leads: [
      'Content strategy and production',
      'Social media growth systems',
      'Brand voice and communication',
    ],
  },
];

const values = [
  {
    title: 'Ambition Over Credentials',
    description: 'We measure ourselves by outcomes, not titles. Our clients do not hire us for our history — they stay with us for our results. Every project is an opportunity to prove that the best work comes from teams who care deeply about what they are building.',
  },
  {
    title: 'Obsession Over Process',
    description: 'We do not treat client projects as deliverables on a checklist. When a campaign is live, we are watching it. When a website launches, we are optimising it. This level of care is not a policy — it is who we are.',
  },
  {
    title: 'Results Over Relationships',
    description: 'We want long-term clients. But we know the only way to earn them is to deliver results first. Every engagement begins with one goal — make the client\'s business measurably better. Everything else follows from that.',
  },
];

export function FoundersPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Fade in hero elements
    gsap.from('.founders-hero-label', { y: 30, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from('.founders-hero-heading', { y: 50, opacity: 0, duration: 1, delay: 0.4 });
    gsap.from('.founders-hero-sub', { y: 30, opacity: 0, duration: 0.8, delay: 0.6 });

    // Fade in each founder section on scroll
    gsap.utils.toArray('.founder-detail').forEach((el) => {
      gsap.from(el as HTMLElement, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Fade in values section
    gsap.utils.toArray('.value-card').forEach((el, i) => {
      gsap.from(el as HTMLElement, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el as HTMLElement,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      {/* Hero */}
      <section id="main-content" className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="founders-hero-label inline-block px-4 py-1.5 rounded-full border border-[#2A8B9D] text-[#2A8B9D] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8">
            The Minds Behind The Machine
          </div>
          <h1 className="founders-hero-heading font-epilogue text-4xl sm:text-5xl md:text-7xl 2xl:text-8xl font-bold tracking-tighter mb-6 sm:mb-8">
            Two Founders. One Obsession.{' '}
            <span className="text-[#2A8B9D]">Your Growth.</span>
          </h1>
          <p className="founders-hero-sub text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            AKN was not built in a boardroom. It was built by two founders who saw exactly what growing businesses were missing — and built the agency to fix it.
          </p>
        </div>
      </section>

      {/* Founding Story */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto founder-detail">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#C87A4F] text-[#C87A4F] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8">
            Our Origin
          </div>
          <h2 className="font-epilogue text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-8 sm:mb-10 text-white">
            Built From Ambition,{' '}
            <span className="text-[#C87A4F]">Not Capital</span>
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-zinc-400 leading-relaxed">
            <p>
              Most agencies are started by people who spent decades working for other agencies. AKN was different from day one.
            </p>
            <p>
              We are two founders who looked at the digital landscape and saw the same thing — growing businesses with real potential, being underserved by overpriced agencies delivering mediocre results. We knew we could do better.
            </p>
            <p>
              AKN launched with one belief: that premium digital work should not be reserved for enterprises with massive budgets. That a restaurant, a boutique, a clinic, or a software startup — anywhere in the world — deserves the same quality of digital presence as any major brand.
            </p>
            <p>
              That belief is still the foundation of everything we build.
            </p>
          </div>
        </div>
      </section>

      {/* Individual Founder Sections */}
      {founders.map((founder, index) => (
        <section
          key={founder.id}
          id={founder.id}
          className={`py-20 sm:py-28 px-4 sm:px-8 border-t border-zinc-900 ${index % 2 === 0 ? 'bg-[#0A0F1C]' : 'bg-zinc-950'}`}
        >
          <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto">
            <div className={`founder-detail grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-start ${index % 2 !== 0 ? 'lg:direction-rtl' : ''}`}>
              {/* Image */}
              <div className={`${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full max-w-lg mx-auto overflow-hidden rounded-2xl bg-zinc-900 group">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-block px-3 py-1 rounded-full border border-[#C87A4F] text-[#C87A4F] text-xs font-bold tracking-widest uppercase mb-3 bg-zinc-950/60 backdrop-blur-sm">
                      {founder.role}
                    </div>
                    <h3 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">
                      {founder.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-center ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                {/* Role tag + name for mobile (hidden on lg where image overlay shows it) */}
                <div className="lg:hidden mb-6">
                  <div className="inline-block px-3 py-1 rounded-full border border-[#C87A4F] text-[#C87A4F] text-xs font-bold tracking-widest uppercase mb-3">
                    {founder.role}
                  </div>
                  <h3 className="font-epilogue text-3xl sm:text-4xl font-bold text-white">
                    {founder.name}
                  </h3>
                </div>

                {/* Bio */}
                <div className="space-y-5 text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 sm:mb-10">
                  {founder.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="relative mb-8 sm:mb-10 p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <Quote size={32} className="text-[#2A8B9D] opacity-40 mb-4" />
                  <p className="text-lg sm:text-xl md:text-2xl text-zinc-200 italic leading-relaxed">
                    &ldquo;{founder.quote}&rdquo;
                  </p>
                </blockquote>

                {/* What They Lead */}
                <div>
                  <h4 className="font-epilogue font-bold text-white text-sm uppercase tracking-widest mb-4">
                    What {founder.name.split(' ')[0]} Leads
                  </h4>
                  <ul className="space-y-3">
                    {founder.leads.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300">
                        <ArrowRight size={16} className="text-[#C87A4F] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Shared Values */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#2A8B9D] text-[#2A8B9D] text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 sm:mb-8">
              What Drives Us
            </div>
            <h2 className="font-epilogue text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-white">
              We Build Like It Matters.{' '}
              <span className="text-[#C87A4F]">Because It Does.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="value-card p-6 sm:p-8 rounded-2xl bg-[#0A0F1C] border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors group"
              >
                <div className="text-4xl sm:text-5xl font-epilogue font-bold text-zinc-800 group-hover:text-[#2A8B9D]/20 transition-colors mb-4">
                  0{i + 1}
                </div>
                <h3 className="font-epilogue text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-[#2A8B9D] transition-colors">
                  {value.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 bg-[#0A0F1C] border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-epilogue text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-6 sm:mb-8 text-white">
            Want to Build Something{' '}
            <span className="text-[#2A8B9D]">With Us?</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed">
            Whether you are a business looking for serious digital growth or a talented individual who wants to be part of something being built from the ground up — we want to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C87A4F] hover:bg-[#A6623D] text-white font-bold tracking-widest uppercase text-sm transition-colors"
            >
              Start a Project <ArrowRight size={16} />
            </Link>
            <a
              href="mailto:aspirekineticnetwork@gmail.com?subject=Interested in Joining AKN"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-700 hover:border-[#2A8B9D] text-white hover:text-[#2A8B9D] font-bold tracking-widest uppercase text-sm transition-colors"
            >
              Join the Team <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
