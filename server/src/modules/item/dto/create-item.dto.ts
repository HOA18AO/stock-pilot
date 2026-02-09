import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  categoryId!: number;

  @IsOptional()
  @IsString()
  description!: string;
}
