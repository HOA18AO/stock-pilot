import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { TRANSACTION_TYPES, TransactionType } from '../../../common/constants/transaction_types';

export class CreateInventoryDto {
  @IsOptional()
  @IsString()
  serialCode!: string;

  @IsOptional()
  @IsNumber()
  cost!: number;

  @IsOptional()
  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsString()
  unit!: string;

  @IsOptional()
  @IsIn(Object.values(TRANSACTION_TYPES))
  transactionType!: TransactionType;

  @IsOptional()
  @IsString()
  description!: string;
}
