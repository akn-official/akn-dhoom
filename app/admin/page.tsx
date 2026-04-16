'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { TrendChart } from '@/components/admin/trend-chart';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const [counts, setCounts] = useState<{ newContacts: number; todayViews: number; activeSubscribers: number } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  // Fetch dashboard counts after auth
  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      const today = new Date().toISOString().split('T')[0];
      const [contacts, views, subscribers] = await Promise.all([
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);
      setCounts({
        newContacts: contacts.count || 0,
        todayViews: views.count || 0,
        activeSubscribers: subscribers.count || 0,
      });
    };
    fetchCounts();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setSigningIn(false);
    } else {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" />
      </div>
    );
  }

  // Not logged in — show login form
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-epilogue text-3xl font-bold text-white mb-2">AKN Admin</h1>
            <p className="text-zinc-400 text-sm">Sign in to manage content</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]"
              />
            </div>
            <Button
              type="submit"
              disabled={signingIn}
              className="w-full bg-[#2A8B9D] hover:bg-[#237a8a] text-white font-bold"
            >
              {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Logged in — show dashboard
  return (
    <div className="min-h-screen pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-epilogue text-3xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-zinc-400 text-sm">Signed in as {user.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Sign Out
          </Button>
        </div>

        {/* Trend Chart */}
        <div className="mb-10">
          <TrendChart />
        </div>

        {/* Content Management */}
        <h2 className="font-epilogue text-lg font-bold text-zinc-400 uppercase tracking-wider mb-4">Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link href="/admin/testimonials" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors">
            <div className="text-4xl mb-4">&#x2764;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#2A8B9D] transition-colors mb-2">Testimonials</h2>
            <p className="text-zinc-400 text-sm">Manage client testimonials and reviews</p>
          </Link>

          <Link href="/admin/work" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#C87A4F]/50 transition-colors">
            <div className="text-4xl mb-4">&#x1F4BC;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#C87A4F] transition-colors mb-2">Work / Portfolio</h2>
            <p className="text-zinc-400 text-sm">Manage case studies and portfolio items</p>
          </Link>

          <Link href="/admin/insights" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors">
            <div className="text-4xl mb-4">&#x270D;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#2A8B9D] transition-colors mb-2">Insights / Blog</h2>
            <p className="text-zinc-400 text-sm">Write and publish blog articles</p>
          </Link>

          <Link href="/admin/services" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#C87A4F]/50 transition-colors">
            <div className="text-4xl mb-4">&#x2699;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#C87A4F] transition-colors mb-2">Services</h2>
            <p className="text-zinc-400 text-sm">Manage service offerings on the homepage</p>
          </Link>

          <Link href="/admin/careers" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors">
            <div className="text-4xl mb-4">&#x1F4CB;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#2A8B9D] transition-colors mb-2">Careers</h2>
            <p className="text-zinc-400 text-sm">Post and manage job openings</p>
          </Link>

          <Link href="/admin/media" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#C87A4F]/50 transition-colors">
            <div className="text-4xl mb-4">&#x1F5BC;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#C87A4F] transition-colors mb-2">Media Library</h2>
            <p className="text-zinc-400 text-sm">Upload and manage images</p>
          </Link>
        </div>

        {/* CRM & Data */}
        <h2 className="font-epilogue text-lg font-bold text-zinc-400 uppercase tracking-wider mb-4">CRM & Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link href="/admin/contacts" className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors">
            {counts && counts.newContacts > 0 && (
              <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-900/50 text-blue-400 border border-blue-800">{counts.newContacts} new</span>
            )}
            <div className="text-4xl mb-4">&#x1F4E9;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#2A8B9D] transition-colors mb-2">Contact Submissions</h2>
            <p className="text-zinc-400 text-sm">View and manage form submissions</p>
          </Link>

          <Link href="/admin/subscribers" className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#C87A4F]/50 transition-colors">
            {counts && counts.activeSubscribers > 0 && (
              <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-[#C87A4F]/20 text-[#C87A4F] border border-[#C87A4F]/30">{counts.activeSubscribers} active</span>
            )}
            <div className="text-4xl mb-4">&#x1F4E7;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#C87A4F] transition-colors mb-2">Subscribers</h2>
            <p className="text-zinc-400 text-sm">Newsletter subscriber management</p>
          </Link>

          <Link href="/admin/analytics" className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors">
            {counts && counts.todayViews > 0 && (
              <span className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full bg-[#2A8B9D]/20 text-[#2A8B9D] border border-[#2A8B9D]/30">{counts.todayViews} today</span>
            )}
            <div className="text-4xl mb-4">&#x1F4CA;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#2A8B9D] transition-colors mb-2">Analytics</h2>
            <p className="text-zinc-400 text-sm">Page views and traffic data</p>
          </Link>

          <Link href="/admin/clients" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#C87A4F]/50 transition-colors">
            <div className="text-4xl mb-4">&#x1F465;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#C87A4F] transition-colors mb-2">Clients</h2>
            <p className="text-zinc-400 text-sm">Manage client accounts</p>
          </Link>

          <Link href="/admin/projects" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors">
            <div className="text-4xl mb-4">&#x1F4C1;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#2A8B9D] transition-colors mb-2">Projects</h2>
            <p className="text-zinc-400 text-sm">Manage client projects & milestones</p>
          </Link>

          <Link href="/admin/settings" className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#C87A4F]/50 transition-colors">
            <div className="text-4xl mb-4">&#x2699;&#xFE0F;</div>
            <h2 className="font-epilogue text-xl font-bold text-white group-hover:text-[#C87A4F] transition-colors mb-2">Settings</h2>
            <p className="text-zinc-400 text-sm">Site-wide configuration</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
