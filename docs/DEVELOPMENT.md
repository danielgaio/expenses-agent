# Development Guide

## Prerequisites

- Node.js 18+ and npm 9+
- Git
- Supabase CLI (`npm install -g supabase`)
- Expo CLI (`npm install -g expo-cli`) for mobile development
- Docker (optional, for local Supabase)

## Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/danielgaio/expenses-agent.git
   cd expenses-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start Supabase locally**
   ```bash
   cd infrastructure/supabase
   supabase start
   supabase db push
   ```

5. **Generate types**
   ```bash
   npm run supabase:types
   ```

## Development Workflows

### Running the Web App

```bash
npm run web:dev
# or
cd apps/web && npm run dev
```

Access at: http://localhost:3000

### Running the Mobile App

```bash
npm run mobile:ios    # For iOS
npm run mobile:android # For Android
# or
cd apps/mobile && npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm test -- --watch
```

### Linting and Formatting

```bash
# Lint
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### Type Checking

```bash
npm run typecheck
```

## Project Structure

### Apps

**Mobile (`apps/mobile/`)**
- React Native with Expo
- Expo Router for navigation
- i18next for internationalization
- Zustand for state management

**Web (`apps/web/`)**
- Next.js 14 with App Router
- Tailwind CSS for styling
- next-i18next for internationalization
- Server-side rendering support

### Packages

**types (`packages/types/`)**
- Zod schemas for validation
- TypeScript type definitions
- Shared across all apps

**utils (`packages/utils/`)**
- Pure utility functions
- Formatting, validation, date helpers
- No external dependencies except date-fns

**ai (`packages/ai/`)**
- OpenAI service wrappers
- Extraction, categorization, conversation
- Implements AI interfaces

**supabase (`packages/supabase/`)**
- Supabase client initialization
- Common queries and mutations
- Type-safe database access

**ui (`packages/ui/`)**
- Shared UI components
- Platform-agnostic where possible
- Styled with Tailwind classes

## Common Tasks

### Adding a New Feature

1. Write tests first (TDD)
2. Implement the feature
3. Update types if needed
4. Add documentation
5. Create PR with description

### Adding a New Database Table

1. Create migration in `infrastructure/supabase/migrations/`
2. Add RLS policies
3. Update types: `npm run supabase:types`
4. Add queries in `packages/supabase/`
5. Write tests

### Adding a New Shared Package

1. Create directory in `packages/`
2. Add `package.json` with proper config
3. Add to root `package.json` workspaces
4. Import in apps using `@expenses-agent/package-name`

## Debugging

### Web App
- Use browser DevTools
- Next.js debugging: https://nextjs.org/docs/advanced-features/debugging

### Mobile App
- React Native Debugger
- Expo Dev Tools
- console.log() appears in terminal

### Database
- Supabase Studio: http://localhost:54323
- PostgreSQL logs in Supabase Docker container

## Environment Variables

### Required
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `OPENAI_API_KEY` - OpenAI API key

### Optional
- `SENTRY_DSN` - Error tracking
- `FCM_SERVER_KEY` - Push notifications
- `EMAIL_SERVICE_API_KEY` - Email service
- `EXCHANGE_RATE_API_KEY` - Currency conversion

## Troubleshooting

### Dependency Issues
```bash
npm run clean
npm install
```

### Type Errors
```bash
npm run supabase:types
npm run typecheck
```

### Supabase Connection Issues
```bash
supabase status
supabase db reset
```

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages (Conventional Commits)
- Keep functions small and focused
- Add JSDoc comments for public APIs

## Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push: `git push origin feature/my-feature`
4. Create Pull Request
5. Address review feedback
6. Merge after approval

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
