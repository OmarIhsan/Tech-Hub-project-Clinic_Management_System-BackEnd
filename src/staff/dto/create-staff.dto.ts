import { IsDate, IsString, IsEmail, Length } from 'class-validator';
import { Type } from 'class-transformer';

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
}
