# CRUD Endpoints Summary

## Role-Based Access Control

All CRUD endpoints follow this pattern:
- **CREATE (POST)** - Allowed for: `admin`, `manager`
- **READ (GET, GET/:id)** - Allowed for: `admin`, `manager`  
- **UPDATE (PATCH/:id)** - Allowed for: `manager` only
- **DELETE (DELETE/:id)** - Allowed for: `manager` only

## Available CRUD Endpoints

### Core Entities
1. **Category** (`/category`)
   - ✅ Full CRUD
   - Module: `CategoryModule`

2. **Product** (`/product`)
   - ✅ Full CRUD
   - Module: `ProductModule`

3. **Item** (`/item`)
   - ✅ Full CRUD
   - Module: `ItemModule`

4. **Customer** (`/customer`)
   - ✅ Full CRUD
   - Module: `CustomerModule`

5. **Vendor** (`/vendor`)
   - ✅ Full CRUD
   - Module: `VendorModule`

6. **Staff** (`/staff`)
   - ✅ Full CRUD
   - Module: `StaffModule`

7. **User** (`/user`)
   - ✅ Full CRUD
   - Module: `UserModule`
   - Special: CREATE now allows both `admin` and `manager`

### Inventory & Stock
8. **Stock** (`/stock`)
   - ✅ Full CRUD
   - Module: `StockModule`

9. **Inventory** (`/inventory`)
   - ✅ Full CRUD
   - Module: `InventoryModule`

10. **Warehouse** (`/warehouse`) 🆕
    - ✅ Full CRUD
    - Module: `WarehouseModule`

### Orders & Sales
11. **Order** (`/order`)
    - ✅ Full CRUD
    - Module: `OrderModule`

12. **Invoice** (`/invoice`) 🆕
    - ✅ Full CRUD
    - Module: `InvoiceModule`

### Purchasing
13. **Purchase** (`/purchase`)
    - ✅ Full CRUD
    - Module: `PurchaseModule`

## Entities Without Direct CRUD Endpoints

The following entities are typically managed through their parent entities and don't require separate CRUD endpoints:

- **OrderDetail** - Managed via Order
- **OrderFulfillment** - Managed via Order
- **OrderInvoiceMapping** - Managed via Order/Invoice
- **InvoiceDetail** - Managed via Invoice
- **PurchaseDetail** - Managed via Purchase
- **PurchaseReceipt** - Managed via Purchase
- **HistoricalPrice** - Managed via Item
- **Internal** - Could be added if warehouse transfers are needed
- **InternalDetail** - Managed via Internal
- **InternalFulfillment** - Managed via Internal

## Authentication

All endpoints require:
- **JWT Bearer Token** (`@ApiBearerAuth()`)
- **Role-based authorization** (`@Roles()` decorator)

## Summary

- **Total CRUD Modules**: 13
- **New Modules Added**: 2 (Invoice, Warehouse)
- **Updated Modules**: 1 (User - now allows admin to create users)
- All endpoints properly secured with role-based access control
