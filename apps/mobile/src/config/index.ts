export const API_CONFIG = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
};

export const FEATURE_FLAGS = {
  enableVoiceMode: process.env.ENABLE_VOICE_MODE === 'true',
  enableOfflineMode: process.env.ENABLE_OFFLINE_MODE === 'true',
  enableInvestmentTracking: process.env.ENABLE_INVESTMENT_TRACKING === 'true',
};

export const APP_CONFIG = {
  defaultLocale: 'en',
  supportedLocales: ['en', 'pt-BR'],
};
