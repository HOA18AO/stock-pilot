import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'WH001' })
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Main Warehouse' })
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description!: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location!: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active!: boolean;
}
