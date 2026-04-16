'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  slug: string;
  status: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-900/50 text-green-400 border-green-800',
  paused: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
  completed: 'bg-[#2A8B9D]/20 text-[#2A8B9D] border-[#2A8B9D]/30',
  cancelled: 'bg-zinc-800 text-zinc-500 border-zinc-700',
};

export default function PortalProjects() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
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

      if (clientData) {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false });
        setProjects(data || []);
      }
      setLoading(false);
    };
    fetch();
  }, [supabase]);

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white mb-8">Your Projects</h1>

        {projects.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">No projects yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/portal/projects/${project.slug}`}
                className="block p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-epilogue text-lg font-bold text-white">{project.title}</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[project.status] || STATUS_STYLES.active}`}>
                    {project.status}
                  </span>
                </div>
                {project.description && <p className="text-zinc-400 text-sm mb-3">{project.description}</p>}
                <div className="flex gap-4 text-zinc-500 text-xs">
                  {project.start_date && <span>Started: {formatDate(project.start_date)}</span>}
                  {project.end_date && <span>Due: {formatDate(project.end_date)}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
