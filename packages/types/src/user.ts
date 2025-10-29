import { z } from 'zod';

export const UserRoleSchema = z.enum(['owner', 'adult', 'child', 'viewer']);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  locale: z.string().default('en'),
  timezone: z.string().default('UTC'),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserProfileSchema = UserSchema.extend({
  preferences: z.record(z.unknown()).optional(),
  notificationSettings: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    budgetAlerts: z.boolean().default(true),
    transactionReminders: z.boolean().default(true),
  }).optional(),
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
