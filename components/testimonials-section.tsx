'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Quote } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import type { Testimonial } from '@/lib/supabase/types';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data);
      });
  }, []);

  // Auto-rotate every 6 seconds if multiple testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-[#C87A4F]' : 'text-zinc-700'}>&#9733;</span>
    ));
  };

  // No testimonials yet — show honest "results incoming" state (not a fake testimonial card)
  if (testimonials.length === 0) {
    return (
      <section className="py-24 sm:py-32 px-6 sm:px-8 bg-[#0A0F1C] border-t border-zinc-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-epilogue text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
            CLIENT <span className="text-[#2A8B9D]">RESULTS</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
            We launched in April 2025. Our first clients are seeing results now — testimonials and case studies will appear here as they come in.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { metric: 'Websites', value: 'In Build', label: 'First batch underway' },
              { metric: 'Response', value: '< 24h', label: 'We move fast' },
              { metric: 'Promise', value: '100%', label: 'Ownership on delivery' },
            ].map((item) => (
              <div key={item.metric} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
                <div className="font-epilogue text-3xl font-bold text-[#C87A4F] mb-1">{item.value}</div>
                <div className="text-white font-semibold mb-1">{item.metric}</div>
                <div className="text-zinc-500 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-zinc-600 mt-10">Real stories from real clients — check back soon.</p>
        </div>
      </section>
    );
  }

  // Real testimonials
  const testimonial = testimonials[current];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 bg-[#0A0F1C] border-t border-zinc-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-epilogue text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-white">
            CLIENT <span className="text-[#2A8B9D]">TESTIMONIALS</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our partners have to say.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm p-8 sm:p-12 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                <Quote size={48} className="text-[#C87A4F] mb-6 opacity-50" />

                {testimonial.image_url && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-zinc-700">
                    <Image src={testimonial.image_url} alt={testimonial.client_name} fill className="object-cover" sizes="80px" />
                  </div>
                )}

                <p className="text-lg sm:text-xl md:text-2xl text-zinc-200 italic max-w-2xl leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex gap-1 mb-3 text-lg">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="font-epilogue font-bold text-white text-lg">{testimonial.client_name}</p>
                <p className="text-zinc-400 text-sm">{testimonial.business_name}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? 'bg-[#2A8B9D]' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                  aria-label={`Show testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
