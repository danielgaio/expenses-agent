import { z } from 'zod';

export const ExtractionResultSchema = z.object({
  type: z.enum(['expense', 'income', 'investment']),
  amount: z.number().positive(),
  currency: z.string().length(3),
  date: z.string().datetime(),
  merchant: z.string().optional(),
  payee: z.string().optional(),
  method: z.string().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
  confidence: z.number().min(0).max(1),
  language: z.string(),
  rawText: z.string().optional(),
});

export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

export interface ExtractionService {
  extractFromImage(imageUrl: string, language?: string): Promise<ExtractionResult>;
  extractFromAudio(audioUrl: string, language?: string): Promise<ExtractionResult>;
  extractFromText(text: string, language?: string): Promise<ExtractionResult>;
}
