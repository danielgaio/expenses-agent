# Expenses Agent

> An AI-powered personal and family finance assistant with multi-format input support

[![CI](https://github.com/danielgaio/expenses-agent/workflows/test/badge.svg)](https://github.com/danielgaio/expenses-agent/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Expenses Agent is a modern finance management application that uses AI to automatically extract transaction data from images, audio, video, and text. Built for families with support for shared accounts, multiple roles, and comprehensive analytics in both English and Portuguese (Brazil).

## Key Features

- 📸 **Multi-Format Capture**: Take photos of receipts, record voice notes, capture video, or type manually
- 🤖 **AI-Powered Extraction**: Automatic transaction extraction using OpenAI Vision, Whisper, and GPT
- 👨‍👩‍👧‍👦 **Family Accounts**: Manage shared finances with role-based permissions (owner, adult, child, viewer)
- 🌍 **Multilingual**: Full support for English and Portuguese (Brazil) including voice mode
- 🗣️ **Voice Mode**: Conversational analytics with voice input/output
- 📊 **Advanced Analytics**: Visual dashboards and AI-powered conversational insights
- 📅 **Future Planning**: Support for installments (parcelas) and recurring transactions
- 💰 **Investment Tracking**: Track investment contributions as part of your financial picture
- 🔒 **Privacy-First**: Row-level security, LGPD/GDPR compliance, child account protection
- 📱 **Offline Support**: Mobile app works offline with automatic sync

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Supabase CLI: `npm install -g supabase`
- Expo CLI (for mobile): `npm install -g expo-cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/danielgaio/expenses-agent.git
cd expenses-agent

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start Supabase locally
cd infrastructure/supabase
supabase start
supabase db push
cd ../..

# Start the web app
npm run web:dev
```

Visit http://localhost:3000 to see the web app.

### Mobile Development

```bash
# Start the mobile app
npm run mobile:ios     # For iOS
npm run mobile:android # For Android
```

## Architecture

This is a **monorepo** project using npm workspaces and Turbo:

```
expenses-agent/
├── apps/
│   ├── mobile/         # React Native (Expo) mobile app
│   └── web/            # Next.js web application
├── packages/
│   ├── types/          # Shared TypeScript types (Zod schemas)
│   ├── utils/          # Utility functions
│   ├── ai/             # OpenAI integration
│   ├── supabase/       # Supabase client & queries
│   └── ui/             # Shared UI components
├── infrastructure/
│   └── supabase/       # Database migrations, RLS, Edge Functions
└── docs/               # Documentation
```

**Tech Stack**:
- Frontend: React Native (Expo), Next.js 14, Tailwind CSS
- Backend: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- AI: OpenAI GPT-4, Vision, Whisper, TTS
- Testing: Jest, Playwright, Detox
- CI/CD: GitHub Actions, Vercel, EAS

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed architecture.

## Documentation

- 📖 [Project Structure](./PROJECT_STRUCTURE.md) - Complete project overview
- 🏗️ [Architecture](./docs/ARCHITECTURE.md) - System design and decisions
- 💻 [Development Guide](./docs/DEVELOPMENT.md) - Setup and workflows
- 🧪 [Testing Guide](./docs/TESTING.md) - TDD approach and test strategy
- 🚀 [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- 📋 [Software Requirements](./SRS.md) - Detailed requirements specification

## Development

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

### Code Quality

```bash
# Lint
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

### Database

```bash
# Create a new migration
cd infrastructure/supabase
supabase migration new migration_name

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > ../../packages/supabase/src/types.ts
```

## Project Status

✅ **MVP Phase**: Initial project structure complete

### Completed
- [x] Project scaffolding and monorepo setup
- [x] Database schema and RLS policies
- [x] Mobile and web app boilerplates
- [x] Shared type definitions
- [x] CI/CD pipelines
- [x] Comprehensive documentation

### In Progress
- [ ] AI extraction implementation
- [ ] Authentication flows
- [ ] Transaction CRUD operations
- [ ] Analytics dashboard
- [ ] Voice mode integration

### Roadmap
- [ ] MVP Release (8-12 weeks)
- [ ] Voice & Chat (4-6 weeks)
- [ ] Budgets & Recurring (3-4 weeks)
- [ ] Offline & Import/Export (3-4 weeks)
- [ ] Enhancements (ongoing)

See [TODO.md](./TODO.md) for detailed task list.

## Contributing

We follow **Test-Driven Development (TDD)**:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Write tests first
4. Implement the feature
5. Run tests: `npm test`
6. Commit: `git commit -m "feat: add feature"`
7. Push and create a Pull Request

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for detailed guidelines.

## Security

- 🔒 End-to-end encryption
- 🛡️ Row-level security (RLS)
- 👤 LGPD/GDPR compliance
- 👶 Child account protection
- 🔑 Multi-factor authentication support

Report security issues to: security@expensesagent.com (future)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Supabase](https://supabase.com)
- Powered by [OpenAI](https://openai.com)
- Deployed on [Vercel](https://vercel.com)
- Mobile apps via [Expo](https://expo.dev)

## Support

- 📚 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/danielgaio/expenses-agent/issues)
- 💬 [Discussions](https://github.com/danielgaio/expenses-agent/discussions)

---

**Made with ❤️ by Daniel Eliel Gaio**
