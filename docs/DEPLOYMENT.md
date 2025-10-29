# Deployment Guide

## Overview

This project uses a multi-environment deployment strategy:

- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live user environment

## Prerequisites

- Supabase project (production)
- Vercel account (for web app)
- Expo EAS account (for mobile apps)
- OpenAI API key
- GitHub repository access

## Environment Setup

### 1. Supabase Production Setup

1. Create a new Supabase project at https://supabase.com
2. Note your project URL and anon key
3. Run migrations:
   ```bash
   supabase link --project-ref your-project-ref
   supabase db push
   ```
4. Deploy edge functions:
   ```bash
   supabase functions deploy extract-from-image
   supabase functions deploy extract-from-audio
   ```
5. Set secrets for edge functions:
   ```bash
   supabase secrets set OPENAI_API_KEY=your-key
   ```

### 2. Web App (Vercel)

1. **Connect Repository**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Select `apps/web` as the root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Root Directory: apps/web
   ```

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   OPENAI_API_KEY=your-openai-key
   ```

4. **Deploy**
   ```bash
   cd apps/web
   vercel --prod
   ```

### 3. Mobile Apps (Expo EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**
   ```bash
   cd apps/mobile
   eas login
   eas build:configure
   ```

3. **Create `eas.json`**
   ```json
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal",
         "ios": {
           "simulator": true
         }
       },
       "production": {
         "env": {
           "SUPABASE_URL": "your-supabase-url",
           "SUPABASE_ANON_KEY": "your-anon-key"
         }
       }
     },
     "submit": {
       "production": {
         "ios": {
           "appleId": "your-apple-id@email.com",
           "ascAppId": "your-asc-app-id"
         },
         "android": {
           "serviceAccountKeyPath": "./path/to/api-key.json"
         }
       }
     }
   }
   ```

4. **Build for Production**
   ```bash
   # iOS
   eas build --platform ios --profile production
   
   # Android
   eas build --platform android --profile production
   ```

5. **Submit to Stores**
   ```bash
   # iOS
   eas submit --platform ios --latest
   
   # Android
   eas submit --platform android --latest
   ```

## CI/CD Pipeline

### GitHub Actions Workflows

Located in `.github/workflows/`:

#### 1. **Test & Lint** (`test.yml`)
Runs on every push and pull request:
- Lint code
- Type check
- Run unit tests
- Run integration tests

#### 2. **Deploy Web** (`deploy-web.yml`)
Runs on push to `main`:
- Build web app
- Run tests
- Deploy to Vercel

#### 3. **Build Mobile** (`build-mobile.yml`)
Runs on release tags:
- Build iOS and Android apps
- Upload to EAS
- Optionally submit to stores

## Monitoring & Observability

### Error Tracking (Sentry)

1. Create Sentry project
2. Add Sentry DSN to environment variables:
   ```
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

3. Initialize in apps:
   ```typescript
   // apps/web/src/lib/sentry.ts
   import * as Sentry from '@sentry/nextjs';
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

### Performance Monitoring

- Vercel Analytics for web performance
- Supabase Dashboard for database metrics
- Custom metrics in application code

### Logging

- Structured logging with context
- PII redaction
- Log levels: error, warn, info, debug

## Database Migrations

### Creating Migrations

```bash
cd infrastructure/supabase
supabase migration new migration_name
```

### Applying Migrations

**Production:**
```bash
supabase db push --linked
```

**Rollback:**
```bash
supabase db reset --linked
# Then reapply up to desired migration
```

## Secrets Management

Never commit secrets to git. Use:

1. **Local Development**: `.env` file (gitignored)
2. **CI/CD**: GitHub Secrets
3. **Vercel**: Environment Variables dashboard
4. **Expo**: EAS Secrets
5. **Supabase**: Secrets for Edge Functions

## Deployment Checklist

### Before Deployment

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Feature flags configured
- [ ] Documentation updated
- [ ] Changelog updated

### After Deployment

- [ ] Verify deployment health
- [ ] Run smoke tests
- [ ] Check error rates
- [ ] Monitor performance metrics
- [ ] Notify team
- [ ] Update status page if applicable

## Rollback Procedures

### Web App
1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"

### Mobile Apps
1. Cannot rollback app stores immediately
2. Release hotfix version
3. Expedite app review if critical

### Database
1. Rollback migration:
   ```bash
   supabase db reset --linked
   ```
2. Reapply migrations up to working state

## Feature Flags

Use feature flags for gradual rollouts:

```typescript
// apps/web/src/lib/features.ts
export const features = {
  voiceMode: process.env.NEXT_PUBLIC_ENABLE_VOICE_MODE === 'true',
  offlineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
  investmentTracking: process.env.NEXT_PUBLIC_ENABLE_INVESTMENT_TRACKING === 'true',
};
```

## Scaling Considerations

### Current Architecture (MVP)
- Single region
- Vertical scaling
- No caching layer

### Future Scaling
- Multi-region Supabase
- Read replicas for analytics
- Redis caching layer
- CDN for static assets
- Edge function optimization

## Disaster Recovery

### Backup Strategy
- Supabase automatic daily backups
- Point-in-time recovery available
- Export critical data regularly

### Recovery Time Objective (RTO): 8 hours
### Recovery Point Objective (RPO): 24 hours

### Recovery Procedure
1. Assess impact
2. Restore from backup
3. Verify data integrity
4. Resume operations
5. Post-mortem analysis

## Support & Troubleshooting

### Common Issues

**Build Failures**
- Check logs in CI/CD
- Verify environment variables
- Test locally first

**Database Connection Issues**
- Verify Supabase URL and key
- Check network connectivity
- Review RLS policies

**Performance Degradation**
- Check Supabase dashboard
- Review slow queries
- Analyze error rates

### Getting Help

- Check documentation
- Review logs and metrics
- Contact on-call engineer
- Escalate to team lead if critical
