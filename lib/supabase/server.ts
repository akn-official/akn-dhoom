import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = 'https://zxfbegrxkkgfzlfsdalt.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZmJlZ3J4a2tnZnpsZnNkYWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzY5MjgsImV4cCI6MjA5MTQxMjkyOH0.VSg1o-YnVk742Ir0VETs5OpJ36pLA0wifSwkUXjRJA0';

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // This can be ignored in Server Components
          }
        },
      },
    },
  );
}
