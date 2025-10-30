import { ExtractionService } from '@expenses-agent/ai';

// Initialize AI service with OpenAI API key from environment
// In production, this should be retrieved from a secure backend endpoint
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. AI extraction features will not work.');
}

const extractionService = OPENAI_API_KEY 
  ? new ExtractionService(OPENAI_API_KEY)
  : null;

/**
 * AI service for mobile app
 * Wraps the @expenses-agent/ai package with mobile-specific logic
 */
export const aiService = {
  /**
   * Extract transaction data from image (receipt photo)
   * @param imageUri - Local file URI or remote URL
   * @param language - User's preferred language
   */
  extractFromImage: async (imageUri: string, language: string = 'en') => {
    try {
      // TODO: Upload image to Supabase Storage if local URI
      // For now, assume imageUri is already a URL
      const result = await extractionService.extractFromImage(imageUri, language);
      return result;
    } catch (error) {
      console.error('Image extraction failed:', error);
      throw new Error('Failed to extract data from image. Please try again or enter manually.');
    }
  },

  /**
   * Extract transaction data from audio recording
   * @param audioUri - Local file URI or remote URL
   * @param language - User's preferred language
   */
  extractFromAudio: async (audioUri: string, language: string = 'en') => {
    try {
      // TODO: Upload audio to Supabase Storage if local URI
      // For now, assume audioUri is already a URL
      const result = await extractionService.extractFromAudio(audioUri, language);
      return result;
    } catch (error) {
      console.error('Audio extraction failed:', error);
      throw new Error('Failed to extract data from audio. Please try again or enter manually.');
    }
  },

  /**
   * Extract transaction data from text description
   * @param text - Natural language description
   * @param language - User's preferred language
   */
  extractFromText: async (text: string, language: string = 'en') => {
    try {
      const result = await extractionService.extractFromText(text, language);
      return result;
    } catch (error) {
      console.error('Text extraction failed:', error);
      throw new Error('Failed to extract data from text. Please try again or enter manually.');
    }
  },

  /**
   * Categorize a transaction based on description
   * TODO: Implement using @expenses-agent/ai categorization service
   */
  categorize: async (_description: string) => {
    // TODO: Implement AI categorization
    throw new Error('Categorization not yet implemented');
  },
};
