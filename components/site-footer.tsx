'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowUp, Mail, Phone, MessageCircle } from 'lucide-react';

export function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  // Admin + portal have their own shells — no public footer there.
  if (pathname.startsWith('/admin') || pathname.startsWith('/portal')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-8 border-t border-zinc-900 bg-[#0A0F1C]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="relative w-28 h-10 mb-4">
              <Image src="/logo.png" alt="AKN Logo" fill className="object-contain object-left opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-epilogue font-bold text-white text-sm uppercase tracking-widest mb-4">{t('navigate')}</h4>
            <ul className="space-y-3">
              <li><Link href={isHome ? '#about' : '/founders'} className="text-zinc-400 hover:text-[#2A8B9D] transition-colors text-sm">{tNav('founders')}</Link></li>
              <li><Link href={isHome ? '#services' : '/#services'} className="text-zinc-400 hover:text-[#2A8B9D] transition-colors text-sm">{tNav('services')}</Link></li>
              <li><Link href={isHome ? '#work' : '/work'} className="text-zinc-400 hover:text-[#2A8B9D] transition-colors text-sm">{tNav('work')}</Link></li>
              <li><Link href={isHome ? '#contact' : '/#contact'} className="text-zinc-400 hover:text-[#2A8B9D] transition-colors text-sm">{tNav('contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-epilogue font-bold text-white text-sm uppercase tracking-widest mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:aspirekineticnetwork@gmail.com" className="text-zinc-400 hover:text-[#2A8B9D] transition-colors text-sm flex items-center gap-2">
                  <Mail size={14} className="shrink-0" /> aspirekineticnetwork@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919840311092" className="text-zinc-400 hover:text-[#2A8B9D] transition-colors text-sm flex items-center gap-2">
                  <Phone size={14} className="shrink-0" /> +91 98403 11092
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div>
            <h4 className="font-epilogue font-bold text-white text-sm uppercase tracking-widest mb-4">{t('quick_connect')}</h4>
            <a
              href="https://wa.me/919840311092?text=Hi%20AKN!%20%F0%9F%91%8B%20I%20want%20to%20grow%20my%20business.%20I%20found%20your%20website%20at%20aspirekineticnetwork.in%20and%20I%27m%20interested%20in%20your%20services.%20Can%20we%20connect%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition-colors"
            >
              <MessageCircle size={16} /> {t('chat_whatsapp')}
            </a>
            <p className="text-zinc-500 text-xs mt-3">{t('whatsapp_note')}</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <p className="text-zinc-500">
              &copy; {new Date().getFullYear()} Aspire Kinetic Network. {t('copyright')}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-zinc-500 hover:text-[#2A8B9D] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-zinc-500 hover:text-[#2A8B9D] transition-colors">Terms</Link>
            </div>
          </div>
          <button
            onClick={scrollToTop}
            aria-label={t('back_to_top')}
            className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-[#2A8B9D] hover:border-[#2A8B9D] transition-colors shrink-0"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
