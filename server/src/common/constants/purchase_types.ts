export const PURCHASE_TYPES = {
    PURCHASE: 'purchase',
    RETURN: 'return',
} as const;

export type PURCHASE_TYPES_LIST = (typeof PURCHASE_TYPES)[keyof typeof PURCHASE_TYPES];