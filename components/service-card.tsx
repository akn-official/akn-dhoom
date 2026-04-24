'use client';

import { forwardRef, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface ServiceCardProps {
  service: {
    title: string;
    desc: string;
    details?: string;
  };
  index: number;
}

export const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(({ service, index }, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const setRefs = (el: HTMLDivElement | null) => {
    localRef.current = el;
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!localRef.current) return;
    const rect = localRef.current.getBoundingClientRect();
    // Calculate offset from center (-0.5 to 0.5)
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Move in opposite direction of mouse
    mouseX.set(offsetX * -40);
    mouseY.set(offsetY * -40);
  };

  const handleMouseLeave = () => {
    // Reset position smoothly when mouse leaves
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={setRefs}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="h-full"
    >
      <Card
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${service.title} - click to ${isExpanded ? 'collapse' : 'expand'} details`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}
        className="relative bg-zinc-900/50 border-zinc-800 hover:border-[#2A8B9D] focus-visible:border-[#2A8B9D] focus-visible:ring-2 focus-visible:ring-[#2A8B9D] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none transition-colors group backdrop-blur-sm overflow-hidden h-full cursor-pointer flex flex-col"
      >
        {/* Branded gradient background with Parallax */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-[-20%] w-[140%] h-[140%]"
            style={{ x, y }}
          >
            <div
              className={`absolute inset-0 ${
                index % 3 === 0
                  ? 'bg-gradient-to-br from-[#2A8B9D]/20 to-transparent'
                  : index % 3 === 1
                  ? 'bg-gradient-to-tl from-[#C87A4F]/20 to-transparent'
                  : 'bg-gradient-to-b from-[#2A8B9D]/10 via-[#C87A4F]/10 to-transparent'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
          </motion.div>
        </div>

        <CardHeader className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="text-3xl sm:text-4xl font-epilogue font-bold text-zinc-600 mb-4 group-hover:text-[#C87A4F] transition-colors">
              0{index + 1}
            </div>
            <ChevronDown 
              className={`text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">{service.title}</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 flex-grow">
          <CardDescription className="text-zinc-400 text-base leading-relaxed">
            {service.desc}
          </CardDescription>
          
          <AnimatePresence>
            {isExpanded && service.details && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-zinc-800/50 text-zinc-300 text-sm leading-relaxed">
                  {service.details}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';
