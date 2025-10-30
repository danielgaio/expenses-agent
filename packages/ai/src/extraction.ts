import { ExtractionResult } from './types';
import { ImageExtractor } from './extraction/image';
import { AudioExtractor } from './extraction/audio';
import { TextExtractor } from './extraction/text';

/**
 * Unified ExtractionService that delegates to specialized extractors
 * This class provides backward compatibility and a simple interface
 */
export class ExtractionService {
  private imageExtractor: ImageExtractor;
  private audioExtractor: AudioExtractor;
  private textExtractor: TextExtractor;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.imageExtractor = new ImageExtractor(apiKey);
    this.audioExtractor = new AudioExtractor(apiKey);
    this.textExtractor = new TextExtractor(apiKey);
  }

  /**
   * Extract transaction data from an image (receipt, invoice, etc.)
   * Uses OpenAI Vision API for OCR and structured extraction
   * 
   * @param imageUrl - URL to the image file
   * @param language - Language code ('en' or 'pt-BR')
   * @returns Extracted transaction data with confidence score
   */
  async extractFromImage(imageUrl: string, language: string = 'en'): Promise<ExtractionResult> {
    return this.imageExtractor.extractFromImage(imageUrl, language);
  }

  /**
   * Extract transaction data from audio recording
   * Uses OpenAI Whisper for transcription and GPT for extraction
   * 
   * @param audioUrl - URL to the audio file
   * @param language - Language code ('en' or 'pt-BR')
   * @returns Extracted transaction data with confidence score
   */
  async extractFromAudio(audioUrl: string, language: string = 'en'): Promise<ExtractionResult> {
    return this.audioExtractor.extractFromAudio(audioUrl, language);
  }

  /**
   * Extract transaction data from plain text
   * Uses OpenAI GPT for NLP-based extraction
   * 
   * @param text - Text description of the transaction
   * @param language - Language code ('en' or 'pt-BR')
   * @returns Extracted transaction data with confidence score
   */
  async extractFromText(text: string, language: string = 'en'): Promise<ExtractionResult> {
    return this.textExtractor.extractFromText(text, language);
  }
}
