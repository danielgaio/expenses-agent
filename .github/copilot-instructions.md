# Copilot Instructions for Expenses Agent

## Project Overview

Expenses Agent is an **AI-powered family finance assistant** built as a monorepo with React Native (mobile), Next.js (web), Supabase (backend), and OpenAI (AI). The project strictly follows **Test-Driven Development (TDD)** and implements Row-Level Security (RLS) for multi-user households.

## Architecture & Structure

### Monorepo Pattern with Turbo
- **apps/** - Mobile (React Native/Expo) and web (Next.js) applications
- **packages/** - Shared code: `types`, `utils`, `ai`, `supabase`, `ui`
- **infrastructure/supabase/** - Database migrations, RLS policies, Edge Functions
- Import shared packages: `@expenses-agent/types`, `@expenses-agent/utils`, etc.

### Key Tech Stack
- **Database**: PostgreSQL via Supabase with RLS on all tables
- **Auth**: Supabase Auth (OAuth, email/password, passkeys)
- **AI**: OpenAI GPT-4 (NLP), Vision (OCR), Whisper (STT), TTS
- **State**: Zustand for client state
- **Validation**: Zod schemas in `packages/types`
- **i18n**: English and Portuguese (Brazil) - use i18next (mobile) or next-i18next (web)

## Critical Development Patterns

### 1. Test-Driven Development (Mandatory)
Write tests BEFORE implementation:
```typescript
// Example: packages/utils/src/__tests__/formatting.test.ts
describe('formatCurrency', () => {
  it('should format BRL with Brazilian locale', () => {
    expect(formatCurrency(1234.56, 'BRL', 'pt-BR')).toBe('R$ 1.234,56');
  });
});
```
Run tests: `npm test`, `npm run test:unit`, `npm run test:e2e`

**IMPORTANT**: After making relevant code changes, ALWAYS run the related tests to verify:
```bash
# For specific package changes
cd packages/[package-name] && npm test

# For specific test file
npm test -- path/to/test.test.ts

# Watch mode during development
npm test -- --watch
```
If tests fail, fix them before proceeding. If the change is significant, tests must pass before considering the task complete.

### 2. Row-Level Security (RLS) First
All database access is protected by RLS policies based on household membership and user roles:
- **Roles**: `owner`, `adult`, `child`, `viewer`
- Children can only see their own transactions
- Adults/owners can see all household transactions
- Never bypass RLS - queries auto-filter by `auth.uid()`

Example query pattern:
```typescript
// Good - RLS automatically filters by user's households
const { data } = await supabase
  .from('transactions')
  .select('*')
  .eq('household_id', householdId);
```

### 3. Type-Safe Zod Schemas
All data validated with Zod schemas in `packages/types/src/`:
```typescript
import { TransactionSchema } from '@expenses-agent/types';

// Validate incoming data
const parsed = TransactionSchema.parse(rawData);
```

### 4. AI Extraction Flow
Multi-format input → AI extraction → User review → Save:
1. Upload artifact to Supabase Storage
2. Trigger Edge Function for AI extraction
3. Parse with confidence score and provenance tracking
4. Pre-fill form for user review/edit
5. Save with `provenance: 'ai' | 'user' | 'mixed'`

See `infrastructure/supabase/functions/` for Edge Function patterns.

### 5. Internationalization
Support English and Portuguese (Brazil):
- Translation keys: `apps/mobile/src/i18n/locales/{en,pt-BR}.json`
- Locale-aware formatting: Use `formatCurrency()`, `formatDate()` from `@expenses-agent/utils`
- AI must understand both languages in extraction

### 6. Offline-First Mobile
Mobile app queues operations when offline:
- Use local storage for caching
- Sync on reconnection with conflict resolution
- Status tracking for pending operations

## Database Schema Essentials

Key tables (see `infrastructure/supabase/migrations/`):
- **user_profiles** - User preferences, locale, notifications
- **households** - Shared financial spaces
- **household_members** - User-household links with roles
- **transactions** - Core expense/income records with:
  - `status: 'realized' | 'planned'` (for future transactions)
  - `provenance: 'ai' | 'user' | 'mixed'`
  - `aiConfidence: 0-1` (if AI extracted)
- **installment_schedules** - Brazilian "parcelas" (credit card installments)
- **recurring_rules** - Scheduled recurring transactions
- **categories** - User-defined or default categories
- **artifacts** - Stored receipts/audio for AI processing

## Common Development Tasks

### Adding a New Feature
1. Write failing test in `src/__tests__/unit/` or `integration/`
2. Implement feature
3. Ensure types are updated in `packages/types/`
4. Add RLS policies if database access needed
5. Update i18n translation files for both locales

### Creating a Database Migration
```bash
cd infrastructure/supabase
supabase migration new feature_name
# Edit SQL file
supabase db push
# Generate types
supabase gen types typescript --local > ../../packages/supabase/src/types.ts
```

### Working with Shared Packages
```bash
# In packages/my-package
npm run build   # Build before using in apps
# In apps
import { Thing } from '@expenses-agent/my-package';
```

## Commands & Scripts

```bash
# Development
npm run web:dev              # Start Next.js web app (localhost:3000)
npm run mobile:ios           # Start iOS app
npm run mobile:android       # Start Android app

# Testing (TDD)
npm test                     # All tests
npm run test:unit            # Unit tests only
npm run test:integration     # Integration tests
npm run test:e2e             # End-to-end tests
npm test -- --watch          # Watch mode

# Database
npm run supabase:start       # Start local Supabase
npm run supabase:migrate     # Apply migrations
supabase db reset            # Reset database

# Code Quality
npm run lint                 # ESLint
npm run format               # Prettier
npm run typecheck            # TypeScript check
```

## Security & Privacy

- **Never log PII** - Redact in error handlers
- **Server-side secrets only** - API keys in environment variables
- **Child account protection** - Special RLS policies restrict data access
- **Compliance**: LGPD/GDPR - data minimization, right to erasure

## Project-Specific Conventions

1. **Provenance Tracking**: Always track if data is AI-extracted, user-entered, or mixed
2. **Confidence Scores**: AI extractions include 0-1 confidence score
3. **Future Transactions**: Use `status: 'planned'` for future expenses/income (installments, recurring)
4. **Investment as Expense**: Investment contributions are transactions with `type: 'investment'`
5. **Multi-Currency**: Store original currency + exchange rate, convert for analytics
6. **Brazilian "Parcelas"**: Use `installment_schedules` table for credit card installments

## Common Pitfalls

❌ **Don't** bypass RLS by using service role key in client code
❌ **Don't** forget to write tests first (TDD violation)
❌ **Don't** hardcode strings - use i18n keys for both en/pt-BR
❌ **Don't** skip Zod validation on external data
❌ **Don't** use `any` type - leverage shared types from `@expenses-agent/types`

✅ **Do** use Zod schemas for all data validation
✅ **Do** test RLS policies with multiple user roles
✅ **Do** format currency/dates with locale-aware utils
✅ **Do** track AI confidence and provenance
✅ **Do** handle offline mode in mobile app

## Key Files Reference

- `SRS.md` - Complete requirements specification
- `PROJECT_STRUCTURE.md` - Detailed architecture
- `docs/DEVELOPMENT.md` - Setup and workflows
- `docs/TESTING.md` - TDD guide and patterns
- `infrastructure/supabase/migrations/` - Database schema
- `packages/types/src/` - Zod schemas and TypeScript types
- `turbo.json` - Monorepo build configuration

## AI Features Implementation Status

✅ **Completed**: Core AI extraction services in `packages/ai/src/extraction/`:
- `ImageExtractor` - Vision API for OCR (13 tests)
- `AudioExtractor` - Whisper API for STT (13 tests)
- `TextExtractor` - GPT-4 for NLP (17 tests)
- 43 comprehensive tests following TDD

🚧 **Next Steps**:
- Create Supabase Edge Functions for server-side AI calls
- Implement file upload to Supabase Storage
- Integrate with mobile/web UI
- `categorize()` - GPT-4 for smart categorization (planned)

## Questions to Ask Before Implementing

1. Did I write the test first? (TDD)
2. Are RLS policies sufficient for this feature?
3. Do I need to update Zod schemas in `packages/types`?
4. Is this localized for both en and pt-BR?
5. Does this work offline (if mobile)?
6. Am I tracking provenance for AI-touched data?

---

**Last Updated**: January 2025 | **Maintainer**: Daniel Eliel Gaio
