import { IsNumber, IsOptional, IsString, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ORDER_STATUSES, OrderStatus } from '../../../common/constants/order_statuses';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  customerId!: number;

  @IsOptional()
  @IsNumber()
  staffId!: number;

  @IsOptional()
  @IsString()
  orderCode!: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  orderDate!: Date;

  @IsOptional()
  @IsNumber()
  totalAmount!: number;

  @IsOptional()
  @IsIn(Object.values(ORDER_STATUSES))
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  notes!: string;
}
