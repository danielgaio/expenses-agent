import { TextExtractor } from '../../../extraction/text';
import { ExtractionResultSchema } from '../../../types';
import { mockGPTExtractionResponse, mockTextInput } from '../../fixtures/mockResponses';

// Mock OpenAI
jest.mock('openai');

describe('TextExtractor', () => {
  let extractor: TextExtractor;
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

    extractor = new TextExtractor('test-api-key');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractFromText', () => {
    it('should extract expense data from text input', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromText(mockTextInput, 'en');

      expect(result).toMatchObject({
        type: expect.any(String),
        amount: expect.any(Number),
        currency: expect.any(String),
        date: expect.any(String),
        confidence: expect.any(Number),
      });
      expect(result.amount).toBeGreaterThan(0);
    });

    it('should validate extraction result with Zod schema', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromText(mockTextInput);

      // Should not throw validation error
      expect(() => ExtractionResultSchema.parse(result)).not.toThrow();
    });

    it('should support Portuguese (Brazil) text', async () => {
      const ptResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                type: 'expense',
                amount: 35.00,
                currency: 'BRL',
                date: '2025-10-30T00:00:00Z',
                merchant: 'Posto Ipiranga',
                method: 'credit_card',
                category: 'transport',
                notes: 'Abasteci o carro com gasolina no Posto Ipiranga',
                confidence: 0.90,
                language: 'pt-BR',
              }),
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(ptResponse);

      const result = await extractor.extractFromText(
        'Abasteci o carro com gasolina no Posto Ipiranga',
        'pt-BR'
      );

      expect(result.language).toBe('pt-BR');
      expect(result.currency).toBe('BRL');
    });

    it('should support English text', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromText(mockTextInput, 'en');

      expect(result.language).toBe('en');
    });

    it('should handle income transactions', async () => {
      const incomeResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                type: 'income',
                amount: 5000.00,
                currency: 'USD',
                date: '2025-10-30T00:00:00Z',
                payee: 'Employer',
                category: 'salary',
                notes: 'Monthly salary received',
                confidence: 0.95,
                language: 'en',
              }),
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(incomeResponse);

      const result = await extractor.extractFromText('Received monthly salary of $5000');

      expect(result.type).toBe('income');
    });

    it('should handle investment transactions', async () => {
      const investmentResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                type: 'investment',
                amount: 1000.00,
                currency: 'USD',
                date: '2025-10-30T00:00:00Z',
                merchant: 'Vanguard',
                category: 'investments',
                notes: 'Invested $1000 in index fund',
                confidence: 0.93,
                language: 'en',
              }),
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(investmentResponse);

      const result = await extractor.extractFromText('Invested $1000 in index fund');

      expect(result.type).toBe('investment');
    });

    it('should handle casual text formats', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromText(
        'bought coffee for 5 bucks at starbucks this morning'
      );

      expect(result.amount).toBeGreaterThan(0);
    });

    it('should handle formal text formats', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromText(
        'Transaction: $150.00 paid to Amazon on October 29, 2025 for books'
      );

      expect(result.amount).toBeGreaterThan(0);
    });

    it('should include original text in notes', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromText(mockTextInput);

      expect(result.notes).toBeDefined();
    });

    it('should use GPT-4 model', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      await extractor.extractFromText(mockTextInput);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o',
        })
      );
    });

    it('should handle invalid text input', async () => {
      await expect(extractor.extractFromText('')).rejects.toThrow(
        'Invalid text input'
      );
    });

    it('should handle API errors gracefully', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(
        new Error('GPT API Error: Rate limit exceeded')
      );

      await expect(extractor.extractFromText(mockTextInput)).rejects.toThrow(
        'Failed to extract data from text'
      );
    });

    it('should handle malformed API responses', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'not json' } }],
      });

      await expect(extractor.extractFromText(mockTextInput)).rejects.toThrow();
    });

    it('should send appropriate language context in prompt', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      await extractor.extractFromText(mockTextInput, 'pt-BR');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('pt-BR'),
            }),
          ]),
        })
      );
    });

    it('should default to English when no language specified', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      await extractor.extractFromText(mockTextInput);

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('en'),
            }),
          ]),
        })
      );
    });

    it('should handle text with numbers spelled out', async () => {
      const spelledOutResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                type: 'expense',
                amount: 45.00,
                currency: 'USD',
                date: '2025-10-30T00:00:00Z',
                merchant: 'Store',
                category: 'shopping',
                notes: 'forty-five dollars',
                confidence: 0.85,
                language: 'en',
              }),
            },
          },
        ],
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(spelledOutResponse);

      const result = await extractor.extractFromText('I spent forty-five dollars at the store');

      expect(result.amount).toBe(45.00);
    });

    it('should include confidence scores', async () => {
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromText(mockTextInput);

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });
});
