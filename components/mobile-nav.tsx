'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { scrollToId } from '@/lib/scroll';

export function MobileNav() {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  const toggleMenu = () => setIsOpen((v) => !v);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handler);
    };
  }, [isOpen]);

  const menuVars = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.45, ease: [0.12, 0, 0.39, 0] as [number, number, number, number] } },
    exit: { scaleY: 0, transition: { delay: 0.4, duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  const containerVars = {
    initial: { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.25, staggerChildren: 0.08, staggerDirection: 1 } },
  };

  const navLinks = [
    { title: t('founders'), id: 'about', href: isHome ? '#about' : '/#about' },
    { title: t('services'), id: 'services', href: isHome ? '#services' : '/#services' },
    { title: t('work'), id: 'work', href: isHome ? '#work' : '/#work' },
    { title: t('insights'), id: 'insights', href: '/insights' },
  ];

  const handleClick = (id: string, href: string) => {
    toggleMenu();
    if (href.startsWith('/') && !href.startsWith('/#')) {
      setTimeout(() => router.push(href), 400);
      return;
    }
    if (isHome) {
      setTimeout(() => scrollToId(id), 400);
    }
  };

  const handleClaim = () => {
    toggleMenu();
    router.push('/claim');
  };

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        className="relative z-[60] p-2 text-white hover:text-[#2A8B9D] transition-colors"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 origin-top bg-[#0A0F1C] p-8 sm:p-10 flex flex-col justify-center"
          >
            <motion.div
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="flex flex-col h-full justify-center gap-6 sm:gap-8"
            >
              {navLinks.map((link, index) => (
                <div key={index} className="overflow-hidden">
                  <motion.div
                    variants={{
                      initial: { y: '30vh', transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] as [number, number, number, number] } },
                      open: { y: 0, transition: { ease: [0, 0.55, 0.45, 1] as [number, number, number, number], duration: 0.7 } },
                    }}
                  >
                    {isHome && link.href.startsWith('#') ? (
                      <button
                        onClick={() => handleClick(link.id, link.href)}
                        className="text-4xl sm:text-5xl font-epilogue font-bold text-white hover:text-[#2A8B9D] transition-colors text-left"
                      >
                        {link.title}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        className="text-4xl sm:text-5xl font-epilogue font-bold text-white hover:text-[#2A8B9D] transition-colors"
                      >
                        {link.title}
                      </Link>
                    )}
                  </motion.div>
                </div>
              ))}
              <div className="overflow-hidden pt-4">
                <motion.div
                  variants={{
                    initial: { y: '30vh', transition: { duration: 0.5, ease: [0.37, 0, 0.63, 1] as [number, number, number, number] } },
                    open: { y: 0, transition: { ease: [0, 0.55, 0.45, 1] as [number, number, number, number], duration: 0.7 } },
                  }}
                >
                  <button
                    onClick={handleClaim}
                    className="inline-block rounded-full px-8 py-4 text-base font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#C87A4F] to-[#e08a5c] text-white shadow-lg"
                  >
                    {t('claim_cta')}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
