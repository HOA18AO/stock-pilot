import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreatePurchaseReceiptDto {
  @IsString()
  serialCode!: string;

  @IsInt()
  @Min(-1)
  @Max(1)
  quantity!: number; // Always 1 or -1
}
