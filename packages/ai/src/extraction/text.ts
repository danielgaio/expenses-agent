import OpenAI from 'openai';
import { ExtractionResult, ExtractionResultSchema } from '../types';

export class TextExtractor {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ apiKey });
  }

  async extractFromText(
    text: string,
    language: string = 'en'
  ): Promise<ExtractionResult> {
    if (!text || text.trim() === '') {
      throw new Error('Invalid text input');
    }

    try {
      const prompt = this.buildPrompt(language, text);

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: prompt,
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
        throw new Error(`Failed to extract data from text: ${error.message}`);
      }
      throw new Error('Failed to extract data from text');
    }
  }

  private buildPrompt(language: string, text: string): string {
    const languageInstructions =
      language === 'pt-BR'
        ? 'O texto está em português (Brasil).'
        : 'The text is in English.';

    const languageField =
      language === 'pt-BR'
        ? '"language": "pt-BR"'
        : '"language": "en"';

    const currencyHint =
      language === 'pt-BR'
        ? 'Use "BRL" for Brazilian Real unless another currency is explicitly mentioned.'
        : 'Use "USD" for US Dollars unless another currency is explicitly mentioned.';

    return `You are an AI assistant that extracts transaction data from text descriptions.

${languageInstructions}

The user wrote: "${text}"

Extract the following information:
- type: "expense", "income", or "investment" (infer from context - salaries/payments received are "income", money spent is "expense", investments/contributions are "investment")
- amount: The amount as a number (convert text like "fifty dollars" to 50, "quarenta e cinco reais" to 45)
- currency: The 3-letter ISO currency code (e.g., "USD", "BRL", "EUR"). ${currencyHint}
- date: Infer the transaction date from context. Use "today", "yesterday", or specific dates mentioned. Convert to ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). If no date mentioned, assume today (2025-10-30).
- merchant: The store/merchant name if this is an expense
- payee: The payer name if this is income
- method: Payment method if mentioned (e.g., "credit_card", "debit_card", "cash", "pix", "bank_transfer")
- category: Suggested category based on context:
  - For expenses: "food", "groceries", "transport", "utilities", "shopping", "entertainment", "health", "education"
  - For income: "salary", "freelance", "investment_returns", "gift", "refund"
  - For investments: "investments", "retirement", "savings"
- notes: The original text provided by the user
- confidence: Your confidence score from 0 to 1 based on how clear and complete the information is
- ${languageField}

Time references:
- "today", "hoje", "this morning", "esta manhã" = 2025-10-30
- "yesterday", "ontem" = 2025-10-29
- "last week", "semana passada" = estimate around 2025-10-23
- Specific dates like "October 29" = 2025-10-29

Return ONLY a valid JSON object with these fields. Do not include any markdown formatting or code blocks.

Example responses:

For expense:
{
  "type": "expense",
  "amount": 45.50,
  "currency": "BRL",
  "date": "2025-10-30T10:00:00Z",
  "merchant": "Padaria Central",
  "method": "credit_card",
  "category": "food",
  "notes": "${text}",
  "confidence": 0.88,
  "language": "${language}"
}

For income:
{
  "type": "income",
  "amount": 5000.00,
  "currency": "USD",
  "date": "2025-10-30T00:00:00Z",
  "payee": "Employer Name",
  "method": "bank_transfer",
  "category": "salary",
  "notes": "${text}",
  "confidence": 0.95,
  "language": "${language}"
}`;
  }
}
