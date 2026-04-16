'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadImage, deleteImage } from '@/lib/supabase/storage';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Testimonial } from '@/lib/supabase/types';

export default function TestimonialsAdmin() {
  return (
    <AuthGuard>
      {() => <TestimonialsContent />}
    </AuthGuard>
  );
}

function TestimonialsContent() {
  const supabase = createClient();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Testimonial> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editItem?.client_name || !editItem?.business_name || !editItem?.quote) return;
    setSaving(true);

    let image_url = editItem.image_url || null;
    if (imageFile) {
      image_url = await uploadImage(supabase, 'testimonials', imageFile);
    }

    const payload = {
      client_name: editItem.client_name,
      business_name: editItem.business_name,
      quote: editItem.quote,
      image_url,
      rating: editItem.rating || 5,
      is_published: editItem.is_published ?? false,
      display_order: editItem.display_order ?? items.length,
    };

    if (editItem.id) {
      await supabase.from('testimonials').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('testimonials').insert(payload);
    }

    setEditItem(null);
    setImageFile(null);
    setSaving(false);
    fetchItems();
  };

  const handleDelete = async (item: Testimonial) => {
    if (!confirm(`Delete testimonial from "${item.client_name}"?`)) return;
    if (item.image_url) await deleteImage(supabase, 'testimonials', item.image_url);
    await supabase.from('testimonials').delete().eq('id', item.id);
    fetchItems();
  };

  const togglePublish = async (item: Testimonial) => {
    await supabase.from('testimonials').update({ is_published: !item.is_published }).eq('id', item.id);
    fetchItems();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;
  }

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Testimonials</h1>
          <Button onClick={() => setEditItem({ rating: 5, is_published: false, display_order: items.length })} className="ml-auto bg-[#2A8B9D] hover:bg-[#237a8a] text-white">
            <Plus size={16} className="mr-2" /> Add New
          </Button>
        </div>

        {/* Edit Form */}
        {editItem && (
          <div className="mb-8 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <h2 className="font-epilogue text-lg font-bold text-white mb-4">{editItem.id ? 'Edit' : 'New'} Testimonial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Client Name *</Label>
                <Input value={editItem.client_name || ''} onChange={(e) => setEditItem({ ...editItem, client_name: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Business Name *</Label>
                <Input value={editItem.business_name || ''} onChange={(e) => setEditItem({ ...editItem, business_name: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Quote *</Label>
              <Textarea value={editItem.quote || ''} onChange={(e) => setEditItem({ ...editItem, quote: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white min-h-[100px] focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Rating (1-5)</Label>
                <Input type="number" min={1} max={5} value={editItem.rating || 5} onChange={(e) => setEditItem({ ...editItem, rating: parseInt(e.target.value) })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Photo</Label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="bg-zinc-950 border-zinc-800 text-white file:text-zinc-400 focus-visible:ring-[#2A8B9D]" />
                {editItem.image_url && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mt-2">
                    <Image src={editItem.image_url} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="bg-[#C87A4F] hover:bg-[#A6623D] text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
              <Button onClick={() => { setEditItem(null); setImageFile(null); }} variant="outline" className="border-zinc-700 text-zinc-300">Cancel</Button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-zinc-500 text-center py-12">No testimonials yet. Add your first one above.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              {item.image_url && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image src={item.image_url} alt={item.client_name} fill className="object-cover" sizes="48px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.client_name}</span>
                  <span className="text-zinc-500 text-xs">— {item.business_name}</span>
                  {item.is_published ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800">Live</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Draft</span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm truncate">&ldquo;{item.quote}&rdquo;</p>
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
