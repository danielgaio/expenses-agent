import { create } from 'zustand';

interface Transaction {
  id: string;
  type: 'expense' | 'income' | 'investment';
  amount: number;
  currency: string;
  date: string;
  category?: string;
  merchant?: string;
  notes?: string;
  status: 'realized' | 'planned';
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));
