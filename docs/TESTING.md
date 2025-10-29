# Testing Guide

## Testing Philosophy

This project follows **Test-Driven Development (TDD)** principles:

1. Write failing test
2. Implement minimal code to pass
3. Refactor while keeping tests green

## Test Levels

### Unit Tests

Test individual functions and components in isolation.

**Location**: `src/__tests__/unit/` or co-located with code

**Tools**:
- Jest (test runner)
- React Testing Library (component testing)
- @testing-library/react-native (mobile)

**Example**:
```typescript
// packages/utils/src/__tests__/formatting.test.ts
import { formatCurrency } from '../formatting';

describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD', 'en-US')).toBe('$1,234.56');
  });

  it('should format BRL correctly', () => {
    expect(formatCurrency(1234.56, 'BRL', 'pt-BR')).toBe('R$ 1.234,56');
  });
});
```

### Integration Tests

Test interactions between multiple modules or with external services.

**Location**: `src/__tests__/integration/`

**Tools**:
- Jest
- Supabase test client
- Mock OpenAI responses

**Example**:
```typescript
// packages/ai/src/__tests__/integration/extraction.test.ts
import { ExtractionService } from '../../extraction';

describe('ExtractionService Integration', () => {
  let service: ExtractionService;

  beforeEach(() => {
    service = new ExtractionService(process.env.OPENAI_API_KEY!);
  });

  it('should extract data from receipt image', async () => {
    const result = await service.extractFromImage(
      'https://example.com/receipt.jpg',
      'pt-BR'
    );

    expect(result.type).toBe('expense');
    expect(result.amount).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.7);
  });
});
```

### E2E Tests

Test complete user flows through the application.

**Web Location**: `apps/web/src/__tests__/e2e/`

**Mobile Location**: `apps/mobile/e2e/`

**Tools**:
- Playwright (web)
- Detox (mobile)

**Web Example**:
```typescript
// apps/web/src/__tests__/e2e/transaction-flow.spec.ts
import { test, expect } from '@playwright/test';

test('should create transaction from image', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="add-transaction"]');
  await page.click('[data-testid="upload-image"]');
  
  // Upload fixture image
  await page.setInputFiles('input[type="file"]', 'fixtures/receipt.jpg');
  
  // Wait for AI extraction
  await page.waitForSelector('[data-testid="extracted-amount"]');
  
  // Verify extracted data
  const amount = await page.textContent('[data-testid="extracted-amount"]');
  expect(amount).toContain('$');
  
  // Confirm and save
  await page.click('[data-testid="confirm-transaction"]');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

**Mobile Example**:
```typescript
// apps/mobile/e2e/transaction-flow.e2e.ts
describe('Transaction Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should create transaction from voice', async () => {
    await element(by.id('add-transaction-btn')).tap();
    await element(by.id('voice-input-btn')).tap();
    
    // Simulate voice input (mock)
    await element(by.id('voice-result')).replaceText('I spent 50 dollars at the grocery store');
    
    await element(by.id('confirm-btn')).tap();
    
    await expect(element(by.id('success-message'))).toBeVisible();
  });
});
```

## Test Organization

```
src/
├── __tests__/
│   ├── unit/              # Unit tests
│   │   ├── utils.test.ts
│   │   └── components.test.tsx
│   ├── integration/       # Integration tests
│   │   ├── api.test.ts
│   │   └── ai.test.ts
│   └── e2e/              # End-to-end tests
│       ├── auth.spec.ts
│       └── transactions.spec.ts
└── fixtures/             # Test data
    ├── receipts/
    ├── audio/
    └── mock-data.ts
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suite
```bash
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage
```bash
npm test -- --coverage
```

### Specific File
```bash
npm test -- path/to/test.test.ts
```

## Test Fixtures

Store test data in `fixtures/` directory:

```typescript
// src/__tests__/fixtures/mock-data.ts
export const mockTransaction = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  type: 'expense',
  amount: 50.00,
  currency: 'USD',
  date: '2025-01-01T00:00:00Z',
  status: 'realized',
  // ...
};

export const mockReceipt = {
  image: 'data:image/png;base64,...',
  // ...
};
```

## Mocking

### Supabase Client
```typescript
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
      insert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    })),
  })),
}));
```

### OpenAI
```typescript
jest.mock('openai', () => ({
  default: jest.fn(() => ({
    chat: {
      completions: {
        create: jest.fn(() => Promise.resolve({
          choices: [{ message: { content: 'mock response' } }],
        })),
      },
    },
  })),
}));
```

### React Native Modules
```typescript
// jest.setup.js
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

## CI/CD Integration

Tests run automatically on:
- Every push
- Every pull request
- Before deployment

See `.github/workflows/` for CI configuration.

## Test Best Practices

1. **Arrange-Act-Assert (AAA)** pattern
2. **One assertion per test** (when possible)
3. **Descriptive test names**: `should [expected behavior] when [condition]`
4. **Test edge cases** and error conditions
5. **Keep tests fast**: mock external services
6. **Clean up after tests**: reset state, clear mocks
7. **Use test data builders** for complex objects
8. **Avoid testing implementation details**
9. **Test from user's perspective** in E2E tests
10. **Keep test coverage above 80%**

## Code Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Happy paths and key user flows

## Debugging Tests

### Debug Single Test
```bash
node --inspect-brk node_modules/.bin/jest --runInBand path/to/test.test.ts
```

### VS Code Debugging
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "${file}"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Performance Testing

For critical operations, include performance benchmarks:

```typescript
it('should process large dataset efficiently', async () => {
  const start = Date.now();
  await processTransactions(largeDataset);
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(1000); // Should complete in < 1s
});
```

## Snapshot Testing

Use sparingly for UI components:

```typescript
it('should render transaction card correctly', () => {
  const { container } = render(<TransactionCard {...mockTransaction} />);
  expect(container).toMatchSnapshot();
});
```

Update snapshots: `npm test -- -u`
