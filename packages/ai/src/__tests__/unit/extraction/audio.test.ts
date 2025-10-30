import { AudioExtractor } from '../../../extraction/audio';
import { ExtractionResultSchema } from '../../../types';
import { mockWhisperResponse, mockGPTExtractionResponse, mockAudioUrl } from '../../fixtures/mockResponses';

// Mock OpenAI
jest.mock('openai');

describe('AudioExtractor', () => {
  let extractor: AudioExtractor;
  let mockOpenAI: any;

  beforeEach(() => {
    // Create mock OpenAI instance
    mockOpenAI = {
      audio: {
        transcriptions: {
          create: jest.fn(),
        },
      },
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    };

    // Mock the OpenAI constructor
    const OpenAI = require('openai').default;
    OpenAI.mockImplementation(() => mockOpenAI);

    extractor = new AudioExtractor('test-api-key');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extractFromAudio', () => {
    it('should transcribe audio and extract expense data', async () => {
      mockOpenAI.audio.transcriptions.create.mockResolvedValue(mockWhisperResponse);
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromAudio(mockAudioUrl, 'pt-BR');

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
      mockOpenAI.audio.transcriptions.create.mockResolvedValue(mockWhisperResponse);
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromAudio(mockAudioUrl);

      // Should not throw validation error
      expect(() => ExtractionResultSchema.parse(result)).not.toThrow();
    });

    it('should support Portuguese (Brazil) language', async () => {
      const ptResponse = {
        text: 'Gastei cinquenta reais no supermercado',
      };

      mockOpenAI.audio.transcriptions.create.mockResolvedValue(ptResponse);
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                type: 'expense',
                amount: 50.00,
                currency: 'BRL',
                date: '2025-10-29T00:00:00Z',
                merchant: 'Supermercado',
                category: 'groceries',
                notes: 'Gastei cinquenta reais no supermercado',
                confidence: 0.85,
                language: 'pt-BR',
              }),
            },
          },
        ],
      });

      const result = await extractor.extractFromAudio(mockAudioUrl, 'pt-BR');

      expect(result.language).toBe('pt-BR');
      expect(result.currency).toBe('BRL');
    });

    it('should support English language', async () => {
      const enResponse = {
        text: 'I spent fifty dollars at the grocery store',
      };

      mockOpenAI.audio.transcriptions.create.mockResolvedValue(enResponse);
      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                type: 'expense',
                amount: 50.00,
                currency: 'USD',
                date: '2025-10-29T00:00:00Z',
                merchant: 'Grocery Store',
                category: 'groceries',
                notes: 'I spent fifty dollars at the grocery store',
                confidence: 0.87,
                language: 'en',
              }),
            },
          },
        ],
      });

      const result = await extractor.extractFromAudio(mockAudioUrl, 'en');

      expect(result.language).toBe('en');
      expect(result.currency).toBe('USD');
    });

    it('should include transcription in notes field', async () => {
      mockOpenAI.audio.transcriptions.create.mockResolvedValue(mockWhisperResponse);
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromAudio(mockAudioUrl);

      expect(result.notes).toBeDefined();
    });

    it('should use Whisper model for transcription', async () => {
      mockOpenAI.audio.transcriptions.create.mockResolvedValue(mockWhisperResponse);
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      await extractor.extractFromAudio(mockAudioUrl);

      expect(mockOpenAI.audio.transcriptions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'whisper-1',
        })
      );
    });

    it('should handle invalid audio URLs', async () => {
      await expect(extractor.extractFromAudio('')).rejects.toThrow(
        'Invalid audio URL'
      );
    });

    it('should handle transcription errors gracefully', async () => {
      mockOpenAI.audio.transcriptions.create.mockRejectedValue(
        new Error('Whisper API Error')
      );

      await expect(extractor.extractFromAudio(mockAudioUrl)).rejects.toThrow(
        'Failed to extract data from audio'
      );
    });

    it('should handle extraction errors after transcription', async () => {
      mockOpenAI.audio.transcriptions.create.mockResolvedValue(mockWhisperResponse);
      mockOpenAI.chat.completions.create.mockRejectedValue(
        new Error('GPT API Error')
      );

      await expect(extractor.extractFromAudio(mockAudioUrl)).rejects.toThrow(
        'Failed to extract data from audio'
      );
    });

    it('should handle empty transcription', async () => {
      mockOpenAI.audio.transcriptions.create.mockResolvedValue({ text: '' });

      await expect(extractor.extractFromAudio(mockAudioUrl)).rejects.toThrow();
    });

    it('should pass language parameter to Whisper', async () => {
      mockOpenAI.audio.transcriptions.create.mockResolvedValue(mockWhisperResponse);
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      await extractor.extractFromAudio(mockAudioUrl, 'pt-BR');

      expect(mockOpenAI.audio.transcriptions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          language: 'pt',
        })
      );
    });

    it('should handle confidence scores from extraction', async () => {
      mockOpenAI.audio.transcriptions.create.mockResolvedValue(mockWhisperResponse);
      mockOpenAI.chat.completions.create.mockResolvedValue(mockGPTExtractionResponse);

      const result = await extractor.extractFromAudio(mockAudioUrl);

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });
});
