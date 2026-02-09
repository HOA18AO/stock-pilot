import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStockDto {
  @IsOptional()
  @IsNumber()
  productId!: number;

  @IsOptional()
  @IsNumber()
  itemId!: number;

  @IsOptional()
  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsString()
  unit!: string;
}
