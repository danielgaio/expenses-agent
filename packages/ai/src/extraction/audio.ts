import OpenAI from 'openai';
import { ExtractionResult, ExtractionResultSchema } from '../types';

export class AudioExtractor {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ apiKey });
  }

  async extractFromAudio(
    audioUrl: string,
    language: string = 'en'
  ): Promise<ExtractionResult> {
    if (!audioUrl || audioUrl.trim() === '') {
      throw new Error('Invalid audio URL');
    }

    try {
      // Step 1: Transcribe audio using Whisper
      const transcription = await this.transcribeAudio(audioUrl, language);

      if (!transcription || transcription.trim() === '') {
        throw new Error('Empty transcription received');
      }

      // Step 2: Extract structured data from transcription using GPT
      const result = await this.extractFromTranscription(transcription, language);

      return result;
    } catch (error) {
      if (error instanceof Error) {
        // Preserve validation errors
        if (error.name === 'ZodError') {
          throw error;
        }
        // Wrap other errors
        throw new Error(`Failed to extract data from audio: ${error.message}`);
      }
      throw new Error('Failed to extract data from audio');
    }
  }

  private async transcribeAudio(
    audioUrl: string,
    language: string
  ): Promise<string> {
    // Convert language code to Whisper format (ISO-639-1)
    const whisperLanguage = language.startsWith('pt') ? 'pt' : 'en';

    // Fetch audio file
    const audioResponse = await fetch(audioUrl);
    const audioBlob = await audioResponse.blob();
    const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' });

    const response = await this.client.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile,
      language: whisperLanguage,
    });

    return response.text;
  }

  private async extractFromTranscription(
    transcription: string,
    language: string
  ): Promise<ExtractionResult> {
    const prompt = this.buildPrompt(language, transcription);

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.1,
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
  }

  private buildPrompt(language: string, transcription: string): string {
    const languageInstructions =
      language === 'pt-BR'
        ? 'O texto transcrito está em português (Brasil).'
        : 'The transcribed text is in English.';

    const languageField =
      language === 'pt-BR'
        ? '"language": "pt-BR"'
        : '"language": "en"';

    const currencyHint =
      language === 'pt-BR'
        ? 'Use "BRL" for Brazilian Real unless another currency is explicitly mentioned.'
        : 'Use "USD" for US Dollars unless another currency is explicitly mentioned.';

    return `You are an AI assistant that extracts transaction data from voice transcriptions.

${languageInstructions}

The user said: "${transcription}"

Extract the following information:
- type: "expense", "income", or "investment" (infer from context)
- amount: The amount as a number (convert text numbers like "fifty" to 50)
- currency: The 3-letter ISO currency code (e.g., "USD", "BRL", "EUR"). ${currencyHint}
- date: Infer the transaction date. Use "today", "yesterday", or specific dates mentioned. Convert to ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).
- merchant: The store or merchant name if mentioned
- method: Payment method if mentioned (e.g., "credit_card", "debit_card", "cash", "pix")
- category: Suggested category based on context (e.g., "food", "groceries", "transport", "utilities", "shopping")
- notes: The original transcription
- confidence: Your confidence score from 0 to 1 based on how clear the information is
- ${languageField}

For dates:
- "today" or "hoje" = current date (2025-10-30)
- "yesterday" or "ontem" = 2025-10-29
- "this morning" or "esta manhã" = today with morning time
- If no date is mentioned, assume today

Return ONLY a valid JSON object with these fields. Do not include any markdown formatting or code blocks.

Example response:
{
  "type": "expense",
  "amount": 45.50,
  "currency": "BRL",
  "date": "2025-10-30T10:00:00Z",
  "merchant": "Padaria Central",
  "method": "credit_card",
  "category": "food",
  "notes": "${transcription}",
  "confidence": 0.88,
  "language": "${language}"
}`;
  }
}
