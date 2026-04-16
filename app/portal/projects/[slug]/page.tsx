'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  status: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
}

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  display_order: number;
}

interface Update {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

const MILESTONE_ICONS: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  in_progress: Clock,
  pending: Circle,
};

const MILESTONE_COLORS: Record<string, string> = {
  completed: 'text-green-400',
  in_progress: 'text-[#C87A4F]',
  pending: 'text-zinc-600',
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = createClient();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!clientData) { setLoading(false); return; }

      const { data: proj } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('client_id', clientData.id)
        .single();

      if (proj) {
        setProject(proj);
        const [ms, up] = await Promise.all([
          supabase.from('project_milestones').select('*').eq('project_id', proj.id).order('display_order'),
          supabase.from('project_updates').select('*').eq('project_id', proj.id).eq('is_public', true).order('created_at', { ascending: false }),
        ]);
        setMilestones(ms.data || []);
        setUpdates(up.data || []);
      }
      setLoading(false);
    };
    fetch();
  }, [slug, supabase]);

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;
  if (!project) return <div className="px-4 py-20 text-center text-zinc-500">Project not found.</div>;

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const progress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/portal/projects" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#2A8B9D] transition-colors mb-6 text-sm">
          <ArrowLeft size={16} /> All Projects
        </Link>

        <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white mb-2">{project.title}</h1>
        {project.description && <p className="text-zinc-400 mb-6">{project.description}</p>}

        {/* Progress bar */}
        {milestones.length > 0 && (
          <div className="mb-10 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-400">Progress</span>
              <span className="text-sm font-bold text-[#2A8B9D]">{progress}%</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#2A8B9D] to-[#C87A4F] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="mb-10">
            <h2 className="font-epilogue text-lg font-bold text-white mb-4">Milestones</h2>
            <div className="space-y-3">
              {milestones.map((ms) => {
                const Icon = MILESTONE_ICONS[ms.status] || Circle;
                return (
                  <div key={ms.id} className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                    <Icon size={20} className={`mt-0.5 shrink-0 ${MILESTONE_COLORS[ms.status]}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-sm ${ms.status === 'completed' ? 'text-zinc-500 line-through' : 'text-white'}`}>{ms.title}</span>
                        {ms.due_date && <span className="text-zinc-600 text-xs">Due: {formatDate(ms.due_date)}</span>}
                      </div>
                      {ms.description && <p className="text-zinc-400 text-sm mt-1">{ms.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Updates */}
        {updates.length > 0 && (
          <div>
            <h2 className="font-epilogue text-lg font-bold text-white mb-4">Updates</h2>
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-white text-sm">{update.title}</h3>
                    <span className="text-zinc-600 text-xs">{formatDate(update.created_at)}</span>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{update.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
