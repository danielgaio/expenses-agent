/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@expenses-agent/types', '@expenses-agent/utils', '@expenses-agent/ui'],
  i18n: {
    locales: ['en', 'pt-BR'],
    defaultLocale: 'en',
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
