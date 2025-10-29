# Architecture

## System Overview

Expenses Agent is built as a modern, cloud-first application using a monorepo structure with the following key components:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├──────────────────────────────┬──────────────────────────────────┤
│   Mobile App (React Native)  │    Web App (Next.js)             │
│   - iOS/Android              │    - Responsive Design            │
│   - Offline Support          │    - SSR/SSG                      │
└──────────────────────────────┴──────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (Supabase)                        │
├──────────────────────────────┬──────────────────────────────────┤
│   PostgREST API              │    Edge Functions                 │
│   - Auto-generated REST      │    - AI Extraction                │
│   - RLS Security             │    - Custom Business Logic        │
└──────────────────────────────┴──────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                  │
├───────────────┬─────────────────┬───────────────┬───────────────┤
│   PostgreSQL  │   Storage       │   Auth        │   Realtime    │
│   - RLS       │   - Artifacts   │   - OAuth     │   - Subs      │
└───────────────┴─────────────────┴───────────────┴───────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
├──────────────────────────────┬──────────────────────────────────┤
│   OpenAI                     │    Other Services                 │
│   - GPT-4 (NLP)              │    - Email/SMS                    │
│   - Vision (OCR)             │    - Push Notifications           │
│   - Whisper (STT)            │    - Exchange Rates               │
│   - TTS                      │                                   │
└──────────────────────────────┴──────────────────────────────────┘
```

## Monorepo Structure

```
expenses-agent/
├── apps/
│   ├── mobile/           # React Native mobile app
│   └── web/              # Next.js web application
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── utils/            # Utility functions
│   ├── ai/               # AI service wrappers
│   ├── supabase/         # Supabase client & queries
│   └── ui/               # Shared UI components
├── infrastructure/
│   └── supabase/         # Database migrations, RLS, functions
├── docs/                 # Documentation
└── scripts/              # Build and deployment scripts
```

## Key Design Decisions

### 1. Test-Driven Development (TDD)
All code follows TDD principles with comprehensive test coverage at multiple levels:
- Unit tests for business logic
- Integration tests for API interactions
- E2E tests for critical user flows

### 2. Row-Level Security (RLS)
All data access is secured through PostgreSQL RLS policies, ensuring:
- Users only access data from their households
- Role-based permissions (owner, adult, child, viewer)
- Child accounts have restricted access

### 3. AI-First Approach
AI is integrated throughout the application:
- Automatic extraction from images/audio/text
- Smart categorization
- Conversational analytics
- Proactive insights

### 4. Offline-First Mobile
Mobile app supports offline operation:
- Local data caching
- Queue for pending operations
- Conflict resolution on sync

### 5. Internationalization
Full i18n support for English and Portuguese (Brazil):
- UI translations
- Date/currency formatting
- AI understands both languages

## Data Model

### Core Entities

**User Profile**
- Extends auth.users with additional profile data
- Stores preferences and notification settings

**Household**
- Shared financial space for families
- Has a primary currency and timezone

**Household Member**
- Links users to households with specific roles
- Enforces permissions through RLS

**Transaction**
- Core entity for expenses/income/investments
- Supports both realized and planned status
- Tracks AI extraction metadata

**Category**
- User-defined or default categories
- Hierarchical structure support

**Installment Schedule**
- For credit card parcelas (Brazilian installments)
- Generates planned transaction entries

**Recurring Rule**
- Defines recurring transaction patterns
- Supports various frequencies

See [database schema](../infrastructure/supabase/migrations/) for full details.

## Security Model

### Authentication
- Email/password, OAuth (Google, Apple)
- Optional 2FA
- Passkey support where available

### Authorization
- RLS policies on all tables
- Role-based access control
- Household-level data isolation

### Data Protection
- TLS in transit
- At-rest encryption
- PII redaction in logs
- Configurable data retention

## Scalability Considerations

### Phase 1 (MVP)
- Single region deployment
- Vertical scaling
- Feature flags for safe rollouts

### Future Phases
- Multi-region support
- Read replicas for analytics
- Caching layer (Redis)
- CDN for static assets
- Horizontal scaling of edge functions
