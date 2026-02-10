/**
 * Utility functions for generating unique codes for entities
 * 
 * Usage Examples:
 * 
 * 1. In a service's create method:
 * ```typescript
 * import { generateDateTimeCode } from '@common/utils';
 * 
 * create(dto: CreatePurchaseDto) {
 *   if (!dto.code) {
 *     dto.code = generateDateTimeCode('PO'); // PO-240210-143055
 *   }
 *   return this.repo.save(dto);
 * }
 * ```
 * 
 * 2. For different entity types:
 * ```typescript
 * // Purchase Order: PO-240210-143055
 * generateDateTimeCode('PO')
 * 
 * // Product: PROD-240210-123456
 * generateCode('PROD')
 * 
 * // Vendor: VEND-000123
 * generateSequentialCode('VEND', lastVendorId + 1)
 * 
 * // Order: ORD-1707580800000
 * generateTimestampCode('ORD')
 * ```
 * 
 * 3. For purchase receipts:
 * ```typescript
 * import { generateReceiptSerialCode } from '@common/utils';
 * 
 * const serialCode = generateReceiptSerialCode(
 *   purchase.code,      // 'PO-240210-143055'
 *   product.code,       // 'PROD-A'
 *   index               // 1
 * ); 
 * // Result: 'PO-240210-143055-PROD-A-001'
 * ```
 */

/**
 * Generate a unique code with a prefix and timestamp
 * @param prefix - The prefix for the code (e.g., 'PO', 'PROD', 'VEND')
 * @param length - The total length of the numeric part (default: 6)
 * @returns A unique code string (e.g., 'PO-240210-123456')
 */
export function generateCode(prefix: string, length: number = 6): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generate random numeric string
  const randomNum = Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
  
  return `${prefix}-${dateStr}-${randomNum}`;
}

/**
 * Generate a sequential code with a prefix and counter
 * @param prefix - The prefix for the code (e.g., 'PO', 'PROD')
 * @param counter - The sequential number
 * @param length - The total length of the counter part (default: 6)
 * @returns A sequential code string (e.g., 'PO-000001')
 */
export function generateSequentialCode(
  prefix: string,
  counter: number,
  length: number = 6,
): string {
  const paddedCounter = counter.toString().padStart(length, '0');
  return `${prefix}-${paddedCounter}`;
}

/**
 * Generate a code based on timestamp only
 * @param prefix - The prefix for the code (e.g., 'PO', 'PROD')
 * @returns A timestamp-based code (e.g., 'PO-1707580800000')
 */
export function generateTimestampCode(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

/**
 * Generate a code with date and time components
 * @param prefix - The prefix for the code
 * @returns A date-time code (e.g., 'PO-20240210-143055')
 */
export function generateDateTimeCode(prefix: string): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${prefix}-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

/**
 * Generate a purchase receipt serial code
 * @param purchaseCode - The purchase order code
 * @param productCode - The product code
 * @param index - The sequential index for this product in the purchase
 * @returns A serial code (e.g., 'PO-240210-123456-PROD-A-001')
 */
export function generateReceiptSerialCode(
  purchaseCode: string,
  productCode: string,
  index: number,
): string {
  const paddedIndex = index.toString().padStart(3, '0');
  return `${purchaseCode}-${productCode}-${paddedIndex}`;
}
