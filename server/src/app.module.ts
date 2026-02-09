import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { CategoryModule } from '@modules/category/category.module';
import { CustomerModule } from '@modules/customer/customer.module';
import { ProductModule } from '@modules/product/product.module';
import { UserModule } from '@modules/user/user.module';
import { VendorModule } from '@modules/vendor/vendor.module';
import { StaffModule } from '@modules/staff/staff.module';
import { ItemModule } from '@modules/item/item.module';
import { StockModule } from '@modules/stock/stock.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { OrderModule } from '@modules/order/order.module';
import { PurchaseModule } from '@modules/purchase/purchase.module';
import { InvoiceModule } from '@modules/invoice/invoice.module';
import { WarehouseModule } from '@modules/warehouse/warehouse.module';
import { AppDataSource } from './database';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      synchronize: process.env.NODE_ENV !== 'production',
      migrationsRun: process.env.NODE_ENV === 'production',
    }),
    AuthModule,
    CategoryModule,
    ProductModule,
    CustomerModule,
    UserModule,
    VendorModule,
    StaffModule,
    ItemModule,
    StockModule,
    InventoryModule,
    OrderModule,
    PurchaseModule,
    InvoiceModule,
    WarehouseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
