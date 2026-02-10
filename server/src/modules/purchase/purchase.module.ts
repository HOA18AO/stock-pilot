import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '@entities/purchase.entity';
import { PurchaseDetail } from '@entities/purchase-detail.entity';
import { PurchaseReceipt } from '@entities/purchase-receipt.entity';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, PurchaseDetail, PurchaseReceipt]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
