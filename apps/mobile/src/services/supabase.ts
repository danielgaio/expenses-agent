import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@config/index';

export const supabaseClient = createClient(
  API_CONFIG.supabaseUrl,
  API_CONFIG.supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
