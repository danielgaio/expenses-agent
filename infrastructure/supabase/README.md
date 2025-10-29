# Supabase Infrastructure

This directory contains all Supabase-related configuration, migrations, and edge functions.

## Structure

```
infrastructure/supabase/
├── config.toml              # Supabase CLI configuration
├── migrations/              # Database migrations
│   ├── 20250101000000_initial_schema.sql
│   ├── 20250101000001_create_tables.sql
│   ├── 20250101000002_rls_policies.sql
│   ├── 20250101000003_functions.sql
│   └── 20250101000004_storage.sql
└── functions/               # Edge functions
    ├── extract-from-image/
    └── extract-from-audio/
```

## Setup

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase (if not already done):
   ```bash
   supabase init
   ```

3. Start local Supabase:
   ```bash
   supabase start
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

5. Generate TypeScript types:
   ```bash
   supabase gen types typescript --local > ../../packages/supabase/src/types.ts
   ```

## Migrations

Migrations are run in order based on their timestamp prefix. To create a new migration:

```bash
supabase migration new <migration_name>
```

## Edge Functions

To deploy edge functions:

```bash
supabase functions deploy extract-from-image
supabase functions deploy extract-from-audio
```

## Testing

Test migrations locally before deploying:

```bash
supabase db reset
supabase db push
```
