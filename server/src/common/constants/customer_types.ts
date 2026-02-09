export const CUSTOMER_TYPES = {
    B2B: 'b2b',
    B2C: 'b2c',
} as const

export type CustomerType = (typeof CUSTOMER_TYPES)[keyof typeof CUSTOMER_TYPES];
// export {CUSTOMER_TYPES}