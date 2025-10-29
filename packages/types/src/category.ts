import { z } from 'zod';
import { TransactionTypeSchema } from './transaction';

export const CategoryTypeSchema = TransactionTypeSchema;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  householdId: z.string().uuid(),
  name: z.string(),
  type: CategoryTypeSchema,
  icon: z.string().optional(),
  color: z.string().optional(),
  parentId: z.string().uuid().optional(),
  isDefault: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CategoryType = z.infer<typeof CategoryTypeSchema>;
export type Category = z.infer<typeof CategorySchema>;
