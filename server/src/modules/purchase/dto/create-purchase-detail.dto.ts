import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePurchaseReceiptDto } from './create-purchase-receipt.dto';

export class CreatePurchaseDetailDto {
  @IsString()
  productCode!: string;

  @IsNumber()
  @Min(0)
  unitCost!: number;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number; // Tax percentage

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCost?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseReceiptDto)
  receipts?: CreatePurchaseReceiptDto[];
}
