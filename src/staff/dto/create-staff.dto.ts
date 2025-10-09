/* eslint-disable prettier/prettier */
import {
  IsDate,
  IsString,
  IsEmail,
  Length,
  IsOptional,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StaffRole } from 'src/common/enums/status.enums';

export class CreateStaffDto {
  @IsString()
  @Length(2, 100)
  full_name: string;

  @IsString()
  @Length(5, 20)
  phone: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  hire_date: Date;

  @IsEnum(StaffRole)
  @IsOptional()
  role?: StaffRole;

  @IsString()
  @MinLength(6)
  password: string;
}
