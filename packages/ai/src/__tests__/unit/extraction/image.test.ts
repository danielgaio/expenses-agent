import { ImageExtractor } from '../../../extraction/image';
import { ExtractionResultSchema } from '../../../types';
import { mockVisionResponse, mockReceiptImageUrl } from '../../fixtures/mockResponses';

// Mock OpenAI
jest.mock('openai');

describe('ImageExtractor', () => {
  let extractor: ImageExtractor;
  let mockOpenAI: any;

  beforeEach(() => {
    // Create mock OpenAI instance
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    };

    // Mock the OpenAI constructor
    const OpenAI = require('openai').default;
    OpenAI.mockImplementation(() => mockOpenAI);

    extractor = new ImageExtractor('test-api-key');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractFromImage', () => {
    it('should extract expense data from receipt image', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockVisionResponse);

      const result = await extractor.extractFromImage(mockReceiptImageUrl, 'pt-BR');

      expect(result).toMatchObject({
        type: 'expense',
        amount: expect.any(Number),
        currency: expect.any(String),
        date: expect.any(String),
        merchant: expect.any(String),
        confidence: expect.any(Number),
      });
      expect(result.amount).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should validate extraction result with Zod schema', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockVisionResponse);

      const result = await extractor.extractFromImage(mockReceiptImageUrl);

      // Should not throw validation error
      expect(() => ExtractionResultSchema.parse(result)).not.toThrow();
    });

    it('should support English language', async () => {
      const englishResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                type: 'expense',
                amount: 25.99,
                currency: 'USD',
                date: '2025-10-29T15:00:00Z',
                merchant: 'Starbucks',
                method: 'debit_card',
                category: 'food',
                notes: 'Coffee',
                confidence: 0.95,
                language: 'en',
              }),
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(englishResponse);

      const result = await extractor.extractFromImage(mockReceiptImageUrl, 'en');

      expect(result.language).toBe('en');
      expect(result.merchant).toBe('Starbucks');
    });

    it('should support Portuguese (Brazil) language', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockVisionResponse);

      const result = await extractor.extractFromImage(mockReceiptImageUrl, 'pt-BR');

      expect(result.language).toBe('pt-BR');
      expect(result.merchant).toBe('Padaria Central');
    });

    it('should include confidence score in result', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockVisionResponse);

      const result = await extractor.extractFromImage(mockReceiptImageUrl);

      expect(result.confidence).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle images with multiple line items', async () => {
      const multiItemResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                type: 'expense',
                amount: 123.45,
                currency: 'BRL',
                date: '2025-10-29T12:00:00Z',
                merchant: 'Supermercado Extra',
                method: 'credit_card',
                category: 'groceries',
                notes: 'Multiple items: bread, milk, eggs, cheese',
                confidence: 0.89,
                language: 'pt-BR',
              }),
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(multiItemResponse);

      const result = await extractor.extractFromImage(mockReceiptImageUrl);

      expect(result.amount).toBe(123.45);
      expect(result.notes).toContain('Multiple items');
    });

    it('should handle API errors gracefully', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(
        new Error('OpenAI API Error: Rate limit exceeded')
      );

      await expect(extractor.extractFromImage(mockReceiptImageUrl)).rejects.toThrow(
        'Failed to extract data from image'
      );
    });

    it('should handle invalid image URLs', async () => {
      await expect(extractor.extractFromImage('')).rejects.toThrow(
        'Invalid image URL'
      );
    });

    it('should handle malformed API responses', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'invalid json' } }],
      });

      await expect(extractor.extractFromImage(mockReceiptImageUrl)).rejects.toThrow();
    });

    it('should use Vision model for image analysis', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockVisionResponse);

      await extractor.extractFromImage(mockReceiptImageUrl);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o',
        })
      );
    });

    it('should send appropriate prompt with language context', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockVisionResponse);

      await extractor.extractFromImage(mockReceiptImageUrl, 'pt-BR');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.arrayContaining([
                expect.objectContaining({
                  type: 'text',
                  text: expect.stringContaining('pt-BR'),
                }),
              ]),
            }),
          ]),
        })
      );
    });

    it('should default to English when no language specified', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockVisionResponse);

      await extractor.extractFromImage(mockReceiptImageUrl);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.arrayContaining([
                expect.objectContaining({
                  type: 'text',
                  text: expect.stringContaining('en'),
                }),
              ]),
            }),
          ]),
        })
      );
    });
  });
});
