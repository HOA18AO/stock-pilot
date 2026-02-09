export const INTERNAL_TYPES = {
  DROPPING: 'dropping',
  SWAPPING: 'swapping',
} as const;

export type InternalType = (typeof INTERNAL_TYPES)[keyof typeof INTERNAL_TYPES];
