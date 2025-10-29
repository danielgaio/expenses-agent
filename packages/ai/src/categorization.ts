import OpenAI from 'openai';

export class CategorizationService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async categorize(description: string, availableCategories: string[]): Promise<string> {
    // TODO: Implement AI-based categorization
    throw new Error('Not implemented');
  }

  async suggestCategory(transaction: { merchant?: string; notes?: string }): Promise<string[]> {
    // TODO: Implement category suggestions
    throw new Error('Not implemented');
  }
}
