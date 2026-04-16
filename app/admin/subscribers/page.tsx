'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Loader2, ArrowLeft, Trash2, UserX, UserCheck, Download, X } from 'lucide-react';
import Link from 'next/link';
import type { NewsletterSubscriber } from '@/lib/supabase/types';
import { exportToCSV } from '@/lib/csv-export';
import { SearchFilterBar } from '@/components/admin/search-filter-bar';
import { useToast } from '@/lib/toast-context';

export default function SubscribersAdmin() {
  return <AuthGuard>{() => <SubscribersContent />}</AuthGuard>;
}

function SubscribersContent() {
  const supabase = createClient();
  const toast = useToast();
  const [items, setItems] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchItems = async () => {
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || item.email.toLowerCase().includes(q) || (item.name || '').toLowerCase().includes(q);
    const matchesActive = activeFilter === 'all' || (activeFilter === 'active' ? item.is_active : !item.is_active);
    return matchesSearch && matchesActive;
  }), [items, search, activeFilter]);

  const toggleSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filteredItems.length && filteredItems.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const clearSelection = () => setSelected(new Set());

  const bulkDeactivate = async () => {
    const ids = Array.from(selected);
    const { error } = await supabase.from('newsletter_subscribers').update({ is_active: false }).in('id', ids);
    if (error) { toast.error('Update failed', error.message); return; }
    toast.success(`${ids.length} deactivated`);
    clearSelection();
    fetchItems();
  };

  const bulkActivate = async () => {
    const ids = Array.from(selected);
    const { error } = await supabase.from('newsletter_subscribers').update({ is_active: true }).in('id', ids);
    if (error) { toast.error('Update failed', error.message); return; }
    toast.success(`${ids.length} activated`);
    clearSelection();
    fetchItems();
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    if (!confirm(`Remove ${ids.length} subscriber${ids.length === 1 ? '' : 's'}? This cannot be undone.`)) return;
    const { error } = await supabase.from('newsletter_subscribers').delete().in('id', ids);
    if (error) { toast.error('Delete failed', error.message); return; }
    toast.success(`${ids.length} subscriber${ids.length === 1 ? '' : 's'} removed`);
    clearSelection();
    fetchItems();
  };

  const bulkExport = () => {
    const rows = items.filter((i) => selected.has(i.id));
    exportToCSV(rows.map(i => ({ email: i.email, name: i.name || '', is_active: String(i.is_active), source: i.source, created_at: i.created_at })), 'akn-subscribers-selected');
    toast.success(`${rows.length} subscriber${rows.length === 1 ? '' : 's'} exported`);
  };

  const toggleActive = async (item: NewsletterSubscriber) => {
    const { error } = await supabase.from('newsletter_subscribers').update({ is_active: !item.is_active }).eq('id', item.id);
    if (error) { toast.error('Update failed', error.message); return; }
    toast.success(item.is_active ? 'Deactivated' : 'Activated', item.email);
    fetchItems();
  };

  const handleDelete = async (item: NewsletterSubscriber) => {
    if (!confirm(`Remove "${item.email}"?`)) return;
    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', item.id);
    if (error) { toast.error('Delete failed', error.message); return; }
    toast.success('Subscriber removed', item.email);
    fetchItems();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  const activeCount = items.filter(i => i.is_active).length;

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Newsletter Subscribers</h1>
          <span className="ml-auto text-zinc-500 text-sm">{activeCount} active / {items.length} total</span>
          {items.length > 0 && (
            <button
              onClick={() => exportToCSV(items.map(i => ({ email: i.email, name: i.name || '', is_active: String(i.is_active), source: i.source, created_at: i.created_at })), 'akn-subscribers')}
              className="p-2 text-zinc-400 hover:text-[#2A8B9D] transition-colors"
              title="Export CSV"
            >
              <Download size={18} />
            </button>
          )}
        </div>

        <SearchFilterBar
          searchPlaceholder="Search email, name..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={[{
            label: 'Status',
            options: [
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
            value: activeFilter,
            onChange: setActiveFilter,
          }]}
        />

        {filteredItems.length > 0 && (
          <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
            <input
              type="checkbox"
              checked={selected.size === filteredItems.length && filteredItems.length > 0}
              onChange={toggleSelectAll}
              className="accent-[#2A8B9D] w-4 h-4 cursor-pointer"
              aria-label="Select all"
            />
            <span>Select all ({filteredItems.length})</span>
          </div>
        )}

        <div className="space-y-2">
          {items.length === 0 && <p className="text-zinc-500 text-center py-12">No subscribers yet.</p>}
          {filteredItems.map((item) => (
            <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${selected.has(item.id) ? 'bg-[#2A8B9D]/10 border-[#2A8B9D]/50' : 'bg-zinc-900/50 border-zinc-800'}`}>
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggleSelected(item.id)}
                className="accent-[#2A8B9D] w-4 h-4 cursor-pointer shrink-0"
                aria-label={`Select ${item.email}`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.email}</span>
                  {item.name && <span className="text-zinc-500 text-xs">({item.name})</span>}
                  {item.is_active ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800">Active</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Inactive</span>
                  )}
                </div>
                <p className="text-zinc-500 text-xs mt-1">Joined {formatDate(item.created_at)} &middot; {item.source}</p>
              </div>
              <button onClick={() => toggleActive(item)} className="p-2 text-zinc-400 hover:text-[#2A8B9D] transition-colors" title={item.is_active ? 'Deactivate' : 'Activate'}>
                {item.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
              </button>
              <button onClick={() => handleDelete(item)} className="p-2 text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 px-4 py-3 rounded-full bg-zinc-900/95 backdrop-blur-md border border-zinc-700 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
          <span className="text-sm font-bold text-white px-2">{selected.size} selected</span>
          <div className="w-px h-6 bg-zinc-700" />
          <button onClick={bulkActivate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#2A8B9D] hover:bg-[#2A8B9D]/10 transition-colors">
            <UserCheck size={14} /> Activate
          </button>
          <button onClick={bulkDeactivate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition-colors">
            <UserX size={14} /> Deactivate
          </button>
          <button onClick={bulkExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#C87A4F] hover:bg-[#C87A4F]/10 transition-colors">
            <Download size={14} /> Export
          </button>
          <button onClick={bulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 size={14} /> Remove
          </button>
          <button onClick={clearSelection} className="p-1.5 text-zinc-400 hover:text-white transition-colors" aria-label="Clear selection">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
