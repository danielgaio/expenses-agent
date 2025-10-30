import OpenAI from 'openai';
import { ExtractionResult, ExtractionResultSchema } from '../types';

export class ImageExtractor {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ apiKey });
  }

  async extractFromImage(
    imageUrl: string,
    language: string = 'en'
  ): Promise<ExtractionResult> {
    if (!imageUrl || imageUrl.trim() === '') {
      throw new Error('Invalid image URL');
    }

    try {
      const prompt = this.buildPrompt(language);

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o', // GPT-4 with vision capabilities
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.1, // Low temperature for consistent extraction
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const extracted = JSON.parse(content);

      // Validate with Zod schema
      const result = ExtractionResultSchema.parse(extracted);

      return result;
    } catch (error) {
      if (error instanceof Error) {
        // Preserve validation errors
        if (error.name === 'ZodError') {
          throw error;
        }
        // Wrap other errors
        throw new Error(`Failed to extract data from image: ${error.message}`);
      }
      throw new Error('Failed to extract data from image');
    }
  }

  private buildPrompt(language: string): string {
    const languageInstructions =
      language === 'pt-BR'
        ? 'O texto no recibo pode estar em português (Brasil).'
        : 'The text in the receipt may be in English.';

    const languageField =
      language === 'pt-BR'
        ? '"language": "pt-BR"'
        : '"language": "en"';

    return `You are an AI assistant that extracts transaction data from receipt images.

${languageInstructions}

Analyze the receipt image and extract the following information:
- type: "expense", "income", or "investment" (usually "expense" for receipts)
- amount: The total amount as a number (e.g., 45.50)
- currency: The 3-letter ISO currency code (e.g., "USD", "BRL", "EUR")
- date: The transaction date in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). If time is not visible, use "T00:00:00Z"
- merchant: The store or merchant name
- method: Payment method if visible (e.g., "credit_card", "debit_card", "cash", "pix")
- category: Suggested category based on merchant (e.g., "food", "groceries", "transport", "utilities")
- notes: Any relevant notes, including items purchased if visible
- confidence: Your confidence score from 0 to 1 (e.g., 0.95 for very clear receipt, 0.70 for partially legible)
- ${languageField}

Return ONLY a valid JSON object with these fields. Do not include any markdown formatting or code blocks.

Example response:
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
  "language": "${language}"
}`;
  }
}
