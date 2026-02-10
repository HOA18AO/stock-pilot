import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product name' })
  name!: string;

  @ApiPropertyOptional({ example: 'PRD001' })
  code?: string;

  @ApiPropertyOptional()
  description!: string | null;

  @ApiPropertyOptional()
  type!: string | null;

  @ApiPropertyOptional({ default: true })
  active!: boolean;
}
