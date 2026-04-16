'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface DailyView {
  date: string;
  path: string;
  views: number;
}

export default function AnalyticsAdmin() {
  return <AuthGuard>{() => <AnalyticsContent />}</AuthGuard>;
}

function AnalyticsContent() {
  const supabase = createClient();
  const [dailyViews, setDailyViews] = useState<DailyView[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [topPages, setTopPages] = useState<{ path: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Get total count
      const { count: total } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });
      setTotalViews(total || 0);

      // Get today's count
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);
      setTodayViews(todayCount || 0);

      // Get daily views (last 14 days)
      const { data: daily } = await supabase
        .from('page_views_daily')
        .select('*')
        .limit(100);
      setDailyViews(daily || []);

      // Aggregate top pages
      if (daily && daily.length > 0) {
        const pageMap: Record<string, number> = {};
        daily.forEach((d: DailyView) => {
          pageMap[d.path] = (pageMap[d.path] || 0) + d.views;
        });
        const sorted = Object.entries(pageMap)
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10);
        setTopPages(sorted);
      }

      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  // Group daily views by date
  const dateGroups: Record<string, DailyView[]> = {};
  dailyViews.forEach((dv) => {
    if (!dateGroups[dv.date]) dateGroups[dv.date] = [];
    dateGroups[dv.date].push(dv);
  });

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Analytics</h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
            <p className="text-3xl font-epilogue font-bold text-[#2A8B9D]">{totalViews.toLocaleString()}</p>
            <p className="text-zinc-500 text-sm mt-1">Total Page Views</p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
            <p className="text-3xl font-epilogue font-bold text-[#C87A4F]">{todayViews.toLocaleString()}</p>
            <p className="text-zinc-500 text-sm mt-1">Today</p>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
            <p className="text-3xl font-epilogue font-bold text-white">{topPages.length}</p>
            <p className="text-zinc-500 text-sm mt-1">Pages Tracked</p>
          </div>
        </div>

        {/* Top Pages */}
        <div className="mb-8">
          <h2 className="font-epilogue text-lg font-bold text-white mb-4">Top Pages</h2>
          <div className="space-y-2">
            {topPages.length === 0 && <p className="text-zinc-500 text-sm">No page views recorded yet.</p>}
            {topPages.map((page) => (
              <div key={page.path} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                <span className="text-zinc-300 text-sm font-mono flex-1">{page.path}</span>
                <span className="text-[#2A8B9D] font-bold text-sm">{page.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Breakdown */}
        <div>
          <h2 className="font-epilogue text-lg font-bold text-white mb-4">Daily Breakdown</h2>
          <div className="space-y-4">
            {Object.keys(dateGroups).length === 0 && <p className="text-zinc-500 text-sm">No data yet. Views will appear here once visitors start browsing.</p>}
            {Object.entries(dateGroups).slice(0, 14).map(([date, views]) => (
              <div key={date} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <p className="font-bold text-white text-sm mb-2">{new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                <div className="space-y-1">
                  {views.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-mono">{v.path}</span>
                      <span className="text-zinc-300">{v.views}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
