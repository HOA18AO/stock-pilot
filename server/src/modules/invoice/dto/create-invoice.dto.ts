import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'INV001' })
  @IsString()
  code!: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  originalAmount!: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  tax!: number;

  @ApiProperty({ example: 1100 })
  @IsNumber()
  finalAmount!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description!: string | null;
}
