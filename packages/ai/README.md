# @expenses-agent/ai

AI-powered extraction services for the Expenses Agent application.

## Overview

This package provides OpenAI-powered services for extracting structured transaction data from multiple input formats:

- **Image Extraction**: Extract data from receipt photos using OpenAI Vision API
- **Audio Extraction**: Transcribe voice recordings and extract transaction data using Whisper + GPT-4
- **Text Extraction**: Parse natural language descriptions into structured transactions using GPT-4

## Installation

```bash
npm install @expenses-agent/ai
```

## Usage

### Unified Extraction Service

The simplest way to use the extraction services:

```typescript
import { ExtractionService } from '@expenses-agent/ai';

const service = new ExtractionService(process.env.OPENAI_API_KEY);

// Extract from image
const imageResult = await service.extractFromImage(
  'https://example.com/receipt.jpg',
  'pt-BR' // Language: 'en' or 'pt-BR'
);

// Extract from audio
const audioResult = await service.extractFromAudio(
  'https://example.com/voice-note.mp3',
  'en'
);

// Extract from text
const textResult = await service.extractFromText(
  'I spent $45.50 at Starbucks this morning',
  'en'
);
```

### Individual Extractors

For more control, use the individual extractor classes:

```typescript
import { ImageExtractor, AudioExtractor, TextExtractor } from '@expenses-agent/ai';

const imageExtractor = new ImageExtractor(process.env.OPENAI_API_KEY);
const result = await imageExtractor.extractFromImage(imageUrl, 'en');
```

## Extraction Result

All extraction methods return a standardized `ExtractionResult` object:

```typescript
{
  type: 'expense' | 'income' | 'investment',
  amount: number,              // e.g., 45.50
  currency: string,            // ISO 4217 code, e.g., 'USD', 'BRL'
  date: string,                // ISO 8601 datetime
  merchant?: string,           // For expenses
  payee?: string,              // For income
  method?: string,             // Payment method
  category?: string,           // Suggested category
  notes?: string,              // Additional information
  confidence: number,          // 0-1 confidence score
  language: string,            // 'en' or 'pt-BR'
  rawText?: string,            // Original transcription/text
}
```

## Supported Languages

- **English** (`en`)
- **Portuguese (Brazil)** (`pt-BR`)

The AI understands both languages and will:
- Parse amounts in local formats (e.g., "R$ 45,50" or "$45.50")
- Recognize local merchants and categories
- Handle date expressions in the specified language

## Confidence Scores

Each extraction includes a confidence score (0-1) indicating the AI's certainty:

- **0.9-1.0**: Very high confidence (clear receipt, explicit amounts)
- **0.7-0.9**: Good confidence (most information extracted)
- **0.5-0.7**: Medium confidence (some ambiguity)
- **0.0-0.5**: Low confidence (requires review)

Use these scores to decide whether to prompt users for manual review.

## Error Handling

All extraction methods throw descriptive errors:

```typescript
try {
  const result = await service.extractFromImage(imageUrl);
} catch (error) {
  if (error.message.includes('Invalid image URL')) {
    // Handle invalid input
  } else if (error.message.includes('Failed to extract')) {
    // Handle API or extraction errors
  }
}
```

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Implementation Details

### Image Extraction

- Uses OpenAI GPT-4 with Vision capabilities (`gpt-4o`)
- Extracts text via OCR and structures data
- Handles receipts, invoices, and financial documents
- Temperature set to 0.1 for consistent extraction

### Audio Extraction

- Two-step process:
  1. Transcribe with Whisper (`whisper-1`)
  2. Extract structured data with GPT-4
- Supports various audio formats (MP3, M4A, WAV)
- Language-aware transcription

### Text Extraction

- Uses GPT-4 for natural language understanding
- Handles casual and formal text formats
- Converts spelled-out numbers (e.g., "forty-five" → 45)
- Infers dates from context ("today", "last week", etc.)

## Development

### Test-Driven Development

This package follows strict TDD principles:

1. Write failing tests in `src/__tests__/unit/`
2. Implement feature to pass tests
3. Refactor while keeping tests green

### Adding New Features

```bash
# Create test file first
touch src/__tests__/unit/extraction/new-feature.test.ts

# Write tests
# Implement feature
# Ensure all tests pass
npm test
```

## Dependencies

- `openai`: ^4.24.0 - OpenAI API client
- `zod`: ^3.22.4 - Schema validation
- `@expenses-agent/types`: * - Shared types

## Environment Variables

```bash
OPENAI_API_KEY=sk-...  # Required: Your OpenAI API key
```
