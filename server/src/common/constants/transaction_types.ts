export const TRANSACTION_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
} as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];
