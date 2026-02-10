/**
 * Code Generator Utility - Usage Examples
 * 
 * This file demonstrates how to use the code generator utilities
 * in different service files for auto-generating entity codes.
 */

import {
  generateCode,
  generateSequentialCode,
  generateTimestampCode,
  generateDateTimeCode,
  generateReceiptSerialCode,
} from './code-generator.util';

// ============================================================
// Example 1: Purchase Order Service
// ============================================================
export class PurchaseServiceExample {
  createPurchase(dto: any) {
    // Auto-generate purchase order code if not provided
    if (!dto.code) {
      dto.code = generateDateTimeCode('PO');
      // Result: PO-240210-143055 (PO-YYMMDD-HHMMSS)
    }
    
    // Create purchase...
    return dto;
  }
}

// ============================================================
// Example 2: Product Service
// ============================================================
export class ProductServiceExample {
  createProduct(dto: any) {
    // Auto-generate product code if not provided
    if (!dto.code) {
      dto.code = generateCode('PROD', 4);
      // Result: PROD-240210-1234 (PROD-YYMMDD-XXXX)
    }
    
    // Create product...
    return dto;
  }
}

// ============================================================
// Example 3: Vendor Service with Sequential Codes
// ============================================================
export class VendorServiceExample {
  async createVendor(dto: any) {
    // Auto-generate sequential vendor code
    if (!dto.code) {
      const lastVendorId = 42; // From database query
      dto.code = generateSequentialCode('VEND', lastVendorId + 1, 6);
      // Result: VEND-000043
    }
    
    // Create vendor...
    return dto;
  }
}

// ============================================================
// Example 4: Order Service with Timestamp
// ============================================================
export class OrderServiceExample {
  createOrder(dto: any) {
    // Auto-generate order code using timestamp
    if (!dto.code) {
      dto.code = generateTimestampCode('ORD');
      // Result: ORD-1707580800000 (Unix timestamp)
    }
    
    // Create order...
    return dto;
  }
}

// ============================================================
// Example 5: Purchase Receipt Serial Codes
// ============================================================
export class PurchaseDetailServiceExample {
  createPurchaseReceipts(
    purchaseCode: string,
    productCode: string,
    quantity: number,
  ) {
    const receipts: Array<{ serialCode: string; quantity: number }> = [];
    
    // Generate serial codes for each item
    for (let i = 0; i < quantity; i++) {
      const serialCode = generateReceiptSerialCode(
        purchaseCode,  // 'PO-240210-143055'
        productCode,   // 'PROD-A'
        i + 1,         // 1, 2, 3...
      );
      // Result: PO-240210-143055-PROD-A-001, PO-240210-143055-PROD-A-002, etc.
      
      receipts.push({
        serialCode,
        quantity: 1,
      });
    }
    
    return receipts;
  }
}

// ============================================================
// Example 6: Mixed Usage in Complex Service
// ============================================================
export class ComplexServiceExample {
  async createPurchaseWithDetails(dto: any) {
    // 1. Generate purchase order code
    const purchaseCode = generateDateTimeCode('PO');
    
    // 2. Create purchase order
    const purchase = {
      code: purchaseCode,
      vendorCode: dto.vendorCode,
      status: 'pending',
    };
    
    // 3. Create purchase details with receipts
    const details = dto.items.map((item: any, index: number) => {
      // Generate receipts for each quantity
      const receipts: Array<{ serialCode: string; quantity: number }> = [];
      for (let i = 0; i < item.quantity; i++) {
        receipts.push({
          serialCode: generateReceiptSerialCode(
            purchaseCode,
            item.productCode,
            i + 1,
          ),
          quantity: 1,
        });
      }
      
      return {
        productCode: item.productCode,
        unitCost: item.unitCost,
        quantity: item.quantity,
        receipts,
      };
    });
    
    return { purchase, details };
  }
}

// ============================================================
// Example 7: Testing All Generators
// ============================================================
export function testAllGenerators() {
  console.log('Testing Code Generators:');
  console.log('========================\n');
  
  console.log('1. generateCode():');
  console.log('   PROD:', generateCode('PROD', 6));
  console.log('   VEND:', generateCode('VEND', 4));
  console.log('   ITEM:', generateCode('ITEM', 8));
  
  console.log('\n2. generateSequentialCode():');
  console.log('   VEND:', generateSequentialCode('VEND', 1, 6));
  console.log('   VEND:', generateSequentialCode('VEND', 999, 6));
  
  console.log('\n3. generateTimestampCode():');
  console.log('   ORD:', generateTimestampCode('ORD'));
  console.log('   INV:', generateTimestampCode('INV'));
  
  console.log('\n4. generateDateTimeCode():');
  console.log('   PO:', generateDateTimeCode('PO'));
  console.log('   SO:', generateDateTimeCode('SO'));
  
  console.log('\n5. generateReceiptSerialCode():');
  const poCode = generateDateTimeCode('PO');
  console.log('   Serial 1:', generateReceiptSerialCode(poCode, 'PROD-A', 1));
  console.log('   Serial 2:', generateReceiptSerialCode(poCode, 'PROD-A', 2));
  console.log('   Serial 3:', generateReceiptSerialCode(poCode, 'PROD-B', 1));
}

// Uncomment to run tests:
// testAllGenerators();
