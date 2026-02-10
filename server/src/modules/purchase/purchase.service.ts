import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase } from '@entities/purchase.entity';
import { PurchaseDetail } from '@entities/purchase-detail.entity';
import { PurchaseReceipt } from '@entities/purchase-receipt.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { generateDateTimeCode, generateReceiptSerialCode } from '@common/utils';
import { PURCHASE_STATUS } from '@common/constants/purchase_statuses';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly repo: Repository<Purchase>,
    @InjectRepository(PurchaseDetail)
    private readonly detailRepo: Repository<PurchaseDetail>,
    @InjectRepository(PurchaseReceipt)
    private readonly receiptRepo: Repository<PurchaseReceipt>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreatePurchaseDto) {
    // Auto-generate code if not provided
    if (!dto.code) {
      dto.code = generateDateTimeCode('PO');
    }

    // Set default status if not provided
    if (!dto.status) {
      dto.status = PURCHASE_STATUS.PENDING;
    }

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create and save the purchase
      const purchase = this.repo.create({
        code: dto.code,
        type: dto.type,
        vendorCode: dto.vendorCode,
        originalAmount: dto.originalAmount || 0,
        additionalFee: dto.additionalFee || 0,
        tax: dto.tax || 0,
        finalAmount: dto.finalAmount || 0,
        status: dto.status,
        description: dto.description || null,
      });

      const savedPurchase = await queryRunner.manager.save(purchase);

      // 2. Create purchase details and receipts if provided
      if (dto.purchaseDetails && dto.purchaseDetails.length > 0) {
        for (const detailDto of dto.purchaseDetails) {
          // Calculate totalCost if not provided
          const baseAmount = detailDto.unitCost * detailDto.quantity;
          const feeAmount = detailDto.additionalFee || 0;
          const taxAmount = baseAmount * ((detailDto.tax || 0) / 100);
          const totalCost = detailDto.totalCost || baseAmount + feeAmount + taxAmount;

          // Create purchase detail
          const detail = this.detailRepo.create({
            purchaseId: savedPurchase.id,
            productCode: detailDto.productCode,
            unitCost: detailDto.unitCost,
            quantity: detailDto.quantity,
            additionalFee: detailDto.additionalFee || 0,
            tax: detailDto.tax || 0,
            totalCost,
            description: detailDto.description || null,
          });

          const savedDetail = await queryRunner.manager.save(detail);

          // 3. Create purchase receipts
          if (detailDto.receipts && detailDto.receipts.length > 0) {
            // Use provided receipts
            for (const receiptDto of detailDto.receipts) {
              const receipt = this.receiptRepo.create({
                purchaseCode: savedPurchase.code,
                purchaseDetailId: savedDetail.id,
                serialCode: receiptDto.serialCode,
                quantity: receiptDto.quantity,
              });
              await queryRunner.manager.save(receipt);
            }
          } else {
            // Auto-generate receipts for normal purchases (quantity = 1)
            if (dto.type === 'purchase') {
              for (let i = 0; i < detailDto.quantity; i++) {
                const serialCode = generateReceiptSerialCode(
                  savedPurchase.code,
                  detailDto.productCode,
                  i + 1,
                );
                const receipt = this.receiptRepo.create({
                  purchaseCode: savedPurchase.code,
                  purchaseDetailId: savedDetail.id,
                  serialCode,
                  quantity: 1,
                });
                await queryRunner.manager.save(receipt);
              }
            }
          }
        }
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      // Return the created purchase with relations
      return this.findOne(savedPurchase.id);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  findAll() {
    return this.repo.find({
      order: { id: 'ASC' },
      relations: ['vendor', 'purchaseDetails'],
    });
  }

  async findOne(id: number) {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['vendor', 'purchaseDetails'],
    });
    if (!entity) throw new NotFoundException('Purchase #' + id + ' not found');
    return entity;
  }

  async update(id: number, dto: UpdatePurchaseDto) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    await this.repo.remove(entity);
    return entity;
  }
}
