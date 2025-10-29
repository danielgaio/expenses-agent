import OpenAI from 'openai';
import { ExtractionResult } from './types';

export class ExtractionService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async extractFromImage(imageUrl: string, language: string = 'en'): Promise<ExtractionResult> {
    // TODO: Implement OpenAI Vision API integration
    throw new Error('Not implemented');
  }

  async extractFromAudio(audioUrl: string, language: string = 'en'): Promise<ExtractionResult> {
    // TODO: Implement OpenAI Whisper API integration
    throw new Error('Not implemented');
  }

  async extractFromText(text: string, language: string = 'en'): Promise<ExtractionResult> {
    // TODO: Implement OpenAI GPT API integration for text extraction
    throw new Error('Not implemented');
  }
}
