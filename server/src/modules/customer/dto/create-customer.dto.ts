import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CUSTOMER_TYPES, CustomerType } from '../../../common/constants/customer_types';

export class CreateCustomerDto {
  @ApiProperty({ example: 'CUS001' })
  code: string;

  @ApiProperty({ example: 'Customer name' })
  name: string;

  @ApiPropertyOptional()
  email!: string | null;

  @ApiPropertyOptional()
  mobile!: string | null;

  @ApiPropertyOptional({ enum: CUSTOMER_TYPES, example: 'b2b' })
  type!: CustomerType | null;
}
