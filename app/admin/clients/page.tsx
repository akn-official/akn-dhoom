'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Trash2, Plus, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';

interface Client {
  id: string;
  user_id: string | null;
  name: string;
  business_name: string | null;
  email: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export default function ClientsAdmin() {
  return <AuthGuard>{() => <ClientsContent />}</AuthGuard>;
}

function ClientsContent() {
  const supabase = createClient();
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Client> | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editItem?.name || !editItem?.email) return;
    setSaving(true);
    const payload = {
      name: editItem.name,
      business_name: editItem.business_name || null,
      email: editItem.email,
      phone: editItem.phone || null,
      is_active: editItem.is_active ?? true,
    };

    if (editItem.id) {
      await supabase.from('clients').update(payload).eq('id', editItem.id);
    } else {
      await supabase.from('clients').insert(payload);
    }
    setEditItem(null);
    setSaving(false);
    fetchItems();
  };

  const handleDelete = async (item: Client) => {
    if (!confirm(`Delete client "${item.name}"? This will also delete their projects.`)) return;
    await supabase.from('clients').delete().eq('id', item.id);
    fetchItems();
  };

  const toggleActive = async (item: Client) => {
    await supabase.from('clients').update({ is_active: !item.is_active }).eq('id', item.id);
    fetchItems();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Clients</h1>
          <Button onClick={() => setEditItem({ is_active: true })} className="ml-auto bg-[#2A8B9D] hover:bg-[#237a8a] text-white">
            <Plus size={16} className="mr-2" /> Add Client
          </Button>
        </div>

        {editItem && (
          <div className="mb-8 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <h2 className="font-epilogue text-lg font-bold text-white mb-4">{editItem.id ? 'Edit' : 'New'} Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Name *</Label>
                <Input value={editItem.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Business Name</Label>
                <Input value={editItem.business_name || ''} onChange={(e) => setEditItem({ ...editItem, business_name: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Email *</Label>
                <Input type="email" value={editItem.email || ''} onChange={(e) => setEditItem({ ...editItem, email: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Phone</Label>
                <Input value={editItem.phone || ''} onChange={(e) => setEditItem({ ...editItem, phone: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="bg-[#C87A4F] hover:bg-[#A6623D] text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
              <Button onClick={() => setEditItem(null)} variant="outline" className="border-zinc-700 text-zinc-300">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {items.length === 0 && <p className="text-zinc-500 text-center py-12">No clients yet.</p>}
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{item.name}</span>
                  {item.business_name && <span className="text-zinc-500 text-xs">— {item.business_name}</span>}
                  {item.is_active ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800">Active</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Inactive</span>
                  )}
                </div>
                <p className="text-zinc-400 text-xs mt-1">{item.email} {item.phone ? `· ${item.phone}` : ''}</p>
              </div>
              <button onClick={() => toggleActive(item)} className="p-2 text-zinc-400 hover:text-[#2A8B9D] transition-colors" title={item.is_active ? 'Deactivate' : 'Activate'}>
                {item.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
              </button>
              <button onClick={() => setEditItem(item)} className="p-2 text-zinc-400 hover:text-white transition-colors text-sm">Edit</button>
              <button onClick={() => handleDelete(item)} className="p-2 text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
