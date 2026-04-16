'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { SiteSetting } from '@/lib/supabase/types';

export default function SettingsAdmin() {
  return <AuthGuard>{() => <SettingsContent />}</AuthGuard>;
}

function SettingsContent() {
  const supabase = createClient();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState<Record<string, string>>({});

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .order('key', { ascending: true });
    setSettings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (key: string, value: string) => {
    setEdited((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.entries(edited);
    for (const [key, value] of updates) {
      await supabase.from('site_settings').update({ value }).eq('key', key);
    }
    setEdited({});
    setSaving(false);
    fetchSettings();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  const hasChanges = Object.keys(edited).length > 0;

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Site Settings</h1>
          {hasChanges && (
            <Button onClick={handleSave} disabled={saving} className="ml-auto bg-[#2A8B9D] hover:bg-[#237a8a] text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save size={16} className="mr-2" /> Save Changes</>}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <Label className="text-zinc-300 text-sm font-bold uppercase tracking-wider">{setting.key.replace(/_/g, ' ')}</Label>
              {setting.description && <p className="text-zinc-500 text-xs mb-2">{setting.description}</p>}
              <Input
                value={edited[setting.key] ?? setting.value}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                className={`bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D] mt-1 ${edited[setting.key] !== undefined ? 'border-[#C87A4F]' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
