import { IsString, IsOptional } from 'class-validator';

export class CreateVendorDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description!: string;
}
