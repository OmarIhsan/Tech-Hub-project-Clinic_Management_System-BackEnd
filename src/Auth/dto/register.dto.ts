/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { StaffRole } from 'src/common/enums/status.enums';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  full_name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  phone: string;

  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole = StaffRole.CUSTUMER;
}
