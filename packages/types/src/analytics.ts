import { z } from 'zod';

export const TimeframeSchema = z.enum([
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'semiannual',
  'annual',
  'custom',
]);

export const AnalyticsQuerySchema = z.object({
  householdId: z.string().uuid(),
  timeframe: TimeframeSchema,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  transactionTypes: z.array(z.enum(['expense', 'income', 'investment'])).optional(),
});

export const CashFlowProjectionSchema = z.object({
  date: z.string().datetime(),
  income: z.number(),
  expenses: z.number(),
  investments: z.number(),
  netCashFlow: z.number(),
  cumulativeCash: z.number(),
});

export const CategoryBreakdownSchema = z.object({
  categoryId: z.string().uuid(),
  categoryName: z.string(),
  total: z.number(),
  count: z.number(),
  percentage: z.number(),
});

export type Timeframe = z.infer<typeof TimeframeSchema>;
export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
export type CashFlowProjection = z.infer<typeof CashFlowProjectionSchema>;
export type CategoryBreakdown = z.infer<typeof CategoryBreakdownSchema>;
