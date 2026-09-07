import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as Record<string, any>).env : undefined;
  const url =
    metaEnv?.VITE_SUPABASE_URL ||
    (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.VITE_SUPABASE_URL : undefined);

  const key =
    metaEnv?.VITE_SUPABASE_ANON_KEY ||
    (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_ANON_KEY : undefined);

  if (!url || !key || url.includes('your-project.supabase.co')) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
}

export const isSupabaseConfigured = (): boolean => {
  return getSupabase() !== null;
};
