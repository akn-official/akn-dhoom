import { SupabaseClient } from '@supabase/supabase-js';

export async function uploadImage(
  supabase: SupabaseClient,
  bucket: string,
  file: File,
): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteImage(
  supabase: SupabaseClient,
  bucket: string,
  url: string,
): Promise<void> {
  // Extract file name from public URL
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  if (fileName) {
    await supabase.storage.from(bucket).remove([fileName]);
  }
}
