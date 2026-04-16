'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function PortalLogin() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace('/portal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0F1C]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative w-32 h-12 mx-auto mb-4">
            <Image src="/logo.png" alt="AKN" fill className="object-contain" />
          </div>
          <h1 className="font-epilogue text-2xl font-bold text-white mb-2">Client Portal</h1>
          <p className="text-zinc-400 text-sm">Sign in to view your projects</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#2A8B9D] hover:bg-[#237a8a] text-white font-bold">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
