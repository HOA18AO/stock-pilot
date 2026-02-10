import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiveProductDetailDto {
  @IsNumber()
  purchaseDetailId!: number;

  @IsArray()
  serialCodes!: string[];
}

export class ReceiveProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiveProductDetailDto)
  items!: ReceiveProductDetailDto[];
}
