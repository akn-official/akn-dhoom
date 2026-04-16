'use client';

import { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import type { Insight } from '@/lib/supabase/types';
import { ArticleToolbar } from '@/components/article-toolbar';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

function computeReadingTime(body: string) {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}

export function InsightArticle({ insight, relatedInsights = [] }: { insight: Insight; relatedInsights?: Insight[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const readingTime = useMemo(() => computeReadingTime(insight.body), [insight.body]);

  useGSAP(() => {
    gsap.from('.article-header', { y: 40, opacity: 0, duration: 1, delay: 0.2 });
    gsap.from('.article-body', { y: 30, opacity: 0, duration: 0.8, delay: 0.5 });
  }, { scope: containerRef });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isMarkdown = /^#{1,3}\s|^\*\*|\[.*\]\(.*\)|^[-*]\s|```/.test(insight.body);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      <ArticleToolbar title={insight.title} />

      <article id="main-content" className="pt-10 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 mb-6 overflow-x-auto">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-zinc-700">/</span>
            <Link href="/insights" className="hover:text-white transition-colors">Insights</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400 truncate max-w-[200px] sm:max-w-sm">{insight.title}</span>
          </nav>

          <Link href="/insights" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C87A4F] transition-colors mb-8 text-sm">
            <ArrowLeft size={16} /> Back to Insights
          </Link>

          {/* Header */}
          <div className="article-header mb-10 sm:mb-14">
            {insight.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {insight.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-[#C87A4F]/50 text-[#C87A4F]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-epilogue text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
              {insight.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
              <span className="font-bold text-zinc-300">{insight.author}</span>
              <span className="text-zinc-700">&middot;</span>
              <span>{formatDate(insight.created_at)}</span>
              <span className="text-zinc-700">&middot;</span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} /> {readingTime} min read
              </span>
            </div>
          </div>

          {/* Cover */}
          {insight.cover_image_url && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 sm:mb-14 border border-zinc-800">
              <Image
                src={insight.cover_image_url}
                alt={insight.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}

          {/* Body */}
          <div className="article-body" data-color-mode="dark">
            {isMarkdown ? (
              <MarkdownPreview
                source={insight.body}
                className="!bg-transparent"
                style={{ backgroundColor: 'transparent' }}
                wrapperElement={{ 'data-color-mode': 'dark' } as Record<string, string>}
              />
            ) : (
              <div className="space-y-6">
                {insight.body.split(/\n\n+/).filter(Boolean).map((paragraph, i) => (
                  <p key={i} className="text-lg text-zinc-300 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 pt-8 border-t border-zinc-800 text-center">
            <p className="text-zinc-400 mb-4">Want to discuss how this applies to your business?</p>
            <Link
              href="/claim"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C87A4F] hover:bg-[#A6623D] text-white font-bold text-sm tracking-widest uppercase transition-colors"
            >
              Claim a Free Website
            </Link>
          </div>

          {/* Related Insights */}
          {relatedInsights.length > 0 && (
            <div className="mt-16 pt-10 border-t border-zinc-800">
              <h2 className="font-epilogue text-2xl sm:text-3xl font-bold text-white mb-8">Related Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedInsights.map((related) => (
                  <Link
                    key={related.id}
                    href={`/insights/${related.slug}`}
                    className="group rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-[#C87A4F]/50 transition-colors"
                  >
                    {related.cover_image_url && (
                      <div className="relative aspect-video w-full overflow-hidden">
                        <Image
                          src={related.cover_image_url}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-epilogue text-base font-bold text-white mb-2 group-hover:text-[#C87A4F] transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-zinc-400 text-sm line-clamp-2">{related.excerpt}</p>
                      {related.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {related.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] text-zinc-500 border border-zinc-800">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
