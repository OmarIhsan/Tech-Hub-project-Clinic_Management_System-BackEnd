/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsString, IsDateString, IsEmail } from 'class-validator';

export class CreateDoctorsDto {
  @IsString()
  full_name: string;

  @IsString()
  gender: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsDateString()
  hire_date: string;
}
