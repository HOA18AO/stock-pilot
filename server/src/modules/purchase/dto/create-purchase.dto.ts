import {
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PURCHASE_STATUS,
  PURCHASE_STATUS_LIST,
} from '../../../common/constants/purchase_statuses';
import {
  PURCHASE_TYPES,
  PURCHASE_TYPES_LIST,
} from '../../../common/constants/purchase_types';
import { CreatePurchaseDetailDto } from './create-purchase-detail.dto';

export class CreatePurchaseDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsIn(Object.values(PURCHASE_TYPES))
  type!: PURCHASE_TYPES_LIST;

  @IsString()
  vendorCode!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  finalAmount?: number;

  @IsOptional()
  @IsIn(Object.values(PURCHASE_STATUS))
  status?: PURCHASE_STATUS_LIST;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseDetailDto)
  purchaseDetails?: CreatePurchaseDetailDto[];
}
