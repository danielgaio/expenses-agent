import { z } from 'zod';

export const TransactionTypeSchema = z.enum(['expense', 'income', 'investment']);
export const TransactionStatusSchema = z.enum(['realized', 'planned']);
export const ProvenanceSchema = z.enum(['ai', 'user', 'mixed']);

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  householdId: z.string().uuid(),
  userId: z.string().uuid(),
  type: TransactionTypeSchema,
  amount: z.number().positive(),
  currency: z.string().length(3), // ISO 4217
  exchangeRate: z.number().positive().optional(),
  status: TransactionStatusSchema,
  date: z.string().datetime(),
  merchant: z.string().optional(),
  payee: z.string().optional(),
  method: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  sourceArtifactId: z.string().uuid().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
  provenance: ProvenanceSchema,
  language: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const InstallmentScheduleSchema = z.object({
  id: z.string().uuid(),
  transactionId: z.string().uuid(),
  totalInstallments: z.number().int().positive(),
  currentInstallment: z.number().int().positive(),
  amount: z.number().positive(),
  interestRate: z.number().min(0).optional(),
  dueDate: z.string().datetime(),
  status: TransactionStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const RecurringRuleSchema = z.object({
  id: z.string().uuid(),
  transactionId: z.string().uuid(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom']),
  interval: z.number().int().positive().default(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  nextRunAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TransactionType = z.infer<typeof TransactionTypeSchema>;
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
export type Provenance = z.infer<typeof ProvenanceSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type InstallmentSchedule = z.infer<typeof InstallmentScheduleSchema>;
export type RecurringRule = z.infer<typeof RecurringRuleSchema>;
