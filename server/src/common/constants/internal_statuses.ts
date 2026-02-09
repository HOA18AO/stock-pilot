export const INTERNAL_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
} as const;

export type InternalStatus = (typeof INTERNAL_STATUSES)[keyof typeof INTERNAL_STATUSES];
