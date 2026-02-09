export const TRANSACTION_TYPES = {
    IN: 'IN',
    OUT: 'OUT'
}

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];