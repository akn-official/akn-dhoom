'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Trash2, Plus, Eye, EyeOff, GripVertical } from 'lucide-react';
import Link from 'next/link';
import type { Service } from '@/lib/supabase/types';

export default function ServicesAdmin() {
  return <AuthGuard>{() => <ServicesContent />}</AuthGuard>;
}

function ServicesContent() {
  const supabase = createClient();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Service> | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editItem?.title || !editItem?.description) return;
    setSaving(true);

    const payload = {
      title: editItem.title,
      description: editItem.description,
      details: editItem.details || null,
      icon: editItem.icon || null,
      is_published: editItem.is_published ?? false,
      display_order: editItem.display_order ?? items.length,
    };

    if (editItem.id) {
      await supabase.from('services').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('services').insert(payload);
    }

    setEditItem(null);
    setSaving(false);
    fetchItems();
  };

  const handleDelete = async (item: Service) => {
    if (!confirm(`Delete service "${item.title}"?`)) return;
    await supabase.from('services').delete().eq('id', item.id);
    fetchItems();
  };

  const togglePublish = async (item: Service) => {
    await supabase.from('services').update({ is_published: !item.is_published }).eq('id', item.id);
    fetchItems();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Services</h1>
          <Button onClick={() => setEditItem({ is_published: false, display_order: items.length })} className="ml-auto bg-[#2A8B9D] hover:bg-[#237a8a] text-white">
            <Plus size={16} className="mr-2" /> Add New
          </Button>
        </div>

        {/* Edit Form */}
        {editItem && (
          <div className="mb-8 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <h2 className="font-epilogue text-lg font-bold text-white mb-4">{editItem.id ? 'Edit' : 'New'} Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Title *</Label>
                <Input value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Icon (emoji or class)</Label>
                <Input value={editItem.icon || ''} onChange={(e) => setEditItem({ ...editItem, icon: e.target.value })} placeholder="e.g. 🎨 or icon-name" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Description *</Label>
              <Textarea value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white min-h-[80px] focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Details (optional, expanded view)</Label>
              <Textarea value={editItem.details || ''} onChange={(e) => setEditItem({ ...editItem, details: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white min-h-[80px] focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Display Order</Label>
              <Input type="number" min={0} value={editItem.display_order ?? 0} onChange={(e) => setEditItem({ ...editItem, display_order: parseInt(e.target.value) })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D] w-24" />
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
          {items.length === 0 && <p className="text-zinc-500 text-center py-12">No services yet. Add your first one above.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <GripVertical size={16} className="text-zinc-600 shrink-0" />
              {item.icon && <span className="text-2xl shrink-0">{item.icon}</span>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.title}</span>
                  {item.is_published ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800">Live</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Draft</span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm truncate">{item.description}</p>
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
