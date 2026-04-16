'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadImage, deleteImage } from '@/lib/supabase/storage';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { Loader2, ArrowLeft, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
import Link from 'next/link';
import Image from 'next/image';
import type { Insight } from '@/lib/supabase/types';
import { SearchFilterBar } from '@/components/admin/search-filter-bar';
import { useToast } from '@/lib/toast-context';

export default function InsightsAdmin() {
  return (
    <AuthGuard>
      {() => <InsightsContent />}
    </AuthGuard>
  );
}

function InsightsContent() {
  const supabase = createClient();
  const toast = useToast();
  const [items, setItems] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Insight> | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [pubFilter, setPubFilter] = useState('all');

  const fetchItems = async () => {
    const { data } = await supabase
      .from('insights')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    if (!editItem?.title || !editItem?.excerpt || !editItem?.body) {
      toast.error('Missing fields', 'Title, excerpt, and body are required.');
      return;
    }
    setSaving(true);

    let cover_image_url = editItem.cover_image_url || null;
    if (coverFile) {
      cover_image_url = await uploadImage(supabase, 'insights', coverFile);
    }

    const payload = {
      title: editItem.title,
      slug: editItem.slug || slugify(editItem.title),
      excerpt: editItem.excerpt,
      body: editItem.body,
      cover_image_url,
      author: editItem.author || 'AKN Team',
      tags: editItem.tags || [],
      is_published: editItem.is_published ?? false,
      publish_at: editItem.publish_at || null,
    };

    const isUpdate = !!editItem.id;
    const { error: saveError } = isUpdate
      ? await supabase.from('insights').update(payload).eq('id', editItem.id!)
      : await supabase.from('insights').insert(payload);

    setSaving(false);

    if (saveError) {
      toast.error('Save failed', saveError.message);
      return;
    }

    toast.success(isUpdate ? 'Article updated' : 'Article created', payload.title);
    setEditItem(null);
    setCoverFile(null);
    fetchItems();
  };

  const handleDelete = async (item: Insight) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    if (item.cover_image_url) await deleteImage(supabase, 'insights', item.cover_image_url);
    const { error: delError } = await supabase.from('insights').delete().eq('id', item.id);
    if (delError) {
      toast.error('Delete failed', delError.message);
      return;
    }
    toast.success('Article deleted', item.title);
    fetchItems();
  };

  const togglePublish = async (item: Insight) => {
    const { error: pubError } = await supabase.from('insights').update({ is_published: !item.is_published }).eq('id', item.id);
    if (pubError) {
      toast.error('Update failed', pubError.message);
      return;
    }
    toast.success(item.is_published ? 'Unpublished' : 'Published', item.title);
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
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Insights / Blog</h1>
          <Button onClick={() => setEditItem({ is_published: false, author: 'AKN Team', tags: [] })} className="ml-auto bg-[#2A8B9D] hover:bg-[#237a8a] text-white">
            <Plus size={16} className="mr-2" /> Add New
          </Button>
        </div>

        {/* Edit Form */}
        {editItem && (
          <div className="mb-8 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <h2 className="font-epilogue text-lg font-bold text-white mb-4">{editItem.id ? 'Edit' : 'New'} Article</h2>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Title *</Label>
              <Input value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value, slug: editItem.id ? editItem.slug : slugify(e.target.value) })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Excerpt * <span className="text-zinc-500 text-xs">(shown on cards)</span></Label>
              <Textarea value={editItem.excerpt || ''} onChange={(e) => setEditItem({ ...editItem, excerpt: e.target.value })} placeholder="A brief summary shown on the insights listing page..." className="bg-zinc-950 border-zinc-800 text-white min-h-[80px] focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="space-y-2 mb-4" data-color-mode="dark">
              <Label className="text-zinc-300">Body * <span className="text-zinc-500 text-xs">(supports full Markdown)</span></Label>
              <MDEditor
                value={editItem.body || ''}
                onChange={(val) => setEditItem({ ...editItem, body: val || '' })}
                height={400}
                preview="live"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Author</Label>
                <Input value={editItem.author || ''} onChange={(e) => setEditItem({ ...editItem, author: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Tags (comma separated)</Label>
                <Input value={(editItem.tags || []).join(', ')} onChange={(e) => setEditItem({ ...editItem, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="SEO, Growth, Strategy" className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Cover Image</Label>
                <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="bg-zinc-950 border-zinc-800 text-white file:text-zinc-400 focus-visible:ring-[#2A8B9D]" />
                {editItem.cover_image_url && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden mt-2">
                    <Image src={editItem.cover_image_url} alt="" fill className="object-cover" sizes="400px" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Schedule Publish <span className="text-zinc-500 text-xs">(optional — leave empty to publish immediately when marked Published)</span></Label>
              <Input
                type="datetime-local"
                value={editItem.publish_at ? new Date(editItem.publish_at).toISOString().slice(0, 16) : ''}
                onChange={(e) => setEditItem({ ...editItem, publish_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D] w-full md:w-1/2"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="bg-[#C87A4F] hover:bg-[#A6623D] text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
              <Button onClick={() => { setEditItem(null); setCoverFile(null); }} variant="outline" className="border-zinc-700 text-zinc-300">Cancel</Button>
            </div>
          </div>
        )}

        {/* List */}
        <SearchFilterBar
          searchPlaceholder="Search title, excerpt..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={[{
            label: 'Status',
            options: [
              { value: 'all', label: 'All' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
            ],
            value: pubFilter,
            onChange: setPubFilter,
          }]}
        />
        <div className="space-y-3">
          {items.length === 0 && (
            <p className="text-zinc-500 text-center py-12">No articles yet. Write your first one above.</p>
          )}
          {items
            .filter((item) => {
              const q = search.toLowerCase();
              const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q);
              const matchesPub = pubFilter === 'all' || (pubFilter === 'published' ? item.is_published : !item.is_published);
              return matchesSearch && matchesPub;
            })
            .map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              {item.cover_image_url && (
                <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.cover_image_url} alt={item.title} fill className="object-cover" sizes="80px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{item.title}</span>
                  <span className="text-zinc-500 text-xs">by {item.author}</span>
                  {item.is_published ? (
                    item.publish_at && new Date(item.publish_at).getTime() > Date.now() ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 border border-amber-800">Scheduled {new Date(item.publish_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800">Live</span>
                    )
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Draft</span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm truncate">{item.excerpt}</p>
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
