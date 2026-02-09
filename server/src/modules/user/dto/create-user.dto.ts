import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsIn,
  IsBoolean,
  IsOptional,
  MinLength,
} from 'class-validator';
import { USER_ROLES, UserRole } from '../../../common/constants/user_roles';

export class CreateUserDto {
  @ApiProperty({ example: 'Admin User' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mobile!: string | null;

  @ApiProperty({ example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin123', minLength: 1 })
  @IsString()
  @MinLength(1)
  password: string;

  @ApiProperty({ enum: USER_ROLES, example: 'manager' })
  @IsIn(Object.values(USER_ROLES))
  role: UserRole;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active!: boolean;
}
