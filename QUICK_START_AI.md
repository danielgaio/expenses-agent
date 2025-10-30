# Quick Start Guide - AI Extraction Services

## Installation

```bash
# From project root
cd packages/ai
npm install

# Install OpenAI peer dependency if needed
npm install openai@^4.24.0
```

## Running Tests

```bash
# All tests
npm test

# Watch mode (recommended for development)
npm test -- --watch

# Coverage report
npm test -- --coverage

# Specific test file
npm test -- image.test.ts
```

## Basic Usage

### 1. Image Extraction (Receipt OCR)

```typescript
import { ImageExtractor } from '@expenses-agent/ai';

const extractor = new ImageExtractor(process.env.OPENAI_API_KEY);

const result = await extractor.extractFromImage(
  'https://example.com/receipt.jpg',
  'pt-BR' // or 'en'
);

console.log(result);
// { type: 'expense', amount: 45.50, currency: 'BRL', ... }
```

### 2. Audio Extraction (Voice Note)

```typescript
import { AudioExtractor } from '@expenses-agent/ai';

const extractor = new AudioExtractor(process.env.OPENAI_API_KEY);

const result = await extractor.extractFromAudio(
  'https://example.com/voice.mp3',
  'en'
);

console.log(result);
// { type: 'expense', amount: 50.00, notes: 'transcription', ... }
```

### 3. Text Extraction (Natural Language)

```typescript
import { TextExtractor } from '@expenses-agent/ai';

const extractor = new TextExtractor(process.env.OPENAI_API_KEY);

const result = await extractor.extractFromText(
  'I spent $150 on books at Amazon today',
  'en'
);

console.log(result);
// { type: 'expense', amount: 150.00, merchant: 'Amazon', ... }
```

### 4. Unified Service (All-in-One)

```typescript
import { ExtractionService } from '@expenses-agent/ai';

const service = new ExtractionService(process.env.OPENAI_API_KEY);

// Use any extraction method
const imageResult = await service.extractFromImage(url, 'en');
const audioResult = await service.extractFromAudio(url, 'pt-BR');
const textResult = await service.extractFromText(text, 'en');
```

## Example Results

### Expense (pt-BR)
```json
{
  "type": "expense",
  "amount": 45.50,
  "currency": "BRL",
  "date": "2025-10-29T10:30:00Z",
  "merchant": "Padaria Central",
  "method": "credit_card",
  "category": "food",
  "notes": "Coffee and pastries",
  "confidence": 0.92,
  "language": "pt-BR"
}
```

### Income (en)
```json
{
  "type": "income",
  "amount": 5000.00,
  "currency": "USD",
  "date": "2025-10-30T00:00:00Z",
  "payee": "Employer",
  "method": "bank_transfer",
  "category": "salary",
  "notes": "Monthly salary",
  "confidence": 0.95,
  "language": "en"
}
```

### Investment (en)
```json
{
  "type": "investment",
  "amount": 1000.00,
  "currency": "USD",
  "date": "2025-10-30T00:00:00Z",
  "merchant": "Vanguard",
  "category": "investments",
  "notes": "Index fund contribution",
  "confidence": 0.93,
  "language": "en"
}
```

## Error Handling

```typescript
try {
  const result = await service.extractFromImage(imageUrl);
  
  // Check confidence score
  if (result.confidence < 0.7) {
    console.warn('Low confidence - recommend manual review');
  }
  
  // Validate with Zod schema
  const validated = ExtractionResultSchema.parse(result);
  
} catch (error) {
  if (error instanceof ZodError) {
    console.error('Validation failed:', error.errors);
  } else if (error.message.includes('Invalid')) {
    console.error('Invalid input:', error.message);
  } else {
    console.error('Extraction failed:', error.message);
  }
}
```

## Integration with Apps

### Mobile (React Native)
```typescript
// apps/mobile/src/services/ai.ts
import { aiService } from './services/ai';

const result = await aiService.extractFromImage(localUri, userLocale);
```

### Web (Next.js)
```typescript
// Call via Edge Function (recommended - keeps API key secure)
const response = await fetch('/api/extract-image', {
  method: 'POST',
  body: JSON.stringify({ imageUrl, language }),
});
const result = await response.json();
```

## Configuration

### Environment Variables
```bash
# .env
OPENAI_API_KEY=sk-proj-...
```

### TypeScript Config
```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true
  }
}
```

## Common Issues

### Issue: Module not found '@expenses-agent/ai'
**Solution:** Build the package first
```bash
cd packages/ai
npm run build
```

### Issue: Tests failing with 'openai not found'
**Solution:** Install dependencies
```bash
npm install
```

### Issue: API errors in production
**Solution:** Never expose OPENAI_API_KEY in client code. Use Edge Functions:
```typescript
// infrastructure/supabase/functions/extract-expense/index.ts
import { ExtractionService } from '@expenses-agent/ai';

const service = new ExtractionService(Deno.env.get('OPENAI_API_KEY'));
```

## Performance Tips

1. **Use appropriate models:**
   - Image: `gpt-4o` (Vision)
   - Audio: `whisper-1` → `gpt-4o`
   - Text: `gpt-4o`

2. **Set low temperature (0.1)** for consistent extraction

3. **Cache common extractions** (future optimization)

4. **Batch process** multiple receipts when possible

5. **Stream responses** for real-time feedback (future)

## Testing Your Integration

```typescript
// Simple integration test
import { ExtractionService } from '@expenses-agent/ai';

const service = new ExtractionService(process.env.OPENAI_API_KEY);

// Test with sample text
const result = await service.extractFromText(
  'I spent $25 at Starbucks',
  'en'
);

console.assert(result.amount === 25);
console.assert(result.type === 'expense');
console.log('✅ Integration working!');
```

## Next Steps

1. ✅ Implement Edge Functions for server-side calls
2. ✅ Add file upload to Supabase Storage
3. ✅ Integrate with mobile/web UI
4. ✅ Add user review flow before saving
5. ✅ Track provenance (`ai` extraction)

## Documentation

- Full README: `packages/ai/README.md`
- Implementation details: `AI_EXTRACTION_IMPLEMENTATION.md`
- API docs: See inline JSDoc comments

---

**Need help?** Check the test files in `src/__tests__/` for more examples!
