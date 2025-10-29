import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export class TransactionQueries {
  constructor(private client: SupabaseClient<Database>) {}

  async getAll(householdId: string) {
    // TODO: Implement transaction queries with RLS
    throw new Error('Not implemented');
  }

  async create(transaction: any) {
    // TODO: Implement transaction creation
    throw new Error('Not implemented');
  }

  async update(id: string, updates: any) {
    // TODO: Implement transaction updates
    throw new Error('Not implemented');
  }

  async delete(id: string) {
    // TODO: Implement transaction deletion
    throw new Error('Not implemented');
  }
}
