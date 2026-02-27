export const PURCHASE_STATUS = {
    DRAFT: 'draft',
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
} as const;

export type PURCHASE_STATUS_LIST = (typeof PURCHASE_STATUS)[keyof typeof PURCHASE_STATUS];