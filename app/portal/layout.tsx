'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthenticated(true);
      } else if (pathname !== '/portal/login') {
        router.replace('/portal/login');
      }
      setLoading(false);
    });
  }, [pathname, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" />
      </div>
    );
  }

  // Login page gets no portal nav
  if (pathname === '/portal/login') {
    return <>{children}</>;
  }

  if (!authenticated) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/portal/login');
  };

  const navItems = [
    { href: '/portal', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portal/projects', label: 'Projects', icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 bg-[#0A0F1C]/80 backdrop-blur-lg border-b border-zinc-800/50">
        <Link href="/portal" className="relative w-24 h-8">
          <Image src="/logo.png" alt="AKN" fill className="object-contain object-left" />
        </Link>
        <div className="flex items-center gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === item.href ? 'text-[#2A8B9D]' : 'text-zinc-400 hover:text-white'}`}
            >
              <item.icon size={16} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors ml-2">
            <LogOut size={16} />
          </button>
        </div>
      </nav>
      <main className="pt-20">{children}</main>
    </div>
  );
}
