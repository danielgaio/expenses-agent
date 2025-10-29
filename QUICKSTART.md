# Quick Start Guide

Get up and running with Expenses Agent in minutes!

## Prerequisites Check

Before starting, ensure you have:

- ✅ Node.js 18+ installed: `node --version`
- ✅ npm 9+ installed: `npm --version`
- ✅ Git installed: `git --version`

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/danielgaio/expenses-agent.git
cd expenses-agent

# Install all dependencies (this will take a few minutes)
npm install
```

## Step 2: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Open .env and add your keys (see below for instructions)
```

### Getting API Keys

**Supabase** (Required for database):
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > API
4. Copy your `Project URL` and `anon public` key
5. Add to `.env`:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```

**OpenAI** (Required for AI features):
1. Go to https://platform.openai.com
2. Create an account or sign in
3. Go to API Keys
4. Create a new secret key
5. Add to `.env`:
   ```
   OPENAI_API_KEY=your_openai_key
   ```

## Step 3: Setup Database

### Option A: Use Supabase Cloud (Recommended for starters)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
cd infrastructure/supabase
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push

# Deploy edge functions
supabase functions deploy extract-from-image
supabase functions deploy extract-from-audio

# Set secrets
supabase secrets set OPENAI_API_KEY=your_openai_key
```

### Option B: Use Local Supabase (For development)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Start local Supabase (requires Docker)
cd infrastructure/supabase
supabase start

# Run migrations
supabase db push

# Note the local URLs and keys shown in the output
# Update your .env with the local values
```

## Step 4: Start Development

### Web App

```bash
# From project root
npm run web:dev

# Or from web directory
cd apps/web
npm run dev
```

Visit: http://localhost:3000

### Mobile App

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Start the mobile app
npm run mobile:ios     # For iOS simulator
npm run mobile:android # For Android emulator

# Or from mobile directory
cd apps/mobile
npm start
```

Scan the QR code with Expo Go app or run in simulator.

## Step 5: Verify Setup

### Run Tests

```bash
# Run all tests
npm test

# Run just unit tests
npm run test:unit
```

### Check Linting

```bash
npm run lint
```

### Type Check

```bash
npm run typecheck
```

## Common Issues & Solutions

### Issue: `npm install` fails
**Solution**: 
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Issue: Supabase connection fails
**Solution**:
- Verify your `.env` has correct `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Check if Supabase project is active
- For local: Ensure Docker is running

### Issue: TypeScript errors everywhere
**Solution**:
- Run `npm install` to ensure all dependencies are installed
- Restart your IDE/editor
- These errors are expected until dependencies are installed

### Issue: Mobile app won't start
**Solution**:
- Clear Expo cache: `expo start -c`
- Ensure Expo CLI is installed: `npm install -g expo-cli`
- Check that your phone/emulator is on the same network

## Next Steps

### Learn the Codebase

1. **Read the documentation**:
   - [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Understand the system
   - [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Development workflows
   - [TESTING.md](./docs/TESTING.md) - Testing approach

2. **Explore the code**:
   - Start with `apps/web/src/pages/index.tsx` (web)
   - Or `apps/mobile/src/App.tsx` (mobile)
   - Check `packages/types` for data models

3. **Review the database**:
   - Open Supabase Studio: http://localhost:54323 (local)
   - Or your Supabase dashboard (cloud)
   - Explore tables and RLS policies

### Start Developing

1. **Pick a task** from `TODO.md`
2. **Create a branch**: `git checkout -b feature/my-feature`
3. **Write tests first** (TDD approach)
4. **Implement the feature**
5. **Run tests**: `npm test`
6. **Commit and push**

### Example: Add Your First Feature

Let's create a simple utility function using TDD:

1. **Write test first**:
```typescript
// packages/utils/src/__tests__/currency.test.ts
import { convertCurrency } from '../currency';

describe('convertCurrency', () => {
  it('should convert USD to BRL', () => {
    const result = convertCurrency(100, 'USD', 'BRL', 5.0);
    expect(result).toBe(500);
  });
});
```

2. **Run test (it will fail)**:
```bash
npm test -- currency.test.ts
```

3. **Implement the function**:
```typescript
// packages/utils/src/currency.ts
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rate: number
): number {
  return amount * rate;
}
```

4. **Run test again (it should pass)**:
```bash
npm test -- currency.test.ts
```

5. **Export from index**:
```typescript
// packages/utils/src/index.ts
export * from './currency';
```

6. **Commit your changes**:
```bash
git add .
git commit -m "feat(utils): add currency conversion utility"
```

## Useful Commands

```bash
# Development
npm run dev              # Run all apps in dev mode
npm run web:dev          # Run web app only
npm run mobile:ios       # Run mobile app on iOS

# Testing
npm test                 # Run all tests
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # E2E tests
npm test -- --watch      # Watch mode

# Code Quality
npm run lint             # Check linting
npm run format           # Format code
npm run typecheck        # Check types

# Database
npm run supabase:start   # Start local Supabase
npm run supabase:stop    # Stop local Supabase
npm run supabase:migrate # Run migrations

# Build
npm run build            # Build all apps
npm run web:build        # Build web app only

# Clean
npm run clean            # Clean node_modules
```

## Getting Help

- 📖 **Documentation**: Check the `/docs` folder
- 🐛 **Issues**: Open an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions
- 📧 **Email**: Contact the team (future)

## Project Structure Quick Reference

```
expenses-agent/
├── apps/
│   ├── mobile/        # React Native app
│   └── web/           # Next.js app
├── packages/
│   ├── types/         # Shared types
│   ├── utils/         # Utilities
│   ├── ai/            # AI services
│   ├── supabase/      # Database
│   └── ui/            # UI components
├── infrastructure/
│   └── supabase/      # Database & functions
├── docs/              # Documentation
└── .github/           # CI/CD workflows
```

## Success Checklist

- [ ] Cloned repository
- [ ] Installed dependencies (`npm install`)
- [ ] Created `.env` file
- [ ] Added Supabase credentials
- [ ] Added OpenAI API key
- [ ] Started Supabase (local or cloud)
- [ ] Ran migrations
- [ ] Started web app (`npm run web:dev`)
- [ ] Tests pass (`npm test`)
- [ ] Read documentation

## You're Ready! 🎉

You now have a fully functional development environment for Expenses Agent. Start building amazing features!

**Happy Coding! 🚀**
