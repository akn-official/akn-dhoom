'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, FolderKanban, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

interface ClientProfile {
  id: string;
  name: string;
  business_name: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  status: string;
  description: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-900/50 text-green-400 border-green-800',
  paused: 'bg-yellow-900/50 text-yellow-400 border-yellow-800',
  completed: 'bg-[#2A8B9D]/20 text-[#2A8B9D] border-[#2A8B9D]/30',
  cancelled: 'bg-zinc-800 text-zinc-500 border-zinc-700',
};

export default function PortalDashboard() {
  const supabase = createClient();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: clientData } = await supabase
        .from('clients')
        .select('id, name, business_name')
        .eq('user_id', user.id)
        .single();

      if (clientData) {
        setClient(clientData);
        const { data: projectData } = await supabase
          .from('projects')
          .select('id, title, slug, status, description')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false });
        setProjects(projectData || []);
      }
      setLoading(false);
    };
    fetch();
  }, [supabase]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  const activeCount = projects.filter(p => p.status === 'active').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome back{client ? `, ${client.name}` : ''}
          </h1>
          {client?.business_name && <p className="text-zinc-400">{client.business_name}</p>}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
            <FolderKanban className="mx-auto mb-2 text-[#2A8B9D]" size={24} />
            <p className="font-epilogue text-2xl font-bold text-white">{projects.length}</p>
            <p className="text-zinc-500 text-xs">Total Projects</p>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
            <Clock className="mx-auto mb-2 text-[#C87A4F]" size={24} />
            <p className="font-epilogue text-2xl font-bold text-white">{activeCount}</p>
            <p className="text-zinc-500 text-xs">Active</p>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
            <CheckCircle2 className="mx-auto mb-2 text-green-400" size={24} />
            <p className="font-epilogue text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-zinc-500 text-xs">Completed</p>
          </div>
        </div>

        {/* Projects */}
        <h2 className="font-epilogue text-lg font-bold text-white mb-4">Your Projects</h2>
        {projects.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">No projects yet. Your AKN team will add them here.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/portal/projects/${project.slug}`}
                className="block p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#2A8B9D]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-epilogue font-bold text-white">{project.title}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${STATUS_STYLES[project.status] || STATUS_STYLES.active}`}>
                    {project.status}
                  </span>
                </div>
                {project.description && <p className="text-zinc-400 text-sm line-clamp-2">{project.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
