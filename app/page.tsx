'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';
import { events } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FoundersSection } from '@/components/founders-section';
import { AnimatedGradient } from '@/components/animated-gradient';
import { TrustBar } from '@/components/trust-bar';
import { ServiceCard } from '@/components/service-card';
import { TestimonialsSection } from '@/components/testimonials-section';
import { CareersTeaser } from '@/components/careers-teaser';
import { FaqSection } from '@/components/faq-section';
import { ActivityCounter } from '@/components/activity-counter';
import { createClient } from '@/lib/supabase/client';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();
  const tHero = useTranslations('hero');
  const tServices = useTranslations('services');
  const tContact = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const container = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);

  const servicesRef = useRef<HTMLDivElement>(null);
  const serviceCardsRef = useRef<HTMLDivElement[]>([]);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  const defaultServices = [
    { title: 'Web Presence', description: 'Your website is your hardest-working employee. We build clean, fast, conversion-focused websites that represent your business 24/7. Currently free for our first five clients.', details: 'Includes custom design, mobile optimization, fast loading speeds, and basic SEO setup to ensure your business makes a strong first impression online.' },
    { title: 'Local SEO', description: 'When someone in your city searches for what you offer, you should appear. We optimize your Google presence so the right people find you first.', details: 'We focus on local keyword research, on-page optimization, and building local citations to improve your ranking in local search results.' },
    { title: 'Google Business Profile', description: 'Your GMB listing is often the first thing a customer sees. We set it up, optimize it, and keep it working.', details: 'Complete profile setup, regular post updates, review management, and performance tracking to maximize your local visibility.' },
    { title: 'Social Media Presence', description: 'Consistent, on-brand content that builds trust and keeps your audience engaged — without you having to think about it.', details: 'Strategic content creation, community management, and targeted campaigns across platforms like Instagram, Facebook, and LinkedIn.' },
    { title: 'Content Strategy', description: 'Random posting doesn\'t work. We build a content plan tied to your business goals and your audience\'s actual behaviour.', details: 'In-depth audience research, content calendar creation, and performance analysis to ensure every piece of content drives results.' },
    { title: 'Growth Consulting', description: 'Monthly strategy sessions to review what\'s working, what isn\'t, and where to push next.', details: 'Data-driven insights, competitive analysis, and actionable recommendations to continuously scale your digital presence.' },
    { title: 'Interactive Web Experiences', description: 'Engage your visitors with dynamic, interactive elements that keep them on your site longer.', details: 'Custom animations, 3D elements, parallax scrolling, and interactive tools designed to increase user engagement and conversion rates.' }
  ];

  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    const loadServices = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('services')
        .select('title, description, details, icon')
        .eq('is_published', true)
        .order('display_order', { ascending: true });
      if (data && data.length > 0) {
        setServices(data.map(s => ({
          title: s.title,
          description: s.description,
          details: s.details || '',
        })));
      }
    };
    loadServices();
  }, []);

  useGSAP(() => {
    gsap.set([heroTextRef.current, heroSubRef.current, heroCtaRef.current], { autoAlpha: 0 });

    const loadTl = gsap.timeline({ delay: 0.15 });
    loadTl
      .fromTo(heroTextRef.current, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' })
      .fromTo(heroSubRef.current, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .fromTo(heroCtaRef.current, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, '-=0.6');

    gsap.from(comingSoonRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: comingSoonRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
    });

    // Parallax: hero content drifts at a slower rate than the page
    const reducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion) {
      gsap.to(heroTextRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to(heroSubRef.current, {
        yPercent: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to(heroCtaRef.current, {
        yPercent: -35,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Section-heading parallax reveal: each h2 lifts + fades on scrub
      gsap.utils.toArray<HTMLElement>('section h2').forEach((h) => {
        gsap.from(h, {
          y: 60,
          opacity: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: h,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 0.6,
          },
        });
      });
    }
  }, { scope: container });

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !serviceCardsRef.current.includes(el)) {
      serviceCardsRef.current.push(el);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('idle');
    setFormError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const supabase = createClient();
      const payload = {
        name: formData.get('name') as string,
        business_name: formData.get('business') as string || null,
        business_type: formData.get('businessType') as string || null,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || null,
        website: formData.get('website') as string || null,
        message: formData.get('message') as string || null,
        source: 'free_audit',
        status: 'new',
      };
      const { error } = await supabase.from('contact_submissions').insert(payload);

      if (error) throw error;

      events.auditFormSubmit();

      // Fire-and-forget email alert — never block the user
      fetch('/api/notify-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: payload.source,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          business: payload.business_name,
          business_type: payload.business_type,
          website: payload.website,
          message: payload.message,
        }),
      }).catch(() => {});

      setFormStatus('success');
      form.reset();
    } catch (err) {
      setFormStatus('error');
      setFormError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordMap = ['ZERO','ONE','TWO','THREE','FOUR','FIVE','SIX','SEVEN','EIGHT','NINE','TEN'];
  const countWord = wordMap[services.length] ?? services.length.toString();

  return (
    <main ref={container} className="min-h-screen bg-[#0A0F1C] text-zinc-50 overflow-hidden">

      {/* Hero Section */}
      <section id="main-content" ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 pt-20">
        <AnimatedGradient />

        <div className="relative z-10 max-w-5xl 3xl:max-w-7xl mx-auto text-center mt-10 sm:mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 sm:mb-8 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-zinc-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2A8B9D] opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2A8B9D]" />
            </span>
            {tHero('badge')}
          </div>
          <h1 ref={heroTextRef} className="hero-headline font-epilogue text-3xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl 3xl:text-[11rem] 4xl:text-[14rem] font-bold tracking-tighter leading-[1.1] mb-6 sm:mb-8">
            {tHero('headline_before')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A8B9D] via-[#C87A4F] to-[#2A8B9D]">
              {tHero('headline_accent')}
            </span>
          </h1>
          <p ref={heroSubRef} className="hero-subtitle text-base sm:text-xl md:text-2xl 2xl:text-3xl 3xl:text-4xl text-zinc-200 max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl mx-auto font-light mb-8 sm:mb-12 drop-shadow-sm">
            {tHero('subtitle')}
          </p>
          <div ref={heroCtaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Button
              onClick={() => { events.heroCtaClick(); router.push('/claim'); }}
              className="group relative rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-[15px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#C87A4F] via-[#e08a5c] to-[#C87A4F] bg-[length:200%_auto] hover:bg-[position:right_center] text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_-5px_rgba(200,122,79,0.6)] w-full sm:w-auto overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {tHero('cta')}
              </span>
              <div className="absolute inset-0 -translate-x-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[150%] duration-1000 ease-in-out transition-transform" />
            </Button>
            <Button
              onClick={() => scrollToId('services')}
              className="group rounded-full px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-[15px] font-extrabold uppercase tracking-wider border-2 border-[#2A8B9D]/70 bg-[#2A8B9D]/15 text-white hover:bg-[#2A8B9D] hover:border-[#2A8B9D] hover:shadow-[0_0_30px_-5px_rgba(42,139,157,0.7)] transition-all duration-300 w-full sm:w-auto backdrop-blur-md"
            >
              {tHero('secondary_cta')} <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
          <div className="mt-8 sm:mt-10 flex justify-center">
            <ActivityCounter />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block">
          <ChevronDown size={28} className="text-zinc-400" />
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Founders / About Section */}
      <section id="about">
        <FoundersSection />
        <div className="bg-zinc-950 px-4 sm:px-8 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto text-center">
            <Link href="/founders" className="inline-flex items-center gap-2 text-[#2A8B9D] hover:text-[#C87A4F] font-bold text-sm uppercase tracking-widest transition-colors group">
              Meet The Full Team <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={servicesRef} className="py-24 sm:py-32 3xl:py-40 px-4 sm:px-8 bg-[#0A0F1C]">
        <div className="max-w-7xl 2xl:max-w-screen-2xl 3xl:max-w-[1800px] mx-auto">
          <div className="text-center mb-14 sm:mb-20">
            <h2 className="font-epilogue text-3xl sm:text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tighter mb-4 sm:mb-6">
              {countWord} {tServices('heading_prefix')} <span className="text-[#C87A4F]">{tServices('heading_suffix')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
              {tServices('subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                ref={addToRefs}
                service={{ title: service.title, desc: service.description, details: service.details || '' }}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Work & Insights Section */}
      <section id="work" className="py-24 sm:py-32 3xl:py-40 px-4 sm:px-8 bg-zinc-900/40 relative overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-screen-2xl 3xl:max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
          {/* Work */}
          <div>
            <h2 className="font-epilogue text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold tracking-tighter mb-6">
              OUR WORK — <br/>
              <span className="text-[#2A8B9D]">COMING INTO FOCUS</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 mb-8 leading-relaxed">
              We launched in April 2025. Our first projects are underway. This page will be home to real results, real clients, and real before-and-afters — updated as we deliver.
            </p>
            <ul className="space-y-4 text-zinc-300 mb-12">
              <li className="flex items-center gap-3"><ArrowRight size={16} className="text-[#C87A4F] shrink-0"/> Local SEO ranking improvements</li>
              <li className="flex items-center gap-3"><ArrowRight size={16} className="text-[#C87A4F] shrink-0"/> GMB profile transformations</li>
              <li className="flex items-center gap-3"><ArrowRight size={16} className="text-[#C87A4F] shrink-0"/> Website builds for service businesses worldwide</li>
              <li className="flex items-center gap-3"><ArrowRight size={16} className="text-[#C87A4F] shrink-0"/> Social media growth timelines</li>
            </ul>
            <div ref={comingSoonRef} className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800 group bg-zinc-900">
              <Image
                src="/coming-soon.png"
                alt="Portfolio Coming Soon"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-epilogue font-bold tracking-widest uppercase text-white text-sm sm:text-base">Currently Onboarding</span>
              </div>
            </div>
            <Link href="/work" className="inline-flex items-center gap-2 mt-8 text-[#2A8B9D] hover:text-[#C87A4F] font-bold text-sm uppercase tracking-widest transition-colors group">
              View All Work <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Insights */}
          <div>
            <h2 className="font-epilogue text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-bold tracking-tighter mb-6">
              INSIGHTS — <br/>
              <span className="text-[#C87A4F]">STRAIGHT TALK</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 mb-8 leading-relaxed">
              No recycled listicles. No generic tips. Just honest thinking on what actually works for local businesses trying to grow online.
            </p>
            <div className="space-y-4 sm:space-y-6">
              {[
                "Why most small businesses are invisible on Google (and how to fix it in 30 days)",
                "The real reason your social media isn't converting",
                "GMB optimization: the most underrated 45 minutes you'll spend on your business",
                "What 'digital presence' actually means for a modern business"
              ].map((insight, i) => (
                <div key={i} className="p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D] transition-colors group" role="article">
                  <div className="text-xs font-bold text-[#C87A4F] tracking-widest uppercase mb-2 sm:mb-3">Coming Soon</div>
                  <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-[#2A8B9D] transition-colors">{insight}</h3>
                </div>
              ))}
            </div>
            <Link href="/insights" className="inline-flex items-center gap-2 mt-8 text-[#C87A4F] hover:text-[#2A8B9D] font-bold text-sm uppercase tracking-widest transition-colors group">
              View All Insights <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* Contact Section */}
      <section id="contact" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#0A0F1C]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-epilogue text-3xl sm:text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tighter mb-4 sm:mb-6">
              {tContact('heading')}
            </h2>
            <p className="text-lg sm:text-xl text-zinc-400">
              {tContact('subtitle')}
            </p>
          </div>

          {formStatus === 'success' ? (
            <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl">
              <CardContent className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#2A8B9D]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#2A8B9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-epilogue text-2xl sm:text-3xl font-bold text-white mb-4">{tContact('success_title')}</h3>
                <p className="text-zinc-300 text-lg mb-2">{tContact('success_line1')}</p>
                <p className="text-zinc-400">{tContact('success_line2')}</p>
                <Button
                  onClick={() => setFormStatus('idle')}
                  variant="outline"
                  className="mt-8 border-zinc-700 hover:bg-white hover:text-black"
                >
                  {tContact('success_again')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-white">{tContact('card_title')}</CardTitle>
                <CardDescription className="text-zinc-400">
                  {tContact('card_description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-5 sm:space-y-6" onSubmit={handleContactSubmit}>
                  {formStatus === 'error' && (
                    <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">
                      {formError || 'Something went wrong.'} Please try again or WhatsApp us at{' '}
                      <a href="https://wa.me/919840311092" className="underline text-red-200">+91 98403 11092</a>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-300">Name <span className="text-red-400">*</span></Label>
                      <Input id="name" name="name" required placeholder="Your Name" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business" className="text-zinc-300">Business Name <span className="text-red-400">*</span></Label>
                      <Input id="business" name="business" required placeholder="Your Business Name" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-zinc-300">Business Type</Label>
                      <div className="relative">
                        <select
                          id="businessType"
                          name="businessType"
                          defaultValue=""
                          className="flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 pr-9 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8B9D] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        >
                          <option value="" disabled>Select your business type</option>
                          <option value="retail">Retail</option>
                          <option value="food_beverage">Food & Beverage</option>
                          <option value="professional_services">Professional Services</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="education">Education</option>
                          <option value="real_estate">Real Estate</option>
                          <option value="salon_beauty">Salon & Beauty</option>
                          <option value="automotive">Automotive</option>
                          <option value="hospitality">Hospitality</option>
                          <option value="other">Other (Please specify in message)</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300">Email <span className="text-red-400">*</span></Label>
                      <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-zinc-300">Phone <span className="text-red-400">*</span></Label>
                      <Input id="phone" name="phone" type="tel" required placeholder="+91 98765 43210" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-zinc-300">Website (Optional)</Label>
                    <Input id="website" name="website" type="url" placeholder="https://yourwebsite.com" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-zinc-300">Message</Label>
                    <Textarea id="message" name="message" placeholder="Tell us about your current challenges..." className="bg-zinc-950 border-zinc-800 text-white min-h-[120px] focus-visible:ring-[#2A8B9D]" />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C87A4F] hover:bg-[#A6623D] text-white font-bold tracking-widest uppercase py-6 disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {tContact('submitting')}
                      </span>
                    ) : (
                      tContact('submit')
                    )}
                  </Button>
                  <p className="text-center text-xs sm:text-sm text-zinc-500 mt-4">
                    {tContact('onboarding_note')}
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Careers teaser — only renders if hiring is enabled + roles exist */}
      <CareersTeaser />

    </main>
  );
}
