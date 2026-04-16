'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Client { id: string; name: string; business_name: string | null; }
interface Project {
  id: string;
  client_id: string;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}
interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  display_order: number;
}
interface Update {
  id: string;
  project_id: string;
  title: string;
  body: string;
  is_public: boolean;
  created_at: string;
}

export default function ProjectsAdmin() {
  return <AuthGuard>{() => <ProjectsContent />}</AuthGuard>;
}

function ProjectsContent() {
  const supabase = createClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editProject, setEditProject] = useState<Partial<Project> | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [newMilestone, setNewMilestone] = useState('');
  const [newUpdate, setNewUpdate] = useState({ title: '', body: '' });

  const fetchData = async () => {
    const [c, p] = await Promise.all([
      supabase.from('clients').select('id, name, business_name').order('name'),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
    ]);
    setClients(c.data || []);
    setProjects(p.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const fetchDetails = async (projectId: string) => {
    const [ms, up] = await Promise.all([
      supabase.from('project_milestones').select('*').eq('project_id', projectId).order('display_order'),
      supabase.from('project_updates').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    ]);
    setMilestones(ms.data || []);
    setUpdates(up.data || []);
  };

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchDetails(id);
    }
  };

  const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSaveProject = async () => {
    if (!editProject?.title || !editProject?.client_id) return;
    setSaving(true);
    const payload = {
      client_id: editProject.client_id,
      title: editProject.title,
      slug: editProject.slug || slugify(editProject.title),
      description: editProject.description || null,
      status: editProject.status || 'active',
      start_date: editProject.start_date || null,
      end_date: editProject.end_date || null,
    };
    if (editProject.id) {
      await supabase.from('projects').update(payload).eq('id', editProject.id);
    } else {
      await supabase.from('projects').insert(payload);
    }
    setEditProject(null);
    setSaving(false);
    fetchData();
  };

  const handleDeleteProject = async (p: Project) => {
    if (!confirm(`Delete project "${p.title}"?`)) return;
    await supabase.from('projects').delete().eq('id', p.id);
    fetchData();
  };

  const addMilestone = async (projectId: string) => {
    if (!newMilestone.trim()) return;
    await supabase.from('project_milestones').insert({ project_id: projectId, title: newMilestone, display_order: milestones.length });
    setNewMilestone('');
    fetchDetails(projectId);
  };

  const toggleMilestoneStatus = async (ms: Milestone) => {
    const next = ms.status === 'completed' ? 'pending' : ms.status === 'pending' ? 'in_progress' : 'completed';
    await supabase.from('project_milestones').update({ status: next, completed_at: next === 'completed' ? new Date().toISOString() : null }).eq('id', ms.id);
    fetchDetails(ms.project_id);
  };

  const deleteMilestone = async (ms: Milestone) => {
    await supabase.from('project_milestones').delete().eq('id', ms.id);
    fetchDetails(ms.project_id);
  };

  const addUpdate = async (projectId: string) => {
    if (!newUpdate.title.trim() || !newUpdate.body.trim()) return;
    await supabase.from('project_updates').insert({ project_id: projectId, title: newUpdate.title, body: newUpdate.body, is_public: true });
    setNewUpdate({ title: '', body: '' });
    fetchDetails(projectId);
  };

  const getClientName = (clientId: string) => {
    const c = clients.find(c => c.id === clientId);
    return c ? (c.business_name || c.name) : 'Unknown';
  };

  const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-900/50 text-green-400 border-green-800',
    paused: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
    completed: 'bg-[#2A8B9D]/20 text-[#2A8B9D] border-[#2A8B9D]/30',
    cancelled: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Projects</h1>
          <Button onClick={() => setEditProject({ status: 'active' })} className="ml-auto bg-[#2A8B9D] hover:bg-[#237a8a] text-white">
            <Plus size={16} className="mr-2" /> New Project
          </Button>
        </div>

        {editProject && (
          <div className="mb-8 p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <h2 className="font-epilogue text-lg font-bold text-white mb-4">{editProject.id ? 'Edit' : 'New'} Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Client *</Label>
                <select value={editProject.client_id || ''} onChange={(e) => setEditProject({ ...editProject, client_id: e.target.value })} className="w-full h-10 rounded-md bg-zinc-950 border border-zinc-800 text-white px-3 text-sm focus:ring-2 focus:ring-[#2A8B9D]">
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.business_name ? ` (${c.business_name})` : ''}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Title *</Label>
                <Input value={editProject.title || ''} onChange={(e) => setEditProject({ ...editProject, title: e.target.value, slug: editProject.id ? editProject.slug : slugify(e.target.value) })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Status</Label>
                <select value={editProject.status || 'active'} onChange={(e) => setEditProject({ ...editProject, status: e.target.value })} className="w-full h-10 rounded-md bg-zinc-950 border border-zinc-800 text-white px-3 text-sm focus:ring-2 focus:ring-[#2A8B9D]">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Start Date</Label>
                <Input type="date" value={editProject.start_date || ''} onChange={(e) => setEditProject({ ...editProject, start_date: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white focus-visible:ring-[#2A8B9D]" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label className="text-zinc-300">Description</Label>
              <Textarea value={editProject.description || ''} onChange={(e) => setEditProject({ ...editProject, description: e.target.value })} className="bg-zinc-950 border-zinc-800 text-white min-h-[80px] focus-visible:ring-[#2A8B9D]" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSaveProject} disabled={saving} className="bg-[#C87A4F] hover:bg-[#A6623D] text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
              <Button onClick={() => setEditProject(null)} variant="outline" className="border-zinc-700 text-zinc-300">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {projects.length === 0 && <p className="text-zinc-500 text-center py-12">No projects yet.</p>}
          {projects.map((p) => (
            <div key={p.id} className="rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
              <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => toggleExpand(p.id)}>
                {expandedId === p.id ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{p.title}</span>
                    <span className="text-zinc-500 text-xs">— {getClientName(p.client_id)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setEditProject(p); }} className="p-2 text-zinc-400 hover:text-white transition-colors text-sm">Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(p); }} className="p-2 text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>

              {expandedId === p.id && (
                <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-6">
                  {/* Milestones */}
                  <div>
                    <h3 className="text-sm font-bold text-zinc-300 mb-3">Milestones</h3>
                    <div className="space-y-2 mb-3">
                      {milestones.map((ms) => (
                        <div key={ms.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-950/50">
                          <button onClick={() => toggleMilestoneStatus(ms)} className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[ms.status] || 'border-zinc-700 text-zinc-500'}`}>
                            {ms.status}
                          </button>
                          <span className="text-white text-sm flex-1">{ms.title}</span>
                          <button onClick={() => deleteMilestone(ms)} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)} placeholder="Add milestone..." className="bg-zinc-950 border-zinc-800 text-white text-sm focus-visible:ring-[#2A8B9D]" onKeyDown={(e) => e.key === 'Enter' && addMilestone(p.id)} />
                      <Button onClick={() => addMilestone(p.id)} size="sm" className="bg-[#2A8B9D] hover:bg-[#237a8a] text-white shrink-0">Add</Button>
                    </div>
                  </div>

                  {/* Updates */}
                  <div>
                    <h3 className="text-sm font-bold text-zinc-300 mb-3">Updates</h3>
                    <div className="space-y-2 mb-3">
                      {updates.map((up) => (
                        <div key={up.id} className="p-3 rounded-lg bg-zinc-950/50">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-bold">{up.title}</span>
                            <span className="text-zinc-600 text-xs">{new Date(up.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </div>
                          <p className="text-zinc-400 text-sm">{up.body}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Input value={newUpdate.title} onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })} placeholder="Update title" className="bg-zinc-950 border-zinc-800 text-white text-sm focus-visible:ring-[#2A8B9D]" />
                      <Textarea value={newUpdate.body} onChange={(e) => setNewUpdate({ ...newUpdate, body: e.target.value })} placeholder="Update details..." className="bg-zinc-950 border-zinc-800 text-white text-sm min-h-[60px] focus-visible:ring-[#2A8B9D]" />
                      <Button onClick={() => addUpdate(p.id)} size="sm" className="bg-[#C87A4F] hover:bg-[#A6623D] text-white">Post Update</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
