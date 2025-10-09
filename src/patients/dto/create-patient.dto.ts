/* eslint-disable prettier/prettier */
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  Length,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @Length(2, 50)
  full_name: string;

  @IsString()
  @Length(1, 10)
  gender: string;

  @IsDateString()
  date_of_birth: string;

  @IsString()
  @Length(5, 15)
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  address?: string;
}
