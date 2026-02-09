import { IsNumber, IsOptional, IsString, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PURCHASE_STATUS, PURCHASE_STATUS_LIST } from '../../../common/constants/purchase_statuses';
import { PURCHASE_TYPES, PURCHASE_TYPES_LIST } from '../../../common/constants/purchase_types';

export class CreatePurchaseDto {
  @IsOptional()
  @IsNumber()
  vendorId!: number;

  @IsOptional()
  @IsString()
  purchaseCode!: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  purchaseDate!: Date;

  @IsOptional()
  @IsNumber()
  totalAmount!: number;

  @IsOptional()
  @IsIn(Object.values(PURCHASE_STATUS))
  status!: PURCHASE_STATUS_LIST;

  @IsOptional()
  @IsIn(Object.values(PURCHASE_TYPES))
  type!: PURCHASE_TYPES_LIST;

  @IsOptional()
  @IsString()
  notes!: string;
}
