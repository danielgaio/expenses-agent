# Project Structure

This document provides a comprehensive overview of the Expenses Agent project structure, designed to implement all requirements from the SRS.

## Overview

Expenses Agent is a **monorepo** using npm workspaces and Turbo for build orchestration. The project follows **Test-Driven Development (TDD)** principles and implements a modern, scalable architecture.

## Directory Structure

```
expenses-agent/
├── .github/                      # GitHub Actions CI/CD workflows
│   └── workflows/
│       ├── test.yml              # Run tests and linting
│       ├── deploy-web.yml        # Deploy web app to Vercel
│       ├── build-mobile.yml      # Build mobile apps with EAS
│       └── deploy-supabase.yml   # Deploy database and functions
├── .husky/                       # Git hooks for code quality
│   ├── pre-commit                # Run lint-staged before commit
│   └── commit-msg                # Validate commit messages
├── apps/                         # Application packages
│   ├── mobile/                   # React Native mobile app
│   │   ├── src/
│   │   │   ├── App.tsx           # Root component
│   │   │   ├── components/       # Reusable UI components
│   │   │   ├── screens/          # Screen components
│   │   │   ├── services/         # API and business logic
│   │   │   │   ├── supabase.ts   # Supabase client
│   │   │   │   ├── ai.ts         # AI service integration
│   │   │   │   └── storage.ts    # Local storage
│   │   │   ├── store/            # Zustand state management
│   │   │   │   ├── auth.ts       # Auth state
│   │   │   │   └── transactions.ts # Transaction state
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── utils/            # Utility functions
│   │   │   ├── i18n/             # Internationalization
│   │   │   │   ├── config.ts     # i18n setup
│   │   │   │   └── locales/      # Translation files
│   │   │   │       ├── en.json
│   │   │   │       └── pt-BR.json
│   │   │   ├── config/           # App configuration
│   │   │   └── __tests__/        # Tests
│   │   │       ├── unit/
│   │   │       ├── integration/
│   │   │       └── e2e/
│   │   ├── app.json              # Expo configuration
│   │   ├── babel.config.js       # Babel configuration
│   │   ├── tsconfig.json         # TypeScript config
│   │   ├── jest.config.js        # Jest configuration
│   │   ├── jest.setup.js         # Jest setup
│   │   └── package.json
│   └── web/                      # Next.js web application
│       ├── src/
│       │   ├── pages/            # Next.js pages
│       │   │   ├── _app.tsx      # App wrapper
│       │   │   ├── _document.tsx # HTML document
│       │   │   └── index.tsx     # Home page
│       │   ├── components/       # React components
│       │   ├── lib/              # Library code
│       │   │   └── supabase/     # Supabase clients
│       │   │       ├── client.ts # Browser client
│       │   │       ├── server.ts # Server client
│       │   │       └── index.ts
│       │   ├── hooks/            # Custom hooks
│       │   ├── store/            # State management
│       │   ├── utils/            # Utilities
│       │   ├── styles/           # Global styles
│       │   │   └── globals.css
│       │   └── __tests__/        # Tests
│       │       ├── unit/
│       │       ├── integration/
│       │       └── e2e/
│       ├── public/               # Static assets
│       │   └── locales/          # i18n translations
│       │       ├── en/
│       │       │   └── common.json
│       │       └── pt-BR/
│       │           └── common.json
│       ├── next.config.js        # Next.js configuration
│       ├── next-i18next.config.js # i18n configuration
│       ├── tailwind.config.js    # Tailwind CSS config
│       ├── postcss.config.js     # PostCSS config
│       ├── tsconfig.json         # TypeScript config
│       ├── jest.config.js        # Jest config
│       ├── jest.setup.js         # Jest setup
│       ├── playwright.config.ts  # Playwright config
│       └── package.json
├── packages/                     # Shared packages
│   ├── types/                    # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts          # Main export
│   │   │   ├── transaction.ts    # Transaction types
│   │   │   ├── user.ts           # User types
│   │   │   ├── household.ts      # Household types
│   │   │   ├── category.ts       # Category types
│   │   │   └── analytics.ts      # Analytics types
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── utils/                    # Shared utility functions
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── formatting.ts     # Number/currency formatting
│   │   │   ├── validation.ts     # Input validation
│   │   │   └── date.ts           # Date utilities
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── ai/                       # AI service wrappers
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── types.ts          # AI types
│   │   │   ├── extraction.ts     # OCR/STT/NLP extraction
│   │   │   ├── categorization.ts # Auto-categorization
│   │   │   ├── conversation.ts   # Chat & voice
│   │   │   └── __tests__/        # AI tests
│   │   │       ├── unit/
│   │   │       └── integration/
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── supabase/                 # Supabase client & queries
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── client.ts         # Client initialization
│   │   │   ├── types.ts          # Generated DB types
│   │   │   ├── queries.ts        # Common queries
│   │   │   └── __tests__/        # Tests
│   │   │       ├── unit/
│   │   │       └── integration/
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── ui/                       # Shared UI components
│       ├── src/
│       │   ├── index.ts
│       │   ├── Button.tsx        # Button component
│       │   ├── Input.tsx         # Input component
│       │   ├── Card.tsx          # Card component
│       │   └── __tests__/        # Component tests
│       ├── tsconfig.json
│       └── package.json
├── infrastructure/               # Infrastructure as code
│   └── supabase/                 # Supabase configuration
│       ├── config.toml           # Supabase CLI config
│       ├── migrations/           # Database migrations
│       │   ├── 20250101000000_initial_schema.sql
│       │   ├── 20250101000001_create_tables.sql
│       │   ├── 20250101000002_rls_policies.sql
│       │   ├── 20250101000003_functions.sql
│       │   └── 20250101000004_storage.sql
│       ├── functions/            # Supabase Edge Functions
│       │   ├── extract-from-image/
│       │   │   └── index.ts
│       │   └── extract-from-audio/
│       │       └── index.ts
│       └── README.md
├── docs/                         # Documentation
│   ├── README.md                 # Documentation index
│   ├── ARCHITECTURE.md           # Architecture overview
│   ├── DEVELOPMENT.md            # Development guide
│   ├── TESTING.md                # Testing guide
│   └── DEPLOYMENT.md             # Deployment guide
├── scripts/                      # Build and utility scripts
│   └── (future scripts)
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
├── .prettierrc                   # Prettier configuration
├── .eslintrc.json                # ESLint configuration
├── .lintstagedrc.json            # Lint-staged configuration
├── commitlint.config.js          # Commit message linting
├── package.json                  # Root package.json
├── tsconfig.json                 # Root TypeScript config
├── turbo.json                    # Turbo build config
├── README.md                     # Project README
├── SRS.md                        # Software Requirements Specification
└── TODO.md                       # Project TODO list
```

## Key Technologies

### Frontend
- **Mobile**: React Native with Expo, Expo Router
- **Web**: Next.js 14 (App Router), React 18, Tailwind CSS
- **State Management**: Zustand
- **Forms**: react-hook-form with Zod validation
- **i18n**: i18next (mobile), next-i18next (web)

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (OAuth, email/password, passkeys)
- **Storage**: Supabase Storage (receipts, avatars)
- **Edge Functions**: Deno (Supabase Functions)
- **API**: Auto-generated PostgREST API

### AI/ML
- **NLP**: OpenAI GPT-4
- **OCR**: OpenAI Vision API
- **STT**: OpenAI Whisper
- **TTS**: OpenAI TTS

### Testing
- **Unit/Integration**: Jest
- **E2E Web**: Playwright
- **E2E Mobile**: Detox
- **Component Testing**: React Testing Library

### DevOps
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (web), EAS (mobile)
- **Monitoring**: Sentry (errors), Vercel Analytics (performance)
- **Version Control**: Git, GitHub

## Architecture Patterns

### 1. Monorepo Pattern
- Shared code in `packages/`
- Independent apps in `apps/`
- Turbo for efficient builds

### 2. Test-Driven Development
- Write tests first
- Red-Green-Refactor cycle
- High test coverage (>80%)

### 3. Row-Level Security
- All database access protected by RLS
- Role-based permissions
- Household-level isolation

### 4. Offline-First (Mobile)
- Local data caching
- Queue for offline operations
- Sync with conflict resolution

### 5. AI-Assisted UX
- Multi-format input (image, audio, video, text)
- Automatic extraction and categorization
- Conversational analytics
- Voice mode with STT/TTS

## Data Flow

### Transaction Creation Flow
```
User Input (Image/Audio/Text)
    ↓
Upload to Supabase Storage
    ↓
Trigger Edge Function
    ↓
AI Extraction (OpenAI)
    ↓
Parse & Validate (Zod)
    ↓
Pre-fill Transaction Form
    ↓
User Review & Edit
    ↓
Save to Database (with RLS)
    ↓
Update UI & Analytics
```

### Authentication Flow
```
User Login Request
    ↓
Supabase Auth
    ↓
Generate JWT
    ↓
Store in Secure Storage
    ↓
Attach to API Requests
    ↓
RLS Policies Validate
    ↓
Return User Data
```

## Security Implementation

### Data Protection
- **In Transit**: TLS 1.3
- **At Rest**: Database encryption
- **Application**: Environment variables for secrets
- **PII**: Redacted from logs

### Access Control
- **Authentication**: Multi-factor auth support
- **Authorization**: RLS policies on all tables
- **API Keys**: Server-side only
- **Sessions**: Secure token management

### Child Accounts
- Require parental consent
- Limited data access (own transactions only)
- Approval workflows for expenses
- Cannot view household finances

## Scalability Strategy

### Phase 1 (MVP - Current)
- Single region deployment
- Vertical scaling
- No caching layer

### Phase 2 (Growth)
- Multi-region database replication
- Read replicas for analytics
- CDN for static assets
- Redis for caching

### Phase 3 (Scale)
- Microservices for heavy operations
- Message queue for async processing
- Dedicated analytics database
- Auto-scaling infrastructure

## Development Workflow

1. **Feature Branch**: Create from `main`
2. **Write Tests**: TDD approach
3. **Implement**: Code to pass tests
4. **Lint & Format**: Automatic via pre-commit
5. **Push**: Triggers CI tests
6. **PR Review**: Code review required
7. **Merge**: Deploy to staging
8. **Release**: Tag for production

## Internationalization

### Supported Locales
- **en** (English)
- **pt-BR** (Portuguese - Brazil)

### Implementation
- Translation keys in JSON files
- Locale-aware formatting (dates, numbers, currency)
- RTL support (future)
- AI understands both languages

## Feature Flags

Controlled via environment variables:
- `ENABLE_VOICE_MODE`: Voice input/output
- `ENABLE_OFFLINE_MODE`: Offline sync
- `ENABLE_INVESTMENT_TRACKING`: Investment features

## Observability

### Metrics
- API response times
- Error rates
- AI confidence scores
- User engagement

### Logging
- Structured logs
- PII redaction
- Log levels (error, warn, info, debug)
- Centralized via Sentry

### Monitoring
- Uptime monitoring
- Performance tracking
- Database query analysis
- Edge function metrics

## Compliance

### LGPD/GDPR
- Data minimization
- Right to erasure
- Consent management
- Data portability
- Breach notification

### Children's Data
- Parental consent
- Limited data collection
- Restricted processing
- Age verification

## Roadmap Mapping

This structure supports all SRS requirements:

- ✅ **FR-1 to FR-3**: Auth & onboarding
- ✅ **FR-4 to FR-8**: Multi-format capture with AI
- ✅ **FR-9 to FR-11**: Categories & tags
- ✅ **FR-12 to FR-14**: Shared accounts & roles
- ✅ **FR-15 to FR-18**: Future & recurring transactions
- ✅ **FR-19 to FR-21**: Investment tracking
- ✅ **FR-22 to FR-23**: Multi-currency
- ✅ **FR-24 to FR-25**: Budgeting
- ✅ **FR-26**: Notifications
- ✅ **FR-27 to FR-30**: Analytics & reporting
- ✅ **FR-31 to FR-33**: Voice mode
- ✅ **FR-34 to FR-37**: Agentic capabilities
- ✅ **FR-38 to FR-40**: i18n
- ✅ **FR-41 to FR-42**: Offline & sync
- ✅ **FR-43 to FR-45**: Error handling & observability

## Getting Started

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for setup instructions.

## Contributing

1. Read the [contributing guidelines](./docs/CONTRIBUTING.md)
2. Set up your development environment
3. Pick an issue or create one
4. Follow TDD approach
5. Submit a pull request

## Support

- **Documentation**: `/docs` directory
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@expensesagent.com (future)

---

**Last Updated**: January 2025
**Version**: 1.0.0
