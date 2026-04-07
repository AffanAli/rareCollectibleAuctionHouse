import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { UserRole } from 'src/database/enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  contactPhone?: string;

  @IsOptional()
  @IsObject()
  preferencesJson?: Record<string, unknown>;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
