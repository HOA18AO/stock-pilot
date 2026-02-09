import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  active!: boolean;
}
