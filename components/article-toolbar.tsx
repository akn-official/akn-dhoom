'use client';

import { useEffect, useState, useCallback } from 'react';
import { Twitter, Linkedin, Link2, Share2 } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { trackEvent } from '@/lib/analytics';

const WhatsappIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function ArticleToolbar({ title }: { title: string }) {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState('');
  const toast = useToast();

  useEffect(() => {
    setUrl(window.location.href);
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        const pct = total > 0 ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100)) : 0;
        setProgress(pct);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied', 'Share it anywhere.');
      trackEvent('share_click', { platform: 'copy' });
    } catch {
      toast.error('Copy failed', 'Try sharing another way.');
    }
  }, [url, toast]);

  const nativeShare = useCallback(async () => {
    if (!navigator.share) {
      copyLink();
      return;
    }
    try {
      await navigator.share({ title, url });
      trackEvent('share_click', { platform: 'native' });
    } catch {
      // user canceled
    }
  }, [title, url, copyLink]);

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;

  const onExternalShare = (platform: string) => () => trackEvent('share_click', { platform });

  return (
    <div className="sticky top-14 lg:top-16 z-30 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-zinc-900/70">
      <div
        className="h-[3px] bg-gradient-to-r from-[#2A8B9D] via-[#C87A4F] to-[#2A8B9D] origin-left"
        style={{ transform: `scaleX(${progress / 100})`, transition: 'transform 0.1s linear' }}
      />
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          {Math.round(progress)}% read
        </span>
        <div className="flex items-center gap-1">
          <a
            href={tweetHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onExternalShare('twitter')}
            aria-label="Share on Twitter"
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <Twitter size={16} />
          </a>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onExternalShare('linkedin')}
            aria-label="Share on LinkedIn"
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <Linkedin size={16} />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onExternalShare('whatsapp')}
            aria-label="Share on WhatsApp"
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <WhatsappIcon size={16} />
          </a>
          <button
            onClick={copyLink}
            aria-label="Copy link"
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <Link2 size={16} />
          </button>
          <button
            onClick={nativeShare}
            aria-label="Share"
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors sm:hidden"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
