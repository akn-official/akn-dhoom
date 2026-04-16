'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthGuard } from '@/components/admin/auth-guard';
import { Loader2, ArrowLeft, Trash2, Copy, Upload, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const BUCKETS = ['media', 'testimonials', 'works', 'insights'];

interface MediaFile {
  name: string;
  bucket: string;
  url: string;
  created_at: string;
}

export default function MediaAdmin() {
  return <AuthGuard>{() => <MediaContent />}</AuthGuard>;
}

function MediaContent() {
  const supabase = createClient();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchFiles = useCallback(async () => {
    const allFiles: MediaFile[] = [];
    for (const bucket of BUCKETS) {
      const { data } = await supabase.storage.from(bucket).list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
      if (data) {
        for (const file of data) {
          if (file.name === '.emptyFolderPlaceholder') continue;
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(file.name);
          allFiles.push({
            name: file.name,
            bucket,
            url: urlData.publicUrl,
            created_at: file.created_at || '',
          });
        }
      }
    }
    allFiles.sort((a, b) => b.created_at.localeCompare(a.created_at));
    setFiles(allFiles);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    for (const file of Array.from(fileList)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await supabase.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
    }
    setUploading(false);
    fetchFiles();
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.name}" from ${file.bucket}?`)) return;
    await supabase.storage.from(file.bucket).remove([file.name]);
    fetchFiles();
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D]" /></div>;

  return (
    <div className="pt-24 sm:pt-32 px-4 sm:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="font-epilogue text-2xl sm:text-3xl font-bold text-white">Media Library</h1>
          <span className="ml-auto text-zinc-500 text-sm">{files.length} files</span>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mb-8 p-8 rounded-2xl border-2 border-dashed text-center transition-colors ${dragOver ? 'border-[#2A8B9D] bg-[#2A8B9D]/5' : 'border-zinc-700 hover:border-zinc-500'}`}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-[#2A8B9D] mx-auto" />
          ) : (
            <>
              <Upload size={32} className="mx-auto mb-3 text-zinc-500" />
              <p className="text-zinc-400 text-sm mb-3">Drag & drop images here, or</p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A8B9D] hover:bg-[#237a8a] text-white text-sm font-bold cursor-pointer transition-colors">
                <Upload size={14} /> Browse Files
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
              </label>
            </>
          )}
        </div>

        {/* Grid */}
        {files.length === 0 ? (
          <p className="text-zinc-500 text-center py-12">No images uploaded yet.</p>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {files.map((file) => (
              <div key={`${file.bucket}-${file.name}`} className="break-inside-avoid rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800 group">
                <div className="relative aspect-auto">
                  <Image
                    src={file.url}
                    alt={file.name}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => handleCopy(file.url)} className="p-2 rounded-full bg-zinc-900/80 text-white hover:bg-[#2A8B9D] transition-colors" title="Copy URL">
                      {copiedUrl === file.url ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button onClick={() => handleDelete(file)} className="p-2 rounded-full bg-zinc-900/80 text-white hover:bg-red-600 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <p className="text-zinc-400 text-xs truncate">{file.name}</p>
                  <p className="text-zinc-600 text-[10px]">{file.bucket}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
