'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Point = { date: string; contacts: number; subscribers: number };

const WIDTH = 720;
const HEIGHT = 220;
const PADDING = { top: 20, right: 16, bottom: 24, left: 34 };

function isoDay(offsetDays: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

function buildBuckets(days: number) {
  const map = new Map<string, Point>();
  for (let i = days - 1; i >= 0; i--) {
    const iso = isoDay(i);
    map.set(iso, { date: iso, contacts: 0, subscribers: 0 });
  }
  return map;
}

export function TrendChart() {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const supabase = createClient();
        const since = new Date();
        since.setDate(since.getDate() - 29);
        since.setHours(0, 0, 0, 0);
        const sinceIso = since.toISOString();

        const [contactsRes, subsRes] = await Promise.all([
          supabase.from('contact_submissions').select('created_at').gte('created_at', sinceIso),
          supabase.from('newsletter_subscribers').select('created_at').gte('created_at', sinceIso),
        ]);

        const buckets = buildBuckets(30);
        for (const row of contactsRes.data || []) {
          const k = new Date(row.created_at).toISOString().slice(0, 10);
          const b = buckets.get(k);
          if (b) b.contacts += 1;
        }
        for (const row of subsRes.data || []) {
          const k = new Date(row.created_at).toISOString().slice(0, 10);
          const b = buckets.get(k);
          if (b) b.subscribers += 1;
        }
        if (mounted) setPoints(Array.from(buckets.values()));
      } catch {
        // keep empty
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const { pathContacts, pathSubs, maxY, totals, xLabels } = useMemo(() => {
    if (points.length === 0) {
      return { pathContacts: '', pathSubs: '', maxY: 1, totals: { contacts: 0, subscribers: 0 }, xLabels: [] as { x: number; label: string }[] };
    }
    const maxY = Math.max(1, ...points.map((p) => Math.max(p.contacts, p.subscribers)));
    const plotW = WIDTH - PADDING.left - PADDING.right;
    const plotH = HEIGHT - PADDING.top - PADDING.bottom;
    const stepX = plotW / Math.max(1, points.length - 1);

    const toPath = (key: 'contacts' | 'subscribers') =>
      points
        .map((p, i) => {
          const x = PADDING.left + i * stepX;
          const y = PADDING.top + plotH - (p[key] / maxY) * plotH;
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');

    const totals = points.reduce(
      (acc, p) => ({ contacts: acc.contacts + p.contacts, subscribers: acc.subscribers + p.subscribers }),
      { contacts: 0, subscribers: 0 }
    );

    const ticks = [0, Math.floor(points.length / 2), points.length - 1];
    const xLabels = ticks.map((i) => {
      const d = new Date(points[i].date);
      return { x: PADDING.left + i * stepX, label: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) };
    });

    return { pathContacts: toPath('contacts'), pathSubs: toPath('subscribers'), maxY, totals, xLabels };
  }, [points]);

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 sm:p-6">
      <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
        <div>
          <h3 className="font-epilogue text-lg sm:text-xl font-bold text-white">Last 30 days</h3>
          <p className="text-xs text-zinc-500">Daily contacts and newsletter subscribers</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-[2px] bg-[#2A8B9D]" />
            <span className="text-zinc-400">Contacts <span className="font-bold text-white ml-1">{totals.contacts}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-[2px] bg-[#C87A4F]" />
            <span className="text-zinc-400">Subscribers <span className="font-bold text-white ml-1">{totals.subscribers}</span></span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[220px] flex items-center justify-center text-zinc-500 text-sm">Loading…</div>
      ) : points.length === 0 || (totals.contacts === 0 && totals.subscribers === 0) ? (
        <div className="h-[220px] flex items-center justify-center text-zinc-500 text-sm">No activity in the last 30 days yet.</div>
      ) : (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label="30-day trend chart">
          {/* Horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = PADDING.top + (HEIGHT - PADDING.top - PADDING.bottom) * (1 - t);
            const value = Math.round(maxY * t);
            return (
              <g key={t}>
                <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} stroke="#1f1f22" strokeWidth="1" />
                <text x={PADDING.left - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#52525b">{value}</text>
              </g>
            );
          })}
          {/* X ticks */}
          {xLabels.map((t) => (
            <text key={t.x} x={t.x} y={HEIGHT - 6} textAnchor="middle" fontSize="9" fill="#52525b">{t.label}</text>
          ))}
          {/* Lines */}
          <path d={pathContacts} fill="none" stroke="#2A8B9D" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={pathSubs} fill="none" stroke="#C87A4F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
