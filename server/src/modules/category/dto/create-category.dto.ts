import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'CAT001' })
  code!: string;

  @ApiProperty({ example: 'Electronics' })
  name!: string;

  @ApiPropertyOptional({ example: 'Electronic products' })
  description!: string | null;
}
