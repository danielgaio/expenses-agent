import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export function createClient(url: string, anonKey: string): SupabaseClient<Database> {
  return createSupabaseClient<Database>(url, anonKey);
}
