'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import type { Career } from '@/lib/supabase/types';

export default function CareersAdmin() {
  return <AuthGuard>{() => <CareersContent />}</AuthGuard>;
}

function CareersContent() {
  const supabase = createClient();
  const [items, setItems] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Career> | null>(null);
  const [hiringEnabled, setHiringEnabled] = useState(false);
  const [togglingHiring, setTogglingHiring] = useState(false);

  const fetchItems = async () => {
    const [careersRes, settingRes] = await Promise.all([
      supabase.from('careers').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('value').eq('key', 'hiring_enabled').maybeSingle(),
    ]);
    setItems(careersRes.data || []);
    setHiringEnabled(settingRes.data?.value === 'true');
    setLoading(false);
  };

  const toggleHiringMaster = async () => {
    setTogglingHiring(true);
    const next = !hiringEnabled;
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { key: 'hiring_enabled', value: next ? 'true' : 'false', description: 'Master toggle for careers page' },
        { onConflict: 'key' }
      );
    if (!error) setHiringEnabled(next);
    setTogglingHiring(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    if (!editItem?.title || !editItem?.department || !editItem?.location || !editItem?.description) return;
    setSaving(true);

    const payload = {
      title: editItem.title,
      slug: editItem.slug || generateSlug(editItem.title),
      department: editItem.department,
      type: editItem.type || 'full-time' as const,
      location: editItem.location,
      description: editItem.description,
      requirements: editItem.requirements || null,
      is_published: editItem.is_published ?? false,
    };

    if (editItem.id) {
      await supabase.from('careers').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('careers').insert(payload);
    }

    setEditItem(null);
    setSaving(false);
    fetchItems();
  };

  const handleDelete = async (item: Career) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await supabase.from('careers').delete().eq('id', item.id);
    fetchItems();
  };

  const togglePublish = async (item: Career) => {
    await supabase.from('careers').update({ is_published: !item.is_published }).eq('id', item.id);
    fetchItems();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  const TYPE_LABELS: Record<string, string> = {
    'full-time': 'Full-Time',
    'part-time': 'Part-Time',
    'contract': 'Contract',
    'internship': 'Internship',
  };

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Careers</h1>
          <Button onClick={() => setEditItem({ type: 'full-time', is_published: false })} className="ml-auto bg-[#2A8B9D] hover:bg-[#237a8a] text-white">
            <Plus size={16} className="mr-2" /> Add Position
          </Button>
        </div>

        {/* Master hiring toggle */}
        <div className="mb-8 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-white text-sm">Currently Hiring</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${hiringEnabled ? 'bg-green-900/50 text-green-400 border-green-800' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
                {hiringEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              When OFF, /careers shows a &ldquo;coming soon&rdquo; page regardless of job postings. Turn ON to reveal published openings.
            </p>
          </div>
          <button
            onClick={toggleHiringMaster}
            disabled={togglingHiring}
            role="switch"
            aria-checked={hiringEnabled}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#2A8B9D] disabled:opacity-50 ${hiringEnabled ? 'bg-[#2A8B9D]' : 'bg-zinc-700'}`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition-transform ${hiringEnabled ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>

        {/* Edit Form */}
        {editItem && (
          <div className="mb-8 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <h2 className="font-epilogue text-lg font-bold text-white mb-4">{editItem.id ? 'Edit' : 'New'} Position</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Job Title *</Label>
                <Input value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value, slug: generateSlug(e.target.value) })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Department *</Label>
                <Input value={editItem.department || ''} onChange={(e) => setEditItem({ ...editItem, department: e.target.value })} placeholder="e.g. Design, Marketing, Engineering" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Location *</Label>
                <Input value={editItem.location || ''} onChange={(e) => setEditItem({ ...editItem, location: e.target.value })} placeholder="e.g. Remote, Worldwide" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Type</Label>
                <select
                  value={editItem.type || 'full-time'}
                  onChange={(e) => setEditItem({ ...editItem, type: e.target.value as Career['type'] })}
                  className="w-full h-10 rounded-md bg-zinc-950 border border-zinc-800 text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A8B9D]"
                >
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Slug</Label>
              <Input value={editItem.slug || ''} onChange={(e) => setEditItem({ ...editItem, slug: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-400 focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Description *</Label>
              <Textarea value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} placeholder="What the role involves..." className="bg-zinc-950 border-zinc-800 text-white min-h-[120px] focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Requirements (optional)</Label>
              <Textarea value={editItem.requirements || ''} onChange={(e) => setEditItem({ ...editItem, requirements: e.target.value })} placeholder="Skills, experience, qualifications..." className="bg-zinc-950 border-zinc-800 text-white min-h-[100px] focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="bg-[#C87A4F] hover:bg-[#A6623D] text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
              <Button onClick={() => setEditItem(null)} variant="outline" className="border-zinc-700 text-zinc-300">Cancel</Button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {items.length === 0 && <p className="text-zinc-500 text-center py-12">No job postings yet. Add your first one above.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{item.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{TYPE_LABELS[item.type]}</span>
                  {item.is_published ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800">Live</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Draft</span>
                  )}
                </div>
                <p className="text-zinc-500 text-xs mt-1">{item.department} &middot; {item.location}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublish(item)} className="p-2 text-zinc-400 hover:text-[#2A8B9D] transition-colors" title={item.is_published ? 'Unpublish' : 'Publish'}>
                  {item.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={() => setEditItem(item)} className="p-2 text-zinc-400 hover:text-white transition-colors">Edit</button>
                <button onClick={() => handleDelete(item)} className="p-2 text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
