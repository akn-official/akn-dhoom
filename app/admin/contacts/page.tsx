'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Trash2, Mail, Phone, Download, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import type { ContactSubmission } from '@/lib/supabase/types';
import { exportToCSV } from '@/lib/csv-export';
import { SearchFilterBar } from '@/components/admin/search-filter-bar';
import { useToast } from '@/lib/toast-context';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-900/50 text-blue-400 border-blue-800',
  contacted: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
  qualified: 'bg-green-900/50 text-green-400 border-green-800',
  closed: 'bg-zinc-800 text-zinc-500 border-zinc-700',
};

export default function ContactsAdmin() {
  return <AuthGuard>{() => <ContactsContent />}</AuthGuard>;
}

function ContactsContent() {
  const supabase = createClient();
  const toast = useToast();
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchItems = async () => {
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || item.name.toLowerCase().includes(q) || (item.email || '').toLowerCase().includes(q) || (item.business_name || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [items, search, statusFilter]);

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

  const bulkMarkContacted = async () => {
    const ids = Array.from(selected);
    const { error } = await supabase.from('contact_submissions').update({ status: 'contacted' }).in('id', ids);
    if (error) { toast.error('Update failed', error.message); return; }
    toast.success(`${ids.length} marked as contacted`);
    clearSelection();
    fetchItems();
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    if (!confirm(`Delete ${ids.length} submission${ids.length === 1 ? '' : 's'}? This cannot be undone.`)) return;
    const { error } = await supabase.from('contact_submissions').delete().in('id', ids);
    if (error) { toast.error('Delete failed', error.message); return; }
    toast.success(`${ids.length} submission${ids.length === 1 ? '' : 's'} deleted`);
    clearSelection();
    fetchItems();
  };

  const bulkExport = () => {
    const rows = items.filter((i) => selected.has(i.id));
    exportToCSV(rows.map(i => ({ name: i.name, business_name: i.business_name || '', email: i.email, phone: i.phone || '', business_type: i.business_type || '', status: i.status, source: i.source, message: i.message || '', notes: i.notes || '', created_at: i.created_at })), 'akn-contacts-selected');
    toast.success(`${rows.length} contact${rows.length === 1 ? '' : 's'} exported`);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_submissions').update({ status }).eq('id', id);
    fetchItems();
  };

  const updateNotes = async (id: string, notes: string) => {
    await supabase.from('contact_submissions').update({ notes }).eq('id', id);
    fetchItems();
  };

  const handleDelete = async (item: ContactSubmission) => {
    if (!confirm(`Delete submission from "${item.name}"?`)) return;
    const { error } = await supabase.from('contact_submissions').delete().eq('id', item.id);
    if (error) { toast.error('Delete failed', error.message); return; }
    toast.success('Deleted', item.name);
    fetchItems();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Contact Submissions</h1>
          <span className="ml-auto text-zinc-500 text-sm">{items.filter(i => i.status === 'new').length} new</span>
          {items.length > 0 && (
            <button
              onClick={() => exportToCSV(items.map(i => ({ name: i.name, business_name: i.business_name || '', email: i.email, phone: i.phone || '', business_type: i.business_type || '', status: i.status, source: i.source, message: i.message || '', notes: i.notes || '', created_at: i.created_at })), 'akn-contacts')}
              className="p-2 text-zinc-400 hover:text-[#2A8B9D] transition-colors"
              title="Export CSV"
            >
              <Download size={18} />
            </button>
          )}
        </div>

        <SearchFilterBar
          searchPlaceholder="Search name, email, business..."
          searchValue={search}
          onSearchChange={setSearch}
          filters={[{
            label: 'Status',
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'closed', label: 'Closed' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
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

        <div className="space-y-3">
          {items.length === 0 && <p className="text-zinc-500 text-center py-12">No submissions yet.</p>}
          {filteredItems.map((item) => (
            <div key={item.id} className={`rounded-xl border overflow-hidden transition-colors ${selected.has(item.id) ? 'bg-[#2A8B9D]/10 border-[#2A8B9D]/50' : 'bg-zinc-900/50 border-zinc-800'}`}>
              <div className="flex items-center gap-4 p-4">
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => toggleSelected(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="accent-[#2A8B9D] w-4 h-4 cursor-pointer shrink-0"
                  aria-label={`Select ${item.name}`}
                />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{item.name}</span>
                    {item.business_name && <span className="text-zinc-500 text-xs">— {item.business_name}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                  </div>
                  <p className="text-zinc-500 text-xs mt-1">{formatDate(item.created_at)} &middot; {item.source}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(item); }} className="p-2 text-zinc-400 hover:text-red-400 transition-colors shrink-0"><Trash2 size={16} /></button>
              </div>

              {expandedId === item.id && (
                <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <a href={`mailto:${item.email}`} className="flex items-center gap-2 text-zinc-300 hover:text-[#2A8B9D] transition-colors">
                      <Mail size={14} /> {item.email}
                    </a>
                    {item.phone && (
                      <a href={`tel:${item.phone}`} className="flex items-center gap-2 text-zinc-300 hover:text-[#2A8B9D] transition-colors">
                        <Phone size={14} /> {item.phone}
                      </a>
                    )}
                    {item.business_type && <p className="text-zinc-400">Type: {item.business_type}</p>}
                    {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-[#2A8B9D] hover:underline truncate">{item.website}</a>}
                  </div>
                  {item.message && <p className="text-zinc-300 text-sm bg-zinc-950 p-3 rounded-lg">{item.message}</p>}

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-xs">Status:</span>
                    {['new', 'contacted', 'qualified', 'closed'].map((s) => (
                      <button key={s} onClick={() => updateStatus(item.id, s)} className={`text-xs px-3 py-1 rounded-full border transition-colors ${item.status === s ? STATUS_COLORS[s] : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}>
                        {s}
                      </button>
                    ))}
                  </div>

                  <div>
                    <Textarea
                      defaultValue={item.notes || ''}
                      onBlur={(e) => updateNotes(item.id, e.target.value)}
                      placeholder="Add internal notes..."
                      className="bg-zinc-950 border-zinc-800 text-white text-sm min-h-[60px] focus-visible:ring-[#2A8B9D]"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2 px-4 py-3 rounded-full bg-zinc-900/95 backdrop-blur-md border border-zinc-700 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
          <span className="text-sm font-bold text-white px-2">{selected.size} selected</span>
          <div className="w-px h-6 bg-zinc-700" />
          <button onClick={bulkMarkContacted} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#2A8B9D] hover:bg-[#2A8B9D]/10 transition-colors">
            <CheckCircle2 size={14} /> Mark contacted
          </button>
          <button onClick={bulkExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#C87A4F] hover:bg-[#C87A4F]/10 transition-colors">
            <Download size={14} /> Export
          </button>
          <button onClick={bulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={clearSelection} className="p-1.5 text-zinc-400 hover:text-white transition-colors" aria-label="Clear selection">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
