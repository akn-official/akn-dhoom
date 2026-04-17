import { createBrowserClient } from '@supabase/ssr';

// Public anon credentials — safe to ship. RLS protects data server-side.
const SUPABASE_URL = 'https://zxfbegrxkkgfzlfsdalt.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZmJlZ3J4a2tnZnpsZnNkYWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzY5MjgsImV4cCI6MjA5MTQxMjkyOH0.VSg1o-YnVk742Ir0VETs5OpJ36pLA0wifSwkUXjRJA0';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
  );
}
