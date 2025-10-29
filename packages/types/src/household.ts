import { z } from 'zod';
import { UserRoleSchema } from './user';

export const HouseholdSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  currency: z.string().length(3), // ISO 4217
  timezone: z.string().default('UTC'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const HouseholdMemberSchema = z.object({
  id: z.string().uuid(),
  householdId: z.string().uuid(),
  userId: z.string().uuid(),
  role: UserRoleSchema,
  joinedAt: z.string().datetime(),
  invitedBy: z.string().uuid().optional(),
});

export type Household = z.infer<typeof HouseholdSchema>;
export type HouseholdMember = z.infer<typeof HouseholdMemberSchema>;
